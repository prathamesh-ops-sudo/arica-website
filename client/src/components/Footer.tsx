import { Link } from "wouter";
import { Shield, Linkedin, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-sm text-halo-white">ARICA TECH</span>
            </div>
          </Link>

          <p className="text-sm text-muted-foreground text-center">
            © 2024 Arica Tech Security Division. All rights reserved. Government Contracted.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="#"
              data-testid="link-social-linkedin"
              className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#"
              data-testid="link-social-twitter"
              className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              data-testid="link-social-github"
              className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
