// src/app/admin/(shell)/races/date-review/page.tsx
//
// Phase 2 of the date-refresh pipeline: editor-facing review queue
// for the suggestions written by /api/race-date-refresh.
//
// Server component — pulls every raceGuide with
// suggestedNextDateStatus == "pending" and renders one row per
// suggestion with the source quote, the past eventDate, the
// proposed new date (editable inline), and Approve/Reject buttons
// that call into the server actions in ./actions.ts.

import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { createClient } from "next-sanity";

import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import RowActions from "./RowActions";

export const metadata = {
  title: "Race Date Review — Stride Admin",
  robots: { index: false, follow: false },
};

// Always re-fetch — the page changes the moment any other tab
// approves or rejects a suggestion.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  // Read-only view of the queue — but using the write token bypasses
  // CDN caching so the editor always sees the freshest state after
  // their own approve/reject.
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

interface PendingSuggestion {
  _id: string;
  title: string;
  eventDate: string;
  officialWebsite: string;
  suggestedNextDate: string;
  suggestedNextDateScrapedAt: string;
  suggestedNextDateSourceQuote?: string;
}

const safeFormat = (iso: string | undefined, pattern: string): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : format(d, pattern);
};

export default async function RaceDateReviewPage() {
  const pending: PendingSuggestion[] = await sanityClient.fetch(
    `*[
      _type == "raceGuide"
      && suggestedNextDateStatus == "pending"
      && !(_id in path("drafts.**"))
    ] | order(suggestedNextDateScrapedAt desc) {
      _id,
      title,
      eventDate,
      officialWebsite,
      suggestedNextDate,
      suggestedNextDateScrapedAt,
      suggestedNextDateSourceQuote
    }`,
  );

  return (
    <div style={{ padding: "32px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
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
            Race Date Review
          </h1>
          <p
            style={{
              marginTop: 6,
              marginBottom: 0,
              fontSize: 13,
              color: "var(--ds-gray-700)",
            }}
          >
            {pending.length === 0
              ? "Nothing pending. Suggestions land here when /api/race-date-refresh runs."
              : `${pending.length} pending ${
                  pending.length === 1 ? "suggestion" : "suggestions"
                }.`}{" "}
            Approve to overwrite the race&rsquo;s eventDate; reject to
            skip this race on future scans.
          </p>
        </header>

        <section
          style={{
            border: "1px solid var(--ds-gray-400)",
            borderRadius: 12,
            background: "var(--ds-background-100)",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Race</TableHead>
                <TableHead>Current eventDate</TableHead>
                <TableHead>Suggested</TableHead>
                <TableHead>Source quote</TableHead>
                <TableHead>Scraped</TableHead>
                <TableHead style={{ minWidth: 280 }}>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    style={{
                      padding: 32,
                      textAlign: "center",
                      color: "var(--ds-gray-700)",
                      fontSize: 13,
                    }}
                  >
                    No pending suggestions.
                  </TableCell>
                </TableRow>
              )}
              {pending.map((row) => (
                <TableRow key={row._id}>
                  <TableCell
                    style={{
                      maxWidth: 220,
                      fontSize: 13,
                      color: "var(--ds-gray-1000)",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span>{row.title}</span>
                      {row.officialWebsite && (
                        <a
                          href={row.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${row.title} official website`}
                          title="Open official website"
                          style={{
                            color: "var(--ds-gray-700)",
                            display: "inline-flex",
                          }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    <Badge variant="red-subtle" size="sm">
                      Past
                    </Badge>
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 12,
                        color: "var(--ds-gray-900)",
                      }}
                    >
                      {safeFormat(row.eventDate, "d MMM yyyy")}
                    </span>
                  </TableCell>
                  <TableCell
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--ds-gray-1000)",
                    }}
                  >
                    {safeFormat(row.suggestedNextDate, "d MMM yyyy")}
                  </TableCell>
                  <TableCell
                    style={{
                      maxWidth: 320,
                      fontSize: 12,
                      fontStyle: "italic",
                      color: "var(--ds-gray-900)",
                      lineHeight: 1.4,
                    }}
                  >
                    {row.suggestedNextDateSourceQuote
                      ? `"${row.suggestedNextDateSourceQuote}"`
                      : "—"}
                  </TableCell>
                  <TableCell
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: 12,
                      color: "var(--ds-gray-700)",
                    }}
                  >
                    {safeFormat(row.suggestedNextDateScrapedAt, "d MMM, HH:mm")}
                  </TableCell>
                  <TableCell>
                    <RowActions
                      id={row._id}
                      suggestedDate={row.suggestedNextDate}
                      title={row.title}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
}
