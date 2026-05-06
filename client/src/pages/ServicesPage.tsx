import { motion, useInView, useSpring, useTransform, useScroll } from "framer-motion";
import {
  Shield,
  Scale,
  Code,
  CheckCircle,
  ArrowRight,
  Lock,
  ShieldCheck,
  KeyRound,
  Fingerprint,
  type LucideIcon,
} from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/ui/typewriter";
import { AmbientParticles } from "@/components/ui/ambient-particles";
import { useRef, useState, useEffect, useCallback } from "react";

const services = [
  {
    id: "vapt",
    icon: Shield,
    title: "VAPT",
    description:
      "Vulnerability Assessment and Penetration Testing to identify and eliminate security weaknesses before attackers exploit them. Our comprehensive testing methodology covers all attack vectors.",
    features: [
      "Comprehensive Penetration Testing",
      "Vulnerability Scanning",
      "Network Security Assessment",
      "Web Application Security Testing",
      "API Security Testing",
      "Social Engineering Assessments",
    ],
    stats: [
      { label: "VAPT Assessments", value: 500, suffix: "+" },
      { label: "Vulnerabilities Found", value: 12500, suffix: "+" },
      { label: "Client Satisfaction", value: 99, suffix: "%" },
    ],
    color: "neutral" as const,
  },
  {
    id: "iso-audit",
    icon: Scale,
    title: "ISO Audit",
    description:
      "Complete ISO 27001 compliance services to help your organization achieve and maintain information security certification. We guide you through every step of the certification process.",
    features: [
      "ISO 27001 Gap Analysis",
      "Compliance Roadmap",
      "Policy Development",
      "Internal Audit Preparation",
      "Certification Support",
      "Continuous Compliance Monitoring",
    ],
    stats: [
      { label: "Successful Audits", value: 150, suffix: "+" },
      { label: "Certifications Achieved", value: 98, suffix: "%" },
      { label: "Compliance Rate", value: 100, suffix: "%" },
    ],
    color: "neutral" as const,
  },
  {
    id: "custom-software",
    icon: Code,
    title: "Custom Software Development",
    description:
      "Security-first software development services that integrate security at every stage of the development lifecycle. We build robust, secure enterprise solutions tailored to your needs.",
    features: [
      "Secure Software Architecture",
      "DevSecOps Integration",
      "Security-First Development",
      "Code Review and Analysis",
      "Secure API Development",
      "Enterprise Solutions",
    ],
    stats: [
      { label: "Projects Delivered", value: 200, suffix: "+" },
      { label: "Lines of Secure Code", value: 2, suffix: "M+" },
      { label: "On-Time Delivery", value: 95, suffix: "%" },
    ],
    color: "neutral" as const,
  },
];

const floatingElements = [
  { Icon: Shield, size: 24, initialX: 5, initialY: 20, speed: 0.3 },
  { Icon: Lock, size: 20, initialX: 90, initialY: 15, speed: 0.5 },
  { Icon: ShieldCheck, size: 28, initialX: 15, initialY: 60, speed: 0.4 },
  { Icon: KeyRound, size: 22, initialX: 85, initialY: 70, speed: 0.35 },
  { Icon: Fingerprint, size: 26, initialX: 8, initialY: 85, speed: 0.45 },
  { Icon: Lock, size: 18, initialX: 92, initialY: 45, speed: 0.55 },
  { Icon: Shield, size: 20, initialX: 50, initialY: 10, speed: 0.25 },
  { Icon: ShieldCheck, size: 22, initialX: 75, initialY: 90, speed: 0.38 },
];

function FloatingSecurityElements() {
  const { scrollY } = useScroll();
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {floatingElements.map((el, index) => (
        <FloatingIcon key={index} element={el} scrollY={scrollY} index={index} />
      ))}
    </div>
  );
}

function FloatingIcon({ 
  element, 
  scrollY, 
  index 
}: { 
  element: typeof floatingElements[0]; 
  scrollY: ReturnType<typeof useScroll>['scrollY']; 
  index: number;
}) {
  const y = useTransform(
    scrollY,
    [0, 3000],
    [0, -element.speed * 500]
  );
  
  const opacity = useTransform(
    scrollY,
    [0, 500, 2500, 3000],
    [0.08, 0.15, 0.15, 0.05]
  );

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${element.initialX}%`,
        top: `${element.initialY}%`,
        y,
        opacity,
      }}
      animate={{
        y: [0, -15, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 6 + index * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <element.Icon 
        size={element.size} 
        className="text-primary/30"
        strokeWidth={1}
      />
    </motion.div>
  );
}

function Card3D({ 
  children, 
  className = "",
  glowColor = "neutral"
}: { 
  children: React.ReactNode; 
  className?: string;
  glowColor?: "neutral" | "purple";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -8;
    const rotateYValue = (mouseX / (rect.width / 2)) * 8;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    
    const glowX = ((e.clientX - rect.left) / rect.width) * 100;
    const glowY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPosition({ x: glowX, y: glowY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
    setGlowPosition({ x: 50, y: 50 });
  }, []);

  const glowColorValue = glowColor === "neutral" ? "61, 112, 183" : "66, 186, 144";

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        y: isHovered ? -8 : 0,
        boxShadow: isHovered 
          ? `0 25px 50px -12px rgba(${glowColorValue}, 0.25), 0 0 0 1px rgba(${glowColorValue}, 0.3)`
          : "0 10px 30px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(${glowColorValue}, ${isHovered ? 0.15 : 0}) 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          border: `1px solid rgba(${glowColorValue}, ${isHovered ? 0.5 : 0.1})`,
          boxShadow: isHovered ? `inset 0 0 30px rgba(${glowColorValue}, 0.1)` : "none",
        }}
      />
      {children}
    </motion.div>
  );
}

function AnimatedIcon({ 
  Icon, 
  color = "neutral" 
}: { 
  Icon: LucideIcon; 
  color?: "neutral" | "purple";
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const glowColor = color === "neutral" ? "rgba(61, 112, 183, 0.6)" : "rgba(66, 186, 144, 0.6)";
  const bgColor = color === "neutral" ? "bg-[#42BA90]/10" : "bg-[#3D70B7]/10";
  const textColor = color === "neutral" ? "text-[#42BA90]" : "text-[#3D70B7]";

  return (
    <motion.div
      className={`inline-flex p-3 rounded-xl ${bgColor} ${textColor} cursor-pointer relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.15 : 1,
        boxShadow: isHovered 
          ? `0 0 30px ${glowColor}, 0 0 60px ${glowColor}`
          : `0 0 15px ${glowColor.replace('0.6', '0.2')}`,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `radial-gradient(circle, ${glowColor.replace('0.6', '0.3')} 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <Icon className="w-8 h-8 relative z-10" />
    </motion.div>
  );
}

function CountUpStat({ 
  value, 
  suffix = "", 
  label,
  color = "neutral"
}: { 
  value: number; 
  suffix?: string; 
  label: string;
  color?: "neutral" | "purple";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);
  
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  const textColor = color === "neutral" ? "text-[#42BA90]" : "text-[#3D70B7]";
  const glowColor = color === "neutral" ? "drop-shadow-[0_0_8px_rgba(66,186,144,0.5)]" : "drop-shadow-[0_0_8px_rgba(61,112,183,0.5)]";

  return (
    <div ref={ref} className="text-center">
      <motion.div
        className={`text-3xl md:text-4xl font-bold ${textColor} ${glowColor} tabular-nums`}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {displayValue.toLocaleString()}{suffix}
      </motion.div>
      <motion.div
        className="text-sm text-muted-foreground mt-1"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {label}
      </motion.div>
    </div>
  );
}

function StaggeredFeatures({ 
  features, 
  color = "neutral" 
}: { 
  features: string[]; 
  color?: "neutral" | "purple";
}) {
  const ref = useRef<HTMLUListElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <ul ref={ref} className="space-y-4">
      {features.map((feature, index) => (
        <motion.li
          key={feature}
          className="flex items-start gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
            ease: "easeOut",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
              delay: index * 0.1 + 0.2,
            }}
          >
            <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color === "neutral" ? "text-[#42BA90]" : "text-[#3D70B7]"}`} />
          </motion.div>
          <span className="text-muted-foreground">{feature}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function AnimatedProgressBar({
  value,
  label,
  color = "neutral"
}: {
  value: number;
  label: string;
  color?: "neutral" | "purple";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);
  
  const springValue = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  const animatedWidth = useTransform(springValue, (val) => `${val}%`);
  
  const barColor = color === "neutral" 
    ? "bg-gradient-to-r from-[#42BA90] to-[#3D70B7]" 
    : "bg-gradient-to-r from-[#3D70B7] to-[#42BA90]";
  const glowColor = color === "neutral"
        ? "shadow-[0_0_20px_rgba(66,186,144,0.6)]"
        : "shadow-[0_0_20px_rgba(61,112,183,0.6)]";

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`text-sm font-bold ${color === "neutral" ? "text-[#42BA90]" : "text-[#3D70B7]"}`}>
          {displayValue}%
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor} ${glowColor}`}
          style={{ width: animatedWidth }}
        />
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <FloatingSecurityElements />
      <AmbientParticles variant="dots" count={25} opacity={0.12} />
      <Navbar />

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          background: `radial-gradient(ellipse at 40% 40%, rgba(61, 112, 183, 0.06) 0%, transparent 55%),
                       radial-gradient(ellipse at 80% 70%, rgba(28, 44, 90, 0.05) 0%, transparent 50%)`
        }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <motion.span 
                className="w-1.5 h-1.5 bg-primary rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs text-primary font-medium tracking-wider uppercase">
                Our Services
              </span>
            </span>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
              <Typewriter 
                words={["VAPT Services", "ISO 27001 Audit", "Custom Development", "Enterprise Security"]}
                className="text-gradient"
                speed={180}
                delayBetweenWords={3000}
              />
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Comprehensive cybersecurity services including vulnerability assessment,
              ISO compliance, and secure software development tailored to protect your business.
            </p>
          </motion.div>

          {/* Table of Contents */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 flex flex-wrap gap-4"
          >
            {services.map((service, i) => (
              <motion.a
                key={service.id}
                href={`#${service.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(service.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10 bg-card/40 backdrop-blur-sm hover:border-[#42BA90]/40 hover:bg-card/60 transition-all duration-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <service.icon className="w-5 h-5 text-[#42BA90] opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {service.title}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-[#42BA90] group-hover:translate-x-0.5 transition-all" />
              </motion.a>
            ))}
          </motion.nav>
        </div>
      </section>

      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-20 relative ${index % 2 === 1 ? "bg-card/30" : ""}`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid lg:grid-cols-2 gap-16 items-start"
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="mb-6">
                  <AnimatedIcon Icon={service.icon} color={service.color} />
                </div>
                <h2 className="font-display text-4xl font-bold mb-6">
                  {service.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-4 rounded-xl bg-card/50 border border-white/5">
                  {service.stats.map((stat) => (
                    <CountUpStat
                      key={stat.label}
                      value={stat.value}
                      suffix={stat.suffix}
                      label={stat.label}
                      color={service.color}
                    />
                  ))}
                </div>

                <Link href="/contact">
                  <Button
                    data-testid={`button-service-${service.id}`}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              <Card3D
                className={`rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
                glowColor={service.color}
              >
                <div className="p-8 relative z-10">
                  <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                    <motion.div
                      className={`w-2 h-2 rounded-full ${service.color === "neutral" ? "bg-[#42BA90]" : "bg-[#3D70B7]"}`}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    What's Included
                  </h3>
                  <StaggeredFeatures features={service.features} color={service.color} />
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                      Success Rate
                    </h4>
                    <AnimatedProgressBar
                      value={service.stats[2]?.value || service.stats[1]?.value || 95}
                      label={service.stats[2]?.label || service.stats[1]?.label || "Success Rate"}
                      color={service.color}
                    />
                  </div>
                </div>
              </Card3D>
            </motion.div>
          </div>
        </section>
      ))}

    </div>
  );
}
