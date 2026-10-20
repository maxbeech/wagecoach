import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/primitives";
import ObfuscatedEmail from "@/components/ObfuscatedEmail";
import ProReportView from "@/components/ProReportView";
import ReportStatePicker from "@/components/ReportStatePicker";
import { buildProReport, parseStates } from "@/lib/pro-report";
import { lockedCopy, verifyReportPurchase } from "@/lib/report-purchase";

// Post-purchase deliverable for the $19 Pro report. Dynamic + noindex: it depends
// on the live Stripe session and must never be cached or crawled. It is also kept
// out of the sitemap, like /claim-kit. `referrer: no-referrer` stops the session id
// in this URL leaking to the source sites the report links to.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Pro report",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

// Same rule as the Claim Kit (lib/stripe-purchase.ts): the page unlocks only when
// Stripe says the session is paid, a one-time payment, and holds the report's price.
// If Stripe or the price is not configured we cannot verify, so we stay locked.

export default async function ProReportPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : undefined;
  const verified = await verifyReportPurchase(sessionId);

  if (!verified.ok) {
    const copy = lockedCopy(verified.reason);
    return (
      <div className="mx-auto max-w-xl text-center">
        <Eyebrow>Pro report</Eyebrow>
        <h1 className="mt-3 font-display text-2xl font-semibold text-ink">{copy.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{copy.body}</p>
        <p className="mt-3 text-sm text-muted">Write to <ObfuscatedEmail className="text-brand-700 underline decoration-brand-300 underline-offset-2" />.</p>
        {copy.buy && (
          <div className="mt-6">
            <Link href="/pricing" className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800">See the Pro report</Link>
          </div>
        )}
      </div>
    );
  }

  // States picked at checkout travel in the session. A `states` query overrides them
  // (that is how the picker below works), and covers sessions from before states
  // were collected.
  const fromQuery = parseStates(sp.states);
  const states = fromQuery.length ? fromQuery : parseStates(verified.purchase.statesParam);
  const session = sessionId as string;

  if (states.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Your Pro report · paid ✓</Eyebrow>
        <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Pick your states</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">Your payment is confirmed. Choose the states you run payroll in and the report builds on this page.</p>
        <div className="mt-5"><ReportStatePicker sessionId={session} submitLabel="Build my report" /></div>
      </div>
    );
  }

  return (
    <ProReportView report={buildProReport(states)}>
      <details className="mt-8 print:hidden">
        <summary className="cursor-pointer text-sm font-medium text-brand-700">Change the states</summary>
        <div className="mt-3"><ReportStatePicker sessionId={session} selected={states.map((s) => s.abbr)} submitLabel="Rebuild the report" /></div>
      </details>
    </ProReportView>
  );
}
