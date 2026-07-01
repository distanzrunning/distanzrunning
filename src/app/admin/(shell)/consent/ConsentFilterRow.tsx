"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Search, X } from "lucide-react";

import AdminDateRangePicker from "@/components/admin/AdminDateRangePicker";
import { Input } from "@/components/ui/Input";
import { useConsentFilter } from "./ConsentFilterShell";
import { CONSENT_DIM_LABEL, type ConsentDimKey } from "./data";

export interface ActiveBreakdownFilter {
  dim: ConsentDimKey;
  val: string;
  /** Resolved display label (e.g. "United Kingdom"), from the server. */
  label: string;
}

// One-row filter bar: free-text search on the left, date-range
// picker on the right. Typing filters the Recent decisions table
// client-side instantly (no navigation). Pressing Enter commits the
// query and navigates to the per-ID lookup view (which filters the
// charts too — full-history scope). When a breakdown filter is applied
// (via a leaderboard row's funnel), a removable chip sits between the
// search and the date picker.
export default function ConsentFilterRow({
  tz,
  earliestDate,
  activeFilter = null,
}: {
  tz: string;
  earliestDate: Date | null;
  activeFilter?: ActiveBreakdownFilter | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filterText, setFilterText } = useConsentFilter();

  const clearBreakdownFilter = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("dim");
    next.delete("val");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

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

      {activeFilter && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
            paddingLeft: 12,
            paddingRight: 6,
            borderRadius: 6,
            background: "hsl(var(--color-surface))",
            border: "1px solid hsl(var(--color-borderDefault))",
            fontSize: 13,
            lineHeight: "20px",
            whiteSpace: "nowrap",
            maxWidth: 280,
          }}
        >
          <span style={{ color: "hsl(var(--color-textSubtle))" }}>
            {CONSENT_DIM_LABEL[activeFilter.dim]}
          </span>
          <span
            style={{
              color: "hsl(var(--color-textDefault))",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
            }}
            title={activeFilter.label}
          >
            {activeFilter.label}
          </span>
          <button
            type="button"
            onClick={clearBreakdownFilter}
            aria-label="Clear filter"
            title="Clear filter"
            className="inline-flex items-center justify-center rounded-[6px] transition-colors text-[color:hsl(var(--color-textSubtle))] hover:text-[color:hsl(var(--color-textDefault))] hover:bg-[var(--ds-gray-100)]"
            style={{ width: 24, height: 24, cursor: "pointer", flexShrink: 0 }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <AdminDateRangePicker tz={tz} earliestDate={earliestDate} />
    </div>
  );
}
