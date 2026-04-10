"use client";

import { useMemo } from "react";
import { ContextCard } from "@/components/ui/ContextCard";

// ============================================================================
// Types
// ============================================================================

interface RelativeTimeCardProps {
  /** The date to display */
  date: Date;
  /** The trigger element */
  children: React.ReactNode;
  /** Popover side */
  side?: "top" | "bottom" | "left" | "right";
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

function getRelativeTimeString(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const absDiffMs = Math.abs(diffMs);
  const isFuture = diffMs < 0;

  const seconds = Math.floor(absDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let label: string;

  if (seconds < 5) {
    return "just now";
  } else if (seconds < 60) {
    label = `${seconds} second${seconds !== 1 ? "s" : ""}`;
  } else if (minutes < 60) {
    label = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else if (hours < 24) {
    label = `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else if (days < 7) {
    label = `${days} day${days !== 1 ? "s" : ""}`;
  } else if (weeks < 5) {
    label = `${weeks} week${weeks !== 1 ? "s" : ""}`;
  } else if (months < 12) {
    label = `${months} month${months !== 1 ? "s" : ""}`;
  } else {
    label = `${years} year${years !== 1 ? "s" : ""}`;
  }

  return isFuture ? `in ${label}` : `${label} ago`;
}

// ============================================================================
// RelativeTimeCard
// ============================================================================

export function RelativeTimeCard({
  date,
  children,
  side = "top",
  className,
}: RelativeTimeCardProps) {
  const formattedDate = useMemo(
    () =>
      date.toLocaleString(undefined, {
        dateStyle: "long",
        timeStyle: "medium",
      }),
    [date],
  );

  const relativeTime = useMemo(() => getRelativeTimeString(date), [date]);

  const content = (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontSize: 13,
          lineHeight: "20px",
          color: "var(--ds-gray-900)",
        }}
      >
        {formattedDate}
      </span>
      <span
        style={{
          fontSize: 13,
          lineHeight: "20px",
          color: "var(--ds-gray-600)",
        }}
      >
        {relativeTime}
      </span>
    </div>
  );

  return (
    <ContextCard>
      <ContextCard.Trigger content={content} side={side}>
        {children}
      </ContextCard.Trigger>
    </ContextCard>
  );
}
