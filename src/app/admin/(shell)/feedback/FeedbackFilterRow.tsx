"use client";

import AdminDateRangePicker from "@/components/admin/AdminDateRangePicker";
import AdminEnvFilter from "@/components/admin/AdminEnvFilter";
import type { EnvFilter } from "@/components/admin/env";

// One-row filter bar: env picker on the left, date-range picker on
// the right. Both write to URL search params, so server-side data
// fetching re-runs naturally on change. No text-search field today —
// the feedback dashboard doesn't have a per-ID lookup view (yet).
export default function FeedbackFilterRow({
  tz,
  earliestDate,
  env,
}: {
  tz: string;
  earliestDate: Date | null;
  env: EnvFilter;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "stretch",
        justifyContent: "flex-end",
        marginBottom: 16,
      }}
    >
      <AdminEnvFilter current={env} />
      <AdminDateRangePicker tz={tz} earliestDate={earliestDate} />
    </div>
  );
}
