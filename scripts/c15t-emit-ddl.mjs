// Emit c15t's full schema DDL OFFLINE (no live database).
//
// Replicates c15t's own migration recipe (see @c15t/backend/dist/core.js):
//   DB.names.prefix(prefix).client(adapter)  →  migrator({ db, schema: 'latest' })
// but points Kysely at a STUB pg pool that returns empty result sets. The
// migrator therefore sees an "empty" database and computes a full CREATE plan,
// which we print via MigrationResult.getSQL() WITHOUT ever calling .execute().
//
// The printed SQL is then applied to Supabase via the MCP apply_migration tool
// (no DB password / no Supabase branch needed).
//
//   node scripts/c15t-emit-ddl.mjs > /tmp/c15t-ddl.sql
import { Kysely, PostgresDialect } from "kysely";
import { DB } from "@c15t/backend/db/schema";
import { kyselyAdapter } from "@c15t/backend/db/adapters/kysely";
import { migrator } from "@c15t/backend/db/migrator";

const EMPTY = { rows: [], rowCount: 0, fields: [], command: "SELECT" };

// Minimal stand-in for a pg Pool/PoolClient. Every query resolves to no rows,
// so introspection concludes the database is empty.
const stubClient = {
  query: async () => EMPTY,
  release: () => {},
};
const stubPool = {
  connect: async () => stubClient,
  query: async () => EMPTY,
  end: async () => {},
  on: () => {},
};

const db = new Kysely({ dialect: new PostgresDialect({ pool: stubPool }) });
const adapter = kyselyAdapter({ db, provider: "postgresql" });
const client = DB.names.prefix("c15t_").client(adapter);

const result = await migrator({ db: client, schema: "latest" });

if (result && typeof result.getSQL === "function") {
  process.stdout.write(result.getSQL());
  process.stderr.write(
    `\n-- emitted ${result.operations?.length ?? "?"} migration operation(s)\n`,
  );
} else {
  process.stderr.write(
    "No getSQL() on result; dumping operations/result as JSON:\n",
  );
  process.stdout.write(JSON.stringify(result, null, 2));
}

await db.destroy();
