"use client";

// src/app/races/filters/DateFilter.tsx
//
// Wraps the DS Calendar in range mode. The Calendar primitive owns
// its own trigger button + popover + Apply, so we don't need the
// FilterChip wrapper here — we just shape the value/onChange to
// align with FiltersShell's RaceFilters object.
//
// Presets cover the most common queries — Next 30 days, This year,
// Next 6 months — so users rarely need to drag two endpoints. The
// Calendar handles the date-string display formatting on the
// trigger.

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

const today = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date: Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const addMonths = (date: Date, months: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const endOfYear = (date: Date): Date => {
  return new Date(date.getFullYear(), 11, 31);
};

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
      showTimeInput={false}
      futurePresets={[
        {
          value: "next-30",
          label: "Next 30 days",
          getRange: () => ({ start: today(), end: addDays(today(), 30) }),
        },
        {
          value: "next-3m",
          label: "Next 3 months",
          getRange: () => ({ start: today(), end: addMonths(today(), 3) }),
        },
        {
          value: "next-6m",
          label: "Next 6 months",
          getRange: () => ({ start: today(), end: addMonths(today(), 6) }),
        },
        {
          value: "this-year",
          label: "Rest of this year",
          getRange: () => ({ start: today(), end: endOfYear(today()) }),
        },
      ]}
      presetPlaceholder="Date range"
    />
  );
}
