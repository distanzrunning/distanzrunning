// src/app/admin/(shell)/races/date-review/page.tsx
//
// Editor-facing review queue for past-dated races. The shell renders
// synchronously; the Sanity-backed table streams in via Suspense so
// the editor sees the page chrome immediately.

import { Suspense } from "react";

import {
  RaceDateReviewContent,
  RaceDateReviewSkeleton,
} from "./RaceDateReview";

export const metadata = {
  title: "Race Date Review — Stride Admin",
  robots: { index: false, follow: false },
};

// Always re-fetch — the page changes the moment any other tab
// approves, rejects, or scans a race.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RaceDateReviewPage() {
  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-2">
          <h1 className="m-0 text-heading-24 text-textDefault">
            Race Date Review
          </h1>
        </header>

        <Suspense fallback={<RaceDateReviewSkeleton />}>
          <RaceDateReviewContent />
        </Suspense>
      </div>
    </div>
  );
}
