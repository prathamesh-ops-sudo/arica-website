"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "wouter"
import { Menu, X, Home, Briefcase, BookOpen, Users, Mail, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useHyperspaceTransition } from "./hyperspace-transition"

interface NavItem {
  name: string
  url: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const navItems: NavItem[] = [
  { name: "Home", url: "/", icon: Home },
  { name: "Services", url: "/services", icon: Briefcase },
  { name: "Case Studies", url: "/case-studies", icon: BookOpen },
  { name: "About", url: "/about", icon: Users },
  { name: "Contact", url: "/contact", icon: Mail },
  { name: "Experience", url: "/experience", icon: Zap },
]

function HudCorner({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const isTop = position.includes("top")
  const isLeft = position.includes("left")
  
  return (
    <div
      className={cn(
        "absolute w-6 h-6 pointer-events-none",
        isTop ? "top-0" : "bottom-0",
        isLeft ? "left-0" : "right-0"
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-full h-full"
        style={{
          transform: `${isLeft ? "" : "scaleX(-1)"} ${isTop ? "" : "scaleY(-1)"}`,
        }}
      >
        <path
          d="M0 0 L24 0 L24 4 L4 4 L4 24 L0 24 Z"
          fill="none"
          stroke="#00D4FF"
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_#00D4FF]"
        />
      </svg>
    </div>
  )
}

function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF]/50 to-transparent pointer-events-none"
      initial={{ top: "0%" }}
      animate={{ top: "100%" }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}

export function HudNavigation() {
  const [location, setLocation] = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { triggerTransition } = useHyperspaceTransition()

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleNavigate = (url: string) => {
    if (location !== url) {
      triggerTransition(() => setLocation(url))
    }
  }

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  if (!mounted) return null

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[9999] px-4 md:px-8 py-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="relative max-w-7xl mx-auto">
          <div
            className="relative overflow-hidden rounded-lg border border-[#00D4FF]/30 bg-[rgba(10,10,30,0.8)] backdrop-blur-xl shadow-[0_0_30px_rgba(0,212,255,0.15)]"
          >
            <HudCorner position="top-left" />
            <HudCorner position="top-right" />
            <HudCorner position="bottom-left" />
            <HudCorner position="bottom-right" />
            <ScanLine />

            <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/5 via-transparent to-[#00D4FF]/5 pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,212,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30" />

            <div className="relative flex items-center justify-between px-6 py-3">
              <Link href="/" className="flex items-center gap-3 group">
                <motion.div
                  className="relative w-10 h-10 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF] to-[#00D4FF] rounded-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute inset-[2px] bg-[rgba(10,10,30,0.9)] rounded-md" />
                  <svg viewBox="0 0 24 24" className="w-5 h-5 relative z-10 text-[#00D4FF] drop-shadow-[0_0_8px_#00D4FF]">
                    <path
                      fill="currentColor"
                      d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
                    />
                  </svg>
                </motion.div>
                <div className="hidden sm:block">
                  <motion.span
                    className="text-lg font-bold bg-gradient-to-r from-[#00D4FF] to-[#00D4FF] bg-clip-text text-transparent"
                    whileHover={{ textShadow: "0 0 20px rgba(0, 212, 255, 0.5)" }}
                  >
                    CYBER GUARDIAN
                  </motion.span>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = location === item.url
                  const Icon = item.icon
                  
                  return (
                    <motion.div
                      key={item.name}
                      onClick={() => handleNavigate(item.url)}
                      className={cn(
                        "relative px-4 py-2 rounded-md cursor-pointer transition-all duration-300 group",
                        isActive
                          ? "text-[#00D4FF]"
                          : "text-white/60 hover:text-white"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="hud-active-bg"
                          className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/20 to-[#00D4FF]/20 rounded-md border border-[#00D4FF]/40"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <motion.div
                        className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          boxShadow: "0 0 20px rgba(0, 212, 255, 0.3), inset 0 0 20px rgba(0, 212, 255, 0.05)",
                        }}
                      />
                      <span className="relative z-10 flex items-center gap-2 text-sm font-medium">
                        <Icon size={16} className={cn(isActive && "drop-shadow-[0_0_8px_#00D4FF]")} />
                        {item.name}
                      </span>
                    </motion.div>
                  )
                })}
              </div>

              <motion.button
                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-md border border-[#00D4FF]/30 bg-[rgba(0,212,255,0.1)] text-[#00D4FF]"
                onClick={() => setMobileOpen(!mobileOpen)}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)" }}
                whileTap={{ scale: 0.95 }}
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
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[9998] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            
            <motion.div
              className="absolute top-20 left-4 right-4 overflow-hidden rounded-lg border border-[#00D4FF]/30 bg-[rgba(10,10,30,0.95)] backdrop-blur-xl shadow-[0_0_50px_rgba(0,212,255,0.2)]"
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <HudCorner position="top-left" />
              <HudCorner position="top-right" />
              <HudCorner position="bottom-left" />
              <HudCorner position="bottom-right" />
              <ScanLine />

              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,212,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30" />

              <div className="relative p-4 space-y-2">
                {navItems.map((item, index) => {
                  const isActive = location === item.url
                  const Icon = item.icon
                  
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNavigate(item.url)}
                      data-testid={`mobile-nav-${item.name.toLowerCase().replace(' ', '-')}`}
                    >
                      <motion.div
                        className={cn(
                          "relative flex items-center gap-4 px-4 py-3 rounded-md cursor-pointer transition-all duration-300",
                          isActive
                            ? "text-[#00D4FF] bg-gradient-to-r from-[#00D4FF]/20 to-[#00D4FF]/10 border border-[#00D4FF]/40"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon
                          size={20}
                          className={cn(
                            "transition-all duration-300",
                            isActive && "drop-shadow-[0_0_8px_#00D4FF]"
                          )}
                        />
                        <span className="font-medium">{item.name}</span>
                        {isActive && (
                          <motion.div
                            className="absolute right-4 w-2 h-2 rounded-full bg-[#00D4FF]"
                            layoutId="mobile-indicator"
                            style={{ boxShadow: "0 0 10px #00D4FF, 0 0 20px #00D4FF" }}
                          />
                        )}
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="h-1 bg-gradient-to-r from-[#00D4FF]/50 via-[#00D4FF]/50 to-[#00D4FF]/50" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-20 md:h-24" />
    </>
  )
}
