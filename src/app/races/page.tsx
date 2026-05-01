// src/app/races/page.tsx
//
// Server component. URL-driven filter rewrite — replaces the
// 4,500-line "use client" RaceGuidesClient monolith that
// hydration-flickered the race grid + filter row on every reload.
//
// Phase 1 scaffold: minimal shell. Subsequent phases add
// parseFilters / buildFilterUrl helpers, server-side GROQ
// filtering, RaceGrid (RSC), and one client-island filter chip
// at a time. The previous implementation lives at /races-legacy
// for side-by-side reference until the rewrite is complete.

import Link from "next/link";

export const metadata = {
  title: "Races — Distanz Running",
  description:
    "Find your next race. Curated race guides with course analysis, insider tips, and editorial coverage.",
};

export const revalidate = 60;

export default function RacesPage() {
  return (
    <div className="flex w-full flex-col items-center px-4 py-12 md:py-16 lg:py-20">
      <div className="flex w-full max-w-[1400px] flex-col gap-12">
        <header className="flex flex-col gap-3">
          <h1 className="m-0 text-balance text-heading-40 text-[color:var(--ds-gray-1000)] md:text-heading-48">
            Races
          </h1>
          <p className="max-w-2xl text-copy-16 text-[color:var(--ds-gray-900)] md:text-copy-18">
            Find your next race. Explore thousands of the world&apos;s
            greatest races with detailed race guides, course analysis,
            local tips and recommendations.
          </p>
        </header>

        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[color:var(--ds-gray-400)] p-12 text-center">
          <p className="text-copy-14 text-[color:var(--ds-gray-900)]">
            Rebuild in progress — URL-driven filters, server-rendered
            grid. Filter chips and grid land in subsequent phases.
          </p>
          <p className="text-copy-13 text-[color:var(--ds-gray-700)]">
            The previous version is preserved at{" "}
            <Link
              href="/races-legacy"
              className="underline transition-colors hover:text-[color:var(--ds-gray-1000)]"
            >
              /races-legacy
            </Link>{" "}
            for reference.
          </p>
        </div>
      </div>
    </div>
  );
}
