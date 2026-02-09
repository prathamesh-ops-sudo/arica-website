import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { 
  Bug, ShieldAlert, AlertTriangle, Skull, Server, 
  HardDrive, Cloud, Router, Lock, Binary, FileWarning,
  Flame, Wifi, Database, Monitor, Cpu
} from "lucide-react";

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
  { text: "[SYS] Activating Cyber Guardian Defense Protocol", type: "action", delay: 1500 },
  { text: "[SHIELD] Energy barrier raised :: Power at 100%", type: "action", delay: 2200 },
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
            style={{ background: 'radial-gradient(circle, rgba(157,78,221,0.4), rgba(123,47,224,0.15), transparent)' }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `
          linear-gradient(rgba(123,47,224,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(123,47,224,0.5) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {phase !== "idle" && Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? '#ff4444' : i % 3 === 1 ? '#7B2FE0' : '#9D4EDD',
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
                ? "rgba(123,47,224,0.5)"
                : "rgba(123,47,224,0.3)",
              backgroundColor: phase === "alert"
                ? "rgba(255,68,68,0.08)"
                : phase === "victory"
                ? "rgba(123,47,224,0.08)"
                : "rgba(123,47,224,0.03)",
            }}
            transition={{ duration: 0.8, repeat: phase === "fighting" ? Infinity : 0 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              animate={{
                backgroundColor: phase === "victory" ? "#9D4EDD" : "#ff4444",
                scale: phase === "fighting" ? [1, 1.5, 1] : 1,
              }}
              transition={{ duration: 0.5, repeat: phase === "fighting" ? Infinity : 0 }}
            />
            <span className="text-xs font-mono tracking-widest" style={{
              color: phase === "victory" ? '#9D4EDD' : phase === "fighting" ? '#ff4444' : '#9D4EDD'
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
              className="block bg-gradient-to-r from-[#7B2FE0] to-[#9D4EDD] bg-clip-text text-transparent"
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

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="relative mx-auto w-full" style={{ maxWidth: '800px', height: '700px' }}>
            {[1, 2, 3, 4].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full border"
                style={{
                  width: `${ring * 170 + 30}px`,
                  height: `${ring * 170 + 30}px`,
                  left: '50%',
                  top: '50%',
                  x: '-50%',
                  y: '-50%',
                  borderColor: phase === "fighting"
                    ? `rgba(157,78,221,${0.3 - ring * 0.05})`
                    : `rgba(123,47,224,${0.1 - ring * 0.02})`,
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
            ))}

            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 700">
              <defs>
                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9D4EDD" />
                  <stop offset="50%" stopColor="#7B2FE0" />
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
                  stroke="#9D4EDD"
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

              const farDist = 320 + (i % 3) * 30;
              const closeDist = 120 + (i % 3) * 40;

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
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: '200px',
                  height: '200px',
                  left: '-100px',
                  top: '-100px',
                  background: 'radial-gradient(circle, rgba(123,47,224,0.15) 0%, transparent 70%)',
                }}
                animate={{
                  scale: phase === "fighting" ? [1, 1.5, 1] : phase === "shockwave" ? [1, 3, 1] : [1, 1.1, 1],
                  opacity: phase === "fighting" ? [0.3, 0.8, 0.3] : 0.5,
                }}
                transition={{ duration: phase === "shockwave" ? 0.5 : 1.5, repeat: phase === "fighting" ? Infinity : 0 }}
              />

              <motion.div
                className="absolute rounded-full"
                style={{
                  width: '160px',
                  height: '160px',
                  left: '-80px',
                  top: '-80px',
                  background: 'conic-gradient(from 0deg, transparent 0%, rgba(157,78,221,0.6) 25%, transparent 50%, rgba(123,47,224,0.5) 75%, transparent 100%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: phase === "fighting" ? 1.5 : 6, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: '130px',
                  height: '130px',
                  left: '-65px',
                  top: '-65px',
                  background: 'conic-gradient(from 120deg, transparent 0%, rgba(157,78,221,0.5) 20%, transparent 40%, rgba(123,47,224,0.4) 60%, transparent 80%)',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: phase === "fighting" ? 1 : 4, repeat: Infinity, ease: "linear" }}
              />

              {phase === "fighting" && (
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: '180px',
                    height: '180px',
                    left: '-90px',
                    top: '-90px',
                    border: '1px solid rgba(157,78,221,0.4)',
                  }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}

              <motion.div
                className="absolute w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  left: '-48px',
                  top: '-48px',
                  background: phase === "fighting" || phase === "shockwave"
                    ? 'radial-gradient(circle at 35% 35%, #c77dff, #9D4EDD, #7B2FE0, #3A0CA3)'
                    : 'radial-gradient(circle at 35% 35%, #9D4EDD, #7B2FE0, #3A0CA3, #1a0550)',
                  boxShadow: phase === "fighting"
                    ? '0 0 40px rgba(157,78,221,0.8), 0 0 80px rgba(123,47,224,0.5), 0 0 120px rgba(58,12,163,0.3)'
                    : phase === "victory"
                    ? '0 0 50px rgba(157,78,221,0.6), 0 0 100px rgba(123,47,224,0.3)'
                    : '0 0 25px rgba(123,47,224,0.4), 0 0 50px rgba(157,78,221,0.2)',
                }}
                animate={{
                  scale: phase === "shockwave" ? [1, 1.5, 1] :
                    phase === "fighting" ? [1, 1.1, 1] :
                    phase === "victory" ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: phase === "fighting" ? 0.3 : 2,
                  repeat: phase === "fighting" || phase === "victory" ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  {phase === "victory" && <path d="M9 12l2 2 4-4" />}
                </svg>
              </motion.div>

              {phase === "fighting" && (
                <motion.div
                  className="absolute font-mono text-[8px] text-[#9D4EDD] tracking-widest whitespace-nowrap"
                  style={{ top: '50px', left: '50%', x: '-50%' }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  SHIELD {shieldPower}%
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
                  <div className="px-8 py-4 rounded-xl border border-[#7B2FE0]/40 bg-[#050505]/90 backdrop-blur-md">
                    <motion.p
                      className="text-xs font-mono tracking-[0.3em] mb-1"
                      style={{ color: '#9D4EDD', textShadow: '0 0 10px rgba(157,78,221,0.5)' }}
                    >
                      MISSION COMPLETE
                    </motion.p>
                    <motion.p
                      className="text-xl md:text-2xl font-bold"
                      style={{
                        background: 'linear-gradient(to right, #7B2FE0, #9D4EDD, #c77dff)',
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
                borderColor: phase === "fighting" ? 'rgba(255,68,68,0.3)' : 'rgba(123,47,224,0.2)',
                backgroundColor: 'rgba(5,5,5,0.9)',
              }}
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'rgba(123,47,224,0.15)' }}>
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
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#7B2FE0 transparent' }}
              >
                {battleLog.length === 0 && (
                  <div className="text-[10px] font-mono text-[#8e8e93]/50">
                    <p>Cyber Guardian v4.2.1</p>
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
                          entry.type === "action" ? '#9D4EDD' : '#00cc44',
                      }}
                    >
                      {entry.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-[#7B2FE0]/20 bg-[#050505]/90 p-3 text-center">
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
              <div className="rounded-lg border border-[#7B2FE0]/20 bg-[#050505]/90 p-3 text-center">
                <p className="text-[9px] font-mono text-[#8e8e93] tracking-wider mb-1">SHIELD</p>
                <motion.p
                  className="text-2xl font-bold font-mono text-[#9D4EDD]"
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
          <p className="text-xs text-[#7B2FE0] font-mono tracking-widest mt-2">
            EVERY THREAT. INTERCEPTED. DESTROYED.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
