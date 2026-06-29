import type { Metadata } from "next";
import Link from "next/link";
import { decodeBackPay } from "@/lib/backpay-url";
import { estimateBackPay } from "@/lib/backpay";
import { buildDemandLetter, buildFilingGuide } from "@/lib/demand-letter";
import { dollars } from "@/lib/federal";
import { Eyebrow, SectionHeading } from "@/components/primitives";
import ClaimKitPersonaliser from "@/components/ClaimKitPersonaliser";
import ObfuscatedEmail from "@/components/ObfuscatedEmail";

// Post-purchase deliverable. Dynamic + noindex: it depends on the live Stripe
// session and must never be cached or crawled.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Claim Kit",
  robots: { index: false, follow: false },
};

// Confirm the Stripe Checkout session was actually paid FOR THE KIT before
// unlocking it. No database needed — the session id in the success URL is the
// proof. We must check both that the session is paid AND that it contains the
// Kit's price line item: otherwise a cheaper session (e.g. the $19 report) or any
// other paid session in the account would unlock the $29 Kit — a price-tier
// bypass. If Stripe or the kit price isn't configured, we can't verify, so we lock.
async function verifyPaid(sessionId?: string): Promise<boolean> {
  const secret = process.env.STRIPE_SECRET_KEY;
  const kitPrice = process.env.STRIPE_KIT_PRICE_ID;
  if (!secret || !kitPrice || !sessionId) return false;
  try {
    // Expand line_items so we can confirm the purchased price, not just "paid".
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=line_items`,
      { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" },
    );
    if (!res.ok) return false;
    const session = await res.json();
    if (session?.payment_status !== "paid") return false;
    const lines: Array<{ price?: { id?: string } }> = session?.line_items?.data ?? [];
    return lines.some((li) => li.price?.id === kitPrice);
  } catch {
    return false;
  }
}

function toSearch(params: Record<string, string | string[] | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (typeof v === "string") p.set(k, v);
  return p.toString();
}

export default async function ClaimKitPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : undefined;
  const paid = await verifyPaid(sessionId);

  if (!paid) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <Eyebrow>Claim Kit</Eyebrow>
        <h1 className="mt-3 font-display text-2xl font-semibold text-ink">We couldn&apos;t confirm your purchase</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This page unlocks after checkout. If you just paid and see this, give it a moment and refresh — or email{" "}
          <ObfuscatedEmail className="text-brand-700 underline decoration-brand-300 underline-offset-2" /> and
          we&apos;ll send your kit.
        </p>
        <div className="mt-6">
          <Link href="/wage-claim" className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800">Back to the estimator</Link>
        </div>
      </div>
    );
  }

  const inp = decodeBackPay("?" + toSearch(sp));
  const r = estimateBackPay(inp);
  const letter = buildDemandLetter(inp, r, inp.state);
  const guide = buildFilingGuide(inp, inp.state);
  const where = inp.state ? inp.state.name : "your state";

  return (
    <div className="mx-auto max-w-3xl">
      <Eyebrow>Your Claim Kit · paid ✓</Eyebrow>
      <div className="mt-3">
        <SectionHeading as="h1" title="Your wage Claim Kit is ready" sub={`Below is your demand letter, pre-filled with your figures, and a step-by-step guide to filing in ${where}. Print it, fill in the bracketed details, and send.`} />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[["Back pay", dollars(r.backPay)], ["With liquidated damages", dollars(r.totalPotential)], ["Recovery window", `${r.lookbackYears} yrs`]].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-line bg-card p-4 text-center">
            <div className="text-[0.7rem] font-medium uppercase tracking-wider text-faint">{l}</div>
            <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-ink">{v}</div>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <ClaimKitPersonaliser letter={letter} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink">2 · How to file in {where}</h2>
        <div className="mt-2 rounded-xl border border-line bg-paper/50 p-4 text-sm text-ink">
          <strong>File with:</strong> {guide.agency}
          {guide.fileUrl && <> — <a href={guide.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2">official wage-claim filing</a></>}
          {guide.statePlus && <div className="mt-1 text-muted">{guide.statePlus}</div>}
        </div>
        <ol className="mt-4 space-y-4">
          {guide.steps.map((s, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 font-mono text-xs font-semibold text-brand-700">{i + 1}</span>
              <p className="text-sm leading-relaxed text-muted">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <h2 className="font-display text-base font-semibold text-brand-800">Want a lawyer to handle it?</h2>
        <p className="mt-1 text-sm leading-relaxed text-brand-800">
          If your employer ignores the letter, an employment attorney can take it from here — most wage cases are on
          contingency. <Link href={`/free-case-review?${toSearch(sp)}&amt=${Math.round(r.backPay)}`} className="font-medium underline decoration-brand-400 underline-offset-2">Get a free case review →</Link>
        </p>
      </section>

      <p className="mt-8 text-xs leading-relaxed text-faint">
        This kit is self-help information, not legal advice, and WageCoach is not a law firm. The figures are estimates
        from what you entered. Wage law has local exceptions and strict deadlines — confirm with {guide.agency} or an
        attorney before relying on it.
      </p>
    </div>
  );
}
