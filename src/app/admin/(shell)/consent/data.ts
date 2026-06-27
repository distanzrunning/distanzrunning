import { unstable_cache } from "next/cache";

import { getSupabaseAdmin } from "@/lib/supabase/server";

// ============================================================================
// Consent dashboard data layer — sourced from the self-hosted c15t tables.
// ----------------------------------------------------------------------------
// c15t's append-only `c15t_consent` rows are the audit trail. Each row lists
// the GRANTED purpose IDs in `purposeIds`; we resolve those to category codes
// (necessary / measurement / marketing / functionality) via `c15t_consentPurpose`
// and project everything into the flat shape the dashboard UI already consumes.
// There is no environment dimension in c15t (single DB), so the old env filter
// is retired.
// ============================================================================

/** Tag used by every consent-data unstable_cache entry. The delete action calls
 *  revalidateTag(CONSENT_CACHE_TAG) so admin writes flush the dashboard cache. */
export const CONSENT_CACHE_TAG = "consent_records";

const C15T_CONSENT = "c15t_consent";
const C15T_PURPOSE = "c15t_consentPurpose";

export type ConsentDecision = "accept_all" | "reject_all" | "custom";

export interface ConsentRowRaw {
  /** c15t consent row id (string). */
  id: string;
  /** c15t subject id (sub_xxx) — the per-browser identifier. */
  anon_id: string;
  marketing: boolean;
  analytics: boolean;
  functional: boolean;
  decision: ConsentDecision;
  /** Jurisdiction-derived; c15t stores GDPR/CCPA/… not an ISO country. */
  country: string | null;
  created_at: string;
}

const FETCH_LIMIT = 10_000;

/** Normalise c15t's `consentAction` (which spans both the accept_all/reject_all
 *  vocabulary and the raw all/necessary/custom save types) into our 3 buckets. */
function normaliseDecision(action: string | null): ConsentDecision {
  if (action === "accept_all" || action === "all") return "accept_all";
  if (
    action === "reject_all" ||
    action === "reject" ||
    action === "necessary" ||
    action === "opt_out"
  ) {
    return "reject_all";
  }
  return "custom";
}

/** c15t purpose id → category code (necessary / measurement / marketing /
 *  functionality). Small table, cached 5 min. */
const getPurposeCodeMap = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(C15T_PURPOSE)
      .select("id, code");
    if (error) {
      console.error("[consent] purpose map lookup failed", error.message);
      return {};
    }
    const map: Record<string, string> = {};
    for (const row of (data ?? []) as { id: string; code: string }[]) {
      map[row.id] = row.code;
    }
    return map;
  },
  ["c15t-purpose-map"],
  { revalidate: 300, tags: [CONSENT_CACHE_TAG] },
);

interface C15tConsentRow {
  id: string;
  subjectId: string;
  // fumadb stores json array columns wrapped as `{ json: [...] }`, so accept
  // both that envelope and a bare array.
  purposeIds: string[] | { json?: string[] } | null;
  consentAction: string | null;
  givenAt: string;
}

/** Unwrap fumadb's `{ json: [...] }` envelope (or accept a bare array). */
function extractPurposeIds(raw: C15tConsentRow["purposeIds"]): string[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && Array.isArray(raw.json)) {
    return raw.json;
  }
  return [];
}

function projectRow(
  row: C15tConsentRow,
  purposeCode: Record<string, string>,
): ConsentRowRaw {
  const ids = extractPurposeIds(row.purposeIds);
  const codes = new Set(ids.map((id) => purposeCode[id]).filter(Boolean));
  return {
    id: String(row.id),
    anon_id: row.subjectId,
    marketing: codes.has("marketing"),
    analytics: codes.has("measurement"),
    functional: codes.has("functionality"),
    decision: normaliseDecision(row.consentAction),
    // Country isn't on the consent row in c15t (it lives on
    // runtimePolicyDecision); leave null rather than mislabel jurisdiction.
    country: null,
    created_at: row.givenAt,
  };
}

/** Earliest stored consent timestamp (drives the "All time" preset). */
const getEarliestDecisionDateIso = unstable_cache(
  async (): Promise<string | null> => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(C15T_CONSENT)
      .select("givenAt")
      .order("givenAt", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.error("[consent] earliest lookup failed", error.message);
      return null;
    }
    return (data as { givenAt: string } | null)?.givenAt ?? null;
  },
  ["c15t-consent-earliest"],
  { revalidate: 300, tags: [CONSENT_CACHE_TAG] },
);

export async function getEarliestDecisionDate(): Promise<Date | null> {
  const iso = await getEarliestDecisionDateIso();
  return iso ? new Date(iso) : null;
}

/** Consent rows within [startIso, endIso] inclusive, ordered desc. Cached per
 *  (startIso, endIso) for 30s. ISO strings (not Dates) so unstable_cache can
 *  serialise them into a stable key. */
export const getConsentRowsInRange = unstable_cache(
  async (startIso: string, endIso: string): Promise<ConsentRowRaw[]> => {
    const supabase = getSupabaseAdmin();
    const purposeCode = await getPurposeCodeMap();
    const { data, error } = await supabase
      .from(C15T_CONSENT)
      .select("id, subjectId, purposeIds, consentAction, givenAt")
      .gte("givenAt", startIso)
      .lte("givenAt", endIso)
      .order("givenAt", { ascending: false })
      .limit(FETCH_LIMIT);
    if (error) {
      console.error("[consent] rows lookup failed", error.message);
      return [];
    }
    return ((data ?? []) as C15tConsentRow[]).map((row) =>
      projectRow(row, purposeCode),
    );
  },
  ["c15t-consent-rows"],
  { revalidate: 30, tags: [CONSENT_CACHE_TAG] },
);

/** All consent rows for a single subject (DSAR lookup), newest first.
 *  Uncached — looked up on demand and must reflect the latest state. */
export async function getConsentRowsBySubject(
  subjectId: string,
): Promise<ConsentRowRaw[]> {
  const supabase = getSupabaseAdmin();
  const purposeCode = await getPurposeCodeMap();
  const { data, error } = await supabase
    .from(C15T_CONSENT)
    .select("id, subjectId, purposeIds, consentAction, givenAt")
    .eq("subjectId", subjectId)
    .order("givenAt", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as C15tConsentRow[]).map((row) =>
    projectRow(row, purposeCode),
  );
}
