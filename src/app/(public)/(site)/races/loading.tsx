// src/app/races/loading.tsx
//
// Instant loading state for /races. Without this boundary, a soft
// navigation here (mega-menu "Race Guides", footer links) kept the
// PREVIOUS page painted until the full server render arrived — the
// Sanity fetch + filter round-trip reads as "my click didn't work"
// (user call 2026-08-23). Next paints this the moment the click
// lands, with the house LoadingBar on the fixed top rail.
//
// The shell is a PIXEL-ACCURATE GHOST of the real page (user call
// 2026-08-23: the swap flickered): identical header markup, the
// filter row reproduced at the real geometry (FiltersShell's
// gap-6 stack, p-1 row, 32px chips at each real chip's width) and
// in the real chip CHROME (surface + hairline + 6px control
// radius) — solid gray blocks recoloured every pixel at swap time;
// ghost chrome means only the inner pulse swaps for text. Grid
// cards come from RaceGridSkeleton, which already mirrors RaceCard.
//
// Note this renders for ?view=map arrivals too (loading.tsx can't
// see searchParams) — the grid-shaped shell shows briefly, then the
// map view's own load sequence takes over. Acceptable: one segment,
// one boundary.

import LoadingBar from "./LoadingBar";
import RaceGridSkeleton from "./RaceGridSkeleton";

/** Real closed-chip widths, left to right (search icon square,
 *  Date … Tag) — measured off the live filter row so each ghost
 *  sits exactly where its chip lands. */
const CHIP_WIDTHS = [32, 140, 94, 89, 64, 72, 88, 70, 96, 118, 61];

/** Ghost of a 32px control: real chrome (surface + hairline +
 *  6px control radius), pulse only on the inner label bar. */
function ControlGhost({ width }: { width: number }) {
  return (
    <div
      className="flex h-8 shrink-0 items-center justify-center rounded-sm border border-borderSubtle bg-surface"
      style={{ width }}
    >
      <div
        className="h-3 animate-pulse rounded-full bg-[color:var(--ds-gray-200)]"
        style={{ width: Math.max(12, width - 24) }}
      />
    </div>
  );
}

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
        {/* Unit switch / currency select / view switch ghosts at the
            live controls' measured widths. */}
        <div className="flex shrink-0 items-center gap-3" aria-hidden>
          <ControlGhost width={157} />
          <ControlGhost width={120} />
          <ControlGhost width={156} />
        </div>
      </header>
      {/* Mirrors FiltersShell's structure exactly: gap-6 stack, then
          the p-1 chip row (40px tall), then the grid 24px below —
          the real grid's first card lands at the same y. */}
      <div className="flex flex-col gap-6" aria-hidden>
        <div className="flex items-center gap-2 p-1">
          {CHIP_WIDTHS.map((w, i) => (
            <ControlGhost key={i} width={w} />
          ))}
          {/* "Hide Past Races" toggle cluster on the row's right. */}
          <div className="ml-auto">
            <ControlGhost width={150} />
          </div>
        </div>
        <RaceGridSkeleton />
      </div>
    </div>
  );
}
