import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calendar, Clock, ArrowRight, Tag, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { EtherealShadow } from "@/components/ui/ethereal-shadow";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  author: string;
  tags: string[] | null;
  readingTime: number | null;
  publishedAt: string | null;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.posts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags || []))
  ).sort();

  const filtered = posts.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <EtherealShadow />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-[#3D70B7] to-[#42BA90] bg-clip-text text-transparent">
              Security Insights
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Threat intelligence, industry best practices, and cybersecurity
            perspectives from the Arica Tech team.
          </motion.p>
        </div>
      </section>

      {/* Search + Tags */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3D70B7]/50 transition-colors"
            />
          </div>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  !selectedTag
                    ? "bg-[#3D70B7] text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedTag === tag
                      ? "bg-[#3D70B7] text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section
        className="max-w-6xl mx-auto px-6 pb-24"
        data-prerender-blog-listing
      >
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-white/10" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-30">
              <Tag className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              {posts.length === 0 ? "No posts yet" : "No matching posts"}
            </h3>
            <p className="text-gray-500">
              {posts.length === 0
                ? "Check back soon for cybersecurity insights and updates."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#3D70B7]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#3D70B7]/5 cursor-pointer h-full flex flex-col">
                    {post.coverImage && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-60" />
                      </div>
                    )}
                    {!post.coverImage && (
                      <div className="h-48 bg-gradient-to-br from-[#3D70B7]/20 to-[#42BA90]/20 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                          <Tag className="w-6 h-6 text-[#3D70B7]" />
                        </div>
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-medium uppercase tracking-wider text-[#42BA90] bg-[#42BA90]/10 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-[#3D70B7] transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          {post.publishedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          )}
                          {post.readingTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readingTime} min
                            </span>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#3D70B7] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
