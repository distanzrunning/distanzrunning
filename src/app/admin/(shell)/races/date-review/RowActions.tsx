"use client";

// src/app/admin/(shell)/races/date-review/RowActions.tsx
//
// Renders the two interactive cells of a Date Review row as a
// fragment so they share state but live in their own table
// columns. Content varies by row state:
//
//   - "pending"    → Calendar (single-date adapter) + Approve / Reject
//   - "scannable"  → "Not yet" placeholder + [ Scan ]
//   - "rejected"   → "Rejected" badge + [ Reset ] (clears status →
//                    next pass will re-scan)
//   - "no-website" → "—" + "No website" hint (no action possible)
//
// Each interactive button uses useTransition so the buttons spin
// + disable while their server action is in flight.

import { useState, useTransition } from "react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Calendar, type DateRange } from "@/components/ui/Calendar";
import { TableCell } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";

import {
  approveManualDate,
  approveSuggestion,
  rejectSuggestion,
  resetSuggestion,
  scanRace,
} from "./actions";

export type RowState = "pending" | "scannable" | "rejected" | "no-website";

interface RowActionsProps {
  id: string;
  title: string;
  state: RowState;
  /** Required when state === "pending". */
  suggestedDate?: string;
  /** Previous (past) eventDate ISO — used by ScannableRow to
   *  seed the Calendar with a "1 year later" default guess. */
  previousEventDate: string;
}

// Local-date YYYY-MM-DD (NOT toISOString — toISOString shifts to
// UTC, off-by-oneing any timezone east of UTC). Mirrors the helper
// in DateFilter so the format stays consistent across the codebase.
function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function RowActions(props: RowActionsProps) {
  switch (props.state) {
    case "pending":
      return <PendingRow {...props} />;
    case "scannable":
      return <ScannableRow {...props} />;
    case "rejected":
      return <RejectedRow {...props} />;
    case "no-website":
      return <NoWebsiteRow />;
  }
}

// ────────────────────────────────────────────────────────────────
// Pending — Calendar in Suggested cell, Approve/Reject in Action
// ────────────────────────────────────────────────────────────────

function PendingRow({ id, title, suggestedDate }: RowActionsProps) {
  const initial = suggestedDate ? new Date(suggestedDate) : new Date();
  const [picked, setPicked] = useState<Date>(initial);
  const [pending, startTransition] = useTransition();

  // Single-date adapter — see DateFilter.tsx for the same trick.
  const range: DateRange = { start: picked, end: picked };
  const handleCalendarChange = (next: DateRange) => {
    const candidate = next.start ?? next.end;
    if (candidate) setPicked(candidate);
  };

  const handleApprove = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", id);
      fd.set("overrideDate", toIsoDate(picked));
      await approveSuggestion(fd);
    });
  };

  const handleReject = () => {
    const ok = window.confirm(
      `Reject the suggested date for "${title}"?\n\nThis race will be skipped on future scans until you reset its status.`,
    );
    if (!ok) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", id);
      await rejectSuggestion(fd);
    });
  };

  return (
    <>
      <TableCell>
        <Calendar
          placeholder="Date"
          value={range}
          onChange={handleCalendarChange}
          size="small"
          width={170}
          showTimeInput={false}
          formatTriggerLabel={(r) =>
            r.start ? format(r.start, "d MMM yyyy") : ""
          }
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button size="small" loading={pending} onClick={handleApprove}>
            Approve
          </Button>
          <Button
            size="small"
            variant="secondary"
            loading={pending}
            onClick={handleReject}
          >
            Reject
          </Button>
        </div>
      </TableCell>
    </>
  );
}

// ────────────────────────────────────────────────────────────────
// Scannable — Calendar (manual override) + Approve + Scan
// Calendar pre-seeds at previousEventDate + 1 year because most
// races repeat annually. Editor either:
//   (a) clicks Approve to accept the guess (or after editing it),
//   (b) clicks Scan to let Haiku try to extract from the website.
// ────────────────────────────────────────────────────────────────

function addOneYear(d: Date): Date {
  const next = new Date(d);
  next.setFullYear(next.getFullYear() + 1);
  return next;
}

function ScannableRow({ id, title, previousEventDate }: RowActionsProps) {
  const initialGuess = addOneYear(new Date(previousEventDate));
  const [picked, setPicked] = useState<Date>(initialGuess);
  const [pending, startTransition] = useTransition();
  const { showToast, dismissToast } = useToast();

  const range: DateRange = { start: picked, end: picked };
  const handleCalendarChange = (next: DateRange) => {
    const candidate = next.start ?? next.end;
    if (candidate) setPicked(candidate);
  };

  const handleApprove = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", id);
      fd.set("date", toIsoDate(picked));
      await approveManualDate(fd);
    });
  };

  const handleScan = () => {
    // Persistent "scanning" toast — captured by id so we can
    // dismiss it the moment scanRace resolves (otherwise it'd
    // stack alongside the result toast). Tells the editor the
    // scan is in flight and roughly how long to expect.
    const scanningToastId = showToast({
      message: `Scanning "${title}"…`,
      description: "Fetching homepage, sub-pages, and aggregators. May take up to 50 s.",
      preserve: true,
    });

    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", id);
      try {
        const result = await scanRace(fd);

        if (result.status === "suggested") {
          showToast({
            message: `Suggestion written for "${title}"`,
            description: `Suggested next date: ${result.suggestedNextDate ?? "—"}. Review it in the row above.`,
            variant: "success",
          });
        } else {
          const explainer: Record<typeof result.status, string> = {
            no_date_found: "Haiku couldn't find a future date on the available pages.",
            fetch_error: "Couldn't reach the website (or scan exceeded the 50 s budget).",
            extract_error: "The model errored — try again or use manual approve.",
            invalid_date: "Returned date didn't pass validation.",
          };
          showToast({
            message: `No suggestion for "${title}"`,
            description: `${explainer[result.status]} ${result.message ? `Details: ${result.message}` : ""}`.trim(),
            variant: "warning",
            preserve: true,
          });
        }
      } catch (err) {
        // Server action threw — usually a 504 (function timeout)
        // surfaced as a fetch failure on the client side. The
        // page-level error.tsx boundary catches React render
        // errors; this catch handles the in-handler case so we
        // can still clean up the toast and tell the editor what
        // to do next.
        showToast({
          message: `Scan request failed for "${title}"`,
          description: `${(err as Error).message}. The work may still complete in the background — refresh in a moment to check the row's state.`,
          variant: "error",
          preserve: true,
        });
      } finally {
        // Always dismiss the scanning toast, even on error, so
        // it doesn't sit there forever.
        dismissToast(scanningToastId);
      }
    });
  };

  return (
    <>
      <TableCell>
        <Calendar
          placeholder="Date"
          value={range}
          onChange={handleCalendarChange}
          size="small"
          width={170}
          showTimeInput={false}
          formatTriggerLabel={(r) =>
            r.start ? format(r.start, "d MMM yyyy") : ""
          }
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button size="small" loading={pending} onClick={handleApprove}>
            Approve
          </Button>
          <Button
            size="small"
            variant="secondary"
            loading={pending}
            onClick={handleScan}
          >
            Scan
          </Button>
        </div>
      </TableCell>
    </>
  );
}

// ────────────────────────────────────────────────────────────────
// Rejected — "Rejected" badge + Reset to make scannable again
// ────────────────────────────────────────────────────────────────

function RejectedRow({ id, title }: RowActionsProps) {
  const [pending, startTransition] = useTransition();

  const handleReset = () => {
    const ok = window.confirm(
      `Reset "${title}" back to scannable?\n\nThis clears the rejection so the race becomes eligible for the next scan.`,
    );
    if (!ok) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", id);
      await resetSuggestion(fd);
    });
  };

  return (
    <>
      <TableCell>
        <Badge variant="gray-subtle" size="sm">
          Rejected
        </Badge>
      </TableCell>
      <TableCell>
        <Button
          size="small"
          variant="secondary"
          loading={pending}
          onClick={handleReset}
        >
          Reset
        </Button>
      </TableCell>
    </>
  );
}

// ────────────────────────────────────────────────────────────────
// No website — informational only, no action available
// ────────────────────────────────────────────────────────────────

function NoWebsiteRow() {
  return (
    <>
      <TableCell className="text-copy-13 text-[color:var(--ds-gray-700)]">
        —
      </TableCell>
      <TableCell className="text-copy-13 text-[color:var(--ds-gray-700)]">
        No officialWebsite set
      </TableCell>
    </>
  );
}
