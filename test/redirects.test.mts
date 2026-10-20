import { existsSync, readFileSync } from "node:fs";
import { REDIRECTS } from "../lib/redirects.ts";
import { POSTS } from "../lib/posts.ts";
import { STATES } from "../lib/states.ts";
import { eq, ok, report } from "./_assert.mts";

// Every redirect lands on a page that exists, nothing redirects twice, and the
// retired URLs (Pro report purchase, case review, per-state wage-claim pages) are
// out of the sitemap.
const posts = new Set(POSTS.map((p) => `/blog/${p.slug}`));
const states = new Set(STATES.map((s) => `/states/${s.slug}`));
const calcs = new Set([...readFileSync("lib/calculators.ts", "utf8").matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => `/calculators/${m[1]}`));
const sources = new Set(REDIRECTS.map((r) => r.source));

const live = (path: string) => {
  const p = path.split("#")[0];
  return p === "/blog" || p === "/wage-claim" || posts.has(p) || states.has(p) || calcs.has(p) || existsSync(`app${p}/page.tsx`);
};

eq(sources.size, REDIRECTS.length, "no duplicate sources");
for (const r of REDIRECTS) {
  ok(r.permanent === true, `${r.source}: permanent`);
  ok(live(r.destination), `${r.source} -> ${r.destination}: destination is a live page`);
  ok(!sources.has(r.destination.split("#")[0]), `${r.source}: no redirect chain`);
  ok(!posts.has(r.source), `${r.source}: a live post is never redirected away`);
}
for (const s of STATES) ok(sources.has(`/wage-claim/${s.slug}`), `/wage-claim/${s.slug} redirects to the state page`);
ok(sources.has("/free-case-review"), "the retired case review redirects");
ok(!existsSync("app/free-case-review"), "case review route is gone");
ok(!existsSync("app/wage-claim/[slug]"), "per-state wage-claim route is gone");

const sitemap = readFileSync("app/sitemap.ts", "utf8");
ok(!sitemap.includes("free-case-review") && !sitemap.includes("/wage-claim/${"), "retired URLs are not in the sitemap");
ok(sitemap.includes("/wage-watch"), "Wage Watch is in the sitemap");
ok(readFileSync("next.config.ts", "utf8").includes("REDIRECTS"), "next.config serves lib/redirects.ts");

report("redirects");
