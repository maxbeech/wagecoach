import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost } from "@/lib/posts";
import { getCalc } from "@/lib/calculators";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.description },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const related = (p.related ?? []).map(getCalc).filter(Boolean);

  return (
    <article className="mx-auto max-w-2xl">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/blog" className="hover:text-slate-900">Guides</Link>
        <span className="mx-1.5">/</span><span className="text-slate-700">{p.title}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{p.title}</h1>
      <p className="mt-2 text-slate-600">{p.description}</p>
      <div className="mt-1 text-xs text-slate-400">{p.readMins} min read</div>

      <div className="mt-6 space-y-5">
        {p.body.map((sec, i) => (
          <section key={i}>
            {sec.h && <h2 className="text-lg font-bold text-slate-900">{sec.h}</h2>}
            {sec.p.map((para, j) => (
              <p key={j} className="mt-2 text-[15px] leading-relaxed text-slate-700">{para}</p>
            ))}
          </section>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-slate-900">Try the calculator</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {related.map((c) => (
              <Link key={c!.slug} href={`/calculators/${c!.slug}`}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700">
                {c!.name} →
              </Link>
            ))}
          </div>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: p.title, description: p.description, datePublished: p.date,
        author: { "@type": "Organization", name: SITE.name },
        publisher: { "@type": "Organization", name: SITE.name },
      }) }} />
    </article>
  );
}
