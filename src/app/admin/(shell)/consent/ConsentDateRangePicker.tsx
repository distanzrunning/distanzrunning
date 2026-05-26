"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import {
  Calendar,
  type CalendarPreset,
  type DateRange,
} from "@/components/ui/Calendar";

import {
  isoOf,
  presetWindow,
  type PresetId,
  windowFromParams,
} from "./presets";

const PRESETS: { label: string; id: PresetId }[] = [
  { label: "Last 7 days", id: "last-7-days" },
  { label: "Last 30 days", id: "last-30-days" },
  { label: "Last 90 days", id: "last-90-days" },
  { label: "This month", id: "this-month" },
  { label: "Last month", id: "last-month" },
  { label: "All time", id: "all-time" },
];

const calendarPresets: CalendarPreset[] = PRESETS.map(({ label, id }) => {
  const window = presetWindow(id);
  return {
    label,
    value: id,
    getRange: () => ({ start: window.start, end: window.end }),
  };
});

export default function ConsentDateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const fromParam = searchParams.get("from") ?? undefined;
  const toParam = searchParams.get("to") ?? undefined;
  const currentWindow = windowFromParams({ from: fromParam, to: toParam });

  const value: DateRange = {
    start: currentWindow.start,
    end: currentWindow.end,
  };

  const handleChange = (range: DateRange) => {
    if (!range.start || !range.end) return;
    const next = new URLSearchParams(searchParams.toString());
    next.set("from", isoOf(range.start));
    next.set("to", isoOf(range.end));
    // Reset the filter when the window changes — staying on
    // "accept_all" with a different window is usually noise.
    next.delete("filter");
    startTransition(() => {
      router.push(`/admin/consent?${next.toString()}`);
    });
  };

  return (
    <div style={{ opacity: isPending ? 0.6 : 1, transition: "opacity 0.15s" }}>
      <Calendar
        value={value}
        onChange={handleChange}
        presets={calendarPresets}
        compact
        popoverAlignment="start"
      />
    </div>
  );
}
