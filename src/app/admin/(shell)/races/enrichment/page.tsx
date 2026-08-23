// src/app/admin/(shell)/races/enrichment/page.tsx
//
// Editor-facing review queue for auto-scraped race data (Plan 017,
// slice 1: Wikipedia course records + field size). Shell renders
// synchronously; the Sanity-backed table streams in via Suspense —
// same structure as the sibling Date Review page.

import { Suspense } from "react";

import {
  RaceEnrichmentContent,
  RaceEnrichmentSkeleton,
} from "./RaceEnrichment";

export const metadata = {
  title: "Race Enrichment — Stride Admin",
  robots: { index: false, follow: false },
};

// Always re-fetch — the page changes the moment any other tab
// approves, rejects, or scans a race.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RaceEnrichmentPage() {
  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-2">
          <h1 className="m-0 text-heading-24 text-textDefault">
            Race Enrichment
          </h1>
        </header>

        <Suspense fallback={<RaceEnrichmentSkeleton />}>
          <RaceEnrichmentContent />
        </Suspense>
      </div>
    </div>
  );
}
