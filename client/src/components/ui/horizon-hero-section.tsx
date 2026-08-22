"use client";

import { useEffect, useState } from "react";
import { useIsMobileOrTablet } from "@/hooks/use-mobile";
import { isWebGLAccelerated } from "@/lib/webgl-utils";
import { HorizonHeroCss } from "./horizon-hero-css";

type DesktopHero = typeof import("./horizon-hero-desktop")["HorizonHeroSection"];

function DesktopHeroFallback() {
  return <HorizonHeroCss desktop />;
}

export function HorizonHeroSection() {
  const isMobileOrTablet = useIsMobileOrTablet();
  const [webglAccelerated] = useState(() =>
    typeof window === "undefined" || window.innerWidth < 1024
      ? true
      : isWebGLAccelerated(),
  );
  const [DesktopHeroComponent, setDesktopHeroComponent] = useState<DesktopHero | null>(null);

  useEffect(() => {
    if (isMobileOrTablet || window.innerWidth < 1024 || !webglAccelerated) return;

    let mounted = true;
    import("./horizon-hero-desktop").then(({ HorizonHeroSection: Component }) => {
      if (mounted) setDesktopHeroComponent(() => Component);
    });

    return () => {
      mounted = false;
    };
  }, [isMobileOrTablet, webglAccelerated]);

  if (isMobileOrTablet) return <HorizonHeroCss />;
  if (!webglAccelerated) return <DesktopHeroFallback />;
  if (DesktopHeroComponent) return <DesktopHeroComponent />;
  return <DesktopHeroFallback />;
}

export { HorizonHeroSection as Component };
