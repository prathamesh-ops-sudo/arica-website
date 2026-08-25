import type { Express, Request, Response } from "express";
import { timingSafeEqual } from "crypto";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { insertContactInquirySchema, insertBlogPostSchema, updateBlogPostSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { SITEMAP_STATIC_ROUTES } from "@shared/public-routes";

// App Runner's shared-NAT egress to the public SES endpoint
// (email.us-east-1.amazonaws.com) was timing out 100% of the time, so we
// route SES traffic through a VPC Interface Endpoint instead. The endpoint
// publishes private DNS for email.us-east-1.api.aws (SES's v2 hostname),
// which the v1 SDK is happy to call against; the previously-set
// connect/socket timeouts and retries are kept as a safety net.
const SES_CONNECT_TIMEOUT_MS = 5_000;
const SES_SOCKET_TIMEOUT_MS = 30_000;
const SES_MAX_ATTEMPTS = 5;
const SES_ENDPOINT_URL =
  process.env.SES_ENDPOINT_URL ?? "https://email.us-east-1.api.aws";

const sesClient = new SESClient({
  region: "us-east-1",
  endpoint: SES_ENDPOINT_URL,
  maxAttempts: SES_MAX_ATTEMPTS,
  requestHandler: new NodeHttpHandler({
    connectionTimeout: SES_CONNECT_TIMEOUT_MS,
    socketTimeout: SES_SOCKET_TIMEOUT_MS,
  }),
  ...(process.env.SES_ACCESS_KEY_ID && process.env.SES_SECRET_ACCESS_KEY ? {
    credentials: {
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
    }
  } : {})
});

const RECIPIENT_EMAILS = [
  "sohom.niyogi@aricatech.com",
  "prathamesh@aricatech.com",
];
const SENDER_EMAIL = "noreply@aricatech.com";

// --- Anti-spam helpers ----------------------------------------------------
// The contact form was being abused by drive-by spam bots (gibberish names,
// random "Bbbb" departments, "Pass" messages, throwaway gmail addresses).
// We layer cheap defences before anything reaches SES / the DB:
//   1. Honeypot field `website` — invisible to humans, auto-filled by bots.
//   2. Minimum fill time — submissions faster than 1.5s are bots.
//   3. Content shape checks — must have an alphabetic name, and the
//      email/phone (when provided) must look real.
// Cloudflare Turnstile (see verifyCaptchaToken) is the primary bot defence;
// the content-shape checks above are intentionally conservative so they do
// not reject legitimate humans.
const MIN_FORM_FILL_MS = 1_500;
const ALPHA_RATIO_THRESHOLD = 0.5; // ≥50% letters in `name`
const SPAM_MESSAGE_TOKENS = new Set([
  "pass",
  "test",
  "abc",
  "asdf",
  "aaa",
  "xxx",
  ".",
  "-",
  "1",
  "n/a",
  "na",
]);

function alphaRatio(value: string): number {
  if (!value) return 0;
  const letters = value.replace(/[^A-Za-z]/g, "").length;
  return letters / value.length;
}

function looksLikeRealEmail(email: string): boolean {
  // Block obviously fake patterns like a@a.com / x@x.com / test@test.com.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return false;
  const [local, domain] = email.toLowerCase().split("@");
  if (local.length < 2 || domain.length < 4) return false;
  const domainRoot = domain.split(".")[0];
  if (local === domainRoot && domainRoot.length <= 3) return false;
  return true;
}

function looksLikePhone(phone: string): boolean {
  // Optional field — when present, must look like a real phone number.
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return false;
  if (/^(\d)\1+$/.test(digits)) return false; // 1111111, 0000000, …
  return true;
}

type SpamCheckResult = { ok: true } | { ok: false; reason: string };

function detectSpam(body: {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  department?: unknown;
  message?: unknown;
  phone?: unknown;
  website?: unknown;
  formStartTs?: unknown;
}): SpamCheckResult {
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return { ok: false, reason: "honeypot_filled" };
  }

  if (typeof body.formStartTs === "number" && Number.isFinite(body.formStartTs)) {
    const elapsed = Date.now() - body.formStartTs;
    if (elapsed >= 0 && elapsed < MIN_FORM_FILL_MS) {
      return { ok: false, reason: `too_fast(${elapsed}ms)` };
    }
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (name.length < 2) return { ok: false, reason: "name_too_short" };
  if (alphaRatio(name) < ALPHA_RATIO_THRESHOLD) {
    return { ok: false, reason: "name_not_alpha" };
  }
  if (!looksLikeRealEmail(email)) return { ok: false, reason: "email_invalid" };
  if (company.length < 2) return { ok: false, reason: "company_too_short" };
  if (phone && !looksLikePhone(phone)) {
    return { ok: false, reason: "phone_invalid" };
  }

  // Message is optional. We don't gate on its length (real humans send short
  // messages like "Call me"); we only drop the handful of exact 1-token bot
  // payloads we've actually seen ("pass", "test", "asdf", …).
  const phonePrefix = `Phone: ${phone}`;
  const messageBody = phone && message.startsWith(phonePrefix)
    ? message.slice(phonePrefix.length).trim()
    : message;
  const isDefaultMessage = messageBody === "Contact form submission" || messageBody === "";
  if (!isDefaultMessage && SPAM_MESSAGE_TOKENS.has(messageBody.toLowerCase())) {
    return { ok: false, reason: "message_spam_token" };
  }

  return { ok: true };
}

async function verifyCaptchaToken(token: unknown, remoteIp: string | undefined): Promise<boolean> {
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (!turnstileSecret && !recaptchaSecret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[captcha] no verification secret configured in production");
      return false;
    }
    return true;
  }
  if (typeof token !== "string" || token.length === 0) return false;

  const provider = turnstileSecret ? "turnstile" : "recaptcha";
  const endpoint = turnstileSecret
    ? "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    : "https://www.google.com/recaptcha/api/siteverify";
  const secret = (turnstileSecret ?? recaptchaSecret)!;

  const params = new URLSearchParams({ secret, response: token });
  if (remoteIp) params.set("remoteip", remoteIp);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = (await res.json()) as {
      success?: boolean;
      score?: number;
      "error-codes"?: string[];
    };
    if (!data.success) {
      console.warn(
        `[captcha] ${provider} rejected token: ${(data["error-codes"] ?? []).join(",") || "no error codes"}`,
      );
      return false;
    }
    if (provider === "recaptcha" && typeof data.score === "number" && data.score < 0.5) {
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[captcha] ${provider} verify failed:`, (err as Error)?.message ?? err);
    return false;
  }
}

function clientIp(req: Request): string | undefined {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]!.trim();
  }
  return req.socket?.remoteAddress ?? undefined;
}

// Cap: 5 successful-or-failed contact submissions per IP per 15 minutes.
// App Runner sits behind CloudFront, so we read X-Forwarded-For via
// `keyGenerator` to get the actual client IP rather than the edge IP.
const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => clientIp(req as Request) ?? "unknown",
  handler: (req, res) => {
    console.warn(`[contact] rate limited ip=${clientIp(req as Request) ?? "unknown"}`);
    res.status(429).json({
      success: false,
      error: "Too many submissions from this network. Please try again later.",
    });
  },
});

async function sendContactEmail(data: {
  name: string;
  email: string;
  company: string;
  department: string;
  phone?: string;
  message?: string;
  preferredDate?: string;
}) {
  const subject = `New Contact Form Submission from ${data.name} — ${data.company}`;

  const bodyLines = [
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Department: ${data.department}`,
    `Email: ${data.email}`,
  ];
  if (data.phone) bodyLines.push(`Phone: ${data.phone}`);
  if (data.preferredDate) bodyLines.push(`Preferred Consultation Date: ${data.preferredDate}`);
  if (data.message) bodyLines.push(`\nMessage:\n${data.message}`);

  const htmlLines = [
    `<h2>New Contact Form Submission</h2>`,
    `<table style="border-collapse:collapse;width:100%;max-width:600px;">`,
    `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #ddd;">${data.name}</td></tr>`,
    `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Company</td><td style="padding:8px;border:1px solid #ddd;">${data.company}</td></tr>`,
    `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Department</td><td style="padding:8px;border:1px solid #ddd;">${data.department}</td></tr>`,
    `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td></tr>`,
  ];
  if (data.phone) {
    htmlLines.push(`<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #ddd;">${data.phone}</td></tr>`);
  }
  if (data.preferredDate) {
    htmlLines.push(`<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Preferred Date</td><td style="padding:8px;border:1px solid #ddd;">${data.preferredDate}</td></tr>`);
  }
  htmlLines.push(`</table>`);
  if (data.message) {
    htmlLines.push(`<h3>Message</h3><p style="white-space:pre-wrap;">${data.message}</p>`);
  }

  const command = new SendEmailCommand({
    Source: SENDER_EMAIL,
    Destination: {
      ToAddresses: RECIPIENT_EMAILS,
    },
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: {
        Text: { Data: bodyLines.join("\n"), Charset: "UTF-8" },
        Html: { Data: htmlLines.join("\n"), Charset: "UTF-8" },
      },
    },
  });

  const startedAt = Date.now();
  console.log(
    `[ses] sendContactEmail starting (to=${RECIPIENT_EMAILS.join(",")}, ` +
      `maxAttempts=${SES_MAX_ATTEMPTS}, connectTimeoutMs=${SES_CONNECT_TIMEOUT_MS})`,
  );
  try {
    const result = await sesClient.send(command);
    console.log(
      `[ses] sendContactEmail OK in ${Date.now() - startedAt}ms ` +
        `(MessageId=${result.MessageId ?? "unknown"}, ` +
        `attempts=${result.$metadata?.attempts ?? 1})`,
    );
    return result;
  } catch (err: any) {
    console.error(
      `[ses] sendContactEmail FAILED in ${Date.now() - startedAt}ms ` +
        `(attempts=${err?.$metadata?.attempts ?? "?"}, ` +
        `name=${err?.name}, code=${err?.code ?? err?.Code}, ` +
        `errno=${err?.errno}, address=${err?.address}): ${err?.message ?? err}`,
    );
    throw err;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/contact", contactRateLimiter, async (req, res) => {
    try {
      const { name, email, company, department, service, message, phone, preferredDate, website, formStartTs, captchaToken } = req.body;

      if (!name || !email || !company) {
        return res.status(400).json({
          success: false,
          error: "Name, Company Name, and Email are required.",
        });
      }

      const spam = detectSpam({ name, email, company, department, message, phone, website, formStartTs });
      if (!spam.ok) {
        const ip = clientIp(req) ?? "unknown";
        console.warn(`[contact] dropped spam ip=${ip} reason=${spam.reason} name=${String(name).slice(0, 40)} email=${String(email).slice(0, 60)}`);
        // Return a generic 400 — don't tell bots which check caught them.
        return res.status(400).json({
          success: false,
          error: "Submission rejected. Please review the form and try again.",
        });
      }

      const captchaOk = await verifyCaptchaToken(captchaToken, clientIp(req));
      if (!captchaOk) {
        const ip = clientIp(req) ?? "unknown";
        console.warn(`[contact] captcha failed ip=${ip} email=${String(email).slice(0, 60)}`);
        return res.status(400).json({
          success: false,
          error: "Captcha verification failed. Please refresh the page and try again.",
        });
      }

      const validatedData = insertContactInquirySchema.parse({
        name,
        email,
        company,
        service: service || "",
        message: message || "Contact form submission",
      });
      const inquiry = await storage.createContactInquiry(validatedData);

      // Send email via SES (non-blocking — don't fail the request if email fails)
      sendContactEmail({
        name,
        email,
        company: company || "",
        department: department || "",
        phone,
        message,
        preferredDate,
      }).then(() => {
        console.log("SES email sent successfully to:", RECIPIENT_EMAILS.join(", "));
      }).catch((err) => {
        console.error("Failed to send SES email:", err?.message || err);
      });

      res.status(201).json({ success: true, data: inquiry });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          error: validationError.message 
        });
      }
      console.error("Error creating contact inquiry:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to submit contact form" 
      });
    }
  });

  // --- Blog API ---
  const BLOG_API_KEY = process.env.BLOG_API_KEY || "";

  function requireBlogAuth(req: Request, res: Response, next: () => void) {
    const key = req.headers["x-api-key"] || req.headers["authorization"]?.replace("Bearer ", "");
    const suppliedKey = Array.isArray(key) ? key[0] : key;
    const keysMatch =
      typeof suppliedKey === "string" &&
      Buffer.byteLength(suppliedKey) === Buffer.byteLength(BLOG_API_KEY) &&
      timingSafeEqual(Buffer.from(suppliedKey), Buffer.from(BLOG_API_KEY));
    if (!BLOG_API_KEY || !keysMatch) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    next();
  }

  // Public: list published posts
  app.get("/api/blog", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = parseInt(req.query.offset as string) || 0;
      const tag = req.query.tag as string | undefined;
      const { posts, total } = await storage.getBlogPosts({ published: true, limit, offset });
      const filtered = tag ? posts.filter(p => p.tags?.includes(tag)) : posts;
      res.json({ success: true, posts: filtered, total, limit, offset });
    } catch (err) {
      console.error("[blog] list error:", err);
      res.status(500).json({ success: false, error: "Failed to fetch posts" });
    }
  });

  // Public: get single post by slug
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.published) {
        return res.status(404).json({ success: false, error: "Post not found" });
      }
      res.json({ success: true, post });
    } catch (err) {
      console.error("[blog] get error:", err);
      res.status(500).json({ success: false, error: "Failed to fetch post" });
    }
  });

  // Admin: create post
  app.post("/api/blog", requireBlogAuth, async (req, res) => {
    try {
      const data = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(data);
      if (post.published) notifySearchEngines([post.slug]);
      res.status(201).json({ success: true, post });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ success: false, error: fromZodError(error).message });
      }
      console.error("[blog] create error:", error);
      res.status(500).json({ success: false, error: "Failed to create post" });
    }
  });

  // Admin: update post
  app.put("/api/blog/:id", requireBlogAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: "Invalid ID" });
      const data = updateBlogPostSchema.parse(req.body);
      const post = await storage.updateBlogPost(id, data);
      if (!post) return res.status(404).json({ success: false, error: "Post not found" });
      if (post.published) notifySearchEngines([post.slug]);
      res.json({ success: true, post });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ success: false, error: fromZodError(error).message });
      }
      console.error("[blog] update error:", error);
      res.status(500).json({ success: false, error: "Failed to update post" });
    }
  });

  // Admin: delete post
  app.delete("/api/blog/:id", requireBlogAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: "Invalid ID" });
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) return res.status(404).json({ success: false, error: "Post not found" });
      res.json({ success: true });
    } catch (err) {
      console.error("[blog] delete error:", err);
      res.status(500).json({ success: false, error: "Failed to delete post" });
    }
  });

  // Admin: list all posts (including drafts)
  app.get("/api/blog-admin", requireBlogAuth, async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      const offset = parseInt(req.query.offset as string) || 0;
      const { posts, total } = await storage.getBlogPosts({ limit, offset });
      res.json({ success: true, posts, total, limit, offset });
    } catch (err) {
      console.error("[blog] admin list error:", err);
      res.status(500).json({ success: false, error: "Failed to fetch posts" });
    }
  });

  // --- IndexNow (instant Bing/Yandex indexing) ---
  const INDEXNOW_KEY = "e3246e8591479b789c7cdb1948750009";
  const SITE_URL = "https://www.aricatech.com";

  async function pingIndexNow(urls: string[]) {
    try {
      const payload = {
        host: "www.aricatech.com",
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      };
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(`[indexnow] pinged ${urls.length} URLs, status=${res.status}`);
    } catch (err) {
      console.warn("[indexnow] ping failed:", (err as Error)?.message);
    }
  }

  // Hook: after blog create/update, ping search engines
  function notifySearchEngines(slugs: string[]) {
    const urls = slugs.map((s) => `${SITE_URL}/blog/${s}`);
    urls.push(`${SITE_URL}/blog`);
    urls.push(`${SITE_URL}/sitemap.xml`);
    pingIndexNow(urls);
  }

  // --- Sitemap (enhanced with news namespace) ---
  const staticLastmod = (process.env.BUILD_DATE ?? new Date().toISOString()).slice(0, 10);

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      let slugs: { slug: string; updatedAt: Date }[] = [];
      try {
        slugs = await storage.getAllPublishedSlugs();
      } catch (error) {
        console.error("[sitemap] blog slug lookup failed:", error);
      }
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
      xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n`;
      xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

      for (const page of SITEMAP_STATIC_ROUTES) {
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}${page.path}</loc>\n`;
        xml += `    <lastmod>${staticLastmod}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += `  </url>\n`;
      }

      for (const { slug, updatedAt } of slugs) {
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}/blog/${slug}</loc>\n`;
        xml += `    <lastmod>${updatedAt.toISOString()}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }

      xml += `</urlset>`;
      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Cache-Control", "public, max-age=1800");
      res.send(xml);
    } catch (err) {
      console.error("[sitemap] error:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // --- robots.txt (enhanced with crawl directives) ---
  app.get("/robots.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send([
      "User-agent: *",
      "Allow: /",
      "",
      "# Sitemaps",
      `Sitemap: ${SITE_URL}/sitemap.xml`,
      "",
      "# AI/LLM crawlers",
      "User-agent: GPTBot",
      "Allow: /",
      "",
      "User-agent: Google-Extended",
      "Allow: /",
      "",
      "User-agent: ClaudeBot",
      "Allow: /",
      "",
      "User-agent: ChatGPT-User",
      "Allow: /",
      "",
      "User-agent: anthropic-ai",
      "Allow: /",
      "",
      "User-agent: CCBot",
      "Allow: /",
      "",
      "User-agent: PerplexityBot",
      "Allow: /",
      "",
    ].join("\n"));
  });

  return httpServer;
}
