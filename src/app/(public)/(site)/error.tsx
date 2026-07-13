"use client";

// src/app/(public)/(site)/error.tsx
//
// Next.js segment error boundary for the public (site) route group. Per
// App Router semantics, an error.tsx catches errors thrown from its
// segment's PAGE subtree only — NOT from the same segment's layout.tsx.
// MastheadWrapper (and the newsletter band) render inside (site)/layout.tsx,
// so a throw there would NOT be caught here; that's why Step 1's
// safeSanityFetch guard (src/sanity/lib/safeFetch.ts) and
// getAnnouncement()'s try/catch (src/lib/announcement.ts) are the real
// fix for the shared layout. This boundary is a floor for errors thrown
// by individual page components within (site) — a last-resort recoverable
// surface instead of the whole segment 500ing.

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to runtime logs so failures can be correlated with digests.
    console.error("[site] segment error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-heading-24 text-textDefault">
          Something went wrong
        </h1>
        <p className="mt-2 text-copy-16 text-textSubtle">
          This page failed to load. It&rsquo;s us, not you — try again in a
          moment.
        </p>
        <div className="mt-6">
          <Button size="small" onClick={() => reset()}>
            Try again
          </Button>
        </div>
      </div>
    </main>
  );
}
