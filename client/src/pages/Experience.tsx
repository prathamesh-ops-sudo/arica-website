import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RealisticSolarSystem } from "@/components/ui/realistic-solar-system";
import { Sparkles, ChevronDown } from "lucide-react";

export default function Experience() {
  const [showIntro, setShowIntro] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    fadeTimerRef.current = setTimeout(() => {
      setFadeOut(true);
      hideTimerRef.current = setTimeout(() => setShowIntro(false), 1000);
    }, 2500);
    
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: fadeOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, duration: 1 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] flex items-center justify-center mx-auto mb-6"
                style={{ boxShadow: '0 0 60px rgba(10,132,255,0.5)' }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Welcome to the Galaxy
              </motion.h2>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[#8e8e93] text-lg mb-6"
              >
                Explore our universe of security services
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-center gap-2 text-[#8e8e93]"
              >
                <span className="text-sm">Scroll to navigate</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronDown className="w-6 h-6" />
                </motion.div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-xs text-[#8e8e93]/50 mt-6 max-w-xs text-center"
              >
                * This is a simulated interactive experience for demonstration purposes
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <RealisticSolarSystem />
    </div>
  );
}
