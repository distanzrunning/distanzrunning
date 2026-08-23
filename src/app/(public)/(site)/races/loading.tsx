// src/app/races/loading.tsx
//
// Instant loading state for /races. Without this boundary, a soft
// navigation here (mega-menu "Race Guides", footer links) kept the
// PREVIOUS page painted until the full server render arrived — the
// Sanity fetch + filter round-trip reads as "my click didn't work"
// (user call 2026-08-23). Next paints this the moment the click
// lands: the REAL header text (identical markup to page.tsx, so the
// content swap doesn't shift layout), placeholder control pills, and
// the shared RaceGridSkeleton, with the house LoadingBar on the
// fixed top rail.
//
// Note this renders for ?view=map arrivals too (loading.tsx can't
// see searchParams) — the grid-shaped shell shows briefly, then the
// map view's own load sequence takes over. Acceptable: one segment,
// one boundary.

import LoadingBar from "./LoadingBar";
import RaceGridSkeleton from "./RaceGridSkeleton";

export default function RacesLoading() {
  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-12 px-4 py-12 md:py-16 lg:py-20">
      <LoadingBar />
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="m-0 text-balance text-heading-40 text-textDefault md:text-heading-48">
            Races
          </h1>
          <p className="max-w-2xl text-copy-16 text-textSubtle md:text-copy-18">
            Find your next race. Explore thousands of the world&apos;s greatest
            races with detailed race guides, course analysis, local tips and
            recommendations.
          </p>
        </div>
        {/* Unit switch + currency select + view switch placeholders —
            32px tall like the small controls they stand in for. */}
        <div className="flex shrink-0 items-center gap-3" aria-hidden>
          <div className="h-8 w-36 animate-pulse rounded-full bg-[color:var(--ds-gray-200)]" />
          <div className="h-8 w-24 animate-pulse rounded-md bg-[color:var(--ds-gray-200)]" />
          <div className="h-8 w-32 animate-pulse rounded-full bg-[color:var(--ds-gray-200)]" />
        </div>
      </header>
      {/* Filter chip row placeholders. */}
      <div className="flex flex-wrap items-center gap-2" aria-hidden>
        {[112, 96, 104, 88, 96, 80, 104, 96].map((w, i) => (
          <div
            key={i}
            className="h-8 animate-pulse rounded-md bg-[color:var(--ds-gray-200)]"
            style={{ width: w }}
          />
        ))}
      </div>
      <RaceGridSkeleton />
    </div>
  );
}
