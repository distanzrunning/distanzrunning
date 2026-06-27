import "server-only";
import { c15tInstance } from "@c15t/backend";
import { kyselyAdapter } from "@c15t/backend/db/adapters/kysely";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { baseC15tOptions } from "./options";

// ============================================================================
// Self-hosted c15t backend (runtime)
// ----------------------------------------------------------------------------
// Mounted by the catch-all route at /api/c15t/[[...path]]. Stores consent in
// OUR Supabase Postgres (data stays on our infra — no consent.io handover).
// Use the POOLED Supabase connection string (port 6543, pgbouncer) here for
// serverless/Vercel; the migration CLI (c15t.config.ts) uses the DIRECT one.
// ============================================================================

const connectionString =
  process.env.C15T_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  // Fail loudly at module load (visible in deploy logs) rather than silently
  // shipping a consent backend with no database — mirrors the CONSENT_IP_SALT
  // guard in the legacy /api/consent route. Branch-scoped on Vercel.
  throw new Error(
    "[c15t] DATABASE_URL (or C15T_DATABASE_URL) is missing. The self-hosted " +
      "consent backend needs a Supabase Postgres connection string (use the " +
      "pooled / pgbouncer string on Vercel). Set it on the deployment.",
  );
}

// fumadb's KyselyConfig types `db` as Kysely<any>; the schema is owned by c15t.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = new Kysely<any>({
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString, max: 5 }),
  }),
});

export const c15t = c15tInstance({
  ...baseC15tOptions,
  adapter: kyselyAdapter({ db, provider: "postgresql" }),
});
