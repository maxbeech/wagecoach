// gtag.js only acts on `arguments` objects in dataLayer; a plain array is silently
// ignored (no error, no hit). This checks the shipped client pushes the right shape
// and that the track wrapper keeps to it. Env and window are set before the import.
process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST123456";
const win: { dataLayer?: unknown[]; location: { href: string } } = { location: { href: "https://www.wagecoach.com/" } };
Object.assign(globalThis, { window: win, document: { title: "t" } });

const { track, trackPageView, analyticsEnabled } = await import("../lib/openhelm-analytics.tsx");
const { trackEvent, trackCalculatorUse } = await import("../lib/analytics-track.ts");
const { eq, ok, report } = await import("./_assert.mts");

ok(analyticsEnabled, "analytics is enabled when the measurement id is set");
const entries = () => (win.dataLayer ?? []).map((e) => Array.from(e as ArrayLike<unknown>));
const shape = (e: unknown) => Object.prototype.toString.call(e);

track("begin_checkout", { product: "kit" });
trackEvent("generate_lead", { claim_type: "overtime", state: "CA" });
trackCalculatorUse("backpay");
trackPageView("/pricing");

ok((win.dataLayer ?? []).every((e) => !Array.isArray(e)), "dataLayer holds arguments objects, never plain arrays");
ok((win.dataLayer ?? []).every((e) => shape(e) === "[object Arguments]"), "every entry is an Arguments object");
eq(JSON.stringify(entries()[0]), JSON.stringify(["event", "begin_checkout", { product: "kit" }]), "track sends event, name, params");
eq(JSON.stringify(entries()[1]), JSON.stringify(["event", "generate_lead", { claim_type: "overtime", state: "CA" }]), "trackEvent forwards to track");
eq(entries().slice(2, 4).map((e) => e[1]).join(), "calculator_used,backpay_calculator_used", "back-pay use sends both events");
eq(entries()[4][1], "page_view", "page views use the same shape");

report("analytics-client");
