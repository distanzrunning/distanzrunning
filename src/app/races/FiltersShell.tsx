"use client";

// src/app/races/FiltersShell.tsx
//
// Client island. Holds the filter chip row + manages router state
// for the URL-driven filter system.
//
// Architecture:
//   - page.tsx (server) parses searchParams → RaceFilters and passes
//     the object as initialFilters here.
//   - Each filter chip is a controlled component — `value` reads
//     from initialFilters, `onChange` calls setFilter() on this shell.
//   - setFilter() builds the next URLSearchParams and calls
//     router.replace() inside startTransition(). React's
//     useTransition flips isPending while the server re-renders,
//     and we swap children for <RaceGridSkeleton/> to give the
//     grid a clear pending affordance.
//   - {children} is the server-rendered <RaceGrid> tree from
//     page.tsx — cheap to render, expensive to fetch, so we keep
//     it server-side and only swap during transitions.

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  buildFilterParams,
  hasActiveFilters,
  type RaceFilters,
} from "./filters";
import SearchFilter from "./filters/SearchFilter";
import DateFilter from "./filters/DateFilter";
import DistanceFilter from "./filters/DistanceFilter";
import CountryFilter from "./filters/CountryFilter";
import CityFilter, { type CityOption } from "./filters/CityFilter";
import StateFilter from "./filters/StateFilter";
import SurfaceFilter from "./filters/SurfaceFilter";
import PriceFilter from "./filters/PriceFilter";
import ElevationFilter from "./filters/ElevationFilter";
import TemperatureFilter from "./filters/TemperatureFilter";
import TagFilter from "./filters/TagFilter";
import SortFilter from "./filters/SortFilter";
import { DEFAULT_SORT } from "@/sanity/queries/raceIndexQuery";
import { US_COUNTRY_NAME, US_STATES } from "@/lib/usStates";
import RaceGridSkeleton from "./RaceGridSkeleton";

interface FiltersShellProps {
  initialFilters: RaceFilters;
  /** All countries we have race data for, alphabetised. Powers
   *  the Country filter's option list. */
  countries: string[];
  /** All {city, country} pairs we have race data for, deduped by
   *  city. Powers the City filter's option list. */
  cities: CityOption[];
  /** Every unique tag we have race data for, alphabetised.
   *  Powers the Tag filter's option list. */
  tags: string[];
  children: ReactNode;
}

export default function FiltersShell({
  initialFilters,
  countries,
  cities,
  tags,
  children,
}: FiltersShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Delay the skeleton so fast transitions (cached Sanity queries,
  // simple toggles) finish before any visual swap happens. Without
  // this, every filter change tore the grid down for the skeleton
  // and rebuilt it — remounting all 29 RaceCards including their
  // <Image> components, which re-ran the 300 ms image fade-in and
  // read as a flash. With this guard, the swap only happens if the
  // server is genuinely slow.
  const [showSkeleton, setShowSkeleton] = useState(false);
  // Tracks the Search chip's expanded state so we can hide Reset
  // all while the input is open — otherwise the 260 px expansion
  // pushes the row past its container width and Sort wraps onto
  // a second line.
  const [searchExpanded, setSearchExpanded] = useState(false);
  useEffect(() => {
    if (!isPending) {
      setShowSkeleton(false);
      return;
    }
    const t = setTimeout(() => setShowSkeleton(true), 250);
    return () => clearTimeout(t);
  }, [isPending]);

  const setFilter = (patch: Partial<RaceFilters>) => {
    const next: RaceFilters = { ...initialFilters, ...patch };
    // Strip empty strings / undefined so they don't pollute the URL.
    // Explicit checks rather than `!v` so a meaningful 0 (e.g.,
    // distanceMin = 0) survives.
    (Object.keys(next) as (keyof RaceFilters)[]).forEach((key) => {
      const v = next[key];
      if (v === undefined || v === null || v === "") delete next[key];
    });
    const params = buildFilterParams(next);
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const resetAll = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const anyActive = hasActiveFilters(initialFilters);

  // Per-filter active flags drive the chip-row reorder — each
  // active filter gets pulled to the front of the row via flex
  // `order: -1`. Search stays leftmost regardless (it's the
  // entry-point control). Sort sits in its own ml-auto slot.
  const isDateActive = Boolean(
    initialFilters.dateFrom || initialFilters.dateTo,
  );
  const isDistanceActive =
    initialFilters.distanceMin != null || initialFilters.distanceMax != null;
  const isCountryActive = Boolean(initialFilters.country);
  const isCityActive = Boolean(initialFilters.city);
  const isStateActive = Boolean(initialFilters.state);
  const isSurfaceActive = Boolean(initialFilters.surface);
  const isPriceActive =
    initialFilters.priceMin != null || initialFilters.priceMax != null;
  const isElevationActive =
    initialFilters.elevationMin != null ||
    initialFilters.elevationMax != null;
  const isTemperatureActive =
    initialFilters.temperatureMin != null ||
    initialFilters.temperatureMax != null;
  const isTagActive = Boolean(initialFilters.tag);

  // Helper: wrap a chip in an order-aware div. Active chips get
  // order:-1 so flex pulls them to the start of the row; default
  // is order:0. inline-flex on the wrapper keeps the chip
  // hugging its content the same way an unwrapped chip would.
  const slot = (active: boolean, chip: ReactNode) => (
    <div
      className="inline-flex"
      style={{ order: active ? -1 : 0 }}
    >
      {chip}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search wrapped in its own order:-2 slot so it always
            wins the leftmost spot, even against active filter
            chips (which use order:-1 to pull in front of
            inactive chips). */}
        <div className="inline-flex" style={{ order: -2 }}>
          <SearchFilter
            value={initialFilters.q}
            onChange={(q) => setFilter({ q: q || undefined })}
            onExpandedChange={setSearchExpanded}
          />
        </div>
        {slot(
          isDateActive,
          <DateFilter
            value={{ from: initialFilters.dateFrom, to: initialFilters.dateTo }}
            onChange={(range) =>
              setFilter({
                dateFrom: range.from,
                dateTo: range.to,
              })
            }
          />,
        )}
        {slot(
          isDistanceActive,
          <DistanceFilter
            value={{
              min: initialFilters.distanceMin,
              max: initialFilters.distanceMax,
            }}
            onChange={(range) =>
              setFilter({
                distanceMin: range.min,
                distanceMax: range.max,
              })
            }
          />,
        )}
        {slot(
          isCountryActive,
          <CountryFilter
            options={countries}
            value={initialFilters.country}
            onChange={(country) => {
              // When the country changes, clear any stale city /
              // state that no longer fits inside the new country
              // scope — e.g. user had Tokyo + Japan, switches to
              // Belgium. Picking "any country" (country = undefined)
              // doesn't clear anything.
              const patch: Partial<RaceFilters> = { country };
              if (
                country &&
                initialFilters.city &&
                !cities.some(
                  (c) =>
                    c.city === initialFilters.city && c.country === country,
                )
              ) {
                patch.city = undefined;
              }
              if (
                country &&
                country !== US_COUNTRY_NAME &&
                initialFilters.state &&
                US_STATES.includes(initialFilters.state)
              ) {
                // Switching country to anything other than USA
                // invalidates the State pick (states are US-only).
                patch.state = undefined;
              }
              setFilter(patch);
            }}
          />,
        )}
        {slot(
          isCityActive,
          <CityFilter
            options={cities}
            value={initialFilters.city}
            countryScope={initialFilters.country}
            stateScope={initialFilters.state}
            onChange={(picked) => {
              if (!picked) {
                setFilter({ city: undefined });
                return;
              }
              // Auto-sync country to the picked city's country so
              // filters stay coherent. Also auto-fill state when
              // the picked city carries one (US cities only) so
              // the State chip reflects the implied region —
              // picking NYC sets state="New York" too.
              setFilter({
                city: picked.city,
                country: picked.country,
                state: picked.state,
              });
            }}
          />,
        )}
        {/* State chip hides in two cases:
            - Country is set to anything other than USA (states
              are US-only).
            - City is set (city is more specific — the city
              dropdown already filters to a single location, and
              the auto-filled state value still applies in the
              URL silently). */}
        {(!initialFilters.country ||
          initialFilters.country === US_COUNTRY_NAME) &&
          !initialFilters.city &&
          slot(
            isStateActive,
            <StateFilter
              value={initialFilters.state}
              onChange={(state) => {
                if (!state) {
                  setFilter({ state: undefined });
                  return;
                }
                // Auto-sync country to USA — states are
                // conceptually US-only. Doesn't clear city: state
                // and city can coexist (e.g. New York state +
                // New York City).
                setFilter({ state, country: US_COUNTRY_NAME });
              }}
            />,
          )}
        {slot(
          isSurfaceActive,
          <SurfaceFilter
            value={initialFilters.surface}
            onChange={(surface) => setFilter({ surface })}
          />,
        )}
        {slot(
          isPriceActive,
          <PriceFilter
            value={{
              min: initialFilters.priceMin,
              max: initialFilters.priceMax,
            }}
            onChange={(range) =>
              setFilter({
                priceMin: range.min,
                priceMax: range.max,
              })
            }
          />,
        )}
        {slot(
          isElevationActive,
          <ElevationFilter
            value={{
              min: initialFilters.elevationMin,
              max: initialFilters.elevationMax,
            }}
            onChange={(range) =>
              setFilter({
                elevationMin: range.min,
                elevationMax: range.max,
              })
            }
          />,
        )}
        {slot(
          isTemperatureActive,
          <TemperatureFilter
            value={{
              min: initialFilters.temperatureMin,
              max: initialFilters.temperatureMax,
            }}
            onChange={(range) =>
              setFilter({
                temperatureMin: range.min,
                temperatureMax: range.max,
              })
            }
          />,
        )}
        {slot(
          isTagActive,
          <TagFilter
            options={tags}
            value={initialFilters.tag}
            onChange={(tag) => setFilter({ tag })}
          />,
        )}
        {anyActive && !searchExpanded && (
          <button
            type="button"
            onClick={resetAll}
            className="ml-1 inline-flex h-8 items-center px-2 text-copy-13 text-[color:var(--ds-gray-900)] underline-offset-4 transition-colors hover:text-[color:var(--ds-gray-1000)] hover:underline"
          >
            Reset all
          </button>
        )}
        {/* Sort sits at the far right — ml-auto pushes it past
            any filter chips that wrap onto the same row. Hidden
            while Search is expanded (same gate as Reset all) so
            the input has uncluttered focus. */}
        {!searchExpanded && (
          <div className="ml-auto">
            <SortFilter
              value={initialFilters.sort ?? DEFAULT_SORT}
              onChange={(sort) =>
                setFilter({ sort: sort === DEFAULT_SORT ? undefined : sort })
              }
            />
          </div>
        )}
      </div>

      {showSkeleton ? <RaceGridSkeleton /> : children}
    </div>
  );
}
