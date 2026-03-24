import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { 
  Bug, ShieldAlert, AlertTriangle, Skull, Server, 
  HardDrive, Cloud, Router, Lock, Binary, FileWarning,
  Flame, Wifi, Database, Monitor, Cpu
} from "lucide-react";
import { useIsMobile, useIsMobileOrTablet } from "@/hooks/use-mobile";

const threatItems = [
  { icon: Bug, label: "MALWARE", color: "#ff4444", angle: 0 },
  { icon: ShieldAlert, label: "BREACH", color: "#ff6b35", angle: 22.5 },
  { icon: AlertTriangle, label: "ERROR 404", color: "#ffaa00", angle: 45 },
  { icon: Skull, label: "RANSOMWARE", color: "#ff2222", angle: 67.5 },
  { icon: Server, label: "SERVER DOWN", color: "#ff5555", angle: 90 },
  { icon: HardDrive, label: "DISK CORRUPT", color: "#ff8800", angle: 112.5 },
  { icon: Cloud, label: "CLOUD LEAK", color: "#ff6644", angle: 135 },
  { icon: Router, label: "FIREWALL BYPASS", color: "#ff3333", angle: 157.5 },
  { icon: Lock, label: "ENCRYPTION FAIL", color: "#ff7744", angle: 180 },
  { icon: Binary, label: "0xDEADBEEF", color: "#ff5500", angle: 202.5 },
  { icon: FileWarning, label: "CVE-2024-XXXX", color: "#ff4400", angle: 225 },
  { icon: Flame, label: "DDoS ATTACK", color: "#ff2200", angle: 247.5 },
  { icon: Wifi, label: "MitM ATTACK", color: "#ff6600", angle: 270 },
  { icon: Database, label: "SQL INJECTION", color: "#ff3300", angle: 292.5 },
  { icon: Monitor, label: "ZERO-DAY", color: "#ff5533", angle: 315 },
  { icon: Cpu, label: "RAM OVERFLOW", color: "#ff4422", angle: 337.5 },
];

type BattlePhase = "idle" | "incoming" | "alert" | "fighting" | "shockwave" | "victory";

interface BattleLogEntry {
  text: string;
  type: "warning" | "danger" | "action" | "success";
  id: number;
}

const battleLogSequence: { text: string; type: BattleLogEntry["type"]; delay: number }[] = [
  { text: "[SCAN] Perimeter breach detected on PORT 443", type: "warning", delay: 0 },
  { text: "[ALERT] 16 hostile payloads inbound", type: "danger", delay: 400 },
  { text: "[ALERT] RANSOMWARE signature matched :: Threat Level CRITICAL", type: "danger", delay: 800 },
  { text: "[SYS] Activating ARICA Defense Protocol", type: "action", delay: 1500 },
  { text: "[WEAPON] Targeting systems online :: Lock at 100%", type: "action", delay: 2200 },
  { text: "[WEAPON] Deploying countermeasure beams", type: "action", delay: 3000 },
  { text: "[HIT] MALWARE neutralized ████████ 100%", type: "success", delay: 3800 },
  { text: "[HIT] RANSOMWARE payload destroyed", type: "success", delay: 4200 },
  { text: "[HIT] DDoS wave absorbed and deflected", type: "success", delay: 4600 },
  { text: "[HIT] SQL INJECTION blocked at firewall", type: "success", delay: 5000 },
  { text: "[SYS] Charging EMP shockwave...", type: "action", delay: 5500 },
  { text: "[BOOM] ███ SHOCKWAVE DEPLOYED ███", type: "action", delay: 6200 },
  { text: "[CLEAR] All hostile entities eliminated", type: "success", delay: 7200 },
  { text: "[STATUS] Threat level: ZERO :: Perimeter secure", type: "success", delay: 7800 },
];

export function ThreatVortex() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-200px" });
  const [phase, setPhase] = useState<BattlePhase>("idle");
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([]);
  const [destroyedThreats, setDestroyedThreats] = useState<Set<number>>(new Set());
  const [beamTargets, setBeamTargets] = useState<number[]>([]);
  const [shieldPower, setShieldPower] = useState(0);
  const [screenFlash, setScreenFlash] = useState(false);
  const [shockwaveScale, setShockwaveScale] = useState(0);
  const logIdRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isMobileOrTablet = useIsMobileOrTablet();

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
    if (!isInView) {
      clearTimers();
      setPhase("idle");
      setBattleLog([]);
      setDestroyedThreats(new Set());
      setBeamTargets([]);
      setShieldPower(0);
      setScreenFlash(false);
      setShockwaveScale(0);
      return;
    }

    setPhase("incoming");

    battleLogSequence.forEach((entry) => {
      addTimer(() => {
        const newEntry: BattleLogEntry = { text: entry.text, type: entry.type, id: logIdRef.current++ };
        setBattleLog((prev) => [...prev.slice(-8), newEntry]);
      }, entry.delay);
    });

    addTimer(() => setPhase("alert"), 1200);

    addTimer(() => {
      setPhase("fighting");
      setShieldPower(100);
    }, 2800);

    const killOrder = [0, 3, 11, 13, 14, 1, 6, 7, 2, 5, 9, 10, 4, 8, 12, 15];
    killOrder.forEach((threatIdx, i) => {
      addTimer(() => {
        setBeamTargets((prev) => [...prev, threatIdx]);
        addTimer(() => {
          setScreenFlash(true);
          addTimer(() => setScreenFlash(false), 80);
        }, 200);
        addTimer(() => {
          setDestroyedThreats((prev) => { const n = new Set(Array.from(prev)); n.add(threatIdx); return n; });
          setBeamTargets((prev) => prev.filter((t) => t !== threatIdx));
        }, 400);
      }, 3200 + i * 250);
    });

    addTimer(() => {
      setPhase("shockwave");
      setShockwaveScale(1);
      setScreenFlash(true);
      addTimer(() => setScreenFlash(false), 150);
    }, 6200);

    addTimer(() => {
      setPhase("victory");
      const allIds = new Set<number>(); threatItems.forEach((_, i) => allIds.add(i)); setDestroyedThreats(allIds);
    }, 7200);

    return clearTimers;
  }, [isInView, addTimer, clearTimers]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [battleLog]);

  const centerX = 400;
  const centerY = 350;

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden bg-[#050505]"
      data-testid="section-threat-vortex"
    >
      <AnimatePresence>
        {screenFlash && (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.4), rgba(0,180,216,0.15), transparent)' }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 opacity-[0.15]" style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(0,180,216,0.08) 0%, transparent 60%)`,
      }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {phase !== "idle" && Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? '#ff4444' : i % 3 === 1 ? '#42BA90' : '#3D70B7',
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 3,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
            animate={{
              borderColor: phase === "fighting" || phase === "alert"
                ? ["rgba(255,68,68,0.5)", "rgba(255,68,68,0.2)", "rgba(255,68,68,0.5)"]
                : phase === "victory"
                ? "rgba(0,180,216,0.5)"
                : "rgba(0,180,216,0.3)",
              backgroundColor: phase === "alert"
                ? "rgba(255,68,68,0.08)"
                : phase === "victory"
                ? "rgba(0,180,216,0.08)"
                : "rgba(0,180,216,0.03)",
            }}
            transition={{ duration: 0.8, repeat: phase === "fighting" ? Infinity : 0 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              animate={{
                backgroundColor: phase === "victory" ? "#3D70B7" : "#ff4444",
                scale: phase === "fighting" ? [1, 1.5, 1] : 1,
              }}
              transition={{ duration: 0.5, repeat: phase === "fighting" ? Infinity : 0 }}
            />
            <span className="text-xs font-mono tracking-widest" style={{
              color: phase === "victory" ? '#3D70B7' : phase === "fighting" ? '#ff4444' : '#3D70B7'
            }}>
              {phase === "idle" || phase === "incoming" ? "MONITORING ACTIVE" :
               phase === "alert" ? "⚠ INCOMING THREATS DETECTED" :
               phase === "fighting" ? "⚡ DEFENSE PROTOCOL ENGAGED" :
               phase === "shockwave" ? "███ SHOCKWAVE DEPLOYED ███" :
               "✓ ALL THREATS NEUTRALIZED"}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            We Don't Just Defend.
            <motion.span
              className="block bg-gradient-to-r from-[#42BA90] to-[#3D70B7] bg-clip-text text-transparent"
              animate={phase === "fighting" ? {
                filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
              } : {}}
              transition={{ duration: 0.5, repeat: phase === "fighting" ? Infinity : 0 }}
            >
              We Fight Back.
            </motion.span>
          </h2>
          <p className="text-lg text-[#8e8e93] max-w-2xl mx-auto">
            Watch as our defense systems detect, engage, and eliminate every cyber threat in real-time. 
            No breach survives. No malware escapes.
          </p>
        </motion.div>

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-[1fr_340px]'} gap-8 items-start`}>
          <div className="relative mx-auto w-full" style={{ maxWidth: '800px', height: isMobile ? '400px' : isMobileOrTablet ? '500px' : '700px' }}>
            {[1, 2, 3, 4].map((ring) => {
              const ringScale = isMobile ? 0.5 : isMobileOrTablet ? 0.7 : 1;
              return (
              <motion.div
                key={ring}
                className="absolute rounded-full border"
                style={{
                  width: `${(ring * 170 + 30) * ringScale}px`,
                  height: `${(ring * 170 + 30) * ringScale}px`,
                  left: '50%',
                  top: '50%',
                  x: '-50%',
                  y: '-50%',
                  borderColor: phase === "fighting"
                    ? `rgba(0,212,255,${0.3 - ring * 0.05})`
                    : `rgba(0,180,216,${0.1 - ring * 0.02})`,
                }}
                animate={isInView ? {
                  rotate: ring % 2 === 0 ? 360 : -360,
                  scale: phase === "shockwave" ? [1, 1.5, 1] : 1,
                } : {}}
                transition={{
                  rotate: { duration: 15 + ring * 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 0.8 },
                }}
              />
              );
            })}

            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 700">
              <defs>
                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3D70B7" />
                  <stop offset="50%" stopColor="#42BA90" />
                  <stop offset="100%" stopColor="#ff4444" />
                </linearGradient>
                <filter id="beamGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="explosionGlow">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {beamTargets.map((targetIdx) => {
                const threat = threatItems[targetIdx];
                const rad = (threat.angle * Math.PI) / 180;
                const dist = phase === "fighting" ? 120 + (targetIdx % 3) * 40 : 280;
                const tx = centerX + Math.cos(rad) * dist;
                const ty = centerY + Math.sin(rad) * (dist * 0.75);
                return (
                  <motion.line
                    key={`beam-${targetIdx}`}
                    x1={centerX}
                    y1={centerY}
                    x2={tx}
                    y2={ty}
                    stroke="url(#beamGrad)"
                    strokeWidth="3"
                    filter="url(#beamGlow)"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: [0, 1, 1, 0], pathLength: [0, 1, 1, 1] }}
                    transition={{ duration: 0.4 }}
                  />
                );
              })}

              {Array.from(destroyedThreats).map((idx) => {
                const threat = threatItems[idx];
                const rad = (threat.angle * Math.PI) / 180;
                const dist = 120 + (idx % 3) * 40;
                const ex = centerX + Math.cos(rad) * dist;
                const ey = centerY + Math.sin(rad) * (dist * 0.75);
                return (
                  <motion.circle
                    key={`explosion-${idx}`}
                    cx={ex}
                    cy={ey}
                    fill="none"
                    stroke={threat.color}
                    strokeWidth="2"
                    filter="url(#explosionGlow)"
                    initial={{ r: 0, opacity: 1 }}
                    animate={{ r: 40, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                );
              })}

              {phase === "shockwave" && (
                <motion.circle
                  cx={centerX}
                  cy={centerY}
                  fill="none"
                  stroke="#3D70B7"
                  strokeWidth="3"
                  filter="url(#explosionGlow)"
                  initial={{ r: 0, opacity: 0.8 }}
                  animate={{ r: 400, opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              )}
            </svg>

            {threatItems.map((threat, i) => {
              const rad = (threat.angle * Math.PI) / 180;
              const isDestroyed = destroyedThreats.has(i);
              const isBeingHit = beamTargets.includes(i);
              const distScale = isMobile ? 0.5 : isMobileOrTablet ? 0.7 : 1;

              const farDist = (320 + (i % 3) * 30) * distScale;
              const closeDist = (120 + (i % 3) * 40) * distScale;

              const farX = Math.cos(rad) * farDist;
              const farY = Math.sin(rad) * (farDist * 0.75);
              const closeX = Math.cos(rad) * closeDist;
              const closeY = Math.sin(rad) * (closeDist * 0.75);

              if (isDestroyed) return null;

              return (
                <motion.div
                  key={i}
                  className="absolute flex items-center gap-1.5 px-2.5 py-1 rounded-md border backdrop-blur-sm whitespace-nowrap"
                  style={{
                    left: '50%',
                    top: '50%',
                    borderColor: isBeingHit ? '#fff' : `${threat.color}50`,
                    backgroundColor: isBeingHit ? `${threat.color}40` : `${threat.color}12`,
                    boxShadow: isBeingHit
                      ? `0 0 30px ${threat.color}, 0 0 60px ${threat.color}80`
                      : `0 0 20px ${threat.color}25`,
                    zIndex: 10,
                  }}
                  initial={{ opacity: 0, scale: 0, x: farX - 55, y: farY - 12 }}
                  animate={phase === "idle" ? {} :
                    phase === "incoming" || phase === "alert" ? {
                      opacity: 1,
                      scale: [0, 1.2, 1],
                      x: farX - 55,
                      y: farY - 12,
                    } : {
                      opacity: 1,
                      scale: isBeingHit ? [1, 1.3, 1] : 1,
                      x: closeX - 55,
                      y: closeY - 12,
                    }
                  }
                  transition={phase === "incoming" || phase === "alert" ? {
                    duration: 0.5,
                    delay: i * 0.08,
                  } : {
                    duration: 0.8,
                    x: { duration: 1.5, ease: "easeInOut" },
                    y: { duration: 1.5, ease: "easeInOut" },
                  }}
                  data-testid={`threat-item-${i}`}
                >
                  <threat.icon className="w-3 h-3 flex-shrink-0" style={{ color: threat.color }} />
                  <span className="text-[9px] font-mono font-bold tracking-wide" style={{ color: threat.color }}>
                    {threat.label}
                  </span>
                </motion.div>
              );
            })}

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
              {/* Outer energy field */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: '220px',
                  height: '220px',
                  left: '-110px',
                  top: '-110px',
                  background: 'radial-gradient(circle, rgba(0,180,216,0.12) 0%, transparent 70%)',
                }}
                animate={{
                  scale: phase === "fighting" ? [1, 1.6, 1] : phase === "shockwave" ? [1, 4, 1] : [1, 1.1, 1],
                  opacity: phase === "fighting" ? [0.2, 0.7, 0.2] : 0.4,
                }}
                transition={{ duration: phase === "shockwave" ? 0.5 : 1.5, repeat: phase === "fighting" ? Infinity : 0 }}
              />

              {/* SVG Targeting Reticle System */}
              <motion.svg
                className="absolute"
                style={{ width: '200px', height: '200px', left: '-100px', top: '-100px' }}
                viewBox="0 0 200 200"
                animate={{ rotate: phase === "fighting" ? 360 : 0 }}
                transition={{ duration: phase === "fighting" ? 2 : 8, repeat: Infinity, ease: "linear" }}
              >
                {/* Outer targeting ring with tick marks */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(0,180,216,0.3)" strokeWidth="1" strokeDasharray="4 8" />
                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5" />
                {/* Tick marks around outer ring */}
                {Array.from({ length: 36 }).map((_, i) => {
                  const angle = (i * 10 * Math.PI) / 180;
                  const inner = i % 3 === 0 ? 78 : 82;
                  const outer = 88;
                  return (
                    <line
                      key={`tick-${i}`}
                      x1={100 + Math.cos(angle) * inner}
                      y1={100 + Math.sin(angle) * inner}
                      x2={100 + Math.cos(angle) * outer}
                      y2={100 + Math.sin(angle) * outer}
                      stroke={i % 3 === 0 ? "rgba(0,212,255,0.6)" : "rgba(0,180,216,0.3)"}
                      strokeWidth={i % 3 === 0 ? "1.5" : "0.5"}
                    />
                  );
                })}
              </motion.svg>

              {/* Counter-rotating inner reticle */}
              <motion.svg
                className="absolute"
                style={{ width: '140px', height: '140px', left: '-70px', top: '-70px' }}
                viewBox="0 0 140 140"
                animate={{ rotate: phase === "fighting" ? -360 : 0 }}
                transition={{ duration: phase === "fighting" ? 1.5 : 6, repeat: Infinity, ease: "linear" }}
              >
                {/* Crosshair lines with gaps */}
                <line x1="70" y1="10" x2="70" y2="35" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5" />
                <line x1="70" y1="105" x2="70" y2="130" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5" />
                <line x1="10" y1="70" x2="35" y2="70" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5" />
                <line x1="105" y1="70" x2="130" y2="70" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5" />
                {/* Corner brackets */}
                <path d="M30,30 L30,45 M30,30 L45,30" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="1" />
                <path d="M110,30 L110,45 M110,30 L95,30" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="1" />
                <path d="M30,110 L30,95 M30,110 L45,110" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="1" />
                <path d="M110,110 L110,95 M110,110 L95,110" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="1" />
                {/* Inner diamond */}
                <path d="M70,45 L95,70 L70,95 L45,70 Z" fill="none" stroke="rgba(0,180,216,0.4)" strokeWidth="0.8" strokeDasharray="3 3" />
              </motion.svg>

              {/* Scanning sweep line (during fighting) */}
              {phase === "fighting" && (
                <motion.svg
                  className="absolute"
                  style={{ width: '180px', height: '180px', left: '-90px', top: '-90px' }}
                  viewBox="0 0 180 180"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                >
                  <defs>
                    <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(0,212,255,0)" />
                      <stop offset="100%" stopColor="rgba(0,212,255,0.6)" />
                    </linearGradient>
                  </defs>
                  <path d="M90,90 L90,5 A85,85 0 0,1 160,50 Z" fill="url(#sweepGrad)" opacity="0.4" />
                </motion.svg>
              )}

              {/* Pulsing lock-on rings during fighting */}
              {phase === "fighting" && (
                <motion.div
                  className="absolute rounded-full border"
                  style={{
                    width: '160px',
                    height: '160px',
                    left: '-80px',
                    top: '-80px',
                    borderColor: 'rgba(0,212,255,0.5)',
                  }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.15, 0.6] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              )}

              {/* Central energy core */}
              <motion.div
                className="absolute flex items-center justify-center"
                style={{
                  width: '64px',
                  height: '64px',
                  left: '-32px',
                  top: '-32px',
                  borderRadius: '50%',
                  background: phase === "fighting" || phase === "shockwave"
                    ? 'radial-gradient(circle, #90E0EF 0%, #3D70B7 30%, #42BA90 60%, #1C2C5A 100%)'
                    : phase === "victory"
                    ? 'radial-gradient(circle, #00ff41 0%, #00cc33 30%, #009926 60%, #006619 100%)'
                    : 'radial-gradient(circle, #3D70B7 0%, #42BA90 40%, #1C2C5A 70%, #001a2e 100%)',
                  boxShadow: phase === "fighting"
                    ? '0 0 30px rgba(0,212,255,0.9), 0 0 60px rgba(0,180,216,0.6), 0 0 90px rgba(0,119,182,0.4)'
                    : phase === "victory"
                    ? '0 0 30px rgba(0,255,65,0.6), 0 0 60px rgba(0,204,51,0.3)'
                    : '0 0 20px rgba(0,180,216,0.5), 0 0 40px rgba(0,212,255,0.2)',
                }}
                animate={{
                  scale: phase === "shockwave" ? [1, 2, 1] :
                    phase === "fighting" ? [1, 1.15, 1] :
                    phase === "victory" ? [1, 1.08, 1] : [1, 1.03, 1],
                }}
                transition={{
                  duration: phase === "fighting" ? 0.25 : 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Inner targeting dot */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  {phase === "victory" ? (
                    <>
                      <circle cx="12" cy="12" r="8" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="none" />
                      <path d="M8 12l3 3 5-5" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  ) : (
                    <>
                      {/* Crosshair center */}
                      <circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.9)" />
                      <circle cx="12" cy="12" r="5" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none" />
                      <line x1="12" y1="2" x2="12" y2="7" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                      <line x1="12" y1="17" x2="12" y2="22" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                      <line x1="2" y1="12" x2="7" y2="12" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                      <line x1="17" y1="12" x2="22" y2="12" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                    </>
                  )}
                </svg>
              </motion.div>

              {/* Status text below core */}
              {phase === "fighting" && (
                <motion.div
                  className="absolute font-mono text-[8px] tracking-widest whitespace-nowrap"
                  style={{ top: '45px', left: '50%', x: '-50%', color: '#3D70B7' }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                >
                  TARGET LOCK {shieldPower}%
                </motion.div>
              )}
              {phase === "victory" && (
                <motion.div
                  className="absolute font-mono text-[8px] tracking-widest whitespace-nowrap"
                  style={{ top: '45px', left: '50%', x: '-50%', color: '#00ff41' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ALL CLEAR
                </motion.div>
              )}
            </div>

            <AnimatePresence>
              {phase === "victory" && (
                <motion.div
                  className="absolute bottom-4 left-1/2 text-center z-30"
                  style={{ x: '-50%' }}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="px-8 py-4 rounded-xl border border-[#42BA90]/40 bg-[#050505]/90 backdrop-blur-md">
                    <motion.p
                      className="text-xs font-mono tracking-[0.3em] mb-1"
                      style={{ color: '#3D70B7', textShadow: '0 0 10px rgba(0,212,255,0.5)' }}
                    >
                      MISSION COMPLETE
                    </motion.p>
                    <motion.p
                      className="text-xl md:text-2xl font-bold"
                      style={{
                        background: 'linear-gradient(to right, #42BA90, #3D70B7, #90E0EF)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: 'none',
                      }}
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      16/16 THREATS ELIMINATED
                    </motion.p>
                    <p className="text-[10px] text-[#8e8e93] font-mono mt-1">PERIMETER SECURE :: ZERO CASUALTIES</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:sticky lg:top-32 space-y-4">
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: phase === "fighting" ? 'rgba(255,68,68,0.3)' : 'rgba(0,180,216,0.2)',
                backgroundColor: 'rgba(5,5,5,0.9)',
              }}
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'rgba(0,180,216,0.15)' }}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#ff4444]" />
                  <div className="w-2 h-2 rounded-full bg-[#ffaa00]" />
                  <div className="w-2 h-2 rounded-full bg-[#00cc44]" />
                </div>
                <span className="text-[9px] font-mono text-[#8e8e93] tracking-wider">GUARDIAN_TERMINAL</span>
                <motion.div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: phase === "fighting" ? '#ff4444' : phase === "victory" ? '#00cc44' : '#ffaa00' }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>

              <div
                ref={logContainerRef}
                className="p-3 h-64 overflow-y-auto scrollbar-thin"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#42BA90 transparent' }}
              >
                {battleLog.length === 0 && (
                  <div className="text-[10px] font-mono text-[#8e8e93]/50">
                    <p>ARICA Defense v4.2.1</p>
                    <p>Initializing threat scanner...</p>
                    <p className="animate-pulse mt-2">{'>'} Waiting for activity_<span className="animate-pulse">█</span></p>
                  </div>
                )}
                <AnimatePresence>
                  {battleLog.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                      className="font-mono text-[10px] leading-relaxed py-0.5"
                      style={{
                        color: entry.type === "danger" ? '#ff4444' :
                          entry.type === "warning" ? '#ffaa00' :
                          entry.type === "action" ? '#3D70B7' : '#00cc44',
                      }}
                    >
                      {entry.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-[#42BA90]/20 bg-[#050505]/90 p-3 text-center">
                <p className="text-[9px] font-mono text-[#8e8e93] tracking-wider mb-1">THREATS</p>
                <motion.p
                  className="text-2xl font-bold font-mono"
                  style={{ color: destroyedThreats.size < 16 ? '#ff4444' : '#00cc44' }}
                  animate={phase === "fighting" ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {16 - destroyedThreats.size}
                </motion.p>
                <p className="text-[8px] font-mono text-[#8e8e93]">REMAINING</p>
              </div>
              <div className="rounded-lg border border-[#42BA90]/20 bg-[#050505]/90 p-3 text-center">
                <p className="text-[9px] font-mono text-[#8e8e93] tracking-wider mb-1">TARGET LOCK</p>
                <motion.p
                  className="text-2xl font-bold font-mono text-[#3D70B7]"
                  animate={phase === "fighting" ? { opacity: [0.7, 1, 0.7] } : {}}
                  transition={{ duration: 0.5, repeat: phase === "fighting" ? Infinity : 0 }}
                >
                  {shieldPower}%
                </motion.p>
                <p className="text-[8px] font-mono text-[#8e8e93]">POWER</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-sm text-[#8e8e93] font-mono tracking-wider">
            BREACHES &bull; MALWARE &bull; RANSOMWARE &bull; DDoS &bull; ZERO-DAYS &bull; SQL INJECTION
          </p>
          <p className="text-xs text-[#42BA90] font-mono tracking-widest mt-2">
            EVERY THREAT. INTERCEPTED. DESTROYED.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
