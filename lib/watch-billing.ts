import { captureServerError, captureServerMessage } from "./observability";
import { lookupSession, type Env } from "./stripe-purchase";
import { WATCH_PLANS, WATCH_STRIPE } from "./watch-plan";
import type { Watcher, WatchStore } from "./watch-store";

// Stripe billing for the paid Wage Watch plan: start a subscription Checkout,
// confirm a returning session, mirror subscription changes, open the billing
// portal. The price is sent as price_data from lib/watch-plan.ts, so the offer
// lives in one place and no dashboard price id has to be kept in sync.
// Docs: https://docs.stripe.com/api/checkout/sessions/create
//       https://docs.stripe.com/api/customer_portal/sessions/create

const STRIPE = "https://api.stripe.com/v1";

type Fetch = typeof fetch;
export type BillingResult = { ok: true; url: string } | { ok: false; reason: string; status: number };

async function stripePost(path: string, form: URLSearchParams, secret: string, scope: string, fetchImpl: Fetch): Promise<BillingResult> {
  try {
    const res = await fetchImpl(`${STRIPE}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
      signal: AbortSignal.timeout(10_000),
    });
    const body = (await res.json()) as { url?: string; error?: { code?: string } };
    if (!res.ok || !body.url) {
      captureServerMessage("Stripe billing call failed", { scope, status: res.status, stripeErrorCode: body?.error?.code });
      return { ok: false, reason: "stripe_error", status: 502 };
    }
    return { ok: true, url: body.url };
  } catch (err) {
    captureServerError(err, { scope });
    return { ok: false, reason: "unreachable", status: 502 };
  }
}

/** The Checkout params for one subscriber's upgrade. Exported so tests can read them. */
export function watchCheckoutForm(watcher: Watcher, manageUrl: string): URLSearchParams {
  const plan = WATCH_PLANS.watch;
  const form = new URLSearchParams({
    mode: "subscription",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": WATCH_STRIPE.currency,
    "line_items[0][price_data][unit_amount]": String(plan.priceUsd * 100),
    "line_items[0][price_data][recurring][interval]": WATCH_STRIPE.interval,
    "line_items[0][price_data][product_data][name]": WATCH_STRIPE.productName,
    client_reference_id: watcher.id,
    [`metadata[${WATCH_STRIPE.metadataKey}]`]: WATCH_STRIPE.metadataValue,
    [`subscription_data[metadata][${WATCH_STRIPE.metadataKey}]`]: WATCH_STRIPE.metadataValue,
    "subscription_data[metadata][watcher_id]": watcher.id,
    success_url: `${manageUrl}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${manageUrl}&status=cancel`,
    allow_promotion_codes: "true",
  });
  if (watcher.stripeCustomer) form.set("customer", watcher.stripeCustomer);
  else form.set("customer_email", watcher.email);
  return form;
}

export async function startWatchCheckout(watcher: Watcher, manageUrl: string, env: Env = process.env, fetchImpl: Fetch = fetch): Promise<BillingResult> {
  const secret = env.STRIPE_SECRET_KEY;
  if (!secret) {
    captureServerMessage("Checkout is not configured", { scope: "checkout", product: "watch", missing: "STRIPE_SECRET_KEY" });
    return { ok: false, reason: "not_configured", status: 503 };
  }
  return stripePost("/checkout/sessions", watchCheckoutForm(watcher, manageUrl), secret, "watch_checkout", fetchImpl);
}

export async function openBillingPortal(watcher: Watcher, returnUrl: string, env: Env = process.env, fetchImpl: Fetch = fetch): Promise<BillingResult> {
  const secret = env.STRIPE_SECRET_KEY;
  if (!secret) return { ok: false, reason: "not_configured", status: 503 };
  if (!watcher.stripeCustomer) return { ok: false, reason: "no_customer", status: 400 };
  return stripePost("/billing_portal/sessions", new URLSearchParams({ customer: watcher.stripeCustomer, return_url: returnUrl }), secret, "watch_portal", fetchImpl);
}

/** Is a Stripe object ours? The account is shared with other products, so only our tag counts. */
export const isWatchObject = (o: { metadata?: Record<string, string> | null } | null | undefined) =>
  o?.metadata?.[WATCH_STRIPE.metadataKey] === WATCH_STRIPE.metadataValue;

interface SubscriptionSession {
  mode?: string; status?: string; payment_status?: string; client_reference_id?: string | null;
  customer?: string | null; subscription?: string | null; metadata?: Record<string, string> | null;
}

export type ActivateResult = { ok: true; watcherId: string } | { ok: false; reason: string };

/** Ask Stripe for a subscription's live status. Never throws. */
async function subscriptionStatus(id: string, secret: string, fetchImpl: Fetch): Promise<string | null> {
  try {
    const res = await fetchImpl(`${STRIPE}/subscriptions/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${secret}` }, cache: "no-store", signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const sub = (await res.json()) as { status?: string; metadata?: Record<string, string> | null };
    return isWatchObject(sub) && typeof sub.status === "string" ? sub.status : null;
  } catch (err) {
    captureServerError(err, { scope: "watch_activate" });
    return null;
  }
}

/**
 * Apply a completed subscription Checkout session to its subscriber. Used both
 * when the buyer lands back on the manage page and by the webhook, so whichever
 * arrives first upgrades them and the second is a no-op.
 *
 * A session stays "complete and paid" for ever, even after the subscription it
 * started is cancelled, so the session alone never grants the plan: the plan
 * follows the subscription's live status, read from Stripe each time.
 */
export async function activateFromSession(sessionId: string | undefined, store: WatchStore, env: Env = process.env, fetchImpl: Fetch = fetch, expectWatcherId?: string): Promise<ActivateResult> {
  const secret = env.STRIPE_SECRET_KEY;
  if (!sessionId || !/^cs_[A-Za-z0-9_]{8,200}$/.test(sessionId)) return { ok: false, reason: "bad_session" };
  if (!secret) return { ok: false, reason: "not_configured" };
  const found = await lookupSession(sessionId, secret, "watch_activate", fetchImpl);
  if (!found.ok) return found;
  const s = found.session as unknown as SubscriptionSession;
  if (!isWatchObject(s)) return { ok: false, reason: "not_watch" };
  if (s.mode !== "subscription") return { ok: false, reason: "wrong_mode" };
  if (s.status !== "complete" || s.payment_status !== "paid") return { ok: false, reason: "not_paid" };
  const watcherId = s.client_reference_id ?? "";
  if (!watcherId || (expectWatcherId && watcherId !== expectWatcherId)) return { ok: false, reason: "wrong_watcher" };
  if (!(await store.byId(watcherId))) return { ok: false, reason: "no_watcher" };
  if (!s.subscription) return { ok: false, reason: "no_subscription" };
  const status = await subscriptionStatus(s.subscription, secret, fetchImpl);
  if (!status) return { ok: false, reason: "subscription_unreadable" };
  const live = status === "active" || status === "trialing";
  await store.setSubscription(watcherId, { plan: live ? "watch" : "free", stripeCustomer: s.customer ?? null, stripeSubscription: s.subscription, subscriptionStatus: status });
  return live ? { ok: true, watcherId } : { ok: false, reason: "subscription_inactive" };
}

/** Mirror a customer.subscription.* event onto the subscriber. Returns false when it isn't ours. */
export async function applySubscriptionEvent(sub: { id?: string; status?: string; customer?: string; metadata?: Record<string, string> | null }, store: WatchStore): Promise<boolean> {
  if (!isWatchObject(sub) || !sub.id) return false;
  const watcher = (await store.bySubscription(sub.id)) ?? (sub.metadata?.watcher_id ? await store.byId(sub.metadata.watcher_id) : null);
  if (!watcher) return false;
  const live = sub.status === "active" || sub.status === "trialing";
  await store.setSubscription(watcher.id, { plan: live ? "watch" : "free", stripeCustomer: sub.customer ?? null, stripeSubscription: sub.id, subscriptionStatus: sub.status ?? null });
  return true;
}
