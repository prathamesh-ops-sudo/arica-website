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
    const html = await page.content();
    if (!html.includes("<div id=\"root\">") || html.match(/<div id="root"><\/div>/)) {
      return "fallback";
    }
    await writeFile(path.join(outputDir, routeFilename(route)), html);
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
