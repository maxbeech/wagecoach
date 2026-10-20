import { readFileSync } from "node:fs";
import { POSTS } from "../lib/posts.ts";
import { ok, eq, report } from "./_assert.mts";

// Blog integrity after the 2026 consolidation: every internal link resolves, FAQ sections parse
// for FAQPage JSON-LD, no dead image-category entries, and none of the removed products are promoted.
const slugs = new Set(POSTS.map((p) => p.slug));
eq(slugs.size, POSTS.length, "slugs are unique");

const CALC = new Set(
  [...readFileSync(new URL("../lib/calculators.ts", import.meta.url), "utf8").matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]),
);

for (const p of POSTS) {
  const text = p.body.flatMap((s) => [s.h ?? "", ...s.p, ...(s.table?.rows.flat() ?? [])]).join("\n");

  for (const [, , href] of text.matchAll(/\[([^\]]+)\]\((\/[^)]*)\)/g).map((m) => [m[0], m[1], m[2]])) {
    if (href.startsWith("/blog/")) ok(slugs.has(href.slice(6)), `${p.slug}: link to missing post ${href}`);
    if (href.startsWith("/calculators/")) ok(CALC.has(href.slice(13)), `${p.slug}: link to missing calculator ${href}`);
    ok(!/\/blog\/$/.test(href), `${p.slug}: trailing /blog/ link`);
  }
  for (const r of p.related ?? []) ok(CALC.has(r), `${p.slug}: related calculator ${r} does not exist`);

  ok(!text.includes("/blog/" + p.slug + ")"), `${p.slug}: links to itself`);
  ok(!/pro report|pro-report|free-case-review|case review|attorney matching/i.test(text), `${p.slug}: mentions a removed product`);
  ok(!/[—→]/.test(text + p.title + p.description), `${p.slug}: em dash or arrow`);
  ok(!/in our experience|composite|illustrative case/i.test(text), `${p.slug}: unverifiable first-person claim`);

  const faq = p.body.find((s) => s.h?.toLowerCase() === "frequently asked questions");
  if (faq) for (const para of faq.p) ok(para.indexOf("? ") > 0, `${p.slug}: FAQ paragraph without "? ": ${para.slice(0, 40)}`);

  const words = text.split(/\s+/).filter(Boolean).length;
  ok(words >= 700, `${p.slug}: only ${words} words`);
}

// blog-images.ts must not list slugs that no longer exist.
const img = readFileSync(new URL("../lib/blog-images.ts", import.meta.url), "utf8");
for (const [, s] of img.matchAll(/^\s*"([a-z0-9-]+)":/gm)) ok(slugs.has(s), `blog-images.ts lists removed slug ${s}`);

report("posts");
