import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { PanelCard } from "@/components/ui/PanelCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatTile } from "@/components/ui/StatTile";
import { StatTileGroup } from "@/components/ui/StatTileGroup";
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

const STAT_GROUP_WRAPPER = {
  marginBottom: 16,
  // Mirrors the consent dashboard's tile-row scroll affordance —
  // 6 tiles cramp on narrow widths, so let the row scroll
  // horizontally below the desktop breakpoint.
  overflowX: "auto" as const,
};

const block = { display: "block" } as const;

export async function FeedbackDashboardContent() {
  const supabase = getSupabaseAdmin();

  const [{ count: totalCount }, { data, error }] = await Promise.all([
    supabase
      .from("feedback_records")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("feedback_records")
      .select(
        "id, anon_id, emotion, feedback, topic, email, page_path, country, created_at",
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

  const rows = (data ?? []) as FeedbackRow[];
  const total = totalCount ?? rows.length;
  const recent = rows.slice(0, 25);

  const love = rows.filter((r) => r.emotion === "love").length;
  const okay = rows.filter((r) => r.emotion === "okay").length;
  const notGreat = rows.filter((r) => r.emotion === "not-great").length;
  const hate = rows.filter((r) => r.emotion === "hate").length;
  const withEmail = rows.filter((r) => r.email).length;

  return (
    <>
      <div style={STAT_GROUP_WRAPPER}>
        <StatTileGroup columns={6}>
          <StatTile label="Total" value={total.toLocaleString()} />
          <StatTile
            label="Love it"
            value={pct(love, rows.length)}
            hint={`${love.toLocaleString()}`}
          />
          <StatTile
            label="It's okay"
            value={pct(okay, rows.length)}
            hint={`${okay.toLocaleString()}`}
          />
          <StatTile
            label="Not great"
            value={pct(notGreat, rows.length)}
            hint={`${notGreat.toLocaleString()}`}
          />
          <StatTile
            label="Hate it"
            value={pct(hate, rows.length)}
            hint={`${hate.toLocaleString()}`}
          />
          <StatTile
            label="With email"
            value={pct(withEmail, rows.length)}
            hint={`${withEmail.toLocaleString()} follow-ups`}
          />
        </StatTileGroup>
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
    </>
  );
}

function StatTileSkeleton({
  label,
  hint,
}: {
  label: string;
  hint?: string;
}) {
  return (
    <StatTile
      label={label}
      value={<Skeleton width={100} height={32} style={block} />}
      hint={hint ? <Skeleton width={80} height={14} style={block} /> : undefined}
    />
  );
}

export function FeedbackDashboardSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div style={STAT_GROUP_WRAPPER}>
        <StatTileGroup columns={6}>
          <StatTileSkeleton label="Total" />
          <StatTileSkeleton label="Love it" hint="count" />
          <StatTileSkeleton label="It's okay" hint="count" />
          <StatTileSkeleton label="Not great" hint="count" />
          <StatTileSkeleton label="Hate it" hint="count" />
          <StatTileSkeleton label="With email" hint="follow-ups" />
        </StatTileGroup>
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
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 8 }).map((__, j) => (
                  <TableCell key={j}>
                    <Skeleton width="80%" height={14} style={block} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PanelCard>
    </div>
  );
}
