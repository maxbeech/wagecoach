import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/posts";
import { BlogImage } from "@/components/BlogImage";
import { Eyebrow, SectionHeading } from "@/components/primitives";

export const revalidate = 604800; // weekly ISR

export const metadata: Metadata = {
  title: "Wage & Hour Guides",
  description: "Plain-English guides to U.S. wage and hour law: overtime, time and a half, minimum wage, exempt vs non-exempt, tipped pay, PTO payout and final paychecks.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <div>
      <Eyebrow>Guides</Eyebrow>
      <div className="mt-3">
        <SectionHeading
          as="h1"
          title="Wage & Hour Guides"
          sub="Practical, accurate guides to U.S. wage and hour law covering overtime, minimum wage, exemptions, tipped pay and final paychecks, for workers, managers and HR teams."
        />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {POSTS.map((p, i) => (
          <Link key={p.slug} href={`/blog/${p.slug}`}
            className="group block rounded-2xl border border-line bg-card shadow-card transition-colors hover:border-brand-300 hover:bg-brand-50 overflow-hidden">
            <BlogImage
              slug={p.slug}
              className="w-full h-36"
              priority={i === 0}
            />
            <div className="p-4">
              <div className="font-semibold text-ink group-hover:text-brand-700 transition-colors">{p.title}</div>
              <p className="mt-1 text-sm text-muted">{p.description}</p>
              <div className="mt-1 text-xs text-faint">{p.readMins} min read</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
