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
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="h-5 w-4/5 animate-pulse rounded bg-[color:var(--ds-gray-200)]" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-[color:var(--ds-gray-200)]" />
              </div>
              <div className="size-16 shrink-0 animate-pulse rounded-md bg-[color:var(--ds-gray-200)]" />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
