"use client";

// src/app/admin/(shell)/races/date-review/error.tsx
//
// Next.js segment error boundary. Catches anything thrown during
// client render OR mid-flight server-action failures (e.g. a
// 504 from a slow scan that triggers React error #418 because
// the RSC payload arrives as HTML rather than serialized data).
//
// Without this boundary the whole admin route crashes with a
// minified React error. With it, the editor sees a recoverable
// surface: title + short explanation + "Try again" button. The
// underlying server work (if it eventually completes) lands in
// Sanity and shows up on the next refresh.

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";

export default function RaceDateReviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to runtime logs so we can correlate digests with
    // specific failures.
    console.error("[date-refresh] segment error:", error);
  }, [error]);

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-[640px]">
        <section className="material-base flex flex-col items-start gap-4 px-6 py-6">
          <h1 className="m-0 text-heading-24 text-[color:var(--ds-gray-1000)]">
            Something went wrong loading this page
          </h1>
          <p className="m-0 text-copy-13 text-[color:var(--ds-gray-900)]">
            A scan or load took longer than expected and the response was
            cut off. Any work that was in flight may have completed in the
            background — refresh to check the latest state, or click
            &ldquo;Try again&rdquo; to re-render this page.
          </p>
          {error.digest && (
            <p className="m-0 text-label-12 text-[color:var(--ds-gray-700)]">
              Digest:{" "}
              <span className="font-mono text-[color:var(--ds-gray-900)]">
                {error.digest}
              </span>
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
