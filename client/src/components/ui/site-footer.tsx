import { useEffect, useRef, useState } from "react";
import { DitheringShader } from "@/components/ui/dithering-shader";

export function SiteFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
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
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: "clamp(10rem, 22vw, 20rem)" }}
      >
        {/* DitheringShader wave background */}
        <div className="absolute inset-0">
          <DitheringShader
            shape="wave"
            type="8x8"
            colorBack="#0a0a0a"
            colorFront="#42BA90"
            pxSize={3}
            speed={0.6}
            width={dimensions.width}
            height={dimensions.height}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* ARICA text overlay */}
        <span
          className="pointer-events-none z-10 select-none block text-center leading-none w-full"
          aria-hidden="true"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "21vw",
            letterSpacing: "-0.04em",
            color: "#3D70B7",
            whiteSpace: "nowrap",
            lineHeight: "0.85",
            textShadow: "0 0 40px rgba(61,112,183,0.3), 0 0 80px rgba(61,112,183,0.15)",
          }}
        >
          ARICA
        </span>
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
