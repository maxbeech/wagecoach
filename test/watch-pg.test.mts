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

const backdate = (id: string) => sql`UPDATE watchers SET last_mailed_at = now() - interval '2 minutes' WHERE id = ${id}`;
const first = await store.signup(email, ["state:CA"]);
const { watcher, token } = first;
eq(first.kind, "new", "first signup is new");
eq((await store.byToken(token!))?.id, watcher.id, "find by token");
eq((await store.byToken("x".repeat(32))), null, "unknown token is null");
eq((await store.signup(email, ["state:NY"])).kind, "throttled", "a second signup within a minute is throttled");
await backdate(watcher.id);
const again = await store.signup(email.toUpperCase(), ["state:NY"]);
eq(again.watcher.id, watcher.id, "email match is case-insensitive");
eq(again.kind, "reconfirm", "unconfirmed row restarts");
eq((await store.byToken(token!)), null, "restart rotates the token");
const live1 = again.token!;
await store.confirm(watcher.id);
await backdate(watcher.id);
const stranger = await store.signup(email, ["state:FL"]);
eq(stranger.kind, "link", "a signup for an active subscriber only issues a link");
eq((await store.byId(watcher.id))!.locations.join(), "state:NY", "a stranger's signup does not change places");
eq((await store.byToken(live1))?.id, watcher.id, "the existing link keeps working");
eq((await store.byToken(stranger.token!))?.id, watcher.id, "the mailed link works when used");
eq((await store.byToken(live1)), null, "using the new link retires the old one");
ok((await store.byId(watcher.id))!.confirmedAt instanceof Date, "confirmed");
await store.setSubscription(watcher.id, { plan: "watch", stripeCustomer: "cus_pg", stripeSubscription: `sub_pg_${Date.now()}`, subscriptionStatus: "active" });
const paid = (await store.byId(watcher.id))!;
eq(paid.plan, "watch", "plan stored");
await backdate(watcher.id);
await store.signup(email, ["state:TX"]);
eq((await store.byId(watcher.id))!.locations.join(), "state:NY", "a paying subscriber keeps their places on re-signup");
eq(await store.markSent(watcher.id, "k", 7), true, "first mark claims");
eq(await store.markSent(watcher.id, "k", 7), false, "second mark is a duplicate");
await store.unmarkSent(watcher.id, "k", 7);
eq(await store.markSent(watcher.id, "k", 7), true, "unmark gives the claim back");
ok((await store.listActive()).some((w) => w.id === watcher.id), "active list includes the confirmed subscriber");
await store.unsubscribe(watcher.id);
ok(!(await store.listActive()).some((w) => w.id === watcher.id), "unsubscribed drops out");
await backdate(watcher.id);
await store.signup(email, ["state:CA"]);
eq((await store.byId(watcher.id))!.confirmedAt, null, "re-subscribing after unsubscribe needs a new confirmation");
const t = await store.rotateToken(watcher.id);
eq((await store.byToken(t))?.id, watcher.id, "rotated token works");

const { pgLedger } = await import("../lib/event-ledger.ts");
const ledger = pgLedger()!;
const evt = `evt_pg_${Date.now()}`;
eq(await ledger.claim(evt), true, "ledger claims a new event");
eq(await ledger.claim(evt), false, "ledger refuses a repeat");
await ledger.release(evt);
eq(await ledger.claim(evt), true, "released event can be claimed again");
await sql`DELETE FROM stripe_events WHERE event_id = ${evt}`;

await sql`DELETE FROM watchers WHERE id = ${watcher.id}`;
await sql.end();
report("watch-pg");
