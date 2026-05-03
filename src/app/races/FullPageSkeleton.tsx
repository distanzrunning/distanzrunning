// src/app/races/FullPageSkeleton.tsx
//
// Cold-load skeleton for the entire /races page surface — mirrors
// the geometry of the real page (title, subtitle, unit controls,
// filter chip row, card grid) so InitialLoadShell can swap between
// them without layout shift. Used only on initial mount; filter
// transitions reuse the smaller RaceGridSkeleton from FiltersShell.

import RaceGridSkeleton from "./RaceGridSkeleton";

const PULSE_BG = "animate-pulse rounded bg-[color:var(--ds-gray-200)]";

// Renders a placeholder shaped exactly like a FilterChip trigger
// — same h-8 / pl-3 / pr-1.5 / gap-1 / text-[14px] /
// leading-[20px] / size-4 chevron slot. Carries the real chip's
// label as transparent text so the box auto-sizes to the same
// pixel width as the live chip. Used so the cold-load chip row
// matches the real row's flow without manual width guesses.
function ChipPlaceholder({ label }: { label: string }) {
  return (
    <div
      aria-hidden
      className="inline-flex h-8 animate-pulse items-center gap-1 rounded-sm bg-[color:var(--ds-gray-200)] pl-3 pr-1.5 text-[14px] font-normal leading-[20px] text-transparent"
    >
      <span>{label}</span>
      {/* Chevron-equivalent space — matches the size-4 ChevronDown
          rendered inside the real FilterChip trigger. */}
      <span className="size-4" />
    </div>
  );
}

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
          {/* Mirror of the live row: scrollable chip strip on
              the left, shrink-0 right group with toggle + sort. */}
          <div className="flex items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {/* Search (collapsed icon) */}
              <div className={`${PULSE_BG} h-8 w-8`} />
              {/* Date trigger — Calendar uses an explicit width={140}. */}
              <div className={`${PULSE_BG} h-8 w-[140px]`} />
              <ChipPlaceholder label="Distance" />
              <ChipPlaceholder label="Country" />
              <ChipPlaceholder label="City" />
              <ChipPlaceholder label="State" />
              <ChipPlaceholder label="Surface" />
              <ChipPlaceholder label="Price" />
              <ChipPlaceholder label="Elevation" />
              <ChipPlaceholder label="Temperature" />
              <ChipPlaceholder label="Tag" />
            </div>
            {/* Right-edge group: Toggle (~140 px including
                label) + 12 px gap + Sort icon trigger (32 px). */}
            <div className="flex shrink-0 items-center gap-3">
              <div className={`${PULSE_BG} h-5 w-[140px]`} />
              <div className={`${PULSE_BG} h-8 w-8`} />
            </div>
          </div>
          <RaceGridSkeleton />
        </div>
      </div>
    </div>
  );
}
