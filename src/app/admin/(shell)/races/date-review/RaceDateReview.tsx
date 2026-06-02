import { createClient } from "next-sanity";

import { Skeleton } from "@/components/ui/Skeleton";
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

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

function rowStateFor(race: RaceRowData): RowState {
  if (race.suggestedNextDateStatus === "pending") return "pending";
  if (race.suggestedNextDateStatus === "rejected") return "rejected";
  if (!race.officialWebsite) return "no-website";
  return "scannable";
}

const block = { display: "block" } as const;

const TABLE_COLGROUP = (
  <colgroup>
    <col style={{ width: "20%" }} />
    <col style={{ width: "13%" }} />
    <col style={{ width: "23%" }} />
    <col style={{ width: "10%" }} />
    <col style={{ width: "16%" }} />
    <col style={{ width: "18%" }} />
  </colgroup>
);

const TABLE_HEADER = (
  <TableHeader>
    <TableRow>
      <TableHead>Race</TableHead>
      <TableHead>Current eventDate</TableHead>
      <TableHead>Source quote</TableHead>
      <TableHead>Scraped</TableHead>
      <TableHead>Suggested</TableHead>
      {/* Override last:text-right inherited from DS so the Action
          header reads left like the others. */}
      <TableHead style={{ textAlign: "left" }}>Action</TableHead>
    </TableRow>
  </TableHeader>
);

export async function RaceDateReviewContent() {
  const past: RaceRowData[] = await sanityClient.fetch(
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
    <>
      <p className="mb-6 mt-2 text-copy-14 text-textSubtler">
        {past.length} race{past.length === 1 ? "" : "s"} with a past eventDate.{" "}
        {pendingCount > 0
          ? `${pendingCount} ${
              pendingCount === 1 ? "has" : "have"
            } a pending suggestion ready to review.`
          : "No pending suggestions — use the Scan button per row to fetch a candidate date."}
      </p>

      <section className="material-base overflow-hidden">
        <Table bordered>
          {TABLE_COLGROUP}
          {TABLE_HEADER}
          <TableBody>
            {past.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-copy-13 text-textSubtler"
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
    </>
  );
}

export function RaceDateReviewSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="mb-6 mt-2 text-copy-14">
        <Skeleton width={420} height={14} style={block} />
      </p>

      <section className="material-base overflow-hidden">
        <Table bordered>
          {TABLE_COLGROUP}
          {TABLE_HEADER}
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <TableCell key={j}>
                    <Skeleton width="80%" height={14} style={block} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
