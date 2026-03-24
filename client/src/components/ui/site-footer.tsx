import { Link } from "wouter";
import { Shield, Linkedin, Twitter, Mail, Phone } from "lucide-react";
import { AsciiWorldMap } from "@/components/ui/ascii-world-map";

export function SiteFooter() {
  return (
    <footer className="relative bg-[hsl(222,47%,4%)] border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary/5 to-transparent animate-pulse-glow" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <div className="space-y-4">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group" data-testid="link-footer-logo">
                <div className="relative">
                  <Shield className="w-8 h-8 text-primary transition-all group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))]" />
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="font-display font-bold text-lg text-halo-white">ARICA TECH</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Elite cybersecurity solutions protecting enterprises from evolving digital threats. 
              Specializing in VAPT, ISO 27001 Certification, and Secure Software Development.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Office no: 1204, CTS, 682/686 Kotibhaskar and Mahati Residency, Kothrud, Pune, Maharashtra 411038, India
            </p>
            <a href="https://www.aricatech.com" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:text-primary/80 transition-colors mt-1 inline-block">
              www.aricatech.com
            </a>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-semibold text-halo-white text-sm uppercase tracking-wider">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-home">Home</span>
              </Link>
              <Link href="/services">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-services">Services</span>
              </Link>
              <Link href="/case-studies">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-case-studies">Case Studies</span>
              </Link>
              <Link href="/contact">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-contact">Contact</span>
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-semibold text-halo-white text-sm uppercase tracking-wider">Contact Us</h3>
            <div className="space-y-3">
              <a 
                href="mailto:contact@aricatech.com" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-email"
              >
                <Mail className="w-4 h-4" />
                <span>contact@aricatech.com</span>
              </a>
              <a 
                href="tel:+917091175596" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-phone"
              >
                <Phone className="w-4 h-4" />
                <span>+91 70911 75596</span>
              </a>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-footer-linkedin"
                className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-footer-twitter"
                className="p-2 rounded-lg bg-white/5 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5">
          <div className="relative overflow-hidden">
            {/* ASCII World Map Background */}
            <div className="flex justify-center items-center py-8">
              <AsciiWorldMap />
            </div>

            {/* Centered copyright overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground">© 2026</p>
              <p className="text-sm text-muted-foreground">Arica Tech Security LLP.</p>
              <p className="text-sm text-muted-foreground">Securing the digital frontier.</p>
            </div>
          </div>

          {/* Massive ARICA TECH text at bottom */}
          <div className="relative overflow-hidden -mb-6 sm:-mb-10 md:-mb-16">
            <div className="select-none pointer-events-none flex justify-center" aria-hidden="true">
              <span
                className="text-[5rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] font-display font-black tracking-[0.05em] leading-none"
                style={{
                  color: 'rgba(255, 255, 255, 0.06)',
                }}
              >
                ARICA TECH
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
