"use client";

// src/app/admin/(shell)/races/date-review/BatchScanButton.tsx
//
// Header button that fires `runBatchScan` server action — same
// path as the weekly Vercel cron, but kicked off synchronously
// from the editor's click. Toast feedback while running, then a
// summary toast when done ("Scanned N races · K suggestions
// written"). Disabled while pending.

import { useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

import { runBatchScan } from "./actions";

export default function BatchScanButton() {
  const [pending, startTransition] = useTransition();
  const { showToast, dismissToast } = useToast();

  const handleClick = () => {
    const scanningToastId = showToast({
      message: "Running batch scan…",
      description:
        "Checking up to 3 past-dated races without an existing suggestion. Click again for the next batch when this one finishes.",
      preserve: true,
    });

    startTransition(async () => {
      try {
        const summary = await runBatchScan();
        const newSuggestions = summary.results.filter(
          (r) => r.status === "suggested",
        ).length;

        showToast({
          message: `Batch scan complete`,
          description: `${summary.scanned} race${summary.scanned === 1 ? "" : "s"} scanned · ${newSuggestions} new suggestion${newSuggestions === 1 ? "" : "s"} written.`,
          variant: newSuggestions > 0 ? "success" : "default",
        });
      } catch (err) {
        showToast({
          message: "Batch scan failed",
          description: `${(err as Error).message}. Some races may have been processed before the failure — refresh to check current state.`,
          variant: "error",
          preserve: true,
        });
      } finally {
        dismissToast(scanningToastId);
      }
    });
  };

  return (
    <Button
      size="small"
      variant="secondary"
      loading={pending}
      onClick={handleClick}
    >
      Run batch scan
    </Button>
  );
}
