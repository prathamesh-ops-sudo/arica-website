import { Link } from "wouter";
import { Shield } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden">
      {/* Light background section */}
      <div className="relative bg-[#f5f5f5] pt-16 sm:pt-20 md:pt-28 pb-0">
        {/* Massive brand text — single line like Halaska reference */}
        <div className="relative select-none pointer-events-none w-full px-[3%]" aria-hidden="true">
          <div
            className="text-center"
            style={{
              fontFamily: "'Alfa Slab One', serif",
              fontSize: "clamp(2.5rem, 11.5vw, 14rem)",
              color: "#1a1a1a",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            ARICA TECH
          </div>
        </div>

        {/* CTA button below the text */}
        <div className="relative z-10 flex justify-center mt-6 sm:mt-8 md:mt-10 pb-10 sm:pb-14">
          <Link href="/contact">
            <div
              className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 shadow-xl rounded-full pl-5 pr-2 py-2 cursor-pointer transition-all group border border-gray-200/50"
              data-testid="footer-cta"
            >
              <Shield className="w-5 h-5 text-[#1a1a1a]" />
              <span className="bg-[#1C2C5A] text-white text-sm font-semibold px-6 py-3 rounded-full group-hover:bg-[#3D70B7] transition-colors">
                Book a call
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-5 bg-[#f5f5f5]">
        <p className="text-xs sm:text-sm text-[#999]">
          &copy; Arica Tech Security LLP
        </p>
        <p className="text-xs sm:text-sm text-[#999]">
          Pune, India
        </p>
      </div>
    </footer>
  );
}
