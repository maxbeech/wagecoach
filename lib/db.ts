import postgres from "postgres";

// One lazily-created Postgres client per server process. Helm7 sets DATABASE_URL
// (pooled) on the production environment; local development points it at the
// container described in README. No URL means no database: callers get null and
// must answer with an explicit "not configured" state, never pretend to work.
// Driver docs: https://github.com/porsager/postgres

type Sql = ReturnType<typeof postgres>;
let client: Sql | null = null;

/**
 * TLS settings for a connection string. Helm7's Postgres is reachable only inside the platform
 * and presents a self-signed certificate, so `sslmode=require` means "encrypt, don't verify"
 * (the libpq meaning). Only an explicit `verify-ca`/`verify-full` turns verification on.
 * Local development (loopback host, no sslmode) stays plain; any other host defaults to encrypted.
 */
export function sslFor(url: string): false | { rejectUnauthorized: boolean } | undefined {
  let mode: string | null = null;
  let host = "";
  try { const u = new URL(url); mode = u.searchParams.get("sslmode"); host = u.hostname; } catch { return undefined; }
  if (mode === "disable") return false;
  if (!mode) return ["127.0.0.1", "localhost", "::1", "[::1]"].includes(host) ? false : { rejectUnauthorized: false };
  if (mode === "verify-ca" || mode === "verify-full") return { rejectUnauthorized: true };
  return { rejectUnauthorized: false };
}

export function db(env: Record<string, string | undefined> = process.env): Sql | null {
  const url = env.DATABASE_URL?.trim();
  if (!url) return null;
  if (!client) {
    client = postgres(url, {
      max: 3,               // a sleeping shared-0.25 service never needs more
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: sslFor(url),
      prepare: false,       // the pooled URL goes through a transaction pooler
    });
  }
  return client;
}
