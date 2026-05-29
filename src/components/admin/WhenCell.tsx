"use client";

import { RelativeTimeCard } from "@/components/ui/RelativeTimeCard";

// Compact "MMM DD HH:MM:SS" formatter used in consent tables.
// Localised month abbreviation; 24-hour clock since admin tables
// favour density over am/pm ceremony. Pair with RelativeTimeCard
// so hovering surfaces the full local + UTC date and "X mins ago"
// detail without bloating the row.
function formatWhen(iso: string): string {
  const d = new Date(iso);
  const month = d.toLocaleDateString(undefined, { month: "short" });
  const day = String(d.getDate()).padStart(2, "0");
  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return `${month} ${day} ${time}`;
}

interface WhenCellProps {
  iso: string;
}

export function WhenCell({ iso }: WhenCellProps) {
  return (
    <RelativeTimeCard date={new Date(iso)}>
      <span style={{ whiteSpace: "nowrap" }}>{formatWhen(iso)}</span>
    </RelativeTimeCard>
  );
}
