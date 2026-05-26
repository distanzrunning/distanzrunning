"use client";

// Recent decisions table — receives the per-window, per-decision-
// filter rows already computed server-side, then applies the
// instant client-side anon-ID filter on top so typing into the
// search input narrows the visible rows without a navigation. Sits
// inside a Suspense boundary; the filter context lives outside it,
// so the filter row stays mounted across data refetches.

import { useMemo } from "react";

import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { PanelCard } from "@/components/ui/PanelCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Tooltip } from "@/components/ui/Tooltip";

import { CountryCell } from "./CountryCell";
import { WhenCell } from "./WhenCell";
import { useConsentFilter } from "./ConsentFilterShell";

type Decision = "accept_all" | "reject_all" | "custom";

const DECISION_LABEL: Record<Decision, string> = {
  accept_all: "accepts",
  reject_all: "rejects",
  custom: "custom decisions",
};

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

export interface RecentRow {
  id: number;
  anon_id: string;
  marketing: boolean;
  analytics: boolean;
  functional: boolean;
  decision: Decision;
  country: string | null;
  created_at: string;
}

interface RecentDecisionsTableProps {
  rows: RecentRow[];
  title: string;
  filter: Decision | null;
}

export default function RecentDecisionsTable({
  rows,
  title,
  filter,
}: RecentDecisionsTableProps) {
  const { filterText } = useConsentFilter();

  const visible = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.anon_id.toLowerCase().includes(q));
  }, [rows, filterText]);

  const emptyMessage = filterText.trim()
    ? `No anonymous IDs match “${filterText.trim()}”.`
    : filter
      ? `No ${DECISION_LABEL[filter]} in this window.`
      : "No decisions yet.";

  return (
    <PanelCard title={title}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>Decision</TableHead>
            <TableHead>Marketing</TableHead>
            <TableHead>Analytics</TableHead>
            <TableHead>Functional</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Anon ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                style={{
                  padding: 24,
                  textAlign: "center",
                  color: "var(--ds-gray-700)",
                }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
          {visible.map((row) => {
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
                <TableCell className="text-label-12-mono">
                  <Tooltip content={row.anon_id}>
                    <a
                      href={`/admin/consent?q=${encodeURIComponent(row.anon_id)}`}
                      style={{
                        color: "var(--ds-gray-700)",
                        textDecoration: "underline",
                      }}
                    >
                      {row.anon_id.slice(0, 8)}…
                    </a>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </PanelCard>
  );
}
