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

import { CURRENCY_CODES } from "@/lib/currencies";
import { firecrawlScrape } from "@/lib/firecrawlScrape";
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
  // Official-website source (Firecrawl-rendered).
  startTime: "Start time (race-local)",
  price: "Entry price",
  currency: "Entry price currency",
  expoVenueName: "Expo venue name",
  expoAddress: "Expo address",
};

export const NUMERIC_ENRICHABLE_FIELDS = new Set(["fieldSize", "price"]);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EnrichableRace {
  _id: string;
  title: string;
  city?: string;
  country?: string;
  wikipediaUrl?: string;
  /** Enables the official-website source (start time, entry price,
   *  expo) — scraped through Firecrawl's renderer. */
  officialWebsite?: string;
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
    verdict:
      | "accepted"
      | "vetoed"
      | "fetch_error"
      | "companion"
      | "edition"
      | "official_site";
  }[];
  pageUrl?: string;
  companionUrl?: string;
  websiteChars?: number;
  websiteReasoning?: string;
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
 *  ("List of winners of the Berlin Marathon"). cityForms carries
 *  the race city in every known spelling (English + localized —
 *  "geneva"/"geneve") so a local-language title gets city credit
 *  its raw tokens can't ("20 km de Genève" over "20 km de
 *  Lausanne"). */
function scoreCandidate(
  raceTitle: string,
  pageTitle: string,
  cityForms: string[] = [],
): number {
  const raceTokens = new Set(normalizeForMatch(raceTitle).split(" "));
  const pageTokens = new Set(normalizeForMatch(pageTitle).split(" "));
  const cityTokens = new Set(
    cityForms.flatMap((c) => normalizeForMatch(c).split(" ")),
  );
  let hits = 0;
  let nonCityHits = 0;
  for (const t of raceTokens) {
    if (!pageTokens.has(t)) continue;
    hits += 1;
    if (!cityTokens.has(t)) nonCityHits += 1;
  }
  const misses = pageTokens.size - hits;
  let score = hits * 4 - misses;
  // City credit (any known spelling — "geneva"/"geneve") ONLY when
  // the page also matches a non-city race token; without that gate
  // the bare city article ("Geneva", "Lake Geneva") outscores the
  // race page and eats the candidate slots.
  if (
    nonCityHits > 0 &&
    [...cityTokens].some((tok) => pageTokens.has(tok))
  ) {
    score += 4;
  }
  return score;
}

/** The race city's name on another language edition, via the en
 *  city article's langlinks ("Geneva" → fr "Genève", de "Genf").
 *  Null when unknown — search then just runs the English forms. */
async function localizedCityName(
  city: string,
  lang: string,
): Promise<string | null> {
  if (lang === "en") return null;
  const url =
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(city)}` +
    `&prop=langlinks&lllang=${lang}&redirects=1&format=json&formatversion=2`;
  try {
    const data = (await fetchJson(url)) as {
      query?: { pages?: { langlinks?: { title: string }[] }[] };
    };
    const title = data.query?.pages?.[0]?.langlinks?.[0]?.title ?? null;
    // Strip parenthetical disambiguators ("Genf (Stadt)" → "Genf").
    return title ? title.replace(/\s*\(.*\)$/, "") : null;
  } catch {
    return null;
  }
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
  city: string | undefined,
): Promise<PageCandidate[]> {
  // Query both the raw title and its digit-split variant when they
  // differ — en.wikipedia's search misses "20km of Brussels" but
  // finds "20 km of Brussels".
  const queries = new Set([raceTitle, digitSplitTitle(raceTitle)]);
  const cityForms: string[] = city ? [city] : [];

  // Non-English editions title races with the LOCAL city name —
  // fr.wikipedia knows "20 km de Genève", and searching it with
  // the English "Geneva" surfaces only the city article. Resolve
  // the local name via the en city page's langlinks and query
  // with it substituted (or appended when the title doesn't
  // contain the English city).
  if (city) {
    const localized = await localizedCityName(city, lang);
    if (localized && localized.toLowerCase() !== city.toLowerCase()) {
      cityForms.push(localized);
      // Bare-token query: title tokens minus the city and minus
      // connector words, plus the LOCAL city name. fr search finds
      // "20 km de Genève" for "20 km Genève" but not for
      // "20 km of Genève" — English connectors poison the query.
      const cityTokens = new Set(normalizeForMatch(city).split(" "));
      const connectors = new Set([
        "of", "the", "de", "der", "des", "du", "la", "le", "van", "di",
      ]);
      const bare = normalizeForMatch(raceTitle)
        .split(" ")
        .filter((t) => !cityTokens.has(t) && !connectors.has(t));
      queries.add(`${bare.join(" ")} ${localized}`.trim());
    }
  }

  const perQuery = await Promise.all(
    [...queries].map((q) => rawSearch(lang, q)),
  );
  const seen = new Set<string>();
  const merged: PageCandidate[] = [];
  for (const title of perQuery.flat()) {
    if (seen.has(title)) continue;
    seen.add(title);
    merged.push({
      title,
      lang,
      score: scoreCandidate(raceTitle, title, cityForms),
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

/** Companion-title filter: carries a list/winners keyword AND every
 *  significant main-title token. Token comparison is prefix-loose so
 *  inflected forms still match (de "…des Berlin-Marathons" ↔
 *  "Berlin-Marathon"). */
function isCompanionTitle(title: string, canonicalTitle: string): boolean {
  if (title === canonicalTitle) return false;
  if (!LIST_KEYWORD_RE.test(title)) return false;
  const titleTokens = normalizeForMatch(title).split(" ");
  return significantTokens(canonicalTitle).every((tok) =>
    titleTokens.some((t) => t.startsWith(tok) || tok.startsWith(t)),
  );
}

/** Mine companion-list titles the main article itself links —
 *  hatnote templates first ({{See also|…}} under Berlin's History
 *  section is how its winners list is linked; de/fr/nl editions use
 *  their own template names) plus plain wikilinks. The article's
 *  own links are the most trustworthy discovery signal. */
function mineCompanionTitles(
  wikitext: string,
  canonicalTitle: string,
): string[] {
  const found: string[] = [];
  const seen = new Set<string>();
  const add = (raw: string) => {
    const t = raw.trim();
    if (!t || t.includes("=") || seen.has(t)) return;
    seen.add(t);
    if (isCompanionTitle(t, canonicalTitle)) found.push(t);
  };
  // Hatnote templates: {{See also|A|B}}, {{Main|A}}, {{Siehe auch|A}},
  // {{Article détaillé|A}}, {{Zie ook|A}}, {{Vedi anche|A}} …
  for (const m of wikitext.matchAll(
    /\{\{\s*(?:see also|main(?: article)?|further|siehe auch|hauptartikel|article (?:détaillé|connexe)|voir aussi|zie ook|vedi anche|véase también|artículo principal)\s*\|([^}]+)\}\}/gi,
  )) {
    for (const part of m[1].split("|")) add(part);
  }
  // Plain wikilinks: [[Title]] / [[Title|label]]
  for (const m of wikitext.matchAll(/\[\[([^\]|#]+)(?:\|[^\]]*)?\]\]/g)) {
    add(m[1]);
  }
  return found;
}

/** Find and fetch the race's companion winners-list page
 *  ("List of winners of the Berlin Marathon" — full winners tables
 *  with times AND flag-templated nationalities the main article
 *  often omits or lets go stale). Discovery, in trust order:
 *  titles the main article links (hatnotes/wikilinks), an en-style
 *  direct title probe, then a search. Returns null when the race
 *  has no such page — the common case. */
async function fetchCompanionPage(
  lang: string,
  canonicalTitle: string,
  mainWikitext: string,
): Promise<{ title: string; url: string; text: string } | null> {
  const mined = mineCompanionTitles(mainWikitext, canonicalTitle);
  const probes =
    lang === "en" ? [`List of winners of the ${canonicalTitle}`] : [];
  // Only pay for a search when the article's own links + the probe
  // produced nothing.
  const searched =
    mined.length > 0
      ? []
      : (await rawSearch(lang, `list of winners ${canonicalTitle}`)).filter(
          (t) => isCompanionTitle(t, canonicalTitle),
        );
  const candidates = [...new Set([...mined, ...probes, ...searched])].slice(
    0,
    2,
  );

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
  /** Page id from the provided inventory ("main", "winners_list",
   *  "edition:de", …). */
  source_page: string;
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
    source_page?: string;
    confidence: "high" | "medium" | "low";
  } | null;
  reasoning: string;
}

interface ExtractionPage {
  /** Stable id echoed back in source_page: "main", "winners_list",
   *  "edition:<lang>". */
  id: string;
  /** Human label used in the prompt's page inventory. */
  label: string;
  title: string;
  url: string;
  text: string;
}

function recordJsonShape(pageIds: string[]): string {
  const ids = pageIds.map((id) => `"${id}"`).join(" | ");
  return `{
  "time": "H:MM:SS",
  "athlete": "Full Name",
  "country": "IOC 3-letter code",
  "source_quote": "verbatim wikitext phrase the record came from",
  "source_page": ${ids},
  "confidence": "high" | "medium" | "low"
} or null if this record is not stated`;
}

async function extractFromWikitext(
  race: EnrichableRace,
  pages: ExtractionPage[],
): Promise<ExtractionResult> {
  const shape = recordJsonShape(pages.map((p) => p.id));
  const inventory = pages
    .map((p) => `- [${p.id}] ${p.label}: "${p.title}" (${p.url})`)
    .join("\n");
  const prompt = `You are extracting structured race data from Wikipedia raw wikitext.

Race we are researching:
- Name: ${race.title}
- Location: ${[race.city, race.country].filter(Boolean).join(", ") || "unknown"}

You are given ${pages.length} page(s):
${inventory}

Different language editions of the same article update at different speeds — one edition's winners table or records section may be a year fresher than another's. Cross-check ALL provided pages.

TASK 1 — page identity check. Set "page_is_this_race" to true only if the [main] page is about THIS race event (any language). Sponsor-name differences are fine ("Sparkasse 3-Länder-Marathon" IS "3-Länder-Marathon"). An article about a different race, a city, an athlete, or a disambiguation page → false, and return null for everything else.

TASK 2 — course records. Extract the CURRENT course record for each division stated in the material: men's, women's, men's wheelchair, women's wheelchair. Records commonly live in an infobox param (course record / Streckenrekord / record), a statistics/records section, or winners lists/tables.
- The course record is the FASTEST time ever run for that division at THIS race — NOT the most recent winner's time. In a winners table, that means the minimum time in the column (winners lists usually bold or footnote it); prefer an explicit "course record" statement over your own table scan when one exists.
- When pages disagree, records only ever get FASTER over time: a faster time backed by a newer year supersedes an older edition's slower "record" (that edition is simply stale). Use the freshest, and note the disagreement in "reasoning".
- "source_page": the id of the page the chosen value actually came from.
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
    "mens": ${shape},
    "womens": ${shape},
    "mens_wheelchair": ${shape},
    "womens_wheelchair": ${shape}
  },
  "field_size": { "value": 12345, "source_quote": "…", "source_page": "<page id>", "confidence": "high" | "medium" | "low" } or null,
  "reasoning": "one or two short sentences"
}

${pages
  .map((p) => `=== [${p.id}] ${p.label}: ${p.title} ===\n${p.text}`)
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
// Sister-language editions (cross-checking)
// ---------------------------------------------------------------------------

// Different language editions update at different speeds — the de
// edition of Copenhagen Half Marathon carries a fresher winners
// table than en/da (user example 2026-08-24). Once a page is
// accepted, its langlinks give every sister edition
// deterministically (no search); we pull the meatiest few and let
// the extraction cross-check all of them.
const MAX_EXTRA_EDITIONS = 2;
const MAX_EDITION_CHARS = 25_000;
// Skip stubs — a 3 KB edition won't carry a winners table.
const MIN_EDITION_BYTES = 4_000;

/** Sister-language editions of a page, via its langlinks. */
async function fetchLangLinks(
  lang: string,
  title: string,
): Promise<{ lang: string; title: string }[]> {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=query&prop=langlinks` +
    `&titles=${encodeURIComponent(title)}&lllimit=50&redirects=1&format=json&formatversion=2`;
  try {
    const data = (await fetchJson(url)) as {
      query?: { pages?: { langlinks?: { lang: string; title: string }[] }[] };
    };
    return (data.query?.pages?.[0]?.langlinks ?? []).map((l) => ({
      lang: l.lang,
      title: l.title,
    }));
  } catch {
    return [];
  }
}

/** Article byte length — proxy for how detailed an edition is. */
async function fetchPageLength(
  lang: string,
  title: string,
): Promise<number> {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=query&prop=info` +
    `&titles=${encodeURIComponent(title)}&redirects=1&format=json&formatversion=2`;
  try {
    const data = (await fetchJson(url)) as {
      query?: { pages?: { length?: number }[] };
    };
    return data.query?.pages?.[0]?.length ?? 0;
  } catch {
    return 0;
  }
}

/** Pick and fetch the up-to-MAX_EXTRA_EDITIONS most substantial
 *  sister editions of the accepted page (skipping stubs), budgeted
 *  through the same keyword-window truncation as the main page. */
async function fetchSisterEditions(
  lang: string,
  canonicalTitle: string,
): Promise<{ lang: string; title: string; url: string; text: string }[]> {
  const links = await fetchLangLinks(lang, canonicalTitle);
  if (links.length === 0) return [];
  const withLength = await Promise.all(
    links.map(async (l) => ({
      ...l,
      length: await fetchPageLength(l.lang, l.title),
    })),
  );
  const picked = withLength
    .filter((l) => l.length >= MIN_EDITION_BYTES)
    .sort((a, b) => b.length - a.length)
    .slice(0, MAX_EXTRA_EDITIONS);
  const fetched = await Promise.all(
    picked.map(async (l) => {
      try {
        const { wikitext, canonicalTitle: resolved } = await fetchWikitext(
          l.lang,
          l.title,
        );
        const text =
          wikitext.length <= MAX_EDITION_CHARS
            ? wikitext
            : `${wikitext.slice(0, MAX_EDITION_CHARS / 2)}\n\n[… truncated …]\n\n${wikitext.slice(-MAX_EDITION_CHARS / 2)}`;
        return {
          lang: l.lang,
          title: resolved,
          url: pageUrlFor(l.lang, resolved),
          text,
        };
      } catch {
        return null;
      }
    }),
  );
  return fetched.filter(
    (e): e is NonNullable<typeof e> => e !== null,
  );
}

// ---------------------------------------------------------------------------
// Official-website extraction (Firecrawl-rendered)
// ---------------------------------------------------------------------------

// Rendered race-site markdown budget for the Haiku pass — reg/info
// pages put fees and schedules well within this. Split across the
// homepage and (when found) one followed info sub-page.
const MAX_SITE_HOME_CHARS = 22_000;
const MAX_SITE_SUBPAGE_CHARS = 20_000;

/** Score a same-origin link for "this is where entry fees / race-day
 *  schedule / expo info live" — the data rarely sits on the
 *  homepage itself (Tokyo's is a news feed; the start time is on
 *  /en/about/outline/). Multilingual keyword set, URL-only. */
function scoreInfoLink(url: string): number {
  const u = url.toLowerCase();
  let score = 0;
  for (const [re, w] of [
    [/entry|entries|register|registration|anmeld|inscri|iscrizi|aanmeld/, 5],
    [/fee|price|tarif|preis|precio|cost/, 5],
    [/outline|overview|概要|要項|event-?info|race-?info|infos?\b/, 4],
    [/schedule|program|race-?day|zeitplan|horario/, 3],
    [/expo|abholung|pickup|pick-?up|messe/, 3],
    [/about|course|strecke|parcours/, 1],
    [/news|blog|article|press|20\d\d\/\d|photo|gallery|result/, -6],
    // Sibling-audience pages that outrank the standard entry page
    // on keyword hits alone (Berlin's /registration/charity and
    // /registration/tour-operators).
    [/charity|spende|volunteer|kids|children|bambini|relay|staffel|team|school/, -5],
    [/tour-?operator|travel|hotel|package|hospitality|vip/, -5],
  ] as [RegExp, number][]) {
    if (re.test(u)) score += w;
  }
  return score;
}

interface WebsiteExtractionResult {
  start_time: {
    value: string | null;
    source_quote: string | null;
    confidence: "high" | "medium" | "low";
  } | null;
  entry_price: {
    amount: number | null;
    currency: string | null;
    source_quote: string | null;
    confidence: "high" | "medium" | "low";
  } | null;
  expo: {
    venue_name: string | null;
    address: string | null;
    source_quote: string | null;
    confidence: "high" | "medium" | "low";
  } | null;
  reasoning: string;
}

/** Ask Haiku to pick the up-to-2 sub-pages most likely to state the
 *  main race's entry fee / start schedule / expo details. URL-token
 *  scoring alone proved brittle (BMW Berlin's homepage links a farm
 *  of sibling-event registration pages — /registration/charity,
 *  /tour-operators, /inlineskating, /generali-5k — that outscore or
 *  tie the real one); the model reads the URL semantics. Falls back
 *  to [] on any failure — the caller then uses the score heuristic. */
async function pickInfoLinks(
  race: EnrichableRace,
  urls: string[],
): Promise<string[]> {
  if (urls.length === 0) return [];
  const prompt = `From this list of URLs on the official website of the race "${race.title}" (the MAIN event), pick up to 2 URLs most likely to state:
- the standard individual entry fee for the main race, and/or
- the race-day start time / schedule, and/or
- the expo / bib pick-up venue.

Avoid sibling events (5K, kids, relay, inline skating), charity/tour-operator/travel pages, news, results, and galleries. If nothing looks promising, return an empty list.

Output STRICT JSON only: {"urls": ["…"]}

URLS:
${urls.join("\n")}`;
  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });
    const block = response.content[0];
    if (block.type !== "text") return [];
    const parsed = JSON.parse(
      block.text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, ""),
    ) as { urls?: string[] };
    // Only accept URLs that were actually in the list.
    const allowed = new Set(urls);
    return (parsed.urls ?? []).filter((u) => allowed.has(u)).slice(0, 2);
  } catch {
    return [];
  }
}

async function extractFromWebsite(
  race: EnrichableRace,
  markdown: string,
): Promise<WebsiteExtractionResult> {
  const prompt = `You are extracting structured data about a running race from its OFFICIAL website (rendered to markdown).

Race: ${race.title}
Location: ${[race.city, race.country].filter(Boolean).join(", ") || "unknown"}

The text may include the homepage plus a sub-page (marked "=== SUB-PAGE: … ==="). Extract ONLY facts the material states for THIS race's main distance (${race.title} — not sibling events like a 10K/kids run held by the same organiser):

1. "start_time" — the race-local start time of the MAIN race, as printed ("09:10", "8:00 AM"). Wave starts: use the first/elite wave. Not registration opening times, not expo hours.
2. "entry_price" — the CURRENT standard individual entry fee for the main distance, with its ISO currency code (EUR, USD, JPY …). Tiered pricing: use the currently-advertised standard tier (not early-bird-expired, not charity/VIP packages, not tour packages with hotels). If only a range is given, use the lower bound. Convert nothing — report the currency the fee is stated in.
3. "expo" — the race expo / bib pick-up venue name ("Javits Center") and its street address if stated.

Rules:
- ONLY values stated in the text. NEVER estimate or fill from general knowledge. A section not stated → null.
- "source_quote": short verbatim snippet the value came from.
- confidence: "high" = explicit and unambiguous for the main race; "medium" = stated but requires interpretation (e.g. price table needed reading); "low" = uncertain — prefer null over low.

Output STRICT JSON only — no markdown fences:

{
  "start_time": { "value": "09:10", "source_quote": "…", "confidence": "high" | "medium" | "low" } or null,
  "entry_price": { "amount": 165, "currency": "EUR", "source_quote": "…", "confidence": "high" | "medium" | "low" } or null,
  "expo": { "venue_name": "…", "address": "…" or null, "source_quote": "…", "confidence": "high" | "medium" | "low" } or null,
  "reasoning": "one short sentence"
}

WEBSITE MARKDOWN:
${markdown}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
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
  return JSON.parse(jsonText) as WebsiteExtractionResult;
}

/** Validate a race-local start-time string the way the schema and
 *  the calendar's parser expect it ("09:10", "8:00 AM"). Returns
 *  the normalized value or null. */
export function normalizeStartTime(raw: string): string | null {
  // Accepts "09:10", "8:00 AM", "9:10 a.m." — meridiem dots and
  // case are normalized away.
  const m = raw
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*([APap])\.?[Mm]\.?$/) ??
    raw.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const hours = Number(m[1]);
  const minutes = Number(m[2]);
  const meridiem = m[3] ? `${m[3].toUpperCase()}M` : undefined;
  if (minutes > 59) return null;
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    return `${hours}:${String(minutes).padStart(2, "0")} ${meridiem}`;
  }
  if (hours > 23) return null;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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
      langs.map((lang) => searchLanguage(lang, race.title, race.city)),
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
    // No candidates isn't fatal any more — the official-website
    // source below can still contribute; the final status reflects
    // whether ANY source produced something.
  }

  // ── Fetch + extract, vetoing wrong pages ──────────────────────
  let extraction: ExtractionResult | null = null;
  let pageUrl = "";
  let companionUrl: string | undefined;
  const pageUrlById = new Map<string, string>();
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

    // Companion winners-list page + sister-language editions —
    // fetched optimistically (in parallel) before the identity
    // check: wasted Wikipedia fetches on a vetoed candidate are
    // cheap; a second Haiku pass wouldn't be. Editions cross-check
    // staleness (de's Copenhagen winners table is fresher than
    // en/da's); the companion passes the full unbudgeted wikitext
    // so link-mining sees hatnotes deep in the article.
    const [companion, editions] = await Promise.all([
      fetchCompanionPage(candidate.lang, canonicalTitle, wikitext),
      fetchSisterEditions(candidate.lang, canonicalTitle),
    ]);
    const pages: ExtractionPage[] = [
      {
        id: "main",
        label: "MAIN ARTICLE",
        title: canonicalTitle,
        url,
        text,
      },
    ];
    if (companion) {
      pages.push({
        id: "winners_list",
        label:
          "WINNERS LIST (companion page: full winners tables with year, athlete, nationality flag, time; often an explicit course-records statement)",
        title: companion.title,
        url: companion.url,
        text: companion.text,
      });
    }
    for (const e of editions) {
      pages.push({
        id: `edition:${e.lang}`,
        label: `SISTER EDITION (${e.lang}.wikipedia — same article in another language; may be fresher or staler than the main article)`,
        title: e.title,
        url: e.url,
        text: e.text,
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
    for (const e of editions) {
      log.pagesTried.push({ url: e.url, verdict: "edition" });
    }
    for (const p of pages) pageUrlById.set(p.id, p.url);
    log.extractionReasoning = attempt.reasoning;
    extraction = attempt;
    pageUrl = url;
    break;
  }

  // Wikipedia yielding nothing is recorded but non-fatal — the
  // official-website source may still contribute below.
  const wikiMessage = extraction
    ? undefined
    : candidates.length === 0
      ? "No Wikipedia search results matched the race title"
      : log.pagesTried.length > 0
        ? "Wikipedia candidates were fetched but none matched this race"
        : "Could not fetch any Wikipedia candidate page";
  if (extraction) {
    log.pageUrl = pageUrl;
    log.companionUrl = companionUrl;
  }

  // ── Explode extraction into per-field candidate values ────────
  // Each value carries the URL of the page it actually came from
  // (main article, companion winners list, or a sister edition) so
  // the review row's source link lands on the right page.
  const urlForSource = (source?: string) =>
    (source && pageUrlById.get(source)) || pageUrl;

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

  if (extraction) {
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
  }

  // ── Official website (Firecrawl-rendered) ─────────────────────
  // Second source: the race's own site, for the fields Wikipedia
  // doesn't carry — race-local start time, entry price + currency,
  // expo venue/address. Rendered through Firecrawl so JS-shell
  // sites (marathon.tokyo) read fine.
  if (race.officialWebsite) {
    const rendered = await firecrawlScrape(race.officialWebsite);
    if (!rendered) {
      log.pagesTried.push({
        url: race.officialWebsite,
        verdict: "fetch_error",
      });
    } else {
      log.pagesTried.push({
        url: race.officialWebsite,
        verdict: "official_site",
      });
      log.websiteChars = rendered.markdown.length;
      // Follow up to TWO info sub-pages (entry / fees / outline /
      // schedule) — that's where start time and price actually
      // live on most race sites; the homepage is often a news
      // feed. Haiku picks them from the same-origin link list
      // (URL-token scoring alone kept choosing Berlin's sibling-
      // event registration pages); the score heuristic remains the
      // fallback. Two extra render credits, fetched in parallel.
      let siteText = rendered.markdown.slice(0, MAX_SITE_HOME_CHARS);
      try {
        const base = new URL(race.officialWebsite);
        const sameOrigin = [
          ...new Set(
            rendered.links
              .map((l) => {
                try {
                  const u = new URL(l, base);
                  if (u.origin !== base.origin) return null;
                  u.hash = ""; // "#page-content" ≠ a new page
                  // Skip the homepage itself in any dress.
                  if (u.pathname.replace(/\/$/, "") === base.pathname.replace(/\/$/, "")) return null;
                  return u.toString();
                } catch {
                  return null;
                }
              })
              .filter((l): l is string => Boolean(l)),
          ),
        ].slice(0, 80);
        let followed = await pickInfoLinks(race, sameOrigin);
        if (followed.length === 0) {
          followed = sameOrigin
            .map((l) => ({ url: l, score: scoreInfoLink(l) }))
            .filter((l) => l.score >= 4)
            .sort((a, b) => b.score - a.score)
            .slice(0, 2)
            .map((l) => l.url);
        }
        const subs = await Promise.all(followed.map((u) => firecrawlScrape(u)));
        subs.forEach((sub, i) => {
          if (!sub) return;
          log.pagesTried.push({ url: followed[i], verdict: "official_site" });
          siteText += `\n\n=== SUB-PAGE: ${followed[i]} ===\n${sub.markdown.slice(0, MAX_SITE_SUBPAGE_CHARS)}`;
        });
      } catch {
        // sub-page follow is best-effort
      }
      try {
        const site = await extractFromWebsite(race, siteText);
        log.websiteReasoning = site.reasoning;
        const siteUrl = race.officialWebsite;
        if (site.start_time?.value) {
          candidatesByField.push({
            field: "startTime",
            value: site.start_time.value,
            sourceUrl: siteUrl,
            sourceQuote: site.start_time.source_quote ?? undefined,
            confidence: site.start_time.confidence,
          });
        }
        if (site.entry_price?.amount && site.entry_price.currency) {
          candidatesByField.push({
            field: "price",
            value: String(site.entry_price.amount),
            sourceUrl: siteUrl,
            sourceQuote: site.entry_price.source_quote ?? undefined,
            confidence: site.entry_price.confidence,
          });
          candidatesByField.push({
            field: "currency",
            value: site.entry_price.currency.toUpperCase(),
            sourceUrl: siteUrl,
            sourceQuote: site.entry_price.source_quote ?? undefined,
            confidence: site.entry_price.confidence,
          });
        }
        if (site.expo?.venue_name) {
          candidatesByField.push({
            field: "expoVenueName",
            value: site.expo.venue_name,
            sourceUrl: siteUrl,
            sourceQuote: site.expo.source_quote ?? undefined,
            confidence: site.expo.confidence,
          });
          if (site.expo.address) {
            candidatesByField.push({
              field: "expoAddress",
              value: site.expo.address,
              sourceUrl: siteUrl,
              sourceQuote: site.expo.source_quote ?? undefined,
              confidence: site.expo.confidence,
            });
          }
        }
      } catch (err) {
        // Website extraction failing shouldn't sink the Wikipedia
        // half of the scan — log and continue with what we have.
        console.log(
          `[enrichment] website extraction failed for ${race.title}: ${(err as Error).message}`,
        );
      }
    }
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
    if (cand.field === "startTime") {
      const normalized = normalizeStartTime(value);
      if (!normalized) {
        log.fields.push({
          field: cand.field,
          outcome: "invalid",
          value,
          message: "start time failed H:MM / H:MM AM validation",
        });
        continue;
      }
      value = normalized;
    }
    if (cand.field === "price") {
      const n = Number(value);
      if (!Number.isFinite(n) || n <= 0 || n > 1_000_000) {
        log.fields.push({
          field: cand.field,
          outcome: "invalid",
          value,
          message: "implausible entry price",
        });
        continue;
      }
    }
    if (cand.field === "currency" && !CURRENCY_CODES.has(value)) {
      log.fields.push({
        field: cand.field,
        outcome: "invalid",
        value,
        message: "not a supported currency code",
      });
      continue;
    }
    if (
      (cand.field === "expoVenueName" || cand.field === "expoAddress") &&
      (value.trim().length < 3 || value.length > 200)
    ) {
      log.fields.push({
        field: cand.field,
        outcome: "invalid",
        value,
        message: "implausible expo text",
      });
      continue;
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

  // Final status across BOTH sources: anything suggested wins;
  // any source read (values unchanged or dropped) → no_changes;
  // neither source reachable → page_not_found with the Wikipedia
  // detail (the site fetch failure is in pagesTried).
  const anySourceRead =
    extraction !== null ||
    log.pagesTried.some((p) => p.verdict === "official_site");
  const status =
    suggestedFields.length > 0
      ? "suggested"
      : anySourceRead
        ? "no_changes"
        : "page_not_found";
  return finalize(
    {
      _id: race._id,
      title: race.title,
      status,
      message:
        status === "no_changes"
          ? [
              `${unchangedFields.length} field(s) already match, nothing new to suggest.`,
              wikiMessage,
            ]
              .filter(Boolean)
              .join(" ")
          : status === "page_not_found"
            ? [wikiMessage, race.officialWebsite ? "Official site couldn't be read either." : "No officialWebsite set to fall back to."]
                .filter(Boolean)
                .join(" ")
            : undefined,
      suggestedFields,
      unchangedFields,
      pageUrl: pageUrl || undefined,
    },
    fresh,
    pageUrl || undefined,
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

// A scan is now Wikipedia (+companion) + a Firecrawl render of the
// official site + two Haiku calls — up to ~30 s per race. One
// concurrent wave only, so the batch stays inside the 60 s
// function ceiling.
export const ENRICHMENT_BATCH_LIMIT = 4;
export const ENRICHMENT_CONCURRENCY = 4;

/** Projection of every enrichable field, shared by the batch query
 *  and the per-race admin action. */
export const ENRICHABLE_RACE_PROJECTION = `{
  _id, title, city, country, wikipediaUrl, officialWebsite,
  enrichmentSuggestions,
  "current": {
    "startTime": startTime,
    "price": price,
    "currency": currency,
    "expoVenueName": expoVenueName,
    "expoAddress": expoAddress,
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
