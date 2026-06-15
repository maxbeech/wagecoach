import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <div className="text-6xl font-black text-slate-200">404</div>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">That page clocked out. Try one of these instead:</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link href="/" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Overtime calculator</Link>
        <Link href="/calculators/minimum-wage-calculator" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Minimum wage by state</Link>
        <Link href="/states" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">All states</Link>
      </div>
    </div>
  );
}
