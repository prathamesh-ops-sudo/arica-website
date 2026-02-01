# Cyber Guardian Security Website

## Overview
This project is a modern, full-stack TypeScript cybersecurity company website for Cyber Guardian. It showcases enterprise security services including VAPT, ISO 27001 Audit & Certification, and Secure Custom Software Development. The application features an animated React frontend, an Express backend API, and a PostgreSQL database for contact inquiries. The site is designed with an Apple-inspired aesthetic featuring transparent glassmorphic effects, premium SF Pro/Inter fonts, matte neutral colors, and subtle blue accents. The design incorporates advanced visual effects and interactive 3D components to enhance user engagement and convey a high-tech security image. The project aims to provide an immersive and informative experience for potential clients seeking cybersecurity solutions.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Core Technologies
- **Frontend**: React 18 with TypeScript, Wouter for routing, Tailwind CSS for styling, shadcn/ui for UI components, Framer Motion for animations, Spline for 3D graphics, TanStack React Query for state management, and Vite for building.
- **Backend**: Node.js with Express, TypeScript, RESTful API design, Drizzle ORM with PostgreSQL, and Zod for schema validation.
- **Database**: PostgreSQL managed with Drizzle ORM, with schema defined in `shared/schema.ts` and migrations handled by Drizzle Kit.

### Visual and Interactive Design
The website employs an Apple-inspired design system featuring the "Obsidian Glow" theme:
- **Color Palette**: Deep black (#050505) background, vibrant purple accents (#3A0CA3 primary, #7B2FE0 light, #9D4EDD glow), subtle white/gray text
- **Typography**: SF Pro Display/Inter font stack with Apple system fonts as fallback
- **Glassmorphism**: Frosted glass effects with purple-tinted backdrop-blur (20-40px), subtle purple borders (rgba 138,43,226 8-15%), and saturated overlays
- **Buttons**: Rounded corners (1rem), purple gradient hover states with scale animations, glass variant for floating elements
- **Shadows**: Soft Apple-style shadows with purple glow effects for interactive elements
Key visual elements include WebGL shader backgrounds with neutral-colored fluid effects, subtle dot grid patterns, and smooth scrolling.

The site heavily utilizes advanced 3D and animation components to create a dynamic and immersive user experience:
- **R3FCyberHero**: A React Three Fiber powered 3D hero section with scroll-driven camera movements, animated cyber grid, floating security shields, dynamic data particles, and mouse parallax effects.
- **FluidSimulation**: WebGL 2D fluid dynamics simulation for subtle background effects.
- **HorizonHeroSection**: A Three.js 3D space hero with star fields, animated nebulae, and GSAP scroll-triggered camera movement.
- **RealisticSolarSystem**: A "Galaxy Journey" featuring service-themed galaxies with physics-based interactive planets.
- **CyberAttackGlobe**: A WebGL globe visualizing cyber attacks with impact flashes, arc trails, and atmospheric pulsing.
- **Orca**: An immersive parallax scroll-driven 3D animation experience narrating the security response journey, featuring post-processing effects (bloom, vignette, chromatic aberration), Apple-neutral color palette, and hyperspace transition to the Experience page.
- **AmbientParticles**: Reusable CSS-animated particles for visual polish.
- **MegaNavigation**: A fixed glassmorphism navigation bar with dropdown menus and mobile responsiveness.
- **WebGL Fallback System**: Utilizes `webgl-utils.ts` to detect WebGL capabilities and provides graceful fallback for unsupported environments.

### Project Structure and Development
The project is organized into `client/` for the React frontend, `server/` for the Express backend, and `shared/` for common code like Drizzle schema and Zod validators. Path aliases are used for efficient module imports. Development leverages Vite for the frontend with HMR and esbuild for production server bundling.

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