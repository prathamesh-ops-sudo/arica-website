import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactInquirySchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "us-east-1" });

const RECIPIENT_EMAILS = [
  "sohom.niyogi@aricatech.com",
  "prathamesh@aricatech.com",
];
const SENDER_EMAIL = "noreply@aricatech.com";

async function sendContactEmail(data: {
  name: string;
  email: string;
  department: string;
  phone?: string;
  message?: string;
  preferredDate?: string;
}) {
  const subject = `New Contact Form Submission from ${data.name}`;

  const bodyLines = [
    `Name: ${data.name}`,
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

  await sesClient.send(command);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, company, service, message, phone, preferredDate } = req.body;

      if (!name || !email || !company) {
        return res.status(400).json({
          success: false,
          error: "Name, Department, and Email are required.",
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
        department: company,
        phone,
        message,
        preferredDate,
      }).catch((err) => {
        console.error("Failed to send SES email:", err);
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
