// src/app/races/calendar/month.ts
//
// Month helpers shared by the server page (URL parsing + fetch
// window) and the client calendar (grid construction, toolbar
// hrefs). Plain module — no "use client" — so both sides can call
// these directly.

import {
  endOfMonth,
  endOfWeek,
  format,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";

/** Parse ?m=YYYY-MM (strictly) into that month's first day; anything
 *  else — absent, malformed, out-of-calendar — falls back to the
 *  current month. */
export function monthFromParam(m: string | undefined): Date {
  if (m && /^\d{4}-(0[1-9]|1[0-2])$/.test(m)) {
    const parsed = parse(m, "yyyy-MM", new Date());
    if (!Number.isNaN(parsed.getTime())) return startOfMonth(parsed);
  }
  return startOfMonth(new Date());
}

export function monthParam(month: Date): string {
  return format(month, "yyyy-MM");
}

/** The visible grid's first/last day (Monday-first weeks), as
 *  YYYY-MM-DD — the fetch window includes the adjacent months'
 *  spill days. */
export function calendarRange(month: Date): {
  gridStart: string;
  gridEnd: string;
} {
  return {
    gridStart: format(
      startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
      "yyyy-MM-dd",
    ),
    gridEnd: format(
      endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
      "yyyy-MM-dd",
    ),
  };
}
