// src/app/races/calendar/loading.tsx
//
// Instant loading state for the race calendar (the house rule:
// dynamic public pages paint a boundary the moment the click lands).
// Pixel-ghost of the real page: identical header markup, control
// ghosts at the month-nav cluster's size, and an empty month lattice
// — day cells at the real min-heights with pulsed day numbers — so
// the content swap fills frames without moving them.

import LoadingBar from "../../../races/LoadingBar";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function RaceCalendarLoading() {
  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-8 px-4 py-12 md:gap-10 md:py-16 lg:py-20">
      <LoadingBar />
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="m-0 text-balance text-heading-40 text-textDefault md:text-heading-48">
            Race Calendar
          </h1>
          <p className="max-w-2xl text-copy-16 text-textSubtle md:text-copy-18">
            Explore upcoming races month by month and plan your running
            schedule.
          </p>
        </div>
      </header>
      {/* Month lattice ghost (md+); agenda rows ghost below. The
          toolbar is the card's own top row, mirroring CalendarGrid. */}
      <div className="hidden md:block" aria-hidden>
        <div className="overflow-hidden rounded-xs border border-borderSubtle bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderSubtle p-3 md:px-4">
            <div className="h-7 w-44 animate-pulse rounded bg-[color:var(--ds-gray-200)]" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-sm border border-borderSubtle bg-surface" />
              <div className="h-8 w-8 animate-pulse rounded-sm border border-borderSubtle bg-surface" />
            </div>
          </div>
          <div className="grid grid-cols-7 border-b border-borderSubtle">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="px-3 py-2 text-label-12 text-textSubtle"
              >
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-[color:var(--ds-gray-200)]">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="flex min-h-28 flex-col gap-1 bg-surface p-2 lg:min-h-32"
              >
                <div className="h-6 w-6 animate-pulse rounded-full bg-[color:var(--ds-gray-100)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:hidden" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xs bg-[color:var(--ds-gray-100)]"
          />
        ))}
      </div>
    </div>
  );
}
