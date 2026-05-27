"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import {
  Calendar,
  type CalendarPreset,
  type DateRange,
} from "@/components/ui/Calendar";

import {
  DEFAULT_PRESET,
  isoOf,
  matchPreset,
  presetWindow,
  type PresetId,
  windowFromParams,
} from "./presets";

const PRESETS: { label: string; id: PresetId }[] = [
  { label: "Last 7 days", id: "7d" },
  { label: "Last 30 days", id: "30d" },
  { label: "Last 90 days", id: "90d" },
  { label: "This month", id: "mtd" },
  { label: "Last month", id: "last-month" },
  { label: "All time", id: "all" },
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

  const periodParam = searchParams.get("period") ?? undefined;
  const fromParam = searchParams.get("from") ?? undefined;
  const toParam = searchParams.get("to") ?? undefined;
  const currentWindow = windowFromParams({
    period: periodParam,
    from: fromParam,
    to: toParam,
  });

  const value: DateRange = {
    start: currentWindow.start,
    end: currentWindow.end,
  };

  const handleChange = (range: DateRange) => {
    if (!range.start || !range.end) return;
    const next = new URLSearchParams(searchParams.toString());
    // Reset the filter when the window changes — staying on
    // "accept_all" with a different window is usually noise.
    next.delete("filter");
    // If the chosen range matches a preset, store it by id so the
    // link stays relative-to-today on revisit; otherwise fall back
    // to absolute from/to for a custom range. The default preset is
    // the bare URL, so we omit the param in that case.
    const preset = matchPreset({ start: range.start, end: range.end });
    if (preset) {
      next.delete("from");
      next.delete("to");
      if (preset === DEFAULT_PRESET) {
        next.delete("period");
      } else {
        next.set("period", preset);
      }
    } else {
      next.set("from", isoOf(range.start));
      next.set("to", isoOf(range.end));
      next.delete("period");
    }
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
        compactPresetLabel
        popoverAlignment="end"
      />
    </div>
  );
}
