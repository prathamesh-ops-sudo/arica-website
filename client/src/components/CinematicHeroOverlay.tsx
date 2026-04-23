import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { ShieldCheck } from "lucide-react";
import { BoxLoader } from "@/components/ui/loader-3";

type Phase = "loading" | "reveal" | "ambient";

interface Props {
  onEnterExperience: () => void;
  isPastHero: boolean;
}

export function CinematicHeroOverlay({ onEnterExperience, isPastHero }: Props) {
  const [phase, setPhase] = useState<Phase>("loading");
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
    // Show box loader for ~3.5s, then reveal ARICA TECH SECURITY
    addTimer(() => {
      setPhase("reveal");
    }, 3500);

    // After reveal plays for ~2s, go ambient (fade out overlay)
    addTimer(() => {
      setPhase("ambient");
    }, 6000);

    return clearTimers;
  }, [addTimer, clearTimers]);

  const isAmbient = phase === "ambient";

  return (
    <>
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-15px) translateX(8px); opacity: 0.5; }
          50% { transform: translateY(-5px) translateX(-5px); opacity: 0.2; }
          75% { transform: translateY(-20px) translateX(3px); opacity: 0.4; }
        }
        @keyframes logo-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(61,112,183,0.4), 0 0 40px rgba(66,186,144,0.2); }
          50% { text-shadow: 0 0 30px rgba(61,112,183,0.6), 0 0 60px rgba(66,186,144,0.3), 0 0 80px rgba(61,112,183,0.15); }
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

        {/* Loading Phase - 3D Box Loader */}
        <AnimatePresence>
          {phase === "loading" && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center z-20"
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.6 }}
            >
              <BoxLoader />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reveal Phase - ARICA TECH SECURITY logo text */}
        <AnimatePresence>
          {(phase === "reveal" || phase === "ambient") && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center z-30"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isAmbient ? 0 : 1,
              }}
              transition={{ duration: 1.5 }}
              style={{ pointerEvents: "none" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-center"
              >
                {/* Logo image */}
                <motion.img
                  src="/arica-logo.png"
                  alt="Arica Tech Security"
                  className="h-20 md:h-28 w-auto mx-auto mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />

                {/* ARICA TECH SECURITY text */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    fontSize: "clamp(2rem, 7vw, 5rem)",
                    color: "#ffffff",
                    animation: "logo-glow 3s ease-in-out infinite",
                    lineHeight: 1.1,
                  }}
                >
                  ARICA TECH
                  <br />
                  <span style={{ color: "#42BA90", letterSpacing: "0.15em", fontSize: "0.7em" }}>
                    SECURITY
                  </span>
                </motion.h1>

                {/* Gradient line */}
                <motion.div
                  className="mx-auto mt-4 h-[2px] rounded-full"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "160px", opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  style={{
                    background: "linear-gradient(90deg, transparent, #3D70B7, #42BA90, #3D70B7, transparent)",
                  }}
                />

                {/* Tagline */}
                <motion.p
                  className="mt-4 text-base md:text-lg tracking-[0.2em] uppercase"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Securing Your Digital Future
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient elements */}
        {isAmbient && (
          <div className="absolute inset-0 pointer-events-none z-40">
            {/* Floating particles */}
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
