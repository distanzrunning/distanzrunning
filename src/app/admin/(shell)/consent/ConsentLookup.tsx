import { Download } from "lucide-react";

import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
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
import { CountryCell } from "@/components/admin/CountryCell";
import { WhenCell } from "@/components/admin/WhenCell";
import DeleteIdButton from "./DeleteIdButton";
import { getConsentRowsBySubject, type ConsentDecision } from "./data";

type Decision = ConsentDecision;

function decisionBadge(d: Decision): { label: string; variant: BadgeVariant } {
  switch (d) {
    case "accept_all":
      return { label: "Accept all", variant: "green-subtle" };
    case "reject_all":
      return { label: "Reject all", variant: "red-subtle" };
    default:
      return { label: "Custom", variant: "amber-subtle" };
  }
}

const block = { display: "block" } as const;

export async function ConsentLookupContent({ query }: { query: string }) {
  let rows: Awaited<ReturnType<typeof getConsentRowsBySubject>>;
  try {
    rows = await getConsentRowsBySubject(query);
  } catch (err) {
    return (
      <p style={{ color: "var(--ds-red-900)" }}>
        Lookup failed: {err instanceof Error ? err.message : "Unknown error"}
      </p>
    );
  }

  return (
    <PanelCard>
      {rows.length === 0 ? (
        <p
          className="text-copy-13"
          style={{ margin: 0, color: "hsl(var(--color-textSubtler))" }}
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
            <div
              className="text-copy-13"
              style={{ color: "hsl(var(--color-textSubtler))" }}
            >
              {rows.length} decision{rows.length === 1 ? "" : "s"} · latest{" "}
              {new Date(rows[0].created_at).toLocaleString()}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ButtonLink
                href={`/admin/consent/${encodeURIComponent(query)}/export`}
                variant="secondary"
                size="small"
                prefixIcon={<Download />}
              >
                Download CSV
              </ButtonLink>
              <DeleteIdButton anonId={query} count={rows.length} />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead>Marketing</TableHead>
                <TableHead>Analytics</TableHead>
                <TableHead>Functional</TableHead>
                <TableHead>Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const b = decisionBadge(row.decision);
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
                    <TableCell>{row.marketing ? "✓" : "—"}</TableCell>
                    <TableCell>{row.analytics ? "✓" : "—"}</TableCell>
                    <TableCell>{row.functional ? "✓" : "—"}</TableCell>
                    <TableCell>
                      <CountryCell iso={row.country} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </PanelCard>
  );
}

export function ConsentLookupSkeleton(_props: { query: string }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <PanelCard>
        <Skeleton width={220} height={14} style={block} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Decision</TableHead>
              <TableHead>Marketing</TableHead>
              <TableHead>Analytics</TableHead>
              <TableHead>Functional</TableHead>
              <TableHead>Country</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
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
      </PanelCard>
    </div>
  );
}
