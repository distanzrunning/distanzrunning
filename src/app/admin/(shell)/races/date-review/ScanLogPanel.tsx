"use client";

// src/app/admin/(shell)/races/date-review/ScanLogPanel.tsx
//
// Renders the most recent scan's diagnostic record (a ScanLog
// JSON blob persisted by lib/raceDateRefresh.processRaceInner).
// Surfaced inside an expander row so an editor can audit:
//   - which pages we fetched and from which source bucket
//   - which fetches succeeded vs failed (CF blocks, timeouts)
//   - what Pass 1 (homepage only) returned
//   - what Pass 2 (multi-page + aggregators) returned
//   - the final reasoning + confidence
//
// Defensive: a malformed lastScanLog JSON renders a friendly
// fallback rather than crashing the page.

import { format } from "date-fns";

import { Badge, type BadgeVariant } from "@/components/ui/Badge";

interface PageLogEntry {
  url: string;
  source: string;
  status: "ok" | "fetch_error" | "sanity_check_failed";
  chars?: number;
  message?: string;
}

interface PassLogEntry {
  outcome: "suggested" | "no_date_found" | "low_confidence_rejected";
  suggestedDate?: string;
  confidence?: "high" | "medium" | "low";
  sourceQuote?: string;
  reasoning?: string;
}

interface ScanLog {
  scannedAt: string;
  durationMs: number;
  pages: PageLogEntry[];
  pass1?: PassLogEntry;
  pass2?: PassLogEntry;
  finalStatus: string;
  finalMessage?: string;
}

const sourceLabel: Record<string, string> = {
  homepage: "Homepage",
  sitemap: "Sitemap",
  wave1: "Wave 1 sub-page",
  wave2: "Wave 2 sub-page",
  "external:finishers.com": "finishers.com",
  "external:marathontours.com": "marathontours.com",
};

function statusBadge(
  status: PageLogEntry["status"],
): { label: string; variant: BadgeVariant } {
  switch (status) {
    case "ok":
      return { label: "OK", variant: "green-subtle" };
    case "fetch_error":
      return { label: "Fetch failed", variant: "red-subtle" };
    case "sanity_check_failed":
      return { label: "Sanity check failed", variant: "amber-subtle" };
  }
}

function confidenceBadge(
  confidence: PassLogEntry["confidence"],
): { label: string; variant: BadgeVariant } {
  switch (confidence) {
    case "high":
      return { label: "High confidence", variant: "green-subtle" };
    case "medium":
      return { label: "Medium confidence", variant: "blue-subtle" };
    case "low":
      return { label: "Low confidence", variant: "amber-subtle" };
    default:
      return { label: "—", variant: "gray-subtle" };
  }
}

function PassPanel({
  label,
  pass,
}: {
  label: "Pass 1 (homepage only)" | "Pass 2 (multi-page + aggregators)";
  pass: PassLogEntry;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-label-12 text-[color:var(--ds-gray-700)]">
          {label}
        </span>
        <Badge
          variant={
            pass.outcome === "suggested"
              ? "green-subtle"
              : pass.outcome === "low_confidence_rejected"
                ? "amber-subtle"
                : "gray-subtle"
          }
          size="sm"
        >
          {pass.outcome === "suggested"
            ? "Suggested"
            : pass.outcome === "low_confidence_rejected"
              ? "Low-confidence rejected"
              : "No date found"}
        </Badge>
        {pass.confidence && (
          <Badge
            variant={confidenceBadge(pass.confidence).variant}
            size="sm"
          >
            {confidenceBadge(pass.confidence).label}
          </Badge>
        )}
        {pass.suggestedDate && (
          <span className="text-copy-13 font-medium text-[color:var(--ds-gray-1000)]">
            {pass.suggestedDate}
          </span>
        )}
      </div>
      {pass.sourceQuote && (
        <p className="m-0 text-copy-13 italic text-[color:var(--ds-gray-900)]">
          &ldquo;{pass.sourceQuote}&rdquo;
        </p>
      )}
      {pass.reasoning && (
        <p className="m-0 text-copy-13 text-[color:var(--ds-gray-900)]">
          {pass.reasoning}
        </p>
      )}
    </div>
  );
}

export default function ScanLogPanel({ logJson }: { logJson: string }) {
  let log: ScanLog;
  try {
    log = JSON.parse(logJson) as ScanLog;
  } catch {
    return (
      <div className="px-4 py-3 text-copy-13 text-[color:var(--ds-gray-700)]">
        Could not parse scan log.
      </div>
    );
  }

  const scannedAt = (() => {
    const d = new Date(log.scannedAt);
    return Number.isNaN(d.getTime()) ? "—" : format(d, "d MMM yyyy, HH:mm:ss");
  })();

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <div className="flex flex-wrap items-center gap-3 text-copy-13 text-[color:var(--ds-gray-700)]">
        <span>
          Scanned{" "}
          <span className="text-[color:var(--ds-gray-1000)]">{scannedAt}</span>
        </span>
        <span aria-hidden>·</span>
        <span>
          Duration{" "}
          <span className="text-[color:var(--ds-gray-1000)]">
            {(log.durationMs / 1000).toFixed(1)}s
          </span>
        </span>
        <span aria-hidden>·</span>
        <span>
          Final{" "}
          <span className="text-[color:var(--ds-gray-1000)]">
            {log.finalStatus}
          </span>
        </span>
      </div>

      {/* Pages reviewed */}
      <section className="flex flex-col gap-2">
        <h4 className="m-0 text-label-12 uppercase tracking-[0.04em] text-[color:var(--ds-gray-700)]">
          Pages reviewed ({log.pages.length})
        </h4>
        <ul className="m-0 list-none p-0">
          {log.pages.map((p, i) => {
            const sb = statusBadge(p.status);
            return (
              <li
                key={`${p.url}-${i}`}
                className="flex flex-wrap items-center gap-2 border-b border-[color:var(--ds-gray-300)] py-1.5 last:border-b-0"
              >
                <span className="text-label-12 text-[color:var(--ds-gray-700)]">
                  {sourceLabel[p.source] ?? p.source}
                </span>
                <Badge variant={sb.variant} size="sm">
                  {sb.label}
                </Badge>
                {typeof p.chars === "number" && (
                  <span className="text-label-12 text-[color:var(--ds-gray-700)]">
                    {p.chars.toLocaleString()} chars
                  </span>
                )}
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-copy-13 text-[color:var(--ds-gray-1000)] underline-offset-2 hover:underline"
                  >
                    {p.url}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Pass results */}
      {log.pass1 && (
        <PassPanel label="Pass 1 (homepage only)" pass={log.pass1} />
      )}
      {log.pass2 && (
        <PassPanel label="Pass 2 (multi-page + aggregators)" pass={log.pass2} />
      )}

      {log.finalMessage && (
        <div className="rounded-md border border-[color:var(--ds-gray-300)] bg-[color:var(--ds-background-100)] px-3 py-2 text-copy-13 text-[color:var(--ds-gray-900)]">
          <span className="text-label-12 text-[color:var(--ds-gray-700)]">
            Final message:{" "}
          </span>
          {log.finalMessage}
        </div>
      )}
    </div>
  );
}
