"use client";

import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
} from "./datePresets";

const PRESETS: { label: string; id: PresetId }[] = [
  { label: "Last 7 days", id: "7d" },
  { label: "Last 30 days", id: "30d" },
  { label: "Last 90 days", id: "90d" },
  { label: "This month", id: "mtd" },
  { label: "Last month", id: "last-month" },
  { label: "All time", id: "all" },
];

/**
 * Vercel-style admin date range picker — 6 presets (Last 7d /
 * 30d / 90d / This month / Last month / All time) plus a custom
 * range mode via the Calendar.
 *
 * Reads + writes URL search params (`period` / `from` / `to`) so
 * a refresh / share / back-button restores the same window.
 * `usePathname()` means it works on any admin route — no
 * hardcoded base path.
 *
 * `earliestDate` (optional) bounds the "All time" preset to the
 * first real data point for that dataset, so the calendar grid
 * doesn't suggest a 25-year empty span.
 */
export default function AdminDateRangePicker({
  tz,
  earliestDate,
}: {
  /** IANA timezone used for day-bucketing (e.g. "Europe/Brussels"). */
  tz: string;
  /** Used to bound the "All time" preset's visual range so the
   *  calendar grid + selected-preset detection agree with the
   *  server-side narrowing in the page. */
  earliestDate: Date | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
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
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
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
