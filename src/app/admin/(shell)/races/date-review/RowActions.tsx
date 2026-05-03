"use client";

// src/app/admin/(shell)/races/date-review/RowActions.tsx
//
// Per-row controls for the Race Date Review queue:
//   - DS Calendar (range mode, used as single-date adapter — we
//     pass {start, end} both pointing at the same date so the
//     trigger formats as "Apr 25" and a single click reselects).
//   - Approve button (DS Button, default variant) → server action.
//     The current Calendar pick rides along as overrideDate.
//   - Reject button (DS Button, secondary variant) → server action.
//     Confirms first since rejecting hides the row until the
//     editor manually clears the status in Studio.
//
// useTransition tracks the in-flight server-action call; both
// buttons take loading={pending} so they spinner-disable in unison.

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { Calendar, type DateRange } from "@/components/ui/Calendar";

import { approveSuggestion, rejectSuggestion } from "./actions";

interface RowActionsProps {
  id: string;
  /** ISO datetime — used as the default Calendar pick. */
  suggestedDate: string;
  /** Race title — used in the reject confirmation prompt. */
  title: string;
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

export default function RowActions({
  id,
  suggestedDate,
  title,
}: RowActionsProps) {
  const initial = new Date(suggestedDate);
  const [picked, setPicked] = useState<Date>(initial);
  const [pending, startTransition] = useTransition();

  // Single-date adapter for the range-mode Calendar. We always
  // pass {start, end} pointing at the same day; clicking any other
  // day resets the range to {start: clicked, end: null}, and our
  // onChange treats whichever side is set as the new pick.
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
      `Reject the suggested date for "${title}"?\n\nThis race will be skipped on future scans until you clear the status in Sanity Studio.`,
    );
    if (!ok) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", id);
      await rejectSuggestion(fd);
    });
  };

  return (
    // justify-end so the trio aligns under the right-aligned
    // "Action" TableHead — the DS Table applies last:text-right
    // by default to last-child cells, but flex children ignore
    // text-align so we mirror it with justify-end here.
    <div className="flex items-center justify-end gap-2">
      <Calendar
        placeholder="Date"
        value={range}
        onChange={handleCalendarChange}
        size="small"
        width={140}
        showTimeInput={false}
      />
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
  );
}
