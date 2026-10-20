import { analyticsEvents, CLIENT_REQUEST_TIMEOUT_MS, requestFailureReason } from "../lib/analytics-events.ts";
import { eq, ok, report } from "./_assert.mts";

// User journeys (OpenHelm "User journeys" table, reviewed 2026-10-19): the event names
// each journey step sends. Any drift between this list and analyticsEvents fails here.
// `first_visit` is GA's automatic event, so it is not in analyticsEvents.
const JOURNEY_EVENTS = [
  "calculator_used", "backpay_calculator_used",
  "begin_checkout", "begin_checkout_failed", "checkout_cancelled",
  "purchase", "purchase_confirmation_failed",
  "sign_up", "sign_up_failed",
].sort();
eq(Object.values(analyticsEvents).slice().sort().join(), JOURNEY_EVENTS.join(), "analyticsEvents matches the User journeys event list");

// Browser timeout: the limit is finite and in a sane band (not a hang, not a false failure).
ok(CLIENT_REQUEST_TIMEOUT_MS >= 5_000 && CLIENT_REQUEST_TIMEOUT_MS <= 60_000, `browser request timeout is ${CLIENT_REQUEST_TIMEOUT_MS} ms`);

// A TimeoutError maps to `timeout`; a network error or a non-JSON body is `request_failed`.
eq(requestFailureReason(Object.assign(new Error("aborted"), { name: "TimeoutError" })), "timeout", "a TimeoutError is reason timeout");
eq(requestFailureReason(new TypeError("Failed to fetch")), "request_failed", "a network TypeError is reason request_failed");
eq(requestFailureReason(new SyntaxError("Unexpected token <")), "request_failed", "a non-JSON body is reason request_failed");
eq(requestFailureReason("TimeoutError"), "request_failed", "a bare string is not mistaken for a timeout");
eq(requestFailureReason(undefined), "request_failed", "missing input is reason request_failed");

// A hung request, with the same signal shape the components use, rejects with a
// TimeoutError that maps to `timeout`. This runs the real AbortSignal, not a stand-in.
const hangingFetch = (_url: string, init: RequestInit) =>
  new Promise<Response>((_resolve, reject) => {
    init.signal?.addEventListener("abort", () => reject(init.signal?.reason));
  });
// The timeout timer is unref'd in Node, so a keep-alive keeps the process up while we wait.
const keepAlive = setTimeout(() => {}, 1_000);
try {
  await hangingFetch("https://example.test/api/checkout", { signal: AbortSignal.timeout(10) });
  ok(false, "a hung request must not resolve");
} catch (err) {
  eq(requestFailureReason(err), "timeout", "a hung request that hits its timeout is reason timeout");
} finally {
  clearTimeout(keepAlive);
}

report("journey-instrumentation");
