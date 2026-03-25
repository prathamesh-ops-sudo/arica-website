import { Link } from "wouter";
import { Shield } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative bg-background overflow-hidden">
      {/* Large brand name */}
      <div className="select-none pointer-events-none px-4 pt-16 sm:pt-20 md:pt-24" aria-hidden="true">
        <div className="flex justify-center">
          <span
            className="font-display font-black leading-[0.85] tracking-tight text-center"
            style={{
              fontSize: "clamp(4rem, 14vw, 16rem)",
              color: "hsl(var(--foreground))",
            }}
          >
            ARICA TECH
          </span>
        </div>
      </div>

      {/* CTA button centered */}
      <div className="flex justify-center py-8 sm:py-10">
        <Link href="/contact">
          <div
            className="inline-flex items-center gap-3 bg-muted/80 hover:bg-muted rounded-full pl-3 pr-1 py-1 cursor-pointer transition-colors group"
            data-testid="footer-cta"
          >
            <Shield className="w-5 h-5 text-foreground" />
            <span className="bg-[#1C2C5A] text-white text-sm font-medium px-5 py-2.5 rounded-full group-hover:bg-[#3D70B7] transition-colors">
              Book a call
            </span>
          </div>
        </Link>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-6 sm:px-10 pb-6 pt-4 border-t border-border/30">
        <p className="text-xs sm:text-sm text-muted-foreground">
          © Arica Tech Security LLP
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Pune, India
        </p>
      </div>
    </footer>
  );
}
