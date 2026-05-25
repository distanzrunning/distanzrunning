import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { PanelCard } from "@/components/ui/PanelCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import TrendChart, { type TrendPoint } from "./TrendChart";

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

function pct(num: number, denom: number): string {
  if (denom === 0) return "0%";
  return `${Math.round((num / denom) * 100)}%`;
}

function formatDay(iso: string): string {
  return iso.slice(0, 10);
}

function buildTrend(rows: ConsentRow[]): TrendPoint[] {
  const days = new Map<string, number>();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    days.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of rows) {
    const key = formatDay(row.created_at);
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
          {count.toLocaleString()} · {pct(count, total)}
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

const STAT_GRID = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
  marginBottom: 16,
} as const;

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

  const accepts = rows.filter((r) => r.decision === "accept_all").length;
  const rejects = rows.filter((r) => r.decision === "reject_all").length;
  const customs = rows.filter((r) => r.decision === "custom").length;
  const marketingOn = rows.filter((r) => r.marketing).length;
  const analyticsOn = rows.filter((r) => r.analytics).length;
  const functionalOn = rows.filter((r) => r.functional).length;
  const uniqueVisitors = new Set(rows.map((r) => r.anon_id)).size;
  const trend = buildTrend(rows);
  const recent = rows.slice(0, 20);

  return (
    <>
      <div style={STAT_GRID}>
        <StatCard label="Total decisions" value={total.toLocaleString()} />
        <StatCard
          label="Unique visitors"
          value={uniqueVisitors.toLocaleString()}
          hint="distinct anonymous IDs"
        />
        <StatCard
          label="Accept all"
          value={pct(accepts, rows.length)}
          hint={`${accepts.toLocaleString()} decisions`}
        />
        <StatCard
          label="Reject all"
          value={pct(rejects, rows.length)}
          hint={`${rejects.toLocaleString()} decisions`}
        />
        <StatCard
          label="Custom"
          value={pct(customs, rows.length)}
          hint={`${customs.toLocaleString()} decisions`}
        />
      </div>

      <div style={TWO_COL_GRID}>
        <PanelCard title="Decisions per day (last 30)">
          <TrendChart data={trend} />
        </PanelCard>
        <PanelCard title="Per-category opt-in">
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
                  <TableCell>{row.country ?? "—"}</TableCell>
                  <TableCell className="text-label-12-mono">
                    <a
                      href={`/admin/consent?q=${encodeURIComponent(row.anon_id)}`}
                      style={{
                        color: "var(--ds-gray-700)",
                        textDecoration: "underline",
                      }}
                    >
                      {row.anon_id.slice(0, 8)}…
                    </a>
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

function StatCardSkeleton({
  label,
  hint,
}: {
  label: string;
  hint?: string;
}) {
  return (
    <StatCard
      label={label}
      value={<Skeleton width={120} height={32} style={block} />}
      hint={hint ? <Skeleton width={100} height={14} style={block} /> : undefined}
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
      <div style={STAT_GRID}>
        <StatCardSkeleton label="Total decisions" />
        <StatCardSkeleton label="Unique visitors" hint="distinct anonymous IDs" />
        <StatCardSkeleton label="Accept all" hint="decisions" />
        <StatCardSkeleton label="Reject all" hint="decisions" />
        <StatCardSkeleton label="Custom" hint="decisions" />
      </div>

      <div style={TWO_COL_GRID}>
        <PanelCard title="Decisions per day (last 30)">
          <Skeleton width="100%" height={200} shape="rounded" style={block} />
        </PanelCard>
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
