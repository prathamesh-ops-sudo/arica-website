import { Phone } from "lucide-react";
import { Link } from "wouter";

type MobileConversionBarProps = {
  hidden: boolean;
};

export function MobileConversionBar({ hidden }: MobileConversionBarProps) {
  if (hidden) return null;

  return (
    <aside className="mobile-conversion-bar md:hidden" aria-label="Contact options">
      <Link
        href="/contact"
        className="mobile-conversion-primary"
      >
        Talk to our team
      </Link>
      <a
        href="tel:+917091175596"
        className="mobile-conversion-call"
        aria-label="Call Arica Tech Security"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        <span>Call</span>
      </a>
    </aside>
  );
}
