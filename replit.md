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
- **HorizonHeroSection** (`@/components/ui/horizon-hero-section.tsx`) - Three.js 3D space hero with 5000-star field, animated nebula (cyan/purple), parallax mountains, and GSAP scroll-triggered camera movement. Requires WebGL. Full-page (300vh) with scroll-based section transitions.
- **Typewriter** (`@/components/ui/typewriter.tsx`) - Cycling text effect on Services page header
- **MorphButton** (`@/components/ui/morph-button.tsx`) - Animated submit button with loading state on Contact form
- **SecurityScanAnimation** (`@/components/ui/security-scan-animation.tsx`) - Live vulnerability scanning visualization on Forensics section
- **SplineScene** - 3D robot on homepage hero (requires WebGL, graceful fallback)
- **LinkPreview** - Hover previews for external links in ForensicsSection
- **EtherealShadow** - Animated background gradients on CTA sections (uses cyan color)
- **AnimeNavbar** - Floating pill-style navigation with smooth active state transitions
- **Aurora BG** - Subtle animated gradient background applied to all pages

## Page Structure
- **Home** (`/`): Hero with 3D robot, Services grid, Forensics section, Compliance section, CTA
- **Services** (`/services`): Typewriter header, 3 core services with detailed features
- **Case Studies** (`/case-studies`): Filterable case studies (VAPT, ISO Audit, Software, Enterprise)
- **About** (`/about`): Company story, stats (200+ assessments, 50+ clients), values, team
- **Contact** (`/contact`): Contact form with MorphButton, contact info cards