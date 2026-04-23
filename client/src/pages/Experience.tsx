import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { RealisticSolarSystem } from "@/components/ui/realistic-solar-system";
import { ThreeDEffectLoader } from "@/components/ui/3d-effect-loader";
import { Home } from "lucide-react";

export default function Experience() {
  const [, setLocation] = useLocation();
  const [showIntro, setShowIntro] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fadeTimerRef.current = setTimeout(() => {
      setFadeOut(true);
      hideTimerRef.current = setTimeout(() => setShowIntro(false), 800);
    }, 3800);

    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={() => setLocation('/')}
        className="fixed top-6 left-6 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg"
        data-testid="button-home"
      >
        <Home className="w-4 h-4" />
        <span className="text-sm font-medium">Home</span>
      </motion.button>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: fadeOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "#050505" }}
            data-testid="terminal-intro"
          >
            <ThreeDEffectLoader text="Loading…" />
          </motion.div>
        )}
      </AnimatePresence>

      <RealisticSolarSystem />
    </div>
  );
}
