import { cache } from "react";

import { getSupabaseAdmin } from "@/lib/supabase/server";

/** Earliest consent_records.created_at (UTC). Cached per request via
 *  React's `cache`, so page.tsx and ConsentDashboardContent share a
 *  single DB hit. Returns null on error or when the table is empty
 *  — callers should treat that as "no earliest known" and fall back
 *  to the ALL_TIME_START sentinel. */
export const getEarliestDecisionDate = cache(
  async (): Promise<Date | null> => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("consent_records")
      .select("created_at")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.error("[consent] earliest lookup failed", error.message);
      return null;
    }
    if (!data?.created_at) return null;
    return new Date(data.created_at);
  },
);
