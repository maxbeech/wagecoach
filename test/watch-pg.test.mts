import { eq, ok, report } from "./_assert.mts";

// The real Postgres store, against a disposable local database. Runs only when
// TEST_DATABASE_URL is set (see README, "Local database"); otherwise it says so
// and passes, because CI and a plain `npm test` have no database.
const url = process.env.TEST_DATABASE_URL;
if (!url) {
  console.log("⏭  watch-pg: skipped (set TEST_DATABASE_URL to run against Postgres)");
  process.exit(0);
}
process.env.DATABASE_URL = url;
const { pgStore } = await import("../lib/watch-store.ts");
const { db } = await import("../lib/db.ts");
const sql = db()!;
const store = pgStore()!;
const email = `pg-test-${Date.now()}@example.test`;

const { watcher, token } = await store.upsert(email, ["state:CA"]);
eq((await store.byToken(token))?.id, watcher.id, "find by token");
eq((await store.byToken("x".repeat(32))), null, "unknown token is null");
const again = await store.upsert(email.toUpperCase(), ["state:NY"]);
eq(again.watcher.id, watcher.id, "email match is case-insensitive");
eq((await store.byToken(token)), null, "re-upsert rotates the token");
await store.confirm(watcher.id);
ok((await store.byId(watcher.id))!.confirmedAt instanceof Date, "confirmed");
await store.setSubscription(watcher.id, { plan: "watch", stripeCustomer: "cus_pg", stripeSubscription: `sub_pg_${Date.now()}`, subscriptionStatus: "active" });
const paid = (await store.byId(watcher.id))!;
eq(paid.plan, "watch", "plan stored");
await store.upsert(email, ["state:TX"]);
eq((await store.byId(watcher.id))!.locations.join(), "state:NY", "a paying subscriber keeps their places on re-signup");
eq(await store.markSent(watcher.id, "k", 7), true, "first mark claims");
eq(await store.markSent(watcher.id, "k", 7), false, "second mark is a duplicate");
await store.unmarkSent(watcher.id, "k", 7);
eq(await store.markSent(watcher.id, "k", 7), true, "unmark gives the claim back");
ok((await store.listActive()).some((w) => w.id === watcher.id), "active list includes the confirmed subscriber");
await store.unsubscribe(watcher.id);
ok(!(await store.listActive()).some((w) => w.id === watcher.id), "unsubscribed drops out");
await store.upsert(email, ["state:CA"]);
eq((await store.byId(watcher.id))!.confirmedAt, null, "re-subscribing after unsubscribe needs a new confirmation");
const t = await store.rotateToken(watcher.id);
eq((await store.byToken(t))?.id, watcher.id, "rotated token works");

await sql`DELETE FROM watchers WHERE id = ${watcher.id}`;
await sql.end();
report("watch-pg");
