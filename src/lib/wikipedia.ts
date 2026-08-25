// src/lib/wikipedia.ts
//
// Generic MediaWiki API plumbing shared by every Wikipedia-backed
// pipeline: raceEnrichment.ts (verify/refresh an EXISTING race) and
// raceDiscovery.ts (find/create a NEW race). Nothing here knows
// about Sanity or the raceGuide schema — it's pure "search/fetch/
// score a Wikipedia page" utility, extracted 2026-08-25 when the
// second consumer arrived.
//
// Discovery is multi-language by design: many races only have an
// article on their home-country edition (Sparkasse 3-Länder-Marathon
// exists solely on de.wikipedia), and non-English editions often
// title the race with the LOCAL city name (fr.wikipedia's "20 km de
// Genève", not "Geneva"). scoreCandidate + searchLanguage encode the
// lessons from shipping raceEnrichment's discovery: unspaced units
// ("20km" vs "20 km"), city-name localization via langlinks, and a
// city-credit gate so bare city articles don't crowd out the race
// page.

export const WIKI_FETCH_TIMEOUT_MS = 8_000;

const WIKI_HEADERS = {
  "User-Agent":
    "DistanzRunningEnrichment/1.0 (https://distanzrunning.com; info@distanzrunning.com)",
};

export async function fetchWikiJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    WIKI_FETCH_TIMEOUT_MS,
  );
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

export function languagesFor(country: string | undefined): string[] {
  const extra = country ? (COUNTRY_LANGS[country] ?? []) : [];
  return [...new Set(["en", ...extra])];
}

export interface WikiPageCandidate {
  title: string;
  lang: string;
  score: number;
}

export function normalizeForMatch(s: string): string {
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
export function digitSplitTitle(s: string): string {
  return s
    .replace(/(\d)([A-Za-z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2");
}

/** Token-overlap score between a query title and a candidate page
 *  title. Sponsor prefixes ("Sparkasse …") and suffixes shift
 *  tokens but overlap still ranks the right page first; a small
 *  penalty for unmatched page-title tokens demotes near-miss
 *  sibling articles ("List of winners of the Berlin Marathon").
 *  cityForms carries a known city in every spelling (English +
 *  localized — "geneva"/"geneve") so a local-language title gets
 *  city credit its raw tokens can't ("20 km de Genève" over "20 km
 *  de Lausanne"). */
export function scoreCandidate(
  queryTitle: string,
  pageTitle: string,
  cityForms: string[] = [],
): number {
  const queryTokens = new Set(normalizeForMatch(queryTitle).split(" "));
  const pageTokens = new Set(normalizeForMatch(pageTitle).split(" "));
  const cityTokens = new Set(
    cityForms.flatMap((c) => normalizeForMatch(c).split(" ")),
  );
  let hits = 0;
  let nonCityHits = 0;
  for (const t of queryTokens) {
    if (!pageTokens.has(t)) continue;
    hits += 1;
    if (!cityTokens.has(t)) nonCityHits += 1;
  }
  const misses = pageTokens.size - hits;
  let score = hits * 4 - misses;
  // City credit (any known spelling — "geneva"/"geneve") ONLY when
  // the page also matches a non-city query token; without that gate
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

/** A city's name on another language edition, via the en city
 *  article's langlinks ("Geneva" → fr "Genève", de "Genf"). Null
 *  when unknown — search then just runs the English forms. */
export async function localizedCityName(
  city: string,
  lang: string,
): Promise<string | null> {
  if (lang === "en") return null;
  const url =
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(city)}` +
    `&prop=langlinks&lllang=${lang}&redirects=1&format=json&formatversion=2`;
  try {
    const data = (await fetchWikiJson(url)) as {
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
export async function wikiSearch(
  lang: string,
  query: string,
): Promise<string[]> {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=query&list=search` +
    `&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&formatversion=2`;
  try {
    const data = (await fetchWikiJson(url)) as {
      query?: { search?: { title: string }[] };
    };
    return (data.query?.search ?? []).map((s) => s.title);
  } catch {
    return [];
  }
}

/** Search one language edition for candidates matching queryTitle,
 *  scored by token overlap (+ localized-city credit when `city` is
 *  given). Handles the two proven gotchas: unspaced units ("20km")
 *  and non-English editions titling by the local city name. */
export async function searchWikiLanguage(
  lang: string,
  queryTitle: string,
  city: string | undefined,
): Promise<WikiPageCandidate[]> {
  // Query both the raw title and its digit-split variant when they
  // differ — en.wikipedia's search misses "20km of Brussels" but
  // finds "20 km of Brussels".
  const queries = new Set([queryTitle, digitSplitTitle(queryTitle)]);
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
      const bare = normalizeForMatch(queryTitle)
        .split(" ")
        .filter((t) => !cityTokens.has(t) && !connectors.has(t));
      queries.add(`${bare.join(" ")} ${localized}`.trim());
    }
  }

  const perQuery = await Promise.all(
    [...queries].map((q) => wikiSearch(lang, q)),
  );
  const seen = new Set<string>();
  const merged: WikiPageCandidate[] = [];
  for (const title of perQuery.flat()) {
    if (seen.has(title)) continue;
    seen.add(title);
    merged.push({
      title,
      lang,
      score: scoreCandidate(queryTitle, title, cityForms),
    });
  }
  return merged;
}

export function wikiPageUrl(lang: string, title: string): string {
  return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(
    title.replace(/ /g, "_"),
  )}`;
}

/** Parse a wikipedia.org article URL back into {lang, title}. */
export function parseWikipediaUrl(
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

export async function fetchWikitext(
  lang: string,
  title: string,
): Promise<{ wikitext: string; canonicalTitle: string }> {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=parse` +
    `&page=${encodeURIComponent(title)}&prop=wikitext&redirects=1&format=json&formatversion=2`;
  const data = (await fetchWikiJson(url)) as {
    parse?: { title: string; wikitext: string };
    error?: { info?: string };
  };
  if (!data.parse) {
    throw new Error(data.error?.info ?? `No parse result for ${title}`);
  }
  return { wikitext: data.parse.wikitext, canonicalTitle: data.parse.title };
}

// Full-wikitext budget. Most race articles are 15–40 K chars; pages
// over budget (Boston: 97 K, records at char 23 K) fall back to
// lead + keyword windows so the record tables still make it in.
const MAX_WIKITEXT_CHARS = 60_000;
const LEAD_CHARS = 20_000;
const KEYWORD_WINDOW_CHARS = 6_000;
const KEYWORD_WINDOW_LIMIT = 8;

/** Fit wikitext into budget. Small pages pass whole; big pages keep
 *  the lead (infobox included) + windows around record/winner
 *  keyword hits so deep record tables survive the cut. */
export function budgetWikitext(wikitext: string): {
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

/** Sister-language editions of a page, via its langlinks. */
export async function fetchLangLinks(
  lang: string,
  title: string,
): Promise<{ lang: string; title: string }[]> {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=query&prop=langlinks` +
    `&titles=${encodeURIComponent(title)}&lllimit=50&redirects=1&format=json&formatversion=2`;
  try {
    const data = (await fetchWikiJson(url)) as {
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
export async function fetchPageLength(
  lang: string,
  title: string,
): Promise<number> {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=query&prop=info` +
    `&titles=${encodeURIComponent(title)}&redirects=1&format=json&formatversion=2`;
  try {
    const data = (await fetchWikiJson(url)) as {
      query?: { pages?: { length?: number }[] };
    };
    return data.query?.pages?.[0]?.length ?? 0;
  } catch {
    return 0;
  }
}

/** Wikipedia category titles for a page — used to detect
 *  editorially-significant labels Wikipedia itself curates (e.g.
 *  "Category:World Marathon Majors") more reliably than free-text
 *  scanning. */
export async function fetchPageCategories(
  lang: string,
  title: string,
): Promise<string[]> {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=query&prop=categories` +
    `&titles=${encodeURIComponent(title)}&cllimit=100&redirects=1&format=json&formatversion=2`;
  try {
    const data = (await fetchWikiJson(url)) as {
      query?: { pages?: { categories?: { title: string }[] }[] };
    };
    return (data.query?.pages?.[0]?.categories ?? []).map((c) =>
      c.title.replace(/^Category:/, ""),
    );
  } catch {
    return [];
  }
}

/** Photo candidates from a Wikipedia article — offered by Add Race
 *  as TEMPORARY mainImage placeholders. JPEG-only ≥500×350 filters
 *  out the flags/logos/icons/diagrams every article carries; the
 *  lead ("page") image sorts first, the rest by resolution.
 *  thumbUrl is a ≤640px render for the picker grid — the upload
 *  step asks for its own ≤1600px render via fetchImageRenderUrl. */
export interface WikiPageImage {
  lang: string;
  thumbUrl: string;
  fileName: string;
  filePageUrl: string;
  width: number;
  height: number;
  license?: string;
  artist?: string;
}

const stripHtmlTags = (s: string) =>
  s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

export async function fetchPageImages(
  lang: string,
  title: string,
): Promise<WikiPageImage[]> {
  try {
    const [leadData, listData] = await Promise.all([
      fetchWikiJson(
        `https://${lang}.wikipedia.org/w/api.php?action=query&prop=pageimages` +
          `&piprop=name&titles=${encodeURIComponent(title)}&redirects=1&format=json&formatversion=2`,
      ) as Promise<{
        query?: { pages?: { pageimage?: string }[] };
      }>,
      fetchWikiJson(
        `https://${lang}.wikipedia.org/w/api.php?action=query&generator=images` +
          `&titles=${encodeURIComponent(title)}&gimlimit=50` +
          `&prop=imageinfo&iiprop=url%7Csize%7Cmime%7Cextmetadata&iiurlwidth=640` +
          `&redirects=1&format=json&formatversion=2`,
      ) as Promise<{
        query?: {
          pages?: {
            title?: string;
            imageinfo?: {
              mime?: string;
              width?: number;
              height?: number;
              thumburl?: string;
              thumbwidth?: number;
              thumbheight?: number;
              extmetadata?: Record<string, { value?: string }>;
            }[];
          }[];
        };
      }>,
    ]);
    const leadFile = leadData.query?.pages?.[0]?.pageimage;
    const images: (WikiPageImage & { area: number })[] = [];
    for (const page of listData.query?.pages ?? []) {
      const ii = page.imageinfo?.[0];
      if (!ii?.thumburl || !page.title) continue;
      // Photos are JPEG (occasionally WebP); SVG/PNG are flags,
      // logos, pictograms, and map diagrams.
      if (ii.mime !== "image/jpeg" && ii.mime !== "image/webp") continue;
      if ((ii.width ?? 0) < 500 || (ii.height ?? 0) < 350) continue;
      const fileName = page.title.replace(/^[^:]+:/, "");
      const md = ii.extmetadata;
      images.push({
        lang,
        thumbUrl: ii.thumburl,
        fileName,
        filePageUrl: `https://${lang}.wikipedia.org/wiki/File:${encodeURIComponent(fileName)}`,
        width: ii.thumbwidth ?? ii.width ?? 0,
        height: ii.thumbheight ?? ii.height ?? 0,
        license: md?.LicenseShortName?.value
          ? stripHtmlTags(md.LicenseShortName.value)
          : undefined,
        // Unexpanded wikitext templates ("{{{1}}}") sometimes leak
        // into Artist — drop those rather than show them.
        artist:
          md?.Artist?.value && !md.Artist.value.includes("{{")
            ? stripHtmlTags(md.Artist.value).slice(0, 120)
            : undefined,
        area: (ii.width ?? 0) * (ii.height ?? 0),
      });
    }
    images.sort((a, b) => {
      const aLead = a.fileName === leadFile ? 1 : 0;
      const bLead = b.fileName === leadFile ? 1 : 0;
      if (aLead !== bLead) return bLead - aLead;
      return b.area - a.area;
    });
    return images.slice(0, 12).map(({ area: _area, ...img }) => img);
  } catch {
    return [];
  }
}

/** Render URL for one file at the given width — MediaWiki returns
 *  the unscaled original when the file is smaller than asked. */
export async function fetchImageRenderUrl(
  lang: string,
  fileName: string,
  width = 1600,
): Promise<string | null> {
  try {
    const data = (await fetchWikiJson(
      `https://${lang}.wikipedia.org/w/api.php?action=query` +
        `&titles=${encodeURIComponent(`File:${fileName}`)}` +
        `&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json&formatversion=2`,
    )) as {
      query?: { pages?: { imageinfo?: { thumburl?: string; url?: string }[] }[] };
    };
    const ii = data.query?.pages?.[0]?.imageinfo?.[0];
    return ii?.thumburl ?? ii?.url ?? null;
  } catch {
    return null;
  }
}
