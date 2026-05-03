"use client";

// src/app/admin/(shell)/races/date-review/RowActions.tsx
//
// Per-row controls for the Race Date Review queue:
//   - Date input (default: suggestedNextDate) so the editor can
//     nudge the value before approving — handy when Haiku got the
//     month/day right but, say, picked the wrong year edition.
//   - Approve button → posts to approveSuggestion server action.
//     The date input's current value goes along as overrideDate.
//   - Reject button → posts to rejectSuggestion server action.
//     Confirms first since rejecting hides the row until the
//     editor manually clears the status in Studio.
//
// useTransition tracks the in-flight server-action call so the
// buttons disable + dim while the patch round-trips through Sanity.

import { useState, useTransition } from "react";

import { approveSuggestion, rejectSuggestion } from "./actions";

interface RowActionsProps {
  id: string;
  /** ISO datetime — used as the default for the date input. */
  suggestedDate: string;
  /** Race title — used in the reject confirmation prompt. */
  title: string;
}

const buttonBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 28,
  paddingLeft: 10,
  paddingRight: 10,
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  border: "1px solid transparent",
  transition: "background 0.15s ease, color 0.15s ease",
} as const;

export default function RowActions({ id, suggestedDate, title }: RowActionsProps) {
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        opacity: pending ? 0.6 : 1,
      }}
    >
      <input
        type="date"
        value={overrideDate}
        onChange={(e) => setOverrideDate(e.target.value)}
        disabled={pending}
        aria-label={`Edit suggested date for ${title}`}
        style={{
          height: 28,
          padding: "0 8px",
          borderRadius: 6,
          border: "1px solid var(--ds-gray-400)",
          background: "var(--ds-background-100)",
          color: "var(--ds-gray-1000)",
          fontSize: 12,
          cursor: pending ? "not-allowed" : "text",
        }}
      />
      <button
        type="button"
        onClick={handleApprove}
        disabled={pending}
        style={{
          ...buttonBase,
          background: "var(--ds-gray-1000)",
          color: "var(--ds-background-100)",
          cursor: pending ? "not-allowed" : "pointer",
        }}
      >
        Approve
      </button>
      <button
        type="button"
        onClick={handleReject}
        disabled={pending}
        style={{
          ...buttonBase,
          background: "var(--ds-background-100)",
          color: "var(--ds-gray-1000)",
          borderColor: "var(--ds-gray-400)",
          cursor: pending ? "not-allowed" : "pointer",
        }}
      >
        Reject
      </button>
    </div>
  );
}
