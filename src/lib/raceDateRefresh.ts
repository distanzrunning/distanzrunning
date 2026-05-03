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
import Browserbase from "@browserbasehq/sdk";
import { createClient } from "next-sanity";
import { chromium, type Browser } from "playwright-core";

export const FETCH_TIMEOUT_MS = 10_000;
// Browserbase render budget — total time allowed for goto +
// content settle. JS-heavy SPAs need a moment after DOMContent-
// Loaded for the date to render.
const BROWSERBASE_GOTO_TIMEOUT_MS = 20_000;
// SPA shell threshold — if plain fetch returns less than this
// many chars after stripping, we suspect a JS-rendered shell
// and escalate to Browserbase. Shanghai's homepage is ~1.2 KB
// of JS bootstrap; a real article is rarely under 2 KB.
const SPA_SHELL_THRESHOLD_CHARS = 2_000;
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
// External aggregator pages get a much larger budget — they're
// pre-curated for race info and the actual date often sits deep
// in the body (WordPress race-tour sites push the date past 25K
// chars of nav/menus/JSON-LD). At Haiku's 200 K context this is
// still comfortable (homepage 30K + wave 1 35K + wave 2 21K +
// 2 sources × 30K ≈ 146K worst case).
const EXTERNAL_SOURCE_CHARS = 30_000;
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

// Strip HTML to plain text. Drops <script>/<style> blocks AND
// site-chrome blocks (<nav>/<header>/<footer>/<aside>) entirely
// — their contents would otherwise eat hundreds of chars on
// WordPress-style sites with sprawling mega-menus, pushing the
// real race-info content past our truncation. After that the
// regex collapses any remaining tags + whitespace.
// Cheap regex pass; cheerio would be tidier but adds 200 KB.
function htmlToText(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ")
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, " ")
    .replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, " ")
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

// Plain fetch — the cheap path. Returns HTML on success or
// throws on network error / non-2xx. Used directly when we don't
// expect JS rendering or CF mitigation; otherwise wrapped by
// fetchHtmlWithFallback which escalates to Browserbase on
// failure indicators.
async function fetchHtmlPlain(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Mozilla-style "compatible" identifier — Cloudflare's bot
        // heuristics flag any UA containing the literal word "Bot",
        // which silently 403'd marathontours.com from Vercel IPs
        // even though the same UA worked from residential IPs.
        // Mirrors the Googlebot pattern: identifies us + the site
        // we're crawling for, but starts with Mozilla/5.0 so CF
        // browser-fingerprint checks don't auto-reject.
        "User-Agent":
          "Mozilla/5.0 (compatible; DistanzRunningCrawler/1.0; +https://distanzrunning.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      // Surface the status in the error so the fallback layer
      // can decide whether to escalate (403/429 = blocked, 5xx =
      // server problem we shouldn't retry through Browserbase).
      const err = new Error(`HTTP ${res.status}`);
      (err as Error & { httpStatus?: number }).httpStatus = res.status;
      throw err;
    }
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

// Browserbase-rendered fetch. Spins up a remote Chromium session,
// loads the URL with JS execution, returns the rendered DOM. Used
// only as a fallback — see fetchHtmlWithFallback for the
// escalation triggers. Browserbase sessions are pay-per-minute,
// so we close immediately after content() to keep cost down.
async function fetchHtmlBrowserbase(url: string): Promise<string> {
  const apiKey = process.env.BROWSERBASE_API_KEY;
  const projectId = process.env.BROWSERBASE_PROJECT_ID;
  if (!apiKey || !projectId) {
    throw new Error("Browserbase credentials not configured");
  }
  const bb = new Browserbase({ apiKey });
  const session = await bb.sessions.create({ projectId });
  let browser: Browser | null = null;
  try {
    browser = await chromium.connectOverCDP(session.connectUrl);
    const context = browser.contexts()[0];
    const page = context.pages()[0] ?? (await context.newPage());
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: BROWSERBASE_GOTO_TIMEOUT_MS,
    });
    return await page.content();
  } finally {
    if (browser) await browser.close();
  }
}

// Two-tier fetch: try plain first (free, fast), escalate to
// Browserbase when the response looks like it'll be useless.
// Triggers:
//   - HTTP 403 or 429 → likely Cloudflare bot mitigation
//                       (marathontours, ahotu) — JS challenge
//                       requires a real browser to solve
//   - HTML strips down to < 2 KB of text → likely a SPA shell
//                       (Shanghai, Bangsaen21, Xiamen) — needs
//                       JS execution to populate the DOM
//
// Falls back gracefully when Browserbase fails or isn't
// configured: returns whatever plain fetch managed to retrieve
// rather than failing the whole scan.
async function fetchHtml(url: string): Promise<string> {
  const browserbaseEnabled =
    Boolean(process.env.BROWSERBASE_API_KEY) &&
    Boolean(process.env.BROWSERBASE_PROJECT_ID) &&
    process.env.BROWSERBASE_DISABLED !== "1";

  let plainHtml: string | null = null;
  let plainError: Error | null = null;
  try {
    plainHtml = await fetchHtmlPlain(url);
  } catch (err) {
    plainError = err as Error;
  }

  // 403 / 429 → escalate immediately (no usable HTML to fall
  // back on).
  if (plainError) {
    const status = (plainError as Error & { httpStatus?: number }).httpStatus;
    if ((status === 403 || status === 429) && browserbaseEnabled) {
      console.log(
        `[date-refresh] escalating to Browserbase (HTTP ${status} on plain fetch): ${url}`,
      );
      try {
        return await fetchHtmlBrowserbase(url);
      } catch (bbErr) {
        console.log(
          `[date-refresh] Browserbase failed for ${url}: ${(bbErr as Error).message}`,
        );
        throw plainError;
      }
    }
    throw plainError;
  }

  // SPA shell detection — if stripped text is suspiciously small,
  // the page is almost certainly JS-rendered. Escalate but keep
  // plainHtml as a fallback if Browserbase fails.
  if (plainHtml && browserbaseEnabled) {
    const stripped = htmlToText(plainHtml);
    if (stripped.length < SPA_SHELL_THRESHOLD_CHARS) {
      console.log(
        `[date-refresh] escalating to Browserbase (SPA shell, ${stripped.length} chars stripped): ${url}`,
      );
      try {
        return await fetchHtmlBrowserbase(url);
      } catch (bbErr) {
        console.log(
          `[date-refresh] Browserbase failed for ${url}, returning plain shell: ${(bbErr as Error).message}`,
        );
        return plainHtml;
      }
    }
  }

  return plainHtml!;
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

Read the website text below and find the date of the NEXT edition of THIS specific race.

CRITICAL — what counts as "the race date":
- A date clearly identified as the day THE RACE ITSELF is run. Common patterns that count include:
  * "will be held on [date]" / "scheduled for [date]" / "takes place on [date]" / "race day is [date]" / "starts on [date]"
  * "[Race name] on [date]" or "[Race name] [date]" — e.g. "Take on the Xiamen Marathon on January 10, 2027" or "Boston Marathon — April 19, 2027"
  * "[date]: [Race name]" — e.g. headline-style framing
  * A date prominently displayed as THE event date in a hero/lockup/header for the race
- IGNORE dates of adjacent / auxiliary events:
  * article publish / news publication dates (e.g. an article published 2026-04-15 — that's when the announcement went out, not the race day)
  * expo dates, packet pickup, opening ceremonies
  * rehearsals, dress rehearsals, demonstration flights / displays (e.g. "Blue Impulse flight on …")
  * registration deadlines, lottery draws, charity application closings
  * sibling races held by the same organiser (e.g. half marathon vs marathon)
- If multiple candidate dates appear and you can't pick THE race date with high confidence, RETURN NULL. False precision is worse than no answer — an editor will manually fix nulls but might miss a confident-but-wrong suggestion.

Format / language notes:
- The text may be in any language (English, Japanese, Spanish, German, Chinese, etc.). Interpret regardless. Date formats vary: "March 7, 2027", "07.03.2027", "2027年3月7日", "07/03/2027", "7 March 2027". Always resolve to YYYY-MM-DD.
- The text may include content from multiple sub-pages (separated by markers like "=== PAGE: …"). Cross-reference: a date that's stated identically across multiple pages is more trustworthy than one that appears only in a single news article about an auxiliary event.

Confidence levels:
- "high"   = explicit "${race.title} will be held on YYYY-MM-DD" phrasing in primary content (homepage hero, race info page).
- "medium" = clear mention but only on one auxiliary page, or phrasing slightly indirect.
- "low"    = inferred / partially ambiguous. PREFER returning null over a "low" confidence guess.

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

// Third-party race aggregators we probe alongside the official
// site during Pass 2. Each source exposes events at a predictable
// slug-based URL, and serves the next-edition date in static HTML
// (good signal when the official site is a SPA, JS-renders its
// news, or just doesn't surface the next date prominently).
//
// All sources are fetched in parallel with the wave-2 sub-page
// fetches via Promise.all, so adding a source costs nothing in
// wall-time as long as it doesn't outlive the slowest wave-2 hit.
//
// Adding a new source = one entry here. `buildUrl` should return
// a fully-qualified URL given a kebab-cased slug; the slug-→URL
// shape is consistent enough across aggregators that this is
// usually a one-liner.
interface ExternalSource {
  name: string;
  buildUrl: (slug: string) => string;
}

const EXTERNAL_SOURCES: ExternalSource[] = [
  {
    name: "finishers.com",
    buildUrl: (slug) => `https://www.finishers.com/en/event/${slug}`,
  },
  {
    name: "marathontours.com",
    buildUrl: (slug) => `https://marathontours.com/en-us/events/${slug}/`,
  },
];

function slugifyRaceTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    // strip diacritics (è → e) so titles with accents still match
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Distinctive title words used to verify a fetched aggregator
// page is actually about the right race. 4+ chars to skip
// "the"/"of"/etc.; matched case-insensitively against page text.
function distinctiveTitleWords(title: string): string[] {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 4);
}

// Fetch a single aggregator's event page. Returns text only when
// (a) the request succeeds and (b) the response actually mentions
// the race — without that sanity check, slug collisions could
// feed Haiku a totally unrelated event's page and we'd suggest
// the wrong date.
//
// Logs every attempt so we can diagnose Cloudflare-blocked
// fetches, slug mismatches, and sanity-check rejections from
// Vercel runtime logs (most failures here are silent — fetch
// errors caught + null returned — without this telemetry).
async function fetchExternalSourceText(
  source: ExternalSource,
  raceTitle: string,
  distinctive: string[],
): Promise<{ url: string; text: string; sourceName: string } | null> {
  const slug = slugifyRaceTitle(raceTitle);
  if (!slug) {
    console.log(`[date-refresh] ${source.name} skipped: empty slug for "${raceTitle}"`);
    return null;
  }
  const url = source.buildUrl(slug);
  try {
    const html = await fetchHtml(url);
    const text = htmlToText(html).slice(0, EXTERNAL_SOURCE_CHARS);
    const lowerText = text.toLowerCase();
    const matchedWord = distinctive.find((w) => lowerText.includes(w));
    if (!matchedWord) {
      console.log(
        `[date-refresh] ${source.name} sanity-check failed for "${raceTitle}" at ${url} (text length: ${text.length}, distinctive words: ${distinctive.join(",")})`,
      );
      return null;
    }
    console.log(
      `[date-refresh] ${source.name} OK for "${raceTitle}" at ${url} (text length: ${text.length}, matched: ${matchedWord})`,
    );
    return { url, text, sourceName: source.name };
  } catch (err) {
    console.log(
      `[date-refresh] ${source.name} fetch failed for "${raceTitle}" at ${url}: ${(err as Error).message}`,
    );
    return null;
  }
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

    // Run wave 2 fetches AND every EXTERNAL_SOURCES probe in
    // parallel — independent third-party sources have no
    // dependency on the official-site fetches, so combining the
    // awaits means external sources add no wall-time cost when
    // wave 2 also runs (only the slowest fetch in the group is
    // on the critical path).
    const distinctive = distinctiveTitleWords(race.title);
    const [wave2Texts, externalResults] = await Promise.all([
      Promise.all(wave2.map((c) => fetchSubPageText(c.url))),
      Promise.all(
        EXTERNAL_SOURCES.map((s) =>
          fetchExternalSourceText(s, race.title, distinctive),
        ),
      ),
    ]);

    wave2.forEach((c, i) => {
      const text = wave2Texts[i];
      if (text) sections.push(`=== PAGE: ${c.url} ===\n${text}`);
    });
    externalResults.forEach((result) => {
      if (result) {
        sections.push(
          `=== PAGE: ${result.url} (third-party aggregator: ${result.sourceName}) ===\n${result.text}`,
        );
      }
    });

    // Combined extraction over homepage + wave 1 + wave 2 +
    // every external aggregator that returned a sane match.
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

  // Reject "low" confidence suggestions — better to return
  // no_date_found than a confident-but-wrong date. Tokyo's
  // off-by-one (March 6 picked from a Blue Impulse rehearsal
  // article rather than the actual race day) is the cautionary
  // tale: an editor would have to notice the wrong date manually,
  // whereas a null forces them to verify themselves anyway.
  if (extraction.confidence === "low") {
    return {
      _id: race._id,
      title: race.title,
      status: "no_date_found",
      message: `Low confidence — ${extraction.reasoning}`,
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
