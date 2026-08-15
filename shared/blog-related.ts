export interface RelatedBlogPost {
  slug: string;
  title: string;
  excerpt?: string | null;
  tags?: string[] | null;
  publishedAt?: Date | string | null;
  createdAt?: Date | string | null;
}

const TOPIC_STOP_WORDS = new Set([
  "about", "after", "among", "being", "business", "businesses", "could",
  "cybersecurity", "every", "from", "guide", "india", "into", "their",
  "these", "this", "those", "using", "which", "with", "your",
]);

function topicTokens(post: RelatedBlogPost): Set<string> {
  const text = [
    ...(post.tags || []),
    post.title,
    post.excerpt || "",
  ].join(" ");
  return new Set(
    text
      .toLowerCase()
      .match(/[a-z]{5,}/g)
      ?.filter((token) => !TOPIC_STOP_WORDS.has(token)) || [],
  );
}

export function getRelatedBlogPosts<T extends RelatedBlogPost>(
  post: T,
  posts: readonly T[],
  limit = 3,
): T[] {
  const tags = new Set((post.tags || []).map((tag) => tag.toLowerCase()));
  const topics = topicTokens(post);

  return posts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      candidate,
      score: (candidate.tags || []).reduce(
        (score, tag) => score + (tags.has(tag.toLowerCase()) ? 5 : 0),
        0,
      ) + Array.from(topics).filter((token) => topicTokens(candidate).has(token)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const date = (value: Date | string | null | undefined) =>
        value ? new Date(value).getTime() : 0;
      return date(b.candidate.publishedAt || b.candidate.createdAt) -
        date(a.candidate.publishedAt || a.candidate.createdAt);
    })
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
