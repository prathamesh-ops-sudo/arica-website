import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { RealisticSolarSystem } from "@/components/ui/realistic-solar-system";
import { Home } from "lucide-react";

const loadingSteps = [
  "Initializing security dashboard...",
  "Loading threat intelligence...",
  "Configuring defense protocols...",
  "Connecting to secure network...",
  "Systems online",
];

export default function Experience() {
  const [, setLocation] = useLocation();
  const [showIntro, setShowIntro] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lineTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let lineIndex = 0;
    const startDelay = setTimeout(() => {
      lineTimerRef.current = setInterval(() => {
        lineIndex++;
        setVisibleLines(lineIndex);
        setProgress(Math.min((lineIndex / loadingSteps.length) * 100, 100));
        if (lineIndex >= loadingSteps.length) {
          if (lineTimerRef.current) clearInterval(lineTimerRef.current);
        }
      }, 500);
    }, 300);

    fadeTimerRef.current = setTimeout(() => {
      setFadeOut(true);
      hideTimerRef.current = setTimeout(() => setShowIntro(false), 800);
    }, 3800);

    return () => {
      clearTimeout(startDelay);
      if (lineTimerRef.current) clearInterval(lineTimerRef.current);
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-[90vw] max-w-[700px] rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(0,180,216,0.4)",
                boxShadow: "0 0 40px rgba(0,180,216,0.2), 0 0 80px rgba(0,180,216,0.08), inset 0 0 60px rgba(0,0,0,0.5)",
                backgroundColor: "rgba(5,5,5,0.95)",
              }}
            >
              <div className="relative p-8 md:p-10 min-h-[380px] flex flex-col items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide mb-2">
                    ARICA TECH
                  </h1>
                  <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-[#1C2C5A] via-[#42BA90] to-[#3D70B7] rounded-full mb-3" />
                  <p className="text-white/40 text-sm tracking-widest uppercase">
                    Security Solutions
                  </p>
                </motion.div>

                <div className="w-full max-w-md space-y-3 mb-6">
                  {loadingSteps.slice(0, visibleLines).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="text-[#3D70B7]">
                        {i < visibleLines - 1 || visibleLines >= loadingSteps.length ? "✓" : "●"}
                      </span>
                      <span className="text-white/50">{line}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="w-full max-w-md">
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #1C2C5A, #42BA90, #3D70B7)",
                      }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-white/20 text-xs text-center mt-3">
                    {progress < 100 ? "Preparing your experience..." : "Ready"}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <RealisticSolarSystem />
    </div>
  );
}
