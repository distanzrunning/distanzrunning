import { Badge, type BadgeVariant } from "@/components/ui/Badge";
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
import { Tooltip } from "@/components/ui/Tooltip";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import ConsentTrendChart from "./ConsentTrendChart";
import { CountryCell } from "./CountryCell";
import { WhenCell } from "./WhenCell";

type Decision = "accept_all" | "reject_all" | "custom";
export type DecisionFilter = Decision;

const DECISION_LABEL: Record<Decision, string> = {
  accept_all: "accepts",
  reject_all: "rejects",
  custom: "custom decisions",
};

const BASE_PATH = "/admin/consent";

function tileHref(target: Decision, active: boolean): string {
  if (active) return BASE_PATH;
  return `${BASE_PATH}?filter=${target}`;
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
const WINDOW_DAYS = 30;

function pct(num: number, denom: number): number {
  if (denom === 0) return 0;
  return (num / denom) * 100;
}

function fmtPct(value: number, fractionDigits = 0): string {
  return `${value.toFixed(fractionDigits)}%`;
}

function changeFrom(current: number, previous: number): StatTileChange {
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
    ariaLabel: `${diff.toFixed(1)}% versus the previous ${WINDOW_DAYS} days`,
  };
}

function pointChange(currentPct: number, previousPct: number): StatTileChange {
  const diff = currentPct - previousPct;
  if (Math.abs(diff) < 0.05) return { value: "0 pts", direction: "flat" };
  const direction = diff > 0 ? "up" : "down";
  const sign = diff > 0 ? "+" : "";
  return {
    value: `${sign}${diff.toFixed(1)} pts`,
    direction,
    ariaLabel: `${diff.toFixed(1)} percentage points versus the previous ${WINDOW_DAYS} days`,
  };
}

interface TrendPoint {
  date: string;
  count: number;
}

function buildTrend(rows: ConsentRow[], windowStart: Date): TrendPoint[] {
  const days = new Map<string, number>();
  for (let i = 0; i < WINDOW_DAYS; i++) {
    const d = new Date(windowStart);
    d.setUTCDate(windowStart.getUTCDate() + i);
    days.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of rows) {
    const key = row.created_at.slice(0, 10);
    if (days.has(key)) days.set(key, (days.get(key) ?? 0) + 1);
  }
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

function decisionBadge(d: Decision): { label: string; variant: BadgeVariant } {
  switch (d) {
    case "accept_all":
      return { label: "Accept all", variant: "green-subtle" };
    case "reject_all":
      return { label: "Reject all", variant: "red-subtle" };
    default:
      return { label: "Custom", variant: "amber-subtle" };
  }
}

const TWO_COL_GRID = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 16,
  marginBottom: 16,
} as const;

export async function ConsentDashboardContent({
  filter,
}: {
  filter?: DecisionFilter | null;
}) {
  const supabase = getSupabaseAdmin();

  const [{ count: totalCount }, { data, error }] = await Promise.all([
    supabase
      .from("consent_records")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("consent_records")
      .select(
        "id, anon_id, marketing, analytics, functional, decision, country, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(FETCH_LIMIT),
  ]);

  if (error) {
    return (
      <p style={{ color: "var(--ds-red-900)" }}>
        Could not load data: {error.message}
      </p>
    );
  }

  const rows = (data ?? []) as ConsentRow[];
  const total = totalCount ?? rows.length;

  // Slice rows into "current 30-day window" and "previous 30-day
  // window" so we can compute MoM trend pills from one DB hit.
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  const currentStart = new Date(now);
  currentStart.setUTCDate(now.getUTCDate() - (WINDOW_DAYS - 1));
  const previousStart = new Date(currentStart);
  previousStart.setUTCDate(currentStart.getUTCDate() - WINDOW_DAYS);

  const currentRows = rows.filter(
    (r) => new Date(r.created_at) >= currentStart,
  );
  const previousRows = rows.filter((r) => {
    const d = new Date(r.created_at);
    return d >= previousStart && d < currentStart;
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
  const trend = buildTrend(trendRows, currentStart);
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
        <div
          className="divide-x divide-[color:var(--ds-gray-400)]"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            borderBottom: "1px solid var(--ds-gray-400)",
            background: "var(--ds-background-200)",
          }}
        >
          <StatTile
            label={`Last ${WINDOW_DAYS} days (${total.toLocaleString()} all-time)`}
            value={currentCount.toLocaleString()}
            change={changeFrom(currentCount, previousCount)}
            href={BASE_PATH}
            active={!filter}
          />
          <StatTile
            label={`Accept rate (${currentAccepts.toLocaleString()} of ${currentCount.toLocaleString()})`}
            value={fmtPct(currentAcceptRate)}
            change={pointChange(currentAcceptRate, previousAcceptRate)}
            href={tileHref("accept_all", filter === "accept_all")}
            active={filter === "accept_all"}
          />
          <StatTile
            label={`Reject rate (${currentRejects.toLocaleString()} of ${currentCount.toLocaleString()})`}
            value={fmtPct(currentRejectRate)}
            change={pointChange(currentRejectRate, previousRejectRate)}
            href={tileHref("reject_all", filter === "reject_all")}
            active={filter === "reject_all"}
          />
          <StatTile
            label={`Custom rate (${currentCustoms.toLocaleString()} of ${currentCount.toLocaleString()})`}
            value={fmtPct(currentCustomRate)}
            change={pointChange(currentCustomRate, previousCustomRate)}
            href={tileHref("custom", filter === "custom")}
            active={filter === "custom"}
          />
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

      <PanelCard title={recentTitle}>
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
            {recent.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  style={{
                    padding: 24,
                    textAlign: "center",
                    color: "var(--ds-gray-700)",
                  }}
                >
                  {filter
                    ? `No ${DECISION_LABEL[filter]} in this window.`
                    : "No decisions yet."}
                </TableCell>
              </TableRow>
            )}
            {recent.map((row) => {
              const b = decisionBadge(row.decision);
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
                  <TableCell>{row.marketing ? "✓" : "—"}</TableCell>
                  <TableCell>{row.analytics ? "✓" : "—"}</TableCell>
                  <TableCell>{row.functional ? "✓" : "—"}</TableCell>
                  <TableCell>
                    <CountryCell iso={row.country} />
                  </TableCell>
                  <TableCell className="text-label-12-mono">
                    <Tooltip content={row.anon_id}>
                      <a
                        href={`/admin/consent?q=${encodeURIComponent(row.anon_id)}`}
                        style={{
                          color: "var(--ds-gray-700)",
                          textDecoration: "underline",
                        }}
                      >
                        {row.anon_id.slice(0, 8)}…
                      </a>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </PanelCard>
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
          <StatTileSkeleton label={`Last ${WINDOW_DAYS} days`} />
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
