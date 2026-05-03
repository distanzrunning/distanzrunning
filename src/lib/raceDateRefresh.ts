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
// Multi-page Pass 2 — 2-level BFS. Wave 1 fetches the top N
// scoring links from the homepage + sitemap. Wave 2 then fetches
// the top M scoring links found INSIDE those wave-1 pages
// (typically catches news articles linked from a /news/ index).
const PASS_2_WAVE_1 = 5;
const PASS_2_WAVE_2 = 3;
const PASS_2_PER_PAGE_CHARS = 7_000;
// Sitemap discovery — many race sites' homepages are JS-rendered
// and only expose a tiny static link set, but their /sitemap.xml
// (or /sitemap_index.xml) lists every URL the site wants indexed,
// including deep news articles. Folding those URLs into the
// candidate pool catches sites where the date lives on a page
// the homepage doesn't statically link to (Tokyo Marathon's
// /en/news/detail/… articles, etc.). Cap parsing to avoid
// pathological sitemaps that list 10k+ URLs.
const SITEMAP_URL_LIMIT = 500;

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

// Drop any link whose URL already appears in `visited`, and
// dedupe within the input list itself. Mutates `visited` only
// indirectly — caller decides when to mark URLs as seen.
function dedupeLinks(
  links: { url: string; text: string }[],
  visited: Set<string>,
): { url: string; text: string }[] {
  const seen = new Set<string>();
  return links.filter((l) => {
    if (visited.has(l.url) || seen.has(l.url)) return false;
    seen.add(l.url);
    return true;
  });
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

Read the website text below and find the date of the NEXT edition of THIS specific race. Notes:

- The text may be in any language (English, Japanese, Spanish, German, Chinese, etc.). Interpret it regardless of language. Date formats may also vary: "March 7, 2027", "07.03.2027", "2027年3月7日", "07/03/2027", etc. — return the resolved date as YYYY-MM-DD.
- The text may include content from multiple sub-pages (separated by markers like "=== PAGE: …"). Pages from /news/ or announcement-style URLs often carry the most authoritative scheduling info.
- The text may also describe other races held by the same organiser (e.g. a half marathon alongside a marathon). Return the date of "${race.title}" specifically, not a sibling event.
- News articles may be dated themselves (e.g. an article published 2026-04-15) — that's the publish date, not the race date. The race date is the one mentioned IN the article body about when the race will be held.

Only return a date if it is explicitly stated AND is after today. If only past dates appear, or the page says "TBA"/"coming soon"/"more info to follow" without a concrete date, return null.

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

// Try to fetch the site's sitemap and return up to
// SITEMAP_URL_LIMIT URLs. Tries /sitemap.xml first, then
// /sitemap_index.xml. If the document is a sitemap *index*
// (points at child sitemaps), follows the first child to keep
// the discovery one level deep. Returns [] on any failure —
// caller should still try homepage links.
async function fetchSitemapUrls(baseUrl: string): Promise<string[]> {
  const candidates = [
    new URL("/sitemap.xml", baseUrl).toString(),
    new URL("/sitemap_index.xml", baseUrl).toString(),
  ];
  for (const candidate of candidates) {
    try {
      const xml = await fetchHtml(candidate);
      // Cheap content-type check — anything that isn't an XML
      // sitemap probably 404'd into an HTML error page.
      if (!xml.includes("<urlset") && !xml.includes("<sitemapindex")) {
        continue;
      }
      // Sitemap index → recurse into the first child sitemap so
      // we still pull URLs (one level only — full traversal would
      // blow the budget on big WP sites).
      if (xml.includes("<sitemapindex")) {
        const childMatches = [
          ...xml.matchAll(/<sitemap>[\s\S]*?<loc>\s*([^<]+)\s*<\/loc>[\s\S]*?<\/sitemap>/gi),
        ];
        const firstChild = childMatches[0]?.[1]?.trim();
        if (!firstChild) return [];
        const childXml = await fetchHtml(firstChild);
        return parseSitemapLocs(childXml);
      }
      return parseSitemapLocs(xml);
    } catch {
      // Try the next candidate.
    }
  }
  return [];
}

function parseSitemapLocs(xml: string): string[] {
  return [
    ...xml.matchAll(/<url>[\s\S]*?<loc>\s*([^<]+)\s*<\/loc>[\s\S]*?<\/url>/gi),
  ]
    .map((m) => m[1].trim())
    .slice(0, SITEMAP_URL_LIMIT);
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

// Fetch a page and return BOTH its stripped text AND its outgoing
// link set so wave 2 of the crawl can pick deeper candidates.
// Returns null on failure.
async function fetchPageWithLinks(
  url: string,
): Promise<{ text: string; links: { url: string; text: string }[] } | null> {
  try {
    const html = await fetchHtml(url);
    return {
      text: htmlToText(html).slice(0, PASS_2_PER_PAGE_CHARS),
      links: extractLinks(html, url),
    };
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

  // Pass 2 — homepage didn't have it. 2-level BFS:
  //   Wave 1: homepage's outgoing links + /sitemap.xml entries,
  //           scored, top PASS_2_WAVE_1 fetched.
  //   Wave 2: links found INSIDE those wave-1 pages, scored,
  //           top PASS_2_WAVE_2 fetched. Catches sites where the
  //           homepage links to a /news/ index and the actual
  //           article (with the date) is linked only from there.
  if (!extraction.next_date) {
    const visited = new Set<string>([race.officialWebsite]);
    const sections: string[] = [
      `=== PAGE: ${race.officialWebsite} ===\n${homeText}`,
    ];

    // ── Wave 1 ─────────────────────────────────────────────
    const homepageLinks = extractLinks(homeHtml, race.officialWebsite);
    const sitemapUrls = await fetchSitemapUrls(race.officialWebsite);
    // Sitemap entries have no anchor text, but the URL itself
    // usually carries enough signal (news/2026/article-slug) for
    // scoreLink to rank them well.
    const sitemapLinks = sitemapUrls.map((url) => ({ url, text: "" }));
    const wave1Pool = dedupeLinks([...homepageLinks, ...sitemapLinks], visited);
    const wave1 = topScoringLinks(wave1Pool, race.title, PASS_2_WAVE_1);
    wave1.forEach((c) => visited.add(c.url));

    const wave1Pages = await Promise.all(
      wave1.map((c) => fetchPageWithLinks(c.url)),
    );

    wave1.forEach((c, i) => {
      const page = wave1Pages[i];
      if (page) sections.push(`=== PAGE: ${c.url} ===\n${page.text}`);
    });

    // ── Wave 2 ─────────────────────────────────────────────
    // Pool every outgoing link from the wave-1 pages we managed
    // to fetch, dedupe against everything we've seen, score, and
    // pick the top scorers. Catches /en/news/news_…html articles
    // that only the news index links to.
    const wave2Pool = dedupeLinks(
      wave1Pages.flatMap((p) => p?.links ?? []),
      visited,
    );
    const wave2 = topScoringLinks(wave2Pool, race.title, PASS_2_WAVE_2);
    wave2.forEach((c) => visited.add(c.url));

    if (wave2.length > 0) {
      const wave2Texts = await Promise.all(
        wave2.map((c) => fetchSubPageText(c.url)),
      );
      wave2.forEach((c, i) => {
        const text = wave2Texts[i];
        if (text) sections.push(`=== PAGE: ${c.url} ===\n${text}`);
      });
    }

    // Combined extraction over homepage + wave 1 + wave 2.
    if (sections.length > 1) {
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
