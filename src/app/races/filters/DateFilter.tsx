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
  const dateRange: DateRange = {
    start: fromIsoDate(value.from),
    end: fromIsoDate(value.to),
  };

  return (
    <Calendar
      placeholder="Date"
      value={dateRange}
      onChange={(range) => {
        // Calendar emits onChange on every click — including the
        // partial state where the user has picked a start but not
        // an end yet. Don't propagate until BOTH ends are set
        // (or both are null, e.g. the trigger's X clear button) —
        // otherwise the grid runs a server round-trip + skeleton
        // flash on each half-selected click.
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
      width={220}
      showMonthTab
      showTimeInput={false}
    />
  );
}
