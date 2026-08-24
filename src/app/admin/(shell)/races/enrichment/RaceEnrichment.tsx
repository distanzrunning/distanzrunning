// src/app/admin/(shell)/races/enrichment/RaceEnrichment.tsx
//
// Server content + skeleton for the enrichment review queue. Every
// published race lists here (enrichment isn't gated on a past date
// the way Date Review is); races with pending suggestions sort to
// the top, then never-scanned, then stalest-scan-first.

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
import type { EnrichmentSuggestion } from "@/lib/raceEnrichment";

import EnrichmentRow, { type EnrichmentRowData } from "./EnrichmentRow";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const block = { display: "block" } as const;

const TABLE_COLGROUP = (
  <colgroup>
    <col style={{ width: "28%" }} />
    <col style={{ width: "22%" }} />
    <col style={{ width: "18%" }} />
    <col style={{ width: "16%" }} />
    <col style={{ width: "16%" }} />
  </colgroup>
);

const TABLE_HEADER = (
  <TableHeader>
    <TableRow>
      <TableHead>Race</TableHead>
      <TableHead>Wikipedia page</TableHead>
      <TableHead>Suggestions</TableHead>
      <TableHead>Last scanned</TableHead>
      {/* Override last:text-right inherited from DS so the Action
          header reads left like the others. */}
      <TableHead style={{ textAlign: "left" }}>Action</TableHead>
    </TableRow>
  </TableHeader>
);

export async function RaceEnrichmentContent() {
  // Published docs always show. A DRAFT only shows when it has no
  // published counterpart — i.e. a race created via /admin/races/new
  // and never published (the common case this unlocks: a freshly
  // created draft is immediately scannable here for records/site
  // data). A draft that's mid-EDIT of an already-published race is
  // excluded — its published twin already has a row, and showing
  // both would duplicate the race and split its scan history.
  const allRaces: (EnrichmentRowData & { _pendingCount: number })[] =
    await sanityClient.fetch(
      `*[_type == "raceGuide"]{
        _id,
        title,
        country,
        wikipediaUrl,
        enrichmentSuggestions,
        enrichmentLastScanAt,
        "_pendingCount": count(enrichmentSuggestions[status == "pending"])
      }`,
    );
  const publishedIds = new Set(
    allRaces.filter((r) => !r._id.startsWith("drafts.")).map((r) => r._id),
  );
  const races = allRaces
    .filter(
      (r) =>
        !r._id.startsWith("drafts.") ||
        !publishedIds.has(r._id.slice("drafts.".length)),
    )
    .sort((a, b) => {
      const pendingDiff = b._pendingCount - a._pendingCount;
      if (pendingDiff !== 0) return pendingDiff;
      const scanDiff = (a.enrichmentLastScanAt ?? "1970-01-01").localeCompare(
        b.enrichmentLastScanAt ?? "1970-01-01",
      );
      if (scanDiff !== 0) return scanDiff;
      return a.title.localeCompare(b.title);
    });

  const pendingTotal = races.reduce(
    (sum, r) =>
      sum +
      (r.enrichmentSuggestions ?? []).filter(
        (s: EnrichmentSuggestion) => s.status === "pending",
      ).length,
    0,
  );

  return (
    <>
      <p className="mb-6 mt-2 text-copy-14 text-textSubtler">
        {races.length} race{races.length === 1 ? "" : "s"}. Scans read the
        race&rsquo;s Wikipedia article (any language edition) for course
        records and field size, and the official site for start time, entry
        price, and expo details.{" "}
        {pendingTotal > 0
          ? `${pendingTotal} field suggestion${
              pendingTotal === 1 ? "" : "s"
            } pending review — expand a row to approve or reject.`
          : "No pending suggestions — use the Scan button per row to fetch candidates."}
      </p>

      <section className="material-base overflow-hidden">
        <Table bordered>
          {TABLE_COLGROUP}
          {TABLE_HEADER}
          <TableBody>
            {races.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-copy-13 text-textSubtler"
                >
                  No published races found.
                </TableCell>
              </TableRow>
            )}
            {races.map((row) => (
              <EnrichmentRow key={row._id} race={row} />
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
}

export function RaceEnrichmentSkeleton() {
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
                {Array.from({ length: 5 }).map((__, j) => (
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
