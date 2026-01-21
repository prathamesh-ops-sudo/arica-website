import { AnimeNavBar } from "@/components/ui/anime-navbar";
import { Home, Briefcase, FileText, Users, Mail, Globe } from "lucide-react";

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Services", url: "/services", icon: Briefcase },
  { name: "Case Studies", url: "/case-studies", icon: FileText },
  { name: "About", url: "/about", icon: Users },
  { name: "Contact", url: "/contact", icon: Mail },
  { name: "Attack Globe", url: "/attack-globe", icon: Globe },
];

export function Navbar() {
  return <AnimeNavBar items={navItems} />;
}
