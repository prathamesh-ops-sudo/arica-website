import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const isProduction = process.env.NODE_ENV === "production";
const contentSecurityPolicy = {
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'self'"],
  "object-src": ["'none'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "https://www.googletagmanager.com",
    "https://googleads.g.doubleclick.net",
    "https://challenges.cloudflare.com",
    "https://cdn.jsdelivr.net",
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "font-src": ["'self'", "data:"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://www.aricatech.com",
    "https://i.ibb.co",
    "https://images.unsplash.com",
    "https://www.google-analytics.com",
    "https://analytics.google.com",
    "https://www.googletagmanager.com",
    "https://www.google.com",
    "https://doubleclick.net",
    "https://stats.g.doubleclick.net",
    "https://googleads.g.doubleclick.net",
    "https://www.googleadservices.com",
    "https://pagead2.googlesyndication.com",
  ],
  "connect-src": [
    "'self'",
    "https://www.google-analytics.com",
    "https://analytics.google.com",
    "https://www.googletagmanager.com",
    "https://www.google.com",
    "https://doubleclick.net",
    "https://stats.g.doubleclick.net",
    "https://ad.doubleclick.net",
    "https://googleads.g.doubleclick.net",
    "https://www.googleadservices.com",
    "https://pagead2.googlesyndication.com",
    "https://challenges.cloudflare.com",
    "https://prod.spline.design",
    "https://cdn.jsdelivr.net",
  ],
  "frame-src": [
    "'self'",
    "https://www.googletagmanager.com",
    "https://challenges.cloudflare.com",
    "https://www.google.com",
  ],
  "worker-src": ["'self'", "blob:"],
};

function getErrorStatus(error: unknown): number {
  if (typeof error !== "object" || error === null) return 500;

  if ("status" in error && typeof error.status === "number") {
    return error.status >= 400 && error.status < 600 ? error.status : 500;
  }

  if ("statusCode" in error && typeof error.statusCode === "number") {
    return error.statusCode >= 400 && error.statusCode < 600 ? error.statusCode : 500;
  }

  return 500;
}

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: contentSecurityPolicy,
      reportOnly: process.env.CSP_MODE === "report-only",
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    frameguard: { action: "sameorigin" },
    hsts: {
      maxAge: 31_536_000,
      includeSubDomains: true,
    },
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);
app.use((_req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  next();
});

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: "2mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const error = err instanceof Error ? err : new Error("Unknown server error");

    console.error("[express] unhandled request error:", error);
    if (res.headersSent) return;

    res.status(getErrorStatus(err)).json({
      message: isProduction ? "Internal Server Error" : error.message,
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (isProduction) {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
