import { captureServerError, captureServerMessage } from "./observability";
import { processLedger, type EventLedger } from "./event-ledger";
import { userRefFor } from "./openhelm-analytics-mp";
import { sendEmail } from "./openhelm-mail";
import { parseStates } from "./pro-report";
import { buildReportEmail } from "./report-email";
import { publicBaseUrl } from "./site";
import { verifyStripeSignature } from "./stripe-signature";
import { verifyPurchase, type Env, type StripeSession } from "./stripe-purchase";
import { activateFromSession, applySubscriptionEvent, isWatchObject } from "./watch-billing";
import { pgStore, type WatchStore } from "./watch-store";

// Two jobs, routed by what the event is about:
//   - Wage Watch subscriptions (tagged wagecoach_product=wage_watch): upgrade on a
//     completed Checkout, mirror customer.subscription.updated/deleted. See
//     lib/watch-billing.ts.
//   - The retired Pro report's safety net, kept so past buyers still get their link.
//
// Safety net for the Pro report. The buyer normally lands on /pro-report straight
// from Checkout, but a tab closed before the redirect, or a bank payment that
// settles days later, would leave a paid buyer with nothing. Stripe's fulfilment
// guide says webhooks are required for exactly that:
// https://docs.stripe.com/checkout/fulfillment
//
// What it does: when a Pro report payment is confirmed, email the buyer their
// report link. Order of checks, each one cheap to reason about:
//   1. configured?            no  -> 503
//   2. signature on raw body? no  -> 400
//   3. an event we act on?    no  -> 200 ignored
//   4. ask Stripe: paid, one-time payment, OUR price? This endpoint is registered
//      on an ACCOUNT, so it is also sent other products' events. Ownership is the
//      price id and nothing else. Not ours or not paid yet -> 200 ignored.
//   5. event id already handled?  yes -> 200 duplicate
//   6. send the email. Any failure gives the claim back and answers 500, so
//      Stripe retries (up to three days in live mode).

/** The second event covers delayed payment methods, whose session is unpaid when it completes. */
export const FULFIL_EVENTS = ["checkout.session.completed", "checkout.session.async_payment_succeeded"];
/** Subscription lifecycle events, mirrored onto Wage Watch subscribers. */
export const SUBSCRIPTION_EVENTS = ["customer.subscription.updated", "customer.subscription.deleted"];

// Checkout holds the buyer's redirect for up to 10 seconds while it waits for our
// reply, so both outbound calls are bounded to stay well inside that.
const DEFAULT_STRIPE_MS = 4000;
const DEFAULT_MAIL_MS = 4000;

export interface WebhookDeps {
  env: Env;
  fetchImpl: typeof fetch;
  sendMail: typeof sendEmail;
  ledger: EventLedger;
  watchStore: WatchStore | null;
  nowSeconds: () => number;
  stripeMs: number;
  mailMs: number;
}

export interface WebhookReply {
  status: number;
  body: Record<string, unknown>;
}

const reply = (status: number, body: Record<string, unknown>): WebhookReply => ({ status, body });

/** Reasons a verified session is simply not ours to act on. Everything else is a failure worth a retry. */
const NOT_OURS: Record<string, string> = {
  wrong_product: "not_report",
  not_paid: "not_paid",
  wrong_mode: "not_payment_mode",
};

function within<T>(work: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(label)), ms);
  });
  return Promise.race([work, timeout]).finally(() => clearTimeout(timer));
}

/** Email the buyer their link. Returns a failure reason, or null when it went out (or cannot be sent for good). */
async function deliver(sessionId: string, session: StripeSession, eventId: string, d: WebhookDeps): Promise<{ failure: string | null; delivered: boolean }> {
  const email = session.customer_details?.email?.trim();
  if (!email) {
    // A retry cannot add an email address, so this is reported, not retried.
    captureServerMessage("Pro report buyer has no email on the Stripe session", { scope: "stripe_webhook", event_id: eventId });
    return { failure: null, delivered: false };
  }
  const link = `${publicBaseUrl(d.env)}/pro-report?session_id=${encodeURIComponent(sessionId)}`;
  const states = parseStates(session.metadata?.states).map((s) => s.abbr);
  const message = buildReportEmail({ link, states });
  const result = await within(
    d.sendMail({
      to: email,
      ...message,
      // Idempotency key: a repeat of this send returns the first message instead of mailing twice.
      clientId: `pro-report-${await userRefFor(sessionId)}`,
    }),
    d.mailMs,
    "mail_timeout",
  );
  if (!result.sent) return { failure: result.reason === "not_configured" ? "mail_not_configured" : "mail_failed", delivered: false };
  // The inbox is holding the message for a person to release: not delivered.
  if (result.status === "pending_approval") return { failure: "mail_pending_approval", delivered: false };
  return { failure: null, delivered: true };
}

export async function handleStripeWebhook(
  rawBody: string,
  signature: string | null,
  overrides: Partial<WebhookDeps> = {},
): Promise<WebhookReply> {
  const d: WebhookDeps = {
    env: process.env,
    fetchImpl: fetch,
    sendMail: sendEmail,
    ledger: processLedger,
    watchStore: null,
    nowSeconds: () => Math.floor(Date.now() / 1000),
    stripeMs: DEFAULT_STRIPE_MS,
    mailMs: DEFAULT_MAIL_MS,
    ...overrides,
  };
  if (!("watchStore" in overrides)) d.watchStore = pgStore();

  const secret = d.env.STRIPE_WEBHOOK_SECRET;
  const missing = !secret ? "STRIPE_WEBHOOK_SECRET" : !d.env.STRIPE_SECRET_KEY ? "STRIPE_SECRET_KEY" : null;
  if (missing || !secret) {
    captureServerMessage("Stripe webhook is not configured", { scope: "stripe_webhook", missing: missing ?? "unknown" });
    return reply(503, { ok: false, reason: "not_configured" });
  }

  if (!verifyStripeSignature(rawBody, signature, secret, d.nowSeconds()).ok) {
    return reply(400, { ok: false, reason: "bad_signature" });
  }

  let event: { id?: unknown; type?: unknown; data?: { object?: { id?: unknown; status?: string; customer?: string; metadata?: Record<string, string> | null } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return reply(400, { ok: false, reason: "bad_payload" });
  }
  const eventId = typeof event.id === "string" ? event.id : "";
  if (!eventId) return reply(400, { ok: false, reason: "bad_payload" });
  if (typeof event.type !== "string" || ![...FULFIL_EVENTS, ...SUBSCRIPTION_EVENTS].includes(event.type)) {
    return reply(200, { received: true, ignored: "event_type" });
  }

  const obj = event.data?.object;
  if (isWatchObject(obj)) return handleWatchEvent(event.type, obj ?? {}, eventId, d);
  if (SUBSCRIPTION_EVENTS.includes(event.type)) return reply(200, { received: true, ignored: "not_ours" });
  // The Pro report is no longer sold; without its price configured nothing here is ours.
  if (!d.env.STRIPE_PRICE_ID) return reply(200, { received: true, ignored: "not_report" });

  const sessionId = typeof event.data?.object?.id === "string" ? event.data.object.id : undefined;
  const verified = await verifyPurchase("report", sessionId, d.env, d.fetchImpl, d.stripeMs);
  if (!verified.ok) {
    // A signed event with no usable session id cannot be fixed by a retry.
    if (verified.reason === "no_session" || verified.reason === "bad_session") return reply(400, { ok: false, reason: "bad_payload" });
    const ignored = NOT_OURS[verified.reason];
    if (ignored) return reply(200, { received: true, ignored });
    captureServerMessage("Stripe webhook could not verify the session", { scope: "stripe_webhook", reason: verified.reason, event_id: eventId });
    return reply(500, { ok: false, reason: verified.reason });
  }

  if (!(await d.ledger.claim(eventId))) return reply(200, { received: true, duplicate: true });

  try {
    const outcome = await deliver(sessionId as string, verified.session, eventId, d);
    if (outcome.failure) {
      await d.ledger.release(eventId);
      captureServerMessage("Pro report email was not sent", { scope: "stripe_webhook", reason: outcome.failure, event_id: eventId });
      return reply(500, { ok: false, reason: outcome.failure });
    }
    return reply(200, { received: true, delivered: outcome.delivered });
  } catch (err) {
    await d.ledger.release(eventId);
    captureServerError(err, { scope: "stripe_webhook", event_id: eventId });
    return reply(500, { ok: false, reason: "handler_error" });
  }
}

/** Wage Watch: activate on a completed subscription Checkout, mirror lifecycle changes. */
async function handleWatchEvent(type: string, obj: { id?: unknown; status?: string; customer?: string; metadata?: Record<string, string> | null }, eventId: string, d: WebhookDeps): Promise<WebhookReply> {
  if (!d.watchStore) {
    captureServerMessage("Stripe webhook is not configured", { scope: "stripe_webhook", missing: "DATABASE_URL" });
    return reply(503, { ok: false, reason: "not_configured" });
  }
  if (!(await d.ledger.claim(eventId))) return reply(200, { received: true, duplicate: true });
  try {
    if (SUBSCRIPTION_EVENTS.includes(type)) {
      const applied = await applySubscriptionEvent({ ...obj, id: typeof obj.id === "string" ? obj.id : undefined }, d.watchStore);
      return reply(200, { received: true, watch: applied ? "updated" : "unknown_subscription" });
    }
    const res = await activateFromSession(typeof obj.id === "string" ? obj.id : undefined, d.watchStore, d.env, d.fetchImpl);
    if (res.ok) return reply(200, { received: true, watch: "activated" });
    if (res.reason === "not_paid") return reply(200, { received: true, ignored: "not_paid" });
    await d.ledger.release(eventId);
    captureServerMessage("Wage Watch activation failed", { scope: "stripe_webhook", reason: res.reason, event_id: eventId });
    return reply(500, { ok: false, reason: res.reason });
  } catch (err) {
    await d.ledger.release(eventId);
    captureServerError(err, { scope: "stripe_webhook", event_id: eventId });
    return reply(500, { ok: false, reason: "handler_error" });
  }
}
