import { spawn } from "child_process";
import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";
import puppeteer from "puppeteer-core";
import postcss, { type AtRule, type ChildNode, type Rule } from "postcss";
import { STATIC_PUBLIC_ROUTES } from "../shared/public-routes";

const port = 4173;
const outputDir = path.resolve("dist/public/prerendered");
const criticalCssLimit = 20_000;
let server: ReturnType<typeof spawn> | undefined;

function startServer(): void {
  server = spawn("node", ["dist/index.cjs"], {
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
}

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

function cssClassToken(className: string): string {
  return className.replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`);
}

function selectorUsesVisibleClass(selector: string, visibleClasses: Set<string>): boolean {
  if (
    /:hover|:focus|:active|:disabled|:visited|\.group-hover|(?:sm|md|lg|xl|2xl)\\:/.test(
      selector,
    )
  ) {
    return false;
  }
  return [...visibleClasses].some((className) => {
    const token = `.${cssClassToken(className)}`;
    const tokenIndex = selector.indexOf(token);
    if (tokenIndex < 0) return false;
    const nextCharacter = selector[tokenIndex + token.length];
    return !nextCharacter || !/[a-zA-Z0-9_-]/.test(nextCharacter);
  });
}

function isMandatoryRule(rule: Rule): boolean {
  const selector = rule.selector;
  return (
    selector.includes(":root") ||
    selector.includes(":host") ||
    selector === "html" ||
    selector === "body" ||
    selector.startsWith("html,") ||
    selector === "*,:before,:after,::backdrop" ||
    selector === "*,:after,:before,::backdrop" ||
    (selector.includes(".mhero-") && !selector.includes(":active"))
  );
}

function selectCriticalNodes(
  nodes: readonly ChildNode[],
  visibleClasses: Set<string>,
  mandatoryKeyframes: Set<string>,
): ChildNode[] {
  const selected: ChildNode[] = [];
  const seen = new Set<string>();
  for (const node of nodes) {
    let selectedNode: ChildNode | undefined;
    if (node.type === "atrule") {
      const atRule = node as AtRule;
      if (atRule.name === "media" && atRule.params.startsWith("(prefers-reduced-motion")) continue;
      if (atRule.name === "font-face" || (atRule.name === "keyframes" && mandatoryKeyframes.has(atRule.params))) {
        selectedNode = atRule.clone();
      } else if (atRule.nodes) {
        const children = selectCriticalNodes(atRule.nodes, visibleClasses, mandatoryKeyframes);
        if (children.length > 0) {
          selectedNode = atRule.clone({ nodes: children });
        }
      }
    } else if (node.type === "rule") {
      const rule = node as Rule;
      if (isMandatoryRule(rule) || selectorUsesVisibleClass(rule.selector, visibleClasses)) {
        selectedNode = rule.clone();
      }
    }
    if (selectedNode) {
      const serialized = selectedNode.toString();
      if (!seen.has(serialized)) {
        seen.add(serialized);
        selected.push(selectedNode);
      }
    }
  }
  return selected;
}

function criticalCssFromCoverage(
  stylesheet: string,
  visibleClasses: Set<string>,
  mandatoryKeyframes: Set<string>,
): string {
  const root = postcss.parse(stylesheet);
  const selected = selectCriticalNodes(root.nodes, visibleClasses, mandatoryKeyframes);
  return postcss.root({ nodes: selected }).toString();
}

function addCriticalCss(html: string, criticalCss: string, useNonBlockingStylesheet = true): string {
  if (criticalCss.length > criticalCssLimit) return html;
  const stylesheetPattern = /<link\b(?=[^>]*\brel=["']stylesheet["'])[^>]*>/i;
  const stylesheet = html.match(stylesheetPattern)?.[0];
  if (!stylesheet || !/\.css(?:["'?]|$)/i.test(stylesheet)) return html;
  const inline = `<style data-critical-css>${criticalCss}</style>`;
  if (!useNonBlockingStylesheet) {
    return html.replace(stylesheetPattern, `${inline}${stylesheet}`);
  }
  const nonBlockingStylesheet = stylesheet
    .replace(/\smedia=["'][^"']*["']/i, "")
    .replace(/\s+onload=["'][^"']*["']/i, "")
    .replace(/\s*\/?>$/, ' media="print" onload="this.media=\'all\'">');
  const fallback = `<noscript>${stylesheet}</noscript>`;
  return html.replace(stylesheetPattern, `${inline}${nonBlockingStylesheet}${fallback}`);
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
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true });
    await page.coverage.startCSSCoverage();
    await page.goto(`http://127.0.0.1:${port}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 15_000,
    });
    await page.waitForSelector("#root > *", { timeout: 15_000 });
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    const [html, cssCoverage, visibleClasses] = await Promise.all([
      page.content(),
      page.coverage.stopCSSCoverage(),
      page.evaluate(() => {
        const classes = new Set<string>();
        for (const element of document.querySelectorAll<HTMLElement>("[class]")) {
          const rect = element.getBoundingClientRect();
          if ((rect.top < window.innerHeight && rect.bottom > 0) || getComputedStyle(element).position === "fixed") {
            element.classList.forEach((className) => classes.add(className));
          }
        }
        return [...classes];
      }),
    ]);
    const stylesheetCoverage = cssCoverage.find((entry) => /\.css(?:$|\?)/i.test(entry.url));
    const stylesheet = stylesheetCoverage?.text ?? "";
    const mandatoryKeyframes = new Set(["mhero-drift-a", "mhero-drift-b"]);
    const criticalCss = stylesheet
      ? criticalCssFromCoverage(stylesheet, new Set(visibleClasses), mandatoryKeyframes)
      : "";
    if (criticalCss.length <= criticalCssLimit) {
      console.log(`[prerender] ${route} critical CSS ${criticalCss.length} bytes`);
    } else {
      console.warn(`[prerender] ${route} critical CSS ${criticalCss.length} bytes; keeping stylesheet blocking`);
    }
    if (!html.includes("<div id=\"root\">") || html.match(/<div id="root"><\/div>/)) {
      return "fallback";
    }
    const outputHtml = addCriticalCss(
      route === "/" ? stripDeferredHomePreloads(html) : html,
      criticalCss,
      route !== "/",
    );
    await writeFile(path.join(outputDir, routeFilename(route)), outputHtml);
    return "captured";
  } catch (error) {
    console.warn(`[prerender] fallback ${route}: ${(error as Error).message}`);
    return "fallback";
  }
}

async function main() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  startServer();
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
    server?.kill();
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
  server?.kill();
  console.error("[prerender] unavailable; runtime will use the shell:", error);
  process.exit(0);
});
