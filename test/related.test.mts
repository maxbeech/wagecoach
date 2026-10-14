import { POSTS } from "../lib/posts.ts";
import { relatedPosts, postsForCalculator } from "../lib/related.ts";
import { ok, eq, report } from "./_assert.mts";

// Every guide must receive an internal link from at least one other guide,
// and related lists never include the post itself or repeat an entry.
const inbound = new Map<string, number>();
for (const p of POSTS) {
  const rel = relatedPosts(p.slug);
  eq(new Set(rel.map((r) => r.slug)).size, rel.length, `${p.slug}: no duplicates`);
  ok(!rel.some((r) => r.slug === p.slug), `${p.slug}: excludes itself`);
  for (const r of rel) inbound.set(r.slug, (inbound.get(r.slug) ?? 0) + 1);
}
for (const p of POSTS) ok((inbound.get(p.slug) ?? 0) > 0, `${p.slug}: has an inbound related link`);
eq(relatedPosts("no-such-post").length, 0, "unknown slug returns nothing");
for (const slug of ["double-time-calculator", "exempt-salary-calculator", "pto-payout-calculator", "back-pay-calculator"]) {
  ok(postsForCalculator(slug).length > 0, `${slug}: at least one guide links to it`);
}
report("related");
