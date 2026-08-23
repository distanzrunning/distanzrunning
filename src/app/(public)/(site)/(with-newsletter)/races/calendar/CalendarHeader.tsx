// src/app/races/calendar/CalendarHeader.tsx
//
// Page header + month navigation for the race calendar. Server
// component — month paging is URL navigation (?m=YYYY-MM), so
// prev/next/today are prefetched ButtonLinks, matching the /races
// index's soft-nav conventions. The month label is the working
// title; the page title above stays wayfinding chrome.

import { addMonths, format, isSameMonth, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";

import { monthParam } from "./CalendarGrid";

function hrefForMonth(month: Date): string {
  // Current month is the clean default URL.
  return isSameMonth(month, new Date())
    ? "/races/calendar"
    : `/races/calendar?m=${monthParam(month)}`;
}

export default function CalendarHeader({
  month,
  raceCount,
}: {
  month: Date;
  raceCount: number;
}) {
  const isCurrentMonth = isSameMonth(month, new Date());
  return (
    <header className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {/* Page title is wayfinding chrome — UI heading register,
            like the /races index. */}
        <h1 className="m-0 text-balance text-heading-40 text-textDefault md:text-heading-48">
          Race Calendar
        </h1>
        <p className="max-w-2xl text-copy-16 text-textSubtle md:text-copy-18">
          Explore upcoming races month by month and plan your running
          schedule.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="m-0 whitespace-nowrap text-heading-24 text-textDefault">
            {format(month, "MMMM yyyy")}
          </h2>
          <span className="text-copy-14 text-textSubtle">
            {raceCount} {raceCount === 1 ? "race" : "races"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isCurrentMonth && (
            <ButtonLink
              href="/races/calendar"
              prefetch
              variant="secondary"
              size="small"
            >
              Today
            </ButtonLink>
          )}
          <ButtonLink
            href={hrefForMonth(subMonths(month, 1))}
            prefetch
            variant="secondary"
            size="small"
            shape="square"
            aria-label={`Previous month, ${format(subMonths(month, 1), "MMMM yyyy")}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink
            href={hrefForMonth(addMonths(month, 1))}
            prefetch
            variant="secondary"
            size="small"
            shape="square"
            aria-label={`Next month, ${format(addMonths(month, 1), "MMMM yyyy")}`}
          >
            <ChevronRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
