import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { insertContactInquirySchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NodeHttpHandler } from "@smithy/node-http-handler";

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
// We layer three cheap defences before anything reaches SES / the DB:
//   1. Honeypot field `website` — invisible to humans, auto-filled by bots.
//   2. Minimum fill time — submissions faster than 1.5s are bots.
//   3. Content shape checks — must have an alphabetic name, message length
//      must be reasonable, and the email/phone (when provided) must look real.
// A captcha layer can be added on top via env vars (see verifyCaptchaToken).
const MIN_FORM_FILL_MS = 1_500;
const ALPHA_RATIO_THRESHOLD = 0.5; // ≥50% letters in `name`
const MIN_MESSAGE_LENGTH = 10;
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
  const department = typeof body.department === "string" ? body.department.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";

  if (name.length < 2) return { ok: false, reason: "name_too_short" };
  if (alphaRatio(name) < ALPHA_RATIO_THRESHOLD) {
    return { ok: false, reason: "name_not_alpha" };
  }
  if (!looksLikeRealEmail(email)) return { ok: false, reason: "email_invalid" };
  if (company.length < 2) return { ok: false, reason: "company_too_short" };
  if (
    department.length >= 2 &&
    department.toLowerCase() === company.toLowerCase()
  ) {
    return { ok: false, reason: "company_equals_department" };
  }
  if (phone && !looksLikePhone(phone)) {
    return { ok: false, reason: "phone_invalid" };
  }

  // Message is optional in the schema but when present it should be
  // either obviously absent (server default) or a real message — not a
  // 1-character bot payload.
  const phonePrefix = `Phone: ${phone}`;
  const messageBody = phone && message.startsWith(phonePrefix)
    ? message.slice(phonePrefix.length).trim()
    : message;
  const isDefaultMessage = messageBody === "Contact form submission" || messageBody === "";
  if (!isDefaultMessage) {
    if (messageBody.length < MIN_MESSAGE_LENGTH) {
      return { ok: false, reason: "message_too_short" };
    }
    if (SPAM_MESSAGE_TOKENS.has(messageBody.toLowerCase())) {
      return { ok: false, reason: "message_spam_token" };
    }
  }

  return { ok: true };
}

// Captcha verification scaffold — disabled until a provider key is set.
// Set `TURNSTILE_SECRET_KEY` (Cloudflare Turnstile) or `RECAPTCHA_SECRET_KEY`
// (Google reCAPTCHA v3) to turn it on. The client sends the token as
// `captchaToken` in the JSON body; with no key configured this is a no-op
// so we can ship the honeypot/rate-limit defences first and layer captcha
// in once the user picks a provider.
async function verifyCaptchaToken(token: unknown, remoteIp: string | undefined): Promise<boolean> {
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (!turnstileSecret && !recaptchaSecret) return true; // captcha not enforced yet
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
    const data = (await res.json()) as { success?: boolean; score?: number };
    if (!data.success) return false;
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

  return httpServer;
}
