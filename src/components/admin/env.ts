/**
 * Admin environment types — shared across every admin dashboard
 * that filters by deployment env (consent, feedback, future).
 *
 * The concrete env values are written into each table's
 * `environment` column at insert time by mapping VERCEL_ENV:
 *   "production" → "production"
 *   "preview"    → "staging"
 *   else         → "development"
 *
 * The dashboard's UI filter also accepts "all" to skip filtering
 * — that's the EnvFilter type (vs Environment which only has the
 * three concrete values).
 */

export type Environment = "production" | "staging" | "development";

/** Dashboard filter value — concrete env name or "all" to skip filtering. */
export type EnvFilter = Environment | "all";
