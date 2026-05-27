// Shared date-range presets + URL helpers for the consent dashboard.
//
// Stays framework-agnostic: pure date math + parsing. The picker
// renders these as Calendar presets; the page reads URL params and
// resolves them to a {start, end} window the dashboard consumes.

export interface DateWindow {
  /** Inclusive start. */
  start: Date;
  /** Inclusive end (typically `today` for trailing ranges). */
  end: Date;
}

export type PresetId =
  | "last-7-days"
  | "last-30-days"
  | "last-90-days"
  | "this-month"
  | "last-month"
  | "all-time";

const DEFAULT_PRESET: PresetId = "last-90-days";
// "All time" picks a date far enough back that every row qualifies.
// We don't have data older than 2020, so 2000-01-01 is a safe
// sentinel and keeps the URL simple (no special-case for "no upper").
const ALL_TIME_START = new Date("2000-01-01T00:00:00.000Z");

function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setUTCHours(0, 0, 0, 0);
  return out;
}

function endOfDay(d: Date): Date {
  const out = new Date(d);
  out.setUTCHours(23, 59, 59, 999);
  return out;
}

function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + days);
  return out;
}

export function presetWindow(id: PresetId): DateWindow {
  const today = startOfDay(new Date());
  switch (id) {
    case "last-7-days":
      return { start: addDays(today, -6), end: endOfDay(today) };
    case "last-30-days":
      return { start: addDays(today, -29), end: endOfDay(today) };
    case "last-90-days":
      return { start: addDays(today, -89), end: endOfDay(today) };
    case "this-month": {
      const start = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
      );
      return { start, end: endOfDay(today) };
    }
    case "last-month": {
      const start = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1),
      );
      const end = endOfDay(
        new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 0)),
      );
      return { start, end };
    }
    case "all-time":
      return { start: ALL_TIME_START, end: endOfDay(today) };
  }
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseIsoDate(raw: string | undefined): Date | null {
  if (!raw || !ISO_DATE.test(raw)) return null;
  const parsed = new Date(`${raw}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function isoOf(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Resolve the active window from URL search params. */
export function windowFromParams(params: {
  from?: string;
  to?: string;
}): DateWindow {
  const from = parseIsoDate(params.from);
  const to = parseIsoDate(params.to);
  if (from && to && from <= to) {
    return { start: startOfDay(from), end: endOfDay(to) };
  }
  return presetWindow(DEFAULT_PRESET);
}

/** Same-length window immediately preceding `current`. */
export function previousWindow(current: DateWindow): DateWindow {
  const lengthMs = current.end.getTime() - current.start.getTime();
  const end = new Date(current.start.getTime() - 1);
  const start = new Date(end.getTime() - lengthMs);
  return { start: startOfDay(start), end: endOfDay(end) };
}

/** Days in the window (inclusive). */
export function windowDays(w: DateWindow): number {
  // Normalise both endpoints to start-of-day so a window ending at
  // 23:59:59.999 doesn't round up an extra day.
  const startMs = startOfDay(w.start).getTime();
  const endMs = startOfDay(w.end).getTime();
  return Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1;
}

/** Match a {start, end} against the known presets — returns the id
 *  if the window equals one of them (used by the picker to show
 *  which preset, if any, is currently active). */
export function matchPreset(w: DateWindow): PresetId | null {
  const ids: PresetId[] = [
    "last-7-days",
    "last-30-days",
    "last-90-days",
    "this-month",
    "last-month",
    "all-time",
  ];
  for (const id of ids) {
    const candidate = presetWindow(id);
    if (
      isoOf(candidate.start) === isoOf(w.start) &&
      isoOf(candidate.end) === isoOf(w.end)
    ) {
      return id;
    }
  }
  return null;
}

export const DEFAULT_RANGE_ID = DEFAULT_PRESET;
