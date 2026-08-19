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
    // Show box loader for ~3.5s, then reveal logo
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

        {/* Reveal Phase - Logo only, centered and bigger */}
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
              <motion.img
                src="/arica-logo.webp"
                alt="Arica Tech Security"
                className="w-auto mx-auto"
                width={779}
                height={288}
                style={{ height: "clamp(5rem, 15vw, 12rem)" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
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


          </div>
        )}
      </div>
    </>
  );
}
