import { AnimeNavBar } from "@/components/ui/anime-navbar";
import { Home, Briefcase, Users, UsersRound, Mail, BookOpen } from "lucide-react";

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Services", url: "/services", icon: Briefcase },
  { name: "Blog", url: "/blog", icon: BookOpen },
  { name: "About", url: "/about", icon: Users },
  { name: "Team", url: "/team", icon: UsersRound },
  { name: "Contact", url: "/contact", icon: Mail },
];

export function Navbar() {
  return <AnimeNavBar items={navItems} />;
}
