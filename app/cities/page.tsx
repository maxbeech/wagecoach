import type { Metadata } from "next";
import Link from "next/link";
import { CITIES } from "@/lib/cities";
import { getStateByAbbr } from "@/lib/states";
import { dollars } from "@/lib/federal";
import { Eyebrow, SectionHeading } from "@/components/primitives";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "City Minimum Wages 2026 (Seattle, NYC, LA, Chicago & more)",
  description: "2026 local minimum wages for major U.S. cities including Seattle, New York City, Los Angeles, San Francisco, Chicago and Denver. Many are higher than their state's rate.",
  alternates: { canonical: "/cities" },
};

export default function CitiesIndex() {
  return (
    <div>
      <Eyebrow>City minimum wages</Eyebrow>
      <div className="mt-3">
        <SectionHeading
          as="h1"
          title="City Minimum Wages (2026)"
          sub="Dozens of U.S. cities and counties set their own minimum wage above the state and federal rate. Here are the 2026 local minimums for the biggest ones. The highest applicable rate is the one that applies to you."
        />
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[30rem] text-sm">
          <thead className="bg-brand-50/40 text-left text-xs uppercase tracking-wide text-faint">
            <tr><th className="px-4 py-2">City / locality</th><th className="px-4 py-2">2026 minimum</th><th className="px-4 py-2">State</th></tr>
          </thead>
          <tbody className="divide-y divide-line bg-card">
            {CITIES.map((c) => {
              const st = getStateByAbbr(c.state);
              return (
                <tr key={c.slug} className="hover:bg-brand-50/40">
                  <td className="px-4 py-2"><Link href={`/cities/${c.slug}`} className="font-medium text-brand-700 hover:underline">{c.city}</Link></td>
                  <td className="px-4 py-2 font-mono font-semibold tabular-nums text-ink">{dollars(c.minWage)}</td>
                  <td className="px-4 py-2 text-muted">{st ? <Link href={`/states/${st.slug}`} className="hover:underline">{st.name}</Link> : c.state}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-faint">
        Local minimum wages change frequently and several re-index mid-year. Confirm the current rate
        with the city or your state labor department.
      </p>
    </div>
  );
}
