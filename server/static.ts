import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import sanitizeHtml from "sanitize-html";
import { storage } from "./storage";
import {
  isKnownLegalRoute,
  isKnownStaticRoute,
  STATIC_ROUTE_ALIASES,
} from "@shared/public-routes";
import {
  SITE_LEGAL_LINKS,
  SITE_NAVIGATION_LINKS,
  type SiteNavigationLink,
} from "@shared/site-navigation";
import { getRelatedBlogPosts } from "@shared/blog-related";

const SITE_URL = "https://www.aricatech.com";
const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 155;
const loadMarked = new Function(
  "return import('marked')",
) as () => Promise<typeof import("marked")>;
const STATIC_METADATA: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Cybersecurity Consulting & VAPT Services | Arica Tech",
    description: "Arica Tech Security provides VAPT, ISO 27001 audit support, secure software development, and practical cybersecurity consulting.",
  },
  "/about": {
    title: "About Arica Tech Security | Cybersecurity Consultancy",
    description: "Learn about Arica Tech Security's defense-in-depth approach to vulnerability assessment, compliance support, and secure technology delivery.",
  },
  "/services": {
    title: "Cybersecurity Services | VAPT, ISO Support & Secure Software",
    description: "Explore VAPT, ISO 27001 audit support, and secure software development services designed to strengthen security throughout the technology lifecycle.",
  },
  "/contact": {
    title: "Contact Arica Tech Security | Request Security Support",
    description: "Contact Arica Tech Security to discuss VAPT, ISO 27001 audit support, secure software development, or a practical security assessment.",
  },
  "/case-studies": {
    title: "Cybersecurity Case Studies | Arica Tech Security",
    description: "Review anonymised cybersecurity engagement scenarios covering VAPT, ISO readiness, secure software, cloud environments, and security architecture.",
  },
  "/team": {
    title: "Arica Tech Security Team | Security Professionals",
    description: "Meet the Arica Tech Security team and learn about the experience behind our security assessments, consulting, and implementation work.",
  },
  "/certifications": {
    title: "ISO 27001 & Security Framework Support | Arica Tech",
    description: "Explore Arica Tech Security's framework expertise and client support for ISO 27001, privacy, payment, continuity, and related security programs.",
  },
  "/attack-globe": {
    title: "Attack Surface Simulation | Arica Tech Security",
    description: "Explore an interactive cybersecurity simulation illustrating attack-surface concepts and security assessment workflows. It is not live telemetry.",
  },
  "/vulnerability-scanner": {
    title: "Vulnerability Scanner Demo | Arica Tech Security",
    description: "Explore an illustrative vulnerability-scanning demonstration covering common findings and assessment concepts, not live monitoring.",
  },
  "/compliance-dashboard": {
    title: "ISMS Readiness Dashboard Demo | Arica Tech Security",
    description: "Explore an illustrative client ISMS readiness dashboard showing example controls and engagement stages, not Arica Tech's certification status.",
  },
  "/devsecops": {
    title: "DevSecOps Security Pipeline | Arica Tech Security",
    description: "Explore an interactive DevSecOps demonstration showing security checks across source code, dependencies, containers, and delivery workflows.",
  },
  "/devsecops-pipeline": {
    title: "DevSecOps Pipeline Demo | Arica Tech Security",
    description: "Explore an illustrative DevSecOps pipeline with example security checks that can be integrated into modern software delivery workflows.",
  },
  "/api-security-lab": {
    title: "API Security Lab Demo | Arica Tech Security",
    description: "Explore an interactive API security lab covering authentication, exposure, injection, and endpoint assessment concepts.",
  },
  "/cloud-security-center": {
    title: "Cloud Security Assessment Demo | Arica Tech Security",
    description: "Explore an illustrative cloud security center covering identity, policy, configuration, and risk assessment concepts.",
  },
  "/mobile-security": {
    title: "Mobile Application Security Lab | Arica Tech Security",
    description: "Explore an interactive mobile security lab covering common application, storage, communication, authentication, and code risks.",
  },
  "/risk-assessment": {
    title: "Cybersecurity Risk Assessment Demo | Arica Tech Security",
    description: "Explore an illustrative risk assessment workflow for identifying threats, evaluating likelihood and impact, and prioritising security work.",
  },
  "/security-policies": {
    title: "Information Security Policy Viewer | Arica Tech Security",
    description: "Explore an interactive information security policy viewer covering governance, access, data handling, incident response, and continuity topics.",
  },
  "/security-architecture": {
    title: "Security Architecture Assessment | Arica Tech Security",
    description: "Explore an interactive security architecture model covering network, endpoint, application, identity, and data protection layers.",
  },
  "/code-review": {
    title: "Secure Code Review Demo | Arica Tech Security",
    description: "Explore an illustrative secure code review tool covering vulnerability categories, code quality considerations, and remediation workflows.",
  },
  "/security-training": {
    title: "Cybersecurity Training Demo | Arica Tech Security",
    description: "Explore an interactive cybersecurity training demonstration covering foundational security, phishing, passwords, data handling, and incident reporting.",
  },
  "/ongoing-support": {
    title: "Ongoing Cybersecurity Support | Arica Tech Security",
    description: "Explore ongoing security support concepts including monitoring, vulnerability management, threat intelligence, incident response, and advisory work.",
  },
  "/security-implementation": {
    title: "Security Implementation Planning | Arica Tech Security",
    description: "Explore an illustrative security implementation workflow from assessment and architecture through controls, testing, training, and optimisation.",
  },
  "/experience": {
    title: "Security Experience | Arica Tech Security",
    description: "Explore Arica Tech Security's interactive 3D cybersecurity experience and demonstrations.",
  },
  "/legal/privacy-policy": {
    title: "Privacy Policy | Arica Tech Security LLP",
    description: "Read Arica Tech Security's privacy policy covering personal data handling, purposes, rights, safeguards, and contact information.",
  },
  "/legal/cookies-policy": {
    title: "Cookies Policy | Arica Tech Security LLP",
    description: "Read Arica Tech Security's Cookies Policy covering necessary, performance and analytics, and targeting and marketing cookies.",
  },
  "/legal/information-security-policy": {
    title: "Information Security Policy | Arica Tech Security LLP",
    description: "Read Arica Tech Security's information security policy and the principles guiding protection of information and technology.",
  },
  "/legal/third-party-data-vendor-policy": {
    title: "Third-Party Data & Vendor Policy | Arica Tech",
    description: "Read Arica Tech Security's third-party data and vendor policy covering supplier safeguards, processing, oversight, and responsibilities.",
  },
  "/thank-you": {
    title: "Thank You | Arica Tech Security LLP",
    description: "Confirmation that your message was received by Arica Tech Security.",
  },
};

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexHtml = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
  const prerenderedPath = path.resolve(distPath, "prerendered");

  function getPrerenderedHtml(routePath: string): string | undefined {
    const filename = `${routePath === "/" ? "__root" : routePath.slice(1).replaceAll("/", "__")}.html`;
    const filePath = path.join(prerenderedPath, filename);
    if (!fs.existsSync(filePath)) return undefined;
    return fs.readFileSync(filePath, "utf-8");
  }

  function getBaseHtml(routePath: string): string {
    return getPrerenderedHtml(routePath) ?? indexHtml;
  }

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
      index: false,
      redirect: false,
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
        return res.status(404).send(indexHtml);
      }

      const escapedTitle = escapeHtml(formatBlogTitle(post.title));
      const escapedExcerpt = escapeHtml(formatBlogDescription(post.excerpt));
      const ogImage = post.coverImage || `${SITE_URL}/opengraph.jpg`;
      const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

      // Extract FAQ sections from markdown for FAQ schema
      const faqItems: { question: string; answer: string }[] = [];
      const faqRegex = /###\s+(.+?)\n\n([\s\S]*?)(?=\n###|\n## |$)/g;
      let faqMatch;
      while ((faqMatch = faqRegex.exec(post.content)) !== null) {
        const q = faqMatch[1].trim();
        const a = faqMatch[2].trim().replace(/\n/g, " ").slice(0, 500);
        if (q.endsWith("?")) faqItems.push({ question: q, answer: a });
      }

      const schemaGraph: Record<string, unknown>[] = [
        {
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "author": { "@type": "Person", "name": post.author, "jobTitle": "Chief Technology Officer", "worksFor": { "@type": "Organization", "name": "Arica Tech Security LLP" } },
          "datePublished": post.publishedAt?.toISOString(),
          "dateModified": post.updatedAt.toISOString(),
          "publisher": { "@type": "Organization", "name": "Arica Tech Security LLP", "url": SITE_URL, "logo": { "@type": "ImageObject", "url": `${SITE_URL}/arica-logo.png` } },
          "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
          ...(post.coverImage ? { "image": post.coverImage } : {}),
          ...(post.tags ? { "keywords": post.tags.join(", ") } : {}),
          "wordCount": post.content.split(/\s+/).length,
          "timeRequired": `PT${post.readingTime || 5}M`,
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog` },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl },
          ],
        },
      ];

      if (faqItems.length > 0) {
        schemaGraph.push({
          "@type": "FAQPage",
          "mainEntity": faqItems.map((f) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer },
          })),
        });
      }

      const structuredData = JSON.stringify({ "@context": "https://schema.org", "@graph": schemaGraph });
      const articleHtml = (await renderSanitizedMarkdown(post.content, distPath))
        .replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi, "");
      let relatedPosts: typeof post[] = [];
      try {
        const { posts } = await storage.getBlogPosts({ published: true, limit: 100 });
        relatedPosts = getRelatedBlogPosts(post, posts);
      } catch (error) {
        console.warn("[blog-related] database unavailable; omitting related posts:", error);
      }
      const relatedHtml = relatedPosts.length > 0
        ? `
            <section aria-labelledby="related-reading">
              <h2 id="related-reading">Related reading</h2>
              <ul>
                ${relatedPosts.map((related) => `
                  <li><a href="/blog/${encodeURIComponent(related.slug)}">${escapeHtml(related.title)}</a></li>
                `).join("")}
              </ul>
            </section>`
        : "";
      const articleRoot = `
        <header>${renderInternalNavigation()}</header>
        <main class="prerendered-blog-content">
          <article>
            <h1>${escapeHtml(post.title)}</h1>
            <p>${escapeHtml(post.excerpt)}</p>
            <p>By ${escapeHtml(post.author)}</p>
            <div>${articleHtml}</div>
            ${relatedHtml}
          </article>
        </main>
        <footer>
          ${[...SITE_LEGAL_LINKS, ["/contact", "Contact"] as const]
            .map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`)
            .join(" ")}
          <p>© ${new Date().getFullYear()} Arica Tech Security LLP. All rights reserved.</p>
        </footer>`;

      const metaTags = `
    <title>${escapedTitle}</title>
    <meta name="description" content="${escapedExcerpt}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapedTitle}" />
    <meta property="og:description" content="${escapedExcerpt}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:site_name" content="Arica Tech Security" />
    <meta property="article:published_time" content="${post.publishedAt?.toISOString() || ""}" />
    <meta property="article:modified_time" content="${post.updatedAt.toISOString()}" />
    <meta property="article:author" content="${post.author}" />
    ${(post.tags || []).map(t => `<meta property="article:tag" content="${escapeHtml(t)}" />`).join("\n    ")}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapedTitle}" />
    <meta name="twitter:description" content="${escapedExcerpt}" />
    <meta name="twitter:image" content="${ogImage}" />
    <script type="application/ld+json">${structuredData}</script>`;

      // Inject after <head> opening tag (before existing meta)
      const injectedHtml = injectAfterCharset(
        stripBaseMetadata(indexHtml)
          .replace('<div id="root"></div>', `<div id="root">${articleRoot}</div>`),
        metaTags,
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
  app.use("/blog", async (_req, res, next) => {
    if (_req.originalUrl !== "/blog" && _req.originalUrl !== "/blog/") return next();

    const breadcrumb = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog` },
      ],
    });

    const metaTags = `
    <title>Blog | Arica Tech Security LLP</title>
    <meta name="description" content="Cybersecurity insights, threat intelligence updates, and industry best practices from the Arica Tech Security team." />
    <link rel="canonical" href="${SITE_URL}/blog" />
    <meta property="og:title" content="Blog | Arica Tech Security LLP" />
    <meta property="og:description" content="Cybersecurity insights, threat intelligence updates, and industry best practices." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE_URL}/blog" />
    <meta property="og:site_name" content="Arica Tech Security" />
    <meta property="og:image" content="${SITE_URL}/opengraph.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Blog | Arica Tech Security LLP" />
    <meta name="twitter:description" content="Cybersecurity insights, threat intelligence updates, and industry best practices." />
    <meta name="twitter:image" content="${SITE_URL}/opengraph.jpg" />
    <script type="application/ld+json">${breadcrumb}</script>`;

    let baseHtml = stripBreadcrumbStructuredData(stripBaseMetadata(getBaseHtml("/blog")));
    try {
      const { posts } = await storage.getBlogPosts({ published: true, limit: 100 });
      const listingRoot = `
        <section class="max-w-6xl mx-auto px-6 pb-24 prerendered-blog-listing" data-prerender-blog-listing>
          <div class="blog-post-list">
            ${posts.map((post) => `
              <article>
                <h2><a href="/blog/${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h2>
                <p>${escapeHtml(post.excerpt)}</p>
                <time datetime="${post.publishedAt?.toISOString() || post.updatedAt.toISOString()}">
                  ${escapeHtml((post.publishedAt || post.updatedAt).toISOString().slice(0, 10))}
                </time>
              </article>`).join("\n")}
          </div>
        </section>`;
      baseHtml = replaceBlogListingContent(baseHtml, listingRoot);
    } catch (error) {
      console.warn("[blog-listing] database unavailable; serving captured listing content:", error);
    }

    const injectedHtml = injectAfterCharset(baseHtml, metaTags);
    res.setHeader("Cache-Control", "public, max-age=300");
    res.send(injectedHtml);
  });

  app.use("*", (req, res, next) => {
    const routePath = new URL(req.originalUrl, "http://localhost").pathname.replace(/\/$/, "") || "/";
    const canonicalPath = STATIC_ROUTE_ALIASES[routePath] || routePath;
    const metadata = STATIC_METADATA[canonicalPath];
    if (!metadata || !isKnownStaticRoute(routePath)) {
      if (
        routePath.startsWith("/blog/") ||
        (routePath.startsWith("/legal/") && !isKnownLegalRoute(routePath))
      ) {
        return res.status(404).send(indexHtml);
      }
      return next();
    }

    const canonicalUrl = `${SITE_URL}${canonicalPath}`;
    const escapedTitle = escapeHtml(metadata.title);
    const escapedDescription = escapeHtml(metadata.description);
    const noindex = routePath === "/thank-you"
      ? '\n    <meta name="robots" content="noindex, nofollow" />'
      : routePath === "/experience"
        ? '\n    <meta name="robots" content="noindex, follow" />'
        : "";
    const injectedHtml = injectAfterCharset(
      getBaseHtml(canonicalPath)
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapedTitle}</title>`)
        .replace(/<meta name="description"[^>]*\/?>/g, "")
        .replace(/<meta name="robots"[^>]*\/?>/g, "")
        .replace(/<link rel="canonical"[^>]*\/?>/g, "")
        .replace(/<meta property="og:title"[^>]*\/?>/, `<meta property="og:title" content="${escapedTitle}" />`)
        .replace(/<meta property="og:description"[^>]*\/?>/, `<meta property="og:description" content="${escapedDescription}" />`)
        .replace(/<meta property="og:url"[^>]*\/?>/g, `<meta property="og:url" content="${canonicalUrl}" />`)
        .replace(/<meta name="twitter:title"[^>]*\/?>/, `<meta name="twitter:title" content="${escapedTitle}" />`)
        .replace(/<meta name="twitter:description"[^>]*\/?>/, `<meta name="twitter:description" content="${escapedDescription}" />`),
      `\n    <meta name="description" content="${escapedDescription}" />\n    <link rel="canonical" href="${canonicalUrl}" />${noindex}`,
    );

    res.setHeader("Cache-Control", "public, max-age=300");
    res.send(injectedHtml);
  });

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.status(404).sendFile(path.resolve(distPath, "index.html"));
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function renderSanitizedMarkdown(
  markdown: string,
  publicRoot: string,
): Promise<string> {
  const { marked } = await loadMarked();
  const sanitized = sanitizeHtml(marked.parse(markdown, { async: false }) as string, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags.filter(
        (tag) => !["iframe", "script", "style", "svg"].includes(tag),
      ),
      "figure",
      "figcaption",
      "h1",
      "h2",
      "h3",
      "h4",
      "img",
      "pre",
      "code",
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "loading"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      a: ["http", "https", "mailto"],
      img: ["http", "https"],
    },
    allowProtocolRelative: false,
  });
  return addIntrinsicImageDimensions(sanitized, publicRoot);
}

function addIntrinsicImageDimensions(html: string, publicRoot: string): string {
  return html.replace(
    /<img\b([^>]*?)(\/?)>/gi,
    (full, attributes: string, closing: string) => {
      if (/\bwidth\s*=|\bheight\s*=/i.test(attributes)) return full;
      const source = attributes.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
      if (!source) return full;
      const dimensions = resolveImageDimensions(source, publicRoot);
      if (!dimensions) return full;
      return `<img${attributes} width="${dimensions.width}" height="${dimensions.height}"${closing}>`;
    },
  );
}

function resolveImageDimensions(
  source: string,
  publicRoot: string,
): { width: number; height: number } | undefined {
  let pathname: string;
  try {
    const url = new URL(source, SITE_URL);
    if (url.origin !== SITE_URL) return undefined;
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return undefined;
  }
  const filePath = path.resolve(publicRoot, `.${pathname}`);
  if (filePath !== publicRoot && !filePath.startsWith(`${publicRoot}${path.sep}`)) {
    return undefined;
  }
  let data: Buffer;
  try {
    data = fs.readFileSync(filePath);
  } catch {
    return undefined;
  }
  if (data.length >= 24 && data.readUInt32BE(0) === 0x89504e47) {
    return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  }
  if (
    data.length >= 30 &&
    data.toString("ascii", 0, 4) === "RIFF" &&
    data.toString("ascii", 8, 12) === "WEBP"
  ) {
    const format = data.toString("ascii", 12, 16);
    if (format === "VP8X") {
      return {
        width: 1 + data.readUIntLE(24, 3),
        height: 1 + data.readUIntLE(27, 3),
      };
    }
    const frameStart = data.indexOf(Buffer.from([0x9d, 0x01, 0x2a]));
    if (format === "VP8 " && frameStart >= 0 && data.length >= frameStart + 7) {
      return {
        width: data.readUInt16LE(frameStart + 3) & 0x3fff,
        height: data.readUInt16LE(frameStart + 5) & 0x3fff,
      };
    }
  }
  if (data.length >= 4 && data[0] === 0xff && data[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < data.length) {
      if (data[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = data[offset + 1];
      const length = data.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3) {
        return {
          width: data.readUInt16BE(offset + 7),
          height: data.readUInt16BE(offset + 5),
        };
      }
      offset += 2 + length;
    }
  }
  return undefined;
}

function formatBlogTitle(title: string): string {
  const suffix = " | Arica Tech";
  return title.length + suffix.length <= MAX_TITLE_LENGTH
    ? `${title}${suffix}`
    : title;
}

function formatBlogDescription(excerpt: string): string {
  if (excerpt.length <= MAX_DESCRIPTION_LENGTH) return excerpt;
  const sentences = excerpt.match(/[^.!?]+[.!?]+/g) ?? [];
  let complete = "";
  for (const sentence of sentences) {
    const candidate = `${complete}${sentence}`;
    if (candidate.length > MAX_DESCRIPTION_LENGTH) break;
    complete = candidate;
  }
  return complete.trim() || excerpt;
}

function stripBaseMetadata(html: string): string {
  return html
    .replace(/<title>[\s\S]*?<\/title>/g, "")
    .replace(/<meta name="description"[^>]*\/?>/g, "")
    .replace(/<link rel="canonical"[^>]*\/?>/g, "")
    .replace(/<meta property="og:[^"]+"[^>]*\/?>/g, "")
    .replace(/<meta name="twitter:[^"]+"[^>]*\/?>/g, "");
}

function stripBreadcrumbStructuredData(html: string): string {
  return html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/g,
    (script) => script.includes('"BreadcrumbList"') ? "" : script,
  );
}

function replaceRootContent(html: string, content: string): string {
  return html.replace(
    /<div id="root">[\s\S]*<\/div>(?=\s*(?:<script|<\/body>))/,
    `<div id="root">${content}</div>`,
  );
}

function replaceBlogListingContent(html: string, content: string): string {
  const listingSectionPattern =
    /<section\b[^>]*data-prerender-blog-listing(?:="[^"]*")?[^>]*>[\s\S]*?<\/section>/;
  if (listingSectionPattern.test(html)) {
    return html.replace(listingSectionPattern, content);
  }
  console.error(
    "[blog-listing] data-prerender-blog-listing marker missing; falling back to root replacement",
  );
  return replaceRootContent(html, content);
}

function renderInternalNavigation(): string {
  const navigationLinks: readonly SiteNavigationLink[] = [
    ["/", "Home"],
    ...SITE_NAVIGATION_LINKS,
    ...SITE_LEGAL_LINKS,
  ];
  const links = navigationLinks
    .map(([routePath, label]: SiteNavigationLink) => `<a href="${routePath}">${escapeHtml(label)}</a>`)
    .join("\n");
  return `
    <nav aria-label="Site navigation" class="prerendered-site-navigation"
      style="display:flex;flex-wrap:wrap;gap:0.75rem 1.25rem;align-items:center;padding:1rem 1.5rem;margin:0 auto 2rem;max-width:72rem;border-bottom:1px solid rgba(255,255,255,0.12);font-size:0.875rem">
      ${links}
    </nav>`;
}

function injectAfterCharset(html: string, content: string): string {
  return html.replace(
    /<meta charset="UTF-8"\s*\/?>/,
    (charset) => `${charset}${content}`,
  );
}
