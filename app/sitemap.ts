import type { MetadataRoute } from "next";
import { CALCULATORS } from "@/lib/calculators";
import { STATES } from "@/lib/states";
import { POSTS } from "@/lib/posts";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, priority: 1 },
    { url: `${SITE.url}/calculators`, lastModified: now, priority: 0.8 },
    { url: `${SITE.url}/states`, lastModified: now, priority: 0.8 },
    { url: `${SITE.url}/blog`, lastModified: now, priority: 0.7 },
    { url: `${SITE.url}/pricing`, lastModified: now, priority: 0.6 },
    { url: `${SITE.url}/methodology`, lastModified: now, priority: 0.5 },
  ];
  for (const c of CALCULATORS) urls.push({ url: `${SITE.url}/calculators/${c.slug}`, lastModified: now, priority: 0.9 });
  for (const s of STATES) urls.push({ url: `${SITE.url}/states/${s.slug}`, lastModified: now, priority: 0.7 });
  for (const p of POSTS) urls.push({ url: `${SITE.url}/blog/${p.slug}`, lastModified: now, priority: 0.6 });
  return urls;
}
