import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/forensics", label: "Forensics" },
  { href: "/compliance", label: "Compliance" },
  { href: "/case-studies", label: "Case Studies" },
];

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" data-testid="link-home-logo">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <Shield className="w-7 h-7 text-primary transition-all duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg tracking-tight leading-none">
                  ARICA TECH
                </span>
                <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
                  Security Division
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  data-testid={`link-nav-${link.label.toLowerCase().replace(' ', '-')}`}
                  className={`relative text-sm tracking-wide cursor-pointer transition-colors duration-300 ${
                    location === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/portal">
              <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Client Portal
              </span>
            </Link>
            <Link href="/contact">
              <Button
                data-testid="button-contact-analyst"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm"
              >
                Contact Analyst
              </Button>
            </Link>
          </div>

          <button
            data-testid="button-mobile-menu"
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    onClick={() => setMobileOpen(false)}
                    className={`block py-2 text-sm cursor-pointer ${
                      location === link.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
              <Link href="/contact">
                <Button
                  className="w-full bg-primary text-primary-foreground mt-4"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact Analyst
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
