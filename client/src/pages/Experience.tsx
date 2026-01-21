import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { RealisticSolarSystem } from "@/components/ui/realistic-solar-system";
import { AmbientParticles } from "@/components/ui/ambient-particles";
import { useHyperspaceTransition } from "@/components/ui/hyperspace-transition";
import { 
  Shield, 
  FileCheck, 
  Code, 
  ChevronDown, 
  MousePointer2, 
  Orbit,
  Sparkles,
  ArrowRight,
  Zap
} from "lucide-react";

interface PortalCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  glowColor: string;
  delay: number;
}

function PortalCard({ title, description, icon, link, color, glowColor, delay }: PortalCardProps) {
  const [, setLocation] = useLocation();
  const { triggerTransition } = useHyperspaceTransition();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerTransition(() => {
      setLocation(link);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={link}
        onClick={handleClick}
        className="block relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(20,20,40,0.6) 100%)`,
          borderColor: isHovered ? color : 'rgba(255,255,255,0.1)',
          boxShadow: isHovered ? `0 0 40px ${glowColor}, inset 0 0 30px ${glowColor}` : 'none',
        }}
        data-testid={`portal-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="absolute inset-0 opacity-20" style={{
          background: `radial-gradient(circle at 50% 0%, ${color} 0%, transparent 60%)`,
        }} />
        
        <div className="relative p-6 flex flex-col items-center text-center space-y-4">
          <motion.div
            animate={{ 
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.2 : 1 
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-4 rounded-full"
            style={{ 
              background: `linear-gradient(135deg, ${color}20, ${color}40)`,
              boxShadow: `0 0 20px ${glowColor}`,
            }}
          >
            {icon}
          </motion.div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
          </div>
          
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color }}
          >
            <span>Explore</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </a>
    </motion.div>
  );
}

function NavigationInstructions() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30"
        >
          <div className="backdrop-blur-md bg-black/40 border border-cyan-500/30 rounded-full px-6 py-3 flex items-center gap-6">
            <div className="flex items-center gap-2 text-cyan-400 text-sm">
              <ChevronDown className="w-4 h-4 animate-bounce" />
              <span>Scroll to explore galaxies</span>
            </div>
            <div className="w-px h-4 bg-cyan-500/30" />
            <div className="flex items-center gap-2 text-purple-400 text-sm">
              <MousePointer2 className="w-4 h-4" />
              <span>Click planets for details</span>
            </div>
            <div className="w-px h-4 bg-cyan-500/30" />
            <div className="flex items-center gap-2 text-amber-400 text-sm">
              <Orbit className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Hover to interact</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Experience() {
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowUI(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const portals = [
    {
      title: "Security Services",
      description: "Real-time threat monitoring & attack surface visualization",
      icon: <Shield className="w-8 h-8 text-red-400" />,
      link: "/attack-globe",
      color: "#ff4444",
      glowColor: "rgba(255,68,68,0.3)",
    },
    {
      title: "Compliance",
      description: "ISO 27001 audit dashboards & compliance tracking",
      icon: <FileCheck className="w-8 h-8 text-amber-400" />,
      link: "/compliance-dashboard",
      color: "#ffc107",
      glowColor: "rgba(255,193,7,0.3)",
    },
    {
      title: "Secure Software",
      description: "Security-first architecture & DevSecOps solutions",
      icon: <Code className="w-8 h-8 text-purple-400" />,
      link: "/security-architecture",
      color: "#9c27b0",
      glowColor: "rgba(156,39,176,0.3)",
    },
  ];

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      <RealisticSolarSystem />
      
      <AmbientParticles 
        variant="network" 
        count={30} 
        color="#00D4FF" 
        opacity={0.08} 
      />

      <AnimatePresence>
        {showUI && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="fixed top-0 left-0 right-0 z-20 pointer-events-none"
            >
              <div className="pt-20 pb-8 px-6 text-center">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                  }}
                />
                
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm mb-4"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">
                      Interactive Experience
                    </span>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #00D4FF 0%, #9944ff 50%, #ff4444 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 60px rgba(0,212,255,0.3)',
                    }}
                  >
                    Cyber Galaxy
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                  >
                    Navigate through our security universe. Each galaxy represents a 
                    <span className="text-cyan-400"> core service domain</span> — 
                    explore planets to discover specific security solutions.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500"
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>3 Galaxies • 15 Service Planets • Infinite Protection</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="fixed bottom-24 left-0 right-0 z-20 px-6 pointer-events-none"
            >
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-center mb-6"
                >
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-medium">
                    Quick Navigation Portals
                  </span>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pointer-events-auto">
                  {portals.map((portal, index) => (
                    <PortalCard
                      key={portal.title}
                      {...portal}
                      delay={1.2 + index * 0.15}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <NavigationInstructions />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="fixed inset-0 pointer-events-none z-10"
              style={{
                background: `
                  radial-gradient(ellipse at 20% 20%, rgba(0,212,255,0.05) 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 80%, rgba(153,68,255,0.05) 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 50%, rgba(255,68,68,0.03) 0%, transparent 60%)
                `,
              }}
            />
          </>
        )}
      </AnimatePresence>

      <div 
        className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)',
        }}
      />
      <div 
        className="fixed bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
