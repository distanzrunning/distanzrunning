"use client";

// src/app/admin/(shell)/races/enrichment/EnrichmentRow.tsx
//
// Per-race row for the enrichment review queue. Main row shows the
// race, its (pinned or discovered) Wikipedia page, a pending-count
// badge, last scan time, and the Scan / Approve-all actions. The
// chevron expander reveals one sub-row per field suggestion with
// current → suggested values, the source quote, and per-field
// Approve / Reject — the review itself happens in the expander.

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TableCell, TableRow } from "@/components/ui/Table";
import { useToast } from "@/components/ui/Toast";
import type { EnrichmentSuggestion } from "@/lib/raceEnrichment";

import {
  approveAllPending,
  approveSuggestion,
  clearSuggestion,
  rejectSuggestion,
  scanRaceEnrichment,
} from "./actions";

export interface EnrichmentRowData {
  _id: string;
  title: string;
  country?: string;
  wikipediaUrl?: string;
  enrichmentSuggestions?: EnrichmentSuggestion[];
  enrichmentLastScanAt?: string;
}

const safeFormat = (iso: string | undefined, pattern: string): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : format(d, pattern);
};

/** "de.wikipedia.org — Sparkasse 3-Länder-Marathon" style label. */
function wikiLabel(url: string): string {
  try {
    const u = new URL(url);
    const title = decodeURIComponent(
      u.pathname.replace(/^\/wiki\//, ""),
    ).replace(/_/g, " ");
    const lang = u.hostname.split(".")[0];
    return `${title} (${lang})`;
  } catch {
    return url;
  }
}

export default function EnrichmentRow({ race }: { race: EnrichmentRowData }) {
  const [expanded, setExpanded] = useState(false);
  const [scanning, startScan] = useTransition();
  const [deciding, startDecide] = useTransition();
  const { showToast, dismissToast } = useToast();

  const suggestions = race.enrichmentSuggestions ?? [];
  const pending = suggestions.filter((s) => s.status === "pending");
  const rejected = suggestions.filter((s) => s.status === "rejected");
  const hasExpandable = suggestions.length > 0;

  const handleScan = () => {
    const scanningToastId = showToast({
      message: `Scanning "${race.title}"…`,
      description:
        "Searching Wikipedia editions and extracting records. Usually 5–15 s.",
      preserve: true,
    });
    startScan(async () => {
      const fd = new FormData();
      fd.set("id", race._id);
      try {
        const result = await scanRaceEnrichment(fd);
        if (result.status === "suggested") {
          setExpanded(true);
          showToast({
            message: `${result.suggestedFields.length} suggestion${
              result.suggestedFields.length === 1 ? "" : "s"
            } for "${race.title}"`,
            description:
              "Expand the row to review — approve writes the field, reject remembers the veto.",
            variant: "success",
          });
        } else {
          const explainer: Record<typeof result.status, string> = {
            no_changes:
              "The article was read but every extracted value already matches the guide.",
            page_not_found:
              "No Wikipedia article matched this race. Pin the right page via the wikipediaUrl field in Studio and re-scan.",
            fetch_error: "Wikipedia couldn't be reached (or the scan timed out).",
            extract_error: "The model errored — try again in a moment.",
          };
          showToast({
            message: `No new suggestions for "${race.title}"`,
            description:
              `${explainer[result.status]} ${result.message ?? ""}`.trim(),
            variant: result.status === "no_changes" ? "success" : "warning",
            preserve: result.status !== "no_changes",
          });
        }
      } catch (err) {
        showToast({
          message: `Scan request failed for "${race.title}"`,
          description: `${(err as Error).message}. The work may still complete in the background — refresh in a moment to check.`,
          variant: "error",
          preserve: true,
        });
      } finally {
        dismissToast(scanningToastId);
      }
    });
  };

  const handleApproveAll = () => {
    const ok = window.confirm(
      `Approve all ${pending.length} pending suggestions for "${race.title}"?\n\nEach value is written straight into its field.`,
    );
    if (!ok) return;
    startDecide(async () => {
      const fd = new FormData();
      fd.set("id", race._id);
      await approveAllPending(fd);
    });
  };

  const decideOne = (
    action: (fd: FormData) => Promise<void>,
    field: string,
  ) => {
    startDecide(async () => {
      const fd = new FormData();
      fd.set("id", race._id);
      fd.set("field", field);
      await action(fd);
    });
  };

  return (
    <>
      <TableRow>
        <TableCell className="max-w-[280px] text-copy-13 text-textDefault">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!hasExpandable}
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-label={
                hasExpandable
                  ? expanded
                    ? `Collapse suggestions for ${race.title}`
                    : `Expand suggestions for ${race.title}`
                  : "No suggestions yet"
              }
              className="inline-flex size-5 shrink-0 items-center justify-center rounded text-textSubtler hover:bg-[color:var(--ds-gray-100)] hover:text-textDefault disabled:cursor-not-allowed disabled:text-textDisabled disabled:hover:bg-transparent"
            >
              {expanded ? (
                <ChevronDown className="size-3.5" />
              ) : (
                <ChevronRight className="size-3.5" />
              )}
            </button>
            <span>{race.title}</span>
          </div>
        </TableCell>
        <TableCell className="max-w-[240px] text-copy-13">
          {race.wikipediaUrl ? (
            <a
              href={race.wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1 text-textSubtle hover:text-textDefault"
              title={race.wikipediaUrl}
            >
              <span className="truncate">{wikiLabel(race.wikipediaUrl)}</span>
              <ExternalLink className="size-3.5 shrink-0" />
            </a>
          ) : (
            <span className="text-textSubtler">Not discovered yet</span>
          )}
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <div className="flex items-center gap-2">
            {pending.length > 0 && (
              <Badge variant="blue-subtle" size="sm">
                {pending.length} pending
              </Badge>
            )}
            {rejected.length > 0 && (
              <Badge variant="gray-subtle" size="sm">
                {rejected.length} rejected
              </Badge>
            )}
            {suggestions.length === 0 && (
              <span className="text-copy-13 text-textSubtler">—</span>
            )}
          </div>
        </TableCell>
        <TableCell className="whitespace-nowrap text-label-12 text-textSubtler">
          {safeFormat(race.enrichmentLastScanAt, "d MMM, HH:mm")}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {pending.length > 0 && (
              <Button size="small" loading={deciding} onClick={handleApproveAll}>
                Approve all
              </Button>
            )}
            <Button
              size="small"
              variant="secondary"
              loading={scanning}
              onClick={handleScan}
            >
              Scan
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {expanded && hasExpandable && (
        <TableRow>
          {/* Inline text-align overrides the DS Table's
              last:text-right on last-child cells. */}
          <TableCell
            colSpan={5}
            style={{ textAlign: "left" }}
            className="bg-[color:var(--ds-background-200)] !px-0 !py-0"
          >
            <div className="flex flex-col gap-0 px-6 py-4">
              {suggestions.map((s) => (
                <div
                  key={s._key}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-borderSubtle py-3 first:border-t-0 first:pt-1 last:pb-1"
                >
                  <div className="w-64 shrink-0 text-copy-13 text-textDefault">
                    {s.label}
                  </div>
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="font-mono text-copy-13 text-textSubtler line-through">
                      {s.currentValue?.trim() || "empty"}
                    </span>
                    <span aria-hidden className="text-textSubtler">
                      →
                    </span>
                    <span className="font-mono text-copy-13 text-textDefault">
                      {s.value}
                    </span>
                    {s.confidence && (
                      <Badge
                        variant={
                          s.confidence === "high"
                            ? "green-subtle"
                            : "amber-subtle"
                        }
                        size="sm"
                      >
                        {s.confidence}
                      </Badge>
                    )}
                    {s.sourceQuote && (
                      <span
                        className="hidden min-w-0 truncate text-copy-13 italic text-textSubtle lg:inline"
                        title={s.sourceQuote}
                      >
                        &ldquo;{s.sourceQuote}&rdquo;
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {s.status === "pending" ? (
                      <>
                        <Button
                          size="tiny"
                          loading={deciding}
                          onClick={() => decideOne(approveSuggestion, s.field)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="tiny"
                          variant="secondary"
                          loading={deciding}
                          onClick={() => decideOne(rejectSuggestion, s.field)}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <>
                        <Badge variant="gray-subtle" size="sm">
                          Rejected
                        </Badge>
                        <Button
                          size="tiny"
                          variant="secondary"
                          loading={deciding}
                          onClick={() => decideOne(clearSuggestion, s.field)}
                        >
                          Clear
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
