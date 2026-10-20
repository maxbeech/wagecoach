import type { Metadata } from "next";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import PlanCard from "@/components/PlanCard";
import ProReportView from "@/components/ProReportView";
import UpcomingChanges from "@/components/UpcomingChanges";
import WatchManage from "@/components/WatchManage";
import KitPurchaseTracker from "@/components/analytics/kit-purchase-tracker";
import { Eyebrow, SectionHeading } from "@/components/primitives";
import { buildProReport } from "@/lib/pro-report";
import { getStateByAbbr, type StateLaw } from "@/lib/states";
import { changeKey, todayIso, upcomingFor, type ScheduledChange } from "@/lib/wage-schedule";
import { activateFromSession } from "@/lib/watch-billing";
import { WATCH_FEATURES } from "@/lib/watch-copy";
import { WATCH_PLANS } from "@/lib/watch-plan";
import { defaultDeps, lookup } from "@/lib/watch-service";

// A subscriber's own page, opened from the link in any Wage Watch email. The
// token in the URL is the credential, so the page is dynamic and never indexed.
// Returning from Stripe with ?session_id=... upgrades the plan right here, so the
// buyer doesn't wait for the webhook (which also does it; whichever runs second is a no-op).
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your wage alerts", robots: { index: false, follow: false } };

const WATCH_ITEM = { id: "wage_watch", name: "WageCoach Wage Watch" };

export default async function ManagePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const token = typeof sp.t === "string" ? sp.t : "";
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : undefined;
  const d = defaultDeps();

  let found = await lookup(token, d);
  let upgraded: "yes" | "failed" | null = null;
  if (found.ok && sessionId && d.store) {
    const res = await activateFromSession(sessionId, d.store, process.env, fetch, found.view.watcher.id);
    upgraded = res.ok ? "yes" : "failed";
    if (res.ok) found = await lookup(token, d);
  }

  if (!found.ok) {
    return (
      <div className="mx-auto max-w-md text-center">
        <Eyebrow>Wage Watch</Eyebrow>
        <h1 className="mt-3 font-display text-2xl font-semibold text-ink">
          {found.reason === "not_configured" ? "Alerts aren't switched on yet" : "This link has expired"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Each alert email carries a fresh link, so use the newest one. Or sign up again with the same email and
          we&apos;ll send a new link. Your places and plan are kept.
        </p>
        <div className="mt-6"><Link href="/wage-watch" className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800">Get a new link</Link></div>
      </div>
    );
  }

  const { watcher, places, plan } = found.view;
  const paid = plan.id === "watch";
  const today = todayIso();
  const seen = new Set<string>();
  const upcoming: ScheduledChange[] = places.flatMap((p) => upcomingFor(p, today))
    .filter((c) => (seen.has(changeKey(c)) ? false : (seen.add(changeKey(c)), true)))
    .sort((a, b) => a.effective.localeCompare(b.effective));
  const states = [...new Set(places.map((p) => p.stateAbbr))].map(getStateByAbbr).filter((s): s is StateLaw => Boolean(s));

  return (
    <div>
      {upgraded === "yes" && sessionId && <KitPurchaseTracker purchase={{ transactionId: sessionId, value: WATCH_PLANS.watch.priceUsd, currency: "USD" }} item={WATCH_ITEM} />}
      {upgraded === "failed" && <KitPurchaseTracker failureReason="watch_activation" item={WATCH_ITEM} />}

      <Eyebrow>{paid ? "Wage Watch · active" : "Free alerts"}</Eyebrow>
      <div className="mt-3">
        <SectionHeading as="h1" title="Your wage alerts" sub={`Emails go to ${watcher.email}.`} />
      </div>

      {sp.confirmed && !watcher.unsubscribedAt && <Banner>You&apos;re in. We&apos;ll email you before the next change in your places.</Banner>}
      {upgraded === "yes" && <Banner>Wage Watch is on. Add up to {WATCH_PLANS.watch.maxLocations} places below.</Banner>}
      {upgraded === "failed" && <Banner tone="warn">We couldn&apos;t confirm the payment yet. Refresh in a minute; if it still says free, reply to any of our emails.</Banner>}
      {watcher.unsubscribedAt && <Banner tone="warn">You&apos;re unsubscribed. Sign up again on the Wage Watch page to restart alerts.</Banner>}
      {!watcher.confirmedAt && !watcher.unsubscribedAt && <Banner tone="warn">Confirm your email first: open the link we sent you.</Banner>}

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <WatchManage token={token} places={watcher.locations} maxLocations={plan.maxLocations} paid={paid} />
        <section>
          <h2 className="font-display text-base font-semibold text-ink">Coming up in your places</h2>
          <div className="mt-3"><UpcomingChanges changes={upcoming} today={today} empty="No changes announced for your places yet. We'll email you when one is." /></div>
        </section>
      </div>

      {!paid && !watcher.unsubscribedAt && (
        <section className="mt-12 max-w-xl">
          <PlanCard name={WATCH_PLANS.watch.name} price={`$${WATCH_PLANS.watch.priceUsd}`} unit="a month" featured
            blurb="For businesses in several states or cities." features={WATCH_FEATURES.watch}>
            <CheckoutButton product="watch" token={token} label={`Upgrade for $${WATCH_PLANS.watch.priceUsd} a month`} />
          </PlanCard>
        </section>
      )}

      {paid && states.length > 0 && (
        <div className="mt-14 border-t border-line pt-10">
          <ProReportView report={buildProReport(states)} heading={{
            eyebrow: "Compliance sheet",
            title: "The rules in your states, on one page",
            sub: `Built from today's data for ${states.map((s) => s.name).join(", ")}. It updates when the law does. Print or save it as a PDF for whoever runs payroll.`,
          }} />
        </div>
      )}
    </div>
  );
}

function Banner({ children, tone = "ok" }: { children: React.ReactNode; tone?: "ok" | "warn" }) {
  const cls = tone === "ok" ? "border-brand-200 bg-brand-50 text-brand-800" : "border-amber-200 bg-amber-50 text-amber-900";
  return <p role="status" className={`settle-in mt-5 rounded-xl border px-4 py-3 text-sm ${cls}`}>{children}</p>;
}
