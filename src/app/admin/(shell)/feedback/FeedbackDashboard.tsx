import { Inbox } from "lucide-react";

import { CountryCell } from "@/components/admin/CountryCell";
import {
  addBusinessDays,
  DEFAULT_PRESET,
  formatBusinessDay,
  isoOf,
  matchPreset,
  previousWindow,
  windowDays,
  type DateWindow,
} from "@/components/admin/datePresets";
import type { EnvFilter } from "@/components/admin/env";
import { WhenCell } from "@/components/admin/WhenCell";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateText,
  EmptyStateTitle,
} from "@/components/ui/EmptyState";
import { NumberTicker } from "@/components/ui/NumberTicker";
import { PanelCard } from "@/components/ui/PanelCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatTile, type StatTileChange } from "@/components/ui/StatTile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import TrendChart from "@/components/ui/TrendChart";

import ContactedToggle from "./ContactedToggle";
import DeleteFeedbackButton from "./DeleteFeedbackButton";
import LeaderboardPanel, { type LeaderRow } from "@/components/admin/LeaderboardPanel";
import {
  getFeedbackRowsInRange,
  type Emotion,
  type FeedbackRowRaw,
} from "./data";

type FeedbackFilter =
  | "love"
  | "okay"
  | "not-great"
  | "hate"
  | "email"
  | "follow-up";
type Metric = "feedback" | "submitters";

const FILTER_LABEL: Record<FeedbackFilter, string> = {
  love: "love-it",
  okay: "okay",
  "not-great": "not-great",
  hate: "hate-it",
  email: "with-email",
  "follow-up": "needs-follow-up",
};

const BASE_PATH = "/admin/feedback";

interface BuildHrefContext {
  tz: string;
  earliestDate: Date | null;
  env: EnvFilter;
}

function buildHref(
  window: DateWindow,
  filter: FeedbackFilter | null,
  metric: Metric,
  { tz, earliestDate, env }: BuildHrefContext,
): string {
  const usp = new URLSearchParams();
  const preset = matchPreset(window, tz, earliestDate);
  if (preset) {
    if (preset !== DEFAULT_PRESET) usp.set("period", preset);
  } else {
    usp.set("from", isoOf(window.start, tz));
    usp.set("to", isoOf(window.end, tz));
  }
  // URL canonicalisation:
  //   - submitters (default) → omit both, bare URL
  //   - feedback + no filter  → ?metric=feedback (explicit)
  //   - feedback + filter     → ?filter=… (filter implies feedback)
  if (metric === "feedback") {
    if (filter) {
      usp.set("filter", filter);
    } else {
      usp.set("metric", "feedback");
    }
  }
  if (env !== "all") usp.set("env", env);
  const qs = usp.toString();
  return qs ? `${BASE_PATH}?${qs}` : BASE_PATH;
}

function pct(num: number, denom: number): number {
  if (denom === 0) return 0;
  return (num / denom) * 100;
}

function fmtPct(value: number, fractionDigits = 0): string {
  return `${value.toFixed(fractionDigits)}%`;
}

function changeFrom(
  current: number,
  previous: number,
  windowLabel: string,
): StatTileChange {
  if (previous === 0 && current === 0) {
    return {
      value: "—",
      direction: "flat",
      ariaLabel: `No feedback in this window or ${windowLabel}`,
    };
  }
  if (previous === 0) {
    const noun = current === 1 ? "submission" : "submissions";
    return {
      value: "new",
      direction: "up",
      ariaLabel: `${current.toLocaleString()} ${noun} this window, none in ${windowLabel}`,
    };
  }
  const rounded = Math.round(((current - previous) / previous) * 100);
  const direction = rounded > 0 ? "up" : rounded < 0 ? "down" : "flat";
  const sign = rounded > 0 ? "+" : "";
  const abs = Math.abs(rounded);
  const ariaLabel =
    direction === "up"
      ? `${abs}% more than ${windowLabel}`
      : direction === "down"
        ? `${abs}% fewer than ${windowLabel}`
        : `No change versus ${windowLabel}`;
  return {
    value: `${sign}${rounded}%`,
    direction,
    ariaLabel,
  };
}

function pointChange(
  currentPct: number,
  previousPct: number,
  windowLabel: string,
): StatTileChange {
  const rounded = Math.round(currentPct - previousPct);
  if (rounded === 0) {
    return {
      value: "0 pts",
      direction: "flat",
      ariaLabel: `No change versus ${windowLabel}`,
    };
  }
  const direction = rounded > 0 ? "up" : "down";
  const sign = rounded > 0 ? "+" : "";
  const abs = Math.abs(rounded);
  const ariaLabel =
    direction === "up"
      ? `${abs} percentage points higher than ${windowLabel}`
      : `${abs} percentage points lower than ${windowLabel}`;
  return {
    value: `${sign}${rounded} pts`,
    direction,
    ariaLabel,
  };
}

interface TrendPoint {
  date: string;
  /** Either a raw daily count (no filter) or a daily rate
   *  (count of `filter` / total feedback × 100). `null` marks days
   *  with zero submissions in rate mode — TrendChart breaks the area
   *  at null so we don't show a misleading 0% for empty days. */
  value: number | null;
}

function rowMatchesFilter(row: FeedbackRowRaw, filter: FeedbackFilter): boolean {
  if (filter === "email") return !!row.email;
  if (filter === "follow-up") return !!row.email && !row.contacted_at;
  return row.emotion === filter;
}

function buildTrend(
  rows: FeedbackRowRaw[],
  window: DateWindow,
  filter: FeedbackFilter | null,
  metric: Metric,
  tz: string,
): TrendPoint[] {
  // submitters mode: track a Set of anon_ids per day (fallback to
  // per-row identity when anon_id is null, since the feedback form
  // may submit without one for anonymous visitors).
  if (metric === "submitters") {
    const days = new Map<string, Set<string>>();
    const endKey = formatBusinessDay(window.end, tz);
    let cursor = formatBusinessDay(window.start, tz);
    while (cursor <= endKey) {
      days.set(cursor, new Set());
      cursor = addBusinessDays(cursor, 1, tz);
    }
    for (const row of rows) {
      const key = formatBusinessDay(new Date(row.created_at), tz);
      const id = row.anon_id ?? `row:${row.id}`;
      days.get(key)?.add(id);
    }
    return [...days.entries()].map(([date, set]) => ({
      date,
      value: set.size,
    }));
  }

  const days = new Map<string, { total: number; matched: number }>();
  const endKey = formatBusinessDay(window.end, tz);
  let cursor = formatBusinessDay(window.start, tz);
  while (cursor <= endKey) {
    days.set(cursor, { total: 0, matched: 0 });
    cursor = addBusinessDays(cursor, 1, tz);
  }
  for (const row of rows) {
    const key = formatBusinessDay(new Date(row.created_at), tz);
    const entry = days.get(key);
    if (!entry) continue;
    entry.total += 1;
    if (!filter || rowMatchesFilter(row, filter)) {
      entry.matched += 1;
    }
  }
  return [...days.entries()].map(([date, { total, matched }]) => {
    // follow-up is a count metric, not a rate — "how many pending
    // replies originated on this day" reads more usefully as a
    // number than a percentage of that day's traffic.
    if (filter && filter !== "follow-up") {
      return {
        date,
        value: total === 0 ? null : (matched / total) * 100,
      };
    }
    return { date, value: matched };
  });
}

function CategoryBar({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const ratio = total === 0 ? 0 : count / total;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        className="flex justify-between text-copy-13"
        style={{ color: "hsl(var(--color-textDefault))" }}
      >
        <span className="font-medium">{label}</span>
        <span style={{ color: "hsl(var(--color-textSubtler))" }}>
          {count.toLocaleString()} · {fmtPct(pct(count, total))}
        </span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 4,
          background: "var(--ds-gray-200)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${ratio * 100}%`,
            height: "100%",
            background: "var(--ds-blue-700)",
            transition: "width 300ms ease",
          }}
        />
      </div>
    </div>
  );
}

interface PageGroup {
  path: string;
  total: number;
}

const TOP_PAGES_LIMIT = 10;
const NO_PATH = "(no path)";
const NO_TOPIC = "(no topic)";

/** Group the active-window rows by page_path and return the top N
 *  by count. Null paths bucket as "(no path)" — feedback submitted
 *  without a page reference, rare but worth surfacing. */
function buildPageGroups(rows: FeedbackRowRaw[]): PageGroup[] {
  const groups = new Map<string, number>();
  for (const row of rows) {
    const key = row.page_path ?? NO_PATH;
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  return [...groups.entries()]
    .map(([path, total]) => ({ path, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, TOP_PAGES_LIMIT);
}

interface TopicGroup {
  label: string;
  total: number;
}

/** Group by topic — same shape as buildPageGroups but no link
 *  semantics (topics aren't URLs). Null topics bucket as
 *  "(no topic)" so the absence of structured topic is visible
 *  rather than silently dropped. */
function buildTopicGroups(rows: FeedbackRowRaw[]): TopicGroup[] {
  const groups = new Map<string, number>();
  for (const row of rows) {
    const key = row.topic?.trim() || NO_TOPIC;
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  return [...groups.entries()]
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, TOP_PAGES_LIMIT);
}

function emotionBadge(
  e: Emotion | null,
): { label: string; variant: BadgeVariant } {
  switch (e) {
    case "love":
      return { label: "Love it", variant: "green-subtle" };
    case "okay":
      return { label: "It's okay", variant: "blue-subtle" };
    case "not-great":
      return { label: "Not great", variant: "amber-subtle" };
    case "hate":
      return { label: "Hate it", variant: "red-subtle" };
    default:
      return { label: "—", variant: "gray-subtle" };
  }
}

function RecentFeedbackTable({
  rows,
  title,
  hasFilter,
}: {
  rows: FeedbackRowRaw[];
  title: string;
  hasFilter: boolean;
}) {
  if (rows.length === 0) {
    return (
      <PanelCard title={title} radius="md">
        <EmptyState live>
          <EmptyStateIcon>
            <Inbox />
          </EmptyStateIcon>
          <EmptyStateText>
            <EmptyStateTitle>No feedback</EmptyStateTitle>
            <EmptyStateDescription>
              {hasFilter
                ? "No feedback matches this filter in the active window. Try a wider date range or clear the tile filter."
                : "No feedback in this window. Try a wider date range, or check back after visitors submit feedback."}
            </EmptyStateDescription>
          </EmptyStateText>
        </EmptyState>
      </PanelCard>
    );
  }
  return (
    <PanelCard title={title} radius="md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>Emotion</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Page</TableHead>
            <TableHead>Country</TableHead>
            <TableHead style={{ width: 56 }}>Follow-up</TableHead>
            <TableHead style={{ width: 48 }} aria-label="Actions" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const b = emotionBadge(row.emotion);
            const snippet =
              row.feedback.length > 140
                ? `${row.feedback.slice(0, 140).trim()}…`
                : row.feedback;
            return (
              <TableRow key={row.id}>
                <TableCell>
                  <WhenCell iso={row.created_at} />
                </TableCell>
                <TableCell>
                  <Badge variant={b.variant} size="sm">
                    {b.label}
                  </Badge>
                </TableCell>
                <TableCell
                  className="text-copy-13"
                  style={{ maxWidth: 360, color: "hsl(var(--color-textDefault))" }}
                >
                  {snippet}
                </TableCell>
                <TableCell>
                  {row.topic ?? (
                    <span style={{ color: "hsl(var(--color-textSubtler))" }}>—</span>
                  )}
                </TableCell>
                <TableCell>
                  {row.email ? (
                    <a
                      href={`mailto:${row.email}`}
                      style={{
                        color: "hsl(var(--color-textSubtle))",
                        textDecoration: "underline",
                      }}
                    >
                      {row.email}
                    </a>
                  ) : (
                    <span style={{ color: "hsl(var(--color-textSubtler))" }}>—</span>
                  )}
                </TableCell>
                <TableCell
                  className="text-label-12-mono"
                  style={{
                    color: "hsl(var(--color-textSubtler))",
                    maxWidth: 180,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.page_path ?? (
                    <span style={{ color: "hsl(var(--color-textSubtler))" }}>—</span>
                  )}
                </TableCell>
                <TableCell>
                  <CountryCell iso={row.country} />
                </TableCell>
                <TableCell style={{ width: 56, textAlign: "center" }}>
                  <ContactedToggle
                    id={row.id}
                    hasEmail={!!row.email}
                    contactedAt={row.contacted_at}
                  />
                </TableCell>
                <TableCell style={{ width: 48, textAlign: "right" }}>
                  <DeleteFeedbackButton id={row.id} snippet={snippet} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </PanelCard>
  );
}

export async function FeedbackDashboardContent({
  filter,
  metric,
  windowStart,
  windowEnd,
  tz,
  earliestDate,
  env,
}: {
  filter?: FeedbackFilter | null;
  metric: Metric;
  windowStart: Date;
  windowEnd: Date;
  tz: string;
  earliestDate: Date | null;
  env: EnvFilter;
}) {
  // No rows at all for the active env filter — short-circuit before
  // building windows / fetching anything else. The filter row above
  // stays mounted so the user can switch envs (e.g. production empty
  // → staging has data).
  if (!earliestDate) {
    const envLabel: Record<EnvFilter, string> = {
      all: "any environment",
      production: "production",
      staging: "staging",
      development: "development",
    };
    return (
      <EmptyState live>
        <EmptyStateIcon>
          <Inbox />
        </EmptyStateIcon>
        <EmptyStateText>
          <EmptyStateTitle>No feedback yet</EmptyStateTitle>
          <EmptyStateDescription>
            {`No feedback recorded in ${envLabel[env]} yet. Submissions appear here when visitors send feedback through the public site.`}
          </EmptyStateDescription>
        </EmptyStateText>
      </EmptyState>
    );
  }

  const currentWindow: DateWindow = { start: windowStart, end: windowEnd };
  const previous = previousWindow(currentWindow, tz);
  const days = windowDays(currentWindow, tz);
  const previousLabel =
    days === 1 ? "the previous day" : `the previous ${days} days`;

  // Per-filter tile href: toggle the filter on/off, always reset
  // metric back to "feedback" so the chart switches modes.
  const tileHref = (target: FeedbackFilter) =>
    buildHref(
      currentWindow,
      filter === target ? null : target,
      "feedback",
      { tz, earliestDate, env },
    );

  // Single DB hit covering the union of the previous + current
  // window so the trend pills, tile values, and chart all come from
  // one cached read.
  const rows = await getFeedbackRowsInRange(
    previous.start.toISOString(),
    currentWindow.end.toISOString(),
    env,
  );

  const currentStartKey = formatBusinessDay(currentWindow.start, tz);
  const currentEndKey = formatBusinessDay(currentWindow.end, tz);
  const previousStartKey = formatBusinessDay(previous.start, tz);
  const previousEndKey = formatBusinessDay(previous.end, tz);
  const currentRows = rows.filter((r) => {
    const key = formatBusinessDay(new Date(r.created_at), tz);
    return key >= currentStartKey && key <= currentEndKey;
  });
  const previousRows = rows.filter((r) => {
    const key = formatBusinessDay(new Date(r.created_at), tz);
    return key >= previousStartKey && key <= previousEndKey;
  });

  const currentCount = currentRows.length;
  const previousCount = previousRows.length;

  const matches = (subset: FeedbackRowRaw[], f: FeedbackFilter) =>
    subset.filter((r) => rowMatchesFilter(r, f)).length;

  const currentLove = matches(currentRows, "love");
  const currentOkay = matches(currentRows, "okay");
  const currentNotGreat = matches(currentRows, "not-great");
  const currentHate = matches(currentRows, "hate");
  const currentEmail = matches(currentRows, "email");
  // Snapshot count of rows that still need a reply — has email but
  // contacted_at is null. Tile + chart use this same predicate so
  // a row toggled "contacted" disappears from both. Historical chart
  // days drift down as items get marked contacted, which is the
  // intended "current state" semantics.
  const currentFollowUp = matches(currentRows, "follow-up");
  const previousFollowUp = matches(previousRows, "follow-up");

  const previousLove = matches(previousRows, "love");
  const previousHate = matches(previousRows, "hate");
  const previousEmail = matches(previousRows, "email");

  const currentLoveRate = pct(currentLove, currentCount);
  const currentHateRate = pct(currentHate, currentCount);
  const currentEmailRate = pct(currentEmail, currentCount);
  const previousLoveRate = pct(previousLove, previousCount);
  const previousHateRate = pct(previousHate, previousCount);
  const previousEmailRate = pct(previousEmail, previousCount);

  // Window-scoped unique submitters — distinct anon_ids in the
  // current/previous windows so the tile's trend pill compares like
  // for like with Total feedback and the three rate tiles. Falls
  // back to per-row identity when anon_id is null.
  const currentUnique = new Set(
    currentRows.map((r) => r.anon_id ?? `row:${r.id}`),
  ).size;
  const previousUnique = new Set(
    previousRows.map((r) => r.anon_id ?? `row:${r.id}`),
  ).size;

  // Chart trend follows the active tab. submitters → daily distinct
  // anon_ids (count). filter set → rate per day (matches the tile's
  // headline %). Unfiltered Feedback tab → raw daily count.
  const trend = buildTrend(
    currentRows,
    currentWindow,
    filter ?? null,
    metric,
    tz,
  );

  const filterChartLabel: Record<FeedbackFilter, string> = {
    love: "Love-it rate",
    okay: "It's-okay rate",
    "not-great": "Not-great rate",
    hate: "Hate-it rate",
    email: "With-email rate",
    "follow-up": "Pending follow-up",
  };
  const chartLabel =
    metric === "submitters"
      ? "Unique submitters"
      : filter
        ? filterChartLabel[filter]
        : "Feedback";
  // Most filters render as percent (rate of <filter> per day). The
  // follow-up filter is a count — daily number of currently-pending
  // rows — so the chart format flips to count for that one.
  const chartFormat: "count" | "percent" =
    metric === "submitters"
      ? "count"
      : filter === "follow-up"
        ? "count"
        : filter
          ? "percent"
          : "count";

  // Recent table mirrors the active window + filter. currentRows is
  // already window-scoped and (since the underlying query orders by
  // created_at desc) the slice picks the 20 most recent rows within
  // the active range.
  // Leaderboard panel data. Two tabs: Pages (by page_path) and
  // Topics (by topic). Both ignore the tile filter — the value of
  // these breakdowns is "what dominates feedback overall", not "what
  // dominates love-it feedback specifically". Top 10 each.
  const pageGroups = buildPageGroups(currentRows);
  const topicGroups = buildTopicGroups(currentRows);
  const pageRows: LeaderRow[] = pageGroups.map((g) => ({
    key: g.path,
    label: g.path,
    total: g.total,
    href: g.path === NO_PATH ? undefined : g.path,
    copyValue: g.path === NO_PATH ? undefined : g.path,
    italic: g.path === NO_PATH,
  }));
  const topicRows: LeaderRow[] = topicGroups.map((g) => ({
    key: g.label,
    label: g.label,
    total: g.total,
    copyValue: g.label === NO_TOPIC ? undefined : g.label,
    italic: g.label === NO_TOPIC,
  }));

  const recent = (
    filter
      ? currentRows.filter((r) => rowMatchesFilter(r, filter))
      : currentRows
  ).slice(0, 20);
  const recentTitle = filter
    ? `Recent ${FILTER_LABEL[filter]} feedback`
    : "Recent feedback";

  return (
    <>
      {/* Tabs + chart joined in a single bordered container — the
          active tile's bottom rule meets the chart edge so the two
          surfaces read as one panel. */}
      <div
        style={{
          border: "1px solid hsl(var(--color-borderDefault))",
          borderRadius: 10,
          overflow: "hidden",
          background: "hsl(var(--color-surface))",
          marginBottom: 16,
        }}
      >
        <div style={{ overflowX: "auto", paddingBottom: 6 }}>
          <div
            className="divide-x divide-borderDefault"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
              borderBottom: "1px solid hsl(var(--color-borderDefault))",
              background: "hsl(var(--color-canvas))",
            }}
          >
            <div>
              <StatTile
                label="Unique submitters"
                value={<NumberTicker value={currentUnique} />}
                change={changeFrom(
                  currentUnique,
                  previousUnique,
                  previousLabel,
                )}
                href={buildHref(currentWindow, null, "submitters", {
                  tz,
                  earliestDate,
                  env,
                })}
                active={metric === "submitters"}
              />
            </div>
            <div>
              <StatTile
                label="Total feedback"
                value={<NumberTicker value={currentCount} />}
                change={changeFrom(
                  currentCount,
                  previousCount,
                  previousLabel,
                )}
                href={buildHref(currentWindow, null, "feedback", {
                  tz,
                  earliestDate,
                  env,
                })}
                active={metric === "feedback" && !filter}
              />
            </div>
            <div>
              <StatTile
                label="Love rate"
                value={<NumberTicker value={currentLoveRate} suffix="%" />}
                change={pointChange(
                  currentLoveRate,
                  previousLoveRate,
                  previousLabel,
                )}
                href={tileHref("love")}
                active={metric === "feedback" && filter === "love"}
              />
            </div>
            <div>
              <StatTile
                label="Hate rate"
                value={<NumberTicker value={currentHateRate} suffix="%" />}
                change={pointChange(
                  currentHateRate,
                  previousHateRate,
                  previousLabel,
                )}
                href={tileHref("hate")}
                active={metric === "feedback" && filter === "hate"}
              />
            </div>
            <div>
              <StatTile
                label="With email"
                value={<NumberTicker value={currentEmailRate} suffix="%" />}
                change={pointChange(
                  currentEmailRate,
                  previousEmailRate,
                  previousLabel,
                )}
                href={tileHref("email")}
                active={metric === "feedback" && filter === "email"}
              />
            </div>
            <div>
              <StatTile
                label="Needs follow-up"
                value={<NumberTicker value={currentFollowUp} />}
                change={changeFrom(
                  currentFollowUp,
                  previousFollowUp,
                  previousLabel,
                )}
                href={tileHref("follow-up")}
                active={metric === "feedback" && filter === "follow-up"}
              />
            </div>
          </div>
        </div>

        <TrendChart
          trend={trend}
          metricLabel={chartLabel}
          format={chartFormat}
          tz={tz}
        />
      </div>

      {/* Per-emotion breakdown + Top pages share a row, each taking
          half the width on desktop. Both panels wear the Vercel-style
          leaderboard chrome (flat box-shadow + 6px radius + tab-style
          header on a bottom rule) so they read as a visual pair. CSS
          grid with auto-fit minmax stacks them on narrower viewports.
          Heights are independent — top-aligned, no stretching. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 16,
          // align-items: stretch (default) so both panels match the
          // tallest row — the Pages panel gets empty space below the
          // last row when Emotions is taller, and vice versa. Looks
          // tidier than the ragged-right top alignment.
          marginBottom: 16,
        }}
      >
        <div
          style={{
            background: "hsl(var(--color-surface))",
            border: "1px solid hsl(var(--color-borderDefault))",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 20px 0",
              borderBottom: "1px solid hsl(var(--color-borderDefault))",
            }}
          >
            <div
              role="tablist"
              aria-label="Emotion breakdown tabs"
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 24,
                marginRight: "auto",
              }}
            >
              <button
                type="button"
                role="tab"
                aria-selected="true"
                style={{
                  appearance: "none",
                  background: "transparent",
                  border: "none",
                  cursor: "default",
                  padding: "14px 2px",
                  fontSize: 14,
                  fontWeight: 400,
                  color: "hsl(var(--color-textDefault))",
                  borderBottom: "2px solid hsl(var(--color-textDefault))",
                  marginBottom: -1,
                }}
              >
                Emotions
              </button>
            </div>
            <span
              style={{
                minWidth: 50,
                textAlign: "right",
                fontSize: 12,
                lineHeight: "16px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "hsl(var(--color-textSubtle))",
              }}
            >
              Feedback
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: "16px 20px",
            }}
          >
            <CategoryBar
              label="Love it"
              count={currentLove}
              total={currentCount}
            />
            <CategoryBar
              label="It's okay"
              count={currentOkay}
              total={currentCount}
            />
            <CategoryBar
              label="Not great"
              count={currentNotGreat}
              total={currentCount}
            />
            <CategoryBar
              label="Hate it"
              count={currentHate}
              total={currentCount}
            />
          </div>
        </div>

        {/* Leaderboard panel — Pages + Topics tabs. Self-renders an
            empty-state copy inside the active tab when its rows are
            zero, so we don't conditionally hide the whole panel
            (keeps the side-by-side grid layout stable). */}
        <LeaderboardPanel
          columnHeader="Feedback"
          tabs={[
            {
              value: "pages",
              title: "Pages",
              rows: pageRows,
              emptyMessage:
                "No feedback rows in this window carry a page reference yet.",
            },
            {
              value: "topics",
              title: "Topics",
              rows: topicRows,
              emptyMessage:
                "No feedback rows in this window carry a topic yet.",
            },
          ]}
        />
      </div>

      <RecentFeedbackTable
        rows={recent}
        title={recentTitle}
        hasFilter={!!filter}
      />
    </>
  );
}

// Skeleton ----------------------------------------------------------

const block = { display: "block" } as const;

function StatTileSkeleton({ label }: { label: string }) {
  return (
    <StatTile
      label={label}
      value={<Skeleton width={120} height={32} style={block} />}
    />
  );
}

function TableRowSkeleton({ cols }: { cols: number }) {
  return (
    <TableRow>
      {Array.from({ length: cols }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton width="80%" height={14} style={block} />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function FeedbackDashboardSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div
        style={{
          border: "1px solid hsl(var(--color-borderDefault))",
          borderRadius: 10,
          overflow: "hidden",
          background: "hsl(var(--color-surface))",
          marginBottom: 16,
        }}
      >
        <div style={{ overflowX: "auto", paddingBottom: 6 }}>
          <div
            className="divide-x divide-borderDefault"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
              borderBottom: "1px solid hsl(var(--color-borderDefault))",
              background: "hsl(var(--color-canvas))",
            }}
          >
            <div>
              <StatTileSkeleton label="Unique submitters" />
            </div>
            <div>
              <StatTileSkeleton label="Total feedback" />
            </div>
            <div>
              <StatTileSkeleton label="Love rate" />
            </div>
            <div>
              <StatTileSkeleton label="Hate rate" />
            </div>
            <div>
              <StatTileSkeleton label="With email" />
            </div>
            <div>
              <StatTileSkeleton label="Needs follow-up" />
            </div>
          </div>
        </div>
        <div style={{ height: 400, background: "hsl(var(--color-surface))" }} />
      </div>

      {/* Per-emotion + Top pages share a row in the real dashboard;
          mirror the same grid here so the skeleton previews the right
          shape. Two flat panels with the leaderboard chrome, stacked
          on narrow viewports via auto-fit minmax. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              background: "hsl(var(--color-surface))",
              border: "1px solid hsl(var(--color-borderDefault))",
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: 49,
                borderBottom: "1px solid hsl(var(--color-borderDefault))",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                padding: "16px 20px",
              }}
            >
              <Skeleton width="100%" height={24} style={block} />
              <Skeleton width="100%" height={24} style={block} />
              <Skeleton width="100%" height={24} style={block} />
              <Skeleton width="100%" height={24} style={block} />
            </div>
          </div>
        ))}
      </div>

      <PanelCard title="Recent feedback" radius="md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Emotion</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Page</TableHead>
              <TableHead>Country</TableHead>
              <TableHead style={{ width: 56 }}>Follow-up</TableHead>
              <TableHead style={{ width: 48 }} aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRowSkeleton key={i} cols={9} />
            ))}
          </TableBody>
        </Table>
      </PanelCard>
    </div>
  );
}
