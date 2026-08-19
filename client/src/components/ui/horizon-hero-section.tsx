"use client";

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useIsMobileOrTablet } from "@/hooks/use-mobile";

type DesktopHero = typeof import("./horizon-hero-desktop")["HorizonHeroSection"];

function MobileHero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-background px-6 pb-12 pt-32 text-center">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(28, 44, 90, 0.2), transparent 50%), radial-gradient(circle at 80% 30%, rgba(61, 112, 183, 0.2), transparent 50%)",
        }}
      />
      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-6">
        <h1 className="horizon-hero-title text-halo-white text-[clamp(1.8rem,8vw,3rem)]">
          ARICA TECH SECURITY
        </h1>
        <h2 className="text-2xl font-bold leading-tight text-white">
          Security That Goes Beyond Prevention
        </h2>
        <p className="max-w-sm text-base leading-7 text-slate-300">
          Built to protect, investigate, and comply.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-full bg-[#42BA90] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#42BA90]/90"
          >
            Talk to our team
          </Link>
          <Link
            href="/services"
            className="rounded-full border border-[#42BA90]/40 px-6 py-3 font-semibold text-[#8de0c2] transition-colors hover:bg-[#42BA90]/10"
          >
            Explore Services
          </Link>
        </div>
      </div>
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
