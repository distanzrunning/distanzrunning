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
// Layout: stacked sections with visible separators so each block
// (header → pages → Pass 1 → Pass 2 → final message) reads as a
// distinct unit. Everything left-aligned via flex layout — the
// parent TableCell carries an inline text-align:left override
// for the rare inline content that doesn't go through flex.

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

function outcomeBadge(
  outcome: PassLogEntry["outcome"],
): { label: string; variant: BadgeVariant } {
  switch (outcome) {
    case "suggested":
      return { label: "Suggested", variant: "green-subtle" };
    case "low_confidence_rejected":
      return { label: "Rejected (low confidence)", variant: "amber-subtle" };
    case "no_date_found":
      return { label: "No date found", variant: "gray-subtle" };
  }
}

// ────────────────────────────────────────────────────────────────
// Section primitives — keep visual hierarchy consistent across
// the panel's blocks. Each section has a small uppercase eyebrow
// label and full-width content stacked beneath.
// ────────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="m-0 text-label-12 uppercase tracking-[0.04em] text-[color:var(--ds-gray-700)]">
      {children}
    </h4>
  );
}

function PassSection({
  label,
  pass,
}: {
  label: "Pass 1 (homepage only)" | "Pass 2 (multi-page + aggregators)";
  pass: PassLogEntry;
}) {
  const o = outcomeBadge(pass.outcome);
  return (
    <section className="flex flex-col items-start gap-2">
      <SectionHeading>{label}</SectionHeading>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={o.variant} size="sm">
          {o.label}
        </Badge>
        {pass.confidence && (
          <Badge variant={confidenceBadge(pass.confidence).variant} size="sm">
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
    </section>
  );
}

export default function ScanLogPanel({ logJson }: { logJson: string }) {
  let log: ScanLog;
  try {
    log = JSON.parse(logJson) as ScanLog;
  } catch {
    return (
      <div className="px-6 py-4 text-left text-copy-13 text-[color:var(--ds-gray-700)]">
        Could not parse scan log.
      </div>
    );
  }

  const scannedAt = (() => {
    const d = new Date(log.scannedAt);
    return Number.isNaN(d.getTime()) ? "—" : format(d, "d MMM yyyy, HH:mm:ss");
  })();

  return (
    <div className="flex flex-col items-stretch gap-5 px-6 py-5 text-left">
      {/* ── Header strip — three pieces of metadata laid out
            horizontally so they read left-to-right at the top. */}
      <header className="flex flex-wrap items-center gap-x-6 gap-y-2 text-copy-13 text-[color:var(--ds-gray-700)]">
        <span className="flex items-baseline gap-1">
          <span>Scanned</span>
          <span className="text-[color:var(--ds-gray-1000)]">{scannedAt}</span>
        </span>
        <span className="flex items-baseline gap-1">
          <span>Duration</span>
          <span className="text-[color:var(--ds-gray-1000)]">
            {(log.durationMs / 1000).toFixed(1)}s
          </span>
        </span>
        <span className="flex items-baseline gap-1">
          <span>Final status</span>
          <span className="text-[color:var(--ds-gray-1000)]">
            {log.finalStatus}
          </span>
        </span>
      </header>

      {/* ── Pages reviewed — vertical list, each entry stacks
            metadata above the URL so the URL gets a full row of
            its own and isn't competing with badges horizontally. */}
      <section className="flex flex-col items-start gap-2 border-t border-[color:var(--ds-gray-300)] pt-4">
        <SectionHeading>Pages reviewed ({log.pages.length})</SectionHeading>
        <ul className="m-0 flex w-full list-none flex-col gap-2 p-0">
          {log.pages.map((p, i) => {
            const sb = statusBadge(p.status);
            return (
              <li
                key={`${p.url}-${i}`}
                className="flex flex-col items-start gap-1"
              >
                <div className="flex flex-wrap items-center gap-2">
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
                </div>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full break-all text-copy-13 text-[color:var(--ds-gray-900)] underline-offset-2 hover:text-[color:var(--ds-gray-1000)] hover:underline"
                  >
                    {p.url}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Pass 1 + Pass 2 — separated for clarity. Each gets
            its own divider and section heading so the editor can
            see at a glance what changed between the two passes. */}
      {log.pass1 && (
        <div className="border-t border-[color:var(--ds-gray-300)] pt-4">
          <PassSection label="Pass 1 (homepage only)" pass={log.pass1} />
        </div>
      )}
      {log.pass2 && (
        <div className="border-t border-[color:var(--ds-gray-300)] pt-4">
          <PassSection
            label="Pass 2 (multi-page + aggregators)"
            pass={log.pass2}
          />
        </div>
      )}

      {/* ── Final message — boxed so the closing summary stands
            out from the per-pass blocks above. */}
      {log.finalMessage && (
        <section className="flex flex-col items-start gap-2 border-t border-[color:var(--ds-gray-300)] pt-4">
          <SectionHeading>Final message</SectionHeading>
          <div className="material-base px-3 py-2 text-copy-13 text-[color:var(--ds-gray-900)]">
            {log.finalMessage}
          </div>
        </section>
      )}
    </div>
  );
}
