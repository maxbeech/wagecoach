import { readFileSync, existsSync } from "node:fs";
import { REDIRECTS } from "../lib/redirects.ts";
import { STATES } from "../lib/states.ts";
import { CITIES } from "../lib/cities.ts";
import { POSTS } from "../lib/posts.ts";
import { SITE } from "../lib/site.ts";
import { ok, eq, report } from "./_assert.mts";

// Guards for the 2026-10 spam-update recovery (docs/seo_recovery_2026_10.md):
// merged families stay merged, the sitemap lists exactly the indexable pages on
// the one canonical host, and no sitewide or all-X grid links into the families.
const sitemap = readFileSync("app/sitemap.ts", "utf8");
const robots = readFileSync("app/robots.ts", "utf8");

ok(SITE.url === `https://${SITE.domain}` && SITE.domain.startsWith("www."), "one canonical host (www)");
ok(sitemap.includes("SITE.url") && !sitemap.includes("http://") && !/https:\/\/[a-z]/.test(sitemap.replace(/`\$\{SITE\.url\}[^`]*`/g, "")), "sitemap builds every URL from SITE.url");
ok(robots.includes("SITE.url") && !robots.includes("http://"), "robots points at the canonical sitemap");
ok(sitemap.includes("STATES") && sitemap.includes("CITIES") && sitemap.includes("POSTS") && sitemap.includes("CALCULATORS"), "kept families are in the sitemap");
ok(!sitemap.includes("/wage-claim/${") && !sitemap.includes("pro-report") && !sitemap.includes("claim-kit"), "merged and noindex pages are not in the sitemap");

const sources = new Map(REDIRECTS.map((r) => [r.source, r.destination]));
for (const s of STATES) eq(sources.get(`/wage-claim/${s.slug}`), `/states/${s.slug}#wage-claim`, `/wage-claim/${s.slug} redirects into its state page`);
ok(!existsSync("app/wage-claim/[slug]"), "per-state wage-claim route is gone");
ok(!sources.has("/wage-claim") && existsSync("app/wage-claim/page.tsx"), "the estimator hub /wage-claim stays (checkout and header depend on it)");
for (const c of CITIES) ok(!sources.has(`/cities/${c.slug}`), `${c.slug}: kept city is not redirected`);

// No doorway-style all-X link grids.
const footer = readFileSync("components/SiteFooter.tsx", "utf8");
ok(!/href: "\/cities\/[a-z]/.test(footer) && !/href: "\/states\/[a-z]/.test(footer), "footer links to index pages only, not individual cities or states");
ok(readFileSync("app/states/[slug]/page.tsx", "utf8").includes(".slice(0, 12)"), "state page links to a capped set of other states");
ok(!/CITIES\.filter\(\(x\) => x\.slug !== c\.slug\)\.map/.test(readFileSync("app/cities/[slug]/page.tsx", "utf8")), "city page does not link to every other city");

// Every kept city has its own rate and source, and no two pages share a slug.
eq(new Set(CITIES.map((c) => c.slug)).size, CITIES.length, "city slugs are unique");
for (const c of CITIES) ok(c.minWage > 0 && c.source.startsWith("https://") && c.note.length > 20, `${c.slug}: own rate, note and source`);
eq(new Set(POSTS.map((p) => p.slug)).size, POSTS.length, "post slugs are unique");
report("seo-structure");
