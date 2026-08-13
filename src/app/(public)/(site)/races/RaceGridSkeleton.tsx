// src/app/races/RaceGridSkeleton.tsx
//
// Loading-state placeholder for RaceGrid. Mirrors the real grid's
// chrome="card" geometry (surface container with hairline border at
// the 4px editorial radius, 16/10 image panel under its border-b,
// p-5 footer with title + location + date pill) so swapping between
// skeleton and the live grid doesn't shift layout. Used by
// FiltersShell while router.replace() round-trips a new
// searchParams set through the server.

interface RaceGridSkeletonProps {
  /** Number of placeholder cards to render. Defaults to 9 — three
   *  rows on the lg: 3-column breakpoint, two on md:, etc. */
  count?: number;
}

export default function RaceGridSkeleton({ count = 9 }: RaceGridSkeletonProps) {
  return (
    <ul
      className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <article className="flex w-full flex-col overflow-hidden rounded-xs border border-borderSubtle bg-surface">
            <div className="relative aspect-[16/10] w-full animate-pulse border-b border-borderSubtle bg-[color:var(--ds-gray-100)]">
              {/* Category pill placeholder — top-right slot carries
                  the bordered surface pill ("Marathon" / "Half
                  Marathon", h-6, ~80px wide). gray-300 sits darker
                  than the gray-100 panel so the silhouette reads. */}
              <div className="absolute right-3 top-3 h-6 w-[80px] rounded-full bg-[color:var(--ds-gray-300)]" />
            </div>
            <div className="flex items-center justify-between gap-3 p-5">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {/* Title placeholder — h-[26px] matches the
                    text-display-20 line-height of the real title. */}
                <div className="h-[26px] w-4/5 animate-pulse rounded bg-[color:var(--ds-gray-200)]" />
                {/* Location placeholder — h-5 (20px) matches
                    text-copy-14 line-height. */}
                <div className="h-5 w-1/2 animate-pulse rounded bg-[color:var(--ds-gray-200)]" />
              </div>
              {/* Date pill placeholder — vertically centered against
                  the title + location stack. h-6 / w-[110px] mirrors
                  the live bordered pill ("11 Apr, 2027" at
                  text-label-12). */}
              <div className="h-6 w-[110px] shrink-0 animate-pulse rounded-full bg-[color:var(--ds-gray-300)]" />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
