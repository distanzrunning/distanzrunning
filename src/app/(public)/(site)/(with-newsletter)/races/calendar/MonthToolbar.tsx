// src/app/races/calendar/MonthToolbar.tsx
//
// Month label + navigation, integrated INTO the calendar unit (user
// call 2026-08-23 — a floating page-level month bar left the
// calendar less prominent). CalendarGrid mounts this as the card's
// top row on md+ and above the agenda below md. Server component —
// month paging is URL navigation (?m=YYYY-MM) with prefetched
// ButtonLinks, matching the /races index's soft-nav conventions.

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

export default function MonthToolbar({
  month,
  raceCount,
}: {
  month: Date;
  raceCount: number;
}) {
  const isCurrentMonth = isSameMonth(month, new Date());
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-baseline gap-3">
        <h2 className="m-0 whitespace-nowrap text-heading-20 text-textDefault">
          {format(month, "MMMM yyyy")}
        </h2>
        <span className="text-copy-13 text-textSubtle">
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
  );
}
