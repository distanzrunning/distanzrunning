import { unstable_cache } from "next/cache";

import { getSupabaseAdmin } from "@/lib/supabase/server";

/** Tag used by every consent-data unstable_cache entry. The delete
 *  action calls revalidateTag(CONSENT_CACHE_TAG) so admin writes
 *  flush the dashboard cache immediately. */
export const CONSENT_CACHE_TAG = "consent_records";

export type ConsentDecision = "accept_all" | "reject_all" | "custom";

export interface ConsentRowRaw {
  id: number;
  anon_id: string;
  marketing: boolean;
  analytics: boolean;
  functional: boolean;
  decision: ConsentDecision;
  country: string | null;
  created_at: string;
}

const FETCH_LIMIT = 10_000;

/** Earliest consent_records.created_at (UTC). New earliest only
 *  happens on the first-ever record, so we cache for 5 min. */
export const getEarliestDecisionDate = unstable_cache(
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
  ["consent-earliest"],
  { revalidate: 300, tags: [CONSENT_CACHE_TAG] },
);

/** Fetch consent records within [startIso, endIso] inclusive,
 *  ordered desc. Cached per (startIso, endIso) for 30s so clicking
 *  between tiles / filters within the same window after the first
 *  load hits the cache instead of re-fetching from Supabase.
 *
 *  ISO strings (not Date objects) so unstable_cache can serialise
 *  the args into a stable cache key. */
export const getConsentRowsInRange = unstable_cache(
  async (startIso: string, endIso: string): Promise<ConsentRowRaw[]> => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("consent_records")
      .select(
        "id, anon_id, marketing, analytics, functional, decision, country, created_at",
      )
      .gte("created_at", startIso)
      .lte("created_at", endIso)
      .order("created_at", { ascending: false })
      .limit(FETCH_LIMIT);
    if (error) {
      console.error("[consent] rows lookup failed", error.message);
      return [];
    }
    return (data ?? []) as ConsentRowRaw[];
  },
  ["consent-rows"],
  { revalidate: 30, tags: [CONSENT_CACHE_TAG] },
);
