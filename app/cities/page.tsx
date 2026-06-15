import type { Metadata } from "next";
import Link from "next/link";
import { CITIES } from "@/lib/cities";
import { getStateByAbbr } from "@/lib/states";
import { dollars } from "@/lib/federal";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "City Minimum Wages 2026 (Seattle, NYC, LA, Chicago & more)",
  description: "2026 local minimum wages for major U.S. cities — Seattle, New York City, Los Angeles, San Francisco, Chicago, Denver and more — many higher than their state's rate.",
  alternates: { canonical: "/cities" },
};

export default function CitiesIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">City Minimum Wages (2026)</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Dozens of U.S. cities and counties set their own minimum wage above the state and federal rate.
        Here are the 2026 local minimums for the biggest ones — the highest applicable rate is the one
        that applies to you.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[30rem] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="px-4 py-2">City / locality</th><th className="px-4 py-2">2026 minimum</th><th className="px-4 py-2">State</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {CITIES.map((c) => {
              const st = getStateByAbbr(c.state);
              return (
                <tr key={c.slug} className="hover:bg-emerald-50">
                  <td className="px-4 py-2"><Link href={`/cities/${c.slug}`} className="font-medium text-emerald-700 hover:underline">{c.city}</Link></td>
                  <td className="px-4 py-2 font-semibold text-slate-900 tabular-nums">{dollars(c.minWage)}</td>
                  <td className="px-4 py-2 text-slate-600">{st ? <Link href={`/states/${st.slug}`} className="hover:underline">{st.name}</Link> : c.state}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Local minimum wages change frequently and several re-index mid-year — confirm the current rate
        with the city or your state labor department.
      </p>
    </div>
  );
}
