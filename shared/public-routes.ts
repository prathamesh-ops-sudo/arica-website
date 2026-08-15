export const STATIC_PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/case-studies",
  "/team",
  "/blog",
  "/certifications",
  "/attack-globe",
  "/vulnerability-scanner",
  "/compliance-dashboard",
  "/devsecops",
  "/devsecops-pipeline",
  "/api-security-lab",
  "/cloud-security-center",
  "/mobile-security",
  "/risk-assessment",
  "/security-policies",
  "/security-architecture",
  "/code-review",
  "/security-training",
  "/ongoing-support",
  "/security-implementation",
  "/experience",
  "/thank-you",
  "/legal/privacy-policy",
  "/legal/cookies-policy",
  "/legal/information-security-policy",
  "/legal/third-party-data-vendor-policy",
] as const;

export const STATIC_ROUTE_ALIASES: Record<string, string> = {
  "/forensics": "/services",
  "/compliance": "/services",
  "/portal": "/contact",
};

export const KNOWN_LEGAL_SLUGS = [
  "privacy-policy",
  "cookies-policy",
  "information-security-policy",
  "third-party-data-vendor-policy",
] as const;

export const SITEMAP_STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/case-studies", priority: "0.7", changefreq: "monthly" },
  { path: "/team", priority: "0.6", changefreq: "monthly" },
  { path: "/blog", priority: "0.9", changefreq: "daily" },
  { path: "/certifications", priority: "0.7", changefreq: "monthly" },
  { path: "/attack-globe", priority: "0.4", changefreq: "yearly" },
  { path: "/vulnerability-scanner", priority: "0.4", changefreq: "yearly" },
  { path: "/compliance-dashboard", priority: "0.4", changefreq: "yearly" },
  { path: "/devsecops", priority: "0.5", changefreq: "monthly" },
  { path: "/devsecops-pipeline", priority: "0.4", changefreq: "yearly" },
  { path: "/api-security-lab", priority: "0.4", changefreq: "yearly" },
  { path: "/cloud-security-center", priority: "0.4", changefreq: "yearly" },
  { path: "/mobile-security", priority: "0.4", changefreq: "yearly" },
  { path: "/risk-assessment", priority: "0.4", changefreq: "yearly" },
  { path: "/security-policies", priority: "0.5", changefreq: "monthly" },
  { path: "/security-architecture", priority: "0.4", changefreq: "yearly" },
  { path: "/code-review", priority: "0.4", changefreq: "yearly" },
  { path: "/security-training", priority: "0.4", changefreq: "yearly" },
  { path: "/ongoing-support", priority: "0.5", changefreq: "monthly" },
  { path: "/security-implementation", priority: "0.5", changefreq: "monthly" },
  { path: "/legal/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/legal/cookies-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/legal/information-security-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/legal/third-party-data-vendor-policy", priority: "0.3", changefreq: "yearly" },
] as const;

const STATIC_ROUTE_SET = new Set<string>(STATIC_PUBLIC_ROUTES);

export function isKnownStaticRoute(pathname: string): boolean {
  return STATIC_ROUTE_SET.has(pathname) || pathname in STATIC_ROUTE_ALIASES;
}

export function isKnownLegalRoute(pathname: string): boolean {
  return pathname.startsWith("/legal/") &&
    KNOWN_LEGAL_SLUGS.includes(pathname.slice("/legal/".length) as typeof KNOWN_LEGAL_SLUGS[number]);
}
