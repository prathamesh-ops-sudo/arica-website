import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ClipboardCheck, Bot, ArrowRight, Search, FileCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingCyberThreats } from "@/components/FloatingCyberThreats";

const complianceItems = [
  { text: "Risk Assessment & Gap Analysis", icon: Search },
  { text: "ISMS Implementation & Documentation", icon: FileCheck },
  { text: "Internal Audit & Management Review", icon: Shield },
];

const certifications = [
  { id: "auditor", name: "ISO 27001", description: "Lead Auditor" },
  { id: "implementer", name: "ISO 27001", description: "Lead Implementer" },
  { id: "certified", name: "ISO 27001", description: "Client Certification Support" },
];

const PARTICLE_POSITIONS = [
  { left: 35, top: 25, duration: 4.2 },
  { left: 55, top: 65, duration: 3.8 },
  { left: 72, top: 18, duration: 4.5 },
  { left: 28, top: 78, duration: 3.3 },
  { left: 60, top: 42, duration: 4.8 },
  { left: 45, top: 85, duration: 3.6 },
];

export function ComplianceSection() {
  const svgId = useMemo(() => `shield-${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40" style={{
        background: `radial-gradient(ellipse at 70% 60%, rgba(61, 112, 183, 0.06) 0%, transparent 55%),
                     radial-gradient(ellipse at 30% 30%, rgba(28, 44, 90, 0.08) 0%, transparent 50%)`
      }} />
      <FloatingCyberThreats variant="purple" density="low" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
            ISO 27001
            <br />
            <span className="text-gradient">Audit & Certification</span>
          </h2>

          <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Achieve ISO 27001 certification with our expert audit services. We guide
            your organization through the entire certification process, from initial
            gap analysis to successful certification and ongoing compliance.
          </p>
        </motion.div>

        {/* Centered shield */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mb-12"
        >
            <div className="absolute -inset-4 bg-gradient-to-l from-primary/10 to-transparent rounded-3xl blur-2xl" />
            <div className="relative flex flex-col items-center mx-auto" style={{ maxWidth: '400px' }}>
              {/* Animated Shield */}
              <div className="relative w-64 h-72 md:w-80 md:h-[360px]">
                {/* Light rays behind shield */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-[2px] bg-gradient-to-t from-transparent via-[#3D70B7]/30 to-transparent"
                      style={{
                        height: "140%",
                        transform: `rotate(${i * 45}deg)`,
                        transformOrigin: "center center",
                      }}
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.div>

                {/* Outer glow pulse */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-48 h-56 md:w-56 md:h-64 rounded-[40%] bg-[#3D70B7]/10 blur-xl" />
                </motion.div>

                {/* Shield SVG */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                >
                  <svg
                    viewBox="0 0 200 240"
                    className="w-48 h-56 md:w-56 md:h-64 drop-shadow-[0_0_30px_rgba(61,112,183,0.4)]"
                    fill="none"
                    role="img"
                    aria-label="ISO 27001 compliance shield with checkmark"
                  >
                    <defs>
                      <linearGradient id={`${svgId}-body`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#2a3a5c" />
                        <stop offset="40%" stopColor="#1C2C5A" />
                        <stop offset="100%" stopColor="#0f1a35" />
                      </linearGradient>
                      <linearGradient id={`${svgId}-edge`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#6b7fa0" />
                        <stop offset="50%" stopColor="#4a5a7a" />
                        <stop offset="100%" stopColor="#8899bb" />
                      </linearGradient>
                      <filter id={`${svgId}-glow`}>
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <linearGradient id={`${svgId}-highlight`} x1="0.3" y1="0" x2="0.7" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.02)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M100 10 L180 50 C180 50 185 140 100 220 C15 140 20 50 20 50 Z"
                      fill={`url(#${svgId}-edge)`}
                      stroke="none"
                    />
                    <path
                      d="M100 20 L172 56 C172 56 176 138 100 212 C24 138 28 56 28 56 Z"
                      fill={`url(#${svgId}-body)`}
                      stroke="none"
                    />
                    <path
                      d="M100 20 L28 56 C28 56 24 138 100 212 Z"
                      fill={`url(#${svgId}-highlight)`}
                    />
                    <line
                      x1="100" y1="20" x2="100" y2="212"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                    />
                  </svg>

                  {/* Animated checkmark overlay */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 150, delay: 0.7 }}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-20 h-20 md:w-24 md:h-24"
                      fill="none"
                    >
                      <motion.path
                        d="M25 52 L42 68 L75 32"
                        stroke="#42BA90"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter={`url(#${svgId}-glow)`}
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                      />
                    </svg>
                  </motion.div>

                  {/* Pulsing glow ring */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    animate={{
                      boxShadow: [
                        "0 0 20px 0px rgba(66,186,144,0)",
                        "0 0 40px 10px rgba(66,186,144,0.15)",
                        "0 0 20px 0px rgba(66,186,144,0)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ borderRadius: "40%" }}
                  />
                </motion.div>

                {/* Small floating particles */}
                {PARTICLE_POSITIONS.map((particle, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-[#3D70B7]/60"
                    style={{
                      left: `${particle.left}%`,
                      top: `${particle.top}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: particle.duration,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              
              <div className="flex justify-center gap-4 mt-8">
                {certifications.map((cert) => (
                  <motion.div
                    key={cert.id}
                    className="px-4 py-3 rounded-lg border border-white/10 bg-card/80 backdrop-blur-sm text-center"
                    whileHover={{ scale: 1.05, borderColor: "rgba(61,112,183,0.4)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <p className="font-mono text-xs text-primary">{cert.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{cert.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        {/* Centered cards and items */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
          <div className="p-5 rounded-xl border border-white/10 bg-card/50 text-center">
            <ClipboardCheck className="w-6 h-6 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold mb-1">ISMS Development</h3>
            <p className="text-xs text-muted-foreground">
              Complete Information Security Management System design and implementation.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-white/10 bg-card/50 text-center">
            <Bot className="w-6 h-6 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold mb-1">Certification Audit</h3>
            <p className="text-xs text-muted-foreground">
              Expert guidance through Stage 1 and Stage 2 certification audits.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <ul className="grid md:grid-cols-3 gap-4">
            {complianceItems.map((item) => (
              <li key={item.text} className="flex flex-col items-center gap-2 text-sm text-center p-4 rounded-xl border border-white/10 bg-card/50">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-muted-foreground">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Link href="/contact">
            <Button
              data-testid="button-get-compliant"
              className="bg-primary text-primary-foreground hover:bg-primary/90 group"
            >
              Start ISO 27001 Certification
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
