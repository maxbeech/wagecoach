import { db } from "./db";

// Remembers which Stripe event ids the webhook has already acted on. Stripe says
// a webhook endpoint "might occasionally receive the same event more than once"
// and tells integrations to log processed event ids and skip repeats
// (https://docs.stripe.com/webhooks, Handle duplicate events).
//
// Two implementations. `pgLedger` is durable: it claims an event by inserting into
// the `stripe_events` table (db/schema.sql), so a repeat is skipped across restarts
// and instances. It is used whenever DATABASE_URL is set. `memoryLedger` is the
// fallback (and what tests use): it stops a repeat on the same running instance
// only. Either way the Pro report email also carries an idempotency key, so a
// repeat the ledger misses still cannot send a second mail.

export interface EventLedger {
  /** True when this call claimed the event, false when it was already claimed. */
  claim(eventId: string): Promise<boolean>;
  /** Give the claim back so Stripe's retry of a failed event is processed, not skipped. */
  release(eventId: string): Promise<void>;
}

export function memoryLedger(limit = 1000): EventLedger {
  const seen = new Set<string>();
  return {
    async claim(eventId) {
      if (seen.has(eventId)) return false;
      seen.add(eventId);
      if (seen.size > limit) {
        const oldest = seen.values().next().value;
        if (oldest !== undefined) seen.delete(oldest);
      }
      return true;
    },
    async release(eventId) {
      seen.delete(eventId);
    },
  };
}

/** Durable ledger on Postgres: claim = insert (conflict = already handled), release = delete. */
export function pgLedger(): EventLedger | null {
  const sql = db();
  if (!sql) return null;
  return {
    async claim(eventId) {
      const rows = await sql`INSERT INTO stripe_events (event_id) VALUES (${eventId}) ON CONFLICT DO NOTHING RETURNING event_id`;
      return rows.length === 1;
    },
    async release(eventId) {
      await sql`DELETE FROM stripe_events WHERE event_id = ${eventId}`;
    },
  };
}

/** The ledger the webhook route uses: Postgres when configured, otherwise in-process memory. */
export const processLedger: EventLedger = {
  claim: (id) => (pgLedger() ?? fallback).claim(id),
  release: (id) => (pgLedger() ?? fallback).release(id),
};
const fallback = memoryLedger();
