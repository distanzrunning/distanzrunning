// src/lib/firecrawlScrape.ts
//
// Thin shared wrapper around Firecrawl's /v2/scrape REST endpoint —
// used by the race pipelines (raceDateRefresh, raceEnrichment) to
// read pages a plain fetch can't: JS-rendered race sites
// (marathon.tokyo serves "please turn on JavaScript" to fetch but
// 224 KB of rendered markdown to Firecrawl) and Cloudflare-fronted
// hosts that 403 Vercel IPs (marathontours.com).
//
// Deliberately REST-direct (no SDK dependency): one POST, bearer
// key, markdown + links formats. Returns null on ANY failure so
// callers degrade gracefully — a scan should fall back to whatever
// text it already has rather than die on a render timeout.
//
// Cost note: each successful call is ~1 credit. Callers are
// expected to budget (the date-refresh caps Firecrawl fallbacks
// per scan) — don't loop this over a whole sitemap.

const FIRECRAWL_ENDPOINT = "https://api.firecrawl.dev/v2/scrape";
// Rendering a JS-heavy page takes 5–15 s; give the request room
// but keep it comfortably inside the pipelines' 50 s scan budgets.
const FIRECRAWL_TIMEOUT_MS = 25_000;

export interface FirecrawlPage {
  /** Rendered page content as markdown. */
  markdown: string;
  /** Absolute URLs found on the page. */
  links: string[];
}

export function firecrawlConfigured(): boolean {
  return Boolean(process.env.FIRECRAWL_API_KEY);
}

/** Scrape one URL through Firecrawl. Null on failure or when no
 *  FIRECRAWL_API_KEY is configured (callers keep their plain-fetch
 *  result). */
export async function firecrawlScrape(
  url: string,
): Promise<FirecrawlPage | null> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FIRECRAWL_TIMEOUT_MS);
  try {
    const res = await fetch(FIRECRAWL_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown", "links"],
        // Server-side render wait — most race-site SPAs settle well
        // inside this; onlyMainContent keeps nav/footer noise down
        // the same way htmlToText's chrome-stripping does.
        onlyMainContent: true,
        timeout: FIRECRAWL_TIMEOUT_MS - 5_000,
      }),
    });
    if (!res.ok) {
      console.log(`[firecrawl] HTTP ${res.status} for ${url}`);
      return null;
    }
    const data = (await res.json()) as {
      success?: boolean;
      data?: { markdown?: string; links?: string[] };
    };
    if (!data.success || !data.data?.markdown) {
      console.log(`[firecrawl] no markdown for ${url}`);
      return null;
    }
    return {
      markdown: data.data.markdown,
      links: data.data.links ?? [],
    };
  } catch (err) {
    console.log(`[firecrawl] scrape failed for ${url}: ${(err as Error).message}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
