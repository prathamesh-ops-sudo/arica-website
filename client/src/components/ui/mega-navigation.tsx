"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "wouter"
import { 
  Menu, X, ChevronDown, Shield, FileCheck, AlertTriangle, 
  BookOpen, Award, Building2, Code2, GitBranch, Users, 
  GraduationCap, HeadphonesIcon, Globe, Search, Bug, 
  Smartphone, Cloud, Phone, Mail
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useHyperspaceTransition } from "./hyperspace-transition"

interface DropdownLink {
  name: string
  url: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  description?: string
}

interface NavDropdown {
  name: string
  links: DropdownLink[]
}

const complianceLinks: DropdownLink[] = [
  { name: "Compliance Dashboard", url: "/compliance-dashboard", icon: FileCheck, description: "Monitor compliance status" },
  { name: "Risk Assessment", url: "/risk-assessment", icon: AlertTriangle, description: "Evaluate security risks" },
  { name: "Security Policies", url: "/security-policies", icon: BookOpen, description: "Policy documentation" },
  { name: "Security Implementation", url: "/security-implementation", icon: Building2, description: "Implementation guides" },
  { name: "Certifications", url: "/certifications", icon: Award, description: "Industry certifications" },
]

const secureLinks: DropdownLink[] = [
  { name: "Security Architecture", url: "/security-architecture", icon: Building2, description: "System architecture design" },
  { name: "DevSecOps", url: "/devsecops", icon: GitBranch, description: "Secure CI/CD pipelines" },
  { name: "Code Review", url: "/code-review", icon: Code2, description: "Security code analysis" },
  { name: "Security Training", url: "/security-training", icon: GraduationCap, description: "Team education" },
  { name: "Ongoing Support", url: "/ongoing-support", icon: HeadphonesIcon, description: "24/7 security support" },
]

const servicesLinks: DropdownLink[] = [
  { name: "Attack Globe", url: "/attack-globe", icon: Globe, description: "Real-time threat map" },
  { name: "Vulnerability Scanner", url: "/vulnerability-scanner", icon: Search, description: "Automated scanning" },
  { name: "API Security Lab", url: "/api-security-lab", icon: Bug, description: "API penetration testing" },
  { name: "Mobile Security", url: "/mobile-security", icon: Smartphone, description: "Mobile app security" },
  { name: "Cloud Security Center", url: "/cloud-security-center", icon: Cloud, description: "Cloud infrastructure" },
]

const dropdowns: NavDropdown[] = [
  { name: "Compliance", links: complianceLinks },
  { name: "Secure Software", links: secureLinks },
  { name: "Security Services", links: servicesLinks },
]

function DropdownPanel({ 
  links, 
  isOpen, 
  onNavigate 
}: { 
  links: DropdownLink[]
  isOpen: boolean
  onNavigate: (url: string) => void 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[400px] p-4 rounded-lg border border-[#3D70B7]/30 bg-[rgba(10,10,30,0.95)] backdrop-blur-xl shadow-[0_0_40px_rgba(61,112,183,0.2)]"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 gap-1">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <motion.button
                  key={link.url}
                  onClick={() => onNavigate(link.url)}
                  className="flex items-start gap-3 p-3 rounded-md text-left transition-all duration-200 hover:bg-[#3D70B7]/10 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D70B7] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,10,30,0.95)]"
                  whileHover={{ x: 4 }}
                  data-testid={`dropdown-link-${link.url.replace('/', '')}`}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#42BA90]/20 to-[#3D70B7]/20 flex items-center justify-center group-hover:from-[#42BA90]/30 group-hover:to-[#3D70B7]/30 group-hover:shadow-[0_0_15px_rgba(61,112,183,0.3)] transition-all duration-200">
                    <Icon size={20} className="text-[#3D70B7] group-hover:drop-shadow-[0_0_8px_#3D70B7]" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-white group-hover:text-[#3D70B7] transition-colors">
                      {link.name}
                    </span>
                    {link.description && (
                      <span className="block text-xs text-white/50 mt-0.5">
                        {link.description}
                      </span>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function MegaNavigation() {
  const [location, setLocation] = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { triggerTransition } = useHyperspaceTransition()
  const navRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNavigate = useCallback((url: string) => {
    setOpenDropdown(null)
    setMobileOpen(false)
    if (location !== url) {
      triggerTransition(() => setLocation(url))
    }
  }, [location, setLocation, triggerTransition])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, dropdownName: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setOpenDropdown(prev => prev === dropdownName ? null : dropdownName)
    } else if (e.key === "Escape") {
      setOpenDropdown(null)
    }
  }, [])

  const handleMouseEnter = useCallback((dropdownName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setOpenDropdown(dropdownName)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [location])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-[#3D70B7] focus:text-black focus:rounded-md focus:outline-none"
        data-testid="skip-to-content"
      >
        Skip to content
      </a>

      <motion.nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[9999] bg-[rgba(10,10,30,0.85)] backdrop-blur-xl border-b border-[#3D70B7]/20 shadow-[0_4px_30px_rgba(61,112,183,0.1)]"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link 
              href="/" 
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D70B7] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,10,30,0.85)] rounded-md"
              data-testid="nav-logo"
            >
              <motion.div
                className="relative w-10 h-10 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#42BA90] to-[#3D70B7] rounded-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-[2px] bg-[rgba(10,10,30,0.9)] rounded-md" />
                <Shield className="w-5 h-5 relative z-10 text-[#3D70B7] drop-shadow-[0_0_8px_#3D70B7]" />
              </motion.div>
              <span className="hidden sm:block text-lg font-bold" style={{ color: '#3D70B7' }}>
                Arica Tech Security
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {dropdowns.map((dropdown) => (
                <div
                  key={dropdown.name}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(dropdown.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D70B7] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,10,30,0.85)]",
                      openDropdown === dropdown.name
                        ? "text-[#3D70B7] bg-[#3D70B7]/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === dropdown.name}
                    onClick={() => setOpenDropdown(prev => prev === dropdown.name ? null : dropdown.name)}
                    onKeyDown={(e) => handleKeyDown(e, dropdown.name)}
                    data-testid={`nav-dropdown-${dropdown.name.toLowerCase().replace(' ', '-')}`}
                  >
                    {dropdown.name}
                    <ChevronDown 
                      size={16} 
                      className={cn(
                        "transition-transform duration-200",
                        openDropdown === dropdown.name && "rotate-180"
                      )} 
                    />
                  </button>
                  <DropdownPanel
                    links={dropdown.links}
                    isOpen={openDropdown === dropdown.name}
                    onNavigate={handleNavigate}
                  />
                </div>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <motion.button
                onClick={() => handleNavigate("/case-studies")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D70B7] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,10,30,0.85)]",
                  location === "/case-studies"
                    ? "text-[#3D70B7] bg-[#3D70B7]/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid="nav-case-studies"
              >
                Case Studies
              </motion.button>
              <motion.button
                onClick={() => handleNavigate("/contact")}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-[#42BA90]/20 to-[#3D70B7]/20 border border-[#3D70B7]/40 text-[#3D70B7] hover:from-[#42BA90]/30 hover:to-[#3D70B7]/30 hover:border-[#3D70B7]/60 hover:shadow-[0_0_20px_rgba(61,112,183,0.3)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D70B7] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(10,10,30,0.85)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid="nav-contact"
              >
                <Phone size={16} />
                Contact
              </motion.button>
            </div>

            <motion.button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-md border border-[#3D70B7]/30 bg-[rgba(61,112,183,0.1)] text-[#3D70B7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D70B7]"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(61, 112, 183, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              data-testid="mobile-menu-toggle"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 bottom-0 z-[9998] w-80 max-w-[85vw] bg-[rgba(10,10,30,0.98)] backdrop-blur-xl border-l border-[#3D70B7]/20 shadow-[-10px_0_40px_rgba(61,112,183,0.15)] lg:hidden overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-6 pt-20">
                <div className="space-y-6">
                  {dropdowns.map((dropdown, index) => (
                    <motion.div
                      key={dropdown.name}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h3 className="text-xs font-semibold text-[#3D70B7]/60 uppercase tracking-wider mb-3">
                        {dropdown.name}
                      </h3>
                      <div className="space-y-1">
                        {dropdown.links.map((link) => {
                          const Icon = link.icon
                          const isActive = location === link.url
                          return (
                            <motion.button
                              key={link.url}
                              onClick={() => handleNavigate(link.url)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D70B7]",
                                isActive
                                  ? "bg-[#3D70B7]/15 text-[#3D70B7]"
                                  : "text-white/70 hover:text-white hover:bg-white/5"
                              )}
                              whileTap={{ scale: 0.98 }}
                              data-testid={`mobile-link-${link.url.replace('/', '')}`}
                            >
                              <Icon size={18} className={cn(isActive && "drop-shadow-[0_0_6px_#3D70B7]")} />
                              <span className="text-sm font-medium">{link.name}</span>
                            </motion.button>
                          )
                        })}
                      </div>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4 border-t border-[#3D70B7]/20"
                  >
                    <div className="space-y-1">
                      <motion.button
                        onClick={() => handleNavigate("/case-studies")}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D70B7]",
                          location === "/case-studies"
                            ? "bg-[#3D70B7]/15 text-[#3D70B7]"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                        whileTap={{ scale: 0.98 }}
                        data-testid="mobile-link-case-studies"
                      >
                        <BookOpen size={18} />
                        <span className="text-sm font-medium">Case Studies</span>
                      </motion.button>
                      <motion.button
                        onClick={() => handleNavigate("/contact")}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D70B7]",
                          location === "/contact"
                            ? "bg-[#3D70B7]/15 text-[#3D70B7]"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                        whileTap={{ scale: 0.98 }}
                        data-testid="mobile-link-contact"
                      >
                        <Mail size={18} />
                        <span className="text-sm font-medium">Contact</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#42BA90]/50 via-[#3D70B7]/50 to-[#42BA90]/50" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-16 md:h-20" id="main-content" />
    </>
  )
}
