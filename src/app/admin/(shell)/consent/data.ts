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

interface C15tDecisionRow {
  id: string;
  countryCode: string | null;
  language: string | null;
}

// ============================================================================
// Enriched consents — one fetch feeding BOTH the flat metrics (tiles / chart /
// category bars / recent table) AND the ranked breakdowns, so a click-to-filter
// on any breakdown row can re-scope the WHOLE page. Each record carries the
// projected flat fields PLUS every derived dimension (UA-parsed device/browser/
// OS, decision-joined country/language, uiSource/domain/policy) as both a
// grouping `key` (dims) and a display `label` (dimLabels). Filtering the page is
// then a plain `.filter(matchesScope)` applied before metrics AND ranking.
// ============================================================================

/** Breakdown dimensions a page-wide filter can key on. Values match the
 *  LeaderboardPanel tab ids so a tab is its own filter dimension. */
export type ConsentDimKey =
  | "devices"
  | "browsers"
  | "os"
  | "geography"
  | "languages"
  | "ui"
  | "domains"
  | "policy";

export const CONSENT_DIM_KEYS: ConsentDimKey[] = [
  "devices",
  "browsers",
  "os",
  "geography",
  "languages",
  "ui",
  "domains",
  "policy",
];

/** Human label for the active-filter chip prefix ("Geography: …"). */
export const CONSENT_DIM_LABEL: Record<ConsentDimKey, string> = {
  devices: "Device",
  browsers: "Browser",
  os: "OS",
  geography: "Geography",
  languages: "Language",
  ui: "UI",
  domains: "Domain",
  policy: "Policy",
};

export function isConsentDimKey(x: string | undefined): x is ConsentDimKey {
  return x != null && (CONSENT_DIM_KEYS as string[]).includes(x);
}

export interface EnrichedConsent extends ConsentRowRaw {
  /** Grouping key per dimension (raw code/id/string), null when unknown. */
  dims: Record<ConsentDimKey, string | null>;
  /** Display label per dimension, null when unknown. */
  dimLabels: Record<ConsentDimKey, string | null>;
}

/** Collapse null / "" / "Unknown" to a single null so grouping + filtering
 *  treat every unknown the same way. */
function norm(v: string | null | undefined): string | null {
  if (v == null) return null;
  const t = v.trim();
  return t === "" || t === "Unknown" ? null : t;
}

function titleCase(v: string): string {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

interface C15tEnrichedRow extends C15tConsentRow {
  userAgent: string | null;
  uiSource: string | null;
  domainId: string | null;
  policyId: string | null;
  runtimePolicyDecisionId: string | null;
}

/** Enriched consents within [startIso, endIso] inclusive, newest first. Cached
 *  per (startIso, endIso) for 30s. The dashboard calls this once over the
 *  previous+current union window and slices in-memory, so tiles, chart, and
 *  breakdowns all come from one cached read. Filtering by dimension happens
 *  in-memory in the component (kept out of the cache key). */
export const getEnrichedConsentsInRange = unstable_cache(
  async (startIso: string, endIso: string): Promise<EnrichedConsent[]> => {
    const supabase = getSupabaseAdmin();
    const [purposeCode, domainMap, policyMap] = await Promise.all([
      getPurposeCodeMap(),
      getDomainNameMap(),
      getPolicyLabelMap(),
    ]);

    const { data: consentData, error: consentErr } = await supabase
      .from(C15T_CONSENT)
      .select(
        "id, subjectId, purposeIds, consentAction, givenAt, userAgent, uiSource, domainId, policyId, runtimePolicyDecisionId",
      )
      .gte("givenAt", startIso)
      .lte("givenAt", endIso)
      .order("givenAt", { ascending: false })
      .limit(FETCH_LIMIT);
    if (consentErr) {
      console.error("[consent] enriched lookup failed", consentErr.message);
      return [];
    }
    const consents = (consentData ?? []) as C15tEnrichedRow[];

    // Policy decisions in the same window → country/language per consent,
    // keyed by id so each consent resolves its own geo.
    const { data: decisionData } = await supabase
      .from(C15T_DECISION)
      .select("id, countryCode, language")
      .gte("createdAt", startIso)
      .lte("createdAt", endIso)
      .limit(FETCH_LIMIT);
    const decisionMap = new Map<string, C15tDecisionRow>();
    for (const d of (decisionData ?? []) as C15tDecisionRow[]) {
      decisionMap.set(d.id, d);
    }

    return consents.map((c) => {
      const flat = projectRow(c, purposeCode);
      const ua = parseUserAgent(c.userAgent);
      const decision = c.runtimePolicyDecisionId
        ? decisionMap.get(c.runtimePolicyDecisionId)
        : undefined;

      const device = norm(ua.device);
      const browser = norm(ua.browser);
      const os = norm(ua.os);
      const geo = norm(decision?.countryCode ?? null);
      const lang = norm(decision?.language ?? null);
      const ui = norm(c.uiSource);
      const domainId = norm(c.domainId);
      const policyId = norm(c.policyId);

      return {
        ...flat,
        dims: {
          devices: device,
          browsers: browser,
          os,
          geography: geo,
          languages: lang,
          ui,
          domains: domainId,
          policy: policyId,
        },
        dimLabels: {
          devices: device,
          browsers: browser,
          os,
          geography: geo ? safeRegion(geo) : null,
          languages: lang ? safeLanguage(lang) : null,
          ui: ui ? titleCase(ui) : null,
          domains: domainId ? (domainMap[domainId] ?? domainId) : null,
          policy: policyId ? (policyMap[policyId] ?? policyId) : null,
        },
      };
    });
  },
  ["c15t-consent-enriched"],
  { revalidate: 30, tags: [CONSENT_CACHE_TAG] },
);

/** A single active breakdown filter: dim = the dimension, val = the selected
 *  row's grouping key (e.g. {dim:"geography", val:"GB"}). */
export interface ConsentFilter {
  dim: ConsentDimKey;
  val: string;
}

/** Parse repeated `?f=dim:val` params into validated filters — one per
 *  dimension (later wins), so you can stack Desktop + United Kingdom but not
 *  two countries. Split on the first ":" (dims never contain one). */
export function parseFilters(
  raw: string | string[] | undefined,
): ConsentFilter[] {
  if (raw == null) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  const byDim = new Map<ConsentDimKey, string>();
  for (const entry of list) {
    const idx = entry.indexOf(":");
    if (idx < 1) continue;
    const dim = entry.slice(0, idx);
    const val = entry.slice(idx + 1);
    if (!isConsentDimKey(dim) || !val) continue;
    byDim.set(dim, val);
  }
  return [...byDim.entries()].map(([dim, val]) => ({ dim, val }));
}

/** True when `row` satisfies EVERY active filter (AND across dimensions).
 *  Unknown buckets aren't filterable (funnels are suppressed on them). */
export function matchesFilters(
  row: EnrichedConsent,
  filters: ConsentFilter[],
): boolean {
  return filters.every((f) => row.dims[f.dim] === f.val);
}

/** Rank every dimension of a (already window-scoped, already filter-scoped)
 *  set of enriched consents into the panel-ready ConsentBreakdowns shape. */
export function rankBreakdowns(rows: EnrichedConsent[]): ConsentBreakdowns {
  const per = (dim: ConsentDimKey) =>
    rank(
      rows.map((r) => ({
        value: r.dims[dim],
        label: r.dimLabels[dim] ?? undefined,
      })),
    );
  return {
    // sessions is retired from the UI; kept in the shape for back-compat.
    sessions: 0,
    devices: per("devices"),
    browsers: per("browsers"),
    operatingSystems: per("os"),
    countries: per("geography"),
    languages: per("languages"),
    uiSources: per("ui"),
    domains: per("domains"),
    policies: per("policy"),
  };
}

/** Resolve a filter (dim, val) to its display label for the filter buttons.
 *  Geography/languages resolve via Intl; domain/policy via the cached ref
 *  maps; the rest are their own label. Reliable regardless of the active
 *  window (doesn't depend on the value appearing in the current rows). */
export async function resolveFilterLabel(
  dim: ConsentDimKey,
  val: string,
): Promise<string> {
  switch (dim) {
    case "geography":
      return safeRegion(val);
    case "languages":
      return safeLanguage(val);
    case "ui":
      return titleCase(val);
    case "domains":
      return (await getDomainNameMap())[val] ?? val;
    case "policy":
      return (await getPolicyLabelMap())[val] ?? val;
    default:
      return val;
  }
}
