import { useEffect, useRef, useState } from "react";
import { DitheringShader } from "@/components/ui/dithering-shader";

export function SiteFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.round(rect.width) || 1920,
          height: Math.round(rect.height) || 400,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-background">
      {/* Wave shader background with ARICA text overlay */}
      <div
        ref={containerRef}
        className="relative flex items-end justify-center overflow-hidden"
        style={{ height: "clamp(10rem, 22vw, 20rem)" }}
      >
        {/* DitheringShader wave background - full bleed */}
        <div className="absolute inset-0 w-full h-full z-0">
          <DitheringShader
            shape="wave"
            type="8x8"
            colorBack="#0a0a0a"
            colorFront="#42BA90"
            pxSize={3}
            speed={0.6}
            width={dimensions.width}
            height={dimensions.height}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />
        </div>

        {/* ARICA text overlay - white with gradient fade like original */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none select-none z-10" aria-hidden="true">
          <span
            className="block text-center leading-none w-full"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "21vw",
              letterSpacing: "-0.04em",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              whiteSpace: "nowrap",
              lineHeight: "0.85",
              transform: "translateY(15%)",
            }}
          >
            ARICA
          </span>
        </div>
      </div>

      {/* Tagline + Copyright bar */}
      <div className="px-6 py-4 space-y-1">
        <p className="text-center text-xs text-muted-foreground/60 italic">
          Built to protect, investigate, and comply.
        </p>
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Arica Tech Security LLP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
