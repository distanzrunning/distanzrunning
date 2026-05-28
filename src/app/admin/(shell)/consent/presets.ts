// Shared date-range presets + URL helpers for the consent dashboard.
//
// Stays framework-agnostic: pure date math + parsing. The picker
// renders these as Calendar presets; the page reads URL params and
// resolves them to a {start, end} window the dashboard consumes.
//
// All day-bucketing is anchored to BUSINESS_TZ (Europe/Brussels), not
// UTC. The DB stores timestamps in UTC, but business reporting groups
// rows by the local calendar day they fall on — so a decision at
// 23:30 UTC counts toward the next Brussels day during DST, not the
// previous one. When the admin settings page lands, replace the
// hard-coded constant with the configured value.

export interface DateWindow {
  /** Inclusive start. UTC instant at 00:00 BUSINESS_TZ on the
   *  start day. */
  start: Date;
  /** Inclusive end. UTC instant at 23:59:59.999 BUSINESS_TZ on the
   *  end day. */
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
const ALL_TIME_START = new Date("2000-01-01T00:00:00.000Z");

// ---------- Timezone helpers ----------

export const BUSINESS_TZ = "Europe/Brussels";

// 'en-CA' formats as YYYY-MM-DD, exactly the shape we want for
// day-keys and ISO URL params.
const businessDayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: BUSINESS_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "YYYY-MM-DD" for the BUSINESS_TZ-local day containing `date`. */
export function formatBusinessDay(date: Date): string {
  return businessDayFormatter.format(date);
}

/** Today's BUSINESS_TZ day as "YYYY-MM-DD". Recomputed on every
 *  call so callers behave correctly across midnight. */
export function businessTodayKey(): string {
  return formatBusinessDay(new Date());
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

/** UTC instant at 00:00 BUSINESS_TZ on the given day-key. */
export function businessDayStart(dayKey: string): Date {
  const [y, m, d] = dayKey.split("-").map(Number);
  const naive = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
  const offset = tzOffsetMinutes(naive, BUSINESS_TZ);
  return new Date(naive.getTime() - offset * 60_000);
}

/** UTC instant at 23:59:59.999 BUSINESS_TZ on the given day-key. */
export function businessDayEnd(dayKey: string): Date {
  const [y, m, d] = dayKey.split("-").map(Number);
  const naive = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
  const offset = tzOffsetMinutes(naive, BUSINESS_TZ);
  return new Date(naive.getTime() - offset * 60_000);
}

/** Step a day-key forward/backward by N calendar days. Operates on
 *  the date label, not real time — DST-safe. */
export function addBusinessDays(dayKey: string, n: number): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  // Noon UTC representative: well inside the same Brussels day at
  // both UTC+1 (winter) and UTC+2 (summer).
  const date = new Date(Date.UTC(y, m - 1, d + n, 12, 0, 0, 0));
  return formatBusinessDay(date);
}

/** Calendar-day diff between two BUSINESS_TZ day-keys (a − b). */
export function diffBusinessDays(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round(
    (Date.UTC(ay, am - 1, ad) - Date.UTC(by, bm - 1, bd)) / 86_400_000,
  );
}

/** Milliseconds from `Date.now()` until the next BUSINESS_TZ
 *  midnight — handy for scheduling a one-shot timer that refreshes
 *  "today"-dependent UI exactly when the calendar day rolls. */
export function msUntilNextBusinessDay(): number {
  const nextKey = addBusinessDays(businessTodayKey(), 1);
  return businessDayStart(nextKey).getTime() - Date.now();
}

// ---------- Window construction ----------

export function presetWindow(id: PresetId): DateWindow {
  const todayKey = businessTodayKey();
  switch (id) {
    case "7d":
      return {
        start: businessDayStart(addBusinessDays(todayKey, -7)),
        end: businessDayEnd(todayKey),
      };
    case "30d":
      return {
        start: businessDayStart(addBusinessDays(todayKey, -30)),
        end: businessDayEnd(todayKey),
      };
    case "90d":
      return {
        start: businessDayStart(addBusinessDays(todayKey, -90)),
        end: businessDayEnd(todayKey),
      };
    case "mtd": {
      const [y, m] = todayKey.split("-").map(Number);
      const firstKey = `${y}-${String(m).padStart(2, "0")}-01`;
      return {
        start: businessDayStart(firstKey),
        end: businessDayEnd(todayKey),
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
        start: businessDayStart(startKey),
        end: businessDayEnd(endKey),
      };
    }
    case "all":
      return { start: ALL_TIME_START, end: businessDayEnd(todayKey) };
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

function parseIsoDateAsStart(raw: string | undefined): Date | null {
  if (!raw || !ISO_DATE.test(raw)) return null;
  return businessDayStart(raw);
}

function parseIsoDateAsEnd(raw: string | undefined): Date | null {
  if (!raw || !ISO_DATE.test(raw)) return null;
  return businessDayEnd(raw);
}

export function parsePresetId(raw: string | undefined): PresetId | null {
  if (!raw) return null;
  return (PRESET_IDS as readonly string[]).includes(raw)
    ? (raw as PresetId)
    : null;
}

/** BUSINESS_TZ day-key for a window endpoint — used for URL params
 *  so links survive bookmarking across timezones. */
export function isoOf(d: Date): string {
  return formatBusinessDay(d);
}

/** Resolve the active window from URL search params. `period` takes
 *  precedence over `from`/`to`, so preset links stay relative-to-today
 *  even if shared / bookmarked. */
export function windowFromParams(params: {
  period?: string;
  from?: string;
  to?: string;
}): DateWindow {
  const preset = parsePresetId(params.period);
  if (preset) return presetWindow(preset);
  const from = parseIsoDateAsStart(params.from);
  const to = parseIsoDateAsEnd(params.to);
  if (from && to && from <= to) {
    return { start: from, end: to };
  }
  return presetWindow(DEFAULT_PRESET);
}

/** Same-length window immediately preceding `current`, snapped to
 *  BUSINESS_TZ day boundaries. */
export function previousWindow(current: DateWindow): DateWindow {
  const lengthDays = windowDays(current);
  const prevEndKey = addBusinessDays(formatBusinessDay(current.start), -1);
  const prevStartKey = addBusinessDays(prevEndKey, -(lengthDays - 1));
  return {
    start: businessDayStart(prevStartKey),
    end: businessDayEnd(prevEndKey),
  };
}

/** Days in the window (inclusive). */
export function windowDays(w: DateWindow): number {
  return diffBusinessDays(formatBusinessDay(w.end), formatBusinessDay(w.start)) + 1;
}

/** Match a {start, end} against the known presets — returns the id
 *  if the window equals one of them (used by the picker to show
 *  which preset, if any, is currently active). */
export function matchPreset(w: DateWindow): PresetId | null {
  const startKey = formatBusinessDay(w.start);
  const endKey = formatBusinessDay(w.end);
  for (const id of PRESET_IDS) {
    const candidate = presetWindow(id);
    if (
      formatBusinessDay(candidate.start) === startKey &&
      formatBusinessDay(candidate.end) === endKey
    ) {
      return id;
    }
  }
  return null;
}
