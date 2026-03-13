# ARICA Tech Cybersecurity Website

## Overview
This project is a modern, full-stack TypeScript cybersecurity company website for ARICA Tech Security LLP. It showcases enterprise security services including VAPT (Vulnerability Assessment & Penetration Testing), ISO 27001 Audit & Certification, and Secure Custom Software Development. The application features an animated React frontend, an Express backend API, and a PostgreSQL database for contact inquiries. The site uses a premium cyan "Obsidian Glow" theme with glassmorphic effects, clean professional design (no hackerish green terminal aesthetics), and is fully responsive for mobile, tablet, and desktop.

## Deployment
- **App Runner**: https://hgesimdp2m.us-east-1.awsapprunner.com (2 vCPU, 4 GB RAM, auto-scaling 2-5 instances)
- **CloudFront CDN**: https://d7x1d0i7m5ts.cloudfront.net
- **RDS PostgreSQL**: db.t3.small (arica-website-db)
- **ECR**: 557845624595.dkr.ecr.us-east-1.amazonaws.com/arica-website

## User Preferences
Preferred communication style: Simple, everyday language.
Design preference: Professional cybersecurity, not hackerish. No green terminal effects, no breach warnings, no HUD overlays.

## System Architecture

### Core Technologies
- **Frontend**: React 18 with TypeScript, Wouter for routing, Tailwind CSS for styling, shadcn/ui for UI components, Framer Motion for animations, Spline for 3D graphics, TanStack React Query for state management, and Vite for building.
- **Backend**: Node.js with Express, TypeScript, RESTful API design, Drizzle ORM with PostgreSQL, and Zod for schema validation.
- **Database**: PostgreSQL managed with Drizzle ORM, with schema defined in `shared/schema.ts` and migrations handled by Drizzle Kit.

### Visual and Interactive Design
The website employs an Apple-inspired design system featuring the "Obsidian Glow" cyan theme:
- **Color Palette**: Deep black (#050505) background, vibrant cyan accents (#0077B6 deep, #00B4D8 medium, #00D4FF glow), subtle white/gray text
- **Typography**: SF Pro Display/Inter font stack with Apple system fonts as fallback
- **Glassmorphism**: Frosted glass effects with cyan-tinted backdrop-blur (20-40px), subtle cyan borders (rgba 0,212,255 8-15%), and saturated overlays
- **Buttons**: Rounded corners (1rem), cyan gradient hover states with scale animations, glass variant for floating elements
- **Shadows**: Soft Apple-style shadows with cyan glow effects for interactive elements

### Mobile & Tablet Optimization
The site is fully responsive with specific optimizations:
- **Breakpoints**: `useIsMobile()` (<768px), `useIsTablet()` (768-1023px), `useIsMobileOrTablet()` (<1024px) hooks in `client/src/hooks/use-mobile.tsx`
- **3D Performance**: WebGLShader + R3FCyberHero disabled on mobile/tablet; CSS gradient fallback used instead. HorizonHeroSection skips Three.js canvas + EnergyBeam + TubesBackground on mobile
- **Touch Targets**: Global CSS ensures minimum 44px height for buttons/links on mobile
- **ThreatVortex**: Responsive height scaling (400px mobile / 500px tablet / 700px desktop)
- **RealisticSolarSystem**: Bloom post-processing disabled on mobile, reduced pixel ratio
- **FloatingCyberThreats**: Reduced particle counts on mobile (3/5/8 vs 8/14/22)
- **CyberAttackGlobe**: Reduced antialias + pixel ratio on mobile

### 3D and Animation Components
- **R3FCyberHero**: React Three Fiber 3D hero (desktop only)
- **HorizonHeroSection**: Three.js 3D space hero with star fields, nebulae, GSAP scroll (desktop only)
- **TubesBackground (NeonFlow)**: Interactive 3D tubes/neon effect (desktop only)
- **RealisticSolarSystem**: "Galaxy Journey" with service-themed galaxies and interactive planets
- **CyberAttackGlobe**: WebGL globe visualizing cyber attacks
- **ThreatVortex**: Interactive threat defense game
- **Orca**: Parallax scroll-driven 3D animation
- **MegaNavigation**: Fixed glassmorphism navigation bar with mobile hamburger menu
- **WebGL Fallback System**: Graceful fallback for unsupported environments

### Project Structure and Development
The project is organized into `client/` for the React frontend, `server/` for the Express backend, and `shared/` for common code like Drizzle schema and Zod validators. Path aliases are used for efficient module imports. Development leverages Vite for the frontend with HMR and esbuild for production server bundling.

### Routes
- `/` - Home page with hero, services overview, contact form
- `/experience` - 3D Galaxy Journey (RealisticSolarSystem)
- `/services` - Detailed services page
- `/contact` - Contact form
- `/attack-globe` - Live cyber attack visualization
- `/api-security-lab` - API security interactive lab
- `/threat-defense` - ThreatVortex interactive game

### Accessibility
Focuses on accessibility with features like skip-to-content links, ARIA labels, keyboard navigation, and focus-visible outlines.

## External Dependencies

### Core Technologies
- **@tanstack/react-query**: For server state management.
- **drizzle-orm**, **drizzle-kit**: For database ORM and migrations.
- **zod**, **drizzle-zod**: For runtime validation and type-safe schemas.
- **framer-motion**: For animations.

### UI and Visuals
- **Radix UI**: Accessible UI primitives.
- **tailwindcss**: Utility-first CSS framework.
- **@splinetool/react-spline**, **@splinetool/runtime**: For 3D scene rendering.
- **@react-three/fiber**, **@react-three/drei**: For declarative 3D scenes with React.
- **lucide-react**: Icon library.

### Database
- **PostgreSQL**: The primary database.
- **pg**: PostgreSQL client for Node.js.

### Build Tools
- **Vite**: Frontend build tool.
- **esbuild**: Server bundling.
