import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Shield, Target, Eye, Award, Users, Globe, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Link } from "wouter";
import { useRef, useState, useEffect, useCallback } from "react";

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "We approach every engagement with a defense-in-depth mindset, ensuring comprehensive protection.",
  },
  {
    icon: Target,
    title: "Precision",
    description: "Our assessments are thorough and methodical, leaving no vulnerability uncovered.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Clear reporting and honest communication throughout every security assessment and audit.",
  },
];

const stats = [
  { icon: Users, value: 100, suffix: "+", label: "Brands Associated" },
  { icon: Globe, value: 200, suffix: "+", label: "Professionals Trained" },
  { icon: Award, value: 9, suffix: "", label: "Expert Team Members" },
  { icon: Shield, value: 100, suffix: "%", label: "Audit Success Rate" },
];


function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!startOnView || (isInView && !hasStarted.current)) {
      hasStarted.current = true;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOut * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration, startOnView]);

  return { count, ref };
}

function AnimatedStat({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { count, ref } = useCountUp(stat.value, 2000);
  
  return (
    <motion.div
      ref={ref}
      key={stat.label}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 30px rgba(61, 112, 183, 0.3)",
      }}
      data-testid={`stat-${index}`}
      className="rounded-xl p-6 border border-white/10 bg-card/50 text-center cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
    >
      <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
      <p className="font-display text-3xl font-bold text-primary mb-1">
        {count}{stat.suffix}
      </p>
      <p className="text-sm text-muted-foreground">{stat.label}</p>
    </motion.div>
  );
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setGlowX((x / rect.width) * 100);
    setGlowY((y / rect.height) * 100);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setGlowX(50);
    setGlowY(50);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      className={`relative transition-transform duration-200 ease-out ${className}`}
    >
      <div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(61, 112, 183, 0.3), transparent 50%)`,
        }}
      />
      <div className="absolute inset-0 rounded-xl border-2 border-transparent hover:border-primary/40 transition-colors duration-300 pointer-events-none" />
      {children}
    </motion.div>
  );
}


export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 relative overflow-hidden">
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(61, 112, 183, 0.4) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

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
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs text-primary font-medium tracking-wider uppercase">
                About Us
              </span>
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Security That Goes{" "}
              <span className="text-gradient">Beyond Prevention</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Arica Tech Security LLP delivers end-to-end protection of your digital world.
              We integrate cybersecurity operations, digital forensics, and compliance
              expertise across the full incident lifecycle.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <AnimatedStat key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden bg-card/30">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-4xl font-bold mb-6">
                Trusted Across{" "}
                <span className="text-gradient">Industries</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Data moves without pause across cloud platforms, industrial systems,
                  mobile devices, and third-party networks. As connectivity expands, so
                  does exposure. Cyber risk today is continuous and business-critical.
                </p>
                <p>
                  From governance and proactive testing to 24×7 monitoring, rapid
                  containment, forensic investigation, and regulatory closure — every
                  stage is managed with structure and accountability.
                </p>
                <p>
                  Behind this delivery is an expert team of cybersecurity, forensic, and
                  compliance specialists with experience across complex digital
                  environments. Associated with 100+ brands.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <motion.div 
                className="rounded-xl p-6 border border-white/10 bg-card/80 col-span-2"
                whileHover={{ 
                  scale: 1.02,
                  borderColor: "rgba(61, 112, 183, 0.4)",
                  boxShadow: "0 0 30px rgba(61, 112, 183, 0.15)",
                }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-display text-lg font-bold mb-2 text-halo-white">
                  Our Mission
                </h3>
                <p className="text-sm text-muted-foreground">
                  End-to-end protection of your digital world — cybersecurity,
                  digital forensics, and compliance & governance.
                </p>
              </motion.div>
              <motion.div 
                className="rounded-xl p-5 border border-white/10 bg-card/80"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(61, 112, 183, 0.4)",
                  boxShadow: "0 0 25px rgba(61, 112, 183, 0.15)",
                }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-display font-bold mb-2 text-halo-white">Vision</h3>
                <p className="text-xs text-muted-foreground">
                  Built to protect, investigate, and comply — keeping you
                  prepared for what others react to.
                </p>
              </motion.div>
              <motion.div 
                className="rounded-xl p-5 border border-white/10 bg-card/80"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(61, 112, 183, 0.4)",
                  boxShadow: "0 0 25px rgba(61, 112, 183, 0.15)",
                }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-display font-bold mb-2 text-halo-white">Values</h3>
                <p className="text-xs text-muted-foreground">
                  Security first, precision, and transparency in every engagement.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold">
              What Drives <span className="text-gradient">Us</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TiltCard className="h-full">
                  <div className="rounded-xl p-8 border border-white/10 bg-card/50 text-center h-full transition-colors duration-300 hover:bg-card/70 hover:border-primary/30">
                    <motion.div 
                      className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-6"
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 0 25px rgba(61, 112, 183, 0.4)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <value.icon className="w-6 h-6" />
                    </motion.div>
                    <h3 className="font-display text-xl font-bold mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team page teaser */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/team">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="group cursor-pointer relative rounded-2xl border border-white/10 bg-card/30 backdrop-blur-sm overflow-hidden"
              whileHover={{
                borderColor: "rgba(61, 112, 183, 0.5)",
                boxShadow: "0 0 60px rgba(61, 112, 183, 0.15)",
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-[#42BA90]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative px-8 py-16 md:px-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <motion.span
                    className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    The People Behind the Shield
                  </motion.span>
                  <h2
                    className="font-extrabold tracking-tight leading-none mb-4"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 900,
                      fontSize: "clamp(2.5rem, 6vw, 5rem)",
                    }}
                  >
                    <span className="text-foreground/90 group-hover:text-foreground transition-colors duration-500">
                      Meet Our{" "}
                    </span>
                    <span className="text-gradient">Directors</span>
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-lg">
                    Get to know the experts defending your digital frontier.
                  </p>
                </div>

                {/* Arrow indicator */}
                <motion.div
                  className="flex items-center gap-3 text-primary"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm font-medium tracking-wider uppercase hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Explore
                  </span>
                  <div className="w-14 h-14 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/60 transition-all duration-500">
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>
    </div>
  );
}
