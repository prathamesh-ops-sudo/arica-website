import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, Home, Briefcase, FileSearch, Scale, BookOpen, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimeNavBar } from "@/components/ui/anime-navbar";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/forensics", label: "Forensics" },
  { href: "/compliance", label: "Compliance" },
  { href: "/case-studies", label: "Case Studies" },
];

const animeNavItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Services", url: "/services", icon: Briefcase },
  { name: "Case Studies", url: "/case-studies", icon: BookOpen },
  { name: "About", url: "/about", icon: FileSearch },
  { name: "Contact", url: "/contact", icon: Phone },
];

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getCurrentPage = () => {
    const current = animeNavItems.find(item => item.url === location);
    return current?.name || "Home";
  };

  return (
    <>
      <AnimeNavBar items={animeNavItems} defaultActive={getCurrentPage()} />
      
      {/* Spacer for fixed navbar */}
      <div className="h-20 md:h-24" />
    </>
  );
}
