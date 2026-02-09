import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { ShieldCheck } from "lucide-react";

type Phase = "boot" | "breach" | "defense" | "reveal" | "ambient";

interface Props {
  onEnterExperience: () => void;
  isPastHero: boolean;
}

const bootLines = [
  "> INITIALIZING QUANTUM FIREWALL...          [OK]",
  "> LOADING NEURAL DEFENSE MATRIX...          [OK]",
  "> CONNECTING TO GLOBAL THREAT NETWORK...    [OK]",
  "> CALIBRATING INTRUSION SENSORS...          [OK]",
  "> DEPLOYING AI THREAT ANALYSIS...           [OK]",
  "> SYSTEM STATUS: ALL MODULES ONLINE         [OK]",
];

const companyName = "CYBER GUARDIAN";

const shieldPath =
  "M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z";

export function CinematicHeroOverlay({ onEnterExperience, isPastHero }: Props) {
  const [phase, setPhase] = useState<Phase>("boot");
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [revealedLetters, setRevealedLetters] = useState<number>(0);
  const [showTagline, setShowTagline] = useState(false);
  const [threatsBlocked, setThreatsBlocked] = useState(0);
  const [showRedFlash, setShowRedFlash] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const counterRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (counterRef.current) {
      clearTimeout(counterRef.current);
      counterRef.current = null;
    }
  }, []);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
    return t;
  }, []);

  useEffect(() => {
    bootLines.forEach((_, i) => {
      addTimer(() => setVisibleLines((v) => Math.max(v, i + 1)), i * 250);
    });

    addTimer(() => {
      setPhase("breach");
      setShowRedFlash(true);
      addTimer(() => setShowRedFlash(false), 100);
    }, 2000);

    addTimer(() => {
      setPhase("defense");
    }, 3500);

    addTimer(() => {
      setPhase("reveal");
      companyName.split("").forEach((_, i) => {
        addTimer(() => setRevealedLetters((v) => Math.max(v, i + 1)), i * 80);
      });
      addTimer(() => setShowTagline(true), 1000);
    }, 5500);

    addTimer(() => {
      setPhase("ambient");
    }, 7500);

    return clearTimers;
  }, [addTimer, clearTimers]);

  useEffect(() => {
    if (phase !== "ambient") return;

    let current = 0;
    const target = 47293;

    const tick = () => {
      const increment = Math.floor(Math.random() * 300) + 50;
      current = Math.min(current + increment, target);
      setThreatsBlocked(current);
      if (current < target) {
        const delay = Math.floor(Math.random() * 2000) + 1000;
        counterRef.current = setTimeout(tick, delay);
      }
    };
    tick();

    return () => {
      if (counterRef.current) clearTimeout(counterRef.current);
    };
  }, [phase]);

  const isAmbient = phase === "ambient";

  return (
    <>
      <style>{`
        @keyframes scanline-sweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes glitch {
          0%, 100% { transform: translateX(0); clip-path: none; text-shadow: none; }
          10% { transform: translateX(-3px); text-shadow: 2px 0 #9D4EDD, -2px 0 #00ffff; }
          20% { transform: translateX(3px); clip-path: inset(20% 0 60% 0); text-shadow: -2px 0 #9D4EDD, 2px 0 #00ffff; }
          30% { transform: translateX(-2px); clip-path: inset(50% 0 10% 0); }
          40% { transform: translateX(0); clip-path: none; }
        }
        @keyframes screen-shake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-4px, 2px); }
          20% { transform: translate(4px, -2px); }
          30% { transform: translate(-2px, 4px); }
          40% { transform: translate(2px, -4px); }
          50% { transform: translate(-4px, 0px); }
          60% { transform: translate(4px, 2px); }
          70% { transform: translate(-2px, -2px); }
          80% { transform: translate(2px, 4px); }
          90% { transform: translate(-4px, -4px); }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes energy-ring {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(8); opacity: 0; }
        }
        @keyframes shield-pulse {
          0%, 100% { filter: drop-shadow(0 0 10px #7B2FE0) drop-shadow(0 0 20px #9D4EDD); }
          50% { filter: drop-shadow(0 0 20px #7B2FE0) drop-shadow(0 0 40px #9D4EDD); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-15px) translateX(8px); opacity: 0.5; }
          50% { transform: translateY(-5px) translateX(-5px); opacity: 0.2; }
          75% { transform: translateY(-20px) translateX(3px); opacity: 0.4; }
        }
        @keyframes letter-flash {
          0% { text-shadow: 0 0 20px #7B2FE0, 0 0 40px #9D4EDD, 0 0 60px #7B2FE0; color: #fff; }
          100% { text-shadow: 0 0 8px #7B2FE0, 0 0 16px #9D4EDD; color: rgba(255,255,255,0.9); }
        }
        @keyframes static-noise {
          0% { background-position: 0 0; }
          100% { background-position: 100% 100%; }
        }
        @keyframes red-pulse-border {
          0%, 100% { box-shadow: inset 0 0 30px rgba(255,51,51,0.3); }
          50% { box-shadow: inset 0 0 60px rgba(255,51,51,0.6); }
        }
      `}</style>

      <div
        data-testid="section-cinematic-overlay"
        className="fixed inset-0 z-50 overflow-hidden"
        style={{
          pointerEvents: isPastHero || isAmbient ? "none" : "auto",
          opacity: isPastHero ? 0 : 1,
          transition: "opacity 0.5s ease",
          animation: phase === "breach" ? "screen-shake 0.3s ease infinite" : "none",
        }}
      >
        {/* Background */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundColor: "#050505",
            opacity: isAmbient ? 0 : 1,
          }}
        />

        {/* Scanlines */}
        {(phase === "boot" || phase === "breach") && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
            }}
          >
            <div
              className="absolute left-0 right-0 h-[4px] pointer-events-none"
              style={{
                background: "rgba(0,255,65,0.08)",
                animation: "scanline-sweep 2s linear infinite",
              }}
            />
          </div>
        )}

        {/* Red flash for breach */}
        <AnimatePresence>
          {showRedFlash && (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 z-10"
              style={{ backgroundColor: "#ff3333" }}
            />
          )}
        </AnimatePresence>

        {/* Red pulsing border for breach */}
        {phase === "breach" && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{ animation: "red-pulse-border 0.5s ease infinite" }}
          />
        )}

        {/* Boot Terminal */}
        <AnimatePresence>
          {(phase === "boot" || phase === "breach") && (
            <motion.div
              data-testid="text-boot-terminal"
              className="absolute top-[15%] left-[10%] font-mono text-sm md:text-base z-20"
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.5 }}
              style={
                phase === "breach"
                  ? {
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
                      animation: "static-noise 0.2s steps(4) infinite",
                    }
                  : undefined
              }
            >
              {bootLines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mb-1"
                  style={{ color: "#00ff41" }}
                >
                  {line}
                </motion.div>
              ))}
              <span
                className="inline-block w-[8px] h-[16px] ml-1"
                style={{
                  backgroundColor: "#00ff41",
                  animation: "blink-cursor 0.7s step-end infinite",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Defense terminal dissolve */}
        {phase === "defense" && (
          <motion.div
            className="absolute top-[15%] left-[10%] font-mono text-sm md:text-base z-20"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, filter: "blur(8px)", y: -20 }}
            transition={{ duration: 0.8 }}
            style={{ color: "#00ff41" }}
          >
            {bootLines.map((line, i) => (
              <div key={i} className="mb-1">{line}</div>
            ))}
          </motion.div>
        )}

        {/* Breach Warning */}
        <AnimatePresence>
          {phase === "breach" && (
            <motion.div
              data-testid="text-breach-warning"
              className="absolute inset-0 flex flex-col items-center justify-center z-30"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="text-3xl md:text-5xl lg:text-6xl font-bold font-mono text-center"
                style={{
                  color: "#ff3333",
                  animation: "glitch 0.4s ease infinite",
                  textShadow: "0 0 10px #ff3333, 0 0 20px #ff3333",
                }}
              >
                ⚠ BREACH ATTEMPT DETECTED
              </div>
              <motion.div
                className="mt-4 text-base md:text-lg font-mono tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ color: "#ff3333" }}
              >
                ORIGIN: UNKNOWN | SEVERITY: CRITICAL
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Defense Phase */}
        <AnimatePresence>
          {phase === "defense" && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Energy rings */}
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 w-20 h-20 rounded-full border-2 pointer-events-none"
                  style={{
                    borderColor: "#7B2FE0",
                    animation: `energy-ring 1.5s ease-out ${i * 0.3}s infinite`,
                  }}
                />
              ))}

              {/* Electric arcs (SVG) */}
              <svg
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none"
                viewBox="0 0 300 300"
              >
                {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 150 + Math.cos(rad) * 60;
                  const y1 = 150 + Math.sin(rad) * 60;
                  const x2 = 150 + Math.cos(rad) * 120;
                  const y2 = 150 + Math.sin(rad) * 120;
                  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 30;
                  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 30;
                  return (
                    <motion.path
                      key={i}
                      d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
                      stroke="#9D4EDD"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.15,
                        repeat: 2,
                        repeatType: "loop",
                      }}
                    />
                  );
                })}
              </svg>

              {/* Shield */}
              <motion.svg
                viewBox="0 0 24 24"
                className="w-32 h-32 md:w-48 md:h-48"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ animation: "shield-pulse 1s ease infinite" }}
              >
                <path d={shieldPath} fill="none" stroke="#7B2FE0" strokeWidth="0.8" />
                <path d={shieldPath} fill="rgba(123,47,224,0.15)" />
              </motion.svg>

              <motion.div
                className="mt-6 text-xl md:text-2xl font-mono tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.7, 1] }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ color: "#9D4EDD" }}
              >
                ACTIVATING DEFENSE PROTOCOLS...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reveal Phase */}
        <AnimatePresence>
          {(phase === "reveal" || phase === "ambient") && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center z-30"
              initial={{ opacity: 1 }}
              animate={{
                opacity: isAmbient ? 0 : 1,
              }}
              transition={{ duration: 1.5 }}
              style={{ pointerEvents: "none" }}
            >
              {/* Small shield icon */}
              <motion.svg
                viewBox="0 0 24 24"
                className="w-10 h-10 mb-4"
                initial={{ scale: 3, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.7 }}
                transition={{ duration: 0.8 }}
              >
                <path d={shieldPath} fill="none" stroke="#7B2FE0" strokeWidth="1" />
                <path d={shieldPath} fill="rgba(123,47,224,0.2)" />
              </motion.svg>

              {/* Company Name */}
              <div
                data-testid="text-company-name"
                className="font-mono font-bold text-center"
                style={{
                  fontSize: "clamp(3rem, 10vw, 8rem)",
                  color: "rgba(255,255,255,0.9)",
                  textShadow: "0 0 20px #7B2FE0, 0 0 40px #9D4EDD",
                }}
              >
                {companyName.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={
                      i < revealedLetters
                        ? { opacity: 1 }
                        : { opacity: 0 }
                    }
                    style={{
                      display: "inline-block",
                      animation:
                        i < revealedLetters
                          ? `letter-flash 0.4s ease forwards, glitch 0.3s ease ${i * 0.08}s 1`
                          : "none",
                      minWidth: char === " " ? "0.3em" : undefined,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* Tagline */}
              <AnimatePresence>
                {showTagline && (
                  <motion.div
                    className="mt-4 text-sm md:text-lg font-mono tracking-[0.3em]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    YOUR DIGITAL FORTRESS
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD Corner Brackets */}
        {(phase === "reveal" || phase === "ambient") && (
          <div
            className="absolute inset-0 pointer-events-none z-40"
            style={{ opacity: isAmbient ? 0.3 : 0.6, transition: "opacity 1s" }}
          >
            {/* Top-left */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2" style={{ borderColor: "#7B2FE0" }} />
            {/* Top-right */}
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2" style={{ borderColor: "#7B2FE0" }} />
            {/* Bottom-left */}
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2" style={{ borderColor: "#7B2FE0" }} />
            {/* Bottom-right */}
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2" style={{ borderColor: "#7B2FE0" }} />
          </div>
        )}

        {/* Ambient HUD elements */}
        {isAmbient && (
          <div className="absolute inset-0 pointer-events-none z-40">
            {/* System status badge */}
            <div
              className="absolute top-8 left-8 flex items-center gap-2 font-mono text-xs tracking-widest"
              style={{ color: "#00ff41", opacity: 0.7 }}
            >
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "#00ff41" }} />
              SYSTEM STATUS: SECURE
            </div>

            {/* Threats blocked counter */}
            <div
              className="absolute bottom-8 left-8 font-mono text-xs tracking-wider"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              THREATS BLOCKED:{" "}
              <span style={{ color: "#9D4EDD" }}>
                {threatsBlocked.toLocaleString()}
              </span>
            </div>

            {/* Uptime stats */}
            <div
              className="absolute bottom-8 right-8 font-mono text-xs tracking-wider"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              UPTIME: 99.97% | LATENCY: 12ms
            </div>

            {/* Ambient floating particles */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? "#7B2FE0" : "#9D4EDD",
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  opacity: 0.3,
                  animation: `float-particle ${4 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
                }}
              />
            ))}

            {/* CTA Button */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: isPastHero ? "none" : "auto" }}>
              <motion.button
                data-testid="button-enter-experience"
                onClick={onEnterExperience}
                className="bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/15 transition-all hover:scale-105 flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShieldCheck className="w-5 h-5" />
                Enter the Cyber Network
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}