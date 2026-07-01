"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import AdminDateRangePicker from "@/components/admin/AdminDateRangePicker";
import { Input } from "@/components/ui/Input";
import { useConsentFilter } from "./ConsentFilterShell";

// One-row filter bar: free-text search on the left, date-range
// picker on the right. Typing filters the Recent decisions table
// client-side instantly (no navigation). Pressing Enter commits the
// query and navigates to the per-ID lookup view (which filters the
// charts too — full-history scope). The active breakdown filter (set
// via a leaderboard row's funnel) is cleared from that panel's own
// Remove-filter toolbar, matching Vercel — not from here.
export default function ConsentFilterRow({
  tz,
  earliestDate,
}: {
  tz: string;
  earliestDate: Date | null;
}) {
  const router = useRouter();
  const { filterText, setFilterText } = useConsentFilter();

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "stretch",
        marginBottom: 16,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <Input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const q = filterText.trim();
              if (!q) return;
              router.push(`/admin/consent?q=${encodeURIComponent(q)}`);
            }
          }}
          placeholder="Filter subject IDs"
          spellCheck={false}
          autoComplete="off"
          prefix={<Search className="w-4 h-4" />}
        />
      </div>
      <AdminDateRangePicker tz={tz} earliestDate={earliestDate} />
    </div>
  );
}
