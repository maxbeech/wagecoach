import { createHash, randomBytes } from "node:crypto";
import { db } from "./db";

// Storage for Wage Watch subscribers. The interface is what the service layer
// (lib/watch-service.ts) and the tests use; `pgStore` is the real one and
// `memoryStore` exists so every rule can be tested without a database.
//
// The manage link carries a random token. Only its sha256 is stored, so a leaked
// database row cannot be turned back into someone's link.

export interface Watcher {
  id: string;
  email: string;
  locations: string[];
  plan: "free" | "watch";
  confirmedAt: Date | null;
  unsubscribedAt: Date | null;
  stripeCustomer: string | null;
  stripeSubscription: string | null;
  subscriptionStatus: string | null;
}

export interface SubscriptionUpdate {
  plan: "free" | "watch";
  stripeCustomer?: string | null;
  stripeSubscription?: string | null;
  subscriptionStatus: string | null;
}

/**
 * What a signup did. The signup form is unauthenticated, so it may never change
 * an active subscriber: for one of those it only issues a pending link, emailed
 * to them, that becomes their real link when they use it.
 *   new        first signup; confirm by email
 *   reconfirm  unconfirmed or unsubscribed row restarted; confirm by email
 *   link       already active; nothing changed, a new manage link is mailed
 *   throttled  mailed under a minute ago; nothing changed, nothing to send
 */
export type SignupKind = "new" | "reconfirm" | "link" | "throttled";
export const SIGNUP_THROTTLE_SECONDS = 60;

export interface WatchStore {
  signup(email: string, locations: string[]): Promise<{ watcher: Watcher; token: string | null; kind: SignupKind }>;
  /** Issue a new token for an existing subscriber (used for links in alert emails). */
  rotateToken(id: string): Promise<string>;
  byToken(token: string): Promise<Watcher | null>;
  byId(id: string): Promise<Watcher | null>;
  bySubscription(subscriptionId: string): Promise<Watcher | null>;
  confirm(id: string): Promise<void>;
  setLocations(id: string, locations: string[]): Promise<void>;
  unsubscribe(id: string): Promise<void>;
  setSubscription(id: string, update: SubscriptionUpdate): Promise<void>;
  /** Confirmed, not unsubscribed. */
  listActive(): Promise<Watcher[]>;
  /** True when this call recorded the alert; false when it was already sent. */
  markSent(watcherId: string, changeKey: string, leadDays: number): Promise<boolean>;
  /** Undo a mark when the send failed, so tomorrow's run tries again. */
  unmarkSent(watcherId: string, changeKey: string, leadDays: number): Promise<void>;
}

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
export const newToken = () => randomBytes(24).toString("base64url");
/** Tokens are 32 url-safe characters; anything else never reaches the database. */
export const isTokenShape = (t: unknown): t is string => typeof t === "string" && /^[A-Za-z0-9_-]{32}$/.test(t);

type Row = {
  id: string; email: string; locations: string[]; plan: "free" | "watch"; pending_token_hash?: string | null;
  confirmed_at: Date | null; unsubscribed_at: Date | null;
  stripe_customer: string | null; stripe_subscription: string | null; subscription_status: string | null;
};
const toWatcher = (r: Row): Watcher => ({
  id: r.id, email: r.email, locations: r.locations ?? [], plan: r.plan,
  confirmedAt: r.confirmed_at, unsubscribedAt: r.unsubscribed_at,
  stripeCustomer: r.stripe_customer, stripeSubscription: r.stripe_subscription, subscriptionStatus: r.subscription_status,
});

/** The Postgres store, or null when DATABASE_URL is not set. */
export function pgStore(): WatchStore | null {
  const sql = db();
  if (!sql) return null;
  const one = async (rows: Promise<Row[]>) => { const [r] = await rows; return r ? toWatcher(r) : null; };
  return {
    async signup(email, locations) {
      const token = newToken();
      const h = hashToken(token);
      return sql.begin(async (tx) => {
        const [cur] = await tx<(Row & { recent: boolean })[]>`
          SELECT *, last_mailed_at > now() - make_interval(secs => ${SIGNUP_THROTTLE_SECONDS}) AS recent
          FROM watchers WHERE lower(email) = lower(${email}) FOR UPDATE`;
        if (!cur) {
          const [r] = await tx<Row[]>`INSERT INTO watchers (email, token_hash, locations, last_mailed_at)
            VALUES (${email}, ${h}, ${locations}, now()) RETURNING *`;
          return { watcher: toWatcher(r), token, kind: "new" as const };
        }
        if (cur.recent) return { watcher: toWatcher(cur), token: null, kind: "throttled" as const };
        if (cur.confirmed_at && !cur.unsubscribed_at) {
          const [r] = await tx<Row[]>`UPDATE watchers SET pending_token_hash = ${h}, last_mailed_at = now() WHERE id = ${cur.id} RETURNING *`;
          return { watcher: toWatcher(r), token, kind: "link" as const };
        }
        const [r] = await tx<Row[]>`UPDATE watchers SET token_hash = ${h}, pending_token_hash = NULL,
            locations = CASE WHEN plan = 'watch' THEN locations ELSE ${locations} END,
            confirmed_at = NULL, unsubscribed_at = NULL, last_mailed_at = now(), updated_at = now()
          WHERE id = ${cur.id} RETURNING *`;
        return { watcher: toWatcher(r), token, kind: "reconfirm" as const };
      });
    },
    async rotateToken(id) {
      const token = newToken();
      await sql`UPDATE watchers SET token_hash = ${hashToken(token)}, pending_token_hash = NULL, updated_at = now() WHERE id = ${id}`;
      return token;
    },
    async byToken(token) {
      const h = hashToken(token);
      // A pending link (from a repeat signup) becomes the live link the first time it is used.
      const [r] = await sql<Row[]>`
        UPDATE watchers SET token_hash = ${h}, pending_token_hash = NULL, updated_at = now()
        WHERE pending_token_hash = ${h} RETURNING *`;
      if (r) return toWatcher(r);
      return one(sql<Row[]>`SELECT * FROM watchers WHERE token_hash = ${h}`);
    },
    byId: (id) => one(sql<Row[]>`SELECT * FROM watchers WHERE id = ${id}`),
    bySubscription: (s) => one(sql<Row[]>`SELECT * FROM watchers WHERE stripe_subscription = ${s}`),
    async confirm(id) { await sql`UPDATE watchers SET confirmed_at = coalesce(confirmed_at, now()), updated_at = now() WHERE id = ${id}`; },
    async setLocations(id, locations) { await sql`UPDATE watchers SET locations = ${locations}, updated_at = now() WHERE id = ${id}`; },
    async unsubscribe(id) { await sql`UPDATE watchers SET unsubscribed_at = now(), updated_at = now() WHERE id = ${id}`; },
    async setSubscription(id, u) {
      await sql`UPDATE watchers SET plan = ${u.plan},
        stripe_customer = coalesce(${u.stripeCustomer ?? null}, stripe_customer),
        stripe_subscription = coalesce(${u.stripeSubscription ?? null}, stripe_subscription),
        subscription_status = ${u.subscriptionStatus}, updated_at = now() WHERE id = ${id}`;
    },
    async listActive() {
      const rows = await sql<Row[]>`SELECT * FROM watchers WHERE confirmed_at IS NOT NULL AND unsubscribed_at IS NULL`;
      return rows.map(toWatcher);
    },
    async markSent(watcherId, changeKey, leadDays) {
      const rows = await sql`INSERT INTO watch_alerts_sent (watcher_id, change_key, lead_days)
        VALUES (${watcherId}, ${changeKey}, ${leadDays}) ON CONFLICT DO NOTHING RETURNING watcher_id`;
      return rows.length === 1;
    },
    async unmarkSent(watcherId, changeKey, leadDays) {
      await sql`DELETE FROM watch_alerts_sent WHERE watcher_id = ${watcherId} AND change_key = ${changeKey} AND lead_days = ${leadDays}`;
    },
  };
}

/** In-memory store with the same rules, for tests. */
type MemRow = Watcher & { tokenHash: string; pendingHash: string | null; lastMailed: number };
export function memoryStore(now: () => number = Date.now): WatchStore & { rows: Map<string, MemRow>; sent: Set<string> } {
  const rows = new Map<string, MemRow>();
  const sent = new Set<string>();
  let n = 0;
  const find = (pred: (w: MemRow) => boolean) => {
    for (const w of rows.values()) if (pred(w)) return strip(w);
    return null;
  };
  const strip = (row: MemRow): Watcher => {
    const { tokenHash, pendingHash, lastMailed, ...w } = row;
    void tokenHash; void pendingHash; void lastMailed;
    return { ...w, locations: [...w.locations] };
  };
  return {
    rows, sent,
    async signup(email, locations) {
      const token = newToken();
      const cur = [...rows.values()].find((w) => w.email.toLowerCase() === email.toLowerCase());
      if (!cur) {
        const w: MemRow = { id: `w${++n}`, email, locations: [...locations], plan: "free", confirmedAt: null, unsubscribedAt: null, stripeCustomer: null, stripeSubscription: null, subscriptionStatus: null, tokenHash: hashToken(token), pendingHash: null, lastMailed: now() };
        rows.set(w.id, w);
        return { watcher: strip(w), token, kind: "new" };
      }
      if (now() - cur.lastMailed < SIGNUP_THROTTLE_SECONDS * 1000) return { watcher: strip(cur), token: null, kind: "throttled" };
      cur.lastMailed = now();
      if (cur.confirmedAt && !cur.unsubscribedAt) { cur.pendingHash = hashToken(token); return { watcher: strip(cur), token, kind: "link" }; }
      if (cur.plan !== "watch") cur.locations = [...locations];
      Object.assign(cur, { tokenHash: hashToken(token), pendingHash: null, confirmedAt: null, unsubscribedAt: null });
      return { watcher: strip(cur), token, kind: "reconfirm" };
    },
    async rotateToken(id) { const t = newToken(); const w = rows.get(id); if (w) { w.tokenHash = hashToken(t); w.pendingHash = null; } return t; },
    async byToken(t) {
      const h = hashToken(t);
      const pending = [...rows.values()].find((w) => w.pendingHash === h);
      if (pending) { pending.tokenHash = h; pending.pendingHash = null; }
      return find((w) => w.tokenHash === h);
    },
    byId: async (id) => find((w) => w.id === id),
    bySubscription: async (s) => find((w) => w.stripeSubscription === s),
    async confirm(id) { const w = rows.get(id); if (w && !w.confirmedAt) w.confirmedAt = new Date(); },
    async setLocations(id, l) { const w = rows.get(id); if (w) w.locations = [...l]; },
    async unsubscribe(id) { const w = rows.get(id); if (w) w.unsubscribedAt = new Date(); },
    async setSubscription(id, u) {
      const w = rows.get(id); if (!w) return;
      w.plan = u.plan; w.subscriptionStatus = u.subscriptionStatus;
      if (u.stripeCustomer) w.stripeCustomer = u.stripeCustomer;
      if (u.stripeSubscription) w.stripeSubscription = u.stripeSubscription;
    },
    listActive: async () => [...rows.values()].filter((w) => w.confirmedAt && !w.unsubscribedAt).map(strip),
    async markSent(id, k, l) { const key = `${id}|${k}|${l}`; if (sent.has(key)) return false; sent.add(key); return true; },
    async unmarkSent(id, k, l) { sent.delete(`${id}|${k}|${l}`); },
  };
}
