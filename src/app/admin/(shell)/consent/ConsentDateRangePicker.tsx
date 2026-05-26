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
  matchPreset,
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

const PRESET_LABELS: Record<PresetId, string> = Object.fromEntries(
  PRESETS.map(({ id, label }) => [id, label]),
) as Record<PresetId, string>;

const calendarPresets: CalendarPreset[] = PRESETS.map(({ label, id }) => {
  const window = presetWindow(id);
  return {
    label,
    value: id,
    getRange: () => ({ start: window.start, end: window.end }),
  };
});

// Show the preset name on the trigger when the current range
// matches one of our presets — keeps the resting state reading
// "Last 7 days" instead of an explicit date range. Falls back to
// "Mar 19 – Mar 26" when the user picks an arbitrary range.
function formatTriggerLabel(range: DateRange): string {
  if (!range.start || !range.end) return "Date range";
  const preset = matchPreset({ start: range.start, end: range.end });
  if (preset) return PRESET_LABELS[preset];
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${fmt(range.start)} – ${fmt(range.end)}`;
}

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
        popoverAlignment="end"
        formatTriggerLabel={formatTriggerLabel}
      />
    </div>
  );
}
