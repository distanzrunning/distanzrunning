"use client";

// src/app/admin/(shell)/races/date-review/RowActions.tsx
//
// Renders the two interactive cells of a Date Review row as a
// fragment so they share state but live in their own table
// columns:
//   - "Suggested" column → DS Calendar (range mode, single-date
//     adapter — start === end). Doubles as both the date display
//     and the editor for the override-on-approve.
//   - "Action" column → Approve + Reject (DS Buttons). Approve
//     submits the current Calendar pick; Reject confirms first.
//
// useTransition tracks the in-flight server-action call; both
// buttons take loading={pending} so they spinner-disable in unison.

import { useState, useTransition } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/Button";
import { Calendar, type DateRange } from "@/components/ui/Calendar";
import { TableCell } from "@/components/ui/Table";

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
    <>
      <TableCell>
        <Calendar
          placeholder="Date"
          value={range}
          onChange={handleCalendarChange}
          size="small"
          // Width bumped from 140 → 170 to fit "25 Apr 2027" with
          // the chevron without truncating.
          width={170}
          showTimeInput={false}
          // Override the default "Apr 25" label so the year is
          // visible — this row is approving a 2027 date and the
          // editor should see that explicitly.
          formatTriggerLabel={(r) =>
            r.start ? format(r.start, "d MMM yyyy") : ""
          }
        />
      </TableCell>
      {/* Action cell keeps its content left-aligned to match the
          "Action" TableHead (which we overrode away from the DS
          default last:text-right). Flex children ignore the cell's
          text-align anyway, so the explicit flex layout below is
          what positions the buttons. */}
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
