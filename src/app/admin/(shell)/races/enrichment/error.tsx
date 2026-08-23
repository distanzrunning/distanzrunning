"use client";

// src/app/admin/(shell)/races/enrichment/error.tsx
//
// Next.js segment error boundary — same rationale as the sibling
// date-review boundary: catches client render errors AND mid-flight
// server-action failures (e.g. a 504 from a slow scan) so the
// editor sees a recoverable surface instead of a minified React
// error. Work in flight may still land in Sanity; refresh shows it.

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";

export default function RaceEnrichmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[enrichment] segment error:", error);
  }, [error]);

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-[640px]">
        <section className="material-base flex flex-col items-start gap-4 px-6 py-6">
          <h1 className="m-0 text-heading-24 text-textDefault">
            Something went wrong loading this page
          </h1>
          <p className="m-0 text-copy-13 text-textSubtle">
            A scan or load took longer than expected and the response was
            cut off. Any work that was in flight may have completed in the
            background — refresh to check the latest state, or click
            &ldquo;Try again&rdquo; to re-render this page.
          </p>
          {error.digest && (
            <p className="m-0 text-label-12 text-textSubtler">
              Digest:{" "}
              <span className="font-mono text-textSubtle">{error.digest}</span>
            </p>
          )}
          <div className="flex items-center gap-2">
            <Button size="small" onClick={() => reset()}>
              Try again
            </Button>
            <Button
              size="small"
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Hard refresh
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
