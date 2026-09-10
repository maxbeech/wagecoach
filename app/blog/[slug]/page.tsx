import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost } from "@/lib/posts";
import { BlogImage } from "@/components/BlogImage";
import { getCalc } from "@/lib/calculators";
import { SITE } from "@/lib/site";
import { Eyebrow, SectionHeading } from "@/components/primitives";

export const revalidate = 604800; // weekly ISR

// Converts [label](url) patterns in post paragraphs to <a> links.
// Internal paths (/foo) stay in-app; external URLs open in a new tab.
function renderPara(text: string): React.ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!m) return part;
    const [, label, href] = m;
    const ext = href.startsWith("http");
    return (
      <a key={i} href={href} className="text-forest underline underline-offset-2 hover:text-brand-800"
        {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {label}
      </a>
    );
  });
}

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

// Pulls Q&A pairs out of a "Frequently asked questions" section for FAQPage schema.
// Every FAQ paragraph in lib/posts.ts follows "Question? Answer text.", split on the first "? ".
function extractFaq(body: typeof POSTS[number]["body"]): { q: string; a: string }[] {
  const sec = body.find((s) => s.h?.toLowerCase() === "frequently asked questions");
  if (!sec) return [];
  return sec.p.map((para) => {
    const idx = para.indexOf("? ");
    if (idx === -1) return null;
    return { q: para.slice(0, idx + 1), a: para.slice(idx + 2) };
  }).filter((x): x is { q: string; a: string } => x !== null);
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const related = (p.related ?? []).map(getCalc).filter(Boolean);
  const faq = extractFaq(p.body);

  return (
    <article className="mx-auto max-w-2xl">
      <nav className="mb-4 text-sm text-faint">
        <Link href="/blog" className="hover:text-ink">Guides</Link>
        <span className="mx-1.5">/</span><span className="text-muted">{p.title}</span>
      </nav>

      <BlogImage
        slug={p.slug}
        className="w-full aspect-[16/9] rounded-2xl mb-6"
        showCredit
        priority
      />

      <Eyebrow>Guides</Eyebrow>
      <div className="mt-3">
        <SectionHeading as="h1" title={p.title} sub={p.description} />
      </div>
      <div className="mt-2 text-xs text-faint">{p.readMins} min read</div>

      <div className="mt-6 space-y-5">
        {p.body.map((sec, i) => (
          <section key={i}>
            {sec.h && <h2 className="font-display text-lg font-semibold text-ink">{sec.h}</h2>}
            {sec.p.map((para, j) => (
              <p key={j} className="mt-2 text-[15px] leading-relaxed text-muted">{renderPara(para)}</p>
            ))}
            {sec.table && (
              <div className="mt-3 overflow-x-auto rounded-xl border border-line">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-brand-50">
                      {sec.table.headers.map((h, k) => (
                        <th key={k} className="px-3 py-2 font-semibold text-ink">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sec.table.rows.map((row, r) => (
                      <tr key={r} className="border-t border-line">
                        {row.map((cell, c) => (
                          <td key={c} className="px-3 py-2 align-top text-muted">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <div className="text-sm font-semibold text-ink">Try the calculator</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {related.map((c) => (
              <Link key={c!.slug} href={`/calculators/${c!.slug}`}
                className="rounded-full bg-forest px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800">
                {c!.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Article",
        headline: p.title, description: p.description, datePublished: p.date,
        image: `${SITE.url}/blog/posts/${p.slug}.jpg`,
        author: { "@type": "Organization", name: SITE.name },
        publisher: { "@type": "Organization", name: SITE.name },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${p.slug}` },
      }) }} />

      {faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }) }} />
      )}
    </article>
  );
}
