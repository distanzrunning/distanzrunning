// src/lib/raceDateRefresh.ts
//
// Scraping + extraction logic for the race date refresh pipeline.
// Lives in lib/ (not in the API route) so both the batch endpoint
// (/api/race-date-refresh) and the per-race admin server action
// (scanRace) can call processRace without duplicating fetch +
// Haiku + Sanity-write logic.
//
// Two-pass extraction strategy:
//   Pass 1 — fetch the officialWebsite homepage and try Haiku
//            extraction on its text.
//   Pass 2 — only triggered when Pass 1 returns no_date_found.
//            Parse outgoing links from the homepage, score each
//            against the race title + date/news keywords + future
//            years, fetch the top 3, and re-extract from combined
//            text. Catches sites where the date lives on a
//            sub-page (Valencia's /marathon/maraton/ vs the home
//            page; Tokyo's news/detail/… article).

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "next-sanity";

export const FETCH_TIMEOUT_MS = 10_000;
// Haiku context comfortably handles ~30 K chars of stripped page
// text. Truncating bounds token cost on link-heavy / blog-heavy
// race sites without losing the date (which is almost always
// near the top).
export const MAX_PAGE_TEXT_CHARS = 30_000;
// Multi-page Pass 2 — fetch up to N best-scoring sub-pages and
// concatenate their text alongside the homepage. Larger N = better
// recall, more LLM tokens, slower scan. 3 is the sweet spot at the
// pilot.
const PASS_2_TOP_N = 3;
const PASS_2_PER_PAGE_CHARS = 10_000;

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

export interface PendingRace {
  _id: string;
  title: string;
  eventDate: string;
  officialWebsite: string;
}

export interface RaceResult {
  _id: string;
  title: string;
  status:
    | "suggested"
    | "no_date_found"
    | "fetch_error"
    | "extract_error"
    | "invalid_date";
  message?: string;
  suggestedNextDate?: string;
  sourceQuote?: string;
  confidence?: "high" | "medium" | "low";
}

interface ExtractionResult {
  next_date: string | null;
  source_quote: string | null;
  confidence: "high" | "medium" | "low";
  reasoning: string;
}

interface ScoredLink {
  url: string;
  text: string;
  score: number;
}

// Strip HTML to plain text. Drops <script>/<style> blocks
// entirely (their contents would otherwise leak into the LLM
// prompt as garbage tokens), then collapses tags + whitespace.
// Cheap regex pass; cheerio would be tidier but adds 200 KB.
function htmlToText(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Identify ourselves so race websites can contact us
        // rather than silently block — and so we don't pretend
        // to be a browser.
        "User-Agent":
          "DistanzRunningBot/1.0 (+https://distanzrunning.com; date-refresh)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

// Pull every <a href> from the page, resolve to absolute URLs,
// and pair each with its anchor text. Same-origin only — we want
// to follow the race's own site, not jump out to social media or
// sponsors.
function extractLinks(
  html: string,
  baseUrl: string,
): { url: string; text: string }[] {
  const base = new URL(baseUrl);
  const seen = new Set<string>();
  const links: { url: string; text: string }[] = [];
  // Regex over the raw HTML — runs before htmlToText strips tags.
  // [^>]*? is lazy so href + closing > don't run away on broken
  // markup; [^<]* is bounded by the next opening tag.
  const re = /<a\b[^>]*?href\s*=\s*["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const rawHref = m[1].trim();
    const text = m[2].replace(/\s+/g, " ").trim();
    if (!rawHref || rawHref.startsWith("#")) continue;
    if (rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) continue;
    if (rawHref.startsWith("javascript:")) continue;
    let absolute: URL;
    try {
      absolute = new URL(rawHref, base);
    } catch {
      continue;
    }
    if (absolute.origin !== base.origin) continue;
    // Strip fragments to dedupe /foo and /foo#bar.
    absolute.hash = "";
    const normalized = absolute.toString();
    if (seen.has(normalized)) continue;
    // Skip obvious binary asset URLs.
    if (/\.(pdf|jpe?g|png|gif|svg|webp|mp4|webm|zip|csv)(\?.*)?$/i.test(normalized)) {
      continue;
    }
    seen.add(normalized);
    links.push({ url: normalized, text });
  }
  return links;
}

// Score a candidate link by how likely it is to contain the
// next race date. Heuristic, not magic — race-specific words
// (title tokens) get the largest boost; future years and date-
// related path keywords add more weight; obvious-noise pages
// (about / contact / shop / privacy) get penalized to keep them
// out of the top N. Returns a non-negative score; very negative
// candidates are filtered before sorting.
function scoreLink(
  link: { url: string; text: string },
  raceTitle: string,
): number {
  const haystack = `${link.url} ${link.text}`.toLowerCase();
  let score = 0;

  // Title-word match (e.g. "Valencia", "marathon"). Stop-word
  // filter prevents 1-2 letter junk from dominating; 3+ chars
  // keeps "10K"-style tokens out (those would over-match).
  const titleWords = raceTitle
    .toLowerCase()
    .split(/[\s\-/]+/)
    .filter((w) => w.length >= 3);
  for (const word of titleWords) {
    if (haystack.includes(word)) score += 8;
  }

  // Generic race / event keywords — broad, lower weight.
  const raceKeywords = [
    "marathon",
    "race",
    "event",
    "edition",
    "competition",
    "carrera",
    "course",
  ];
  for (const kw of raceKeywords) {
    if (haystack.includes(kw)) score += 2;
  }

  // News / schedule / calendar / registration — pages that often
  // carry the next event date.
  const dateKeywords = [
    "news",
    "schedule",
    "calendar",
    "date",
    "register",
    "registration",
    "info",
    "detail",
    "edition",
    "next",
    "schedule",
    "agenda",
    "noticia",
  ];
  for (const kw of dateKeywords) {
    if (haystack.includes(kw)) score += 3;
  }

  // Future-year mention — strong signal that this page talks
  // about an upcoming edition.
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y <= currentYear + 2; y++) {
    if (haystack.includes(String(y))) score += 5;
  }

  // Demote obvious non-matches.
  const skipKeywords = [
    "contact",
    "about",
    "privacy",
    "terms",
    "cookie",
    "shop",
    "merch",
    "store",
    "sponsor",
    "partner",
    "facebook",
    "twitter",
    "instagram",
    "youtube",
    "tiktok",
    "linkedin",
    "press",
    "media-kit",
  ];
  for (const kw of skipKeywords) {
    if (haystack.includes(kw)) score -= 6;
  }

  return score;
}

function topScoringLinks(
  links: { url: string; text: string }[],
  raceTitle: string,
  n: number,
): ScoredLink[] {
  return links
    .map((l) => ({ ...l, score: scoreLink(l, raceTitle) }))
    .filter((l) => l.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

async function extractNextDate(
  race: PendingRace,
  pageText: string,
): Promise<ExtractionResult> {
  const today = new Date().toISOString().slice(0, 10);
  const previousDate = race.eventDate.slice(0, 10);

  const prompt = `You are extracting the date of the NEXT scheduled edition of a running race from its official website.

Race name: ${race.title}
Previous edition date (now in the past): ${previousDate}
Today's date: ${today}

Read the website text below and find the date of the NEXT edition of THIS specific race. The text may include content from multiple sub-pages (separated by markers like "=== PAGE: …"). The text may also describe other races held by the same organiser — be careful to return the date of "${race.title}" specifically, not a sibling event.

Only return a date if it is explicitly stated on the page AND is after today. If the page only shows past results, says "TBA"/"coming soon" without a concrete date, or is too ambiguous, return null.

Output STRICT JSON only — no markdown, no prose around it:

{
  "next_date": "YYYY-MM-DD" or null,
  "source_quote": "the exact phrase or sentence from the page where you found the date" or null,
  "confidence": "high" | "medium" | "low",
  "reasoning": "one short sentence explaining the choice"
}

WEBSITE TEXT:
${pageText}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const block = response.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected response block type");
  }
  const raw = block.text.trim();
  // Tolerate Haiku occasionally wrapping JSON in ```json fences
  // despite the prompt asking it not to.
  const jsonText = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  const parsed = JSON.parse(jsonText) as ExtractionResult;
  return parsed;
}

// Fetch a sub-page, strip to text, truncate. Returns null on
// any failure — Pass 2 should still try the other candidates.
async function fetchSubPageText(url: string): Promise<string | null> {
  try {
    const html = await fetchHtml(url);
    return htmlToText(html).slice(0, PASS_2_PER_PAGE_CHARS);
  } catch {
    return null;
  }
}

export async function processRace(
  race: PendingRace,
  options: { dryRun: boolean },
): Promise<RaceResult> {
  let homeHtml: string;
  try {
    homeHtml = await fetchHtml(race.officialWebsite);
  } catch (err) {
    return {
      _id: race._id,
      title: race.title,
      status: "fetch_error",
      message: (err as Error).message,
    };
  }

  const homeText = htmlToText(homeHtml).slice(0, MAX_PAGE_TEXT_CHARS);

  // Pass 1 — homepage text only. Catches the easy cases (London,
  // Boston, Berlin) without paying for sub-page fetches.
  let extraction: ExtractionResult;
  try {
    extraction = await extractNextDate(race, homeText);
  } catch (err) {
    return {
      _id: race._id,
      title: race.title,
      status: "extract_error",
      message: (err as Error).message,
    };
  }

  // Pass 2 — homepage didn't have it. Parse outgoing links from
  // the raw homepage HTML, score against the race title, fetch
  // the top N sub-pages, and re-extract from combined text.
  if (!extraction.next_date) {
    const links = extractLinks(homeHtml, race.officialWebsite);
    const candidates = topScoringLinks(links, race.title, PASS_2_TOP_N);

    if (candidates.length > 0) {
      const subTexts = await Promise.all(
        candidates.map((c) => fetchSubPageText(c.url)),
      );

      // Combine homepage + sub-pages, marking each section so
      // Haiku knows where each chunk came from. Helps it ignore
      // sibling-race noise when the homepage and a race-specific
      // page disagree.
      const sections: string[] = [
        `=== PAGE: ${race.officialWebsite} ===\n${homeText}`,
      ];
      candidates.forEach((c, i) => {
        const text = subTexts[i];
        if (text) {
          sections.push(`=== PAGE: ${c.url} ===\n${text}`);
        }
      });
      const combined = sections.join("\n\n");

      try {
        extraction = await extractNextDate(race, combined);
      } catch (err) {
        return {
          _id: race._id,
          title: race.title,
          status: "extract_error",
          message: (err as Error).message,
        };
      }
    }
  }

  if (!extraction.next_date) {
    return {
      _id: race._id,
      title: race.title,
      status: "no_date_found",
      message: extraction.reasoning,
    };
  }

  // Validate the date string parses AND is in the future. Haiku
  // sometimes hallucinates a future date that's actually the
  // previous edition; rejecting <= today keeps junk out.
  const parsed = new Date(extraction.next_date);
  if (Number.isNaN(parsed.getTime()) || parsed <= new Date()) {
    return {
      _id: race._id,
      title: race.title,
      status: "invalid_date",
      message: `Returned date ${extraction.next_date} is invalid or not in the future`,
    };
  }

  if (!options.dryRun) {
    await sanityClient
      .patch(race._id)
      .set({
        // Store as full datetime at noon UTC — eventDate is a
        // datetime, and noon avoids tz-rollover surprises on
        // either side of UTC when the editor approves.
        suggestedNextDate: `${extraction.next_date}T12:00:00Z`,
        suggestedNextDateScrapedAt: new Date().toISOString(),
        suggestedNextDateSourceQuote: extraction.source_quote ?? "",
        suggestedNextDateStatus: "pending",
      })
      .commit();
  }

  return {
    _id: race._id,
    title: race.title,
    status: "suggested",
    suggestedNextDate: extraction.next_date,
    sourceQuote: extraction.source_quote ?? undefined,
    confidence: extraction.confidence,
  };
}

// Process an array with bounded concurrency. Promise.all on the
// full list would hammer all N race sites at once; this keeps it
// to N in-flight, returning results in input order.
export async function mapWithConcurrency<T, R>(
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
