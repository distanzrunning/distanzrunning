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
            {/* Title — text-heading-40 (lh 48) on mobile,
                text-heading-48 (lh 56) on md+. */}
            <div className={`${PULSE_BG} h-12 w-40 md:h-14`} />
            {/* Subtitle: two text lines. text-copy-16 (lh 24) on
                mobile, text-copy-18 (lh 28) on md+. Each line is
                4 px shorter than its line-height so the gap-2 (8)
                between lines lands the total at 2 × lh: 48 px
                mobile (20+8+20), 56 px md+ (24+8+24). Without
                that compensation the skeleton was 8 px too tall
                and pushed the chip row + grid down. */}
            <div className="flex max-w-2xl flex-col gap-2">
              <div className={`${PULSE_BG} h-5 w-full md:h-6`} />
              <div className={`${PULSE_BG} h-5 w-3/4 md:h-6`} />
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
            {/* Sort trigger — pushed to the right via ml-auto. */}
            <div className={`${PULSE_BG} ml-auto h-8 w-[140px]`} />
          </div>
          <RaceGridSkeleton />
        </div>
      </div>
    </div>
  );
}
