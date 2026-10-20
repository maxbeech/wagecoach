import WatchSignup from "./WatchSignup";
import { dollars } from "@/lib/federal";
import { nextChange, todayIso } from "@/lib/wage-schedule";
import { formatDate } from "@/lib/watch-email";

// "What's the next change here, and get told about it." Sits under the rate on
// state and city pages: the next announced change (with its source) when there is
// one, an honest "nothing announced" when there isn't, and the Wage Watch signup.

export default function RateChangeAlert({ locationKey, place }: { locationKey: string; place: string }) {
  const next = nextChange(locationKey, todayIso());
  const what = next?.field === "tippedCashWage" ? "tipped cash wage" : "minimum wage";
  return (
    <section className="mt-8 rounded-2xl border border-line bg-card p-5 shadow-card">
      <h2 className="font-display text-base font-semibold text-ink">
        {next ? `Next change: ${what} ${dollars(next.value)} on ${formatDate(next.effective)}` : `Get an email when the ${place} minimum wage changes`}
      </h2>
      <p className="mt-1 text-sm text-muted">
        {next
          ? <>{next.note ? `${next.note}. ` : ""}<a href={next.source} target="_blank" rel="nofollow noopener" className="underline decoration-line underline-offset-2 hover:text-ink">Official source</a>. Get a reminder before it starts.</>
          : "No change is announced yet. We'll email you when one is, with the date and the source."}
      </p>
      <div className="mt-3"><WatchSignup defaultLocation={locationKey} compact /></div>
    </section>
  );
}
