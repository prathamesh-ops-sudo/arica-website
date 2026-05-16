import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactInquirySchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NodeHttpHandler } from "@smithy/node-http-handler";

// SES SendEmail from App Runner has been hitting OS-level TCP timeouts
// (ETIMEDOUT after ~2 min) when DNS returns an SES IP that's unreachable
// from App Runner's egress. We bound each TCP connect to 5s and rely on
// the SDK's standard retry strategy (5 attempts) so a bad IP fails fast
// and the next attempt is likely to resolve to a different healthy IP.
const SES_CONNECT_TIMEOUT_MS = 5_000;
const SES_SOCKET_TIMEOUT_MS = 30_000;
const SES_MAX_ATTEMPTS = 5;

const sesClient = new SESClient({
  region: "us-east-1",
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
  
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, company, department, service, message, phone, preferredDate } = req.body;

      if (!name || !email || !company) {
        return res.status(400).json({
          success: false,
          error: "Name, Company Name, and Email are required.",
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
