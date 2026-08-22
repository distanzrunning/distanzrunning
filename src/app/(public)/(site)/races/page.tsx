// src/app/(public)/(site)/races/page.tsx
//
// Server component. URL-driven filter rewrite — filter state lives in
// the URL. parseFilters reads searchParams into a typed RaceFilters
// object; buildQueryParams turns that into the GROQ parameters that
// raceIndexQuery's `!defined($x) || …` predicates consume.
// FiltersShell is a thin client island that renders the filter row
// and switches the grid for a skeleton while router.replace()
// round-trips the next searchParams set through the server.
//
// Two views, both URL-driven (?view=map):
//   - grid (default): max-w-content column — header, filter strip,
//     RaceCard chrome="card" grid, three per row on desktop.
//   - map: full-bleed Mapbox canvas between the masthead and footer
//     (viewport-height section), with the page header + subheader +
//     controls + filter strip in a floating material panel above the
//     map. Marker coordinates come from server-side geocoding of
//     (city, state, country) — 24h-cached per address in lib/geocode.

import { format } from "date-fns";

import { sanityFetch } from "@/sanity/lib/live";
import {
  buildRaceIndexQuery,
  raceCountQuery,
} from "@/sanity/queries/raceIndexQuery";
import { raceCountriesQuery } from "@/sanity/queries/raceCountriesQuery";
import { raceCitiesQuery } from "@/sanity/queries/raceCitiesQuery";
import { raceTagsQuery } from "@/sanity/queries/raceTagsQuery";
import { geocodeAddress, geocodeCountryBounds } from "@/lib/geocode";
import RaceGrid, { type RaceIndexItem } from "./RaceGrid";
import RaceExploreMap, { type MapRace } from "./RaceExploreMap";
import MapViewport from "./MapViewport";
import RacePagination from "./RacePagination";
import RaceUnitControls from "./RaceUnitControls";
import FiltersShell from "./FiltersShell";
import ViewSwitch from "./ViewSwitch";
import {
  buildFilterParams,
  buildQueryParams,
  getSort,
  parseFilters,
} from "./filters";

export const metadata = {
  title: "Races — Distanz Running",
  description:
    "Find your next race. Curated race guides with course analysis, insider tips, and editorial coverage.",
};

export const revalidate = 60;

// Grid page size — eight rows of the 3-up desktop grid (user call
// 2026-08-22). The map view is never paginated.
const PAGE_SIZE = 24;

export default async function RacesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const queryParams = buildQueryParams(filters);
  const view: "grid" | "map" = sp.view === "map" ? "map" : "grid";

  // Pagination (grid only — the map always renders the full filtered
  // set for its markers). Page size 24 = eight rows of the 3-up grid.
  const page = view === "grid" ? (filters.page ?? 1) : 1;
  const raceIndexQuery = buildRaceIndexQuery(
    getSort(filters),
    view === "grid"
      ? { offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE }
      : undefined,
  );

  // Run the filtered race fetch + total count + unfiltered country /
  // city / tag option lists in parallel — the option lists need
  // every choice regardless of which filters are applied. State
  // doesn't need a data fetch — it uses a hardcoded canonical US
  // states list from src/lib/usStates.ts.
  const [raceResult, countResult, countriesResult, citiesResult, tagsResult] =
    await Promise.all([
      sanityFetch({ query: raceIndexQuery, params: queryParams }),
      sanityFetch({ query: raceCountQuery, params: queryParams }),
      sanityFetch({ query: raceCountriesQuery }),
      sanityFetch({ query: raceCitiesQuery }),
      sanityFetch({ query: raceTagsQuery }),
    ]);
  const races = (raceResult.data ?? []) as RaceIndexItem[];
  const totalRaces = (countResult.data ?? 0) as number;
  const totalPages = Math.max(1, Math.ceil(totalRaces / PAGE_SIZE));
  const countries = (countriesResult.data ?? []) as string[];
  const tags = (tagsResult.data ?? []) as string[];

  // Dedupe {city, country, state} triples — Sanity returns one
  // row per race and we want one row per unique city. First
  // match wins for the associated country / state, which is
  // fine as long as cities don't legitimately span multiple
  // countries in our data.
  const rawCities = (citiesResult.data ?? []) as {
    city: string;
    country: string;
    state?: string | null;
  }[];
  const cities = dedupeByKey(rawCities, "city")
    .map((c) => ({
      city: c.city,
      country: c.country,
      state: c.state ?? undefined,
    }))
    .sort((a, b) => a.city.localeCompare(b.city));

  // View-switch hrefs — current filters preserved, view toggled.
  // Built server-side so the ViewSwitch island stays Suspense-free.
  // The map href drops City / State / Sort (those filters don't
  // exist on the map — see FiltersShell's view prop), so switching
  // never carries invisible filter state.
  const filterQs = buildFilterParams(filters).toString();
  const mapFilterQs = buildFilterParams({
    ...filters,
    city: undefined,
    state: undefined,
    sort: undefined,
    page: undefined,
  }).toString();
  const gridHref = filterQs ? `/races?${filterQs}` : "/races";
  const mapHref = `/races?${mapFilterQs ? `${mapFilterQs}&` : ""}view=map`;

  // Page hrefs — current filters preserved, page normalised (absent
  // for page 1, so the canonical first page stays /races).
  const hrefForPage = (n: number) => {
    const qs = buildFilterParams({
      ...filters,
      page: n >= 2 ? n : undefined,
    }).toString();
    return qs ? `/races?${qs}` : "/races";
  };

  const filtersShell = (
    skeletonOnPending: boolean,
    children: React.ReactNode,
  ) => (
    <FiltersShell
      initialFilters={filters}
      countries={countries}
      cities={cities}
      tags={tags}
      skeletonOnPending={skeletonOnPending}
      view={view}
    >
      {children}
    </FiltersShell>
  );

  // ---- Map view — full-bleed canvas + floating control panel ------------
  if (view === "map") {
    // Country filter active → the camera frames the WHOLE country,
    // not just the pin cluster (user call 2026-08-21). Fetched in
    // parallel with the per-race geocoding; null (no filter, unknown
    // country, antimeridian-wrapping bbox) falls back to pin-fit.
    const [mapRaces, countryBounds] = await Promise.all([
      geocodeRaces(races),
      filters.country ? geocodeCountryBounds(filters.country) : null,
    ]);

    // Floating chrome — header + subheader + controls on one material
    // surface above the map (menu register: surface + shadow + 12px,
    // no border). pointer-events split so the map stays draggable
    // everywhere outside the panel itself. races-panel-in:
    // settle-down entrance on the house curve — with the switch's
    // LoadingBar and the map fade, the grid→map swap reads as one
    // motion. data-races-panel: RaceExploreMap measures this panel's
    // bottom edge to fit the initial globe in the strip of map
    // visible BELOW it.
    const panel = (
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
        <div className="mx-auto w-full max-w-content px-4 pt-4 md:pt-6">
          <div
            data-races-panel
            className="races-panel-in material-menu pointer-events-auto flex flex-col gap-4 p-4 md:p-5"
          >
            <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
              <div className="flex min-w-0 flex-col gap-1">
                <h1 className="m-0 text-heading-24 text-textDefault">Races</h1>
                <p className="hidden text-copy-14 text-textSubtle md:block">
                  Find your next race. Explore the world&apos;s greatest races
                  with detailed race guides.
                </p>
              </div>
              {/* min-w-0 + wrap, not shrink-0: the row must be able
                  to shrink for flex-wrap to engage — with shrink-0
                  the view switch overflowed the panel edge on
                  mobile instead of wrapping. */}
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <RaceUnitControls />
                <ViewSwitch view="map" gridHref={gridHref} mapHref={mapHref} />
              </div>
            </header>
            {filtersShell(false, null)}
          </div>
        </div>
      </div>
    );

    return (
      // MapViewport measures the real viewport remainder (the
      // dismissible announcement banner makes any static calc wrong)
      // so the section — and the map's corner zoom controls — end
      // exactly at the viewport bottom. Footer stays below the fold
      // (no newsletter band on this route — it lives in the
      // (with-newsletter) group).
      <MapViewport panel={panel}>
        <div className="absolute inset-0">
          <RaceExploreMap races={mapRaces} countryBounds={countryBounds} />
        </div>
      </MapViewport>
    );
  }

  // ---- Grid view (default) ----------------------------------------------
  // No cold-load skeleton gate: the grid is server-rendered with LQIP
  // blur placeholders, so the real page IS the first paint.
  // FiltersShell keeps its own 250ms-delayed skeleton for filter
  // round-trips.
  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-12 px-4 py-12 md:py-16 lg:py-20">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="flex flex-col gap-3">
          {/* Page title is wayfinding chrome — UI heading register
              (600), like the homepage section headers one size up. */}
          <h1 className="m-0 text-balance text-heading-40 text-textDefault md:text-heading-48">
            Races
          </h1>
          <p className="max-w-2xl text-copy-16 text-textSubtle md:text-copy-18">
            Find your next race. Explore thousands of the world&apos;s greatest
            races with detailed race guides, course analysis, local tips and
            recommendations.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <RaceUnitControls />
          <ViewSwitch view="grid" gridHref={gridHref} mapHref={mapHref} />
        </div>
      </header>

      {filtersShell(true, <RaceGrid races={races} />)}

      {/* Outside FiltersShell so the 250ms pending-skeleton swap
          doesn't tear it down; a filter change lands on page 1 via
          setFilter dropping the page param. */}
      <RacePagination
        page={page}
        totalPages={totalPages}
        hrefForPage={hrefForPage}
      />
    </div>
  );
}

// Geocode each filtered race's (city, state, country) into marker
// coordinates. lib/geocode caches per address for 24h at the fetch
// layer, so steady-state renders hit no network; races the geocoder
// can't place are simply left off the map.
// Coordinates come from the stored `location` geopoint (backfilled
// 2026-08-22; bulk importers set it directly — at 1000s of races,
// per-request geocoding is the wrong shape). The Mapbox geocode is
// only the FALLBACK for races missing the field, so new hand-entered
// races still pin immediately.
async function geocodeRaces(races: RaceIndexItem[]): Promise<MapRace[]> {
  const results = await Promise.all(
    races.map(async (race): Promise<MapRace | null> => {
      const stored =
        race.lat != null && race.lng != null
          ? { lat: race.lat, lng: race.lng }
          : null;
      const address = [race.city, race.stateRegion, race.country]
        .filter(Boolean)
        .join(", ");
      const coords = stored ?? (await geocodeAddress(address));
      if (!coords) return null;
      const location = [race.city, race.country].filter(Boolean).join(", ");
      return {
        _id: race._id,
        title: race.title,
        href: race.href,
        lng: coords.lng,
        lat: coords.lat,
        dateLabel: race.eventDate
          ? safeFormat(race.eventDate, "d MMM, yyyy")
          : undefined,
        location: location || undefined,
        category: race.category,
        // EXACT tag match (case-insensitive): the dataset also holds
        // "AbbottWMM Candidate" / "AbbottWMM MTT Age Group
        // Qualifiers", which must NOT get the gold star.
        major:
          race.tags?.some(
            (t) => t.trim().toLowerCase() === "abbott world marathon major",
          ) ?? false,
      };
    }),
  );
  return results.filter((r): r is MapRace => r !== null);
}

function safeFormat(iso: string, pattern: string): string | undefined {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : format(d, pattern);
}

// Generic dedupe-by-string-key helper used to collapse the
// per-race rows from raceCitiesQuery down to one row per unique
// city. First match wins.
function dedupeByKey<T, K extends keyof T>(rows: T[], key: K): T[] {
  const seen = new Set<T[K]>();
  return rows.filter((row) => {
    const v = row[key];
    if (seen.has(v)) return false;
    seen.add(v);
    return true;
  });
}
