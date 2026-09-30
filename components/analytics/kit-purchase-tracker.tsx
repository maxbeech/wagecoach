"use client";

import { useEffect } from "react";
import { analyticsEnabled } from "@/lib/openhelm-analytics";
import { analyticsEvents } from "@/lib/analytics-events";
import { trackEvent } from "@/lib/analytics-track";
import { alreadyTracked, markTracked } from "./tracked-purchases";

// Reports the result of the Stripe return on /claim-kit. The page is a server
// component that has already asked Stripe, so this only relays what it found:
// `purchase` for a paid Kit (once per transaction), or
// `purchase_confirmation_failed` with a short reason when the visitor came back
// from Stripe with a session that could not be confirmed. Renders nothing.
export default function KitPurchaseTracker(
  props: { purchase: { transactionId: string; value: number; currency: string } } | { failureReason: string },
) {
  const purchase = "purchase" in props ? props.purchase : null;
  const failureReason = "failureReason" in props ? props.failureReason : null;

  useEffect(() => {
    if (!analyticsEnabled) return;
    if (purchase) {
      if (alreadyTracked(purchase.transactionId)) return; // GA also de-duplicates on transaction_id
      markTracked(purchase.transactionId);
      trackEvent(analyticsEvents.purchase, {
        transaction_id: purchase.transactionId,
        currency: purchase.currency,
        value: purchase.value,
        items: [{ item_id: "claim_kit", item_name: "WageCoach Claim Kit", quantity: 1 }],
      });
    } else if (failureReason) {
      trackEvent(analyticsEvents.purchaseConfirmationFailed, { reason: failureReason });
    }
  }, [purchase?.transactionId, purchase?.value, purchase?.currency, failureReason]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
