export type SiteNavigationLink = readonly [string, string];

export const SITE_NAVIGATION_GROUPS: readonly {
  title: string;
  links: readonly SiteNavigationLink[];
}[] = [
  {
    title: "Company",
    links: [
      ["/about", "About"],
      ["/team", "Team"],
      ["/blog", "Blog"],
      ["/contact", "Contact"],
      ["/case-studies", "Case Studies"],
    ],
  },
  {
    title: "Security Services",
    links: [
      ["/services", "Services"],
      ["/certifications", "Framework Support"],
      ["/risk-assessment", "Risk Assessment"],
      ["/ongoing-support", "Ongoing Support"],
      ["/security-implementation", "Security Implementation"],
    ],
  },
  {
    title: "Security Labs",
    links: [
      ["/attack-globe", "Attack Surface Simulation"],
      ["/vulnerability-scanner", "Vulnerability Scanner"],
      ["/compliance-dashboard", "ISMS Readiness Dashboard"],
      ["/devsecops", "DevSecOps"],
      ["/devsecops-pipeline", "DevSecOps Pipeline"],
    ],
  },
  {
    title: "Security Practice",
    links: [
      ["/api-security-lab", "API Security Lab"],
      ["/cloud-security-center", "Cloud Security Center"],
      ["/mobile-security", "Mobile Security"],
      ["/security-policies", "Security Policies"],
      ["/security-architecture", "Security Architecture"],
      ["/code-review", "Secure Code Review"],
      ["/security-training", "Security Training"],
    ],
  },
] as const;

export const SITE_NAVIGATION_LINKS: readonly SiteNavigationLink[] = SITE_NAVIGATION_GROUPS.flatMap(
  (group) => group.links,
);

export const SITE_LEGAL_LINKS: readonly SiteNavigationLink[] = [
  ["/legal/privacy-policy", "Privacy Policy"],
  ["/legal/cookies-policy", "Cookies Policy"],
  ["/legal/information-security-policy", "Information Security Policy"],
  ["/legal/third-party-data-vendor-policy", "Third-Party Data & Vendor Policy"],
] as const;
