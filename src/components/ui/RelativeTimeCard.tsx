"use client";

import { useMemo, useState, useEffect } from "react";
import { ContextCard } from "@/components/ui/ContextCard";

// ============================================================================
// Types
// ============================================================================

interface RelativeTimeCardProps {
  /** The date to display. Accepts a JS `Date` or Unix-ms timestamp. */
  date: Date | number;
  /**
   * Optional trigger override. Leave empty to render the short formatter
   * ("2m ago", "Yesterday", "Mar 14"). Use this only for non-time labels
   * the formatter can't describe ("Pending", "Queued", "Just now").
   */
  children?: React.ReactNode;
  /** Popover side */
  side?: "top" | "bottom" | "left" | "right";
  /** Additional CSS classes applied to the default trigger span */
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

function toDate(date: Date | number): Date {
  return typeof date === "number" ? new Date(date) : date;
}

/**
 * Short formatter for the trigger label. Output examples:
 *   "Just now", "2m ago", "5h ago", "Yesterday", "3d ago",
 *   "Mar 14", "Mar 14, 2024", and future-tense equivalents.
 */
function formatShortRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const absDiffMs = Math.abs(diffMs);
  const isFuture = diffMs < 0;

  const seconds = Math.floor(absDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 30) return "Just now";
  if (minutes < 60) return isFuture ? `in ${minutes}m` : `${minutes}m ago`;
  if (hours < 24) return isFuture ? `in ${hours}h` : `${hours}h ago`;
  if (days === 1) return isFuture ? "Tomorrow" : "Yesterday";
  if (days < 7) return isFuture ? `in ${days}d` : `${days}d ago`;

  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

function getDetailedRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const absDiffMs = Math.abs(diffMs);
  const isFuture = diffMs < 0;

  const totalSeconds = Math.floor(absDiffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  }
  parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

  const label = parts.join(", ");

  if (totalSeconds < 1) return "just now";
  return isFuture ? `in ${label}` : `${label} ago`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatUTCDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatUTCTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

function getTimezoneLabel(): string {
  const offset = new Date().getTimezoneOffset();
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  const sign = offset <= 0 ? "+" : "-";
  if (hours === 0 && minutes === 0) return "UTC";
  const label = minutes > 0 ? `${hours}:${String(minutes).padStart(2, "0")}` : `${hours}`;
  return `GMT${sign}${label}`;
}

// ============================================================================
// Timezone Badge
// ============================================================================

function TimezoneBadge({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-center h-4 px-1.5 rounded-[2px]"
      style={{ background: "var(--ds-gray-200)" }}
    >
      <span
        className="font-mono text-xs leading-none"
        style={{ color: "var(--ds-gray-900)", fontSize: 12 }}
      >
        {label}
      </span>
    </div>
  );
}

// ============================================================================
// Card Content (ticking)
// ============================================================================

function RelativeTimeCardContent({ date }: { date: Date }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const relativeTime = getDetailedRelativeTime(date);
  const utcDate = formatUTCDate(date);
  const utcTime = formatUTCTime(date);
  const localDate = formatDate(date);
  const localTime = formatTime(date);
  const tzLabel = getTimezoneLabel();

  return (
    <div className="flex flex-col gap-3 min-w-[300px]">
      {/* Relative time */}
      <div className="flex flex-col gap-3">
        <span
          className="tabular-nums text-[13px] leading-5"
          style={{ color: "var(--ds-gray-900)" }}
        >
          {relativeTime}
        </span>
      </div>

      {/* Timezone rows */}
      <div className="flex flex-col gap-2">
        {/* UTC row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <TimezoneBadge label="UTC" />
            <span className="text-[13px] leading-5">{utcDate}</span>
          </div>
          <span
            className="tabular-nums font-mono text-xs"
            style={{ color: "var(--ds-gray-900)", fontSize: 12 }}
          >
            {utcTime}
          </span>
        </div>

        {/* Local timezone row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <TimezoneBadge label={tzLabel} />
            <span className="text-[13px] leading-5">{localDate}</span>
          </div>
          <span
            className="tabular-nums font-mono text-xs"
            style={{ color: "var(--ds-gray-900)", fontSize: 12 }}
          >
            {localTime}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Default formatted trigger (ticks every 30s so labels stay fresh)
// ============================================================================

function ShortFormattedTrigger({
  date,
  className = "",
}: {
  date: Date;
  className?: string;
}) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`tabular-nums underline decoration-dashed underline-offset-[5px] ${className}`}
    >
      {formatShortRelativeTime(date)}
    </span>
  );
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
  const targetDate = useMemo(() => toDate(date), [date]);
  const content = useMemo(
    () => <RelativeTimeCardContent date={targetDate} />,
    [targetDate],
  );

  const trigger = children ?? (
    <ShortFormattedTrigger date={targetDate} className={className} />
  );

  return (
    <ContextCard>
      <ContextCard.Trigger content={content} side={side}>
        {trigger}
      </ContextCard.Trigger>
    </ContextCard>
  );
}
