// src/app/races/RaceGridSkeleton.tsx
//
// Loading-state placeholder for RaceGrid. Mirrors the real grid's
// geometry (16/8.75 image, 6 px corners, body block with title +
// location + 64 px date square) so swapping between skeleton and
// the live grid doesn't shift layout. Used by FiltersShell while
// router.replace() round-trips a new searchParams set through the
// server.

interface RaceGridSkeletonProps {
  /** Number of placeholder cards to render. Defaults to 9 — three
   *  rows on the lg: 3-column breakpoint, two on md:, etc. */
  count?: number;
}

export default function RaceGridSkeleton({
  count = 9,
}: RaceGridSkeletonProps) {
  return (
    <ul
      className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <article className="flex w-full flex-col">
            <div className="relative aspect-[16/8.75] w-full animate-pulse rounded-t-md bg-[color:var(--ds-gray-200)]">
              {/* Date Badge placeholder — top-right slot
                  carries the date ("11 Apr, 2027" at Badge
                  size="md", ~110 px wide). gray-300 sits one
                  step darker than the gray-200 image area so
                  the silhouette stays visible. */}
              <div className="absolute right-3 top-3 h-6 w-[110px] rounded-full bg-[color:var(--ds-gray-300)]" />
            </div>
            <div className="flex flex-col gap-1 rounded-b-md bg-[color:var(--ds-gray-100)] p-6">
              {/* Title row — title placeholder + category pill
                  on the right. h-7 / w-[88px] mirrors the live
                  MetaPill ("Marathon" / "Half Marathon" at
                  text-copy-13). */}
              <div className="flex items-start justify-between gap-3">
                <div className="h-7 w-3/5 animate-pulse rounded bg-[color:var(--ds-gray-200)]" />
                <div className="h-7 w-[88px] shrink-0 animate-pulse rounded-full bg-[color:var(--ds-gray-300)]" />
              </div>
              {/* Location placeholder — h-5 (20 px) matches
                  text-copy-14 line-height. */}
              <div className="h-5 w-1/2 animate-pulse rounded bg-[color:var(--ds-gray-200)]" />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
