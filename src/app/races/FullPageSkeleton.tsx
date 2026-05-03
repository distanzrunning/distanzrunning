// src/app/races/FullPageSkeleton.tsx
//
// Cold-load skeleton for the entire /races page surface — mirrors
// the geometry of the real page (title, subtitle, unit controls,
// filter chip row, card grid) so InitialLoadShell can swap between
// them without layout shift. Used only on initial mount; filter
// transitions reuse the smaller RaceGridSkeleton from FiltersShell.

import RaceGridSkeleton from "./RaceGridSkeleton";

const PULSE_BG = "animate-pulse rounded bg-[color:var(--ds-gray-200)]";

export default function FullPageSkeleton() {
  return (
    <div
      aria-hidden
      className="flex w-full flex-col items-center px-4 py-12 md:py-16 lg:py-20"
    >
      <div className="flex w-full max-w-[1400px] flex-col gap-12">
        {/* Header — title block + unit controls slot.
            Both title and subtitle render the actual real-page
            text with `text-transparent` + a pulsing gray bg.
            The browser wraps and lays them out identically to
            the live header, so the line-box heights match
            exactly at every viewport. The bg dissolves on swap;
            no element resizes. */}
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="flex flex-col gap-3">
            <h1
              aria-hidden
              className="m-0 w-fit animate-pulse rounded bg-[color:var(--ds-gray-200)] text-balance text-heading-40 text-transparent md:text-heading-48"
            >
              Races
            </h1>
            <p
              aria-hidden
              className="max-w-2xl animate-pulse rounded bg-[color:var(--ds-gray-200)] text-copy-16 text-transparent md:text-copy-18"
            >
              Find your next race. Explore thousands of the world&apos;s
              greatest races with detailed race guides, course analysis,
              local tips and recommendations.
            </p>
          </div>
          {/* Unit controls: imperial/metric switch + currency select.
              RaceUnitControls keeps visibility:hidden until mount, so
              the real controls reserve the same w/h space — these
              placeholders just fill the cold-load equivalent. */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={`${PULSE_BG} h-8 w-[150px]`} />
            <div className={`${PULSE_BG} h-8 w-[120px]`} />
          </div>
        </header>

        {/* Filter row + grid */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search (collapsed icon) */}
            <div className={`${PULSE_BG} h-8 w-8`} />
            {/* Date trigger — Calendar uses width={140}. */}
            <div className={`${PULSE_BG} h-8 w-[140px]`} />
            {/* Distance trigger */}
            <div className={`${PULSE_BG} h-8 w-[100px]`} />
            {/* Country trigger */}
            <div className={`${PULSE_BG} h-8 w-[92px]`} />
            {/* City trigger */}
            <div className={`${PULSE_BG} h-8 w-[68px]`} />
            {/* State trigger */}
            <div className={`${PULSE_BG} h-8 w-[76px]`} />
            {/* Surface trigger */}
            <div className={`${PULSE_BG} h-8 w-[96px]`} />
            {/* Price trigger */}
            <div className={`${PULSE_BG} h-8 w-[76px]`} />
            {/* Elevation trigger */}
            <div className={`${PULSE_BG} h-8 w-[100px]`} />
            {/* Temperature trigger */}
            <div className={`${PULSE_BG} h-8 w-[120px]`} />
            {/* Tag trigger */}
            <div className={`${PULSE_BG} h-8 w-[60px]`} />
            {/* Sort trigger — pushed to the right via ml-auto.
                Compact since it always reads "Sort" regardless of
                the active option. */}
            <div className={`${PULSE_BG} ml-auto h-8 w-[68px]`} />
          </div>
          <RaceGridSkeleton />
        </div>
      </div>
    </div>
  );
}
