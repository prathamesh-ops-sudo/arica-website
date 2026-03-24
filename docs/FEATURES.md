# Arica Tech Website - Complete Feature Documentation

> **Last Updated:** March 2026
> **Stack:** Express.js (backend) + React + TypeScript + Three.js (frontend) + PostgreSQL (database)
> **Live URL:** https://hgesimdp2m.us-east-1.awsapprunner.com

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Backend API](#2-backend-api)
3. [Database Schema](#3-database-schema)
4. [Pages & Features](#4-pages--features)
   - [Home Page](#41-home-page)
   - [About Page](#42-about-page)
   - [Services Page](#43-services-page)
   - [Contact Page](#44-contact-page)
   - [Case Studies Page](#45-case-studies-page)
   - [Experience (Solar System)](#46-experience-solar-system)
   - [Attack Globe](#47-attack-globe)
   - [Vulnerability Scanner](#48-vulnerability-scanner)
   - [Compliance Dashboard](#49-compliance-dashboard)
   - [DevSecOps Pipeline](#410-devsecops-pipeline)
   - [DevSecOps (3D)](#411-devsecops-3d)
   - [API Security Lab](#412-api-security-lab)
   - [Cloud Security Center](#413-cloud-security-center)
   - [Mobile Security](#414-mobile-security)
   - [Risk Assessment](#415-risk-assessment)
   - [Security Policies](#416-security-policies)
   - [Security Architecture](#417-security-architecture)
   - [Code Review](#418-code-review)
   - [Certifications](#419-certifications)
   - [Security Training](#420-security-training)
   - [Ongoing Support](#421-ongoing-support)
   - [Security Implementation](#422-security-implementation)
   - [Orca (Forensics 3D)](#423-orca-forensics-3d)
5. [Shared Components](#5-shared-components)
6. [Asset Inventory & Onboarding](#6-asset-inventory--onboarding)
7. [What "AI" Means in This Codebase](#7-what-ai-means-in-this-codebase)
8. [Known Gaps & Limitations](#8-known-gaps--limitations)
9. [How to Add a New Feature Page](#9-how-to-add-a-new-feature-page)
10. [Deployment](#10-deployment)
11. [Brand Guidelines](#11-brand-guidelines)

---

## 1. Architecture Overview

```
Client (React + Vite)          Server (Express)           Database (PostgreSQL)
 |                               |                          |
 |  /api/contact  POST --------> |  routes.ts               |
 |                               |    -> storage.ts -------> | contact_inquiries
 |                               |    -> schema.ts (Zod)     | users
 |                               |                          |
 | All other pages are           |  Serves static build     |
 | client-side only (SPA)        |  from dist/public/       |
```

### Key Facts
- **Frontend-only simulations:** All dashboard pages (vulnerability scanner, compliance, risk assessment, etc.) run entirely in the browser. They use randomized data and timers to simulate real security tools. There is **no backend AI, ML, or real scanning engine**.
- **Single API endpoint:** The only server route is `POST /api/contact` for the contact form.
- **Three.js heavy:** Many pages use Three.js / React Three Fiber for 3D visualizations (globe, solar system, forensics scenes, security architecture, etc.).
- **Routing:** Uses `wouter` (lightweight React router). All 25 routes defined in `client/src/App.tsx`.

### File Structure
```
client/
  src/
    pages/          -- 23 page components (one per route)
    components/     -- Shared UI components (Navbar, CTA, ContactForm, etc.)
    components/ui/  -- Low-level UI primitives (buttons, cards, animations)
    lib/            -- Utilities (queryClient, utils, webgl-utils)
    hooks/          -- Custom React hooks
  public/
    textures/       -- Planet textures for solar system (earth, mars, jupiter, etc.)
    opengraph.jpg   -- OG image for social media previews
  index.html        -- Entry HTML
server/
  index.ts          -- Express server entry
  routes.ts         -- API route registration
  storage.ts        -- Database abstraction (DatabaseStorage class)
  vite.ts           -- Vite dev server middleware
shared/
  schema.ts         -- Drizzle ORM schema + Zod validation
attached_assets/    -- Static assets used by components (images, textures)
  generated_images/ -- AI-generated images (shield icon, hero backgrounds)
docs/               -- This documentation
```

---

## 2. Backend API

### `POST /api/contact`

**File:** `server/routes.ts`

Accepts contact form submissions and stores them in PostgreSQL.

**Request Body (JSON):**
| Field     | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| `name`    | string | Yes      | Full name of the sender        |
| `email`   | string | Yes      | Email address                  |
| `company` | string | No       | Company name                   |
| `service` | string | No       | Service they are interested in |
| `message` | string | Yes      | Message body                   |

**Response:**
- `201` with `{ success: true, data: { ...inquiry } }` on success
- `400` with Zod validation error on invalid input
- `500` on server error

**Example:**
```bash
curl -X POST https://hgesimdp2m.us-east-1.awsapprunner.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "service": "VAPT",
    "message": "Interested in a security assessment."
  }'
```

There are **no other API endpoints**. All other pages are frontend-only.

---

## 3. Database Schema

**File:** `shared/schema.ts`

### Tables

#### `users`
| Column     | Type    | Notes                          |
|------------|---------|--------------------------------|
| `id`       | varchar | Primary key, UUID auto-generated |
| `username` | text    | Unique, required               |
| `password` | text    | Required                       |

> **Note:** The users table exists in the schema but is not used by any feature in the current application. No login/registration UI exists.

#### `contact_inquiries`
| Column       | Type      | Notes                     |
|--------------|-----------|---------------------------|
| `id`         | serial    | Primary key, auto-increment |
| `name`       | text      | Required                  |
| `email`      | text      | Required                  |
| `company`    | text      | Optional                  |
| `service`    | text      | Optional                  |
| `message`    | text      | Required                  |
| `created_at` | timestamp | Auto-set to current time  |

---

## 4. Pages & Features

### 4.1 Home Page

**Route:** `/`
**File:** `client/src/pages/Home.tsx`
**Purpose:** Landing page showcasing Arica Tech's cybersecurity services.

#### Sections (top to bottom):
1. **Navbar** - Navigation bar with links to Home, Services, Case Studies, About, Contact, Attack Globe
2. **HorizonHeroSection** - Hero banner with animated text and CTA buttons
3. **ClientsSlider** - Scrolling logo carousel of client companies
4. **ForensicsSection** - Forensics/incident response service showcase
5. **ThreatVortex** - Animated 3D threat visualization
6. **AsciiHeroSection** - ASCII art styled security section
7. **ComplianceSection** - ISO 27001 compliance service highlight with shield image
8. **CTA** - Call-to-action section linking to contact page

#### Assets Used:
| Asset | Source | Path |
|-------|--------|------|
| Shield compliance icon | Local import | `attached_assets/generated_images/3d_shield_compliance_icon.png` |
| Client logos | Inline SVG/components | Within `ClientsSlider.tsx` |

#### How to Onboard Assets:
- **Client logos:** Edit `client/src/components/ClientsSlider.tsx`. Add new logo entries to the clients array. Each entry needs a `name` and either an SVG component or image import.
- **Hero content:** Edit `client/src/components/ui/horizon-hero-section.tsx` to change hero text, CTA buttons, or animations.
- **Compliance shield image:** Replace `attached_assets/generated_images/3d_shield_compliance_icon.png` with a new PNG. The import in `ComplianceSection.tsx` will automatically use the new file.

---

### 4.2 About Page

**Route:** `/about`
**File:** `client/src/pages/About.tsx` (372 lines)
**Purpose:** Company information, mission, values, and team.

#### Features:
- **Animated Stats** - Count-up animation showing: 200+ Security Assessments, 50+ Enterprise Clients, 10+ Years Experience, 100% Audit Success Rate
- **Company Story** - Founded in 2010, specializing in VAPT, ISO compliance, and secure software
- **Values Cards** - Security First, Precision, Transparency (with 3D tilt effect on hover)
- **Team Section** - Team member cards (imported from `Team.tsx` component)
- **Floating Particles** - Ambient particle animation background
- **CTA** - Call to action

#### How to Onboard Assets:
- **Stats:** Edit the `stats` array at the top of `About.tsx`. Each entry has `icon`, `value`, `suffix`, and `label`.
- **Values:** Edit the `values` array. Each entry has `icon`, `title`, and `description`.
- **Team Members:** Edit `client/src/components/Team.tsx`. Add entries with name, role, photo, and bio.
- **Company Description:** Edit the text directly in the JSX within the "From Humble Beginnings" section.

---

### 4.3 Services Page

**Route:** `/services` (also `/forensics` and `/compliance` route to this page)
**File:** `client/src/pages/ServicesPage.tsx` (581 lines)
**Purpose:** Detailed breakdown of Arica Tech's three core services.

#### Services Showcased:
1. **VAPT** (Vulnerability Assessment & Penetration Testing)
   - 6 features listed (Comprehensive Pen Testing, Vuln Scanning, Network Security, Web App Security, API Security, Social Engineering)
   - Stats: 500+ assessments, 12,500+ vulnerabilities found, 99% satisfaction
2. **ISO Audit** (ISO 27001 Compliance)
   - 6 features listed (Gap Analysis, Compliance Roadmap, Policy Development, Internal Audit Prep, Certification Support, Continuous Monitoring)
   - Stats: 150+ successful audits, 98% certifications achieved, 100% compliance rate
3. **Custom Software Development**
   - 6 features listed (Secure Architecture, DevSecOps, Security-First Dev, Code Review, Secure API Dev, Enterprise Solutions)
   - Stats: 200+ projects, 2M+ lines of secure code, 95% on-time delivery

#### How to Onboard Assets:
- **Add/edit services:** Edit the `services` array in `ServicesPage.tsx`. Each service object has `id`, `icon`, `title`, `description`, `features` (array of strings), `stats` (array with `label`, `value`, `suffix`), and `color`.
- **Icons:** Uses Lucide React icons. Import new icons from `lucide-react`.
- **Progress bars:** Animated progress bars for each service appear automatically based on stats.

---

### 4.4 Contact Page

**Route:** `/contact` (also `/portal` routes here)
**File:** `client/src/pages/Contact.tsx` (393 lines)
**Purpose:** Contact form and company contact information. **This is the only page with real backend functionality.**

#### Features:
- **Contact Form** (component: `ContactForm.tsx`) - Submits to `POST /api/contact` and saves to PostgreSQL
- **Contact Cards** with tilt effect:
  - Email: contact@aricatech.com
  - Phone: +91 70911 75596
  - Location: Pune, Maharashtra, India (full address shown)
  - Emergency (24/7 IR): +91 96510 39355 (red-highlighted)
- **World Map** - SVG showing Pune office location with pulsing dot
- **Floating Icons** - Parallax security icons following mouse movement

#### How to Onboard Assets:
- **Contact info:** Edit the `contactInfo` array in `Contact.tsx`. Each entry has `icon`, `title`, `value`, `description`, and `isEmergency`.
- **Office locations:** Edit the `officeLocations` array. Each entry has `name`, `x` (percentage from left), `y` (percentage from top), and `isPrimary`.
- **Form fields:** Edit `client/src/components/ContactForm.tsx` to add/remove form fields. Update the Zod schema in `shared/schema.ts` and the contact inquiries table if adding new database fields.

---

### 4.5 Case Studies Page

**Route:** `/case-studies`
**File:** `client/src/pages/CaseStudies.tsx` (713 lines)
**Purpose:** Portfolio of past security engagements with flip-card UI.

#### Case Studies (8 total):
| # | Category | Title |
|---|----------|-------|
| 1 | VAPT | Banking Infrastructure Penetration Testing |
| 2 | ISO Audit | ISO 27001 Certification Success |
| 3 | Software | Secure E-Commerce Platform Development |
| 4 | ISO Audit | Healthcare HIPAA + ISO Compliance |
| 5 | VAPT | SCADA System Penetration Testing |
| 6 | Software | Secure Software Development Lifecycle |
| 7 | Enterprise | Enterprise Network Security Assessment |
| 8 | Enterprise | Zero Trust Architecture Implementation |

#### Features:
- **Filter Tabs** - Filter by: All sectors, VAPT, ISO Audit, Software, Enterprise
- **Flip Cards** - Click to flip between summary (front) and challenge/solution details (back)
- **Threat Chart** - Animated SVG line chart showing threat count reduction over time (Jan-Jul 2024)
- **Animated Counters** - Stats with count-up animations
- **Impact Section** - Key metrics display

#### How to Onboard Assets:
- **Add case study:** Add a new object to the `caseStudies` array in `CaseStudies.tsx`. Required fields: `category` (must match one of the filter categories), `title`, `description`, `challenge`, `solution`.
- **Add filter category:** Add the new category string to the `categories` array.
- **Chart data:** Edit the `chartData` array to change the threat reduction chart. Each entry has `month` and `value`.

---

### 4.6 Experience (Solar System)

**Route:** `/experience`
**File:** `client/src/pages/Experience.tsx` (146 lines)
**Purpose:** Immersive 3D solar system visualization as a creative "experience" page.

#### Features:
- **Terminal Intro** - Simulated loading screen with step-by-step initialization messages
- **3D Solar System** - Full interactive solar system rendered with Three.js (component: `RealisticSolarSystem`)
- **Home Button** - Floating button to return to homepage

#### How It Works:
1. Page loads with a terminal-style intro animation showing 5 loading steps
2. After ~3.8 seconds, the intro fades out
3. The full-screen 3D solar system is revealed
4. Users can interact by rotating/zooming the scene

#### Assets Used:
| Asset | Path | Purpose |
|-------|------|---------|
| Earth texture | `client/public/textures/earth_color_4k.jpg` | Earth surface |
| Earth bump map | `client/public/textures/earth_bump_4k.jpg` | Earth terrain |
| Earth clouds | `client/public/textures/earth_clouds_4k.png` | Cloud layer |
| Moon texture | `client/public/textures/moon.jpg` | Moon surface |
| Mars texture | `client/public/textures/mars.jpg` | Mars surface |
| Jupiter texture | `client/public/textures/jupiter.jpg` | Jupiter surface |
| Saturn texture | `client/public/textures/saturn.jpg` | Saturn surface |
| Sun texture | `client/public/textures/sun.jpg` | Sun surface |
| Mercury texture | `client/public/textures/mercury.jpg` | Mercury surface |
| Neptune texture | `client/public/textures/neptune.jpg` | Neptune surface |
| Uranus texture | `client/public/textures/uranus.jpg` | Uranus surface |

#### How to Onboard Assets:
- **Planet textures:** Replace files in `client/public/textures/`. Keep the same filenames or update the import paths in `client/src/components/ui/realistic-solar-system.tsx`.
- **Loading messages:** Edit the `loadingSteps` array in `Experience.tsx`.
- **Solar system behavior:** Edit `client/src/components/ui/realistic-solar-system.tsx` for orbit speeds, planet sizes, camera positions, etc.

---

### 4.7 Attack Globe

**Route:** `/attack-globe`
**File:** `client/src/pages/AttackGlobe.tsx` (1,159 lines)
**Purpose:** Real-time simulated cyber attack visualization on a 3D globe.

#### Features:
- **3D Earth Globe** - Three.js rendered Earth with texture mapping, bump mapping, cloud layer, and atmosphere glow
- **Live Attack Arcs** - Animated arcs between cities showing simulated cyber attacks in real-time
- **Attack Types** - 7 types: DDoS, SQL Injection, XSS, Brute Force, Malware, Phishing, Ransomware
- **City Markers** - 90+ cities worldwide with marker dots on the globe
- **Live Counter** - Running count of simulated attacks detected
- **Attack Feed** - Scrollable list of recent attacks with severity, source, target, and type
- **Search & Filter** - Search attacks by city name, filter by attack type
- **Severity Levels** - Critical (red), High (orange), Medium (yellow), Low (green)
- **Interactive Controls** - Drag to rotate globe, mouse wheel to zoom
- **WebGL Fallback** - Graceful degradation if WebGL is not available

#### How It Works:
This is a **frontend-only simulation**. No real attack data is fetched.
1. Random attacks are generated every 1-5 seconds using `generateRandomAttack()`
2. Each attack picks a random source city, target city, attack type, and severity
3. A 3D arc is drawn on the globe between the two cities
4. The attack appears in the feed with timestamp
5. Arcs animate along quadratic bezier curves and fade out after completion

#### Assets Used:
| Asset | Source | Notes |
|-------|--------|-------|
| Earth texture | `unpkg.com/three-globe` CDN | `earth-blue-marble.jpg` |
| Earth topology | `unpkg.com/three-globe` CDN | `earth-topology.png` (bump map) |
| Earth clouds | `unpkg.com/three-globe` CDN | `earth-clouds.png` |

> **Note:** Textures are loaded from unpkg CDN, not from local `client/public/textures/`. Local texture files exist but are used by the solar system page instead.

#### How to Onboard Assets:
- **Add cities:** Add entries to the `cityCoordinates` object. Each entry needs `lat` and `lng` values. The city name is the key.
- **Add attack types:** Add entries to the `attackTypes` array. Each needs `id`, `name`, and `color` (hex).
- **Change globe textures:** Edit the `textureLoader.load()` calls in the `useEffect` hook (~line 344). You can point to local files in `client/public/textures/` instead of CDN:
  ```typescript
  // Change from CDN:
  textureLoader.load('https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg', ...)
  // To local:
  textureLoader.load('/textures/earth_color_4k.jpg', ...)
  ```
- **Adjust attack frequency:** Edit the `scheduleNext` function (~line 723). The delay is `1000 + Math.random() * 4000` ms (1-5 seconds).

---

### 4.8 Vulnerability Scanner

**Route:** `/vulnerability-scanner`
**File:** `client/src/pages/VulnerabilityScanner.tsx` (405 lines)
**Purpose:** Simulated web application vulnerability scanner (VAPT demo).

#### Features:
- **URL Input** - Enter a target URL (validated for http/https format)
- **Scan Simulation** - 11-phase scan with progress bar and terminal output
- **Vulnerability Detection** - Randomly generates findings from OWASP Top 10 categories:
  1. SQL Injection
  2. Cross-Site Scripting (XSS)
  3. Broken Authentication
  4. Sensitive Data Exposure
  5. XML External Entities
  6. Broken Access Control
  7. Security Misconfiguration
  8. Insecure Deserialization
  9. Components with Known Vulnerabilities
  10. Insufficient Logging
- **Results Dashboard** - Shows total, critical, high, medium counts
- **Vulnerability Report** - Detailed list with severity badges, descriptions, and affected endpoints

#### How It Works:
This is a **frontend-only simulation**. No actual scanning occurs.
1. User enters a URL and clicks "Start Scan"
2. A progress bar advances with random increments (~10 seconds total)
3. Scan phases are displayed in sequence (DNS resolution, port scanning, XSS testing, etc.)
4. When complete, `generateResults()` creates random vulnerabilities (~60% chance each type is "found")
5. Results are displayed with random severities and random API endpoint locations

#### How to Onboard Assets:
- **Vulnerability types:** Edit the `vulnerabilityTypes` array. Each entry has `name`, `icon`, and `category`.
- **Scan phases:** Edit the `phases` array inside `startScan()` to change the scanning steps.
- **Scan output lines:** Edit the `scanLineMessages` array for terminal-style output during scanning.
- **Default target URL:** Change the `useState('https://example-target.com')` default value.

---

### 4.9 Compliance Dashboard

**Route:** `/compliance-dashboard`
**File:** `client/src/pages/ComplianceDashboard.tsx` (377 lines)
**Purpose:** ISO 27001 compliance tracking dashboard.

#### Features:
- **Overall Compliance Score** - Circular progress showing 78.1% compliance
- **Control Categories** - 10 ISO 27001 Annex A control families:
  1. Information Security Policies (A.5) - 2 controls
  2. Organization of InfoSec (A.6) - 5 controls
  3. Human Resource Security (A.7) - 6 controls
  4. Asset Management (A.8) - 10 controls
  5. Access Control (A.9) - 14 controls
  6. Cryptography (A.10) - 2 controls
  7. Physical Security (A.11) - 15 controls
  8. Operations Security (A.12) - 14 controls
  9. Communications Security (A.13) - 7 controls
  10. System Acquisition (A.14) - 13 controls
- **Status Breakdown** - Compliant (green), In Progress (yellow), Gap (red) for each category
- **Total Controls** - 114 Annex A controls tracked
- **Certification Timeline** - 4 phases: Gap Analysis, ISMS Design, Implementation, Certification Audit
- **Risk Level** - Shown per category

#### How It Works:
All data is **hardcoded in the component**. No backend or database integration.

#### How to Onboard Assets:
- **Control categories:** Edit the `controlCategories` array. Each entry has:
  - `name` - Category name
  - `annex` - ISO annex reference (e.g., "A.5")
  - `icon` - Lucide icon component
  - `totalControls` - Number of controls
  - `compliant` - Number of compliant controls
  - `inProgress` - Number in progress
  - `gap` - Number of gaps
  - `riskLevel` - "low", "medium", or "high"
- **Timeline phases:** Edit the `certificationTimeline` array.
- **To make this dynamic:** Would require:
  1. New API endpoint(s) in `server/routes.ts`
  2. New database table(s) in `shared/schema.ts`
  3. Replace hardcoded data with API calls using React Query

---

### 4.10 DevSecOps Pipeline

**Route:** `/devsecops-pipeline`
**File:** `client/src/pages/DevSecOpsPipeline.tsx` (395 lines)
**Purpose:** Interactive CI/CD security pipeline visualization.

#### Features:
- **7 Pipeline Stages:**
  1. Code Commit (Git)
  2. Build (Docker)
  3. SAST (Static Analysis)
  4. Dependency Scan
  5. Container Security
  6. DAST (Dynamic Analysis)
  7. Secure Deploy
- **Run/Pause/Reset Controls** - Play through pipeline stages sequentially
- **Stage Details** - Each stage shows tool used, duration, and findings count
- **Security Findings** - Simulated findings with severity at each stage
- **Progress Tracking** - Visual pipeline with active stage highlighting

#### How It Works:
Frontend-only simulation. When "Run" is clicked, stages execute sequentially with timers.

#### How to Onboard Assets:
- **Pipeline stages:** Edit the `pipelineStages` array. Each stage has `name`, `icon`, `tool`, `duration`, `description`, and `findings`.
- **Stage timings:** Modify the interval/timeout values in the run pipeline logic.

---

### 4.11 DevSecOps (3D)

**Route:** `/devsecops`
**File:** `client/src/pages/DevSecOps.tsx` (1,199 lines)
**Purpose:** 3D visualization of a DevSecOps pipeline with flowing packages.

#### Features:
- **3D Pipeline Visualization** - Three.js scene with 6 pipeline stages rendered as 3D objects
- **Flowing Packages** - Animated packages flowing through pipeline stages
- **Security Scanning** - Visual scanning animation at each stage
- **Particle Effects** - Ambient particles and glow effects
- **Custom Shaders** - GLSL shaders for glow, grid, and particle effects
- **Run Controls** - Start/stop the pipeline flow

#### How to Onboard Assets:
- **Pipeline stages:** Edit the stage data array in the component. Each stage has position, color, and metadata.
- **Visual effects:** Modify the GLSL shader code for custom visual styles.

---

### 4.12 API Security Lab

**Route:** `/api-security-lab`
**File:** `client/src/pages/ApiSecurityLab.tsx` (1,433 lines)
**Purpose:** Interactive API security testing simulation.

#### Features:
- **Cyber Background** - Animated particle grid canvas
- **Authentication Flow Visualization** - 5-step auth flow: Client Request -> Authentication -> Token Validation -> Rate Limiting -> API Response
- **Auth Tests** - JWT Token Validation, OAuth 2.0 Flow Security, API Key Exposure, Session Management
- **Live Request Panel** - Simulated curl request stream with typewriter effect
- **Attack Detection Feed** - Real-time simulated attack events (SQL Injection, XSS, Rate Limit Breach, Auth Bypass, CSRF, Brute Force)
- **Rate Limit Heatmap** - Visual heatmap showing request rate patterns
- **Live Metrics Dashboard** - Requests/sec, Avg Latency, Error Rate, Attacks Blocked, Active Connections
- **Vulnerability Report** - Scan results with severity classification
- **API Endpoint Testing** - Simulated API calls with response previews

#### How It Works:
Frontend-only. Metrics update via `setInterval` every 2 seconds. Attacks are generated every 3 seconds.

#### How to Onboard Assets:
- **Auth tests:** Edit the `authTests` array.
- **Attack types:** Edit the `attackTypes` array.
- **Auth flow steps:** Edit the `authFlowSteps` array.
- **Rate limit data:** Edit the `rateLimitData` 2D array for heatmap visualization.
- **Vulnerability types:** Edit the `vulnerabilityTypes` array inside `generateResults()`.

---

### 4.13 Cloud Security Center

**Route:** `/cloud-security-center`
**File:** `client/src/pages/CloudSecurityCenter.tsx` (1,447 lines)
**Purpose:** Multi-cloud security monitoring dashboard.

#### Features:
- **Cloud Providers** - AWS, Azure, GCP tabs
- **10 Cloud Regions** with health status indicators
- **IAM Policy Analysis** - Policy compliance visualization
- **Container Status Tracking** - Running, stopped, vulnerable container counts
- **Configuration Checks** - Security config compliance scores
- **Security Events Feed** - Real-time security event stream
- **Threat Detection** - Anomaly and threat alerts
- **Infrastructure Visualization** - Node-based infrastructure diagram with custom components
- **Circular Progress Indicators** - For compliance scores

#### How to Onboard Assets:
- **Cloud regions:** Edit the regions data array. Each region has `name`, `provider`, `status`, and metrics.
- **IAM policies:** Edit the IAM analysis data.
- **Security events:** Edit the events generation logic to customize event types.
- **Infrastructure nodes:** Edit the `InfrastructureNode` component data for custom infrastructure visualization.

---

### 4.14 Mobile Security

**Route:** `/mobile-security`
**File:** `client/src/pages/MobileSecurity.tsx` (1,320 lines)
**Purpose:** Mobile device security scanning and vulnerability assessment.

#### Features:
- **6 Test Devices:**
  1. iPhone 15 Pro (iOS 17.2)
  2. iPad Air (iPadOS 17.1)
  3. Pixel 8 Pro (Android 14)
  4. Samsung Galaxy S24 (Android 14)
  5. iPhone 14 (iOS 17.0)
  6. Pixel 7a (Android 13)
- **OWASP Mobile Top 10 Checks** - Security scanning against mobile-specific vulnerabilities
- **Permission Analysis** - App permission audit
- **Security Gauge** - Animated radial gauge showing overall security score
- **Live Threat Counter** - Animated counter for threats detected during scan
- **Scan Animation** - Ripple effect during scanning

#### How to Onboard Assets:
- **Test devices:** Edit the devices array. Each device has `name`, `os`, `osVersion`, `model`, and security metadata.
- **OWASP checks:** Edit the security check categories.
- **Permission list:** Edit the permissions data for the permission analysis feature.

---

### 4.15 Risk Assessment

**Route:** `/risk-assessment`
**File:** `client/src/pages/RiskAssessment.tsx` (1,448 lines)
**Purpose:** Risk assessment and threat matrix visualization.

#### Features:
- **6 Risk Categories** with animated gauges:
  1. Network Security
  2. Application Security
  3. Data Protection
  4. Access Control
  5. Physical Security
  6. Compliance
- **Threat Matrix** - Likelihood vs Impact grid showing threat positions
- **Real-time Risk Feed** - Scrolling feed of simulated risk events
- **Action Items** - Prioritized remediation recommendations
- **Compliance Framework Tracking** - Multiple framework compliance percentages
- **Risk Gauges** - Custom animated radial gauges for each category
- **Threat Grid Background** - Animated background grid

#### How to Onboard Assets:
- **Risk categories:** Edit the risk categories array. Each has `name`, `icon`, `score`, `maxScore`, `trend`, and details.
- **Threat matrix entries:** Edit the threats array. Each threat has `name`, `likelihood` (1-5), `impact` (1-5), and `category`.
- **Action items:** Edit the action items array with `title`, `priority`, `status`, and `description`.
- **Compliance frameworks:** Edit the frameworks array with `name` and `compliance` percentage.

---

### 4.16 Security Policies

**Route:** `/security-policies`
**File:** `client/src/pages/SecurityPolicies.tsx` (1,101 lines)
**Purpose:** Security policy management with 3D visualization.

#### Features:
- **6 Policy Categories:**
  1. Information Security Policy
  2. Access Control Policy
  3. Data Classification Policy
  4. Incident Response Policy
  5. Business Continuity Policy
  6. Acceptable Use Policy
- **3D Scene** - Policy documents orbiting a central shield with Three.js
- **Custom GLSL Shaders** - Glowing edges, shield effect, particle systems
- **Compliance Meter** - Overall policy compliance percentage
- **Policy Details** - Expandable sections for each policy

#### How to Onboard Assets:
- **Policy categories:** Edit the policies array. Each policy has `name`, `icon`, `status`, `lastReviewed`, `description`, and `controls`.
- **3D scene:** Edit the Three.js setup for custom visuals. The shaders are defined inline as GLSL strings.

---

### 4.17 Security Architecture

**Route:** `/security-architecture`
**File:** `client/src/pages/SecurityArchitecture.tsx` (1,202 lines)
**Purpose:** Network architecture and security layer visualization.

#### Features:
- **10 Network Nodes** - Firewalls, servers, databases, user endpoints, cloud services
- **6 Security Layers** - Physical, Network, Application, Data, Identity, Monitoring
- **3D Network Visualization** - Three.js rendered network topology
- **Data Packet Animation** - Animated packets flowing between nodes
- **Attack Simulation** - Visual simulation of attack attempts being blocked
- **Layer Details** - Information about each security layer

#### How to Onboard Assets:
- **Network nodes:** Edit the nodes array. Each node has `name`, `type`, `position`, `connections`, and security metadata.
- **Security layers:** Edit the layers array with `name`, `description`, `controls`, and `status`.
- **Attack scenarios:** Edit the attack simulation data for custom attack visualizations.

---

### 4.18 Code Review

**Route:** `/code-review`
**File:** `client/src/pages/CodeReview.tsx` (1,202 lines)
**Purpose:** Code vulnerability scanning visualization.

#### Features:
- **10 Code Snippets** - Sample code with known vulnerabilities
- **6 Vulnerability Categories** - Injection, XSS, Auth, Crypto, Config, Logic
- **Scanner Beam** - Animated beam that scans through code
- **Vulnerability Explosions** - Particle explosion effect when vulnerability is detected
- **Matrix Rain** - Background matrix-style falling character effect
- **Pipeline Stages** - Code review process stages
- **Custom Shaders** - GLSL shaders for visual effects

#### How to Onboard Assets:
- **Code snippets:** Edit the code snippets array. Each entry has the code text, language, and associated vulnerability.
- **Vulnerability categories:** Edit the categories array with `name`, `icon`, `count`, and `severity`.

---

### 4.19 Certifications

**Route:** `/certifications`
**File:** `client/src/pages/Certifications.tsx` (1,081 lines)
**Purpose:** Certification tracking with 3D badge visualization.

#### Features:
- **6 Certifications:**
  1. ISO 27001 - Information Security Management
  2. SOC 2 Type II - Service Organization Controls
  3. GDPR - General Data Protection Regulation
  4. PCI DSS - Payment Card Industry Data Security
  5. HIPAA - Health Insurance Portability and Accountability
  6. ISO 22301 - Business Continuity Management
- **3D Orbiting Badges** - Certifications as 3D badges orbiting in space
- **Sparkle Particles** - Ambient particle effects
- **Certification Timeline** - Timeline showing achievement dates
- **Custom Shader Materials** - Hexagon, shield, and circle geometries with custom shaders

#### How to Onboard Assets:
- **Certifications:** Edit the certifications array. Each entry has `name`, `icon`, `description`, `status`, `achievedDate`, and `expiryDate`.
- **Badge shapes:** Three geometry types available: hexagon, shield, circle. Set via `shape` property.
- **Timeline events:** Edit the timeline data for certification milestones.

---

### 4.20 Security Training

**Route:** `/security-training`
**File:** `client/src/pages/SecurityTraining.tsx` (1,472 lines)
**Purpose:** Security training modules with 3D learning path and quiz system.

#### Features:
- **6 Training Modules:**
  1. Security Awareness Fundamentals
  2. Phishing Detection & Prevention
  3. Password Security & MFA
  4. Data Handling & Classification
  5. Incident Reporting Procedures
  6. Social Engineering Defense
- **Quiz System** - 5 multiple-choice questions per module
- **3D Learning Path** - Three.js visualization of completed/pending training nodes
- **Team Progress** - Progress tracking for team members
- **Skill Radar Chart** - Canvas-based radar chart showing skill proficiency
- **Module Completion Tracking** - Per-module completion status

#### How to Onboard Assets:
- **Training modules:** Edit the modules array. Each has `name`, `icon`, `description`, `duration`, `difficulty`, and `topics`.
- **Quiz questions:** Edit the quiz data. Each question has `question`, `options` (array of 4), and `correctAnswer` (index).
- **Team members:** Edit the team progress data array.
- **Skill categories:** Edit the radar chart categories for the skill visualization.

---

### 4.21 Ongoing Support

**Route:** `/ongoing-support`
**File:** `client/src/pages/OngoingSupport.tsx` (1,436 lines)
**Purpose:** 24/7 support and monitoring services dashboard.

#### Features:
- **6 Support Services:**
  1. 24/7 Security Monitoring
  2. Incident Response
  3. Vulnerability Management
  4. Compliance Monitoring
  5. Security Awareness Training
  6. Threat Intelligence
- **Command Center Visualization** - Three.js 3D scene with holographic screens and data streams
- **Real-time Security Events** - Auto-generated security event feed (new event every 3 seconds)
- **System Status** - Uptime, response time, active incidents, and SLA compliance metrics
- **Support Tiers** - Different support package descriptions

#### How to Onboard Assets:
- **Support services:** Edit the services array. Each has `name`, `icon`, `description`, `status`, and `metrics`.
- **System status data:** Edit the status metrics (uptime percentage, response time, etc.).
- **Security events:** Edit the event generation logic to customize event types, severities, and descriptions.

---

### 4.22 Security Implementation

**Route:** `/security-implementation`
**File:** `client/src/pages/SecurityImplementation.tsx` (1,299 lines)
**Purpose:** Security implementation phases with 3D construction visualization.

#### Features:
- **6 Implementation Phases:**
  1. Assessment & Planning
  2. Architecture Design
  3. Security Controls Deployment
  4. Testing & Validation
  5. Staff Training & Awareness
  6. Go-Live & Monitoring
- **3D Construction Site** - Three.js scene showing security controls being built
- **Building Block Animation** - Animated blocks being placed
- **Crane Visualization** - 3D crane placing security components
- **Phase Progress** - Completion percentage per phase
- **Particle Systems** - Ambient effects

#### How to Onboard Assets:
- **Implementation phases:** Edit the phases array. Each has `name`, `icon`, `description`, `duration`, `deliverables`, and `completionPercentage`.
- **Building blocks:** Edit the blocks data for the 3D construction visualization.
- **Deliverables:** Each phase has a list of deliverables that can be customized.

---

### 4.23 Orca (Forensics 3D)

**Route:** `/orca`
**File:** `client/src/pages/Orca.tsx` (983 lines)
**Purpose:** 3D forensics and incident response storytelling visualization.

#### Features:
- **Multi-Scene 3D Experience** - 8 scenes triggered by scroll position:
  1. **Office Scene** - Normal office environment
  2. **Error Scene** - Screens showing errors/breaches
  3. **Zoom Scene** - Close-up investigation
  4. **ISO Scene** - ISO compliance visualization
  5. **VAPT Scene** - Penetration testing visualization
  6. **Incident Scene** - Active incident response
  7. **Forensics Scene** - Digital forensics investigation
  8. **Report Scene** - Final report generation
- **Scroll-Based Navigation** - Scenes transition as user scrolls
- **React Three Fiber** - Uses R3F for declarative Three.js rendering
- **Custom 3D Objects** - Desks, monitors, servers, evidence markers

#### How to Onboard Assets:
- **Scenes:** Edit the scenes array. Each scene has a `component`, `title`, and `description`.
- **3D objects:** Edit individual scene components to add/modify 3D objects.
- **Scroll triggers:** Edit the scroll position thresholds for scene transitions.
- **Story content:** Edit the narrative text that accompanies each scene.

---

## 5. Shared Components

### Navigation
| Component | File | Description |
|-----------|------|-------------|
| `Navbar` | `components/Navbar.tsx` | Main navigation bar. Links: Home, Services, Case Studies, About, Contact, Attack Globe |
| `AnimeNavBar` | `components/ui/anime-navbar.tsx` | Animated nav component used by Navbar |

**To add a nav link:** Edit the `navItems` array in `Navbar.tsx`. Each item needs `name`, `url`, and `icon` (Lucide icon).

### Reusable UI Components
| Component | File | Usage |
|-----------|------|-------|
| `CTA` | `components/CTA.tsx` | Call-to-action section (used on Home, About, Services) |
| `ContactForm` | `components/ContactForm.tsx` | Form that posts to `/api/contact` |
| `ClientsSlider` | `components/ClientsSlider.tsx` | Client logo carousel |
| `Team` | `components/Team.tsx` | Team member cards |
| `ForensicsSection` | `components/ForensicsSection.tsx` | Forensics service showcase |
| `ComplianceSection` | `components/ComplianceSection.tsx` | ISO compliance showcase |
| `ThreatVortex` | `components/ThreatVortex.tsx` | 3D threat visualization |
| `AsciiHeroSection` | `components/AsciiHeroSection.tsx` | ASCII art hero section |
| `FloatingCyberThreats` | `components/FloatingCyberThreats.tsx` | Floating threat icons |
| `Services` | `components/Services.tsx` | Service cards component |

### UI Primitives (`components/ui/`)
Button, Card, Badge, Input, Select, Tooltip, Dialog, Sheet, Dropdown, Table, Chart, Progress, Carousel, and many more shadcn/ui components.

### Animation Components
| Component | File | Purpose |
|-----------|------|---------|
| `AmbientParticles` | `ui/ambient-particles.tsx` | Background particle effects |
| `EtherealShadow` | `ui/ethereal-shadow.tsx` | Shadow/glow effects |
| `Typewriter` | `ui/typewriter.tsx` | Typewriter text animation |
| `RealisticSolarSystem` | `ui/realistic-solar-system.tsx` | 3D solar system |
| `HorizonHeroSection` | `ui/horizon-hero-section.tsx` | Hero with horizon effect |

---

## 6. Asset Inventory & Onboarding

### Image Assets

| Asset | Location | Used By | How to Replace |
|-------|----------|---------|----------------|
| OG Image | `client/public/opengraph.jpg` | Social media previews (index.html) | Replace file, keep filename |
| Shield Icon | `attached_assets/generated_images/3d_shield_compliance_icon.png` | ComplianceSection on Home page | Replace file, keep filename |
| Wireframe Terrain | `attached_assets/generated_images/3d_wireframe_terrain_visualization.png` | Available but unused | Import where needed |
| Fingerprint Scan | `attached_assets/generated_images/digital_fingerprint_scan_visual.png` | Available but unused | Import where needed |
| Hero Background | `attached_assets/generated_images/cybersecurity_hero_background.png` | Available but unused | Import where needed |

### Texture Assets (Solar System)

| File | Location | Used By |
|------|----------|---------|
| `earth_color_4k.jpg` | `client/public/textures/` | RealisticSolarSystem |
| `earth_bump_4k.jpg` | `client/public/textures/` | RealisticSolarSystem |
| `earth_clouds_4k.png` | `client/public/textures/` | RealisticSolarSystem |
| `moon.jpg` | `client/public/textures/` | RealisticSolarSystem |
| `mars.jpg` | `client/public/textures/` | RealisticSolarSystem |
| `jupiter.jpg` | `client/public/textures/` | RealisticSolarSystem |
| `saturn.jpg` | `client/public/textures/` | RealisticSolarSystem |
| `sun.jpg` | `client/public/textures/` | RealisticSolarSystem |
| `mercury.jpg` | `client/public/textures/` | RealisticSolarSystem |
| `neptune.jpg` | `client/public/textures/` | RealisticSolarSystem |
| `uranus.jpg` | `client/public/textures/` | RealisticSolarSystem |

### CDN-Loaded Assets (Attack Globe)

| Asset | URL | Used By |
|-------|-----|---------|
| Earth Blue Marble | `unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg` | AttackGlobe |
| Earth Topology | `unpkg.com/three-globe@2.31.0/example/img/earth-topology.png` | AttackGlobe |
| Earth Clouds | `unpkg.com/three-globe@2.31.0/example/img/earth-clouds.png` | AttackGlobe |

### How to Add New Assets

1. **Static images** (used in HTML/CSS): Place in `client/public/`. Reference with absolute path: `/my-image.png`
2. **Imported images** (used in React components): Place in `attached_assets/` or a subfolder. Import with:
   ```typescript
   import myImage from "@assets/my-image.png";
   // Then use: <img src={myImage} />
   ```
3. **3D textures**: Place in `client/public/textures/`. Load with Three.js TextureLoader:
   ```typescript
   const texture = new THREE.TextureLoader().load('/textures/my-texture.jpg');
   ```

---

## 7. What "AI" Means in This Codebase

### Current State: No AI/ML Integration

After a complete audit of the entire codebase, **there is no AI, machine learning, or LLM integration** anywhere in the application. Specifically:

- No OpenAI, Gemini, Claude, or any LLM API calls
- No machine learning models or inference
- No AI-powered chatbot or assistant
- No AI-driven threat detection or analysis
- No natural language processing

### What Appears to Be "AI" But Isn't

Every "intelligent" feature on the site is a **frontend simulation using randomized data and timers**:

| Feature | What It Looks Like | What It Actually Does |
|---------|-------------------|----------------------|
| Vulnerability Scanner | Scans a URL for vulnerabilities | Generates random vulnerability types with `Math.random()` |
| Attack Globe | Real-time cyber attack detection | Generates random attacks between random cities every 1-5 seconds |
| API Security Lab | Detects and blocks API attacks | Generates random attack events with `setInterval` |
| Risk Assessment | AI-powered risk scoring | Displays hardcoded risk scores |
| Cloud Security Center | Multi-cloud threat detection | Shows hardcoded security metrics |
| Mobile Security | Device vulnerability scanning | Generates random findings with `Math.random()` |
| DevSecOps Pipeline | Automated security scanning | Timer-based stage progression |
| Code Review | AI code vulnerability detection | Scanner beam animation over hardcoded code snippets |
| Compliance Dashboard | Automated compliance tracking | Displays hardcoded compliance percentages |

### To Add Real AI/ML Capabilities

If you want to add actual AI functionality, here's what would be needed:

1. **AI-Powered Vulnerability Scanner:**
   - Add API endpoint: `POST /api/scan` in `server/routes.ts`
   - Integrate with scanning tools (OWASP ZAP, Nuclei, or commercial APIs)
   - Or integrate an LLM (OpenAI/Gemini) for code analysis
   - Update `VulnerabilityScanner.tsx` to call the API instead of `Math.random()`

2. **AI Chatbot / Assistant:**
   - Add WebSocket or API endpoint for chat
   - Integrate OpenAI/Gemini/Claude API with your API key
   - Create a chat UI component
   - Add to relevant pages

3. **AI-Powered Threat Intelligence:**
   - Integrate threat intelligence feeds (AlienVault OTX, VirusTotal, etc.)
   - Add backend processing for real attack data
   - Update Attack Globe to display real data

4. **AI Code Review:**
   - Integrate with code analysis APIs (SonarQube, Semgrep, or LLM-based)
   - Accept code input from users
   - Return real vulnerability analysis

---

## 8. Known Gaps & Limitations

### Functional Gaps

| Gap | Description | Impact | Fix Complexity |
|-----|-------------|--------|----------------|
| No AI/ML | All "intelligent" features are simulations | Major - features appear broken when users expect real functionality | High - requires backend integration |
| No user authentication | Users table exists but no login UI or auth flow | Medium - no protected features | Medium |
| No admin dashboard | No way to view contact form submissions | Low - must query database directly | Medium |
| Single API endpoint | Only `/api/contact` exists | Medium - all other features are frontend-only | High - requires many new endpoints |
| CDN dependency | Attack Globe textures load from unpkg.com CDN | Low - fails if CDN is down | Low - copy to local |

### Asset Gaps

| Gap | Description | Fix |
|-----|-------------|-----|
| Unused textures | Local planet textures exist in `public/textures/` but Attack Globe uses CDN versions | Update AttackGlobe to use local textures |
| Unused generated images | 3 generated images in `attached_assets/generated_images/` are unused | Use in relevant sections or remove |
| Large attached_assets | ~50+ files in `attached_assets/` including .blend files and large textures that bloat the repo | Move unused files out of repo |

### Navigation Gaps

| Gap | Description |
|-----|-------------|
| Hidden pages | Only 6 pages are in the Navbar. The other 17 pages are only accessible via direct URL or in-page links |
| Experience page discovery | Solar system page requires knowing the `/experience` URL |
| Dashboard pages not linked | Most dashboard pages (compliance, risk, cloud security, etc.) are not discoverable from the main navigation |

### Performance Considerations

| Issue | Description |
|-------|-------------|
| Large bundle | 2.5 MB JS bundle (731 KB gzipped) due to Three.js and many pages |
| No code splitting | All pages loaded upfront (no lazy loading / dynamic imports) |
| Many Three.js scenes | Multiple pages create heavy 3D scenes that consume GPU resources |

---

## 9. How to Add a New Feature Page

### Step-by-Step Guide

1. **Create the page component:**
   ```
   client/src/pages/MyNewPage.tsx
   ```

2. **Add the route in `App.tsx`:**
   ```typescript
   // client/src/App.tsx
   import MyNewPage from "@/pages/MyNewPage";

   // Inside the Router Switch:
   <Route path="/my-new-page" component={MyNewPage} />
   ```

3. **(Optional) Add to Navbar:**
   ```typescript
   // client/src/components/Navbar.tsx
   import { MyIcon } from "lucide-react";

   const navItems = [
     // ... existing items
     { name: "My Page", url: "/my-new-page", icon: MyIcon },
   ];
   ```

4. **(Optional) Add backend API:**
   ```typescript
   // server/routes.ts
   app.post("/api/my-endpoint", async (req, res) => {
     // Handle request
   });
   ```

5. **(Optional) Add database table:**
   ```typescript
   // shared/schema.ts
   export const myTable = pgTable("my_table", {
     id: serial("id").primaryKey(),
     // ... columns
   });
   ```

6. **Build and test:**
   ```bash
   npm run build
   npm run dev   # For development
   ```

---

## 10. Deployment

### Current Infrastructure

| Service | Resource | Spec |
|---------|----------|------|
| AWS App Runner | `arica-website` | 2 vCPU, 4 GB RAM, 2-5 instances |
| AWS RDS | `arica-website-db` | db.t3.small, PostgreSQL, 20 GB |
| AWS ECR | `arica-website` | Docker image registry |
| AWS CloudFront | `E319SR29FW2GY7` | CDN distribution |

### Deployment Steps

1. **Build the Docker image:**
   ```bash
   docker build -t arica-website .
   ```

2. **Push to ECR:**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 557845624595.dkr.ecr.us-east-1.amazonaws.com
   docker tag arica-website:latest 557845624595.dkr.ecr.us-east-1.amazonaws.com/arica-website:latest
   docker push 557845624595.dkr.ecr.us-east-1.amazonaws.com/arica-website:latest
   ```

3. **Trigger App Runner redeployment:**
   ```bash
   aws apprunner start-deployment --service-arn arn:aws:apprunner:us-east-1:557845624595:service/arica-website/1589653076d44a8eb9e96302e4997983
   ```

4. **Verify:**
   - App Runner URL: https://hgesimdp2m.us-east-1.awsapprunner.com
   - CloudFront URL: https://d7x1d0i7m5ts.cloudfront.net

### Environment Variables

| Variable | Description | Set In |
|----------|-------------|--------|
| `DATABASE_URL` | PostgreSQL connection string | App Runner environment |
| `NODE_ENV` | `production` | Dockerfile |
| `PORT` | `5000` | Dockerfile |

### Docker Build

The `Dockerfile` uses a multi-stage build:
1. **Stage 1 (build):** Installs deps, runs `npm run build` (compiles React + Express)
2. **Stage 2 (production):** Copies built artifacts, installs production deps only, runs `node dist/index.cjs`

---

## Quick Reference: All Routes

| Route | Page | In Navbar? | Has Backend? |
|-------|------|------------|--------------|
| `/` | Home | Yes | No |
| `/about` | About | Yes | No |
| `/services` | Services | Yes | No |
| `/forensics` | Services (alias) | No | No |
| `/compliance` | Services (alias) | No | No |
| `/contact` | Contact | Yes | **Yes** (`POST /api/contact`) |
| `/case-studies` | Case Studies | Yes | No |
| `/experience` | Solar System | No | No |
| `/attack-globe` | Attack Globe | Yes | No |
| `/vulnerability-scanner` | Vuln Scanner | No | No |
| `/compliance-dashboard` | Compliance | No | No |
| `/devsecops-pipeline` | Pipeline | No | No |
| `/devsecops` | DevSecOps 3D | No | No |
| `/api-security-lab` | API Security | No | No |
| `/cloud-security-center` | Cloud Security | No | No |
| `/mobile-security` | Mobile Security | No | No |
| `/risk-assessment` | Risk Assessment | No | No |
| `/security-policies` | Policies | No | No |
| `/security-architecture` | Architecture | No | No |
| `/code-review` | Code Review | No | No |
| `/certifications` | Certifications | No | No |
| `/security-training` | Training | No | No |
| `/ongoing-support` | Support | No | No |
| `/security-implementation` | Implementation | No | No |
| `/orca` | Forensics 3D | No | No |
| `/portal` | Contact (alias) | No | **Yes** |

---

## 11. Brand Guidelines

> Source: Arica Tech Brand Guidelines v1

### Company Info
- **Legal Name:** ARICA Technologies LLP
- **Corporate Office:** Law College Rd, Opp. Bhandarkar Institute, Shivajinagar, Pune - 411004
- **Email:** info@aricatech.com
- **Website:** www.aricatech.com

### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#3D70B7` | Primary brand color (80% usage) |
| Secondary Green | `#42BA90` | Secondary accent (20% usage) |
| Dark Navy | `#1C2C5A` | Dark backgrounds, text |
| White | `#FFFFFF` | Light backgrounds, text on dark |
| Grey | `#ACACAC` | Muted text, borders |
| Black | `#010101` | Body text, strong contrast |

> **Important:** Only use these official brand colors. Do not introduce additional colors.

#### Current Website vs Brand Guidelines

The current website uses a cyan/teal palette (`#00D4FF`, `#00B4D8`, `#0077B6`) which differs from the official brand colors (`#3D70B7` blue, `#42BA90` green). To align the website with brand guidelines, update the CSS custom properties in `client/src/index.css` (or the Tailwind config) to map `--primary` to `#3D70B7` and add the secondary green `#42BA90`.

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Primary (Headings) | Inter | Bold | Headings, highlights, important text |
| Secondary (Body) | Inter | Regular | Body copy, descriptions, paragraphs |

The website currently uses Inter as its font family, which aligns with the brand guidelines.

### Logo

- The brand name "ARICA" uses a heavy, geometric sans-serif typeface
- "TECHNOLOGIES LLP" appears centered beneath in smaller, clean font
- Logo variations: Full color, Black & White
- The logo file should be placed in `client/public/` and referenced in the Navbar component

### Stationery

The brand guidelines include stationery designs (business cards, letterheads) that follow the brand color scheme. These are for print use and do not directly affect the website.
