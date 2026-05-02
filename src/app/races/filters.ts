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
  /** Country name — exact match against the race's country field. */
  country?: string;
  /** City name — exact match against the race's city field. */
  city?: string;
  /** State / region — exact match against the race's stateRegion field. */
  state?: string;
  /** Surface — one of Road / Trail / Track / Mountain / Mixed. */
  surface?: string;
  /** Lower bound on race price, expressed in USD. The race's
   *  stored price gets converted to USD at query time via the
   *  GROQ select() in raceIndexQuery. */
  priceMin?: number;
  /** Upper bound on race price, in USD (see priceMin). */
  priceMax?: number;
  /** Lower bound on elevation gain, in meters (canonical store
   *  unit in Sanity). */
  elevationMin?: number;
  /** Upper bound on elevation gain, in meters. */
  elevationMax?: number;
  /** Lower bound on average race-day temperature, in Celsius. */
  temperatureMin?: number;
  /** Upper bound on average race-day temperature, in Celsius. */
  temperatureMax?: number;
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
  const country = getParam(sp, "country")?.trim();
  if (country) filters.country = country;
  const city = getParam(sp, "city")?.trim();
  if (city) filters.city = city;
  const state = getParam(sp, "state")?.trim();
  if (state) filters.state = state;
  const surface = getParam(sp, "surface")?.trim();
  if (surface) filters.surface = surface;
  const priceMin = getNumberParam(sp, "priceMin");
  if (priceMin != null) filters.priceMin = priceMin;
  const priceMax = getNumberParam(sp, "priceMax");
  if (priceMax != null) filters.priceMax = priceMax;
  const elevationMin = getNumberParam(sp, "elevationMin");
  if (elevationMin != null) filters.elevationMin = elevationMin;
  const elevationMax = getNumberParam(sp, "elevationMax");
  if (elevationMax != null) filters.elevationMax = elevationMax;
  const temperatureMin = getNumberParam(sp, "temperatureMin");
  if (temperatureMin != null) filters.temperatureMin = temperatureMin;
  const temperatureMax = getNumberParam(sp, "temperatureMax");
  if (temperatureMax != null) filters.temperatureMax = temperatureMax;
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
  if (filters.country) params.set("country", filters.country);
  if (filters.city) params.set("city", filters.city);
  if (filters.state) params.set("state", filters.state);
  if (filters.surface) params.set("surface", filters.surface);
  if (filters.priceMin != null)
    params.set("priceMin", String(filters.priceMin));
  if (filters.priceMax != null)
    params.set("priceMax", String(filters.priceMax));
  if (filters.elevationMin != null)
    params.set("elevationMin", String(filters.elevationMin));
  if (filters.elevationMax != null)
    params.set("elevationMax", String(filters.elevationMax));
  if (filters.temperatureMin != null)
    params.set("temperatureMin", String(filters.temperatureMin));
  if (filters.temperatureMax != null)
    params.set("temperatureMax", String(filters.temperatureMax));
  return params;
}

export function hasActiveFilters(filters: RaceFilters): boolean {
  return Boolean(
    filters.q ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.distanceMin != null ||
      filters.distanceMax != null ||
      filters.country ||
      filters.city ||
      filters.state ||
      filters.surface ||
      filters.priceMin != null ||
      filters.priceMax != null ||
      filters.elevationMin != null ||
      filters.elevationMax != null ||
      filters.temperatureMin != null ||
      filters.temperatureMax != null,
  );
}

export interface RaceQueryParams {
  qWild: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  distanceMin: number | null;
  distanceMax: number | null;
  country: string | null;
  city: string | null;
  state: string | null;
  surface: string | null;
  priceMin: number | null;
  priceMax: number | null;
  elevationMin: number | null;
  elevationMax: number | null;
  temperatureMin: number | null;
  temperatureMax: number | null;
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
  // eventDate in Sanity is `datetime` (stores like
  // "2026-05-31T08:00:00.000Z"). GROQ string comparison is
  // lexicographic, so a bare upper bound "2026-05-31" sorts BEFORE
  // any "2026-05-31T..." value and filters out races on the
  // boundary day. Extending dateTo to end-of-UTC-day fixes the
  // boundary; we extend dateFrom to start-of-UTC-day for symmetry.
  return {
    qWild,
    dateFrom: filters.dateFrom ? `${filters.dateFrom}T00:00:00.000Z` : null,
    dateTo: filters.dateTo ? `${filters.dateTo}T23:59:59.999Z` : null,
    distanceMin: filters.distanceMin ?? null,
    distanceMax: filters.distanceMax ?? null,
    country: filters.country ?? null,
    city: filters.city ?? null,
    state: filters.state ?? null,
    surface: filters.surface ?? null,
    priceMin: filters.priceMin ?? null,
    priceMax: filters.priceMax ?? null,
    elevationMin: filters.elevationMin ?? null,
    elevationMax: filters.elevationMax ?? null,
    temperatureMin: filters.temperatureMin ?? null,
    temperatureMax: filters.temperatureMax ?? null,
  };
}
