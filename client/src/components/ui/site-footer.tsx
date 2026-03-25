import { Link } from "wouter";
import { Shield } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden">
      {/* Light background section */}
      <div className="relative bg-[#f5f5f5] pt-12 sm:pt-16 md:pt-20 pb-0 overflow-hidden">
        {/* Massive brand text — SVG for perfect edge-to-edge scaling */}
        <div className="relative select-none pointer-events-none w-full" aria-hidden="true">
          {/* ARICA — fills full width */}
          <svg
            viewBox="0 0 460 110"
            className="w-full block"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="230"
              y="90"
              textAnchor="middle"
              style={{
                fontFamily: "'Alfa Slab One', serif",
                fontSize: "128px",
                fill: "#1a1a1a",
                letterSpacing: "-2px",
              }}
            >
              ARICA
            </text>
          </svg>
          {/* TECH — fills full width with larger font to compensate fewer chars */}
          <svg
            viewBox="0 0 460 135"
            className="w-full block -mt-[2%]"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="230"
              y="110"
              textAnchor="middle"
              style={{
                fontFamily: "'Alfa Slab One', serif",
                fontSize: "155px",
                fill: "#1a1a1a",
                letterSpacing: "-2px",
              }}
            >
              TECH
            </text>
          </svg>
        </div>

        {/* CTA button overlapping the text */}
        <div className="relative z-10 flex justify-center -mt-[5%] pb-8 sm:pb-12">
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
