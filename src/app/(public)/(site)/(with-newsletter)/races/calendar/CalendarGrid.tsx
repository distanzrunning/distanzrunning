// src/app/races/calendar/CalendarGrid.tsx
//
// The month grid itself — a SERVER component: the whole calendar is
// links (race chips → guides, "+N more" → the /races index filtered
// to that day), so no client JS is needed. Weeks run Monday-first
// (the running-calendar convention for a Europe-anchored audience).
//
// Two layouts from one data set:
//   - md+: the classic 7-column month grid. Days outside the month
//     render recessed (canvas tone, disabled numbers); today's
//     number wears the ink disc. Each day lists up to 3 race chips,
//     then a "+N more" link into the day-filtered index.
//   - below md: a month grid is unreadable at phone widths, so the
//     same month renders as an agenda — one row per day that has
//     races. (The grid's adjacent-month spill days are grid-only.)

import Link from "next/link";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { cn } from "@/lib/utils";

import MonthToolbar from "./MonthToolbar";

export interface CalendarRace {
  _id: string;
  title: string;
  slug: string;
  eventDate: string;
  city?: string;
  country?: string;
  tags?: string[];
}

/** Races a day cell lists before collapsing into "+N more". */
const MAX_CHIPS_PER_DAY = 3;

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ---------------------------------------------------------------------------
// Month helpers — shared with page.tsx (URL parsing + fetch window).
// ---------------------------------------------------------------------------

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

/** True when the race carries the exact Abbott World Marathon Major
 *  tag — same predicate as the /races map's gold star. */
function isMajor(race: CalendarRace): boolean {
  return (race.tags ?? []).some(
    (t) => t.trim().toLowerCase() === "abbott world marathon major",
  );
}

/** The race's calendar day (eventDate is a UTC datetime; its date
 *  part is the race day). */
function raceDay(race: CalendarRace): string {
  return race.eventDate.slice(0, 10);
}

/** /races index pre-filtered to exactly this day. Past days opt into
 *  showPast so the link never lands on an empty grid. */
function dayIndexHref(day: Date): string {
  const iso = format(day, "yyyy-MM-dd");
  const past = day.getTime() < Date.now() - 24 * 60 * 60 * 1000;
  return `/races?dateFrom=${iso}&dateTo=${iso}${past ? "&showPast=1" : ""}`;
}

// ---------------------------------------------------------------------------
// Chips
// ---------------------------------------------------------------------------

function RaceChip({ race }: { race: CalendarRace }) {
  return (
    <Link
      href={`/races/${race.slug}`}
      title={race.title}
      className="block truncate rounded-xs bg-[color:var(--ds-gray-100)] px-1.5 py-1 text-label-12 text-textDefault no-underline transition-colors hover:bg-[color:var(--ds-gray-200)]"
    >
      {isMajor(race) && (
        <span
          aria-hidden
          className="mr-1 text-[color:var(--ds-amber-600)]"
        >
          ★
        </span>
      )}
      {race.title}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// The grid
// ---------------------------------------------------------------------------

export default function CalendarGrid({
  month,
  races,
}: {
  /** First day of the displayed month. */
  month: Date;
  races: CalendarRace[];
}) {
  const gridDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });

  const byDay = new Map<string, CalendarRace[]>();
  for (const race of races) {
    const day = raceDay(race);
    const list = byDay.get(day);
    if (list) list.push(race);
    else byDay.set(day, [race]);
  }

  const monthDaysWithRaces = gridDays.filter(
    (d) => isSameMonth(d, month) && byDay.has(format(d, "yyyy-MM-dd")),
  );

  return (
    <>
      {/* md+: the month grid. Hairline lattice via 1px gaps over the
          border tone; day surfaces sit on top. The month toolbar is
          the card's own top row — the calendar reads as one unit. */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-xs border border-borderSubtle bg-surface">
          <div className="border-b border-borderSubtle p-3 md:px-4">
            <MonthToolbar month={month} raceCount={races.length} />
          </div>
          <div className="grid grid-cols-7 border-b border-borderSubtle">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="px-3 py-2 text-label-12 text-textSubtle"
              >
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-[color:var(--ds-gray-200)]">
            {gridDays.map((day) => {
              const iso = format(day, "yyyy-MM-dd");
              const dayRaces = byDay.get(iso) ?? [];
              const inMonth = isSameMonth(day, month);
              const today = isToday(day);
              const overflow = dayRaces.length - MAX_CHIPS_PER_DAY;
              return (
                <div
                  key={iso}
                  className={cn(
                    "flex min-h-28 flex-col gap-1 p-2 lg:min-h-32",
                    inMonth ? "bg-surface" : "bg-canvas",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-label-12",
                      today
                        ? "bg-[color:var(--ds-gray-1000)] font-medium text-[color:var(--ds-background-100)]"
                        : inMonth
                          ? "text-textSubtle"
                          : "text-textDisabled",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {dayRaces.slice(0, MAX_CHIPS_PER_DAY).map((race) => (
                    <RaceChip key={race._id} race={race} />
                  ))}
                  {overflow > 0 && (
                    <Link
                      href={dayIndexHref(day)}
                      className="px-1.5 text-label-12 text-textSubtle no-underline hover:text-textDefault hover:underline"
                    >
                      +{overflow} more
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Below md: agenda — the same month, one row per race day,
          under the same toolbar. */}
      <div className="flex flex-col gap-6 md:hidden">
        <div className="border-b border-borderSubtle pb-4">
          <MonthToolbar month={month} raceCount={races.length} />
        </div>
        {monthDaysWithRaces.length === 0 ? (
          <p className="text-copy-14 text-textSubtle">
            No races this month.
          </p>
        ) : (
          <div className="flex flex-col">
          {monthDaysWithRaces.map((day) => {
            const iso = format(day, "yyyy-MM-dd");
            const dayRaces = byDay.get(iso) ?? [];
            return (
              <div
                key={iso}
                className="flex gap-4 border-t border-borderSubtle py-4 first:border-t-0 first:pt-0"
              >
                <div className="w-14 shrink-0">
                  <div
                    className={cn(
                      "flex flex-col items-start",
                      isToday(day) ? "text-textDefault" : "text-textSubtle",
                    )}
                  >
                    <span className="text-label-12 uppercase">
                      {format(day, "EEE")}
                    </span>
                    <span className="text-heading-20">{format(day, "d")}</span>
                  </div>
                </div>
                <ul className="m-0 flex min-w-0 flex-1 list-none flex-col gap-2 p-0">
                  {dayRaces.map((race) => {
                    const location = [race.city, race.country]
                      .filter(Boolean)
                      .join(", ");
                    return (
                      <li key={race._id}>
                        <Link
                          href={`/races/${race.slug}`}
                          className="flex flex-col gap-0.5 no-underline"
                        >
                          <span className="text-copy-14 font-medium text-textDefault">
                            {isMajor(race) && (
                              <span
                                aria-hidden
                                className="mr-1 text-[color:var(--ds-amber-600)]"
                              >
                                ★
                              </span>
                            )}
                            {race.title}
                          </span>
                          {location && (
                            <span className="text-copy-13 text-textSubtle">
                              {location}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </>
  );
}
