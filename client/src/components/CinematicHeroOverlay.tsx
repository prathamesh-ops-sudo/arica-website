import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { ShieldCheck } from "lucide-react";

type Phase = "boot" | "defense" | "reveal" | "ambient";

interface Props {
  onEnterExperience: () => void;
  isPastHero: boolean;
}

const companyName = "ARICA TECH";

const shieldPath =
  "M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z";

export function CinematicHeroOverlay({ onEnterExperience, isPastHero }: Props) {
  const [phase, setPhase] = useState<Phase>("boot");
  const [revealedLetters, setRevealedLetters] = useState<number>(0);
  const [showTagline, setShowTagline] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
    return t;
  }, []);

  useEffect(() => {
    addTimer(() => {
      setPhase("defense");
    }, 1500);

    addTimer(() => {
      setPhase("reveal");
      companyName.split("").forEach((_, i) => {
        addTimer(() => setRevealedLetters((v) => Math.max(v, i + 1)), i * 80);
      });
      addTimer(() => setShowTagline(true), 1000);
    }, 3000);

    addTimer(() => {
      setPhase("ambient");
    }, 5000);

    return clearTimers;
  }, [addTimer, clearTimers]);

  const isAmbient = phase === "ambient";

  return (
    <>
      <style>{`
        @keyframes energy-ring {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(8); opacity: 0; }
        }
        @keyframes shield-pulse {
          0%, 100% { filter: drop-shadow(0 0 10px #42BA90) drop-shadow(0 0 20px #3D70B7); }
          50% { filter: drop-shadow(0 0 20px #42BA90) drop-shadow(0 0 40px #3D70B7); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-15px) translateX(8px); opacity: 0.5; }
          50% { transform: translateY(-5px) translateX(-5px); opacity: 0.2; }
          75% { transform: translateY(-20px) translateX(3px); opacity: 0.4; }
        }
        @keyframes letter-flash {
          0% { text-shadow: 0 0 20px #42BA90, 0 0 40px #3D70B7, 0 0 60px #42BA90; color: #fff; }
          100% { text-shadow: 0 0 8px #42BA90, 0 0 16px #3D70B7; color: rgba(255,255,255,0.9); }
        }
      `}</style>

      <div
        data-testid="section-cinematic-overlay"
        className="fixed inset-0 z-50 overflow-hidden"
        style={{
          pointerEvents: isPastHero || isAmbient ? "none" : "auto",
          opacity: isPastHero ? 0 : 1,
          transition: "opacity 0.5s ease",
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

        {/* Boot Phase - Clean branded intro */}
        <AnimatePresence>
          {phase === "boot" && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center z-20"
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                data-testid="text-boot-brand"
                className="font-bold text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  fontSize: "clamp(2.5rem, 8vw, 6rem)",
                  color: "#ffffff",
                  textShadow: "0 0 30px rgba(61,112,183,0.4), 0 0 60px rgba(61,112,183,0.2)",
                }}
              >
                ARICA TECH
              </motion.div>

              <motion.div
                className="my-4 h-[2px] rounded-full"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "120px", opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                  background: "linear-gradient(90deg, transparent, #42BA90, #3D70B7, #42BA90, transparent)",
                }}
              />

              <motion.div
                className="text-base md:text-lg tracking-[0.2em]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Security Solutions
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Defense Phase - Clean shield with pulse */}
        <AnimatePresence>
          {phase === "defense" && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.svg
                viewBox="0 0 24 24"
                className="w-32 h-32 md:w-48 md:h-48"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ animation: "shield-pulse 1.5s ease infinite" }}
              >
                <path d={shieldPath} fill="none" stroke="#42BA90" strokeWidth="0.8" />
                <path d={shieldPath} fill="rgba(61,112,183,0.15)" />
              </motion.svg>
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
              <motion.svg
                viewBox="0 0 24 24"
                className="w-10 h-10 mb-4"
                initial={{ scale: 3, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.7 }}
                transition={{ duration: 0.8 }}
              >
                <path d={shieldPath} fill="none" stroke="#42BA90" strokeWidth="1" />
                <path d={shieldPath} fill="rgba(61,112,183,0.2)" />
              </motion.svg>

              <div
                data-testid="text-company-name"
                className="font-bold text-center"
                style={{
                  fontSize: "clamp(3rem, 10vw, 8rem)",
                  color: "rgba(255,255,255,0.9)",
                  textShadow: "0 0 20px #42BA90, 0 0 40px #3D70B7",
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
                          ? `letter-flash 0.4s ease forwards`
                          : "none",
                      minWidth: char === " " ? "0.3em" : undefined,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              <AnimatePresence>
                {showTagline && (
                  <motion.div
                    className="mt-4 text-sm md:text-lg tracking-[0.2em]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    Securing Your Digital Future
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient elements */}
        {isAmbient && (
          <div className="absolute inset-0 pointer-events-none z-40">
            {/* Floating purple particles */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? "#42BA90" : "#3D70B7",
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  opacity: 0.3,
                  animation: `float-particle ${4 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
                }}
              />
            ))}

            {/* CTA Button */}
            <div className="absolute inset-x-0 top-[20%] md:top-[25%] flex justify-center px-4" style={{ pointerEvents: isPastHero ? "none" : "auto" }}>
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
                Explore Our Services
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
