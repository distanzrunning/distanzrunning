import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import DeleteIdButton from "./DeleteIdButton";
import TrendChart, { type TrendPoint } from "./TrendChart";

export const metadata = {
  title: "Consent Dashboard — Distanz",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div
      style={{
        padding: 20,
        border: "1px solid var(--ds-gray-400)",
        borderRadius: 12,
        background: "var(--ds-background-100)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: 0.2,
          textTransform: "uppercase",
          color: "var(--ds-gray-700)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 28,
          fontWeight: 600,
          lineHeight: 1.1,
          color: "var(--ds-gray-1000)",
        }}
      >
        {value}
      </span>
      {hint && (
        <span style={{ fontSize: 12, color: "var(--ds-gray-700)" }}>
          {hint}
        </span>
      )}
    </div>
  );
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
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          color: "var(--ds-gray-1000)",
        }}
      >
        <span style={{ fontWeight: 500 }}>{label}</span>
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

function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: 20,
        border: "1px solid var(--ds-gray-400)",
        borderRadius: 12,
        background: "var(--ds-background-100)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            margin: 0,
            color: "var(--ds-gray-1000)",
          }}
        >
          {title}
        </h2>
        {action}
      </header>
      {children}
    </section>
  );
}

function decisionBadge(d: Decision): { label: string; color: string } {
  switch (d) {
    case "accept_all":
      return { label: "Accept all", color: "var(--ds-green-900)" };
    case "reject_all":
      return { label: "Reject all", color: "var(--ds-red-900)" };
    default:
      return { label: "Custom", color: "var(--ds-amber-900)" };
  }
}

function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form
      method="GET"
      action="/admin/consent"
      style={{
        display: "flex",
        gap: 8,
        marginBottom: 16,
      }}
    >
      <input
        name="q"
        type="text"
        defaultValue={defaultValue}
        placeholder="Look up by anonymous ID…"
        spellCheck={false}
        autoComplete="off"
        style={{
          flex: 1,
          height: 40,
          padding: "0 12px",
          fontSize: 14,
          fontFamily: "var(--font-mono)",
          borderRadius: 6,
          border: "1px solid var(--ds-gray-400)",
          background: "var(--ds-background-100)",
          color: "var(--ds-gray-1000)",
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "0 16px",
          height: 40,
          fontSize: 13,
          fontWeight: 500,
          borderRadius: 6,
          border: "1px solid var(--ds-gray-1000)",
          background: "var(--ds-gray-1000)",
          color: "var(--ds-background-100)",
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </form>
  );
}

function LookupView({
  query,
  rows,
  total,
}: {
  query: string;
  rows: ConsentRow[];
  total: number;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--ds-background-200)",
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 600,
                lineHeight: "32px",
                margin: 0,
                color: "var(--ds-gray-1000)",
              }}
            >
              Consent dashboard
            </h1>
            <p
              style={{
                marginTop: 6,
                marginBottom: 0,
                fontSize: 13,
                color: "var(--ds-gray-700)",
              }}
            >
              Lookup for a single anonymous ID · {total.toLocaleString()} total
              decisions across all IDs
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              style={{
                padding: "8px 12px",
                fontSize: 13,
                border: "1px solid var(--ds-gray-400)",
                borderRadius: 6,
                background: "var(--ds-background-100)",
                color: "var(--ds-gray-1000)",
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </form>
        </header>

        <SearchForm defaultValue={query} />

        <Panel
          title={`ID: ${query}`}
          action={
            <a
              href="/admin/consent"
              style={{
                fontSize: 13,
                color: "var(--ds-gray-700)",
                textDecoration: "underline",
              }}
            >
              Clear search
            </a>
          }
        >
          {rows.length === 0 ? (
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "var(--ds-gray-700)",
              }}
            >
              No records found for this ID.
            </p>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ fontSize: 13, color: "var(--ds-gray-700)" }}>
                  {rows.length} decision{rows.length === 1 ? "" : "s"} · latest{" "}
                  {new Date(rows[0].created_at).toLocaleString()}
                </div>
                <DeleteIdButton anonId={query} count={rows.length} />
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{ width: "100%", borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr style={{ textAlign: "left" }}>
                      {[
                        "When",
                        "Decision",
                        "Marketing",
                        "Analytics",
                        "Functional",
                        "Country",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 12px",
                            fontSize: 12,
                            fontWeight: 500,
                            color: "var(--ds-gray-700)",
                            borderBottom: "1px solid var(--ds-gray-400)",
                            textTransform: "uppercase",
                            letterSpacing: 0.3,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const b = decisionBadge(row.decision);
                      return (
                        <tr key={row.id}>
                          <td style={tdStyle}>
                            {new Date(row.created_at).toLocaleString()}
                          </td>
                          <td style={tdStyle}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "2px 8px",
                                fontSize: 11,
                                fontWeight: 500,
                                borderRadius: 999,
                                color: b.color,
                                border: `1px solid ${b.color}`,
                              }}
                            >
                              {b.label}
                            </span>
                          </td>
                          <td style={tdStyle}>
                            {row.marketing ? "✓" : "—"}
                          </td>
                          <td style={tdStyle}>
                            {row.analytics ? "✓" : "—"}
                          </td>
                          <td style={tdStyle}>
                            {row.functional ? "✓" : "—"}
                          </td>
                          <td style={tdStyle}>{row.country ?? "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Panel>
      </div>
    </main>
  );
}

export default async function ConsentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const supabase = getSupabaseAdmin();

  const { count: totalCount } = await supabase
    .from("consent_records")
    .select("*", { count: "exact", head: true });

  if (query) {
    const { data: lookupData, error: lookupError } = await supabase
      .from("consent_records")
      .select(
        "id, anon_id, marketing, analytics, functional, decision, country, created_at",
      )
      .eq("anon_id", query)
      .order("created_at", { ascending: false });

    if (lookupError) {
      return (
        <main style={{ padding: 40, fontFamily: "var(--font-sans)" }}>
          <h1>Consent dashboard</h1>
          <p style={{ color: "var(--ds-red-900)" }}>
            Lookup failed: {lookupError.message}
          </p>
        </main>
      );
    }

    const lookupRows = (lookupData ?? []) as ConsentRow[];

    return (
      <LookupView
        query={query}
        rows={lookupRows}
        total={totalCount ?? 0}
      />
    );
  }

  const { data, error } = await supabase
    .from("consent_records")
    .select(
      "id, anon_id, marketing, analytics, functional, decision, country, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(FETCH_LIMIT);

  if (error) {
    return (
      <main style={{ padding: 40, fontFamily: "var(--font-sans)" }}>
        <h1>Consent dashboard</h1>
        <p style={{ color: "var(--ds-red-900)" }}>
          Could not load data: {error.message}
        </p>
      </main>
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
    <main
      style={{
        minHeight: "100vh",
        background: "var(--ds-background-200)",
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 600,
                lineHeight: "32px",
                margin: 0,
                color: "var(--ds-gray-1000)",
              }}
            >
              Consent dashboard
            </h1>
            <p
              style={{
                marginTop: 6,
                marginBottom: 0,
                fontSize: 13,
                color: "var(--ds-gray-700)",
              }}
            >
              {total.toLocaleString()} total decisions
              {rows.length < total
                ? ` · showing latest ${rows.length.toLocaleString()}`
                : ""}
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              style={{
                padding: "8px 12px",
                fontSize: 13,
                border: "1px solid var(--ds-gray-400)",
                borderRadius: 6,
                background: "var(--ds-background-100)",
                color: "var(--ds-gray-1000)",
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </form>
        </header>

        <SearchForm />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 16,
          }}
        >
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <Panel title="Decisions per day (last 30)">
            <TrendChart data={trend} />
          </Panel>
          <Panel title="Per-category opt-in">
            <div
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
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
          </Panel>
        </div>

        <Panel title="Recent decisions">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  {[
                    "When",
                    "Decision",
                    "Marketing",
                    "Analytics",
                    "Functional",
                    "Country",
                    "Anon ID",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 12px",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--ds-gray-700)",
                        borderBottom: "1px solid var(--ds-gray-400)",
                        textTransform: "uppercase",
                        letterSpacing: 0.3,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: 24,
                        textAlign: "center",
                        fontSize: 13,
                        color: "var(--ds-gray-700)",
                      }}
                    >
                      No decisions yet.
                    </td>
                  </tr>
                )}
                {recent.map((row) => {
                  const b = decisionBadge(row.decision);
                  return (
                    <tr key={row.id}>
                      <td style={tdStyle}>
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            fontSize: 11,
                            fontWeight: 500,
                            borderRadius: 999,
                            color: b.color,
                            border: `1px solid ${b.color}`,
                          }}
                        >
                          {b.label}
                        </span>
                      </td>
                      <td style={tdStyle}>{row.marketing ? "✓" : "—"}</td>
                      <td style={tdStyle}>{row.analytics ? "✓" : "—"}</td>
                      <td style={tdStyle}>{row.functional ? "✓" : "—"}</td>
                      <td style={tdStyle}>{row.country ?? "—"}</td>
                      <td
                        style={{
                          ...tdStyle,
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                        }}
                      >
                        <a
                          href={`/admin/consent?q=${encodeURIComponent(row.anon_id)}`}
                          style={{
                            color: "var(--ds-gray-700)",
                            textDecoration: "underline",
                          }}
                        >
                          {row.anon_id.slice(0, 8)}…
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </main>
  );
}

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: 13,
  color: "var(--ds-gray-1000)",
  borderBottom: "1px solid var(--ds-gray-300)",
};
