import { POSTS } from "../lib/posts.ts";
import { relatedPosts, postsForCalculator } from "../lib/related.ts";
import { ok, eq, report } from "./_assert.mts";

// Related lists never include the post itself or repeat an entry, and every
// entry shares a calculator with the post (no arbitrary filler links).
for (const p of POSTS) {
  const rel = relatedPosts(p.slug);
  eq(new Set(rel.map((r) => r.slug)).size, rel.length, `${p.slug}: no duplicates`);
  ok(!rel.some((r) => r.slug === p.slug), `${p.slug}: excludes itself`);
  for (const r of rel) ok((r.related ?? []).some((c) => (p.related ?? []).includes(c)), `${p.slug} -> ${r.slug}: shares a calculator`);
  ok(rel.length <= 4, `${p.slug}: at most 4 related guides`);
}
eq(relatedPosts("no-such-post").length, 0, "unknown slug returns nothing");
for (const slug of ["double-time-calculator", "exempt-salary-calculator", "pto-payout-calculator", "back-pay-calculator"]) {
  ok(postsForCalculator(slug).length > 0, `${slug}: at least one guide links to it`);
}
report("related");
