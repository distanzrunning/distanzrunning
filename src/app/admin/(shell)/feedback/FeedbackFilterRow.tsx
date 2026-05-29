"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import AdminDateRangePicker from "@/components/admin/AdminDateRangePicker";
import AdminEnvFilter from "@/components/admin/AdminEnvFilter";
import type { EnvFilter } from "@/components/admin/env";
import { Input } from "@/components/ui/Input";

// One-row filter bar: free-text lookup on the left, env + date picker
// on the right. Pressing Enter commits the query and navigates to
// /admin/feedback?q=…, which renders the lookup view (server-side
// search over anon_id / email / feedback / topic). No instant
// client-side filter today — feedback's Recent table is short (20
// rows max) and the across-all-data search via ?q is the more useful
// affordance for an admin chasing a specific submission.
export default function FeedbackFilterRow({
  tz,
  earliestDate,
  env,
  initialQuery = "",
}: {
  tz: string;
  earliestDate: Date | null;
  env: EnvFilter;
  initialQuery?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const q = query.trim();
              if (!q) return;
              const params = new URLSearchParams();
              params.set("q", q);
              if (env !== "all") params.set("env", env);
              router.push(`/admin/feedback?${params.toString()}`);
            }
          }}
          placeholder="Search anon IDs, emails, messages, topics…"
          spellCheck={false}
          autoComplete="off"
          prefix={<Search className="w-4 h-4" />}
        />
      </div>
      <AdminEnvFilter current={env} />
      <AdminDateRangePicker tz={tz} earliestDate={earliestDate} />
    </div>
  );
}
