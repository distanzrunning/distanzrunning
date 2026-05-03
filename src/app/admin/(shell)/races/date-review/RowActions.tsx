"use client";

// src/app/admin/(shell)/races/date-review/RowActions.tsx
//
// Per-row controls for the Race Date Review queue:
//   - Date input (default: suggestedNextDate) so the editor can
//     nudge the value before approving — handy when Haiku got the
//     month/day right but, say, picked the wrong year edition.
//   - Approve button (DS Button, default variant) → server action.
//     The date input's current value goes along as overrideDate.
//   - Reject button (DS Button, secondary variant) → server action.
//     Confirms first since rejecting hides the row until the
//     editor manually clears the status in Studio.
//
// useTransition tracks the in-flight server-action call; both
// buttons take loading={pending} so they spinner-disable in unison.

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";

import { approveSuggestion, rejectSuggestion } from "./actions";

interface RowActionsProps {
  id: string;
  /** ISO datetime — used as the default for the date input. */
  suggestedDate: string;
  /** Race title — used in the reject confirmation prompt. */
  title: string;
}

export default function RowActions({
  id,
  suggestedDate,
  title,
}: RowActionsProps) {
  const [overrideDate, setOverrideDate] = useState(suggestedDate.slice(0, 10));
  const [pending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", id);
      fd.set("overrideDate", overrideDate);
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
    <div className="flex items-center gap-2">
      {/* Native <input type="date"> — DS doesn't ship a date input
          (Calendar is popover-based). Matches the Input/Select
          small size: h-8, rounded-[6px], faint hairline ring at
          gray-1000 alpha-0.1, hover bumps to gray-alpha-600. */}
      <input
        type="date"
        value={overrideDate}
        onChange={(e) => setOverrideDate(e.target.value)}
        disabled={pending}
        aria-label={`Edit suggested date for ${title}`}
        className="h-8 cursor-text rounded-[6px] bg-[color:var(--ds-background-100)] px-3 text-copy-13 text-[color:var(--ds-gray-1000)] outline-none transition-shadow duration-200 [box-shadow:0_0_0_1px_rgba(var(--ds-gray-1000-rgb),0.1)] hover:[box-shadow:0_0_0_1px_var(--ds-gray-alpha-600)] focus-visible:[box-shadow:0_0_0_1px_var(--ds-gray-alpha-600),0_0_0_4px_rgba(var(--ds-gray-1000-rgb),0.16)] disabled:cursor-not-allowed"
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
