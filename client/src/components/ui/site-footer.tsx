import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { LEGAL_POLICIES } from "@/content/legal";
import { DitheringShader } from "@/components/ui/dithering-shader";
import { SITE_NAVIGATION_GROUPS } from "@shared/site-navigation";

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
        className="relative flex items-center justify-center"
        style={{ height: "clamp(14rem, 28vw, 26rem)" }}
      >
        {/* DitheringShader wave background - 1 shade lighter than ARICA blue #3D70B7 → #4F82C9 */}
        <div className="absolute inset-0 w-full h-full z-0">
          <DitheringShader
            shape="wave"
            type="8x8"
            colorBack="#0a0a0a"
            colorFront="#4F82C9"
            pxSize={3}
            speed={0.6}
            width={dimensions.width}
            height={dimensions.height}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />
        </div>

        {/* ARICA text with blue highlight, faded border, and shadow - in front of wave */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10" aria-hidden="true">
          <span
            className="block text-center leading-none w-full"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "21vw",
              letterSpacing: "-0.04em",
              color: "transparent",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              whiteSpace: "nowrap",
              lineHeight: "1",
              filter: "drop-shadow(0 0 30px rgba(255,255,255,0.15)) drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
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

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-4">
          {LEGAL_POLICIES.map((p) => (
            <Link key={p.slug} href={`/legal/${p.slug}`}>
              <span className="text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer">
                {p.title}
              </span>
            </Link>
          ))}
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/5 pt-6 mb-6">
              {SITE_NAVIGATION_GROUPS.map((group) => (
            <div key={group.title} className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/60">{group.title}</h2>
              <div className="flex flex-col items-start gap-1.5">
                {group.links.map(([href, label]) => (
                  <Link key={href} href={href}>
                    <span className="text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer">
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
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
