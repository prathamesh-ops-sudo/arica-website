import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { RealisticSolarSystem } from "@/components/ui/realistic-solar-system";
import { Home } from "lucide-react";

const terminalLines = [
  { text: "root@arica-tech:~# nmap -sV --script=vuln 0.0.0.0/0", color: "#00ff41" },
  { text: "[*] Scanning cyber defense network...", color: "#00ff41" },
  { text: "[+] 3 GALAXIES DETECTED", color: "#9D4EDD" },
  { text: "[+] 15 SERVICE NODES ONLINE", color: "#9D4EDD" },
  { text: "[+] THREAT LEVEL: MAXIMUM", color: "#9D4EDD" },
  { text: "root@arica-tech:~# ./launch_exploration.sh", color: "#00ff41" },
  { text: "[*] Initializing 3D neural map...", color: "#00ff41" },
  { text: "[████████████████████████] 100%", color: "#00ff41" },
  { text: "[+] READY. SCROLL TO NAVIGATE.", color: "#9D4EDD" },
];

export default function Experience() {
  const [, setLocation] = useLocation();
  const [showIntro, setShowIntro] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lineTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let lineIndex = 0;
    const startDelay = setTimeout(() => {
      lineTimerRef.current = setInterval(() => {
        lineIndex++;
        setVisibleLines(lineIndex);
        if (lineIndex >= terminalLines.length) {
          if (lineTimerRef.current) clearInterval(lineTimerRef.current);
        }
      }, 200);
    }, 300);

    fadeTimerRef.current = setTimeout(() => {
      setFadeOut(true);
      hideTimerRef.current = setTimeout(() => setShowIntro(false), 1000);
    }, 2500);

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
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-[90vw] max-w-[700px] rounded-lg overflow-hidden"
              style={{
                border: "1px solid rgba(123,47,224,0.3)",
                boxShadow: "0 0 30px rgba(123,47,224,0.15), 0 0 60px rgba(123,47,224,0.05)",
                backgroundColor: "rgba(5,5,5,0.95)",
              }}
            >
              <div
                className="flex items-center gap-2 px-4 py-2 font-mono text-xs"
                style={{
                  borderBottom: "1px solid rgba(123,47,224,0.2)",
                  backgroundColor: "rgba(10,10,10,0.9)",
                }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span style={{ color: "#00ff41" }} className="ml-2 opacity-70">
                  root@arica-tech:~
                </span>
              </div>

              <div className="p-4 font-mono text-sm leading-relaxed min-h-[280px]">
                {terminalLines.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ color: line.color }}
                    className="whitespace-pre"
                  >
                    {line.text}
                  </motion.div>
                ))}

                {visibleLines < terminalLines.length && (
                  <span
                    className="inline-block w-2 h-4 ml-0.5"
                    style={{
                      backgroundColor: "#00ff41",
                      animation: "blink 1s step-end infinite",
                    }}
                  />
                )}

                {visibleLines >= terminalLines.length && (
                  <div className="flex items-center" style={{ color: "#00ff41" }}>
                    <span>root@arica-tech:~# </span>
                    <span
                      className="inline-block w-2 h-4 ml-0.5"
                      style={{
                        backgroundColor: "#00ff41",
                        animation: "blink 1s step-end infinite",
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>

            <style>{`
              @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>

      <RealisticSolarSystem />
    </div>
  );
}
