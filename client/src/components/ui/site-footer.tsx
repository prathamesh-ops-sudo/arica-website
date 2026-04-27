import { Phone, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-background">
      {/* ARICA text with blue glow/shadow effect */}
      <div
        className="relative flex items-end justify-center overflow-hidden"
        style={{ height: "clamp(10rem, 22vw, 20rem)", background: "#0a0a0a" }}
      >
        {/* Outer blue glow - 1:3 ratio blue on outer sides */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(61,112,183,0.25) 0%, rgba(61,112,183,0.08) 40%, transparent 70%)",
          }}
        />
        {/* Side blue highlights */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to right, rgba(61,112,183,0.15) 0%, transparent 25%, transparent 75%, rgba(61,112,183,0.15) 100%)",
          }}
        />

        {/* ARICA text with blue highlight, faded border, and shadow */}
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
