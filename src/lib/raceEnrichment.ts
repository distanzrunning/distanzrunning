// src/lib/raceEnrichment.ts
//
// Wikipedia enrichment pipeline for race guides (Plan 017, slice 1).
// Sibling of raceDateRefresh.ts, same shape: scan → write read-only
// per-field suggestions with source quote + confidence → the admin
// Enrichment page approves/rejects → approve patches the real field.
//
// Slice-1 fields: the four course records (time / athlete / IOC
// country each) + field size — the data Wikipedia is genuinely
// authoritative for, at zero scraping cost via the MediaWiki API.
//
// Discovery is multi-language by design: many races only have an
// article on their home-country edition (Sparkasse 3-Länder-Marathon
// exists solely on de.wikipedia, records in the infobox's
// `Streckenrekord` param). We search en + the country's edition(s),
// score candidates by title-token overlap, and let Haiku's
// page_is_this_race guard reject look-alikes (falling through to the
// next candidate).

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "next-sanity";

import { IOC_COUNTRY_CODES } from "@/lib/iocCountries";

const FETCH_TIMEOUT_MS = 8_000;
const SCAN_OVERALL_TIMEOUT_MS = 50_000;
// Full-wikitext budget. Most race articles are 15–40 K chars; pages
// over budget (Boston: 97 K, records at char 23 K) fall back to
// lead + keyword windows so the record tables still make it in.
const MAX_WIKITEXT_CHARS = 60_000;
const LEAD_CHARS = 20_000;
const KEYWORD_WINDOW_CHARS = 6_000;
const KEYWORD_WINDOW_LIMIT = 8;
// How many discovery candidates Haiku may veto before we give up.
const MAX_PAGE_ATTEMPTS = 2;
// Companion winners-list page ("List of winners of the Berlin
// Marathon") budget. Tables are uniform, so over-budget pages keep
// head + tail halves (records can sit in either the prose lead or
// the newest rows at the bottom).
const MAX_COMPANION_CHARS = 40_000;

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ---------------------------------------------------------------------------
// Enrichable fields
// ---------------------------------------------------------------------------

export type RecordGroupKey =
  | "mens"
  | "womens"
  | "mensWheelchair"
  | "womensWheelchair";

interface RecordGroupDef {
  key: RecordGroupKey;
  label: string;
  timeField: string;
  athleteField: string;
  countryField: string;
}

export const RECORD_GROUPS: RecordGroupDef[] = [
  {
    key: "mens",
    label: "Men's course record",
    timeField: "mensCourseRecord",
    athleteField: "mensCourseRecordAthlete",
    countryField: "mensCourseRecordCountry",
  },
  {
    key: "womens",
    label: "Women's course record",
    timeField: "womensCourseRecord",
    athleteField: "womensCourseRecordAthlete",
    countryField: "womensCourseRecordCountry",
  },
  {
    key: "mensWheelchair",
    label: "Men's wheelchair course record",
    timeField: "mensWheelchairCourseRecord",
    athleteField: "mensWheelchairCourseRecordAthlete",
    countryField: "mensWheelchairCourseRecordCountry",
  },
  {
    key: "womensWheelchair",
    label: "Women's wheelchair course record",
    timeField: "womensWheelchairCourseRecord",
    athleteField: "womensWheelchairCourseRecordAthlete",
    countryField: "womensWheelchairCourseRecordCountry",
  },
];

/** Every raceGuide field the enrichment pipeline may suggest for,
 *  with the display label the admin UI and Studio previews use.
 *  fieldSize is the one non-string field — approve casts it. */
export const ENRICHABLE_FIELD_LABELS: Record<string, string> = {
  ...Object.fromEntries(
    RECORD_GROUPS.flatMap((g) => [
      [g.timeField, `${g.label} — time`],
      [g.athleteField, `${g.label} — athlete`],
      [g.countryField, `${g.label} — country`],
    ]),
  ),
  fieldSize: "Field size",
};

export const NUMERIC_ENRICHABLE_FIELDS = new Set(["fieldSize"]);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EnrichableRace {
  _id: string;
  title: string;
  city?: string;
  country?: string;
  wikipediaUrl?: string;
  enrichmentSuggestions?: EnrichmentSuggestion[];
  /** Current values of every enrichable field, for diffing. */
  current: Record<string, string | number | undefined>;
}

export interface EnrichmentSuggestion {
  _key: string;
  _type: "enrichmentSuggestion";
  field: string;
  label: string;
  value: string;
  currentValue?: string;
  sourceUrl?: string;
  sourceQuote?: string;
  confidence?: "high" | "medium";
  scrapedAt?: string;
  status: "pending" | "rejected";
}

export interface EnrichmentResult {
  _id: string;
  title: string;
  status:
    | "suggested"
    | "no_changes"
    | "page_not_found"
    | "fetch_error"
    | "extract_error";
  message?: string;
  /** Fields a fresh pending suggestion was written for. */
  suggestedFields: string[];
  /** Fields whose scraped value already matches the doc. */
  unchangedFields: string[];
  pageUrl?: string;
  /** Full scan log — also persisted to enrichmentLastScanLog on
   *  non-dry runs; carried here so dryRun callers can see per-field
   *  outcomes without a Sanity write. */
  log?: EnrichmentScanLog;
}

interface FieldOutcome {
  field: string;
  outcome:
    | "suggested"
    | "unchanged"
    | "invalid"
    | "matches_rejected"
    | "not_found";
  value?: string;
  message?: string;
}

export interface EnrichmentScanLog {
  scannedAt: string;
  durationMs: number;
  languagesSearched: string[];
  candidates: { title: string; lang: string; score: number }[];
  pagesTried: {
    url: string;
    verdict: "accepted" | "vetoed" | "fetch_error" | "companion";
  }[];
  pageUrl?: string;
  companionUrl?: string;
  wikitextChars?: number;
  truncated?: boolean;
  extractionReasoning?: string;
  fields: FieldOutcome[];
  finalStatus: EnrichmentResult["status"];
  finalMessage?: string;
}

// ---------------------------------------------------------------------------
// Wikipedia API
// ---------------------------------------------------------------------------

const WIKI_HEADERS = {
  "User-Agent":
    "DistanzRunningEnrichment/1.0 (https://distanzrunning.com; info@distanzrunning.com)",
};

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: WIKI_HEADERS,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Language editions worth searching for a race in this country,
 *  beyond en. Multi-entry for multilingual countries. Missing
 *  countries just search en — the big-race common case. */
const COUNTRY_LANGS: Record<string, string[]> = {
  Germany: ["de"],
  Austria: ["de"],
  Switzerland: ["de", "fr"],
  France: ["fr"],
  Belgium: ["fr", "nl"],
  Netherlands: ["nl"],
  Spain: ["es"],
  Mexico: ["es"],
  Argentina: ["es"],
  Chile: ["es"],
  Colombia: ["es"],
  Portugal: ["pt"],
  Brazil: ["pt"],
  Italy: ["it"],
  Denmark: ["da"],
  Norway: ["no"],
  Sweden: ["sv"],
  Finland: ["fi"],
  Poland: ["pl"],
  "Czech Republic": ["cs"],
  Czechia: ["cs"],
  Hungary: ["hu"],
  Turkey: ["tr"],
  Greece: ["el"],
  Russia: ["ru"],
  Ukraine: ["uk"],
  Japan: ["ja"],
  China: ["zh"],
  Taiwan: ["zh"],
  "Hong Kong": ["zh"],
  "South Korea": ["ko"],
  Thailand: ["th"],
  Vietnam: ["vi"],
  Indonesia: ["id"],
  Israel: ["he"],
  Qatar: ["ar"],
  "United Arab Emirates": ["ar"],
  "Saudi Arabia": ["ar"],
  Egypt: ["ar"],
  Morocco: ["ar", "fr"],
};

function languagesFor(country: string | undefined): string[] {
  const extra = country ? (COUNTRY_LANGS[country] ?? []) : [];
  return [...new Set(["en", ...extra])];
}

interface PageCandidate {
  title: string;
  lang: string;
  score: number;
}

function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    // Split digit/letter boundaries so "20km" tokenizes like
    // "20 km" — Wikipedia titles space the unit ("20 km of
    // Brussels") while race titles often don't ("20km of
    // Brussels"), and without this the tokens never overlap.
    .replace(/(\d)([a-z])/g, "$1 $2")
    .replace(/([a-z])(\d)/g, "$1 $2")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Human-readable digit-split variant of a title ("20km of
 *  Brussels" → "20 km of Brussels") for a second search pass —
 *  Wikipedia's search engine itself misses the unspaced form on
 *  some editions. */
function digitSplitTitle(s: string): string {
  return s
    .replace(/(\d)([A-Za-z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2");
}

/** Token-overlap score between the race title and a page title.
 *  Sponsor prefixes ("Sparkasse …") and suffixes shift tokens but
 *  overlap still ranks the right page first; a small penalty for
 *  unmatched page-title tokens demotes near-miss sibling articles
 *  ("List of winners of the Berlin Marathon"). */
function scoreCandidate(raceTitle: string, pageTitle: string): number {
  const raceTokens = new Set(normalizeForMatch(raceTitle).split(" "));
  const pageTokens = new Set(normalizeForMatch(pageTitle).split(" "));
  let hits = 0;
  for (const t of raceTokens) if (pageTokens.has(t)) hits += 1;
  const misses = pageTokens.size - hits;
  return hits * 4 - misses;
}

/** Raw search: page titles for a query on one language edition. */
async function rawSearch(lang: string, query: string): Promise<string[]> {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=query&list=search` +
    `&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&formatversion=2`;
  try {
    const data = (await fetchJson(url)) as {
      query?: { search?: { title: string }[] };
    };
    return (data.query?.search ?? []).map((s) => s.title);
  } catch {
    return [];
  }
}

async function searchLanguage(
  lang: string,
  raceTitle: string,
): Promise<PageCandidate[]> {
  // Query both the raw title and its digit-split variant when they
  // differ — en.wikipedia's search misses "20km of Brussels" but
  // finds "20 km of Brussels".
  const queries = [...new Set([raceTitle, digitSplitTitle(raceTitle)])];
  const perQuery = await Promise.all(
    queries.map((q) => rawSearch(lang, q)),
  );
  const seen = new Set<string>();
  const merged: PageCandidate[] = [];
  for (const title of perQuery.flat()) {
    if (seen.has(title)) continue;
    seen.add(title);
    merged.push({
      title,
      lang,
      score: scoreCandidate(raceTitle, title),
    });
  }
  return merged;
}

function pageUrlFor(lang: string, title: string): string {
  return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(
    title.replace(/ /g, "_"),
  )}`;
}

/** Parse a pinned wikipediaUrl back into {lang, title}. */
function parseWikipediaUrl(
  url: string,
): { lang: string; title: string } | null {
  const m = url.match(
    /^https?:\/\/([a-z-]+)\.(?:m\.)?wikipedia\.org\/wiki\/([^#?]+)/i,
  );
  if (!m) return null;
  return {
    lang: m[1].replace(/\.m$/, ""),
    title: decodeURIComponent(m[2]).replace(/_/g, " "),
  };
}

async function fetchWikitext(
  lang: string,
  title: string,
): Promise<{ wikitext: string; canonicalTitle: string }> {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=parse` +
    `&page=${encodeURIComponent(title)}&prop=wikitext&redirects=1&format=json&formatversion=2`;
  const data = (await fetchJson(url)) as {
    parse?: { title: string; wikitext: string };
    error?: { info?: string };
  };
  if (!data.parse) {
    throw new Error(data.error?.info ?? `No parse result for ${title}`);
  }
  return { wikitext: data.parse.wikitext, canonicalTitle: data.parse.title };
}

/** Fit the wikitext into budget. Small pages pass whole; big pages
 *  keep the lead (infobox included) + windows around record/winner
 *  keyword hits so deep record tables survive the cut. */
function budgetWikitext(wikitext: string): {
  text: string;
  truncated: boolean;
} {
  if (wikitext.length <= MAX_WIKITEXT_CHARS) {
    return { text: wikitext, truncated: false };
  }
  const pieces: string[] = [wikitext.slice(0, LEAD_CHARS)];
  const re =
    /record|rekord|course|strecken|sieger|winner|champion|statisti|wheelchair|rollstuhl|teilnehmer|participant|finisher/gi;
  const windows: [number, number][] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(wikitext)) !== null && windows.length < 200) {
    const start = Math.max(LEAD_CHARS, m.index - KEYWORD_WINDOW_CHARS / 2);
    const end = Math.min(wikitext.length, m.index + KEYWORD_WINDOW_CHARS / 2);
    if (end <= LEAD_CHARS) continue;
    const last = windows[windows.length - 1];
    if (last && start <= last[1]) {
      last[1] = end; // merge overlapping windows
    } else {
      windows.push([start, end]);
    }
  }
  for (const [start, end] of windows.slice(0, KEYWORD_WINDOW_LIMIT)) {
    pieces.push(`\n\n[… truncated …]\n\n${wikitext.slice(start, end)}`);
  }
  return { text: pieces.join(""), truncated: true };
}

// ---------------------------------------------------------------------------
// Companion winners-list pages
// ---------------------------------------------------------------------------

const LIST_KEYWORD_RE =
  /(list|liste|lista|sieger|winners?|champions?|palmar|vainqueur|winnaars|uitslagen)/i;

/** Significant tokens of a title (3+ chars — skips "of"/"the"). */
function significantTokens(title: string): string[] {
  return normalizeForMatch(title)
    .split(" ")
    .filter((t) => t.length >= 3);
}

/** Find and fetch the race's companion winners-list page
 *  ("List of winners of the Berlin Marathon" — full winners tables
 *  with times AND flag-templated nationalities the main article
 *  often omits). Main articles don't reliably wiki-link their list
 *  page (Berlin's doesn't), so discovery is a direct title probe
 *  plus a search, filtered to titles that carry a list/winners
 *  keyword AND every significant main-title token. Returns null
 *  when the race has no such page — the common case. */
async function fetchCompanionPage(
  lang: string,
  canonicalTitle: string,
): Promise<{ title: string; url: string; text: string } | null> {
  const probes =
    lang === "en" ? [`List of winners of the ${canonicalTitle}`] : [];
  const searched = await rawSearch(
    lang,
    `list of winners ${canonicalTitle}`,
  );
  const mainTokens = significantTokens(canonicalTitle);
  const fromSearch = searched.filter((t) => {
    if (t === canonicalTitle) return false;
    if (!LIST_KEYWORD_RE.test(t)) return false;
    const tokens = new Set(normalizeForMatch(t).split(" "));
    return mainTokens.every((tok) => tokens.has(tok));
  });
  const candidates = [...new Set([...probes, ...fromSearch])].slice(0, 2);

  for (const title of candidates) {
    try {
      const { wikitext, canonicalTitle: resolved } = await fetchWikitext(
        lang,
        title,
      );
      // A probe can resolve through a redirect back to the main
      // article — that's not a companion.
      if (resolved === canonicalTitle) continue;
      const text =
        wikitext.length <= MAX_COMPANION_CHARS
          ? wikitext
          : `${wikitext.slice(0, MAX_COMPANION_CHARS / 2)}\n\n[… truncated …]\n\n${wikitext.slice(-MAX_COMPANION_CHARS / 2)}`;
      return { title: resolved, url: pageUrlFor(lang, resolved), text };
    } catch {
      continue;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Extraction
// ---------------------------------------------------------------------------

interface ExtractedRecord {
  time: string | null;
  athlete: string | null;
  country: string | null;
  source_quote: string | null;
  source_page: "main" | "winners_list";
  confidence: "high" | "medium" | "low";
}

interface ExtractionResult {
  page_is_this_race: boolean;
  records: {
    mens: ExtractedRecord | null;
    womens: ExtractedRecord | null;
    mens_wheelchair: ExtractedRecord | null;
    womens_wheelchair: ExtractedRecord | null;
  };
  field_size: {
    value: number | null;
    source_quote: string | null;
    source_page?: "main" | "winners_list";
    confidence: "high" | "medium" | "low";
  } | null;
  reasoning: string;
}

interface ExtractionPage {
  role: "main" | "winners_list";
  title: string;
  url: string;
  text: string;
}

const RECORD_JSON_SHAPE = `{
  "time": "H:MM:SS",
  "athlete": "Full Name",
  "country": "IOC 3-letter code",
  "source_quote": "verbatim wikitext phrase the record came from",
  "source_page": "main" | "winners_list",
  "confidence": "high" | "medium" | "low"
} or null if this record is not stated`;

async function extractFromWikitext(
  race: EnrichableRace,
  pages: ExtractionPage[],
): Promise<ExtractionResult> {
  const main = pages.find((p) => p.role === "main")!;
  const winners = pages.find((p) => p.role === "winners_list");
  const prompt = `You are extracting structured race data from Wikipedia raw wikitext.

Race we are researching:
- Name: ${race.title}
- Location: ${[race.city, race.country].filter(Boolean).join(", ") || "unknown"}

You are given ${pages.length === 1 ? "one page" : "two pages"}:
- MAIN ARTICLE: "${main.title}" (${main.url})${
    winners
      ? `\n- WINNERS LIST: "${winners.title}" (${winners.url}) — a companion page with the race's full winners tables (year, athlete, nationality flag, time), and often an explicit course-records statement in its lead`
      : ""
  }

TASK 1 — page identity check. Set "page_is_this_race" to true only if the MAIN ARTICLE is about THIS race event (any language). Sponsor-name differences are fine ("Sparkasse 3-Länder-Marathon" IS "3-Länder-Marathon"). An article about a different race, a city, an athlete, or a disambiguation page → false, and return null for everything else.

TASK 2 — course records. Extract the CURRENT course record for each division stated in the material: men's, women's, men's wheelchair, women's wheelchair. Records commonly live in an infobox param (course record / Streckenrekord / record), a statistics/records section, or the winners list's lead/tables.
- The course record is the FASTEST time ever run for that division at THIS race — NOT the most recent winner's time. In a winners table, that means the minimum time in the column (winners lists usually bold or footnote it); prefer an explicit "course record" statement over your own table scan when one exists.
- When both pages state a record, cross-check them; if they disagree, use the explicit records statement and note the conflict in "reasoning".
- "source_page": which page the record came from ("main" or "winners_list").
- "time": normalize to H:MM:SS or HH:MM:SS (e.g. "2:09:15", "58:42" becomes "0:58:42").
- "athlete": the record holder's full name in Latin script if given.
- "country": the athlete's nationality as an IOC 3-letter code (KEN, ETH, GBR, USA, SUI, GER, JPN …) — ONLY when the given material states the nationality (a flag/country template like {{KEN|…}} or {{flagathlete|…}} next to the athlete — winners-table flag templates count, including on the row of the record run — or explicit prose). Wikipedia country templates vary by language edition ({{SWI|…}} = Switzerland = SUI) — always output the IOC code, converting if needed. If the material does not state the record holder's nationality, return null for country — NEVER fill it from your own knowledge of the athlete, even when you are confident.
- "source_quote": short verbatim snippet from the wikitext where the record is stated.
- Use the newest record if the article lists several years. A division the article doesn't state → null. NEVER carry a record over from a different race or distance (a half-marathon article's record must be a half-marathon time).
- confidence: "high" = explicitly stated for this race in infobox/records section; "medium" = stated but indirectly (e.g. only in prose or a winners table you had to reason over); "low" = uncertain — prefer null over low-confidence guesses.

TASK 3 — field size. If the material states the number of participants/finishers/capacity of a recent edition ("Teilnehmer", "runners", "finishers"), return it as an integer with quote + confidence, else null. Prefer registered/started participants of the most recent edition over historic totals.

Output STRICT JSON only — no markdown fences, no prose:

{
  "page_is_this_race": true | false,
  "records": {
    "mens": ${RECORD_JSON_SHAPE},
    "womens": ${RECORD_JSON_SHAPE},
    "mens_wheelchair": ${RECORD_JSON_SHAPE},
    "womens_wheelchair": ${RECORD_JSON_SHAPE}
  },
  "field_size": { "value": 12345, "source_quote": "…", "source_page": "main" | "winners_list", "confidence": "high" | "medium" | "low" } or null,
  "reasoning": "one or two short sentences"
}

${pages
  .map(
    (p) =>
      `=== ${p.role === "main" ? "MAIN ARTICLE" : "WINNERS LIST"}: ${p.title} ===\n${p.text}`,
  )
  .join("\n\n")}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const block = response.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected response block type");
  }
  const jsonText = block.text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  return JSON.parse(jsonText) as ExtractionResult;
}

// ---------------------------------------------------------------------------
// Validation + normalization
// ---------------------------------------------------------------------------

/** Normalize a race time to zero-padded HH:MM:SS — the format the
 *  existing course-record data uses ("02:09:15"). Accepts H:MM:SS,
 *  HH:MM:SS, or MM:SS (sub-hour records). Returns null on junk. */
export function normalizeRecordTime(raw: string): string | null {
  const m = raw.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  let h: number, min: number, s: number;
  if (m[3] !== undefined) {
    [h, min, s] = [Number(m[1]), Number(m[2]), Number(m[3])];
  } else {
    // MM:SS — a sub-hour time (world-class half splits aside, this
    // only really occurs for short races; keep it valid).
    [h, min, s] = [0, Number(m[1]), Number(m[2])];
  }
  if (min > 59 || s > 59 || h > 23) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(min)}:${pad(s)}`;
}

/** Loose equality for diffing scraped values against the doc:
 *  trims (existing data carries stray tabs), case-folds, and
 *  normalizes times so "2:09:15" == "02:09:15\t". */
function valuesEqual(field: string, a: string, b: string): boolean {
  const ta = a.trim();
  const tb = b.trim();
  if (/CourseRecord$/.test(field)) {
    const na = normalizeRecordTime(ta);
    const nb = normalizeRecordTime(tb);
    if (na && nb) return na === nb;
  }
  return ta.localeCompare(tb, undefined, { sensitivity: "accent" }) === 0;
}

// ---------------------------------------------------------------------------
// Scan
// ---------------------------------------------------------------------------

export async function processRaceEnrichment(
  race: EnrichableRace,
  options: { dryRun: boolean },
): Promise<EnrichmentResult> {
  // Keep the watchdog handle so it can be cleared once the scan
  // resolves — an orphaned 50 s timer holds the process (and a
  // serverless function) open doing nothing.
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      processRaceEnrichmentInner(race, options),
      new Promise<EnrichmentResult>((resolve) => {
        timer = setTimeout(
          () =>
            resolve({
              _id: race._id,
              title: race.title,
              status: "fetch_error",
              message: `Scan exceeded ${Math.round(SCAN_OVERALL_TIMEOUT_MS / 1000)}s budget`,
              suggestedFields: [],
              unchangedFields: [],
            }),
          SCAN_OVERALL_TIMEOUT_MS,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function processRaceEnrichmentInner(
  race: EnrichableRace,
  options: { dryRun: boolean },
): Promise<EnrichmentResult> {
  const startedAt = Date.now();
  const startedAtIso = new Date(startedAt).toISOString();
  const log: EnrichmentScanLog = {
    scannedAt: startedAtIso,
    durationMs: 0,
    languagesSearched: [],
    candidates: [],
    pagesTried: [],
    fields: [],
    finalStatus: "fetch_error",
  };

  // Single finalize path — persists the scan log on every attempt
  // and, when there are fresh suggestions, merges them into the
  // suggestions array (see mergeSuggestions for the replace/keep
  // rules).
  const finalize = async (
    result: EnrichmentResult,
    freshSuggestions: EnrichmentSuggestion[] = [],
    discoveredPageUrl?: string,
  ): Promise<EnrichmentResult> => {
    log.durationMs = Date.now() - startedAt;
    log.finalStatus = result.status;
    log.finalMessage = result.message;
    if (!options.dryRun) {
      const patch: Record<string, unknown> = {
        enrichmentLastScanAt: startedAtIso,
        enrichmentLastScanLog: JSON.stringify(log),
      };
      if (freshSuggestions.length > 0) {
        patch.enrichmentSuggestions = mergeSuggestions(
          race.enrichmentSuggestions ?? [],
          freshSuggestions,
        );
      }
      // Pin the discovered page so future scans (and the editor)
      // skip discovery. Never overwrite an editor-set URL.
      if (discoveredPageUrl && !race.wikipediaUrl) {
        patch.wikipediaUrl = discoveredPageUrl;
      }
      try {
        await sanityClient.patch(race._id).set(patch).commit();
      } catch (err) {
        console.log(
          `[enrichment] failed to persist scan for ${race.title}: ${(err as Error).message}`,
        );
      }
    }
    return { ...result, log };
  };

  // ── Discovery ─────────────────────────────────────────────────
  // A pinned wikipediaUrl wins outright; otherwise search en + the
  // country's language edition(s) and rank by title-token overlap.
  let candidates: { lang: string; title: string }[] = [];
  const pinned = race.wikipediaUrl ? parseWikipediaUrl(race.wikipediaUrl) : null;
  if (pinned) {
    candidates = [pinned];
  } else {
    const langs = languagesFor(race.country);
    log.languagesSearched = langs;
    const perLang = await Promise.all(
      langs.map((lang) => searchLanguage(lang, race.title)),
    );
    // Minimum score 5 ≈ "at least one strong title-token hit with
    // little unmatched noise". Real matches score ≥ 6 even across
    // languages ("20 km de Bruxelles" for "20km of Brussels");
    // city pages and junk ("Brussels" = 4, "K1 tank" = 2) fall
    // below, so we never spend a Haiku veto on them.
    const scored = perLang
      .flat()
      .filter((c) => c.score >= 5)
      .sort((a, b) => b.score - a.score);
    log.candidates = scored.slice(0, 10);
    candidates = scored.slice(0, MAX_PAGE_ATTEMPTS);
    if (candidates.length === 0) {
      return finalize({
        _id: race._id,
        title: race.title,
        status: "page_not_found",
        message: "No Wikipedia search results matched the race title",
        suggestedFields: [],
        unchangedFields: [],
      });
    }
  }

  // ── Fetch + extract, vetoing wrong pages ──────────────────────
  let extraction: ExtractionResult | null = null;
  let pageUrl = "";
  let companionUrl: string | undefined;
  for (const candidate of candidates) {
    const url = pageUrlFor(candidate.lang, candidate.title);
    let wikitext: string;
    let canonicalTitle: string;
    try {
      ({ wikitext, canonicalTitle } = await fetchWikitext(
        candidate.lang,
        candidate.title,
      ));
    } catch {
      log.pagesTried.push({ url, verdict: "fetch_error" });
      continue;
    }
    const { text, truncated } = budgetWikitext(wikitext);
    log.wikitextChars = wikitext.length;
    log.truncated = truncated;

    // Companion winners-list page ("List of winners of the Berlin
    // Marathon") — fetched optimistically before the identity check
    // (a wasted Wikipedia fetch on a vetoed candidate is cheap; a
    // second Haiku pass wouldn't be). Null for most races.
    const companion = await fetchCompanionPage(
      candidate.lang,
      canonicalTitle,
    );
    const pages: ExtractionPage[] = [
      { role: "main", title: canonicalTitle, url, text },
    ];
    if (companion) {
      pages.push({
        role: "winners_list",
        title: companion.title,
        url: companion.url,
        text: companion.text,
      });
    }

    let attempt: ExtractionResult;
    try {
      attempt = await extractFromWikitext(race, pages);
    } catch (err) {
      return finalize({
        _id: race._id,
        title: race.title,
        status: "extract_error",
        message: (err as Error).message,
        suggestedFields: [],
        unchangedFields: [],
      });
    }
    if (!attempt.page_is_this_race) {
      log.pagesTried.push({ url, verdict: "vetoed" });
      continue;
    }
    log.pagesTried.push({ url, verdict: "accepted" });
    if (companion) {
      log.pagesTried.push({ url: companion.url, verdict: "companion" });
      companionUrl = companion.url;
    }
    log.extractionReasoning = attempt.reasoning;
    extraction = attempt;
    pageUrl = url;
    break;
  }

  if (!extraction) {
    return finalize({
      _id: race._id,
      title: race.title,
      status: "page_not_found",
      message:
        log.pagesTried.length > 0
          ? "Candidate pages were fetched but none matched this race"
          : "Could not fetch any candidate page",
      suggestedFields: [],
      unchangedFields: [],
    });
  }
  log.pageUrl = pageUrl;
  log.companionUrl = companionUrl;

  // ── Explode extraction into per-field candidate values ────────
  // Each value carries the URL of the page it actually came from
  // (main article vs companion winners list) so the review row's
  // source link lands on the right page.
  const urlForSource = (source?: "main" | "winners_list") =>
    source === "winners_list" && companionUrl ? companionUrl : pageUrl;

  const candidatesByField: {
    field: string;
    value: string;
    sourceUrl: string;
    sourceQuote?: string;
    confidence: "high" | "medium" | "low";
  }[] = [];

  const groupKeyMap: Record<
    RecordGroupKey,
    keyof ExtractionResult["records"]
  > = {
    mens: "mens",
    womens: "womens",
    mensWheelchair: "mens_wheelchair",
    womensWheelchair: "womens_wheelchair",
  };

  for (const group of RECORD_GROUPS) {
    const rec = extraction.records?.[groupKeyMap[group.key]];
    if (!rec) continue;
    const sourceUrl = urlForSource(rec.source_page);
    if (rec.time) {
      candidatesByField.push({
        field: group.timeField,
        value: rec.time,
        sourceUrl,
        sourceQuote: rec.source_quote ?? undefined,
        confidence: rec.confidence,
      });
    }
    if (rec.athlete) {
      candidatesByField.push({
        field: group.athleteField,
        value: rec.athlete,
        sourceUrl,
        sourceQuote: rec.source_quote ?? undefined,
        confidence: rec.confidence,
      });
    }
    if (rec.country) {
      candidatesByField.push({
        field: group.countryField,
        value: rec.country.toUpperCase(),
        sourceUrl,
        sourceQuote: rec.source_quote ?? undefined,
        confidence: rec.confidence,
      });
    }
  }
  if (extraction.field_size?.value) {
    candidatesByField.push({
      field: "fieldSize",
      value: String(extraction.field_size.value),
      sourceUrl: urlForSource(extraction.field_size.source_page),
      sourceQuote: extraction.field_size.source_quote ?? undefined,
      confidence: extraction.field_size.confidence,
    });
  }

  // ── Validate, normalize, diff ─────────────────────────────────
  const fresh: EnrichmentSuggestion[] = [];
  const suggestedFields: string[] = [];
  const unchangedFields: string[] = [];
  const existing = race.enrichmentSuggestions ?? [];

  for (const cand of candidatesByField) {
    // Low confidence never reaches the review queue — same policy
    // as the date pipeline (a null costs the editor nothing; a
    // confident-but-wrong value costs a bad publish).
    if (cand.confidence === "low") {
      log.fields.push({
        field: cand.field,
        outcome: "invalid",
        value: cand.value,
        message: "low confidence — dropped",
      });
      continue;
    }

    let value = cand.value;
    if (/CourseRecord$/.test(cand.field)) {
      const normalized = normalizeRecordTime(value);
      if (!normalized) {
        log.fields.push({
          field: cand.field,
          outcome: "invalid",
          value,
          message: "time failed HH:MM:SS validation",
        });
        continue;
      }
      value = normalized;
    }
    if (/Country$/.test(cand.field) && !IOC_COUNTRY_CODES.has(value)) {
      log.fields.push({
        field: cand.field,
        outcome: "invalid",
        value,
        message: "not a known IOC code",
      });
      continue;
    }
    if (cand.field === "fieldSize") {
      const n = Number(value);
      if (!Number.isInteger(n) || n < 50 || n > 2_000_000) {
        log.fields.push({
          field: cand.field,
          outcome: "invalid",
          value,
          message: "implausible field size",
        });
        continue;
      }
    }

    const current = race.current[cand.field];
    const currentStr =
      current === undefined || current === null ? "" : String(current);
    if (currentStr && valuesEqual(cand.field, currentStr, value)) {
      log.fields.push({ field: cand.field, outcome: "unchanged", value });
      unchangedFields.push(cand.field);
      continue;
    }

    // An editor already rejected this exact value → don't nag.
    const rejected = existing.find(
      (s) =>
        s.field === cand.field &&
        s.status === "rejected" &&
        valuesEqual(cand.field, s.value, value),
    );
    if (rejected) {
      log.fields.push({
        field: cand.field,
        outcome: "matches_rejected",
        value,
      });
      continue;
    }

    fresh.push({
      _key: cand.field,
      _type: "enrichmentSuggestion",
      field: cand.field,
      label: ENRICHABLE_FIELD_LABELS[cand.field] ?? cand.field,
      value,
      currentValue: currentStr || undefined,
      sourceUrl: cand.sourceUrl,
      sourceQuote: cand.sourceQuote,
      confidence: cand.confidence,
      scrapedAt: startedAtIso,
      status: "pending",
    });
    log.fields.push({ field: cand.field, outcome: "suggested", value });
    suggestedFields.push(cand.field);
  }

  const status = suggestedFields.length > 0 ? "suggested" : "no_changes";
  return finalize(
    {
      _id: race._id,
      title: race.title,
      status,
      message:
        status === "no_changes"
          ? `Page read OK — ${unchangedFields.length} field(s) already match, nothing new to suggest`
          : undefined,
      suggestedFields,
      unchangedFields,
      pageUrl,
    },
    fresh,
    pageUrl,
  );
}

/** Merge fresh suggestions into the existing array. One entry per
 *  field (_key = field name): a fresh suggestion replaces any prior
 *  entry for its field (pending OR rejected-with-a-different-value —
 *  the rejected-same-value case never reaches here); untouched
 *  entries survive. */
function mergeSuggestions(
  existing: EnrichmentSuggestion[],
  fresh: EnrichmentSuggestion[],
): EnrichmentSuggestion[] {
  const freshFields = new Set(fresh.map((s) => s.field));
  return [...existing.filter((s) => !freshFields.has(s.field)), ...fresh];
}

// ---------------------------------------------------------------------------
// Batch
// ---------------------------------------------------------------------------

// Wikipedia + one Haiku call is far quicker than the date scraper's
// multi-wave site crawl (~5–10 s per race), so the batch can be
// bigger while staying inside the 60 s function ceiling.
export const ENRICHMENT_BATCH_LIMIT = 8;
export const ENRICHMENT_CONCURRENCY = 4;

/** Projection of every enrichable field, shared by the batch query
 *  and the per-race admin action. */
export const ENRICHABLE_RACE_PROJECTION = `{
  _id, title, city, country, wikipediaUrl, enrichmentSuggestions,
  "current": {
    "mensCourseRecord": mensCourseRecord,
    "mensCourseRecordAthlete": mensCourseRecordAthlete,
    "mensCourseRecordCountry": mensCourseRecordCountry,
    "womensCourseRecord": womensCourseRecord,
    "womensCourseRecordAthlete": womensCourseRecordAthlete,
    "womensCourseRecordCountry": womensCourseRecordCountry,
    "mensWheelchairCourseRecord": mensWheelchairCourseRecord,
    "mensWheelchairCourseRecordAthlete": mensWheelchairCourseRecordAthlete,
    "mensWheelchairCourseRecordCountry": mensWheelchairCourseRecordCountry,
    "womensWheelchairCourseRecord": womensWheelchairCourseRecord,
    "womensWheelchairCourseRecordAthlete": womensWheelchairCourseRecordAthlete,
    "womensWheelchairCourseRecordCountry": womensWheelchairCourseRecordCountry,
    "fieldSize": fieldSize
  }
}`;

export interface EnrichmentBatchResult {
  scanned: number;
  dryRun: boolean;
  results: EnrichmentResult[];
}

export async function runBatchEnrichment(options: {
  dryRun: boolean;
}): Promise<EnrichmentBatchResult> {
  // Never-scanned races first, then stalest scan first.
  const query = `*[
    _type == "raceGuide"
    && !(_id in path("drafts.**"))
  ] | order(coalesce(enrichmentLastScanAt, "1970-01-01") asc) [0...$limit] ${ENRICHABLE_RACE_PROJECTION}`;

  const races: EnrichableRace[] = await sanityClient.fetch(query, {
    limit: ENRICHMENT_BATCH_LIMIT,
  });

  const results = await mapWithConcurrency(
    races,
    ENRICHMENT_CONCURRENCY,
    (race) => processRaceEnrichment(race, options),
  );
  return { scanned: races.length, dryRun: options.dryRun, results };
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (true) {
        const i = cursor++;
        if (i >= items.length) return;
        results[i] = await fn(items[i]);
      }
    },
  );
  await Promise.all(workers);
  return results;
}
