"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "wouter"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  defaultActive?: string
}

export function AnimeNavBar({ items, className, defaultActive = "Home" }: NavBarProps) {
  const [location] = useLocation()
  const [mounted, setMounted] = useState(false)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>(defaultActive)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const currentItem = items.find(item => item.url === location)
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [location, items])

  if (!mounted) return null

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-[9999]", className)}>
      <div className="flex justify-center pt-4 md:pt-6">
        <motion.div 
          className="flex items-center gap-1 md:gap-2 bg-black/60 border border-white/10 backdrop-blur-lg py-1.5 md:py-2 px-2 md:px-3 rounded-full shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name
            const isHovered = hoveredTab === item.name

            return (
              <Link
                key={item.name}
                href={item.url}
                onClick={() => setActiveTab(item.name)}
                onMouseEnter={() => setHoveredTab(item.name)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative cursor-pointer text-xs md:text-sm font-medium px-3 md:px-5 py-2 md:py-2.5 rounded-full transition-all duration-300",
                  "text-white/60 hover:text-white",
                  isActive && "text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary/20 rounded-full -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}

                <motion.span
                  className="hidden md:inline relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
                <motion.span 
                  className="md:hidden relative z-10"
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={18} strokeWidth={2} />
                </motion.span>
          
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-white/5 rounded-full -z-10"
                    />
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
