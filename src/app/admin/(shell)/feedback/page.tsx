import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { PanelCard } from "@/components/ui/PanelCard";
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
import DeleteFeedbackButton from "./DeleteFeedbackButton";

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

export default async function FeedbackDashboardPage() {
  const supabase = getSupabaseAdmin();
  const pageStart = performance.now();

  console.time("[feedback] count");
  const { count: totalCount } = await supabase
    .from("feedback_records")
    .select("*", { count: "exact", head: true });
  console.timeEnd("[feedback] count");

  console.time("[feedback] select 10k");
  const { data, error } = await supabase
    .from("feedback_records")
    .select(
      "id, anon_id, emotion, feedback, topic, email, page_path, country, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(FETCH_LIMIT);
  console.timeEnd("[feedback] select 10k");
  console.log(
    `[feedback] total page: ${(performance.now() - pageStart).toFixed(1)}ms`,
  );

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
            className="text-heading-32"
            style={{ margin: 0, color: "var(--ds-gray-1000)" }}
          >
            Feedback
          </h1>
          <p
            className="text-copy-16"
            style={{ marginTop: 6, marginBottom: 0, color: "var(--ds-gray-700)" }}
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

        <PanelCard title="Recent feedback">
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
                <TableHead style={{ width: 48 }} aria-label="Actions" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
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
                      className="text-label-12"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {new Date(row.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={b.variant} size="sm">
                        {b.label}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="text-copy-13"
                      style={{ maxWidth: 360, color: "var(--ds-gray-1000)" }}
                    >
                      {snippet}
                    </TableCell>
                    <TableCell className="text-label-12">
                      {row.topic ?? "—"}
                    </TableCell>
                    <TableCell className="text-label-12">
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
                      className="text-label-12-mono"
                      style={{
                        color: "var(--ds-gray-700)",
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.page_path ?? "—"}
                    </TableCell>
                    <TableCell className="text-label-12">
                      {row.country ?? "—"}
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
      </div>
    </div>
  );
}
