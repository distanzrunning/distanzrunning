import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { PanelCard } from "@/components/ui/PanelCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatTile, type StatTileChange } from "@/components/ui/StatTile";
import { StatTileGroup } from "@/components/ui/StatTileGroup";
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

type Decision = "accept_all" | "reject_all" | "custom";

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

export async function ConsentDashboardContent() {
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
  const trend = buildTrend(currentRows, currentStart);
  const recent = rows.slice(0, 20);

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <StatTileGroup>
          <StatTile
            label={`Last ${WINDOW_DAYS} days`}
            value={currentCount.toLocaleString()}
            hint={`${total.toLocaleString()} all-time`}
            change={changeFrom(currentCount, previousCount)}
          />
          <StatTile
            label="Accept rate"
            value={fmtPct(currentAcceptRate)}
            hint={`${currentAccepts.toLocaleString()} of ${currentCount.toLocaleString()}`}
            change={pointChange(currentAcceptRate, previousAcceptRate)}
          />
          <StatTile
            label="Reject rate"
            value={fmtPct(currentRejectRate)}
            hint={`${currentRejects.toLocaleString()} of ${currentCount.toLocaleString()}`}
            change={pointChange(currentRejectRate, previousRejectRate)}
          />
          <StatTile
            label="Custom rate"
            value={fmtPct(currentCustomRate)}
            hint={`${currentCustoms.toLocaleString()} of ${currentCount.toLocaleString()}`}
            change={pointChange(currentCustomRate, previousCustomRate)}
          />
        </StatTileGroup>
      </div>

      <div style={{ marginBottom: 16 }}>
        <ConsentTrendChart
          trend={trend}
          currentCount={currentCount}
          uniqueVisitors={uniqueVisitors}
          windowDays={WINDOW_DAYS}
        />
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
                  No decisions yet.
                </TableCell>
              </TableRow>
            )}
            {recent.map((row) => {
              const b = decisionBadge(row.decision);
              return (
                <TableRow key={row.id}>
                  <TableCell>
                    {new Date(row.created_at).toLocaleString()}
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

function StatTileSkeleton({
  label,
  hintWidth,
}: {
  label: string;
  hintWidth?: number;
}) {
  return (
    <StatTile
      label={label}
      value={<Skeleton width={120} height={32} style={block} />}
      hint={
        hintWidth ? (
          <Skeleton width={hintWidth} height={14} style={block} />
        ) : undefined
      }
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
      <div style={{ marginBottom: 16 }}>
        <StatTileGroup>
          <StatTileSkeleton label={`Last ${WINDOW_DAYS} days`} hintWidth={100} />
          <StatTileSkeleton label="Accept rate" hintWidth={120} />
          <StatTileSkeleton label="Reject rate" hintWidth={120} />
          <StatTileSkeleton label="Custom rate" hintWidth={120} />
        </StatTileGroup>
      </div>

      <div style={{ marginBottom: 16 }}>
        <PanelCard title={`Decisions per day (last ${WINDOW_DAYS})`}>
          <Skeleton width="100%" height={220} shape="rounded" style={block} />
        </PanelCard>
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
