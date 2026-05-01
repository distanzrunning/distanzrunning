// src/app/races/filters.ts
//
// Filter state lives in the URL. This module is the single bridge
// between Next.js searchParams and the typed RaceFilters object —
// page.tsx parses, FiltersShell builds, raceIndexQuery consumes via
// buildQueryParams.
//
// New filter keys get added in three places:
//   1. RaceFilters interface (the typed shape)
//   2. parseFilters / buildFilterParams (URL <-> object)
//   3. buildQueryParams (object -> GROQ params) and the predicate
//      fragment in raceIndexQuery

export interface RaceFilters {
  /** Free-text search across title / city / country. */
  q?: string;
  /** ISO date string — lower bound on eventDate (inclusive). */
  dateFrom?: string;
  /** ISO date string — upper bound on eventDate (inclusive). */
  dateTo?: string;
  /** Lower bound on race distance, in km. */
  distanceMin?: number;
  /** Upper bound on race distance, in km. */
  distanceMax?: number;
}

type SearchParamsLike =
  | URLSearchParams
  | { [key: string]: string | string[] | undefined };

function getParam(sp: SearchParamsLike, key: string): string | undefined {
  if (sp instanceof URLSearchParams) {
    return sp.get(key) ?? undefined;
  }
  const v = sp[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0];
  return undefined;
}

function getNumberParam(
  sp: SearchParamsLike,
  key: string,
): number | undefined {
  const raw = getParam(sp, key);
  if (raw == null) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function parseFilters(sp: SearchParamsLike): RaceFilters {
  const filters: RaceFilters = {};
  const q = getParam(sp, "q")?.trim();
  if (q) filters.q = q;
  const dateFrom = getParam(sp, "dateFrom");
  if (dateFrom) filters.dateFrom = dateFrom;
  const dateTo = getParam(sp, "dateTo");
  if (dateTo) filters.dateTo = dateTo;
  const distanceMin = getNumberParam(sp, "distanceMin");
  if (distanceMin != null) filters.distanceMin = distanceMin;
  const distanceMax = getNumberParam(sp, "distanceMax");
  if (distanceMax != null) filters.distanceMax = distanceMax;
  return filters;
}

export function buildFilterParams(filters: RaceFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.distanceMin != null)
    params.set("distanceMin", String(filters.distanceMin));
  if (filters.distanceMax != null)
    params.set("distanceMax", String(filters.distanceMax));
  return params;
}

export function hasActiveFilters(filters: RaceFilters): boolean {
  return Boolean(
    filters.q ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.distanceMin != null ||
      filters.distanceMax != null,
  );
}

export interface RaceQueryParams {
  qWild: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  distanceMin: number | null;
  distanceMax: number | null;
}

/**
 * Translates the user-facing filters into GROQ-friendly parameters.
 * The query uses `!defined($x)` predicates so we always pass every
 * key — null means "skip this predicate" rather than "match nothing".
 */
export function buildQueryParams(filters: RaceFilters): RaceQueryParams {
  const trimmed = filters.q?.trim();
  // GROQ `match` is a token-prefix operator. Appending * to each
  // whitespace-split token makes the search behave like a
  // contains-prefix match across multiple words.
  const qWild = trimmed
    ? trimmed
        .split(/\s+/)
        .map((token) => `${token}*`)
        .join(" ")
    : null;
  return {
    qWild,
    dateFrom: filters.dateFrom ?? null,
    dateTo: filters.dateTo ?? null,
    distanceMin: filters.distanceMin ?? null,
    distanceMax: filters.distanceMax ?? null,
  };
}
