import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Calendar, ArrowLeft } from "lucide-react";
import { LEGAL_POLICIES, getPolicyBySlug } from "@/content/legal";

export default function Legal() {
  const [, params] = useRoute("/legal/:slug");
  const policy = params?.slug ? getPolicyBySlug(params.slug) : undefined;

  useEffect(() => {
    if (policy) {
      document.title = `${policy.title} | Arica Tech Security LLP`;
    }
    window.scrollTo(0, 0);
  }, [policy]);

  if (!policy) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <div className="max-w-3xl mx-auto px-6 pt-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Policy Not Found</h1>
          <p className="text-gray-400 mb-8">
            The policy you're looking for doesn't exist.
          </p>
          <Link href="/">
            <span className="inline-flex items-center gap-2 text-[#3D70B7] hover:underline cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back home
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const htmlContent = DOMPurify.sanitize(
    marked.parse(policy.content, { async: false }) as string
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex flex-wrap gap-2 mb-10">
            {LEGAL_POLICIES.map((p) => (
              <Link key={p.slug} href={`/legal/${p.slug}`}>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border ${
                    p.slug === policy.slug
                      ? "bg-[#3D70B7] border-[#3D70B7] text-white"
                      : "border-white/15 text-gray-400 hover:text-white hover:border-white/40"
                  }`}
                >
                  {p.title}
                </span>
              </Link>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{policy.title}</h1>
          <p className="flex items-center gap-2 text-sm text-gray-500 mb-10">
            <Calendar className="w-4 h-4" />
            Last updated:{" "}
            {new Date(policy.lastUpdated).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <article
            className="prose prose-invert max-w-none
              prose-headings:text-white prose-headings:font-semibold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-li:text-gray-300
              prose-strong:text-white
              prose-a:text-[#3D70B7] prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </motion.div>
      </div>
    </div>
  );
}
