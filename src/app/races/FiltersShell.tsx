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
import RaceGridSkeleton from "./RaceGridSkeleton";

interface FiltersShellProps {
  initialFilters: RaceFilters;
  children: ReactNode;
}

export default function FiltersShell({
  initialFilters,
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <SearchFilter
          value={initialFilters.q}
          onChange={(q) => setFilter({ q: q || undefined })}
        />
        <DateFilter
          value={{ from: initialFilters.dateFrom, to: initialFilters.dateTo }}
          onChange={(range) =>
            setFilter({
              dateFrom: range.from,
              dateTo: range.to,
            })
          }
        />
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
        />
        {anyActive && (
          <button
            type="button"
            onClick={resetAll}
            className="ml-1 inline-flex h-8 items-center px-2 text-copy-13 text-[color:var(--ds-gray-900)] underline-offset-4 transition-colors hover:text-[color:var(--ds-gray-1000)] hover:underline"
          >
            Reset all
          </button>
        )}
      </div>

      {showSkeleton ? <RaceGridSkeleton /> : children}
    </div>
  );
}
