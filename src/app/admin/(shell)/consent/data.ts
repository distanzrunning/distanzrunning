import { unstable_cache } from "next/cache";

import { getSupabaseAdmin } from "@/lib/supabase/server";

/** Tag used by every consent-data unstable_cache entry. The delete
 *  action calls revalidateTag(CONSENT_CACHE_TAG) so admin writes
 *  flush the dashboard cache immediately. */
export const CONSENT_CACHE_TAG = "consent_records";

export type ConsentDecision = "accept_all" | "reject_all" | "custom";

export type ConsentEnvironment = "production" | "staging" | "development";
/** Dashboard filter value — concrete env name or "all" to skip filtering. */
export type ConsentEnvFilter = ConsentEnvironment | "all";

export interface ConsentRowRaw {
  id: number;
  anon_id: string;
  marketing: boolean;
  analytics: boolean;
  functional: boolean;
  decision: ConsentDecision;
  country: string | null;
  environment: ConsentEnvironment;
  created_at: string;
}

const FETCH_LIMIT = 10_000;

/** Internal cached fetcher — returns the raw ISO string so the
 *  value round-trips JSON safely through unstable_cache (Date
 *  objects don't survive the cache's JSON serialisation; reads
 *  after the first write come back as strings, blowing up any
 *  downstream Date.format() call).
 *
 *  Cache key segments include the env filter so each filter gets
 *  its own entry — "production" earliest can differ from "all". */
const getEarliestDecisionDateIso = unstable_cache(
  async (env: ConsentEnvFilter): Promise<string | null> => {
    const supabase = getSupabaseAdmin();
    let q = supabase
      .from("consent_records")
      .select("created_at")
      .order("created_at", { ascending: true })
      .limit(1);
    if (env !== "all") q = q.eq("environment", env);
    const { data, error } = await q.maybeSingle();
    if (error) {
      console.error("[consent] earliest lookup failed", error.message);
      return null;
    }
    return data?.created_at ?? null;
  },
  ["consent-earliest"],
  { revalidate: 300, tags: [CONSENT_CACHE_TAG] },
);

/** Earliest consent_records.created_at as a real Date — wraps the
 *  cached ISO-string fetcher above. New earliest only happens on
 *  the first-ever record (per env), so the underlying cache TTL
 *  is 5 min. Defaults to "all" envs. */
export async function getEarliestDecisionDate(
  env: ConsentEnvFilter = "all",
): Promise<Date | null> {
  const iso = await getEarliestDecisionDateIso(env);
  return iso ? new Date(iso) : null;
}

/** Fetch consent records within [startIso, endIso] inclusive,
 *  optionally narrowed to a single environment, ordered desc.
 *  Cached per (startIso, endIso, env) for 30s so clicking between
 *  tiles / filters / metric within the same window + env after the
 *  first load hits the cache instead of re-fetching from Supabase.
 *
 *  ISO strings (not Date objects) so unstable_cache can serialise
 *  the args into a stable cache key. */
export const getConsentRowsInRange = unstable_cache(
  async (
    startIso: string,
    endIso: string,
    env: ConsentEnvFilter,
  ): Promise<ConsentRowRaw[]> => {
    const supabase = getSupabaseAdmin();
    let q = supabase
      .from("consent_records")
      .select(
        "id, anon_id, marketing, analytics, functional, decision, country, environment, created_at",
      )
      .gte("created_at", startIso)
      .lte("created_at", endIso)
      .order("created_at", { ascending: false })
      .limit(FETCH_LIMIT);
    if (env !== "all") q = q.eq("environment", env);
    const { data, error } = await q;
    if (error) {
      console.error("[consent] rows lookup failed", error.message);
      return [];
    }
    return (data ?? []) as ConsentRowRaw[];
  },
  ["consent-rows"],
  { revalidate: 30, tags: [CONSENT_CACHE_TAG] },
);
