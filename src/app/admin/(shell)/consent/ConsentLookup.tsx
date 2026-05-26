import { ChevronLeft } from "lucide-react";

import { Badge, type BadgeVariant } from "@/components/ui/Badge";
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
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { CountryCell } from "./CountryCell";
import DeleteIdButton from "./DeleteIdButton";

type Decision = "accept_all" | "reject_all" | "custom";

interface ConsentRow {
  id: number;
  anon_id: string;
  marketing: boolean;
  analytics: boolean;
  functional: boolean;
  decision: Decision;
  country: string | null;
  created_at: string;
}

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

function BackLink() {
  return (
    <a
      href="/admin/consent"
      className="text-copy-13 inline-flex items-center gap-1 transition-colors"
      style={{
        color: "var(--ds-gray-900)",
        textDecoration: "none",
        marginBottom: 12,
      }}
    >
      <ChevronLeft className="w-4 h-4" />
      Back to dashboard
    </a>
  );
}

const block = { display: "block" } as const;

export async function ConsentLookupContent({ query }: { query: string }) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("consent_records")
    .select(
      "id, anon_id, marketing, analytics, functional, decision, country, created_at",
    )
    .eq("anon_id", query)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p style={{ color: "var(--ds-red-900)" }}>
        Lookup failed: {error.message}
      </p>
    );
  }

  const rows = (data ?? []) as ConsentRow[];

  return (
    <>
      <BackLink />
      <PanelCard title={`ID: ${query}`}>
        {rows.length === 0 ? (
        <p
          className="text-copy-13"
          style={{ margin: 0, color: "var(--ds-gray-700)" }}
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
              style={{ color: "var(--ds-gray-700)" }}
            >
              {rows.length} decision{rows.length === 1 ? "" : "s"} · latest{" "}
              {new Date(rows[0].created_at).toLocaleString()}
            </div>
            <DeleteIdButton anonId={query} count={rows.length} />
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
                      {new Date(row.created_at).toLocaleString()}
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
    </>
  );
}

export function ConsentLookupSkeleton({ query }: { query: string }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <BackLink />
      <PanelCard title={`ID: ${query}`}>
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
