# Arica Tech Security Website

## Overview
This project is a modern, full-stack TypeScript cybersecurity company website for Arica Tech Security. It showcases enterprise security services including VAPT, ISO 27001 Audit & Certification, and Secure Custom Software Development. The application features an animated React frontend, an Express backend API, and a PostgreSQL database for contact inquiries. The site is designed with an "Arctic Wolf-inspired" aesthetic, using deep navy backgrounds and electric cyan accents, and incorporates various advanced visual effects and interactive 3D components to enhance user engagement and convey a high-tech security image. The project aims to provide an immersive and informative experience for potential clients seeking cybersecurity solutions.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Core Technologies
- **Frontend**: React 18 with TypeScript, Wouter for routing, Tailwind CSS for styling, shadcn/ui for UI components, Framer Motion for animations, Spline for 3D graphics, TanStack React Query for state management, and Vite for building.
- **Backend**: Node.js with Express, TypeScript, RESTful API design, Drizzle ORM with PostgreSQL, and Zod for schema validation.
- **Database**: PostgreSQL managed with Drizzle ORM, with schema defined in `shared/schema.ts` and migrations handled by Drizzle Kit.

### Visual and Interactive Design
The website employs a sophisticated design system inspired by "Arctic Wolf," featuring a deep navy background (`hsl 222 47% 5%`) with electric cyan (`hsl 192 95% 50%`) and purple (`hsl 280 70% 55%`) accents. Key visual elements include an animated gradient background (Aurora Background), subtle dot grid patterns, and smooth scrolling.

The site heavily utilizes advanced 3D and animation components to create a dynamic and immersive user experience:
- **R3FCyberHero**: A React Three Fiber powered 3D hero section with scroll-driven camera movements, animated cyber grid, floating security shields, dynamic data particles, and mouse parallax effects.
- **FluidSimulation**: WebGL 2D fluid dynamics simulation for subtle background effects.
- **HorizonHeroSection**: A Three.js 3D space hero with star fields, animated nebulae, and GSAP scroll-triggered camera movement.
- **RealisticSolarSystem**: A "Galaxy Journey" featuring service-themed galaxies with physics-based interactive planets.
- **CyberAttackGlobe**: A WebGL globe visualizing cyber attacks with impact flashes, arc trails, and atmospheric pulsing.
- **Orca**: An immersive parallax scroll-driven 3D animation experience narrating Arica's security response journey.
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