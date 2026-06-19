import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <div className="font-display text-7xl font-semibold text-line">404</div>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 text-muted">That page clocked out. Try one of these instead.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/" className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800">Overtime calculator</Link>
        <Link href="/calculators/minimum-wage-calculator" className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium text-ink transition hover:border-brand-300">Minimum wage by state</Link>
        <Link href="/states" className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium text-ink transition hover:border-brand-300">All states</Link>
      </div>
    </div>
  );
}
