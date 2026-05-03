"use client";

// src/app/admin/(shell)/races/date-review/RaceRow.tsx
//
// Wraps the per-race row rendering as a client component so it
// can own the expander state. Returns a React fragment of either
// just the main TableRow, or main + expander TableRow when
// expanded — both inside the parent <TableBody>.
//
// The page (server component) just iterates races and emits
// <RaceRow race={…} />; all interactive bits (Calendar, Approve,
// Scan, expander chevron) live below this boundary.

import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { TableCell, TableRow } from "@/components/ui/Table";

import RowActions, { type RowState } from "./RowActions";
import ScanLogPanel from "./ScanLogPanel";

export interface RaceRowData {
  _id: string;
  title: string;
  eventDate: string;
  officialWebsite?: string;
  suggestedNextDate?: string;
  suggestedNextDateScrapedAt?: string;
  suggestedNextDateSourceQuote?: string;
  suggestedNextDateStatus?: "pending" | "approved" | "rejected";
  lastScanAt?: string;
  lastScanLog?: string;
}

const safeFormat = (iso: string | undefined, pattern: string): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : format(d, pattern);
};

interface RaceRowProps {
  race: RaceRowData;
  state: RowState;
}

export default function RaceRow({ race, state }: RaceRowProps) {
  const [expanded, setExpanded] = useState(false);
  const hasLog = Boolean(race.lastScanLog);

  return (
    <>
      <TableRow>
        <TableCell className="max-w-[220px] text-copy-13 text-[color:var(--ds-gray-1000)]">
          <div className="flex items-center gap-2">
            {/* Chevron expander — disabled when there's no log
                (race hasn't been scanned yet). The button takes
                over the leading-icon slot and stays compact. */}
            <button
              type="button"
              disabled={!hasLog}
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-label={
                hasLog
                  ? expanded
                    ? `Collapse scan log for ${race.title}`
                    : `Expand scan log for ${race.title}`
                  : "No scan log yet"
              }
              className="inline-flex size-5 shrink-0 items-center justify-center rounded text-[color:var(--ds-gray-700)] hover:bg-[color:var(--ds-gray-100)] hover:text-[color:var(--ds-gray-1000)] disabled:cursor-not-allowed disabled:text-[color:var(--ds-gray-500)] disabled:hover:bg-transparent"
            >
              {expanded ? (
                <ChevronDown className="size-3.5" />
              ) : (
                <ChevronRight className="size-3.5" />
              )}
            </button>
            <span>{race.title}</span>
            {race.officialWebsite && (
              <a
                href={race.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${race.title} official website`}
                title="Open official website"
                className="inline-flex text-[color:var(--ds-gray-700)] hover:text-[color:var(--ds-gray-1000)]"
              >
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <div className="flex items-center gap-2">
            <Badge variant="red-subtle" size="sm">
              Past
            </Badge>
            <span className="text-label-12 text-[color:var(--ds-gray-900)]">
              {safeFormat(race.eventDate, "d MMM yyyy")}
            </span>
          </div>
        </TableCell>
        <TableCell className="max-w-[320px] text-copy-13 italic text-[color:var(--ds-gray-900)]">
          {race.suggestedNextDateSourceQuote
            ? `"${race.suggestedNextDateSourceQuote}"`
            : "—"}
        </TableCell>
        <TableCell className="whitespace-nowrap text-label-12 text-[color:var(--ds-gray-700)]">
          {safeFormat(
            race.suggestedNextDateScrapedAt ?? race.lastScanAt,
            "d MMM, HH:mm",
          )}
        </TableCell>
        {/* RowActions renders TWO cells (Suggested + Action) as a
            fragment, switched by row state. */}
        <RowActions
          id={race._id}
          title={race.title}
          state={state}
          suggestedDate={race.suggestedNextDate}
          previousEventDate={race.eventDate}
        />
      </TableRow>
      {expanded && hasLog && (
        <TableRow>
          <TableCell
            colSpan={6}
            className="bg-[color:var(--ds-background-200)] !py-0 !px-0"
          >
            <ScanLogPanel logJson={race.lastScanLog!} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
