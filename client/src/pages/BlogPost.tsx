import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, User, Tag } from "lucide-react";
import { getRelatedBlogPosts } from "@shared/blog-related";
import { consumeJsonPayload, getBlogPostSlugFromLocation } from "@/lib/blog-ssr";

interface BlogPostData {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  coverImage: string | null;
  author: string;
  tags: string[] | null;
  readingTime: number | null;
  publishedAt: string | null;
  updatedAt: string;
}

interface BlogPostPayload {
  post: BlogPostData;
  articleHtml: string;
  relatedPosts: RelatedPostData[];
}

interface RelatedPostData {
  slug: string;
  title: string;
  excerpt: string | null;
  tags: string[] | null;
  coverImage: string | null;
  publishedAt: string | null;
  readingTime: number | null;
}

function isBlogPost(value: unknown): value is BlogPostData {
  if (!value || typeof value !== "object") return false;
  const post = value as Partial<BlogPostData>;
  return (
    typeof post.id === "number" &&
    typeof post.slug === "string" &&
    typeof post.title === "string" &&
    typeof post.excerpt === "string" &&
    (post.coverImage === null || typeof post.coverImage === "string") &&
    typeof post.author === "string" &&
    (post.tags === null || (Array.isArray(post.tags) && post.tags.every((tag) => typeof tag === "string"))) &&
    (post.readingTime === null || typeof post.readingTime === "number") &&
    (post.publishedAt === null || typeof post.publishedAt === "string") &&
    typeof post.updatedAt === "string"
  );
}

function isRelatedPost(value: unknown): value is RelatedPostData {
  if (!value || typeof value !== "object") return false;
  const post = value as Partial<RelatedPostData>;
  return (
    typeof post.slug === "string" &&
    typeof post.title === "string" &&
    (post.excerpt === null || typeof post.excerpt === "string") &&
    (post.tags === null || (Array.isArray(post.tags) && post.tags.every((tag) => typeof tag === "string"))) &&
    (post.coverImage === null || typeof post.coverImage === "string") &&
    (post.publishedAt === null || typeof post.publishedAt === "string") &&
    (post.readingTime === null || typeof post.readingTime === "number")
  );
}

async function renderMarkdown(content: string): Promise<string> {
  const [{ marked }, { default: DOMPurify }] = await Promise.all([
    import("marked"),
    import("dompurify"),
  ]);

  return DOMPurify.sanitize(
    marked.parse(content, { async: false }) as string,
  ).replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi, "");
}

let payload: BlogPostPayload | null = (() => {
  const candidate = consumeJsonPayload<BlogPostPayload>("blog-post-data");
  if (
    !candidate ||
    !isBlogPost(candidate.post) ||
    typeof candidate.articleHtml !== "string" ||
    !Array.isArray(candidate.relatedPosts) ||
    !candidate.relatedPosts.every(isRelatedPost)
  ) {
    return null;
  }
  return candidate;
})();

function takeInitialPayload(): BlogPostPayload | null {
  const candidate = payload;
  payload = null;
  return candidate;
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const initialPayloadRef = useRef<BlogPostPayload | null | undefined>(undefined);
  if (initialPayloadRef.current === undefined) {
    const candidate = takeInitialPayload();
    initialPayloadRef.current =
      candidate && candidate.post.slug === getBlogPostSlugFromLocation() ? candidate : null;
  }
  const initialPayload = initialPayloadRef.current;
  const [post, setPost] = useState<BlogPostData | null>(() => initialPayload?.post || null);
  const [htmlContent, setHtmlContent] = useState<string | null>(
    () => initialPayload?.articleHtml || null,
  );
  const [loading, setLoading] = useState(!initialPayload);
  const [notFound, setNotFound] = useState(false);
  const [allPosts, setAllPosts] = useState<RelatedPostData[]>(
    () => initialPayload?.relatedPosts || [],
  );
  const initialPayloadUsed = useRef(Boolean(initialPayload));

  useEffect(() => {
    if (!params?.slug) return;

    if (initialPayloadUsed.current && initialPayload?.post.slug === params.slug) {
      initialPayloadUsed.current = false;
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setNotFound(false);
    setPost(null);
    setHtmlContent(null);

    const postRequest = fetch(`/api/blog/${encodeURIComponent(params.slug)}`, {
      signal: controller.signal,
    }).then((res) => {
      if (!res.ok) throw new Error("not found");
      return res.json();
    });
    const relatedRequest = fetch("/api/blog?limit=100", {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          throw error;
        }
        return null;
      });

    Promise.all([postRequest, relatedRequest])
      .then(async ([postData, relatedData]) => {
        if (!postData.success) throw new Error("not found");
        const nextPost = postData.post as BlogPostData;
        const nextHtml = await renderMarkdown(nextPost.content || "");
        if (relatedData?.success) setAllPosts(relatedData.posts);
        setPost(nextPost);
        setHtmlContent(nextHtml);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setNotFound(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <div className="max-w-3xl mx-auto px-6 pt-32 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-3/4 mb-4" />
          <div className="h-4 bg-white/10 rounded w-1/2 mb-8" />
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-5/6" />
            <div className="h-4 bg-white/10 rounded w-4/5" />
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <div className="max-w-3xl mx-auto px-6 pt-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blog">
            <span className="inline-flex items-center gap-2 text-[#3D70B7] hover:underline cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back to blog
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = getRelatedBlogPosts(post, allPosts);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      <article className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Link href="/blog">
            <span className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#3D70B7] transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> All articles
            </span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium uppercase tracking-wider text-[#42BA90] bg-[#42BA90]/10 px-2.5 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-gray-400 mb-6">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-white/10">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            {post.readingTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readingTime} min read
              </span>
            )}
          </div>
        </motion.header>

        {/* Cover image */}
        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10 rounded-xl overflow-hidden"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto max-h-[400px] object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-semibold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-[#3D70B7] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-code:text-[#42BA90] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-[#111118] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
            prose-blockquote:border-l-[#3D70B7] prose-blockquote:text-gray-400
            prose-ul:text-gray-300 prose-ol:text-gray-300
            prose-li:marker:text-[#3D70B7]
            prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: htmlContent || "" }}
        />

        <section className="mt-12 rounded-2xl border border-[#3D70B7]/30 bg-[#3D70B7]/5 p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">Need this in your own environment?</h2>
          <p className="mt-3 text-gray-300 leading-relaxed">
            Arica Tech Security runs VAPT, ISO 27001 readiness support, and digital forensics engagements for teams in India and beyond.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center rounded-full bg-[#3D70B7] px-5 font-semibold text-white hover:bg-[#3D70B7]/90"
            >
              Talk to our team
            </Link>
            <Link
              href="/services"
              className="inline-flex min-h-11 items-center rounded-full border border-[#42BA90]/50 px-5 font-semibold text-[#8de0c2] hover:bg-[#42BA90]/10"
            >
              Explore services
            </Link>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section aria-labelledby="related-reading" className="mt-16 pt-8 border-t border-white/10">
            <h2 id="related-reading" className="text-2xl font-semibold mb-5">
              Related reading
            </h2>
            <div className="grid gap-3">
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`}>
                  <span className="text-[#3D70B7] hover:underline">
                    {related.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <Link href="/blog">
            <span className="inline-flex items-center gap-2 text-[#3D70B7] hover:underline cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back to all articles
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
