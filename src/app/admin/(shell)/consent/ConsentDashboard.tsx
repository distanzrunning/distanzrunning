import { Inbox } from "lucide-react";

import TrendChart from "@/components/ui/TrendChart";
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
import { EmptyState } from "@/components/ui/EmptyState";
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
import { getConsentRowsInRange, type ConsentRowRaw } from "./data";
import RecentDecisionsTable from "./RecentDecisionsTable";

interface BuildHrefContext {
  tz: string;
  earliestDate: Date | null;
  env: EnvFilter;
}

type Decision = "accept_all" | "reject_all" | "custom";
export type DecisionFilter = Decision;
export type Metric = "decisions" | "visitors";

const DECISION_LABEL: Record<Decision, string> = {
  accept_all: "accepts",
  reject_all: "rejects",
  custom: "custom decisions",
};

const BASE_PATH = "/admin/consent";

function buildHref(
  window: DateWindow,
  filter: Decision | null,
  metric: Metric,
  { tz, earliestDate, env }: BuildHrefContext,
): string {
  const usp = new URLSearchParams();
  const preset = matchPreset(window, tz, earliestDate);
  if (preset) {
    // Default preset is the bare URL — keep links clean.
    if (preset !== DEFAULT_PRESET) usp.set("period", preset);
  } else {
    usp.set("from", isoOf(window.start, tz));
    usp.set("to", isoOf(window.end, tz));
  }
  // URL canonicalisation around metric / filter:
  //   - visitors (the default) → omit both, bare URL
  //   - decisions + no filter   → ?metric=decisions (explicit)
  //   - decisions + filter      → ?filter=…       (filter implies
  //                               decisions, no `metric` param needed)
  if (metric === "decisions") {
    if (filter) {
      usp.set("filter", filter);
    } else {
      usp.set("metric", "decisions");
    }
  }
  // env is preserved on every tile/picker link — default "all" stays
  // off the URL for clean links.
  if (env !== "all") usp.set("env", env);
  const qs = usp.toString();
  return qs ? `${BASE_PATH}?${qs}` : BASE_PATH;
}

// ConsentRow shape lives in ./data alongside the cached query that
// returns it.
type ConsentRow = ConsentRowRaw;

function pct(num: number, denom: number): number {
  if (denom === 0) return 0;
  return (num / denom) * 100;
}

function fmtPct(value: number, fractionDigits = 0): string {
  return `${value.toFixed(fractionDigits)}%`;
}

// Tooltip text always uses absolute numbers with a directional word
// ("more than" / "fewer than") rather than a signed value. The chip
// still shows the signed form ("+8%") for at-a-glance reading.
// Numbers round to integers — matches Vercel's chip style and
// avoids visual noise like "+8.4%" when "8%" reads just as well.
// Every branch populates `ariaLabel` so the chip is always
// focusable + hover-tooltipable, including the "—" and "new" cases.
function changeFrom(
  current: number,
  previous: number,
  windowLabel: string,
): StatTileChange {
  if (previous === 0 && current === 0) {
    return {
      value: "—",
      direction: "flat",
      ariaLabel: `No decisions in this window or ${windowLabel}`,
    };
  }
  if (previous === 0) {
    const noun = current === 1 ? "decision" : "decisions";
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
  /** Either a raw daily count (when no filter) or a daily rate
   *  (count of `filter` / total decisions × 100). `null` marks
   *  days with zero decisions in rate mode — Recharts breaks the
   *  area at null so we don't show a misleading 0% for empty
   *  days that simply had no traffic. */
  value: number | null;
}

function buildTrend(
  rows: ConsentRow[],
  window: DateWindow,
  filter: DecisionFilter | null,
  metric: Metric,
  tz: string,
): TrendPoint[] {
  // visitors mode: track a Set of anon_ids per day instead of a
  // matched/total pair. The final value is the cardinality.
  if (metric === "visitors") {
    const days = new Map<string, Set<string>>();
    const endKey = formatBusinessDay(window.end, tz);
    let cursor = formatBusinessDay(window.start, tz);
    while (cursor <= endKey) {
      days.set(cursor, new Set());
      cursor = addBusinessDays(cursor, 1, tz);
    }
    for (const row of rows) {
      const key = formatBusinessDay(new Date(row.created_at), tz);
      days.get(key)?.add(row.anon_id);
    }
    return [...days.entries()].map(([date, set]) => ({
      date,
      value: set.size,
    }));
  }

  const days = new Map<string, { total: number; matched: number }>();
  // Iterate tz-day keys from the window's start day → end day.
  // String comparison is safe because the keys are zero-padded
  // YYYY-MM-DD (ISO-shaped).
  const endKey = formatBusinessDay(window.end, tz);
  let cursor = formatBusinessDay(window.start, tz);
  while (cursor <= endKey) {
    days.set(cursor, { total: 0, matched: 0 });
    cursor = addBusinessDays(cursor, 1, tz);
  }
  for (const row of rows) {
    // Bucket each row by its tz-local day. Slicing the UTC ISO
    // would group a 23:30 UTC row into the previous tz day.
    const key = formatBusinessDay(new Date(row.created_at), tz);
    const entry = days.get(key);
    if (!entry) continue;
    entry.total += 1;
    if (!filter || row.decision === filter) {
      entry.matched += 1;
    }
  }
  // For long ranges, the X-axis stride is too dense to show every
  // day — Recharts handles axis ticks via minTickGap, so we keep
  // the same shape (date label per point) and let the chart thin.
  return [...days.entries()].map(([date, { total, matched }]) => {
    if (filter) {
      // Rate mode — null on zero-traffic days so the area breaks
      // rather than misleadingly showing 0%.
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
        style={{ color: "var(--ds-gray-1000)" }}
      >
        <span className="font-medium">{label}</span>
        <span style={{ color: "var(--ds-gray-700)" }}>
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

export async function ConsentDashboardContent({
  filter,
  metric,
  windowStart,
  windowEnd,
  tz,
  earliestDate,
  env,
}: {
  filter?: DecisionFilter | null;
  metric: Metric;
  windowStart: Date;
  windowEnd: Date;
  tz: string;
  earliestDate: Date | null;
  env: EnvFilter;
}) {
  // No rows at all for the active env filter — short-circuit before
  // building windows / fetching anything else. Renders a hero in
  // place of the tile row, chart, category bars, and recent table;
  // the filter row above stays mounted so the user can switch envs
  // (e.g. production empty → staging has data).
  if (!earliestDate) {
    const envLabel: Record<EnvFilter, string> = {
      all: "any environment",
      production: "production",
      staging: "staging",
      development: "development",
    };
    return (
      <EmptyState live>
        <EmptyState.Icon>
          <Inbox />
        </EmptyState.Icon>
        <EmptyState.Text>
          <EmptyState.Title>No decisions yet</EmptyState.Title>
          <EmptyState.Description>
            {`No consent decisions recorded in ${envLabel[env]} yet. Decisions appear here when visitors interact with the consent banner on the public site.`}
          </EmptyState.Description>
        </EmptyState.Text>
      </EmptyState>
    );
  }

  // The "All time" sentinel is already narrowed in page.tsx via
  // getEarliestDecisionDate, so windowStart here is always real-data
  // bound. No further preprocessing needed.
  const currentWindow: DateWindow = { start: windowStart, end: windowEnd };
  const previous = previousWindow(currentWindow, tz);
  const days = windowDays(currentWindow, tz);
  const previousLabel =
    days === 1 ? "the previous day" : `the previous ${days} days`;
  // Decision-type tile href: toggle the filter on/off, always reset
  // metric back to "decisions" so the chart switches modes.
  const tileHref = (target: Decision) =>
    buildHref(
      currentWindow,
      filter === target ? null : target,
      "decisions",
      { tz, earliestDate, env },
    );

  // Single DB hit covering the union of the previous + current
  // window so the trend pills, tile values, and chart all come from
  // one cached read. Cache key is (previous.start, currentWindow.end,
  // env) so identical tile clicks within the same window + env reuse
  // the cache.
  const rows = await getConsentRowsInRange(
    previous.start.toISOString(),
    currentWindow.end.toISOString(),
    env,
  );

  // Slice the fetched rows into "current window" and the same-
  // length window immediately before, so trend pills come from one
  // DB hit regardless of the user's selected range. Comparison is
  // by tz-day key (not raw timestamp) so the window edges line up
  // with how the chart buckets each row.
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

  const currentAccepts = currentRows.filter(
    (r) => r.decision === "accept_all",
  ).length;
  const currentRejects = currentRows.filter(
    (r) => r.decision === "reject_all",
  ).length;
  const currentCustoms = currentRows.filter(
    (r) => r.decision === "custom",
  ).length;
  const previousAccepts = previousRows.filter(
    (r) => r.decision === "accept_all",
  ).length;
  const previousRejects = previousRows.filter(
    (r) => r.decision === "reject_all",
  ).length;
  const previousCustoms = previousRows.filter(
    (r) => r.decision === "custom",
  ).length;

  const currentAcceptRate = pct(currentAccepts, currentCount);
  const currentRejectRate = pct(currentRejects, currentCount);
  const currentCustomRate = pct(currentCustoms, currentCount);
  const previousAcceptRate = pct(previousAccepts, previousCount);
  const previousRejectRate = pct(previousRejects, previousCount);
  const previousCustomRate = pct(previousCustoms, previousCount);

  // Per-category opt-in is window-scoped — mirrors the active date
  // range so the bars move with the picker.
  const marketingOn = currentRows.filter((r) => r.marketing).length;
  const analyticsOn = currentRows.filter((r) => r.analytics).length;
  const functionalOn = currentRows.filter((r) => r.functional).length;

  // Window-scoped unique visitors — distinct anon_ids in the
  // current/previous windows so the tile's trend pill compares like
  // for like with Decisions and the three rate tiles.
  const currentUnique = new Set(currentRows.map((r) => r.anon_id)).size;
  const previousUnique = new Set(previousRows.map((r) => r.anon_id)).size;

  // Chart trend follows the active tab. With metric=visitors, the
  // chart shows daily distinct anon_ids (count). With a decision
  // filter set, the chart shows the *rate* per day (matches the
  // tile's headline percentage). Unfiltered Decisions tab shows the
  // raw daily count. Pass `currentRows` so buildTrend can use the
  // day totals as the rate denominator in decisions mode.
  const trend = buildTrend(
    currentRows,
    currentWindow,
    filter ?? null,
    metric,
    tz,
  );
  const chartLabel =
    metric === "visitors"
      ? "Unique visitors"
      : filter
        ? `${DECISION_LABEL[filter].charAt(0).toUpperCase()}${DECISION_LABEL[filter].slice(1)} rate`
        : "Decisions";
  const chartFormat: "count" | "percent" =
    metric === "visitors" ? "count" : filter ? "percent" : "count";

  // Recent table mirrors the active window + decision filter.
  // currentRows is already window-scoped and (since the underlying
  // query orders by created_at desc) the slice picks the 20 most
  // recent rows within the active range.
  const recent = (
    filter ? currentRows.filter((r) => r.decision === filter) : currentRows
  ).slice(0, 20);
  const recentTitle = filter
    ? `Recent ${DECISION_LABEL[filter]}`
    : "Recent decisions";

  return (
    <>
      {/* Tabs + chart joined in a single bordered container —
          the active tile's bottom rule meets the chart edge so the
          two surfaces read as one panel. */}
      <div
        style={{
          border: "1px solid var(--ds-gray-400)",
          borderRadius: 10,
          overflow: "hidden",
          background: "var(--ds-background-100)",
          marginBottom: 16,
        }}
      >
        {/* Tile row laid out as a 6-column grid: 5 tiles + 1 empty
            placeholder. The empty cell gives the trailing gap the
            same width as a tile (slot for a future 6th metric) and
            lets `divide-x` paint a divider after the last tile
            without the old borderRight hack. minmax(0, 1fr)
            keeps each column above 200px, flexing equally above
            that — overflowX:auto on the wrapper handles the
            narrow-viewport case. paddingBottom:6 on the wrapper
            sits below the row's border (matches Vercel's tabs
            structure) and leaves room for a horizontal scrollbar. */}
        <div style={{ overflowX: "auto", paddingBottom: 6 }}>
        <div
          className="divide-x divide-[color:var(--ds-gray-400)]"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
            borderBottom: "1px solid var(--ds-gray-400)",
            background: "var(--ds-background-200)",
          }}
        >
          <div>
            <StatTile
              label="Unique visitors"
              value={<NumberTicker value={currentUnique} />}
              change={changeFrom(currentUnique, previousUnique, previousLabel)}
              href={buildHref(currentWindow, null, "visitors", { tz, earliestDate, env })}
              active={metric === "visitors"}
            />
          </div>
          <div>
            <StatTile
              label="Decisions"
              value={<NumberTicker value={currentCount} />}
              change={changeFrom(currentCount, previousCount, previousLabel)}
              href={buildHref(currentWindow, null, "decisions", { tz, earliestDate, env })}
              active={metric === "decisions" && !filter}
            />
          </div>
          <div>
            <StatTile
              label="Accept rate"
              value={<NumberTicker value={currentAcceptRate} suffix="%" />}
              change={pointChange(
                currentAcceptRate,
                previousAcceptRate,
                previousLabel,
              )}
              href={tileHref("accept_all")}
              active={metric === "decisions" && filter === "accept_all"}
            />
          </div>
          <div>
            <StatTile
              label="Reject rate"
              value={<NumberTicker value={currentRejectRate} suffix="%" />}
              change={pointChange(
                currentRejectRate,
                previousRejectRate,
                previousLabel,
              )}
              href={tileHref("reject_all")}
              active={metric === "decisions" && filter === "reject_all"}
            />
          </div>
          <div>
            <StatTile
              label="Custom rate"
              value={<NumberTicker value={currentCustomRate} suffix="%" />}
              change={pointChange(
                currentCustomRate,
                previousCustomRate,
                previousLabel,
              )}
              href={tileHref("custom")}
              active={metric === "decisions" && filter === "custom"}
            />
          </div>
          {/* Empty 6th cell — reserves the trailing gap as one
              tile-width, gives divide-x a sibling to paint a
              divider against, and slots a future tile in cleanly. */}
          <div aria-hidden />
        </div>
        </div>

        <TrendChart
          trend={trend}
          metricLabel={chartLabel}
          format={chartFormat}
          tz={tz}
        />
      </div>

      {/* Per-category opt-in mirrors the active window — bars
          tween via the CategoryBar's CSS width transition when
          the picker / tile selection changes the window. */}
      <div style={{ marginBottom: 16 }}>
        <PanelCard title="Per-category opt-in">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <CategoryBar
              label="Marketing"
              count={marketingOn}
              total={currentRows.length}
            />
            <CategoryBar
              label="Analytics"
              count={analyticsOn}
              total={currentRows.length}
            />
            <CategoryBar
              label="Functional"
              count={functionalOn}
              total={currentRows.length}
            />
          </div>
        </PanelCard>
      </div>

      <RecentDecisionsTable
        rows={recent}
        title={recentTitle}
        filter={filter ?? null}
      />
    </>
  );
}

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

export function ConsentDashboardSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div
        style={{
          border: "1px solid var(--ds-gray-400)",
          borderRadius: 10,
          overflow: "hidden",
          background: "var(--ds-background-100)",
          marginBottom: 16,
        }}
      >
        <div
          className="divide-x divide-[color:var(--ds-gray-400)]"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
            borderBottom: "1px solid var(--ds-gray-400)",
            background: "var(--ds-background-200)",
          }}
        >
          <StatTileSkeleton label="Unique visitors" />
          <StatTileSkeleton label="Decisions" />
          <StatTileSkeleton label="Accept rate" />
          <StatTileSkeleton label="Reject rate" />
          <StatTileSkeleton label="Custom rate" />
          {/* Empty 6th cell — see ConsentDashboardContent comment. */}
          <div aria-hidden />
        </div>
        <div style={{ padding: "24px 24px 16px" }}>
          <Skeleton
            width="100%"
            height={400}
            shape="rounded"
            style={block}
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <PanelCard title="Per-category opt-in">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {["Marketing", "Analytics", "Functional"].map((label) => (
              <div
                key={label}
                style={{ display: "flex", flexDirection: "column", gap: 6 }}
              >
                <div
                  className="flex justify-between text-copy-13"
                  style={{ color: "var(--ds-gray-1000)" }}
                >
                  <span className="font-medium">{label}</span>
                  <Skeleton width={60} height={14} style={block} />
                </div>
                <Skeleton
                  width="100%"
                  height={8}
                  shape="rounded"
                  style={block}
                />
              </div>
            ))}
          </div>
        </PanelCard>
      </div>

      <PanelCard title="Recent decisions">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Decision</TableHead>
              <TableHead>Marketing</TableHead>
              <TableHead>Analytics</TableHead>
              <TableHead>Functional</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Anon ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRowSkeleton key={i} cols={7} />
            ))}
          </TableBody>
        </Table>
      </PanelCard>
    </div>
  );
}
