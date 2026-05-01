"use client";

// src/app/races/filters/DateFilter.tsx
//
// Wraps the DS Calendar in range mode. The Calendar primitive owns
// its own trigger button + popover + Apply, so we don't need the
// FilterChip wrapper here — we just shape the value/onChange to
// align with FiltersShell's RaceFilters object.
//
// Two Calendar features carry most of the UX weight:
//   - compact = a 180 px trigger so the chip sits in the row
//     alongside the icon-only Search and (eventually) the other
//     filter pills without dominating.
//   - showMonthTab = adds a "months" tab inside the calendar
//     popover so a single tap picks a whole month — the most
//     common race-search shape ("races in October").
//
// The futurePresets cover the second-most-common query shapes
// (current month, near-future windows) so range dragging is a
// last resort.

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

const addMonths = (date: Date, months: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const startOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const endOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);

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
      compact
      showMonthTab
      showTimeInput={false}
      presets={[
        {
          value: "current-month",
          label: "Current month",
          getRange: () => ({
            start: startOfMonth(today()),
            end: endOfMonth(today()),
          }),
        },
        {
          value: "next-month",
          label: "Next month",
          getRange: () => {
            const next = addMonths(today(), 1);
            return { start: startOfMonth(next), end: endOfMonth(next) };
          },
        },
        {
          value: "next-3-months",
          label: "Next 3 months",
          getRange: () => ({ start: today(), end: addMonths(today(), 3) }),
        },
        {
          value: "next-6-months",
          label: "Next 6 months",
          getRange: () => ({ start: today(), end: addMonths(today(), 6) }),
        },
        {
          value: "next-12-months",
          label: "Next 12 months",
          getRange: () => ({ start: today(), end: addMonths(today(), 12) }),
        },
      ]}
      presetPlaceholder="Date range"
    />
  );
}
