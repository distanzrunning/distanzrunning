"use client";

// src/app/races/filters/DateFilter.tsx
//
// Wraps the DS Calendar in range mode. The Calendar primitive owns
// its own trigger button + popover + Apply, so we don't need the
// FilterChip wrapper here — we just shape the value/onChange to
// align with FiltersShell's RaceFilters object.
//
// We render the standard non-compact trigger (h-32 to match the
// other filter chips in the row) with showMonthTab on. The months
// tab inside the popover lets a single tap pick a whole calendar
// month — the most common race-search shape ("races in October").
// Presets aren't passed: in non-compact mode they would render as
// a *separate* combobox alongside the trigger, which breaks the
// "one chip per filter" rhythm of the row.

import { useEffect, useState } from "react";

import { Calendar, type DateRange } from "@/components/ui/Calendar";

interface DateFilterProps {
  value: { from?: string; to?: string };
  onChange: (next: { from?: string; to?: string }) => void;
}

function toIsoDate(d: Date): string {
  // YYYY-MM-DD using local-date components, NOT toISOString —
  // toISOString shifts the date to UTC, which off-by-ones any
  // user east of UTC (e.g. picking February in UTC+1 returns
  // "Jan 31" because Feb 1 00:00 local = Jan 31 23:00 UTC).
  // The serialized string matches Sanity's `date` type so
  // direct string comparison via `>=` / `<=` works in GROQ.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromIsoDate(iso: string | undefined): Date | null {
  if (!iso) return null;
  // Parse as local-date midnight rather than letting `new Date(iso)`
  // treat YYYY-MM-DD as UTC — pairs with toIsoDate's local-format.
  const parts = iso.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [y, m, day] = parts;
  return new Date(y, m - 1, day);
}

export default function DateFilter({ value, onChange }: DateFilterProps) {
  // Calendar is a fully controlled component when `value` is set —
  // every click (including the partial "start picked, end pending"
  // state) needs to round-trip through value/onChange or the
  // calendar UI freezes. We hold a local copy of the displayed
  // range here and only forward complete (or fully cleared)
  // selections up to FiltersShell, so the grid doesn't run a
  // server round-trip + skeleton flash on each half-selected click.
  const [localRange, setLocalRange] = useState<DateRange>({
    start: fromIsoDate(value.from),
    end: fromIsoDate(value.to),
  });

  // Re-sync local state when the URL changes externally — back/
  // forward, Reset all, or any other path that bypasses the
  // calendar UI.
  useEffect(() => {
    setLocalRange({
      start: fromIsoDate(value.from),
      end: fromIsoDate(value.to),
    });
  }, [value.from, value.to]);

  return (
    <Calendar
      placeholder="Date"
      value={localRange}
      onChange={(range) => {
        setLocalRange(range);
        if (range.start && range.end) {
          onChange({
            from: toIsoDate(range.start),
            to: toIsoDate(range.end),
          });
        } else if (!range.start && !range.end) {
          onChange({ from: undefined, to: undefined });
        }
      }}
      size="small"
      width={140}
      showMonthTab
      showTimeInput={false}
    />
  );
}
