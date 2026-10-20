import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Eyebrow } from "@/components/primitives";
import { confirm, defaultDeps, lookup } from "@/lib/watch-service";

// Double opt-in. The email link lands here and the person presses one button;
// confirming on a plain GET would let mail scanners that pre-open links sign
// people up without them. Dynamic and noindex.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Confirm your wage alerts", robots: { index: false, follow: false } };

async function confirmAction(form: FormData) {
  "use server";
  const token = String(form.get("t") ?? "");
  const res = await confirm(token, defaultDeps());
  redirect(res.ok ? `/wage-watch/manage?t=${encodeURIComponent(token)}&confirmed=1` : `/wage-watch/confirm?t=${encodeURIComponent(token)}&error=1`);
}

export default async function ConfirmPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const token = typeof sp.t === "string" ? sp.t : "";
  const found = await lookup(token, defaultDeps());

  if (!found.ok) {
    return (
      <div className="mx-auto max-w-md text-center">
        <Eyebrow>Wage Watch</Eyebrow>
        <h1 className="mt-3 font-display text-2xl font-semibold text-ink">
          {found.reason === "not_configured" ? "Alerts aren't switched on yet" : "This link has expired"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {found.reason === "not_configured" ? "Please try again later." : "Sign up again and we'll send a fresh link. Only the newest email's link works."}
        </p>
        <div className="mt-6"><Link href="/wage-watch" className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800">Back to Wage Watch</Link></div>
      </div>
    );
  }

  const { places } = found.view;
  return (
    <div className="mx-auto max-w-md text-center">
      <Eyebrow>Wage Watch</Eyebrow>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Confirm your alerts</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        You&apos;ll get an email before the minimum wage changes in {places.map((p) => p.label).join(", ") || "your places"}.
      </p>
      {sp.error && <p className="mt-3 text-sm text-amber-800" role="alert">That didn&apos;t go through. Please try once more.</p>}
      <form action={confirmAction} className="mt-6">
        <input type="hidden" name="t" value={token} />
        <button type="submit" className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-800">Confirm alerts</button>
      </form>
    </div>
  );
}
