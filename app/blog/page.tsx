import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/posts";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "Wage & Hour Guides",
  description: "Plain-English guides to U.S. wage and hour law: overtime, time and a half, minimum wage, exempt vs non-exempt, tipped pay, PTO payout and final paychecks.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Wage & Hour Guides</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Practical, accurate guides to U.S. wage and hour law — overtime, minimum wage, exemptions, tipped
        pay and final paychecks — for workers, managers and HR teams.
      </p>
      <div className="mt-6 space-y-3">
        {POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`}
            className="block rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-300 hover:bg-emerald-50">
            <div className="font-semibold text-slate-900">{p.title}</div>
            <p className="mt-1 text-sm text-slate-600">{p.description}</p>
            <div className="mt-1 text-xs text-slate-500">{p.readMins} min read</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
