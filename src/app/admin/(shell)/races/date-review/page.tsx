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
    <div className="px-6 py-8">
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-6">
          <h1 className="m-0 text-heading-24 text-[color:var(--ds-gray-1000)]">
            Race Date Review
          </h1>
          <p className="mb-0 mt-1.5 text-copy-13 text-[color:var(--ds-gray-700)]">
            {pending.length === 0
              ? "Nothing pending. Suggestions land here when /api/race-date-refresh runs."
              : `${pending.length} pending ${
                  pending.length === 1 ? "suggestion" : "suggestions"
                }.`}{" "}
            Approve to overwrite the race&rsquo;s eventDate; reject to
            skip this race on future scans.
          </p>
        </header>

        {/* material-base = bg-100 + 1 px gray-400 border + 6 px
            radius, no shadow. The DS reserves the 12 px / shadowed
            materials (medium/large) for "further raised" surfaces
            like menus + modals; a flat table on the page is an
            "everyday surface" → 6 px. overflow-hidden keeps the
            Table's first/last row corners inside the radius. */}
        <section className="material-base overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Race</TableHead>
                <TableHead>Current eventDate</TableHead>
                <TableHead>Source quote</TableHead>
                <TableHead>Scraped</TableHead>
                {/* Suggested cell renders the editable Calendar
                    — it's both the display and the input for the
                    override-on-approve flow. */}
                <TableHead>Suggested</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-copy-13 text-[color:var(--ds-gray-700)]"
                  >
                    No pending suggestions.
                  </TableCell>
                </TableRow>
              )}
              {pending.map((row) => (
                <TableRow key={row._id}>
                  <TableCell className="max-w-[220px] text-copy-13 text-[color:var(--ds-gray-1000)]">
                    <div className="flex items-center gap-1.5">
                      <span>{row.title}</span>
                      {row.officialWebsite && (
                        <a
                          href={row.officialWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${row.title} official website`}
                          title="Open official website"
                          className="inline-flex text-[color:var(--ds-gray-700)] hover:text-[color:var(--ds-gray-1000)]"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Badge variant="red-subtle" size="sm">
                        Past
                      </Badge>
                      <span className="text-label-12 text-[color:var(--ds-gray-900)]">
                        {safeFormat(row.eventDate, "d MMM yyyy")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[320px] text-copy-13 italic text-[color:var(--ds-gray-900)]">
                    {row.suggestedNextDateSourceQuote
                      ? `"${row.suggestedNextDateSourceQuote}"`
                      : "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-label-12 text-[color:var(--ds-gray-700)]">
                    {safeFormat(row.suggestedNextDateScrapedAt, "d MMM, HH:mm")}
                  </TableCell>
                  {/* RowActions returns a fragment of TWO cells —
                      Suggested (Calendar) and Action (Approve /
                      Reject) — sharing the picked-date state. */}
                  <RowActions
                    id={row._id}
                    suggestedDate={row.suggestedNextDate}
                    title={row.title}
                  />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
}
