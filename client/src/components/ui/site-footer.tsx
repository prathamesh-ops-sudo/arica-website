import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
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
        {/* DitheringShader wave background - 3 shades lighter than ARICA blue #3D70B7 → #8AABE0 */}
        <div className="absolute inset-0 w-full h-full z-0">
          <DitheringShader
            shape="wave"
            type="8x8"
            colorBack="#0a0a0a"
            colorFront="#8AABE0"
            pxSize={3}
            speed={0.6}
            width={dimensions.width}
            height={dimensions.height}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />
        </div>

        {/* ARICA text with blue highlight, faded border, and shadow - in front of wave */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none select-none z-10" aria-hidden="true">
          <span
            className="block text-center leading-none w-full"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "21vw",
              letterSpacing: "-0.04em",
              color: "transparent",
              background: "linear-gradient(to bottom, rgba(61,112,183,0.9) 0%, rgba(61,112,183,0.5) 40%, rgba(61,112,183,0.15) 80%, transparent 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              whiteSpace: "nowrap",
              lineHeight: "0.85",
              transform: "translateY(15%)",
              filter: "drop-shadow(0 0 30px rgba(61,112,183,0.4)) drop-shadow(0 0 60px rgba(61,112,183,0.2)) drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
              WebkitTextStroke: "1px rgba(61,112,183,0.2)",
            }}
          >
            ARICA
          </span>
        </div>
      </div>

      {/* Contact info bar */}
      <div className="px-6 py-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Phone */}
          <a href="tel:+917091175596" className="flex items-center gap-3 justify-center md:justify-start group">
            <div className="p-2 rounded-lg bg-[#42BA90]/10 text-[#42BA90] group-hover:bg-[#42BA90]/20 transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-sm text-white/70 group-hover:text-white transition-colors">+91 70911 75596</span>
          </a>
          {/* Email */}
          <a href="mailto:contact@aricatech.com" className="flex items-center gap-3 justify-center group">
            <div className="p-2 rounded-lg bg-[#42BA90]/10 text-[#42BA90] group-hover:bg-[#42BA90]/20 transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-sm text-white/70 group-hover:text-white transition-colors">contact@aricatech.com</span>
          </a>
          {/* Address (below phone per meeting) */}
          <div className="flex items-start gap-3 justify-center md:justify-end">
            <div className="p-2 rounded-lg bg-[#42BA90]/10 text-[#42BA90] flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-sm text-white/70 leading-relaxed">
              Office 1204, Kotibhaskar &amp; Mahati Residency,<br />
              Kothrud, Pune, Maharashtra 411038
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-center text-xs text-muted-foreground/60 italic">
            Built to protect, investigate, and comply.
          </p>
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Arica Tech Security LLP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
