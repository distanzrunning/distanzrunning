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
            <div className="aspect-[16/8.75] w-full animate-pulse rounded-t-md bg-[color:var(--ds-gray-200)]" />
            <div className="flex items-center justify-between gap-3 rounded-b-md bg-[color:var(--ds-gray-100)] p-6">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {/* Title placeholder — h-7 (28 px) matches the
                    text-heading-20 line-height of the real
                    RaceCard title. Single-line; longer titles
                    that wrap to 2 lines will still expand the
                    real card slightly. */}
                <div className="h-7 w-4/5 animate-pulse rounded bg-[color:var(--ds-gray-200)]" />
                {/* Location placeholder — h-5 (20 px) matches
                    text-copy-14 line-height. */}
                <div className="h-5 w-1/2 animate-pulse rounded bg-[color:var(--ds-gray-200)]" />
              </div>
              <div className="size-16 shrink-0 animate-pulse rounded-md bg-[color:var(--ds-gray-200)]" />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
