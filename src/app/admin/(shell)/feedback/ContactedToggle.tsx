"use client";

import { useTransition } from "react";
import { Check, Mail } from "lucide-react";

import { Tooltip } from "@/components/ui/Tooltip";

import { toggleFeedbackContacted } from "./actions";

// Per-row toggle for the contacted_at flag.
// - No email on the row → render a muted dash; can't follow up on
//   a row with nobody to follow up with.
// - Email present, not contacted → outlined Mail icon. Click = mark
//   contacted with the current timestamp.
// - Email present, contacted → filled Check chip + hover tooltip
//   showing when. Click = clear back to uncontacted.
//
// Optimistic UX comes for free from React's startTransition + Next's
// revalidateTag in the server action — the row re-renders with the
// new contacted_at after the round-trip without a full skeleton.
export default function ContactedToggle({
  id,
  hasEmail,
  contactedAt,
}: {
  id: number;
  hasEmail: boolean;
  contactedAt: string | null;
}) {
  const [pending, start] = useTransition();

  if (!hasEmail) {
    return (
      <Tooltip content="No email — nothing to follow up on">
        <span style={{ color: "rgb(var(--color-textSubtler))" }}>—</span>
      </Tooltip>
    );
  }

  const handle = () => {
    start(async () => {
      const fd = new FormData();
      fd.set("id", String(id));
      try {
        await toggleFeedbackContacted(fd);
      } catch (err) {
        console.error("[feedback] toggle contacted failed", err);
      }
    });
  };

  const contacted = !!contactedAt;
  const tooltipBody = contacted
    ? `Contacted ${new Date(contactedAt).toLocaleString()} — click to undo`
    : "Mark as contacted";

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 6,
    border: "1px solid rgb(var(--color-borderDefault))",
    cursor: "pointer",
    transition: "background 0.15s ease, color 0.15s ease",
    opacity: pending ? 0.6 : 1,
  };

  const palette = contacted
    ? {
        background: "var(--ds-green-100)",
        color: "var(--ds-green-900)",
      }
    : {
        background: "var(--ds-background-100)",
        color: "rgb(var(--color-textSubtle))",
      };

  return (
    <Tooltip content={tooltipBody}>
      <button
        type="button"
        onClick={handle}
        disabled={pending}
        aria-pressed={contacted}
        aria-label={contacted ? "Unmark as contacted" : "Mark as contacted"}
        style={{ ...baseStyle, ...palette }}
      >
        {contacted ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Mail className="w-3.5 h-3.5" />
        )}
      </button>
    </Tooltip>
  );
}
