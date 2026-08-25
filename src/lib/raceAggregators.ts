// src/lib/raceAggregators.ts
//
// Aggregator sources for the "Add race" tool (Plan 017, slice 3b):
// once Wikipedia has established a race's IDENTITY, these fill the
// scheduling/commercial facts Wikipedia doesn't carry —
//
//   - World Athletics label calendar — the AUTHORITATIVE label tier
//     (Platinum/Gold/Elite/Label) and next-edition date. The page
//     server-renders every label race of the season as JSON inside
//     __NEXT_DATA__ (313 events, name/venue/country/startDate/
//     subgroup), so matching is pure structured code — no LLM.
//   - finishers.com — static HTML event pages (slug-guessable, with
//     a Firecrawl-search fallback for slugs like "utmb-r"): next
//     event date + an explicit "Date confirmed" status, bib price
//     with currency, surface ("Road Running"), badge strip.
//   - ahotu.com — client-rendered (Firecrawl search + render): date
//     with start time, Strava route embed with elevation gain,
//     terrain/profile prose.
//
// One combined Haiku pass extracts from the two aggregator texts
// (cross-referencing them); the WA match merges in afterwards and
// WINS date conflicts — governing body beats aggregator.

import Anthropic from "@anthropic-ai/sdk";

import { CURRENCY_CODES } from "@/lib/currencies";
import { parseModelJson } from "@/lib/modelJson";
import {
  firecrawlScrape,
  firecrawlSearch,
} from "@/lib/firecrawlScrape";
import { IOC_COUNTRY_OPTIONS } from "@/lib/iocCountries";
import { slugifyTitle } from "@/lib/slugify";
import { scoreCandidate } from "@/lib/wikipedia";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const FETCH_TIMEOUT_MS = 10_000;
// Aggregator page text budgets for the one Haiku pass.
const FINISHERS_TEXT_CHARS = 16_000;
const AHOTU_TEXT_CHARS = 20_000;
// Same acceptance floor as Wikipedia discovery — one strong token
// hit with little noise.
const MIN_MATCH_SCORE = 5;

/** Coarse distance class of a race title — used to keep source
 *  matching honest: "Manchester Half Marathon" must never match
 *  ahotu's "City of Manchester Marathon" (a full marathon in
 *  Manchester, New Hampshire) just because the city+sport tokens
 *  overlap. Null when the title doesn't state a class (UTMB) —
 *  unknown never blocks. */
function distanceClass(title: string): string | null {
  const t = title.toLowerCase();
  if (/half|semi|21\s?k/.test(t)) return "half";
  if (/ultra|100\s?k|50\s?k|100\s?mi/.test(t)) return "ultra";
  if (/\b10\s?k/.test(t)) return "10k";
  if (/\b5\s?k/.test(t)) return "5k";
  if (/marathon|42\s?k/.test(t)) return "marathon";
  return null;
}

function distanceClassCompatible(query: string, candidate: string): boolean {
  const q = distanceClass(query);
  const c = distanceClass(candidate);
  if (!q || !c) return true;
  return q === c;
}

/** Tag vocabulary shared by the discovery prompt, the aggregator
 *  merge, and the admin form's MultiSelect. Matches the values
 *  already in use across the dataset (plus the base "World
 *  Athletics Label" tier the WA calendar can now assert). */
export const KNOWN_RACE_TAGS = [
  "World Athletics Platinum Label",
  "World Athletics Gold Label",
  "World Athletics Elite Label",
  "World Athletics Label",
  "AIMS Member Race",
  "SuperHalfs",
  "Boston Marathon Qualifier",
  "Abbott World Marathon Major",
  "AbbottWMM Candidate",
  "AbbottWMM MTT Age Group Qualifiers",
  "Womans Only",
];

// ---------------------------------------------------------------------------
// Findings shape
// ---------------------------------------------------------------------------

export interface AggregatorFindings {
  eventDate?: string; // YYYY-MM-DD
  eventDateStatus?: "confirmed" | "estimated";
  startTime?: string; // race-local, "10:30" / "9:00 AM"
  price?: number;
  currency?: string;
  surface?: "Road" | "Trail" | "Track" | "Mountain" | "Mixed";
  profile?: "flat" | "rolling" | "hilly" | "mountainous";
  elevationGain?: number;
  stravaRouteUrl?: string;
  /** Identity facts the aggregator pages state — lets discovery
   *  build a result for races with NO Wikipedia article at all
   *  (finishers has manchester-half-marathon; Wikipedia doesn't). */
  city?: string;
  country?: string;
  distanceKm?: number;
  /** Tag-vocabulary labels asserted by the sources. */
  labels: string[];
  /** The WA label calendar's CURRENT tier tag when the race
   *  matched — authoritative: supersedes any WA-tier tag other
   *  sources (incl. a stale Wikipedia infobox) assert. */
  waTier?: string;
  /** Which sources produced a verified page match — empty means
   *  nothing was found anywhere. */
  matchedSources: string[];
  /** Human-readable provenance lines for the review form. */
  notes: string[];
  warnings: string[];
}

// ---------------------------------------------------------------------------
// World Athletics label calendar
// ---------------------------------------------------------------------------

interface WALabelEvent {
  name: string;
  venue: string;
  country: string;
  startDate: string;
  subgroup: string; // "Platinum" | "Gold" | "Elite" | "Label"
}

const WA_CALENDAR_URL =
  "https://worldathletics.org/competitions/world-athletics-label-road-races/calendar-results";

const WA_SUBGROUP_TO_TAG: Record<string, string> = {
  Platinum: "World Athletics Platinum Label",
  Gold: "World Athletics Gold Label",
  Elite: "World Athletics Elite Label",
  Label: "World Athletics Label",
};

// IOC title → code, with the country-name spellings our dataset
// uses that differ from the IOC list's titles.
const COUNTRY_TO_IOC: Record<string, string> = {
  ...Object.fromEntries(IOC_COUNTRY_OPTIONS.map((o) => [o.title, o.value])),
  "United Kingdom": "GBR",
  Czechia: "CZE",
};

async function fetchWALabelCalendar(): Promise<WALabelEvent[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(WA_CALENDAR_URL, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DistanzRunningCrawler/1.0; +https://distanzrunning.com)",
      },
    });
    if (!res.ok) return [];
    const html = await res.text();
    const m = html.match(
      /<script id="__NEXT_DATA__" type="application\/json"[^>]*>([\s\S]*?)<\/script>/,
    );
    if (!m) return [];
    const data = JSON.parse(m[1]) as {
      props?: {
        pageProps?: {
          minisiteCalendarEvents?: {
            results?: {
              name?: string;
              venue?: string;
              country?: string;
              startDate?: string;
              competitionSubgroup?: string;
            }[];
          };
        };
      };
    };
    return (data.props?.pageProps?.minisiteCalendarEvents?.results ?? [])
      .filter((r) => r.name && r.country && r.startDate)
      .map((r) => ({
        name: r.name!,
        venue: r.venue ?? "",
        country: r.country!,
        startDate: r.startDate!,
        subgroup: r.competitionSubgroup ?? "Label",
      }));
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/** Match our race against the WA label calendar. Country must
 *  match (IOC code); the best title-token score wins, with a city-
 *  in-venue bonus separating "Valencia Marathon" from Valencia's
 *  10K. Sponsor prefixes in WA names ("TCS Sydney Marathon
 *  Presented by ASICS") are exactly what scoreCandidate was built
 *  to see through. */
function matchWAEvent(
  events: WALabelEvent[],
  title: string,
  city: string | undefined,
  country: string | undefined,
): WALabelEvent | null {
  const ioc = country ? COUNTRY_TO_IOC[country] : undefined;
  const pool = ioc ? events.filter((e) => e.country === ioc) : events;
  // Without a country constraint the whole 300+ event pool is in
  // play — demand a stronger title match to compensate.
  const floor = ioc ? MIN_MATCH_SCORE : MIN_MATCH_SCORE + 3;
  let best: { event: WALabelEvent; score: number } | null = null;
  for (const event of pool) {
    if (!distanceClassCompatible(title, event.name)) continue;
    let score = scoreCandidate(title, event.name);
    if (
      city &&
      event.venue.toLowerCase().includes(city.toLowerCase())
    ) {
      score += 3;
    }
    if (score >= floor && (!best || score > best.score)) {
      best = { event, score };
    }
  }
  return best?.event ?? null;
}

// ---------------------------------------------------------------------------
// finishers.com
// ---------------------------------------------------------------------------

function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchStatic(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DistanzRunningCrawler/1.0; +https://distanzrunning.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Distinctive title tokens for a does-this-page-mention-the-race
 *  sanity check (4+ chars, diacritics stripped). */
function distinctiveWords(title: string): string[] {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 4);
}

async function fetchFinishersText(
  title: string,
): Promise<{ url: string; text: string } | null> {
  const distinctive = distinctiveWords(title);
  const sane = (text: string) => {
    const lower = text.toLowerCase();
    return distinctive.some((w) => lower.includes(w));
  };

  // Slug probe first — free, and the common case for plainly-named
  // races ("rome-marathon", "manchester-half-marathon").
  const probeUrl = `https://www.finishers.com/en/event/${slugifyTitle(title)}`;
  const probeHtml = await fetchStatic(probeUrl);
  if (probeHtml) {
    const text = stripHtml(probeHtml).slice(0, FINISHERS_TEXT_CHARS);
    if (sane(text)) return { url: probeUrl, text };
  }

  // Fallback: search — catches marketing slugs ("utmb-r").
  const results = await firecrawlSearch(
    `site:finishers.com/en/event ${title}`,
    3,
  );
  for (const r of results) {
    if (!/finishers\.com\/en\/event\//.test(r.url)) continue;
    if (scoreCandidate(title, r.title) < MIN_MATCH_SCORE) continue;
    if (!distanceClassCompatible(title, r.title)) continue;
    const html = await fetchStatic(r.url);
    if (!html) continue;
    const text = stripHtml(html).slice(0, FINISHERS_TEXT_CHARS);
    if (sane(text)) return { url: r.url, text };
  }
  return null;
}

// ---------------------------------------------------------------------------
// ahotu.com
// ---------------------------------------------------------------------------

async function fetchAhotuText(
  title: string,
): Promise<{ url: string; text: string } | null> {
  // Ahotu slugs are the race's marketing name ("run-rome-the-
  // marathon") — search first, render the match. The search-result
  // title carries the race name for verification.
  const results = await firecrawlSearch(`site:ahotu.com/event ${title}`, 3);
  const match = results.find(
    (r) =>
      /ahotu\.com\/event\/[^/]+$/.test(r.url) &&
      scoreCandidate(title, r.title.replace(/,.*$/, "")) >= MIN_MATCH_SCORE &&
      distanceClassCompatible(title, r.title.replace(/,.*$/, "")),
  );
  if (!match) return null;
  const rendered = await firecrawlScrape(match.url);
  if (!rendered) {
    // The search description is itself rendered page content —
    // better than nothing when the full render fails.
    return match.description
      ? { url: match.url, text: match.description.slice(0, AHOTU_TEXT_CHARS) }
      : null;
  }
  // Cut the related-events/nav tail — the event's own facts sit in
  // the first part of the page.
  let text = rendered.markdown;
  const cut = text.search(/## Registration just opened|## Popular events/);
  if (cut > 2_000) text = text.slice(0, cut);
  return { url: match.url, text: text.slice(0, AHOTU_TEXT_CHARS) };
}

// ---------------------------------------------------------------------------
// Combined extraction
// ---------------------------------------------------------------------------

interface AggregatorExtraction {
  next_event_date: {
    value: string | null;
    status: "confirmed" | "estimated";
    source_quote: string | null;
    confidence: "high" | "medium" | "low";
  } | null;
  start_time: { value: string | null; source_quote: string | null } | null;
  price: {
    amount: number | null;
    currency: string | null;
    note: string | null;
    source_quote: string | null;
    confidence: "high" | "medium" | "low";
  } | null;
  surface: "Road" | "Trail" | "Track" | "Mountain" | "Mixed" | null;
  profile: "flat" | "rolling" | "hilly" | "mountainous" | null;
  elevation_gain_m: number | null;
  strava_route_url: string | null;
  badges: string[];
  city: string | null;
  country: string | null;
  distance_km: number | null;
  reasoning: string;
}

async function extractFromAggregators(
  title: string,
  hints: { city?: string; country?: string },
  sections: { source: string; url: string; text: string }[],
): Promise<AggregatorExtraction> {
  const body = sections
    .map((s) => `=== SOURCE: ${s.source} (${s.url}) ===\n${s.text}`)
    .join("\n\n");
  const today = new Date().toISOString().slice(0, 10);
  const hintLine = [hints.city, hints.country].filter(Boolean).join(", ");
  const prompt = `You are extracting facts about the running race "${title}"${hintLine ? ` (${hintLine})` : ""} from race-aggregator pages. Today is ${today}. Read only what the pages state.

IMPORTANT — the sources were matched independently, and one may describe a DIFFERENT race with a similar name (wrong country or city, wrong distance). First judge which source(s) genuinely describe "${title}"${hintLine ? ` in ${hintLine}` : ""}. IGNORE any source describing a different race — say so in "reasoning" — and extract from the remaining source(s) alone. Agreement between sources is a confidence bonus, never a requirement; one correct source is enough.

Extract, for THIS race's MAIN distance (not sibling events on the same weekend):

1. "next_event_date" — the NEXT edition's date, YYYY-MM-DD, must be after today. "status": "confirmed" if a page explicitly marks it confirmed (finishers shows "Date confirmed"), else "estimated". If a range spans two days (expo weekend), use the RACE day (usually the last day).
2. "start_time" — the main race's local start time if stated ("10:30").
3. "price" — the CURRENT individual entry price for the main distance, with ISO currency code. Aggregators often show "From X" or tiered "until <date>" pricing — use the currently-advertised figure and put any qualifier in "note". Beware converted display prices (ahotu shows a chosen display currency); prefer the price stated with the race's own currency (finishers' bib-price prose).
4. "surface" — one of Road | Trail | Track | Mountain | Mixed, from the pages' categorization ("Road Running" → Road, "Trail running" → Trail). Null if unstated.
5. "profile" — one of flat | rolling | hilly | mountainous ONLY if a page characterizes the course ("the race is very flat" → flat). Null if unstated.
6. "elevation_gain_m" — the course's elevation gain in meters if stated (ahotu's Strava embed shows "Elev Gain"). Integer.
7. "strava_route_url" — a strava.com/routes/... URL (or strava.app.link) if present.
8. "badges" — labels the pages assert for this race, chosen ONLY from: ${JSON.stringify(KNOWN_RACE_TAGS)}. Map wording: "World Marathon Majors Qualifiers" does NOT mean Abbott World Marathon Major (that's for the six Majors themselves); "Boston Qualifying Races" → "Boston Marathon Qualifier". Empty array if none clearly asserted.
9. "city" / "country" — where the race is held, if the pages state it (plain English country name, e.g. "United Kingdom").
10. "distance_km" — the MAIN race's distance in kilometers as a number (convert "26.1 mi" → 42.195, "13.1 mi" → 21.0975; pick the longest listed distance when the event has several).

Rules: ONLY stated facts, never estimates. Low confidence → null. Output STRICT JSON only:

{
  "next_event_date": { "value": "YYYY-MM-DD" or null, "status": "confirmed" | "estimated", "source_quote": "…", "confidence": "high" | "medium" | "low" } or null,
  "start_time": { "value": "…" or null, "source_quote": "…" } or null,
  "price": { "amount": 89, "currency": "EUR", "note": "until July 31, 2025" or null, "source_quote": "…", "confidence": "high" | "medium" | "low" } or null,
  "surface": "Road" | "Trail" | "Track" | "Mountain" | "Mixed" | null,
  "profile": "flat" | "rolling" | "hilly" | "mountainous" | null,
  "elevation_gain_m": 142 or null,
  "strava_route_url": "…" or null,
  "badges": ["…"],
  "city": "…" or null,
  "country": "…" or null,
  "distance_km": 42.195 or null,
  "reasoning": "one or two short sentences"
}

${body}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response block type");
  return parseModelJson<AggregatorExtraction>(block.text);
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

export async function gatherAggregatorData(input: {
  title: string;
  city?: string;
  country?: string;
}): Promise<AggregatorFindings> {
  const findings: AggregatorFindings = {
    labels: [],
    matchedSources: [],
    notes: [],
    warnings: [],
  };

  // All three sources in parallel — each degrades to null/[] alone.
  const [waEvents, finishers, ahotu] = await Promise.all([
    fetchWALabelCalendar(),
    fetchFinishersText(input.title),
    fetchAhotuText(input.title),
  ]);

  // ── World Athletics (structured, no LLM) ──────────────────────
  const wa = matchWAEvent(waEvents, input.title, input.city, input.country);
  if (wa) {
    findings.matchedSources.push("World Athletics");
    const tag = WA_SUBGROUP_TO_TAG[wa.subgroup];
    if (tag) {
      findings.labels.push(tag);
      findings.waTier = tag;
    }
    findings.eventDate = wa.startDate;
    findings.eventDateStatus = "confirmed";
    findings.notes.push(
      `World Athletics label calendar: "${wa.name}" (${wa.venue}) — ${wa.subgroup} label, next edition ${wa.startDate}.`,
    );
  } else if (waEvents.length === 0) {
    findings.warnings.push(
      "World Athletics label calendar couldn't be read — label tag unchecked.",
    );
  }

  // ── Aggregator extraction (one Haiku pass over both) ──────────
  const sections: { source: string; url: string; text: string }[] = [];
  if (finishers) {
    sections.push({ source: "finishers.com", ...finishers });
    findings.matchedSources.push("finishers.com");
  }
  if (ahotu) {
    sections.push({ source: "ahotu.com", ...ahotu });
    findings.matchedSources.push("ahotu.com");
  }
  if (sections.length === 0) {
    if (!wa) {
      findings.warnings.push(
        "No aggregator page found (finishers.com, ahotu.com) — date/price/surface not prefilled.",
      );
    }
    return findings;
  }

  let extraction: AggregatorExtraction;
  try {
    extraction = await extractFromAggregators(
      input.title,
      { city: input.city, country: input.country },
      sections,
    );
  } catch (err) {
    findings.warnings.push(
      `Aggregator extraction failed: ${(err as Error).message}`,
    );
    return findings;
  }

  const sourceList = sections.map((s) => s.source).join(" + ");
  const today = new Date().toISOString().slice(0, 10);
  if (extraction.reasoning) {
    findings.notes.push(`Aggregator read (${sourceList}): ${extraction.reasoning}`);
  }

  // Date — WA wins conflicts (governing body beats aggregator).
  const aggDate = extraction.next_event_date;
  if (aggDate?.value && aggDate.confidence !== "low") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(aggDate.value) && aggDate.value > today) {
      if (!findings.eventDate) {
        findings.eventDate = aggDate.value;
        findings.eventDateStatus = aggDate.status;
        findings.notes.push(
          `Next edition ${aggDate.value} (${aggDate.status}) from ${sourceList}.`,
        );
      } else if (findings.eventDate !== aggDate.value) {
        findings.warnings.push(
          `Date conflict: World Athletics says ${findings.eventDate}, aggregators say ${aggDate.value} — kept World Athletics.`,
        );
      }
    }
  }

  if (extraction.start_time?.value) {
    findings.startTime = extraction.start_time.value;
    findings.notes.push(
      `Start time ${extraction.start_time.value} from ${sourceList}.`,
    );
  }

  const price = extraction.price;
  if (
    price?.amount &&
    price.amount > 0 &&
    price.amount <= 100_000 &&
    price.currency &&
    CURRENCY_CODES.has(price.currency.toUpperCase()) &&
    price.confidence !== "low"
  ) {
    findings.price = price.amount;
    findings.currency = price.currency.toUpperCase();
    findings.notes.push(
      `Entry price ${price.amount} ${findings.currency}${price.note ? ` (${price.note})` : ""} from ${sourceList}.`,
    );
  }

  if (extraction.surface) findings.surface = extraction.surface;
  if (extraction.profile) findings.profile = extraction.profile;
  if (
    typeof extraction.elevation_gain_m === "number" &&
    extraction.elevation_gain_m >= 0 &&
    extraction.elevation_gain_m < 20_000
  ) {
    findings.elevationGain = Math.round(extraction.elevation_gain_m);
  }
  if (extraction.strava_route_url) {
    findings.stravaRouteUrl = extraction.strava_route_url;
    findings.notes.push(
      `Strava route (for the GPX): ${extraction.strava_route_url}`,
    );
  }
  for (const badge of extraction.badges ?? []) {
    if (KNOWN_RACE_TAGS.includes(badge)) findings.labels.push(badge);
  }
  findings.labels = [...new Set(findings.labels)];

  // Identity facts — used by discovery's no-Wikipedia fallback.
  if (extraction.city) findings.city = extraction.city;
  if (extraction.country) findings.country = extraction.country;
  if (
    typeof extraction.distance_km === "number" &&
    extraction.distance_km > 0 &&
    extraction.distance_km < 1_000
  ) {
    findings.distanceKm = extraction.distance_km;
  }

  return findings;
}
