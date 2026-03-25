import { Link } from "wouter";
import { Shield } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-background">
      {/* Massive brand text section */}
      <div className="relative pt-16 sm:pt-20 md:pt-28 pb-0">
        <div className="relative select-none pointer-events-none w-full px-[3%]" aria-hidden="true">
          <div
            className="text-center"
            style={{
              fontFamily: "'Alfa Slab One', serif",
              fontSize: "clamp(3rem, 15vw, 18rem)",
              color: "rgba(255, 255, 255, 0.08)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            ARICA
          </div>
        </div>

        {/* CTA button below the text */}
        <div className="relative z-10 flex justify-center mt-6 sm:mt-8 md:mt-10 pb-10 sm:pb-14">
          <Link href="/contact">
            <div
              className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-full pl-5 pr-2 py-2 cursor-pointer transition-all group border border-white/10"
              data-testid="footer-cta"
            >
              <Shield className="w-5 h-5 text-white/70" />
              <span className="bg-[#3D70B7] text-white text-sm font-semibold px-6 py-3 rounded-full group-hover:bg-[#4a80c7] transition-colors">
                Book a call
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-t border-white/5">
        <p className="text-xs sm:text-sm text-white/30">
          &copy; Arica Tech Security LLP
        </p>
        <p className="text-xs sm:text-sm text-white/30">
          Pune, India
        </p>
      </div>
    </footer>
  );
}
