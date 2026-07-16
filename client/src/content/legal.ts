// Centralized legal/policy content. All site policies live in this single
// file and render through the one /legal/:slug page.

export interface LegalPolicy {
  slug: string;
  title: string;
  shortTitle: string;
  lastUpdated: string;
  content: string;
}

export const LEGAL_POLICIES: LegalPolicy[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    shortTitle: "Privacy",
    lastUpdated: "2026-07-15",
    content: `
Welcome to Arica Tech Security LLP. We are committed to protecting your personal data and respecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website [https://www.aricatech.com/](https://www.aricatech.com/), utilize our software solutions, or interact with our digital services (collectively, the "Platform").

## 1. Information We Collect

### A. Voluntary Information

**Contact and Inquiry Form Data:** When you submit an inquiry through our online contact form, we collect your name, email address, company name, and the specific message or details you provide. We use this information solely to process your request, verify your identity, and provide a direct, tailored response to your inquiry.

**Communications & Support:** Information you submit when requesting technical support, filling out contact forms, or participating in surveys, including logs of your interactions with our team.

**User-Generated Content:** Code repositories, configurations, text, comments, or data payloads uploaded directly into our developer environment or collaborative modules.

### B. How We Use Your Information

We process your personal information for specific, legally permissible business operations, including:

- **Service Provisioning:** Hosting, operating, maintaining, and optimizing the performance and uptime of our technology platform.
- **Account Management:** Managing user profiles, authentication, authorization layers, and processing subscriptions or transactions.
- **Analytics and Optimization:** Reviewing telemetry, application errors, and user habits to debug, refine code bases, and deploy upgraded product features.
- **Security and Fraud Prevention:** Detecting, preventing, and mitigating security threats, automated bot attacks, unauthorized system access, or violations of our Terms of Service.
- **Communications:** Sending technical updates, security alerts, administrative notifications, and, where permitted, targeted marketing updates.

## 2. Sharing and Disclosure of Information

We do not sell your personal data. We disclose your information only under the following strictly defined scenarios:

- **Third-Party Infrastructure and Sub-processors:** We share data with reliable cloud infrastructure provider platforms (e.g., AWS, Google Cloud), database management services, CRM tools, and payment processors executing tasks on our behalf.
- **Legal and Regulatory Compliance:** We may disclose data to authorities if required to do so under subpoena, court order, or applicable statutory regulations to comply with legal obligations.
- **Corporate Restructuring:** In the event of an asset sale, merger, consolidation, or acquisition, your information may be transferred to the acquiring entity subject to continuous privacy protections.

## 3. Cookies, SDKs, and Advanced Analytics

Our platform deploys technical cookies and monitoring pixels to streamline performance. These include:

- **Essential Cookies:** Required for secure session persistence, user authentication, and cryptographic routing.
- **Performance and Analytics:** Utilized through engines like Google Analytics to compile aggregated, non-identifiable usage statistics.

You can manage or restrict cookie behaviors via your localized browser settings; however, certain automated features of our platform may become unavailable or experience degraded latency as a result. See our [Cookies Policy](/legal/cookies-policy) for full details.

## 4. Data Security

We implement industry-standard security measures, including Transport Layer Security (TLS) encryption for data in transit and AES-256 encryption at rest, to protect your personal information. While we continually monitor and secure our system infrastructure, no transmission method over the internet or cloud storage environment can be guaranteed 100% secure.

## 5. Data Retention Protocols

We retain your personal metrics and data structures only as long as your account remains active or as required to fulfill the operational business goals defined in this policy. When data is no longer necessary, we either execute cryptographic deletion routines or securely anonymize the datasets so they can no longer be traced back to an identifiable device or individual.

## 6. Privacy Rights

The statutory rights regarding your personal records include:

- The right to access, update, or port your personal datasets.
- The right to request the rectification or absolute deletion of your data.
- The right to object to or restrict specific processing operations.

To exercise any of these permissions, please submit a formalized request through our dedicated privacy contact listed below.

## 7. Contact

For inquiries, interpretations, or disputes regarding this Privacy Policy, connect with our designated Data Protection officer at:

**Entity Name:** Arica Tech Security LLP

**Attn:** Privacy & Compliance Department

**Email Address:** [contact@aricatech.com](mailto:contact@aricatech.com)

**Mailing Address:** Office 1204, Kotibhaskar & Mahati Residency, Kothrud, Pune, Maharashtra 411038, India
`,
  },
  {
    slug: "cookies-policy",
    title: "Cookies Policy",
    shortTitle: "Cookies",
    lastUpdated: "2026-07-15",
    content: `
This Cookies Policy explains how Arica Tech Security LLP uses cookies and similar tracking technologies (such as web beacons, SDKs, and pixels) when you access our website [https://www.aricatech.com/](https://www.aricatech.com/), or use our tech platform (collectively, the "Services").

## 1. What Are Cookies?

Cookies are small text files stored on your computer, mobile device, or browser when you visit a website. They help the website recognize your device, remember preferences, and run basic interactive functionalities. Cookies set by us are called first-party cookies. Cookies set by third parties on our platform are called third-party cookies and enable external features like interactive maps, payments, or analytics.

## 2. Why Do We Use Cookies?

Our digital platform utilizes cookies for several essential, operational, and analytical purposes:

- **Strictly Necessary:** Core cookies needed for security, user authentication, session persistence, and network load balancing. The platform cannot function properly without these.
- **Performance and Analytics:** Gathering aggregated, non-identifiable usage statistics. These assist in system performance tuning, latency monitoring, and interface optimizations.
- **Preferences & Functionality:** Remembering localized settings, dark-mode preferences, or credentials so you do not have to re-input them on subsequent visits.
- **Targeting and Marketing:** Delivering personalized promotional campaigns and tracking user attribution metrics across external platforms.

## 3. Managing and Disabling Cookies

You can choose to accept, decline, or limit cookies at any time. Your primary options include:

- **Our Consent Banner:** You can review and adjust your opt-in preferences for analytical and marketing cookies directly on our platform's native cookie preference manager.
- **Browser Settings:** You can configure your browser to reject some or all cookies. Note that disabling strictly necessary cookies may prevent parts of our secure dashboards and billing consoles from loading correctly.
- **Do Not Track (DNT):** Please note that because there is no consistent industry consensus, our infrastructure currently does not process automated "Do Not Track" browser headers unless specified by regional statutory compliance protocols.

## 4. Updates to This Policy

We may update this policy periodically to reflect changes in our operational tracking practices or new software additions. The revised date will be listed at the top of this policy, and we recommend checking back regularly to stay informed.
`,
  },
  {
    slug: "information-security-policy",
    title: "Information Security Policy",
    shortTitle: "Security",
    lastUpdated: "2026-07-15",
    content: `
Arica Tech Security LLP is dedicated to protecting the confidentiality, integrity, and availability of our users' personal data, proprietary codebase, and system infrastructure. This Information Security Policy outlines the structural, organizational, and physical safeguards we deploy across our Platform.

## 1. Data Encryption Standards

We leverage robust, industry-standard cryptographic architectures to defend datasets throughout their full operational cycle:

- **Data in Transit:** All interactive data exchanges, API communications, and dashboard sessions are enforced using Transport Layer Security (TLS 1.2 or higher) cryptographic protocols to mitigate interception risks.
- **Data at Rest:** Core data assets, customer credentials, user telemetry databases, and system configuration repositories are secured using Advanced Encryption Standard (AES-256) algorithms across all backup architectures and active filesystems.

## 2. Infrastructure, Cloud Architecture & Access Control

To identify and neutralize security weaknesses, our team deploys systematic management routines:

- **Principle of Least Privilege (PoLP):** Internal administrative permissions to databases and application layers are limited strictly to engineering personnel requiring access to carry out service duties.
- **Multi-Factor Authentication:** Portals, deployment channels, and corporate applications require mandatory multi-factor authentication (MFA) protocols.
- **Network Isolation:** Production databases are protected within private virtual networks (VPCs) utilizing strict security group configurations, preventing public internet visibility or direct route discovery.

## 3. Vulnerability Assessments & Threat Mitigation

To identify and neutralize security weaknesses, our team deploys systemic threat management routines:

- **Penetration Testing & Auditing:** We conduct periodic infrastructure and application-layer penetration tests performed by specialised, independent security auditors.
- **Continuous Logging & Monitoring:** All systems and patterns are monitored by our team 24×7. Systemic log reviews track unauthorized connection setups, database queries, or brute-force activities.

## 4. Corporate Security Awareness

Security is embedded across our internal resource operations. Our personnel undergo strict vetting processes prior to platform access onboarding and complete mandatory data protection and cyber security training annually.

## 5. Reporting a Vulnerability

We welcome responsible disclosure contributions from independent security researchers. If you identify a structural flaw, software bug, or potential configuration vulnerability within our webpage, please forward us a detailed report at [contact@aricatech.com](mailto:contact@aricatech.com).
`,
  },
  {
    slug: "third-party-data-vendor-policy",
    title: "Third-Party Data & Vendor Policy",
    shortTitle: "Vendors",
    lastUpdated: "2026-07-15",
    content: `
Welcome to Arica Tech Security LLP. We are committed to protecting your personal data and respecting your privacy. This policy describes how we handle third-party data transfers and vendor relationships when you visit our website [https://www.aricatech.com/](https://www.aricatech.com/), utilize our software solutions, or interact with our digital services (collectively, the "Platform").

## 1. Framework for Third-Party Data Transfer

We do not sell, rent, or trade user data to third parties for independent marketing purposes. We transfer personal data, system telemetry, or user-generated configurations to external entities exclusively under the following operational conditions:

- **Strict Functional Necessity:** The data transfer is directly required to execute platform code, maintain cloud infrastructure, process payments, or deliver support.
- **Contractual Safeguards:** Every third-party vendor is bound by formal Data Processing Agreements (DPAs) or confidentiality clauses that limit data usage strictly to our specified instructions.
- **Technical Restrictions:** Data minimization protocols are applied so vendors receive only the minimum scope of parameters required to complete their designated tasks.

## 2. External Links, API Integrations, and Third-Party SDKs

Our platform may contain links to external web environments, developer libraries, or Software Development Kits (SDKs) not operated by us. Once you interact with these external endpoints or leave our domain space, your data is governed by that respective third party's privacy policies. We strongly encourage users to review the privacy documentation of any external tech tools they choose to authorize or integrate into their workflow.

## 3. Vendor Security Assessments

Before onboarding, our compliance and engineering teams audit third-party providers. We prioritize partners maintaining verified industry-standard data security baselines (such as SOC 2 Type II, ISO/IEC 27017/27001 certifications, or equivalent regional data security standards).

## 4. Updates to This Policy

As our system infrastructure changes or we introduce new integration partners, this document will be modified. We maintain an updated version on our platform with the revision date listed clearly at the top. Continued use of the platform following modifications implies recognition of the updated third-party frameworks.
`,
  },
];

export function getPolicyBySlug(slug: string): LegalPolicy | undefined {
  return LEGAL_POLICIES.find((p) => p.slug === slug);
}
