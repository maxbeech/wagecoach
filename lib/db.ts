import postgres from "postgres";

// One lazily-created Postgres client per server process. Helm7 sets DATABASE_URL
// (pooled) on the production environment; local development points it at the
// container described in README. No URL means no database: callers get null and
// must answer with an explicit "not configured" state, never pretend to work.
// Driver docs: https://github.com/porsager/postgres

type Sql = ReturnType<typeof postgres>;
let client: Sql | null = null;

export function db(env: Record<string, string | undefined> = process.env): Sql | null {
  const url = env.DATABASE_URL?.trim();
  if (!url) return null;
  if (!client) {
    client = postgres(url, {
      max: 3,               // a sleeping shared-0.25 service never needs more
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,       // the pooled URL goes through a transaction pooler
    });
  }
  return client;
}
