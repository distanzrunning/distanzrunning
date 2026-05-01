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
        {/* Header — title block + unit controls slot */}
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="flex min-w-0 flex-col gap-3">
            {/* Title placeholder — matches text-heading-48 height */}
            <div className={`${PULSE_BG} h-12 w-40`} />
            {/* Subtitle: two text lines */}
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className={`${PULSE_BG} h-5 w-full`} />
              <div className={`${PULSE_BG} h-5 w-3/4`} />
            </div>
          </div>
          {/* Unit controls: imperial/metric switch + currency select */}
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
            {/* Date trigger */}
            <div className={`${PULSE_BG} h-8 w-[160px]`} />
            {/* Distance trigger */}
            <div className={`${PULSE_BG} h-8 w-[100px]`} />
          </div>
          <RaceGridSkeleton />
        </div>
      </div>
    </div>
  );
}
