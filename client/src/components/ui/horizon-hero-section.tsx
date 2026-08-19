"use client";

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useIsMobileOrTablet } from "@/hooks/use-mobile";

type DesktopHero = typeof import("./horizon-hero-desktop")["HorizonHeroSection"];

function MobileHero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background px-6 pb-14 pt-28 text-center">
      <div className="mhero-glow mhero-glow-a" aria-hidden="true" />
      <div className="mhero-glow mhero-glow-b" aria-hidden="true" />
      <div className="mhero-glow mhero-glow-c" aria-hidden="true" />
      <div className="mhero-grid" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-5">
        <span className="mhero-chip rounded-full px-4 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-slate-300">
          Cybersecurity Consultancy
        </span>

        <h1 className="horizon-hero-title text-halo-white text-[clamp(1.7rem,7.6vw,2.75rem)] leading-tight">
          ARICA TECH SECURITY
        </h1>

        <h2 className="mhero-title-accent text-[clamp(1.35rem,6vw,1.9rem)] font-bold leading-tight">
          Security That Goes Beyond Prevention
        </h2>

        <p className="max-w-xs text-[0.95rem] leading-7 text-slate-400">
          Built to protect, investigate, and comply.
        </p>

        <div className="flex w-full max-w-xs flex-col items-stretch gap-3 pt-1">
          <Link
            href="/contact"
            className="mhero-cta-primary rounded-full px-6 py-3.5 font-semibold text-white transition-transform"
          >
            Talk to our team
          </Link>
          <Link
            href="/services"
            className="mhero-chip rounded-full px-6 py-3.5 font-semibold text-slate-200 transition-colors active:bg-white/10"
          >
            Explore Services
          </Link>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[0.72rem] text-slate-400">
          {["VAPT", "ISO 27001 Audit", "Digital Forensics"].map((item) => (
            <li key={item} className="mhero-chip rounded-full px-3 py-1.5">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <span
        aria-hidden="true"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[0.62rem] uppercase tracking-[0.3em] text-slate-500"
      >
        Scroll
      </span>
    </section>
  );
}

function DesktopHeroFallback() {
  return (
    <div className="horizon-hero-container">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      <div className="horizon-hero-content z-[10]">
        <h1
          className="horizon-hero-title text-halo-white"
          style={{ fontSize: "clamp(1.5rem, 7.2vw, 7rem)", whiteSpace: "nowrap" }}
        >
          ARICA TECH SECURITY
        </h1>
      </div>
    </div>
  );
}

export function HorizonHeroSection() {
  const isMobileOrTablet = useIsMobileOrTablet();
  const [DesktopHeroComponent, setDesktopHeroComponent] = useState<DesktopHero | null>(null);

  useEffect(() => {
    if (isMobileOrTablet || window.innerWidth < 1024) return;

    let mounted = true;
    import("./horizon-hero-desktop").then(({ HorizonHeroSection: Component }) => {
      if (mounted) setDesktopHeroComponent(() => Component);
    });

    return () => {
      mounted = false;
    };
  }, [isMobileOrTablet]);

  if (isMobileOrTablet) return <MobileHero />;
  if (DesktopHeroComponent) return <DesktopHeroComponent />;
  return <DesktopHeroFallback />;
}

export { HorizonHeroSection as Component };
