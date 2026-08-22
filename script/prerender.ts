import { spawn } from "child_process";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import puppeteer from "puppeteer-core";
import { STATIC_PUBLIC_ROUTES } from "../shared/public-routes";

const port = 4173;
const outputDir = path.resolve("dist/public/prerendered");
const server = spawn("node", ["dist/index.cjs"], {
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(port),
    DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://localhost/arica_prerender",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

server.stdout.on("data", (chunk) => process.stdout.write(`[prerender-server] ${chunk}`));
server.stderr.on("data", (chunk) => process.stderr.write(`[prerender-server] ${chunk}`));
function routeFilename(route: string): string {
  return `${route === "/" ? "__root" : route.slice(1).replaceAll("/", "__")}.html`;
}

function stripDeferredHomePreloads(html: string): string {
  const deferredAssets =
    "(?:ClientsSlider|ForensicsSection|FloatingCyberThreats|ThreatVortex|AsciiHeroSection|company-stats|ComplianceSection)-[^\"']+\\.js";
  return html.replace(
    new RegExp(`<link rel="modulepreload"[^>]*href="[^"]*/assets/${deferredAssets}"[^>]*>\\s*`, "g"),
    "",
  );
}

type RuntimeArtifact = {
  kind: "script" | "link" | "iframe" | "noscript";
  url: string;
};

type RuntimeArtifactReport = {
  route: string;
  removed: RuntimeArtifact[];
};

function stripRuntimeArtifactsInBrowser(): RuntimeArtifact[] {
  const runtimeHosts = [
    "analytics.google.com",
    "challenges.cloudflare.com",
    "doubleclick.net",
    "google-analytics.com",
    "googleadservices.com",
    "googletagmanager.com",
    "googlesyndication.com",
  ];
  const artifacts: RuntimeArtifact[] = [];

  document.querySelectorAll("noscript").forEach(function (element) {
    const content = element.innerHTML;
    const normalizedContent = content.toLowerCase();
    if (runtimeHosts.some((host) => normalizedContent.includes(host))) {
      artifacts.push({ kind: "noscript", url: content.slice(0, 200) });
      element.remove();
    }
  });
  document.querySelectorAll<HTMLScriptElement>("script[src]").forEach(function (element) {
    try {
      const hostname = new URL(element.src, window.location.href).hostname.toLowerCase();
      if (runtimeHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))) {
        const url = new URL(element.src, window.location.href);
        artifacts.push({ kind: "script", url: `${url.origin}${url.pathname}` });
        element.remove();
      }
    } catch {
      // Ignore malformed runtime URLs.
    }
  });
  document.querySelectorAll<HTMLLinkElement>("link[href]").forEach(function (element) {
    const rel = element.rel.toLowerCase();
    try {
      const hostname = new URL(element.href, window.location.href).hostname.toLowerCase();
      if (
        runtimeHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`)) &&
        ["modulepreload", "preconnect", "prefetch", "preload", "stylesheet"].some((value) =>
          rel.split(/\s+/).includes(value),
        )
      ) {
        const url = new URL(element.href, window.location.href);
        artifacts.push({ kind: "link", url: `${url.origin}${url.pathname}` });
        element.remove();
      }
    } catch {
      // Ignore malformed runtime URLs.
    }
  });
  document.querySelectorAll<HTMLIFrameElement>("iframe[src]").forEach(function (element) {
    try {
      const hostname = new URL(element.src, window.location.href).hostname.toLowerCase();
      if (runtimeHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))) {
        const url = new URL(element.src, window.location.href);
        artifacts.push({ kind: "iframe", url: `${url.origin}${url.pathname}` });
        element.remove();
      }
    } catch {
      // Ignore malformed runtime URLs.
    }
  });

  return artifacts;
}

async function stripRuntimeArtifacts(page: puppeteer.Page, route: string): Promise<RuntimeArtifactReport> {
  const removed = await page.evaluate(stripRuntimeArtifactsInBrowser);

  return { route, removed };
}

async function waitForServer(): Promise<void> {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) return;
    } catch {
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Prerender server did not become ready");
}

async function warnIfDatabaseUnavailable(): Promise<void> {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/blog?limit=1`);
    if (response.ok) return;
  } catch {
    // The capture can still proceed because database content is rendered at runtime.
  }
  console.warn(
    "[prerender] database unavailable; /blog listing links and /blog/:slug content will be database-driven at runtime",
  );
}

async function prerenderRoute(page: puppeteer.Page, route: string): Promise<"captured" | "fallback"> {
  try {
    await page.goto(`http://127.0.0.1:${port}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 15_000,
    });
    await page.waitForSelector("#root > *", { timeout: 15_000 });
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    const runtimeArtifacts = await stripRuntimeArtifacts(page, route);
    let html = await page.content();
    const lateRuntimeArtifacts = await stripRuntimeArtifacts(page, route);
    runtimeArtifacts.removed.push(...lateRuntimeArtifacts.removed);
    if (lateRuntimeArtifacts.removed.length > 0) {
      html = await page.content();
    }
    if (runtimeArtifacts.removed.length > 0) {
      console.log(
        `[prerender] stripped ${route}: ${runtimeArtifacts.removed
          .map(({ kind, url }) => `${kind}=${url}`)
          .join(", ")}`,
      );
    } else {
      console.log(`[prerender] stripped ${route}: none`);
    }
    if (!html.includes("<div id=\"root\">") || html.match(/<div id="root"><\/div>/)) {
      return "fallback";
    }
    await writeFile(
      path.join(outputDir, routeFilename(route)),
      route === "/" ? stripDeferredHomePreloads(html) : html,
    );
    return "captured";
  } catch (error) {
    console.warn(`[prerender] fallback ${route}: ${(error as Error).message}`);
    return "fallback";
  }
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  await waitForServer();
  await warnIfDatabaseUnavailable();

  const executablePath = process.env.CHROMIUM_PATH ?? "/usr/bin/chromium";
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const results: Record<string, "captured" | "fallback"> = {};
  try {
    const page = await browser.newPage();
    await page.setUserAgent(`${await browser.userAgent()} AricaTechPrerender`);
    page.setDefaultNavigationTimeout(15_000);
    for (const route of STATIC_PUBLIC_ROUTES) {
      results[route] = await prerenderRoute(page, route);
    }
  } finally {
    await browser.close();
    server.kill();
  }

  const fallbacks = Object.entries(results)
    .filter(([, result]) => result === "fallback")
    .map(([route]) => route);
  console.log(`[prerender] captured ${STATIC_PUBLIC_ROUTES.length - fallbacks.length}/${STATIC_PUBLIC_ROUTES.length} routes`);
  if (fallbacks.length > 0) {
    console.warn(`[prerender] fallback routes: ${fallbacks.join(", ")}`);
  }
}

main().catch((error) => {
  server.kill();
  console.error("[prerender] unavailable; runtime will use the shell:", error);
  process.exit(0);
});
