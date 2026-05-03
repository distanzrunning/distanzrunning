// src/app/admin/(shell)/races/date-review/page.tsx
//
// Editor-facing review queue for past-dated races. Shows EVERY
// race whose eventDate is in the past, regardless of suggestion
// status, so the editor can:
//   - Approve / Reject pending suggestions written by the scraper
//   - Trigger a per-race Scan for races that haven't been scanned
//     yet (or where status is null)
//   - Reset rejected races back to scannable
//
// Per-row interactivity (Calendar, Scan, Approve, Reject, Reset)
// lives in the RowActions client component.

import { createClient } from "next-sanity";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import RaceRow, { type RaceRowData } from "./RaceRow";
import { type RowState } from "./RowActions";

export const metadata = {
  title: "Race Date Review — Stride Admin",
  robots: { index: false, follow: false },
};

// Always re-fetch — the page changes the moment any other tab
// approves, rejects, or scans a race.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  // Read-only view but write-token bypasses CDN cache so the
  // editor sees the freshest state after their own actions.
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

function rowStateFor(race: RaceRowData): RowState {
  if (race.suggestedNextDateStatus === "pending") return "pending";
  if (race.suggestedNextDateStatus === "rejected") return "rejected";
  if (!race.officialWebsite) return "no-website";
  return "scannable";
}

export default async function RaceDateReviewPage() {
  const past: RaceRowData[] = await sanityClient.fetch(
    // GROQ doesn't accept boolean expressions inline in order(),
    // so we project a sort-priority key first (pending → 0, others
    // → 1) and order ascending on it before the secondary date sort.
    `*[
      _type == "raceGuide"
      && defined(eventDate)
      && eventDate < now()
      && !(_id in path("drafts.**"))
    ]{
      _id,
      title,
      eventDate,
      officialWebsite,
      suggestedNextDate,
      suggestedNextDateScrapedAt,
      suggestedNextDateSourceQuote,
      suggestedNextDateStatus,
      lastScanAt,
      "_pendingPriority": select(suggestedNextDateStatus == "pending" => 0, 1)
    } | order(_pendingPriority asc, eventDate desc)`,
  );

  const pendingCount = past.filter(
    (r) => r.suggestedNextDateStatus === "pending",
  ).length;

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-6">
          <h1 className="m-0 text-heading-24 text-[color:var(--ds-gray-1000)]">
            Race Date Review
          </h1>
          <p className="mb-0 mt-2 text-copy-14 text-[color:var(--ds-gray-700)]">
            {past.length} race{past.length === 1 ? "" : "s"} with a past
            eventDate.{" "}
            {pendingCount > 0
              ? `${pendingCount} ${
                  pendingCount === 1 ? "has" : "have"
                } a pending suggestion ready to review.`
              : "No pending suggestions — use the Scan button per row to fetch a candidate date."}
          </p>
        </header>

        {/* material-base = bg-100 + 1 px gray-400 border + 6 px
            radius. overflow-hidden keeps the Table's first/last
            row corners inside the radius. */}
        <section className="material-base overflow-hidden">
          <Table bordered>
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "23%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead>Race</TableHead>
                <TableHead>Current eventDate</TableHead>
                <TableHead>Source quote</TableHead>
                <TableHead>Scraped</TableHead>
                <TableHead>Suggested</TableHead>
                {/* Override last:text-right inherited from DS so the
                    Action header reads left like the others. */}
                <TableHead style={{ textAlign: "left" }}>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {past.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-copy-13 text-[color:var(--ds-gray-700)]"
                  >
                    No past-dated races found.
                  </TableCell>
                </TableRow>
              )}
              {past.map((row) => (
                <RaceRow key={row._id} race={row} state={rowStateFor(row)} />
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
}
