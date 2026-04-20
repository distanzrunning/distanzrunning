import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const metadata = {
  title: "Feedback — Stride Admin",
  robots: { index: false, follow: false },
};

type Emotion = "hate" | "not-great" | "okay" | "love";

interface FeedbackRow {
  id: number;
  anon_id: string | null;
  emotion: Emotion | null;
  feedback: string;
  topic: string | null;
  email: string | null;
  page_path: string | null;
  country: string | null;
  created_at: string;
}

const FETCH_LIMIT = 10_000;

function pct(num: number, denom: number): string {
  if (denom === 0) return "0%";
  return `${Math.round((num / denom) * 100)}%`;
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

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
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
      <header>
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
      </header>
      {children}
    </section>
  );
}

export default async function FeedbackDashboardPage() {
  const supabase = getSupabaseAdmin();

  const { count: totalCount } = await supabase
    .from("feedback_records")
    .select("*", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("feedback_records")
    .select(
      "id, anon_id, emotion, feedback, topic, email, page_path, country, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(FETCH_LIMIT);

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Feedback</h1>
        <p style={{ color: "var(--ds-red-900)" }}>
          Could not load data: {error.message}
        </p>
      </div>
    );
  }

  const rows = (data ?? []) as FeedbackRow[];
  const total = totalCount ?? rows.length;
  const recent = rows.slice(0, 25);

  const love = rows.filter((r) => r.emotion === "love").length;
  const okay = rows.filter((r) => r.emotion === "okay").length;
  const notGreat = rows.filter((r) => r.emotion === "not-great").length;
  const hate = rows.filter((r) => r.emotion === "hate").length;
  const withEmail = rows.filter((r) => r.email).length;

  return (
    <div style={{ padding: "32px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              lineHeight: "32px",
              margin: 0,
              color: "var(--ds-gray-1000)",
            }}
          >
            Feedback
          </h1>
          <p
            style={{
              marginTop: 6,
              marginBottom: 0,
              fontSize: 13,
              color: "var(--ds-gray-700)",
            }}
          >
            {total.toLocaleString()} total submissions
            {rows.length < total
              ? ` · showing latest ${rows.length.toLocaleString()}`
              : ""}
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <StatCard label="Total" value={total.toLocaleString()} />
          <StatCard
            label="Love it"
            value={pct(love, rows.length)}
            hint={`${love.toLocaleString()}`}
          />
          <StatCard
            label="It's okay"
            value={pct(okay, rows.length)}
            hint={`${okay.toLocaleString()}`}
          />
          <StatCard
            label="Not great"
            value={pct(notGreat, rows.length)}
            hint={`${notGreat.toLocaleString()}`}
          />
          <StatCard
            label="Hate it"
            value={pct(hate, rows.length)}
            hint={`${hate.toLocaleString()}`}
          />
          <StatCard
            label="With email"
            value={pct(withEmail, rows.length)}
            hint={`${withEmail.toLocaleString()} follow-ups`}
          />
        </div>

        <Panel title="Recent feedback">
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
                    No feedback yet.
                  </TableCell>
                </TableRow>
              )}
              {recent.map((row) => {
                const b = emotionBadge(row.emotion);
                const snippet =
                  row.feedback.length > 140
                    ? `${row.feedback.slice(0, 140).trim()}…`
                    : row.feedback;
                return (
                  <TableRow key={row.id}>
                    <TableCell
                      style={{ whiteSpace: "nowrap", fontSize: 12 }}
                    >
                      {new Date(row.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={b.variant} size="sm">
                        {b.label}
                      </Badge>
                    </TableCell>
                    <TableCell
                      style={{
                        maxWidth: 360,
                        fontSize: 13,
                        color: "var(--ds-gray-1000)",
                      }}
                    >
                      {snippet}
                    </TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {row.topic ?? "—"}
                    </TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {row.email ? (
                        <a
                          href={`mailto:${row.email}`}
                          style={{
                            color: "var(--ds-gray-900)",
                            textDecoration: "underline",
                          }}
                        >
                          {row.email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--ds-gray-700)",
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.page_path ?? "—"}
                    </TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {row.country ?? "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Panel>
      </div>
    </div>
  );
}
