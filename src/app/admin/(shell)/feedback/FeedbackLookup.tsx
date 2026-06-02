import { Inbox, Search } from "lucide-react";

import { CountryCell } from "@/components/admin/CountryCell";
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
import { PanelCard } from "@/components/ui/PanelCard";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import ContactedToggle from "./ContactedToggle";
import DeleteFeedbackButton from "./DeleteFeedbackButton";
import { lookupFeedback, type Emotion } from "./data";

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

export async function FeedbackLookupContent({
  query,
  env,
}: {
  query: string;
  env: EnvFilter;
}) {
  const rows = await lookupFeedback(query, env);

  if (rows.length === 0) {
    return (
      <PanelCard title="Matching feedback" radius="md">
        <EmptyState live>
          <EmptyStateIcon>
            <Search />
          </EmptyStateIcon>
          <EmptyStateText>
            <EmptyStateTitle>No matches</EmptyStateTitle>
            <EmptyStateDescription>
              {`No feedback rows match “${query}”. Search covers anonymous IDs, email addresses, the feedback message body, and topic. Try a different query or clear the search to return to the dashboard.`}
            </EmptyStateDescription>
          </EmptyStateText>
        </EmptyState>
      </PanelCard>
    );
  }

  return (
    <PanelCard
      title={`Matching feedback (${rows.length}${rows.length === 100 ? "+" : ""})`}
      radius="md"
    >
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

export function FeedbackLookupSkeleton({ query }: { query: string }) {
  return (
    <PanelCard title={`Matching feedback for “${query}”`} radius="md">
      <div style={{ padding: 24 }} aria-busy="true" aria-live="polite">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              width="100%"
              height={32}
              style={{ display: "block" }}
            />
          ))}
        </div>
      </div>
    </PanelCard>
  );
}

// Standalone empty-state for when the lookup table is empty AND the
// active env filter happens to have zero rows — useful catch-all.
export function FeedbackLookupNoData({
  query,
  env,
}: {
  query: string;
  env: EnvFilter;
}) {
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
        <EmptyStateTitle>No feedback to search</EmptyStateTitle>
        <EmptyStateDescription>
          {`No feedback recorded in ${envLabel[env]} yet, so the search for “${query}” has nothing to match against.`}
        </EmptyStateDescription>
      </EmptyStateText>
    </EmptyState>
  );
}
