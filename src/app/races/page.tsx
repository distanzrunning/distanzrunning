// src/app/races/page.tsx
//
// Server component. URL-driven filter rewrite — replaces the
// 4,500-line "use client" RaceGuidesClient monolith that
// hydration-flickered the race grid + filter row on every reload.
//
// Filter state lives in the URL. parseFilters reads searchParams
// into a typed RaceFilters object; buildQueryParams turns that into
// the GROQ parameters that raceIndexQuery's `!defined($x) || …`
// predicates consume. FiltersShell is a thin client island that
// renders the filter row and switches the grid for a skeleton while
// router.replace() round-trips the next searchParams set through the
// server. The previous implementation lives at /races-legacy for
// side-by-side reference until the rewrite is complete.

import { sanityFetch } from "@/sanity/lib/live";
import { raceIndexQuery } from "@/sanity/queries/raceIndexQuery";
import { raceCountriesQuery } from "@/sanity/queries/raceCountriesQuery";
import { raceCitiesQuery } from "@/sanity/queries/raceCitiesQuery";
import { raceTagsQuery } from "@/sanity/queries/raceTagsQuery";
import RaceGrid, { type RaceIndexItem } from "./RaceGrid";
import RaceUnitControls from "./RaceUnitControls";
import FiltersShell from "./FiltersShell";
import FullPageSkeleton from "./FullPageSkeleton";
import InitialLoadShell from "./InitialLoadShell";
import { buildQueryParams, parseFilters } from "./filters";

export const metadata = {
  title: "Races — Distanz Running",
  description:
    "Find your next race. Curated race guides with course analysis, insider tips, and editorial coverage.",
};

export const revalidate = 60;

export default async function RacesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const queryParams = buildQueryParams(filters);

  // Run the filtered race fetch + unfiltered country / city / tag
  // option lists in parallel — the option lists need every choice
  // regardless of which filters are applied. State doesn't need a
  // data fetch — it uses a hardcoded canonical US states list
  // from src/lib/usStates.ts.
  const [raceResult, countriesResult, citiesResult, tagsResult] =
    await Promise.all([
      sanityFetch({ query: raceIndexQuery, params: queryParams }),
      sanityFetch({ query: raceCountriesQuery }),
      sanityFetch({ query: raceCitiesQuery }),
      sanityFetch({ query: raceTagsQuery }),
    ]);
  const races = (raceResult.data ?? []) as RaceIndexItem[];
  const countries = (countriesResult.data ?? []) as string[];
  const tags = (tagsResult.data ?? []) as string[];

  // Dedupe city/country pairs — Sanity returns one row per race
  // and we want one row per unique city. First match wins for the
  // associated country, which is fine as long as cities don't
  // legitimately span multiple countries in our data.
  const rawCities = (citiesResult.data ?? []) as {
    city: string;
    country: string;
  }[];
  const cities = dedupeByKey(rawCities, "city").sort((a, b) =>
    a.city.localeCompare(b.city),
  );

  return (
    <InitialLoadShell skeleton={<FullPageSkeleton />}>
      <div className="flex w-full flex-col items-center px-4 py-12 md:py-16 lg:py-20">
        <div className="flex w-full max-w-[1400px] flex-col gap-12">
          <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
            <div className="flex flex-col gap-3">
              <h1 className="m-0 text-balance text-heading-40 text-[color:var(--ds-gray-1000)] md:text-heading-48">
                Races
              </h1>
              <p className="max-w-2xl text-copy-16 text-[color:var(--ds-gray-900)] md:text-copy-18">
                Find your next race. Explore thousands of the world&apos;s
                greatest races with detailed race guides, course analysis,
                local tips and recommendations.
              </p>
            </div>
            <RaceUnitControls />
          </header>

          <FiltersShell
            initialFilters={filters}
            countries={countries}
            cities={cities}
            tags={tags}
          >
            <RaceGrid races={races} />
          </FiltersShell>
        </div>
      </div>
    </InitialLoadShell>
  );
}

// Generic dedupe-by-string-key helper used to collapse the
// per-race rows from raceCitiesQuery / raceStatesQuery down to
// one row per unique city / state. First match wins.
function dedupeByKey<T, K extends keyof T>(
  rows: T[],
  key: K,
): T[] {
  const seen = new Set<T[K]>();
  return rows.filter((row) => {
    const v = row[key];
    if (seen.has(v)) return false;
    seen.add(v);
    return true;
  });
}
