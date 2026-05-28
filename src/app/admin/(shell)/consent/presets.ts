// Shared date-range presets + URL helpers for the consent dashboard.
//
// Stays framework-agnostic: pure date math + parsing. The picker
// renders these as Calendar presets; the page reads URL params and
// resolves them to a {start, end} window the dashboard consumes.
//
// All day-bucketing is anchored to a configurable IANA timezone
// (loaded server-side from site_settings → getSiteSettings()). The
// DB stores timestamps in UTC, but business reporting groups rows by
// the local calendar day they fall on. Every helper that touches
// "what day is this?" takes `tz` as a parameter so the consent
// dashboard, picker, and chart all agree on a single tz per request.

export interface DateWindow {
  /** Inclusive start. UTC instant at 00:00 (tz) on the start day. */
  start: Date;
  /** Inclusive end. UTC instant at 23:59:59.999 (tz) on the end day. */
  end: Date;
}

export type PresetId =
  | "7d"
  | "30d"
  | "90d"
  | "mtd"
  | "last-month"
  | "all";

export const DEFAULT_PRESET: PresetId = "7d";
// "All time" picks a date far enough back that every row qualifies.
// We don't have data older than 2020, so 2000-01-01 is a safe
// sentinel and keeps the URL simple (no special-case for "no upper").
// Consumers can call isAllTimeStart() to detect this case and swap
// in a more useful start (e.g. the date of the first stored row)
// before rendering.
export const ALL_TIME_START = new Date("2000-01-01T00:00:00.000Z");

/** True if the given Date is the sentinel used by the "all" preset. */
export function isAllTimeStart(d: Date): boolean {
  return d.getTime() === ALL_TIME_START.getTime();
}

// ---------- Timezone helpers ----------

// Cache Intl.DateTimeFormat instances by tz — constructing them on
// every call is measurable in tight loops.
const dayFormatterCache = new Map<string, Intl.DateTimeFormat>();
function getDayFormatter(tz: string): Intl.DateTimeFormat {
  let f = dayFormatterCache.get(tz);
  if (!f) {
    // 'en-CA' formats as YYYY-MM-DD — exactly the shape we want for
    // day-keys and ISO URL params.
    f = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    dayFormatterCache.set(tz, f);
  }
  return f;
}

/** "YYYY-MM-DD" for the `tz`-local day containing `date`. */
export function formatBusinessDay(date: Date, tz: string): string {
  return getDayFormatter(tz).format(date);
}

/** Today's `tz` day as "YYYY-MM-DD". Recomputed on every call so
 *  callers behave correctly across midnight. */
export function businessTodayKey(tz: string): string {
  return formatBusinessDay(new Date(), tz);
}

// Returns minutes the tz is ahead of UTC at the given instant.
// Uses Intl to read what wall-clock time the tz shows for the
// instant, then diffs from UTC. DST-safe.
function tzOffsetMinutes(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const parts = dtf.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  const asUTC = Date.UTC(
    parseInt(map.year, 10),
    parseInt(map.month, 10) - 1,
    parseInt(map.day, 10),
    parseInt(map.hour, 10),
    parseInt(map.minute, 10),
    parseInt(map.second, 10),
  );
  return Math.round((asUTC - date.getTime()) / 60_000);
}

/** UTC instant at 00:00 (tz) on the given day-key. */
export function businessDayStart(dayKey: string, tz: string): Date {
  const [y, m, d] = dayKey.split("-").map(Number);
  const naive = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
  const offset = tzOffsetMinutes(naive, tz);
  return new Date(naive.getTime() - offset * 60_000);
}

/** UTC instant at 23:59:59.999 (tz) on the given day-key. */
export function businessDayEnd(dayKey: string, tz: string): Date {
  const [y, m, d] = dayKey.split("-").map(Number);
  const naive = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
  const offset = tzOffsetMinutes(naive, tz);
  return new Date(naive.getTime() - offset * 60_000);
}

/** Step a day-key forward/backward by N calendar days. Operates on
 *  the date label, not real time — DST-safe and tz-independent. */
export function addBusinessDays(dayKey: string, n: number, tz: string): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  // Noon UTC representative — at any tz this falls well inside the
  // same calendar day, so formatting it in tz gives the same date.
  const date = new Date(Date.UTC(y, m - 1, d + n, 12, 0, 0, 0));
  return formatBusinessDay(date, tz);
}

/** Calendar-day diff between two day-keys (a − b). Pure string math,
 *  no tz needed since both inputs are already calendar dates. */
export function diffBusinessDays(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round(
    (Date.UTC(ay, am - 1, ad) - Date.UTC(by, bm - 1, bd)) / 86_400_000,
  );
}

/** Milliseconds from `Date.now()` until the next `tz` midnight —
 *  handy for scheduling a one-shot timer that refreshes
 *  "today"-dependent UI exactly when the calendar day rolls. */
export function msUntilNextBusinessDay(tz: string): number {
  const nextKey = addBusinessDays(businessTodayKey(tz), 1, tz);
  return businessDayStart(nextKey, tz).getTime() - Date.now();
}

// ---------- Window construction ----------

/** `earliestDate` (optional) lets the "all" preset resolve to a real
 *  data-bound start instead of the 2000-01-01 sentinel. Pass it on
 *  both the server (page.tsx, from getEarliestDecisionDate) and the
 *  client picker so windows + preset matching stay in sync. */
export function presetWindow(
  id: PresetId,
  tz: string,
  earliestDate?: Date | null,
): DateWindow {
  const todayKey = businessTodayKey(tz);
  switch (id) {
    case "7d":
      return {
        start: businessDayStart(addBusinessDays(todayKey, -7, tz), tz),
        end: businessDayEnd(todayKey, tz),
      };
    case "30d":
      return {
        start: businessDayStart(addBusinessDays(todayKey, -30, tz), tz),
        end: businessDayEnd(todayKey, tz),
      };
    case "90d":
      return {
        start: businessDayStart(addBusinessDays(todayKey, -90, tz), tz),
        end: businessDayEnd(todayKey, tz),
      };
    case "mtd": {
      const [y, m] = todayKey.split("-").map(Number);
      const firstKey = `${y}-${String(m).padStart(2, "0")}-01`;
      return {
        start: businessDayStart(firstKey, tz),
        end: businessDayEnd(todayKey, tz),
      };
    }
    case "last-month": {
      const [y, m] = todayKey.split("-").map(Number);
      const prevY = m === 1 ? y - 1 : y;
      const prevM = m === 1 ? 12 : m - 1;
      // Day 0 of the current month = last day of the previous month.
      const lastDay = new Date(Date.UTC(y, m - 1, 0)).getUTCDate();
      const startKey = `${prevY}-${String(prevM).padStart(2, "0")}-01`;
      const endKey = `${prevY}-${String(prevM).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      return {
        start: businessDayStart(startKey, tz),
        end: businessDayEnd(endKey, tz),
      };
    }
    case "all": {
      const start = earliestDate
        ? businessDayStart(formatBusinessDay(earliestDate, tz), tz)
        : ALL_TIME_START;
      return { start, end: businessDayEnd(todayKey, tz) };
    }
  }
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const PRESET_IDS: readonly PresetId[] = [
  "7d",
  "30d",
  "90d",
  "mtd",
  "last-month",
  "all",
];

function parseIsoDateAsStart(
  raw: string | undefined,
  tz: string,
): Date | null {
  if (!raw || !ISO_DATE.test(raw)) return null;
  return businessDayStart(raw, tz);
}

function parseIsoDateAsEnd(raw: string | undefined, tz: string): Date | null {
  if (!raw || !ISO_DATE.test(raw)) return null;
  return businessDayEnd(raw, tz);
}

export function parsePresetId(raw: string | undefined): PresetId | null {
  if (!raw) return null;
  return (PRESET_IDS as readonly string[]).includes(raw)
    ? (raw as PresetId)
    : null;
}

/** `tz` day-key for a window endpoint — used for URL params so
 *  links survive bookmarking across timezones. */
export function isoOf(d: Date, tz: string): string {
  return formatBusinessDay(d, tz);
}

/** Resolve the active window from URL search params. `period` takes
 *  precedence over `from`/`to`, so preset links stay relative-to-today
 *  even if shared / bookmarked. */
export function windowFromParams(
  params: {
    period?: string;
    from?: string;
    to?: string;
  },
  tz: string,
  earliestDate?: Date | null,
): DateWindow {
  const preset = parsePresetId(params.period);
  if (preset) return presetWindow(preset, tz, earliestDate);
  const from = parseIsoDateAsStart(params.from, tz);
  const to = parseIsoDateAsEnd(params.to, tz);
  if (from && to && from <= to) {
    return { start: from, end: to };
  }
  return presetWindow(DEFAULT_PRESET, tz, earliestDate);
}

/** Same-length window immediately preceding `current`, snapped to
 *  `tz` day boundaries. */
export function previousWindow(current: DateWindow, tz: string): DateWindow {
  const lengthDays = windowDays(current, tz);
  const prevEndKey = addBusinessDays(formatBusinessDay(current.start, tz), -1, tz);
  const prevStartKey = addBusinessDays(prevEndKey, -(lengthDays - 1), tz);
  return {
    start: businessDayStart(prevStartKey, tz),
    end: businessDayEnd(prevEndKey, tz),
  };
}

/** Days in the window (inclusive). */
export function windowDays(w: DateWindow, tz: string): number {
  return (
    diffBusinessDays(formatBusinessDay(w.end, tz), formatBusinessDay(w.start, tz)) + 1
  );
}

/** Match a {start, end} against the known presets — returns the id
 *  if the window equals one of them (used by the picker to show
 *  which preset, if any, is currently active). */
export function matchPreset(
  w: DateWindow,
  tz: string,
  earliestDate?: Date | null,
): PresetId | null {
  const startKey = formatBusinessDay(w.start, tz);
  const endKey = formatBusinessDay(w.end, tz);
  for (const id of PRESET_IDS) {
    const candidate = presetWindow(id, tz, earliestDate);
    if (
      formatBusinessDay(candidate.start, tz) === startKey &&
      formatBusinessDay(candidate.end, tz) === endKey
    ) {
      return id;
    }
  }
  return null;
}
