import { WATCH_PLANS } from "./watch-plan";

// Feature lists for the two Wage Watch tiers, built from the plan numbers in
// lib/watch-plan.ts so the copy can't promise more places or reminders than the code sends.

const reminders = (days: number[]) =>
  days.filter((d) => d > 0).map((d) => `${d}`).join(", ") + " days before, and the day it starts";

export const WATCH_FEATURES = {
  free: [
    `${WATCH_PLANS.free.maxLocations} state or city`,
    `An email ${reminders(WATCH_PLANS.free.leadDays)}`,
    "The new rate, the date and the official source",
  ],
  watch: [
    `Up to ${WATCH_PLANS.watch.maxLocations} states and cities`,
    `Reminders ${reminders(WATCH_PLANS.watch.leadDays)}`,
    "A printable compliance sheet for your states: minimum wage, tipped pay, overtime, final pay and breaks, cited",
    "Cancel any time from your billing page",
  ],
};
