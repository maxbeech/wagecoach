// Remembers which Stripe event ids the webhook has already acted on. Stripe says
// a webhook endpoint "might occasionally receive the same event more than once"
// and tells integrations to log processed event ids and skip repeats
// (https://docs.stripe.com/webhooks, Handle duplicate events).
//
// WHAT THIS IS NOT. This is a per-process memory set. It stops a repeat that lands
// on the same running instance, which covers Stripe's quick retries, but it forgets
// everything on restart and is not shared between instances. A durable ledger needs
// a table, and this product has no database on purpose, so none is invented here.
// The proposed table is in the README. The webhook's one side effect, the email,
// is made safe for repeats separately: it is sent with an idempotency key derived
// from the session id, so a repeat the ledger misses still cannot send a second mail.

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

/** The ledger the webhook route uses. Swap this one line when a table exists. */
export const processLedger: EventLedger = memoryLedger();
