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

import { Calendar, type DateRange } from "@/components/ui/Calendar";

interface DateFilterProps {
  value: { from?: string; to?: string };
  onChange: (next: { from?: string; to?: string }) => void;
}

function toIsoDate(d: Date): string {
  // YYYY-MM-DD — matches eventDate in Sanity (date type, no time)
  // so direct string comparison via `>=` / `<=` works in GROQ.
  return d.toISOString().slice(0, 10);
}

function fromIsoDate(iso: string | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default function DateFilter({ value, onChange }: DateFilterProps) {
  const dateRange: DateRange = {
    start: fromIsoDate(value.from),
    end: fromIsoDate(value.to),
  };

  return (
    <Calendar
      placeholder="Date"
      value={dateRange}
      onChange={(range) => {
        onChange({
          from: range.start ? toIsoDate(range.start) : undefined,
          to: range.end ? toIsoDate(range.end) : undefined,
        });
      }}
      size="small"
      width={220}
      showMonthTab
      showTimeInput={false}
    />
  );
}
