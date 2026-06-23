import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { storage } from "./storage";

const SITE_URL = "https://www.aricatech.com";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexHtml = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");

  // Hashed assets (JS, CSS) get long cache (1 year) since filenames change on rebuild
  app.use(
    "/assets",
    express.static(path.resolve(distPath, "assets"), {
      maxAge: "1y",
      immutable: true,
    })
  );

  // Static files (images, fonts, SW) get moderate cache (1 day) with revalidation
  app.use(
    express.static(distPath, {
      maxAge: "1d",
      setHeaders: (res, filePath) => {
        // Service worker must not be cached aggressively
        if (filePath.endsWith("sw.js")) {
          res.setHeader("Cache-Control", "no-cache");
        }
      },
    })
  );

  // Blog post routes get injected meta tags for SEO (Google sees title/desc/og without JS)
  app.use("/blog/:slug", async (req, res, next) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.published) {
        res.setHeader("Cache-Control", "no-cache");
        return res.send(indexHtml);
      }

      const escapedTitle = escapeHtml(`${post.title} | Arica Tech Security Blog`);
      const escapedExcerpt = escapeHtml(post.excerpt.slice(0, 160));
      const ogImage = post.coverImage || `${SITE_URL}/opengraph.jpg`;
      const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

      const articleSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "author": { "@type": "Person", "name": post.author },
        "datePublished": post.publishedAt?.toISOString(),
        "dateModified": post.updatedAt.toISOString(),
        "publisher": { "@type": "Organization", "name": "Arica Tech Security LLP", "url": SITE_URL },
        "mainEntityOfPage": canonicalUrl,
        ...(post.coverImage ? { "image": post.coverImage } : {}),
      });

      const metaTags = `
    <title>${escapedTitle}</title>
    <meta name="description" content="${escapedExcerpt}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapedTitle}" />
    <meta property="og:description" content="${escapedExcerpt}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapedTitle}" />
    <meta name="twitter:description" content="${escapedExcerpt}" />
    <meta name="twitter:image" content="${ogImage}" />
    <script type="application/ld+json">${articleSchema}</script>`;

      // Inject after <head> opening tag (before existing meta)
      const injectedHtml = indexHtml.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />${metaTags}`
      );

      res.setHeader("Cache-Control", "public, max-age=300");
      res.send(injectedHtml);
    } catch (err) {
      console.error("[blog-ssr] meta inject error:", err);
      res.setHeader("Cache-Control", "no-cache");
      res.send(indexHtml);
    }
  });

  // Blog listing page also gets custom meta
  app.use("/blog", (_req, res, next) => {
    if (_req.originalUrl !== "/blog" && _req.originalUrl !== "/blog/") return next();
    const metaTags = `
    <title>Blog | Arica Tech Security LLP</title>
    <meta name="description" content="Cybersecurity insights, threat intelligence updates, and industry best practices from the Arica Tech Security team." />
    <link rel="canonical" href="${SITE_URL}/blog" />
    <meta property="og:title" content="Blog | Arica Tech Security LLP" />
    <meta property="og:description" content="Cybersecurity insights, threat intelligence updates, and industry best practices." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE_URL}/blog" />`;

    const injectedHtml = indexHtml.replace(
      '<meta charset="UTF-8" />',
      `<meta charset="UTF-8" />${metaTags}`
    );
    res.setHeader("Cache-Control", "public, max-age=300");
    res.send(injectedHtml);
  });

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
