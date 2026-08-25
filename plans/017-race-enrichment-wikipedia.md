# 017 — Race data enrichment (slice 1: Wikipedia course records)

**Goal:** automate populating race-guide data from external sources, with
every value passing through an editor review gate before it touches a real
field. Slice 1 covers the highest-value, zero-cost source: Wikipedia.

## Context

- The date-refresh pipeline (`src/lib/raceDateRefresh.ts` + `/admin/races/
  date-review`) already proves the shape: scan → write read-only suggestion
  fields with source quote + confidence → editor approves/rejects → patch.
- Dataset today (29 published races): all have M/W course records, only
  Tokyo has wheelchair records + field size. Records also go stale every
  year — re-verification is as valuable as gap-filling.
- Wikipedia needs no scraping vendor: the MediaWiki API serves wikitext
  free. Race pages are often non-English (e.g. Sparkasse 3-Länder-Marathon
  exists only on de.wikipedia, with records in the `Streckenrekord` infobox
  param using de-wiki country templates like `{{SWI|…}}` ≠ IOC `SUI`), so
  discovery searches multiple language editions and extraction maps to IOC.

## Architecture (this slice)

1. **`src/lib/iocCountries.ts`** — IOC code list extracted from
   `raceGuideType.ts` into a plain shared module (schema imports it; the
   enrichment validator uses it without pulling `sanity` into lib code).
2. **Schema** (`raceGuide`): new collapsed fieldset "Enrichment
   (auto-scraped)" with:
   - `wikipediaUrl` (url, editable) — editor can pin the right page;
     scanner fills it on first successful discovery.
   - `enrichmentSuggestions` (array, read-only) — one entry per field,
     `_key = field name` (max one suggestion per field, replace-on-rescan):
     `{field, label, value, currentValue, sourceUrl, sourceQuote,
     confidence, scrapedAt, status: pending|rejected}`.
   - `enrichmentLastScanAt` / `enrichmentLastScanLog` (read-only JSON log,
     mirrors `lastScanAt`/`lastScanLog`).
3. **`src/lib/raceEnrichment.ts`** —
   - Discovery: search `en` + the race country's language edition(s),
     score candidates by title-token overlap, fetch best match.
   - Fetch wikitext via `action=parse` (full text ≤ 60 K chars, else lead
     + keyword windows around record/rekord/winner/sieger mentions —
     Boston's records sit at char 23 K of 97 K).
   - Haiku extracts M/W/wheelchair records (time, athlete, IOC country)
     + field size, each with source quote + confidence; a
     `page_is_this_race` guard rejects wrong-page matches (falls through
     to the next candidate).
   - Validation: `HH:MM:SS` normalization (zero-padded, matching existing
     data; trim `\t` junk), IOC code ∈ list, field size sane number.
   - Diffing: values equal to the current field are dropped (logged as
     `unchanged`); values equal to a previously **rejected** suggestion
     are not re-suggested.
4. **`/api/race-enrichment`** — manual/cron batch endpoint, same auth
   shape as `/api/race-date-refresh` (`CRON_SECRET` bearer or
   `?secret=RACE_ENRICHMENT_SECRET`), `dryRun=1` supported.
5. **`/admin/races/enrichment`** — review queue mirroring Date Review:
   table of races (wiki link, pending-count badge, last scanned, Scan
   button), expander with per-field rows: label, current → suggested,
   quote + confidence, Approve / Reject. Approve patches the real field
   (numbers cast) and removes the entry; Reject keeps it as
   `status:"rejected"` so the same value never comes back (Reset clears).

## Slice 2 — Firecrawl official-site source (SHIPPED 2026-08-24)

- `src/lib/firecrawlScrape.ts` — shared /v2/scrape REST wrapper
  (markdown + links, 25 s timeout, null-on-failure).
- Date refresh: plain fetch stays default; pages whose static text is
  a JS shell ("turn on JavaScript" / <800 chars) re-fetch through
  Firecrawl (3 renders/scan budget, logged as `renderer:"firecrawl"`).
  marathontours.com aggregator restored (`/en-us/events/{slug}/`,
  forced render — its Cloudflare 403s plain cloud fetches).
- Enrichment second source: official site rendered via Firecrawl;
  Haiku picks up to 2 info sub-pages from the same-origin link list
  (URL scoring alone kept choosing Berlin's sibling-event
  registration pages), extracts startTime / price+currency /
  expoVenueName / expoAddress into the same review queue. Wikipedia
  miss no longer aborts the scan. Currency list extracted to
  src/lib/currencies.ts (schema + validator share it).
- Verified: Tokyo (JS shell) start time 09:10 / price ¥19,800 / expo
  venue all confirm unchanged, expo address newly suggested; Berlin +
  Copenhagen return honest nulls where sites don't state data.
- NOTE: FIRECRAWL_API_KEY must be added to Vercel envs for prod scans.

## Slice 3 — "Add race" tool + Open-Meteo climate (SHIPPED 2026-08-25)

- Refactor first: generic Wikipedia plumbing (search/score/fetch/budget/
  langlinks) extracted from `raceEnrichment.ts` into `src/lib/wikipedia.ts`
  so both pipelines share one implementation; `extractFromWikitext` +
  its result types exported for reuse. `slugifyTitle` extracted to
  `src/lib/slugify.ts` — and corrected to match Sanity Studio's own
  slugify (ä→ae, not bare diacritic-strip: verified against the
  published "3-laender-marathon" slug).
- `src/lib/climate.ts` — keyless Open-Meteo: `fetchElevation` (single
  point) and `fetchClimateNormals` (month or ±7-day window, averaged
  across the last 5 COMPLETE calendar years, parallel per-year fetches).
  No env var gate — always available.
- `src/lib/raceDiscovery.ts` — new pipeline for `/admin/races/new`:
  duplicate check first (never spends API calls on an existing race) →
  Wikipedia search (or a pasted article URL, skipping search) → identity
  gate + course records/field size via the REUSED `extractFromWikitext`
  → a focused facts prompt (city/country/distance/official site/event
  month/tags — tags constrained to the dataset's existing vocabulary,
  plus a free "World Marathon Majors" category check → Abbott tag) →
  race-category matched by parsing each category's km from its title →
  geocode + elevation + climate (best-effort, degrades to a warning).
  Deliberately does NOT read the official website itself — that stays
  the Enrichment Scan's job once this tool prefills officialWebsite.
- Admin UI `/admin/races/new`: search → fully editable review form
  (nothing written until "Create draft") → `createRaceDraft` writes an
  UNPUBLISHED `drafts.<uuid>` doc (never auto-publishes).
- Enrichment queue relaxed to include "orphan" drafts (no published
  counterpart) — a race created here is immediately scannable for
  start time/price/expo, no logic duplicated between the two tools.
- Verified live end-to-end (real Wikipedia + Haiku + Sanity write, test
  draft deleted after): Rotterdam Marathon and Vienna City Marathon —
  correct title/city/country/distance/category/tags/website/records/
  field size/climate; duplicate check correctly blocked re-adding
  Berlin; the created draft appeared in the Enrichment queue ready to
  scan. Geocode gracefully degrades to a warning without
  MAPBOX_GEOCODING_TOKEN (climate/elevation skip too, since they need
  the resolved point).

## Slice 3b — aggregator sources in "Add race" (SHIPPED 2026-08-25)

- `src/lib/raceAggregators.ts` — three sources filling what Wikipedia
  doesn't state, run in parallel after identity:
  - **World Athletics label calendar** — every label race of the season
    server-rendered as JSON in `__NEXT_DATA__` (name/venue/country/
    startDate/competitionSubgroup). Pure structured matching (token
    score + IOC-country filter + city-in-venue bonus, no LLM) →
    authoritative label-tier tag AND next-edition date. The calendar's
    CURRENT tier supersedes any WA tag from a stale Wikipedia infobox
    (Paris: infobox said Elite, calendar says Gold → Gold only).
  - **finishers.com** — static HTML (slug probe → Firecrawl-search
    fallback for slugs like "utmb-r"): date + explicit "Date
    confirmed" status, bib price + currency, surface, badge strip.
  - **ahotu.com** — Firecrawl search + render: date with start time,
    Strava route embed (elevation gain; route URL surfaced for the
    editor to export the GPX — the gpxFile upload stays manual).
- One combined Haiku pass over the aggregator texts. Two hard-won
  correctness rules: (1) a distance-class guard on all source matching
  ("Manchester Half Marathon" must not match ahotu's "City of
  Manchester Marathon" — a full marathon in New Hampshire); (2) the
  prompt instructs the model to IGNORE a wrong-race source and extract
  from the rest — its first instinct was to refuse entirely when
  sources described different races, discarding the good data too.
- **No-Wikipedia fallback**: when no article exists (the long tail —
  finishers lists manchester-half-marathon, Wikipedia doesn't), the
  aggregators alone establish identity (their match gates verify the
  name) and prefill date/price/surface/profile/location/category;
  course records simply stay empty. Verified: Manchester Half gets
  city/country/distance/category/confirmed-date/surface/profile +
  climate on the exact race-day window.
- Aggregator event date upgrades the climate lookup from whole-month
  to a ±7-day window around race day. Date conflicts: WA wins with a
  warning (Paris: aggregators showed the 2027 open-registration
  edition vs WA's 2026-04-12).
- `src/lib/modelJson.ts` — tolerant model-JSON parsing (fence strip +
  first-balanced-object) after Haiku appended trailing prose once.
- Form gains: Event & course section (event date + confirmed/estimated
  status, start time, price + currency, surface, profile, elevation
  gain), source-provenance notes, Strava GPX pointer.
- WA calendar caveat: fetched plain (no Firecrawl fallback) — if its
  Cloudflare starts 403ing Vercel IPs like marathontours did, label
  checks degrade to a warning.

## Slice 3c — route extraction + preview + attach (SHIPPED 2026-08-25)

- Strava's GPX export is login-walled, but the public embed page the
  ahotu source links (strava-embeds.com/route/<id>) server-renders a
  `__ROUTE_DATA__` JSON blob with the FULLY DECODED route —
  `coordinates` as [lng, lat, ele] triples (Rotterdam: 2,342 points,
  42.65 km, sane elevations). No auth, no polyline decoding.
- `src/lib/stravaRoute.ts` — fetch + parse the embed (id from
  strava.com/routes/<id> or a strava.app.link fallback_url),
  haversine distance, smoothed elevation gain (moving-average before
  positive-sum — raw noise overstates), `routeToGeoJson` (the
  FeatureCollection/LineString shape the race page's gpxFile
  pipeline prefers over GPX), `encodeRoutePolyline` (downsampled
  Google polyline for Mapbox Static Images).
- Discovery: both paths (Wikipedia + aggregator-only) attach a
  `routePreview` (encoded polyline + distance/gain/point stats) when
  a Strava route was found; warns when the route's measured distance
  is >15% off the race distance; fills elevationGain from geometry
  when no aggregator stated it.
- Review form: static Mapbox map of the course (DS accent-blue path)
  + stats + "Attach the route to the draft as a GeoJSON file"
  checkbox (default on). On create, the server RE-FETCHES the embed
  (no thousands of points round-tripping through the client), uploads
  `<slug>-route.geojson` as a Sanity file asset, and sets `gpxFile` —
  best-effort, a failed fetch/upload never loses the reviewed draft
  (degrades to a warning toast). Fetch-failure fallback keeps the old
  "export the GPX by hand" pointer.

## Slice 3d — elevationLoss + stateRegion (SHIPPED 2026-08-25)

- `elevationLoss` computed from the route geometry (same smoothed
  pass as gain, descent sum) — no source ever states it, so the
  geometry fills it whenever the route is trusted. NOT filled when
  the route fails the >15% distance check: ahotu links sibling-event
  courses (Grandma's Marathon page carries the HALF's Strava route),
  and a wrong-distance route must not feed elevation fields. The
  same `distanceMismatch` flag now also defaults the attach
  checkbox to OFF.
- `stateRegion` was already extracted by the Wikipedia facts prompt
  but dropped on the floor — now mapped through result → form →
  draft (verified: Grandma's Marathon → "Minnesota").

## Slice 3e — temporary main image from Wikipedia (SHIPPED 2026-08-25)

- `fetchPageImages` (wikipedia.ts): ALL the article's photos via
  `generator=images` (640px renders + extmetadata licence in one
  call), filtered to JPEG/WebP ≥500×350 — which cleanly drops the
  flags/logos/pictograms/diagram PNGs every article carries
  (Rotterdam: 11 files → 2 photos; Berlin: 7). Lead ("page") image
  sorts first, rest by resolution; cap 12. Unexpanded "{{{1}}}"
  Artist templates dropped.
- Review form: a picker grid (aspect-3/2 tiles, selected = blue
  ring — the DS selection accent), attribution line for the
  SELECTED photo + Commons file-page link, and a "use selected
  image (temporary placeholder)" checkbox (default on; clicking a
  tile re-checks it). Copy says replace before publish.
- On create: server asks MediaWiki for a ≤1600px render of the
  chosen file (`fetchImageRenderUrl` — MediaWiki returns the
  unscaled original when the file is smaller), downloads it
  (Wikimedia-polite UA) and uploads a Sanity image asset with
  `creditLine` ("Erik van Leeuwen — GFDL") and `source`
  ({name: "wikipedia", url: file page}) so provenance survives into
  Studio; sets `mainImage`. Best-effort — failure warns, never
  loses the draft.
- Articles without usable photos degrade to no block.
  Wikipedia-path only (aggregator-only races have no article).

## Slice 3f — "Create & publish" (SHIPPED 2026-08-25)

- Second button next to "Create draft": writes the doc WITHOUT the
  `drafts.` prefix, live immediately. This amends the draft-only
  rule deliberately (user call 2026-08-25): the review form IS the
  human gate, so an explicit editor click may publish — nothing
  automated ever does. Success panel: solid-green "Published" badge
  + "View on site" link. Verified E2E: published Rotterdam rendered
  the full public race page (hero, tags, date) before deletion.

## Entry-price sourcing (investigated + fixed 2026-08-25)

- **finishers.com** carries the bib price ONLY for events its
  marketplace sells, as an FAQ ("What is the price of the bib?")
  near the page END — which the flat 16K head-slice systematically
  truncated (Rome: price at char 19.5K of 21K → "no price stated").
  `budgetFinishersText` now appends the price-FAQ window when it
  falls beyond the cut. Rome: 89 EUR extracted, with finishers' own
  "until <date>" expiry surfaced in the provenance note.
- **ahotu** rarely states a fee; **WA calendar** never does.
- **The official race website is the canonical price source** — and
  the Enrichment scan (slice 2) already extracts price+currency
  from it once the draft exists. Division of labour unchanged: Add
  Race prefills from aggregators when they know it; the Scan
  verifies/fills from the official site.

## Later slices (not this one)
- Parallel.ai Task API (or Anthropic web search) for open-web discovery
  when neither Wikipedia nor the aggregators know the race.
- Wikidata sitelinks as a discovery assist; infobox `Teilnehmer`/
  participants for field size history.

## Slice 3g — surfaceBreakdown (SHIPPED 2026-08-25)

- Aggregator extraction gains `surface_breakdown` — set ONLY when a
  page states the actual terrain composition (asphalt → "100%
  Paved", gravel/dirt → "Unpaved", combination → "Mixed"); the
  prompt forbids inferring it from the race type. When no source
  states it, discovery defaults deterministically from the surface
  class (Road/Track → "100% Paved", Trail/Mountain → "Unpaved",
  Mixed → "Mixed") with a provenance note. New Select in the Event
  & course grid; written to the draft like every other field.
