import { POSTS, type Post } from "./posts";

/**
 * Guides related to a post: those sharing a calculator first (most shared
 * first), then the neighbouring posts in list order, wrapping around, so every
 * guide receives a contextual link from the guides around it.
 */
export function relatedPosts(slug: string, limit = 6): Post[] {
  const i = POSTS.findIndex((p) => p.slug === slug);
  if (i === -1) return [];
  const mine = new Set(POSTS[i].related ?? []);
  const shared = (p: Post) => (p.related ?? []).filter((r) => mine.has(r)).length;
  const others = POSTS.filter((p) => p.slug !== slug);
  const bySharedCalc = others.filter((p) => shared(p) > 0).sort((a, b) => shared(b) - shared(a));
  const ring = POSTS.map((_, k) => POSTS[(i + 1 + k) % POSTS.length]).filter((p) => p.slug !== slug);
  const out: Post[] = [];
  for (const p of [...bySharedCalc.slice(0, Math.ceil(limit / 2)), ...ring, ...bySharedCalc]) {
    if (!out.includes(p)) out.push(p);
    if (out.length === limit) break;
  }
  return out;
}

/** Guides that point at a calculator (their `related` list names it). */
export function postsForCalculator(calcSlug: string, limit = 6): Post[] {
  return POSTS.filter((p) => (p.related ?? []).includes(calcSlug)).slice(0, limit);
}
