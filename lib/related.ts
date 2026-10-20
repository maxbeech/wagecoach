import { POSTS, type Post } from "./posts";

/**
 * Guides related to a post: only those that share a calculator with it, most
 * shared first. There is no filler from neighbouring posts, so every link is
 * between guides that really cover the same ground.
 */
export function relatedPosts(slug: string, limit = 4): Post[] {
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return [];
  const mine = new Set(post.related ?? []);
  const shared = (p: Post) => (p.related ?? []).filter((r) => mine.has(r)).length;
  return POSTS.filter((p) => p.slug !== slug && shared(p) > 0)
    .sort((a, b) => shared(b) - shared(a))
    .slice(0, limit);
}

/** Guides that point at a calculator (their `related` list names it). */
export function postsForCalculator(calcSlug: string, limit = 6): Post[] {
  return POSTS.filter((p) => (p.related ?? []).includes(calcSlug)).slice(0, limit);
}
