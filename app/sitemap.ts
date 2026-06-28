import type { MetadataRoute } from "next";
import { CALCULATORS } from "@/lib/calculators";
import { STATES } from "@/lib/states";
import { CITIES } from "@/lib/cities";
import { POSTS } from "@/lib/posts";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(SITE.updated);
  const urls: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: updated, priority: 1 },
    { url: `${SITE.url}/calculators`, lastModified: updated, priority: 0.8 },
    { url: `${SITE.url}/wage-claim`, lastModified: updated, priority: 0.8 },
    { url: `${SITE.url}/free-case-review`, lastModified: updated, priority: 0.6 },
    { url: `${SITE.url}/states`, lastModified: updated, priority: 0.8 },
    { url: `${SITE.url}/cities`, lastModified: updated, priority: 0.8 },
    { url: `${SITE.url}/blog`, lastModified: updated, priority: 0.7 },
    { url: `${SITE.url}/pricing`, lastModified: updated, priority: 0.6 },
    { url: `${SITE.url}/methodology`, lastModified: updated, priority: 0.5 },
  ];
  for (const c of CALCULATORS) urls.push({ url: `${SITE.url}/calculators/${c.slug}`, lastModified: updated, priority: 0.9 });
  for (const s of STATES) urls.push({ url: `${SITE.url}/states/${s.slug}`, lastModified: updated, priority: 0.7 });
  for (const s of STATES) urls.push({ url: `${SITE.url}/wage-claim/${s.slug}`, lastModified: updated, priority: 0.7 });
  for (const c of CITIES) urls.push({ url: `${SITE.url}/cities/${c.slug}`, lastModified: updated, priority: 0.7 });
  for (const p of POSTS) urls.push({ url: `${SITE.url}/blog/${p.slug}`, lastModified: new Date(p.date), priority: 0.6 });
  return urls;
}
