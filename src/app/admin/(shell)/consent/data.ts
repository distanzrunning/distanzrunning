import { unstable_cache } from "next/cache";

import { getSupabaseAdmin } from "@/lib/supabase/server";
import { parseUserAgent } from "@/lib/userAgent";

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
const C15T_DOMAIN = "c15t_domain";
const C15T_POLICY = "c15t_consentPolicy";
const C15T_DECISION = "c15t_runtimePolicyDecision";

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

// ============================================================================
// Breakdown panels (Audience / Source) — ranked counts over the active window.
// ----------------------------------------------------------------------------
// Each consent row carries enough signal to bucket it by device/browser/OS
// (parsed from `userAgent`), UI surface (`uiSource`), domain, and policy; the
// linked `runtimePolicyDecision` adds country + language. We aggregate per
// CONSENT (not per session) so every panel's counts share the "Consents"
// denominator. `sessions` is the count of policy decisions (init calls) in the
// window — surfaced as its own tile.
// ============================================================================

export interface RankedItem {
  key: string;
  label: string;
  total: number;
  /** Italic "(unknown)" fallback bucket. */
  italic?: boolean;
}

export interface ConsentBreakdowns {
  sessions: number;
  devices: RankedItem[];
  browsers: RankedItem[];
  operatingSystems: RankedItem[];
  countries: RankedItem[];
  languages: RankedItem[];
  uiSources: RankedItem[];
  domains: RankedItem[];
  policies: RankedItem[];
}

const UNKNOWN_KEY = "__unknown__";

// Intl.DisplayNames turns ISO-2 region / BCP-47 language codes into readable
// names ("GB" → "United Kingdom", "en" → "English") with zero dependencies.
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

function safeRegion(code: string): string {
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

function safeLanguage(code: string): string {
  try {
    return languageNames.of(code) ?? code;
  } catch {
    return code;
  }
}

/** Tally `{ value, label }` pairs into ranked rows, top N by count. Null /
 *  empty / "Unknown" values collapse into a single italic "(unknown)" bucket
 *  that sorts purely by count alongside the rest (so the leader is always the
 *  bar that anchors the panel at full width). */
function rank(
  items: { value: string | null | undefined; label?: string }[],
  topN = 8,
): RankedItem[] {
  const counts = new Map<
    string,
    { label: string; total: number; italic: boolean }
  >();
  for (const { value, label } of items) {
    const unknown = value == null || value === "" || value === "Unknown";
    const key = unknown ? UNKNOWN_KEY : value;
    const entry = counts.get(key) ?? {
      label: unknown ? "(unknown)" : (label ?? value),
      total: 0,
      italic: unknown,
    };
    entry.total += 1;
    counts.set(key, entry);
  }
  return [...counts.entries()]
    .map(([key, v]) => ({
      key,
      label: v.label,
      total: v.total,
      italic: v.italic || undefined,
    }))
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label))
    .slice(0, topN);
}

/** id → display name lookups for the small reference tables. Cached 5 min. */
const getDomainNameMap = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from(C15T_DOMAIN).select("id, name");
    if (error) {
      console.error("[consent] domain map lookup failed", error.message);
      return {};
    }
    const map: Record<string, string> = {};
    for (const row of (data ?? []) as { id: string; name: string }[]) {
      map[row.id] = row.name;
    }
    return map;
  },
  ["c15t-domain-map"],
  { revalidate: 300, tags: [CONSENT_CACHE_TAG] },
);

const getPolicyLabelMap = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(C15T_POLICY)
      .select("id, version, type");
    if (error) {
      console.error("[consent] policy map lookup failed", error.message);
      return {};
    }
    const map: Record<string, string> = {};
    for (const row of (data ?? []) as {
      id: string;
      version: string;
      type: string;
    }[]) {
      // e.g. "cookie_banner v1" — type carries the policy kind, version the rev.
      map[row.id] = [row.type, row.version].filter(Boolean).join(" ");
    }
    return map;
  },
  ["c15t-policy-map"],
  { revalidate: 300, tags: [CONSENT_CACHE_TAG] },
);

interface C15tConsentBreakdownRow {
  id: string;
  userAgent: string | null;
  uiSource: string | null;
  domainId: string | null;
  policyId: string | null;
  runtimePolicyDecisionId: string | null;
}

interface C15tDecisionRow {
  id: string;
  countryCode: string | null;
  language: string | null;
}

const EMPTY_BREAKDOWNS: ConsentBreakdowns = {
  sessions: 0,
  devices: [],
  browsers: [],
  operatingSystems: [],
  countries: [],
  languages: [],
  uiSources: [],
  domains: [],
  policies: [],
};

/** Ranked breakdowns for the active window. Cached per (startIso, endIso) for
 *  30s — same cadence as getConsentRowsInRange so a window change refreshes
 *  the tiles, chart, and breakdowns together. */
export const getConsentBreakdownsInRange = unstable_cache(
  async (startIso: string, endIso: string): Promise<ConsentBreakdowns> => {
    const supabase = getSupabaseAdmin();
    const [domainMap, policyMap] = await Promise.all([
      getDomainNameMap(),
      getPolicyLabelMap(),
    ]);

    const { data: consentData, error: consentErr } = await supabase
      .from(C15T_CONSENT)
      .select("id, userAgent, uiSource, domainId, policyId, runtimePolicyDecisionId")
      .gte("givenAt", startIso)
      .lte("givenAt", endIso)
      .limit(FETCH_LIMIT);
    if (consentErr) {
      console.error("[consent] breakdown lookup failed", consentErr.message);
      return EMPTY_BREAKDOWNS;
    }
    const consents = (consentData ?? []) as C15tConsentBreakdownRow[];

    // Policy decisions in the same window → country/language per consent, and
    // the session count. Keyed by id so each consent resolves its own geo.
    const { data: decisionData } = await supabase
      .from(C15T_DECISION)
      .select("id, countryCode, language")
      .gte("createdAt", startIso)
      .lte("createdAt", endIso)
      .limit(FETCH_LIMIT);
    const decisions = (decisionData ?? []) as C15tDecisionRow[];
    const decisionMap = new Map<string, C15tDecisionRow>();
    for (const d of decisions) decisionMap.set(d.id, d);

    const parsed = consents.map((c) => {
      const ua = parseUserAgent(c.userAgent);
      const decision = c.runtimePolicyDecisionId
        ? decisionMap.get(c.runtimePolicyDecisionId)
        : undefined;
      return { c, ua, decision };
    });

    return {
      sessions: decisions.length,
      devices: rank(parsed.map((p) => ({ value: p.ua.device }))),
      browsers: rank(parsed.map((p) => ({ value: p.ua.browser }))),
      operatingSystems: rank(parsed.map((p) => ({ value: p.ua.os }))),
      countries: rank(
        parsed.map((p) => {
          const code = p.decision?.countryCode ?? null;
          return { value: code, label: code ? safeRegion(code) : undefined };
        }),
      ),
      languages: rank(
        parsed.map((p) => {
          const code = p.decision?.language ?? null;
          return { value: code, label: code ? safeLanguage(code) : undefined };
        }),
      ),
      uiSources: rank(
        parsed.map((p) => ({
          value: p.c.uiSource,
          // Title-case the surface name (banner → Banner, dialog → Dialog).
          label: p.c.uiSource
            ? p.c.uiSource.charAt(0).toUpperCase() + p.c.uiSource.slice(1)
            : undefined,
        })),
      ),
      domains: rank(
        parsed.map((p) => ({
          value: p.c.domainId,
          label: p.c.domainId ? (domainMap[p.c.domainId] ?? p.c.domainId) : undefined,
        })),
      ),
      policies: rank(
        parsed.map((p) => ({
          value: p.c.policyId,
          label: p.c.policyId ? (policyMap[p.c.policyId] ?? p.c.policyId) : undefined,
        })),
      ),
    };
  },
  ["c15t-consent-breakdowns"],
  { revalidate: 30, tags: [CONSENT_CACHE_TAG] },
);
