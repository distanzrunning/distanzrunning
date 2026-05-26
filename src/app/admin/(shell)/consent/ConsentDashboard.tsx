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
import { getSupabaseAdmin } from "@/lib/supabase/server";
import ConsentTrendChart from "./ConsentTrendChart";
import RecentDecisionsTable from "./RecentDecisionsTable";
import {
  isoOf,
  previousWindow,
  windowDays,
  type DateWindow,
} from "./presets";

type Decision = "accept_all" | "reject_all" | "custom";
export type DecisionFilter = Decision;

const DECISION_LABEL: Record<Decision, string> = {
  accept_all: "accepts",
  reject_all: "rejects",
  custom: "custom decisions",
};

const BASE_PATH = "/admin/consent";

function buildHref(
  params: { from: string; to: string },
  filter: Decision | null,
): string {
  const usp = new URLSearchParams();
  usp.set("from", params.from);
  usp.set("to", params.to);
  if (filter) usp.set("filter", filter);
  return `${BASE_PATH}?${usp.toString()}`;
}

interface ConsentRow {
  id: number;
  anon_id: string;
  marketing: boolean;
  analytics: boolean;
  functional: boolean;
  decision: Decision;
  country: string | null;
  created_at: string;
}

const FETCH_LIMIT = 10_000;

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
    return { value: "—", direction: "flat" };
  }
  if (previous === 0) {
    return { value: "new", direction: "up" };
  }
  const diff = ((current - previous) / previous) * 100;
  const direction = diff > 0.5 ? "up" : diff < -0.5 ? "down" : "flat";
  const sign = diff > 0 ? "+" : "";
  return {
    value: `${sign}${diff.toFixed(1)}%`,
    direction,
    ariaLabel: `${diff.toFixed(1)}% versus ${windowLabel}`,
  };
}

function pointChange(
  currentPct: number,
  previousPct: number,
  windowLabel: string,
): StatTileChange {
  const diff = currentPct - previousPct;
  if (Math.abs(diff) < 0.05) return { value: "0 pts", direction: "flat" };
  const direction = diff > 0 ? "up" : "down";
  const sign = diff > 0 ? "+" : "";
  return {
    value: `${sign}${diff.toFixed(1)} pts`,
    direction,
    ariaLabel: `${diff.toFixed(1)} percentage points versus ${windowLabel}`,
  };
}

interface TrendPoint {
  date: string;
  count: number;
}

function buildTrend(
  rows: ConsentRow[],
  window: DateWindow,
): TrendPoint[] {
  const days = new Map<string, number>();
  const dayCount = windowDays(window);
  for (let i = 0; i < dayCount; i++) {
    const d = new Date(window.start);
    d.setUTCDate(window.start.getUTCDate() + i);
    days.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of rows) {
    const key = row.created_at.slice(0, 10);
    if (days.has(key)) days.set(key, (days.get(key) ?? 0) + 1);
  }
  // For long ranges, the X-axis stride is too dense to show every
  // day — Recharts handles axis ticks via minTickGap, so we keep
  // the same shape (date label per point) and let the chart thin.
  return [...days.entries()].map(([date, count]) => ({
    date: date.slice(5),
    count,
  }));
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
            background: "var(--ds-blue-900)",
            transition: "width 300ms ease",
          }}
        />
      </div>
    </div>
  );
}

const TWO_COL_GRID = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 16,
  marginBottom: 16,
} as const;

export async function ConsentDashboardContent({
  filter,
  windowStart,
  windowEnd,
}: {
  filter?: DecisionFilter | null;
  windowStart: Date;
  windowEnd: Date;
}) {
  const supabase = getSupabaseAdmin();
  const currentWindow: DateWindow = { start: windowStart, end: windowEnd };
  const previous = previousWindow(currentWindow);
  const days = windowDays(currentWindow);
  const previousLabel =
    days === 1 ? "the previous day" : `the previous ${days} days`;
  const urlParams = { from: isoOf(windowStart), to: isoOf(windowEnd) };
  const tileHref = (target: Decision) =>
    buildHref(urlParams, filter === target ? null : target);

  const { data, error } = await supabase
    .from("consent_records")
    .select(
      "id, anon_id, marketing, analytics, functional, decision, country, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(FETCH_LIMIT);

  if (error) {
    return (
      <p style={{ color: "var(--ds-red-900)" }}>
        Could not load data: {error.message}
      </p>
    );
  }

  const rows = (data ?? []) as ConsentRow[];

  // Slice the fetched rows into "current window" and the same-
  // length window immediately before, so trend pills come from one
  // DB hit regardless of the user's selected range.
  const currentRows = rows.filter((r) => {
    const d = new Date(r.created_at);
    return d >= currentWindow.start && d <= currentWindow.end;
  });
  const previousRows = rows.filter((r) => {
    const d = new Date(r.created_at);
    return d >= previous.start && d <= previous.end;
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

  const marketingOn = rows.filter((r) => r.marketing).length;
  const analyticsOn = rows.filter((r) => r.analytics).length;
  const functionalOn = rows.filter((r) => r.functional).length;
  const uniqueVisitors = new Set(rows.map((r) => r.anon_id)).size;

  // Chart trend follows the active tab — switching to "Accept rate"
  // shows accepts/day, etc. Default = total decisions per day.
  const trendRows = filter
    ? currentRows.filter((r) => r.decision === filter)
    : currentRows;
  const trend = buildTrend(trendRows, currentWindow);
  const chartLabel = filter
    ? `${DECISION_LABEL[filter].charAt(0).toUpperCase()}${DECISION_LABEL[filter].slice(1)}`
    : "Decisions";

  // Recent table mirrors the active filter — filtering happens on
  // the already-fetched 10k rows, so no extra DB query.
  const recent = (filter ? rows.filter((r) => r.decision === filter) : rows)
    .slice(0, 20);
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
        {/* Vercel-style tab row: tiles sit at a fixed min-width
            (220px) and don't grow to fill the panel. Any extra
            horizontal space stays empty, painted by the row's
            background-200, so the data reads at its natural
            density rather than spreading thin on wide viewports. */}
        <div
          className="divide-x divide-[color:var(--ds-gray-400)]"
          style={{
            display: "flex",
            borderBottom: "1px solid var(--ds-gray-400)",
            background: "var(--ds-background-200)",
            overflowX: "auto",
          }}
        >
          <div style={{ minWidth: 220, flexShrink: 0 }}>
            <StatTile
              label="Decisions"
              value={currentCount.toLocaleString()}
              change={changeFrom(currentCount, previousCount, previousLabel)}
              href={buildHref(urlParams, null)}
              active={!filter}
            />
          </div>
          <div style={{ minWidth: 220, flexShrink: 0 }}>
            <StatTile
              label="Accept rate"
              value={fmtPct(currentAcceptRate)}
              change={pointChange(
                currentAcceptRate,
                previousAcceptRate,
                previousLabel,
              )}
              href={tileHref("accept_all")}
              active={filter === "accept_all"}
            />
          </div>
          <div style={{ minWidth: 220, flexShrink: 0 }}>
            <StatTile
              label="Reject rate"
              value={fmtPct(currentRejectRate)}
              change={pointChange(
                currentRejectRate,
                previousRejectRate,
                previousLabel,
              )}
              href={tileHref("reject_all")}
              active={filter === "reject_all"}
            />
          </div>
          <div style={{ minWidth: 220, flexShrink: 0 }}>
            <StatTile
              label="Custom rate"
              value={fmtPct(currentCustomRate)}
              change={pointChange(
                currentCustomRate,
                previousCustomRate,
                previousLabel,
              )}
              href={tileHref("custom")}
              active={filter === "custom"}
            />
          </div>
        </div>

        <ConsentTrendChart trend={trend} metricLabel={chartLabel} />
      </div>

      <div style={TWO_COL_GRID}>
        <PanelCard title="Per-category opt-in (all-time)">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <CategoryBar
              label="Marketing"
              count={marketingOn}
              total={rows.length}
            />
            <CategoryBar
              label="Analytics"
              count={analyticsOn}
              total={rows.length}
            />
            <CategoryBar
              label="Functional"
              count={functionalOn}
              total={rows.length}
            />
          </div>
        </PanelCard>
        <PanelCard title="Unique visitors">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "12px 0",
            }}
          >
            <span
              className="text-heading-32"
              style={{ color: "var(--ds-gray-1000)" }}
            >
              {uniqueVisitors.toLocaleString()}
            </span>
            <span
              className="text-copy-13"
              style={{ color: "var(--ds-gray-700)" }}
            >
              Distinct anonymous IDs across all decisions.
            </span>
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
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            borderBottom: "1px solid var(--ds-gray-400)",
            background: "var(--ds-background-200)",
          }}
        >
          <StatTileSkeleton label="Decisions" />
          <StatTileSkeleton label="Accept rate" />
          <StatTileSkeleton label="Reject rate" />
          <StatTileSkeleton label="Custom rate" />
        </div>
        <div style={{ padding: "24px 24px 16px" }}>
          <Skeleton
            width="100%"
            height={240}
            shape="rounded"
            style={block}
          />
        </div>
      </div>

      <div style={TWO_COL_GRID}>
        <PanelCard title="Per-category opt-in (all-time)">
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
        <PanelCard title="Unique visitors">
          <div style={{ padding: "12px 0" }}>
            <Skeleton width={120} height={32} style={block} />
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
