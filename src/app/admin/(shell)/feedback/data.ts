import { unstable_cache } from "next/cache";

import type { Environment, EnvFilter } from "@/components/admin/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";

/** Tag used by every feedback-data unstable_cache entry. The delete
 *  action calls revalidateTag(FEEDBACK_CACHE_TAG) so admin writes
 *  flush the dashboard cache immediately. */
export const FEEDBACK_CACHE_TAG = "feedback_records";

export type Emotion = "hate" | "not-great" | "okay" | "love";

export interface FeedbackRowRaw {
  id: number;
  anon_id: string | null;
  emotion: Emotion | null;
  feedback: string;
  topic: string | null;
  email: string | null;
  page_path: string | null;
  country: string | null;
  environment: Environment;
  created_at: string;
}

const FETCH_LIMIT = 10_000;

/** Internal cached fetcher — returns the raw ISO string so the value
 *  round-trips JSON safely through unstable_cache (Date objects don't
 *  survive the cache's JSON serialisation; reads after the first
 *  write come back as strings, blowing up any downstream Date.format()
 *  call).
 *
 *  Cache key segments include the env filter so each filter gets its
 *  own entry — "production" earliest can differ from "all". */
const getEarliestFeedbackDateIso = unstable_cache(
  async (env: EnvFilter): Promise<string | null> => {
    const supabase = getSupabaseAdmin();
    let q = supabase
      .from("feedback_records")
      .select("created_at")
      .order("created_at", { ascending: true })
      .limit(1);
    if (env !== "all") q = q.eq("environment", env);
    const { data, error } = await q.maybeSingle();
    if (error) {
      console.error("[feedback] earliest lookup failed", error.message);
      return null;
    }
    return data?.created_at ?? null;
  },
  ["feedback-earliest"],
  { revalidate: 300, tags: [FEEDBACK_CACHE_TAG] },
);

/** Earliest feedback_records.created_at as a real Date — wraps the
 *  cached ISO-string fetcher above. New earliest only happens on
 *  the first-ever record (per env), so the underlying cache TTL is
 *  5 min. Defaults to "all" envs. */
export async function getEarliestFeedbackDate(
  env: EnvFilter = "all",
): Promise<Date | null> {
  const iso = await getEarliestFeedbackDateIso(env);
  return iso ? new Date(iso) : null;
}

/** Lookup search: returns rows whose anon_id / email / feedback /
 *  topic matches `q` (case-insensitive substring). Hard-capped to
 *  100 rows so a wildcard-ish query can't blow the page render
 *  budget. Cached per (q, env) for 30s.
 *
 *  Sanitises the percent-encoded commas/parentheses that PostgREST's
 *  .or() filter uses as separators, so an admin search containing
 *  these chars doesn't get split into multiple clauses. SQL injection
 *  is not a concern (parameterised client) — this is purely about
 *  the .or filter's grammar. */
const LOOKUP_LIMIT = 100;
const escapeOrValue = (raw: string): string =>
  raw.replace(/[,()*]/g, " ").trim();

export const lookupFeedback = unstable_cache(
  async (q: string, env: EnvFilter): Promise<FeedbackRowRaw[]> => {
    const term = escapeOrValue(q);
    if (term.length === 0) return [];
    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("feedback_records")
      .select(
        "id, anon_id, emotion, feedback, topic, email, page_path, country, environment, created_at",
      )
      .or(
        [
          `anon_id.ilike.%${term}%`,
          `email.ilike.%${term}%`,
          `feedback.ilike.%${term}%`,
          `topic.ilike.%${term}%`,
        ].join(","),
      )
      .order("created_at", { ascending: false })
      .limit(LOOKUP_LIMIT);
    if (env !== "all") query = query.eq("environment", env);
    const { data, error } = await query;
    if (error) {
      console.error("[feedback] lookup failed", error.message);
      return [];
    }
    return (data ?? []) as FeedbackRowRaw[];
  },
  ["feedback-lookup"],
  { revalidate: 30, tags: [FEEDBACK_CACHE_TAG] },
);

/** Fetch feedback rows within [startIso, endIso] inclusive, optionally
 *  narrowed to a single environment, ordered desc. Cached per
 *  (startIso, endIso, env) for 30s so clicking between tiles /
 *  filters / metric within the same window + env after the first
 *  load hits the cache instead of re-fetching from Supabase.
 *
 *  ISO strings (not Date objects) so unstable_cache can serialise the
 *  args into a stable cache key. */
export const getFeedbackRowsInRange = unstable_cache(
  async (
    startIso: string,
    endIso: string,
    env: EnvFilter,
  ): Promise<FeedbackRowRaw[]> => {
    const supabase = getSupabaseAdmin();
    let q = supabase
      .from("feedback_records")
      .select(
        "id, anon_id, emotion, feedback, topic, email, page_path, country, environment, created_at",
      )
      .gte("created_at", startIso)
      .lte("created_at", endIso)
      .order("created_at", { ascending: false })
      .limit(FETCH_LIMIT);
    if (env !== "all") q = q.eq("environment", env);
    const { data, error } = await q;
    if (error) {
      console.error("[feedback] rows lookup failed", error.message);
      return [];
    }
    return (data ?? []) as FeedbackRowRaw[];
  },
  ["feedback-rows"],
  { revalidate: 30, tags: [FEEDBACK_CACHE_TAG] },
);
