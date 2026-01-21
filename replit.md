# Arica Tech Security Website

## Overview

This is a modern cybersecurity company website for **Arica Tech Security**, built as a full-stack TypeScript application. The site showcases enterprise security services including VAPT (Vulnerability Assessment & Penetration Testing), ISO 27001 Audit & Certification, and Secure Custom Software Development. The application features a React frontend with animated UI components, an Express backend API, and PostgreSQL database for storing contact inquiries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: Framer Motion for page transitions and interactive effects
- **3D Graphics**: Spline (@splinetool/react-spline) for interactive 3D hero scenes
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ES modules)
- **API Design**: RESTful endpoints under `/api` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod for type-safe schemas

### Data Storage
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` - contains users and contact_inquiries tables
- **Migrations**: Drizzle Kit (`npm run db:push` for schema sync)

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   │   └── ui/       # shadcn/ui components
│   │   ├── pages/        # Route pages (Home, About, Services, Contact, etc.)
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and query client
├── server/           # Backend Express application
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database access layer
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle database schema + Zod validators
```

### Path Aliases
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`
- `@assets` → `./attached_assets`

### Development vs Production
- **Development**: Vite dev server with HMR, served through Express middleware
- **Production**: Static files built to `dist/public`, server bundled with esbuild to `dist/index.cjs`

## External Dependencies

### Core Libraries
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm + drizzle-kit**: Database ORM and migration tooling
- **zod + drizzle-zod**: Runtime validation and type generation
- **framer-motion**: Animation library for React

### UI Framework
- **Radix UI**: Comprehensive set of accessible UI primitives (accordion, dialog, dropdown, tabs, etc.)
- **class-variance-authority**: Component variant styling
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library

### 3D/Visual Effects
- **@splinetool/react-spline + @splinetool/runtime**: 3D scene rendering
- **UnicornStudio**: External script for ASCII/visual effects (loaded dynamically)

### Database
- **PostgreSQL**: Primary database (requires DATABASE_URL environment variable)
- **pg**: PostgreSQL client for Node.js
- **connect-pg-simple**: Session storage (available but not currently used)

### Build & Development
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

## Core Services Focus
The website is designed around three core cybersecurity services:
1. **VAPT** - Vulnerability Assessment & Penetration Testing (network, web app, API, mobile)
2. **ISO Audit** - ISO 27001 compliance, gap analysis, certification support
3. **Custom Software Development** - Secure software architecture, DevSecOps, code review

## Design System (Arctic Wolf-Inspired)
Color scheme inspired by Arctic Wolf website with deep navy backgrounds and electric cyan accents:
- **Background**: Deep navy (hsl 222 47% 5%)
- **Primary**: Electric cyan (hsl 192 95% 50%) - #00D4FF equivalent
- **Accent**: Purple (hsl 280 70% 55%)
- **Halo White**: Soft off-white (hsl 0 0% 96%) - used for premium text highlights, section headers
- **Bulgarian Rose**: Deep burgundy (hsl 359 88% 15%) - used for emergency/critical indicators, danger states
- **Aurora Background**: Animated gradient with cyan/purple hints on all pages
- **Dot Grid Pattern**: Subtle cyan-tinted dots at 40px spacing
- **Smooth Scrolling**: Native CSS scroll-behavior for refined navigation

## Special Effects Components
Strategic animation effects used throughout the site (not overused to avoid "cheap" look):
- **R3FCyberHero** (`@/components/ui/r3f-cyber-hero.tsx`) - React Three Fiber powered 3D hero with Fireship-style scroll-driven camera movements. Features animated cyber grid floor, floating security shields (icosahedrons with fresnel shaders), 600 dynamic data particles, rotating security rings, and mouse parallax effects. Uses @react-three/fiber, @react-three/drei for declarative 3D.
- **FluidSimulation** (`@/components/ui/fluid-simulation.tsx`) - WebGL 2D fluid dynamics simulation using Navier-Stokes equations. Configurable color schemes (cyan, purple, mixed). Used as subtle fixed background on Homepage (5% opacity) and Attack Globe page (15% opacity). Interactive mouse/touch response with ambient auto-splatting.
- **HorizonHeroSection** (`@/components/ui/horizon-hero-section.tsx`) - Three.js 3D space hero with 5000-star field, animated nebula (cyan/purple), distant planet silhouettes, and GSAP scroll-triggered camera movement. Requires WebGL with graceful fallback. Full-page (300vh) with scroll-based section transitions.
- **RealisticSolarSystem** (`@/components/ui/realistic-solar-system.tsx`) - Three.js "Galaxy Journey" featuring THREE SERVICE-THEMED GALAXIES with physics-based enhancements: planet hover wobble/glow/scale pulse, particle bursts on hover, shockwave ring transitions, camera shake during galaxy switches, and scroll momentum/inertia. Each galaxy has 5 interactive planets with service descriptions. Proper cleanup/disposal on unmount prevents memory leaks.
- **CyberAttackGlobe** (`@/components/ui/cyber-attack-globe.tsx`) - WebGL globe with physics-enhanced attack visualization: impact flash/particle bursts at target cities, glowing arc trails with fade effects, atmospheric pulsing based on attack intensity, data stream particles orbiting the globe, auto-rotation, and camera breathing effect. Simulates attacks between 20 global cities every 400ms.
- **AmbientParticles** (`@/components/ui/ambient-particles.tsx`) - Reusable CSS-animated ambient particles with three variants: dots (floating upward), network (connecting lines), and data (drifting particles). Used on Services, About, and Case Studies pages for cohesive visual polish.
- **Typewriter** (`@/components/ui/typewriter.tsx`) - Cycling text effect on Services page header
- **MorphButton** (`@/components/ui/morph-button.tsx`) - Animated submit button with loading state on Contact form
- **SecurityScanAnimation** (`@/components/ui/security-scan-animation.tsx`) - Live vulnerability scanning visualization on Forensics section
- **SplineScene** - 3D robot on homepage hero (requires WebGL, graceful fallback)
- **LinkPreview** - Hover previews for external links in ForensicsSection
- **EtherealShadow** - Animated background gradients on CTA sections (uses cyan color)
- **AnimeNavbar** - Floating pill-style navigation with smooth active state transitions
- **Aurora BG** - Subtle animated gradient background applied to all pages

## Recent Enhancements (January 2026)

### Global Components
- **MegaNavigation** (`@/components/ui/mega-navigation.tsx`) - Fixed glassmorphism navigation bar with dropdown menus for Compliance, Secure Software, and Security Services categories. Mobile hamburger menu with slide-out panel. ARIA labels and keyboard navigation for accessibility.
- **SiteFooter** (`@/components/ui/site-footer.tsx`) - Global footer with company info, quick links, contact details, social icons, and cyber grid pattern background.
- **CyberSpinner** (`@/components/ui/cyber-spinner.tsx`) - 3D rotating shield loading indicator with pulsing cyan glow. Size variants: sm/md/lg.
- **WebGLFallback** (`@/components/ui/webgl-fallback.tsx`) - Wrapper component that shows graceful fallback UI when WebGL is unavailable.
- **HyperspaceTransition** (`@/components/ui/hyperspace-transition.tsx`) - Three.js starfield animation for page transitions.

### WebGL Fallback System
- **webgl-utils.ts** (`@/lib/webgl-utils.ts`) - Detection utilities: `isWebGLAvailable()`, `isWebGL2Available()`, `getWebGLContext()`, `WEBGL_SUPPORTED` constant.
- All Three.js and R3F components are wrapped with WebGL detection to prevent crashes in unsupported environments.

### Accessibility Features
- Skip-to-content link
- ARIA labels on navigation dropdowns (aria-haspopup, aria-expanded)
- Keyboard navigation (Tab, Enter/Space, Escape)
- Focus-visible outlines with cyan glow

### Page-Specific Enhancements
- **Experience Hub**: Welcome header, category portals, navigation instructions, ambient particles
- **Compliance Pages**: Collapsible sections, color-coded progress bars, card flip animations
- **Secure Software Pages**: Zoom controls, bar charts, code highlighting, quiz feedback with localStorage
- **Security Services Pages**: Zoom/search controls, URL validation, API input fields, OWASP tooltips

## Page Structure
- **Home** (`/`): Hero with 3D robot, Services grid, Forensics section, Compliance section, CTA
- **Services** (`/services`): Typewriter header, 3 core services with detailed features
- **Case Studies** (`/case-studies`): Filterable case studies (VAPT, ISO Audit, Software, Enterprise)
- **About** (`/about`): Company story, stats (200+ assessments, 50+ clients), values, team
- **Contact** (`/contact`): Contact form with MorphButton, contact info cards
- **Experience** (`/experience`): Interactive solar system journey showcasing security services
- **Attack Globe** (`/attack-globe`): Dramatic "Every 39 Seconds" messaging, fluid simulation background, live attack/loss counters, key cybersecurity statistics, and strong VAPT call-to-action with compelling breach prevention data
- **Mobile Security** (`/mobile-security`): Interactive mobile security testing simulation with 3D phone visualization, device selection panel (iOS/Android), animated security scan phases, vulnerability cards with severity levels, OWASP Mobile Top 10 checklist, and app permissions analyzer
- **Risk Assessment** (`/risk-assessment`): Interactive risk assessment dashboard with circular risk score indicator, 6 risk category cards with expandable details, threat matrix visualization, risk trend chart, action items panel with checkboxes, and compliance scorecard for ISO 27001/NIST/SOC 2
- **API Security Lab** (`/api-security-lab`): Interactive API security testing with endpoint testing simulation, authentication panel, rate limiting heatmap, and data exposure testing
- **Cloud Security Center** (`/cloud-security-center`): Cloud infrastructure visualization, IAM policy assessment, container security cards, and real-time security events
- **Security Policies** (`/security-policies`): 3D document/shield animation with orbiting policy documents, 6 policy category cards, animated compliance meter with particles, and interactive policy builder
- **Security Implementation** (`/security-implementation`): 3D building animation showing security controls being constructed with cranes and particles, 6 implementation phases with timeline, Gantt-style progress, and deliverables checklist
- **Certifications** (`/certifications`): 3D rotating certification badges (hexagons, shields, circles) with sparkle effects, 6 certification cards (ISO 27001, SOC 2, GDPR, PCI DSS, HIPAA, ISO 22301), certification journey timeline, and trust indicators
- **Security Architecture** (`/security-architecture`): 3D network topology with animated nodes and data packets, 6 security layer cards, architecture health score, and defense-in-depth visualization with attack simulation
- **DevSecOps** (`/devsecops`): 3D CI/CD pipeline animation with flowing packages and security laser gates, 6 security integration cards, pipeline metrics dashboard, and interactive demo with run/stop controls
- **Code Review** (`/code-review`): 3D code analysis with matrix-style falling code, scanner beam effect, 6 vulnerability category cards, code quality gauges, and live demo with simulated code editor
- **Security Training** (`/security-training`): 3D learning path visualization with glowing nodes and milestone trophies, 6 training modules, progress dashboard with skill radar chart, and interactive quiz section
- **Ongoing Support** (`/ongoing-support`): 3D command center with holographic screens and central globe, 6 support service cards with SLA times, real-time metrics panel, and 4-tier SLA guarantee section