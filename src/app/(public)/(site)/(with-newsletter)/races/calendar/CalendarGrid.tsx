"use client";

// src/app/races/calendar/CalendarGrid.tsx
//
// The month grid itself. A client island since 2026-08-23: clicking
// a race entry opens the RaceSummarySheet (DS Sheet) rather than
// navigating away — the chip stays a real <a href> underneath, so
// crawlers, middle-click and cmd-click still reach the guide
// directly. Weeks run Monday-first (the running-calendar convention
// for a Europe-anchored audience).
//
// Two layouts from one data set:
//   - md+: the classic 7-column month grid. Days outside the month
//     render recessed (canvas tone, disabled numbers); today's
//     number wears the ink disc. Each day lists up to 3 race chips,
//     then a "+N more" link into the day-filtered index.
//   - below md: a month grid is unreadable at phone widths, so the
//     same month renders as an agenda — one row per day that has
//     races. (The grid's adjacent-month spill days are grid-only.)

import { useState } from "react";
import Link from "next/link";
import type { PortableTextBlock } from "@portabletext/react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { cn } from "@/lib/utils";

import MonthToolbar from "./MonthToolbar";
import RaceSummarySheet from "./RaceSummarySheet";

export interface CalendarRace {
  _id: string;
  title: string;
  slug: string;
  eventDate: string;
  /** Race-local start time as entered ("09:10", "8:00 AM") — the
   *  schema stores it as a plain string because eventDate's time
   *  component is UTC-shifted and wrong for races abroad. */
  startTime?: string;
  city?: string;
  country?: string;
  tags?: string[];
  // Summary-sheet fields (resolved/projected in page.tsx).
  category?: string;
  introduction?: PortableTextBlock[];
  distance?: number;
  surface?: string;
  elevationGain?: number;
  averageTemperature?: number;
  price?: number;
  currency?: string;
  /** CDN URL resolved at the data layer (urlFor), per convention. */
  imageUrl?: string | null;
  blurDataURL?: string | null;
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

/** Parse the free-text race-local startTime ("09:10", "8:00 AM",
 *  "8 pm") into minutes-since-midnight for same-day ordering.
 *  Unparseable / absent times return null and sort last. */
function startTimeMinutes(race: CalendarRace): number | null {
  const m = race.startTime
    ?.trim()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!m) return null;
  let hours = Number(m[1]);
  const minutes = Number(m[2] ?? 0);
  const meridiem = m[3]?.toLowerCase();
  if (hours > 23 || minutes > 59) return null;
  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

// ---------------------------------------------------------------------------
// Chips
// ---------------------------------------------------------------------------

function RaceChip({
  race,
  onSelect,
}: {
  race: CalendarRace;
  onSelect: (race: CalendarRace) => void;
}) {
  return (
    <Link
      href={`/races/${race.slug}`}
      title={
        race.startTime ? `${race.title} — ${race.startTime}` : race.title
      }
      onClick={(e) => {
        // Plain click opens the summary sheet; modified clicks and
        // middle-click keep the link's native navigation.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        onSelect(race);
      }}
      className="flex shrink-0 items-baseline gap-1 rounded-xs bg-[color:var(--ds-gray-100)] px-1.5 py-1 text-label-12 text-textDefault no-underline transition-colors hover:bg-[color:var(--ds-gray-200)]"
    >
      {isMajor(race) && (
        <span aria-hidden className="text-[color:var(--ds-amber-600)]">
          ★
        </span>
      )}
      <span className="truncate">{race.title}</span>
      {race.startTime && (
        <span className="shrink-0 tabular-nums text-textSubtle">
          {race.startTime}
        </span>
      )}
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
  // Clicking any calendar entry opens its summary sheet.
  const [selected, setSelected] = useState<CalendarRace | null>(null);

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
  // Same-day races run in start-time order (race-local startTime;
  // unknown times sort last, keeping the fetch's eventDate order
  // among themselves — Array.sort is stable).
  for (const list of byDay.values()) {
    list.sort(
      (a, b) =>
        (startTimeMinutes(a) ?? Infinity) - (startTimeMinutes(b) ?? Infinity),
    );
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
              return (
                <div
                  key={iso}
                  // FIXED height (not min-h): when a day holds more
                  // races than fit, the chip stack below scrolls in
                  // place instead of growing the whole week's row
                  // (user call 2026-08-23, replacing "+N more").
                  className={cn(
                    "flex h-28 flex-col gap-1 p-2 lg:h-36",
                    inMonth ? "bg-surface" : "bg-canvas",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-label-12",
                      today
                        ? "bg-[color:var(--ds-gray-1000)] font-medium text-[color:var(--ds-background-100)]"
                        : inMonth
                          ? "text-textSubtle"
                          : "text-textDisabled",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {dayRaces.length > 0 && (
                    <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto [scrollbar-width:thin]">
                      {dayRaces.map((race) => (
                        <RaceChip
                          key={race._id}
                          race={race}
                          onSelect={setSelected}
                        />
                      ))}
                    </div>
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
                    const meta = [race.startTime, location]
                      .filter(Boolean)
                      .join(" · ");
                    return (
                      <li key={race._id}>
                        <Link
                          href={`/races/${race.slug}`}
                          onClick={(e) => {
                            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
                              return;
                            e.preventDefault();
                            setSelected(race);
                          }}
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
                          {meta && (
                            <span className="text-copy-13 text-textSubtle">
                              {meta}
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

      <RaceSummarySheet race={selected} onClose={() => setSelected(null)} />
    </>
  );
}
