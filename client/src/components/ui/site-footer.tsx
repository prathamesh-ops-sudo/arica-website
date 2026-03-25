import { Footer } from "@/components/ui/modem-animated-footer";
import { Shield, Linkedin, Mail } from "lucide-react";

export function SiteFooter() {
  const socialLinks = [
    {
      icon: <Linkedin className="w-6 h-6" />,
      href: "https://www.linkedin.com/company/aricatech",
      label: "LinkedIn",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      href: "mailto:contact@aricatech.com",
      label: "Email",
    },
  ];

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <Footer
      brandName="Arica Tech"
      brandDescription="Cybersecurity solutions that protect your business from evolving threats. Trusted by enterprises worldwide."
      socialLinks={socialLinks}
      navLinks={navLinks}
      brandIcon={
        <Shield className="w-8 sm:w-10 md:w-14 h-8 sm:h-10 md:h-14 text-background drop-shadow-lg" />
      }
    />
  );
}
