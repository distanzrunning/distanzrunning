import { defineConfig } from "@c15t/backend";
import { kyselyAdapter } from "@c15t/backend/db/adapters/kysely";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { baseC15tOptions } from "./src/lib/c15t/options";

// ============================================================================
// c15t migration config — consumed by `@c15t/cli self-host` (migrations).
// ----------------------------------------------------------------------------
// Runs the fumadb migrator that creates/updates c15t's tables (prefixed
// c15t_*). Use the DIRECT Supabase connection string (port 5432, NOT the
// pgbouncer pooler) for DDL. Shares baseC15tOptions with the runtime instance
// so tablePrefix / appName stay in lockstep.
//
//   C15T_MIGRATION_DATABASE_URL=<direct 5432 string> npx @c15t/cli self-host
// ============================================================================

const connectionString =
  process.env.C15T_MIGRATION_DATABASE_URL ??
  process.env.DIRECT_DATABASE_URL ??
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "[c15t] No database connection string for migrations. Set " +
      "C15T_MIGRATION_DATABASE_URL (or DATABASE_URL) to the DIRECT Supabase " +
      "connection string (port 5432, not the pooler) before running migrations.",
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- fumadb types db as Kysely<any>
const db = new Kysely<any>({
  dialect: new PostgresDialect({ pool: new Pool({ connectionString }) }),
});

export default defineConfig({
  ...baseC15tOptions,
  adapter: kyselyAdapter({ db, provider: "postgresql" }),
});
