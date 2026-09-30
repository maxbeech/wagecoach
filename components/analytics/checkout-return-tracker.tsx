"use client";

import { useEffect } from "react";
import { analyticsEnabled } from "@/lib/openhelm-analytics";
import { analyticsEvents } from "@/lib/analytics-events";
import { trackEvent } from "@/lib/analytics-track";

// Checkout sends a person who backs out to `<page>?status=cancel` (/pricing for
// the report, /wage-claim for the Kit). Report that as `checkout_cancelled` so
// an abandoned checkout reads differently from one that never started. Reads the
// URL directly rather than via useSearchParams, so it needs no Suspense boundary
// and cannot change how a page renders. Renders nothing.
export default function CheckoutReturnTracker() {
  useEffect(() => {
    if (!analyticsEnabled) return;
    const { pathname, search } = window.location;
    if (!["/pricing", "/wage-claim"].includes(pathname)) return;
    if (new URLSearchParams(search).get("status") === "cancel") trackEvent(analyticsEvents.checkoutCancelled);
  }, []);
  return null;
}
