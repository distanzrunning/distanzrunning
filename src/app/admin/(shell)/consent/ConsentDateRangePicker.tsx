"use client";

import { useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

export default function ConsentDateRangePicker({
  tz,
  earliestDate,
}: {
  tz: string;
  /** Used to bound the "All time" preset's visual range so the
   *  calendar grid + selected-preset detection agree with the
   *  server-side narrowing in page.tsx. */
  earliestDate: Date | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Calendar presets depend on the active tz and the earliestDate
  // (for "all"). Memo so re-renders don't reconstruct the windows
  // on every mouse move.
  const calendarPresets = useMemo<CalendarPreset[]>(
    () =>
      PRESETS.map(({ label, id }) => {
        const window = presetWindow(id, tz, earliestDate);
        return {
          label,
          value: id,
          getRange: () => ({ start: window.start, end: window.end }),
        };
      }),
    [tz, earliestDate],
  );

  const periodParam = searchParams.get("period") ?? undefined;
  const fromParam = searchParams.get("from") ?? undefined;
  const toParam = searchParams.get("to") ?? undefined;
  const currentWindow = windowFromParams(
    {
      period: periodParam,
      from: fromParam,
      to: toParam,
    },
    tz,
    earliestDate,
  );

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
    const preset = matchPreset(
      { start: range.start, end: range.end },
      tz,
      earliestDate,
    );
    if (preset) {
      next.delete("from");
      next.delete("to");
      if (preset === DEFAULT_PRESET) {
        next.delete("period");
      } else {
        next.set("period", preset);
      }
    } else {
      next.set("from", isoOf(range.start, tz));
      next.set("to", isoOf(range.end, tz));
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
