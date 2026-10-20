import type { Metadata } from "next";
import Link from "next/link";
import Faq from "@/components/Faq";
import PlanCard from "@/components/PlanCard";
import UpcomingChanges from "@/components/UpcomingChanges";
import WatchSignup from "@/components/WatchSignup";
import { Eyebrow, SectionHeading } from "@/components/primitives";
import { SCHEDULED_CHANGES } from "@/lib/wage-schedule-data";
import { daysUntil, isRedundant, todayIso } from "@/lib/wage-schedule";
import { WATCH_FEATURES } from "@/lib/watch-copy";
import { WATCH_PLANS } from "@/lib/watch-plan";
import type { FaqItem } from "@/lib/faq";

// Wage Watch landing page. Static with a daily revalidate, so the "next changes"
// list moves forward on its own as dates pass.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Minimum Wage Change Alerts by State and City",
  description: "Get an email before the minimum wage changes in the states and cities where you have staff. The new rate, the date and the official source. Free for one place.",
  alternates: { canonical: "/wage-watch" },
};

const FAQS: FaqItem[] = [
  { q: "Where do the rates come from?", a: "Only from announcements that are already official: state labor departments, city ordinance pages and the statutes or ballot measures behind them. Every alert links its source. If a state indexes to inflation and hasn't published next year's figure, we wait for it rather than guess." },
  { q: "When do the emails arrive?", a: `On the free plan, ${WATCH_PLANS.free.leadDays[0]} days before a change and on the day it takes effect. Wage Watch adds reminders ${WATCH_PLANS.watch.leadDays.filter((d) => d > 0).join(", ")} days out.` },
  { q: "Does a city alert cover the state too?", a: "Yes. If you watch a city, you also hear about statewide changes, because a state increase can overtake a city's rate." },
  { q: "How do I cancel?", a: "Every email has a link to your settings, where you can unsubscribe in one click. Paid plans cancel from the billing page, and you keep Wage Watch until the end of the month you paid for." },
];

export default function WageWatchPage() {
  const today = todayIso();
  const upcoming = SCHEDULED_CHANGES
    .filter((c) => { const d = daysUntil(c.effective, today); return d >= 0 && d <= 200 && !isRedundant(c); })
    .sort((a, b) => a.effective.localeCompare(b.effective))
    .slice(0, 12);

  return (
    <div>
      <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Eyebrow>Wage Watch</Eyebrow>
          <div className="mt-3">
            <SectionHeading as="h1" title="Know before the minimum wage changes"
              sub="Pick the states and cities where you pay people. We email you before a new rate takes effect, with the figure, the date and the official source." />
          </div>
          <div className="mt-7 rounded-3xl border border-line bg-card p-6 shadow-card"><WatchSignup /></div>
        </div>
        <section aria-labelledby="next-changes">
          <h2 id="next-changes" className="font-display text-lg font-semibold text-ink">Next announced changes</h2>
          <p className="mt-1 text-sm text-muted">Official figures only. Updated as states and cities publish them.</p>
          <div className="mt-4"><UpcomingChanges changes={upcoming} today={today} empty="Nothing announced for the next six months yet." /></div>
        </section>
      </div>

      <section className="mt-16">
        <SectionHeading title="Free for one place. $9 a month for your whole map." sub="Start free. You can upgrade from any alert email." />
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <PlanCard name={WATCH_PLANS.free.name} price="$0" blurb="For a single location." features={WATCH_FEATURES.free} />
          <PlanCard name={WATCH_PLANS.watch.name} price={`$${WATCH_PLANS.watch.priceUsd}`} unit="a month" featured badge="Multi-location"
            blurb="For businesses in several states or cities." features={WATCH_FEATURES.watch} />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-faint">
          Sign up free above, then upgrade from the link in your email. Looking up a rate today? Use the{" "}
          <Link href="/calculators/minimum-wage-calculator" className="text-brand-700 underline decoration-brand-300 underline-offset-2">minimum wage calculator</Link>.
        </p>
      </section>

      <div className="mt-16"><Faq items={FAQS} /></div>

      <p className="mt-8 max-w-2xl text-xs leading-relaxed text-faint">
        WageCoach is general information, not legal or tax advice, and is not a law firm. Some local rates apply only
        to certain employer sizes or industries; each alert says so and links the rule.
      </p>
    </div>
  );
}
