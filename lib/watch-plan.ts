// Wage Watch plans: the single source for what each tier gets and costs. The
// pricing page, the signup form, the checkout route and the alert job all read
// these numbers, so the offer cannot say one thing and the code do another.

export type PlanId = "free" | "watch";

export interface WatchPlan {
  id: PlanId;
  name: string;
  /** Most places one subscriber can watch. */
  maxLocations: number;
  /** Days before a change takes effect that an alert goes out. 0 = the day it starts. */
  leadDays: number[];
  /** Monthly price in whole dollars (0 = free). */
  priceUsd: number;
}

export const WATCH_PLANS: Record<PlanId, WatchPlan> = {
  free: { id: "free", name: "Free alerts", maxLocations: 1, leadDays: [30, 0], priceUsd: 0 },
  watch: { id: "watch", name: "Wage Watch", maxLocations: 10, leadDays: [60, 30, 7, 0], priceUsd: 9 },
};

/** The plan a stored row is on. Only an active or trialing paid subscription counts as paid. */
export function effectivePlan(plan: string | null | undefined, subscriptionStatus: string | null | undefined): WatchPlan {
  const paid = plan === "watch" && (subscriptionStatus === "active" || subscriptionStatus === "trialing");
  return paid ? WATCH_PLANS.watch : WATCH_PLANS.free;
}

/** Stripe line item for the paid plan (price_data, so no dashboard price has to exist). */
export const WATCH_STRIPE = {
  productName: "WageCoach Wage Watch",
  currency: "usd",
  interval: "month",
  /** Metadata tag that marks a Stripe object as ours, since the account is shared. */
  metadataKey: "wagecoach_product",
  metadataValue: "wage_watch",
} as const;
