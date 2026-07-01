// Shared parser for the admin dashboards' `?f=dim:val` breakdown filters.
// Consent and feedback previously each carried an identical copy of this loop;
// this is the single source of truth. Each dashboard supplies its own dim-key
// allowlist guard, keeping the validated key type dashboard-specific.

/** One active filter: a validated dimension key + its selected value. */
export interface FilterParam<K extends string> {
  dim: K;
  val: string;
}

/**
 * Parse repeated `?f=dim:val` params into validated filters — one per
 * dimension (later entry wins). Splits on the FIRST ":" (dim keys never
 * contain one; values may, e.g. a page path). `isDimKey` is the per-dashboard
 * allowlist guard; entries with an unknown dim or an empty value are dropped.
 */
export function parseFilterParams<K extends string>(
  raw: string | string[] | undefined,
  isDimKey: (x: string | undefined) => x is K,
): FilterParam<K>[] {
  if (raw == null) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  const byDim = new Map<K, string>();
  for (const entry of list) {
    const idx = entry.indexOf(":");
    if (idx < 1) continue;
    const dim = entry.slice(0, idx);
    const val = entry.slice(idx + 1);
    if (!isDimKey(dim) || !val) continue;
    byDim.set(dim, val);
  }
  return [...byDim.entries()].map(([dim, val]) => ({ dim, val }));
}
