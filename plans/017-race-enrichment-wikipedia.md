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

## Later slices (not this one)

- Official-site scraping upgrade via Firecrawl (JS-rendered sites), for
  price / start time / expo fields.
- Parallel.ai Task API (or Anthropic web search) for open-web discovery
  where no URL is known, and for the "create a new race guide from a
  name" flow (writes Sanity **drafts**, never publishes).
- Open-Meteo climate lookups for averageTemperature / humidity / altitude
  from the stored geopoint + event date (deterministic, no scraping).
- Wikidata sitelinks as a discovery assist; infobox `Teilnehmer`/
  participants for field size history.
