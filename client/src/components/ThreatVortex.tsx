import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { 
  Bug, ShieldAlert, AlertTriangle, Skull, Server, 
  HardDrive, Cloud, Router, Lock, Binary, FileWarning,
  Flame, Wifi, Database, Monitor, Cpu
} from "lucide-react";

const threatItems = [
  { icon: Bug, label: "MALWARE", color: "#ff4444" },
  { icon: ShieldAlert, label: "BREACH", color: "#ff6b35" },
  { icon: AlertTriangle, label: "ERROR 404", color: "#ffaa00" },
  { icon: Skull, label: "RANSOMWARE", color: "#ff2222" },
  { icon: Server, label: "SERVER COMPROMISED", color: "#ff5555" },
  { icon: HardDrive, label: "DISK CORRUPT", color: "#ff8800" },
  { icon: Cloud, label: "CLOUD LEAK", color: "#ff6644" },
  { icon: Router, label: "FIREWALL BYPASSED", color: "#ff3333" },
  { icon: Lock, label: "ENCRYPTION BROKEN", color: "#ff7744" },
  { icon: Binary, label: "0xDEADBEEF", color: "#ff5500" },
  { icon: FileWarning, label: "CVE-2024-XXXX", color: "#ff4400" },
  { icon: Flame, label: "DDoS ATTACK", color: "#ff2200" },
  { icon: Wifi, label: "MitM DETECTED", color: "#ff6600" },
  { icon: Database, label: "SQL INJECTION", color: "#ff3300" },
  { icon: Monitor, label: "ZERO-DAY", color: "#ff5533" },
  { icon: Cpu, label: "RAM OVERFLOW", color: "#ff4422" },
];

const dataStreams = [
  "4F 56 45 52 46 4C 4F 57",
  "01101001 01101110 01110100",
  "CRITICAL::ERR_STACK",
  "192.168.0.██ BREACHED",
  "root@compromised:~#",
  "SYN_FLOOD_DETECTED",
  "BUFFER_OVERFLOW_0x7F",
  "PAYLOAD_INJECTED",
  "PRIVILEGE_ESCALATION",
  "BACKDOOR_ACTIVE",
  "CERT_EXPIRED_SSL",
  "KEYLOGGER_FOUND",
];

export function ThreatVortex() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  const [absorbed, setAbsorbed] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setAbsorbed(true), 4000);
      return () => clearTimeout(timer);
    } else {
      setAbsorbed(false);
    }
  }, [isInView]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-[#050505]"
      data-testid="section-threat-vortex"
    >
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(123,47,224,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(123,47,224,0.3) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {dataStreams.map((text, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-[10px] whitespace-nowrap"
            style={{
              left: `${(i * 8.3) % 100}%`,
              top: `${(i * 7.1 + 5) % 100}%`,
              color: 'rgba(123,47,224,0.15)',
            }}
            animate={isInView ? {
              opacity: [0, 0.4, 0.4, 0],
              x: [0, -100],
            } : {}}
            transition={{
              duration: 6 + i * 0.5,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {text}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7B2FE0]/30 bg-[#7B2FE0]/5 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#ff4444] animate-pulse" />
            <span className="text-xs font-mono text-[#9D4EDD] tracking-widest">THREAT NEUTRALIZATION ACTIVE</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            We Are the
            <span className="block bg-gradient-to-r from-[#7B2FE0] to-[#9D4EDD] bg-clip-text text-transparent">
              Event Horizon
            </span>
          </h2>
          <p className="text-lg text-[#8e8e93] max-w-2xl mx-auto">
            Every breach, every malware, every vulnerability — they all meet the same fate. 
            Our security systems absorb and neutralize every threat before it reaches you.
          </p>
        </motion.div>

        <div className="relative mx-auto" style={{ maxWidth: '800px', height: '700px' }}>
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border"
              style={{
                width: `${ring * 250 + 50}px`,
                height: `${ring * 250 + 50}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                borderColor: `rgba(123,47,224,${0.15 - ring * 0.03})`,
              }}
              animate={isInView ? {
                rotate: ring % 2 === 0 ? 360 : -360,
              } : {}}
              transition={{
                duration: 20 + ring * 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 700">
            <defs>
              <linearGradient id="spiralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(123,47,224,0)" />
                <stop offset="100%" stopColor="rgba(157,78,221,0.3)" />
              </linearGradient>
            </defs>
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.line
                key={i}
                x1={400 + Math.cos(angle * Math.PI / 180) * 350}
                y1={350 + Math.sin(angle * Math.PI / 180) * 300}
                x2="400"
                y2="350"
                stroke="url(#spiralGrad)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.4 } : {}}
                transition={{ duration: 2, delay: i * 0.2 }}
              />
            ))}
          </svg>

          {threatItems.map((threat, i) => {
            const orbitRadius = 180 + (i % 3) * 80;
            const startAngle = (i * 360) / threatItems.length;
            const delay = i * 0.15;

            return (
              <motion.div
                key={i}
                className="absolute flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-sm whitespace-nowrap"
                style={{
                  left: '50%',
                  top: '50%',
                  borderColor: `${threat.color}40`,
                  backgroundColor: `${threat.color}10`,
                  boxShadow: `0 0 15px ${threat.color}20`,
                  zIndex: 10,
                }}
                initial={{
                  x: Math.cos((startAngle * Math.PI) / 180) * orbitRadius - 60,
                  y: Math.sin((startAngle * Math.PI) / 180) * (orbitRadius * 0.75) - 15,
                  opacity: 0,
                  scale: 1,
                }}
                animate={isInView ? (absorbed ? {
                  x: -60,
                  y: -15,
                  opacity: 0,
                  scale: 0,
                } : {
                  x: [
                    Math.cos((startAngle * Math.PI) / 180) * orbitRadius - 60,
                    Math.cos(((startAngle + 90) * Math.PI) / 180) * orbitRadius - 60,
                    Math.cos(((startAngle + 180) * Math.PI) / 180) * orbitRadius - 60,
                    Math.cos(((startAngle + 270) * Math.PI) / 180) * orbitRadius - 60,
                    Math.cos((startAngle * Math.PI) / 180) * orbitRadius - 60,
                  ],
                  y: [
                    Math.sin((startAngle * Math.PI) / 180) * (orbitRadius * 0.75) - 15,
                    Math.sin(((startAngle + 90) * Math.PI) / 180) * (orbitRadius * 0.75) - 15,
                    Math.sin(((startAngle + 180) * Math.PI) / 180) * (orbitRadius * 0.75) - 15,
                    Math.sin(((startAngle + 270) * Math.PI) / 180) * (orbitRadius * 0.75) - 15,
                    Math.sin((startAngle * Math.PI) / 180) * (orbitRadius * 0.75) - 15,
                  ],
                  opacity: 1,
                  scale: 1,
                }) : {}}
                transition={absorbed ? {
                  duration: 1.5,
                  delay: delay,
                  ease: [0.68, -0.6, 0.32, 1.6],
                } : {
                  duration: 15 + i * 2,
                  delay: delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
                data-testid={`threat-item-${i}`}
              >
                <threat.icon className="w-3.5 h-3.5" style={{ color: threat.color }} />
                <span className="text-[10px] font-mono font-bold" style={{ color: threat.color }}>
                  {threat.label}
                </span>
              </motion.div>
            );
          })}

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              className="absolute -inset-20 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(123,47,224,0.2) 0%, rgba(58,12,163,0.05) 50%, transparent 70%)',
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div
              className="absolute -inset-16 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(157,78,221,0.4), transparent, rgba(123,47,224,0.3), transparent)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -inset-12 rounded-full"
              style={{
                background: 'conic-gradient(from 180deg, transparent, rgba(157,78,221,0.5), transparent, rgba(123,47,224,0.4), transparent)',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
              className="relative w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #9D4EDD, #7B2FE0, #3A0CA3, #1a0550)',
                boxShadow: `
                  0 0 30px rgba(123,47,224,0.6),
                  0 0 60px rgba(157,78,221,0.3),
                  0 0 100px rgba(58,12,163,0.2),
                  inset 0 0 30px rgba(0,0,0,0.5)
                `,
              }}
              animate={absorbed ? { scale: [1, 1.3, 1] } : { scale: [1, 1.05, 1] }}
              transition={absorbed ? { duration: 0.8 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0 }}
            animate={absorbed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            <div className="px-6 py-3 rounded-xl border border-[#7B2FE0]/30 bg-[#050505]/80 backdrop-blur-sm">
              <p className="text-[10px] font-mono text-[#9D4EDD]/60 tracking-widest mb-1">STATUS</p>
              <p className="text-lg font-bold text-[#9D4EDD]" style={{ textShadow: '0 0 20px rgba(157,78,221,0.5)' }}>
                ALL THREATS NEUTRALIZED
              </p>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16 text-sm text-[#8e8e93] font-mono tracking-wider"
        >
          BREACHES &bull; MALWARE &bull; RANSOMWARE &bull; DDoS &bull; ZERO-DAYS &bull; SQL INJECTION &bull; ALL NEUTRALIZED
        </motion.p>
      </div>
    </section>
  );
}
