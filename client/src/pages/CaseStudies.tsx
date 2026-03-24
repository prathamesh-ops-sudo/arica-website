import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, ExternalLink, RotateCcw } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { EtherealShadow } from "@/components/ui/ethereal-shadow";
import { AmbientParticles } from "@/components/ui/ambient-particles";

const categories = ["All sectors", "VAPT", "ISO Audit", "Software", "Enterprise"];

const caseStudies = [
  {
    category: "VAPT",
    title: "Banking Infrastructure Penetration Testing",
    description: "Comprehensive VAPT assessment for a leading financial institution, identifying 47 critical vulnerabilities before exploitation.",
    challenge: "Legacy banking systems with unknown security gaps across 200+ endpoints.",
    solution: "Full-scope penetration testing with OWASP methodology and custom exploit development.",
  },
  {
    category: "ISO Audit",
    title: "ISO 27001 Certification Success",
    description: "Guided a multinational manufacturing company through complete ISO 27001:2022 certification in just 6 months.",
    challenge: "No existing ISMS framework, scattered documentation, and 15 global offices.",
    solution: "Gap analysis, policy development, risk assessment, and certification audit support.",
  },
  {
    category: "Software",
    title: "Secure E-Commerce Platform Development",
    description: "Built a PCI-DSS compliant custom e-commerce solution processing $50M+ annual transactions securely.",
    challenge: "Client needed custom payment integration with end-to-end encryption and fraud prevention.",
    solution: "Secure SDLC implementation, code review, and continuous security testing pipeline.",
  },
  {
    category: "ISO Audit",
    title: "Healthcare HIPAA + ISO Compliance",
    description: "Achieved dual HIPAA and ISO 27001 compliance for a regional hospital network protecting 2M patient records.",
    challenge: "Fragmented EHR systems failing regulatory audits with multiple compliance gaps.",
    solution: "Unified compliance framework, security controls implementation, and staff training.",
  },
  {
    category: "VAPT",
    title: "SCADA System Penetration Testing",
    description: "Critical infrastructure security assessment for energy sector, preventing potential grid disruption.",
    challenge: "Industrial control systems with exposed attack vectors and legacy protocols.",
    solution: "OT-specific penetration testing, network segmentation, and ICS security hardening.",
  },
  {
    category: "Software",
    title: "Secure Software Development Lifecycle",
    description: "Implemented DevSecOps pipeline for a fintech startup, reducing vulnerabilities by 94% pre-production.",
    challenge: "Rapid development cycles introducing security debt and unreviewed code.",
    solution: "SAST/DAST integration, security gates, and developer security training program.",
  },
  {
    category: "Enterprise",
    title: "Enterprise Network Security Assessment",
    description: "360-degree security audit for Fortune 500 company covering 50,000 endpoints across 12 countries.",
    challenge: "Complex hybrid infrastructure with inconsistent security policies.",
    solution: "Comprehensive vulnerability assessment, red team exercises, and remediation roadmap.",
  },
  {
    category: "Enterprise",
    title: "Zero Trust Architecture Implementation",
    description: "Designed and deployed zero trust security model for government contractor handling classified data.",
    challenge: "Traditional perimeter security inadequate for remote workforce and cloud migration.",
    solution: "Identity-centric security, micro-segmentation, and continuous verification protocols.",
  },
];

const chartData = [
  { month: "JAN 2024", value: 4200000 },
  { month: "FEB 2024", value: 3800000 },
  { month: "MAR 2024", value: 3200000 },
  { month: "APR 2024", value: 2100000 },
  { month: "MAY 2024", value: 800000 },
  { month: "JUN 2024", value: 200000 },
  { month: "JUL 2024", value: 120 },
];

function AnimatedCounter({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    
    const startTime = Date.now();
    const endValue = value;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * endValue);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function ThreatChart() {
  const maxValue = Math.max(...chartData.map(d => d.value));
  const chartRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(chartRef, { once: true, margin: "-50px" });
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    const startTime = Date.now();
    const duration = 2000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setAnimationProgress(easeOutQuart);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView]);

  const getPathData = (progress: number) => {
    const visiblePoints = Math.floor(progress * chartData.length) + 1;
    const points = chartData.slice(0, visiblePoints);
    
    if (points.length === 0) return "";
    
    return points.map((d, i) => {
      const x = (i / (chartData.length - 1)) * 400;
      const y = 150 - (d.value / maxValue) * 140;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const getAreaPath = (progress: number) => {
    const visiblePoints = Math.floor(progress * chartData.length) + 1;
    const points = chartData.slice(0, visiblePoints);
    
    if (points.length === 0) return "";
    
    const linePath = points.map((d, i) => {
      const x = (i / (chartData.length - 1)) * 400;
      const y = 150 - (d.value / maxValue) * 140;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    const lastX = ((points.length - 1) / (chartData.length - 1)) * 400;
    return `${linePath} L ${lastX} 150 L 0 150 Z`;
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };
  
  return (
    <div ref={chartRef} className="relative h-48 w-full">
      <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(192, 95%, 50%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(192, 95%, 50%)" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <motion.path
          d={getAreaPath(animationProgress)}
          fill="url(#chartGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        <motion.path
          d={getPathData(animationProgress)}
          fill="none"
          stroke="hsl(192, 95%, 50%)"
          strokeWidth="2"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: animationProgress }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        
        {chartData.map((d, i) => {
          const x = (i / (chartData.length - 1)) * 400;
          const y = 150 - (d.value / maxValue) * 140;
          const isVisible = i <= Math.floor(animationProgress * chartData.length);
          
          return (
            <g key={i}>
              <motion.circle
                cx={x}
                cy={y}
                r={hoveredPoint === i ? 8 : 4}
                fill="hsl(192, 95%, 50%)"
                filter="url(#glow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isVisible ? 1 : 0, 
                  opacity: isVisible ? 1 : 0 
                }}
                transition={{ 
                  duration: 0.4, 
                  delay: i * 0.15,
                  ease: "backOut"
                }}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              />
              
              <circle
                cx={x}
                cy={y}
                r="20"
                fill="transparent"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              />
            </g>
          );
        })}
      </svg>
      
      <AnimatePresence>
        {hoveredPoint !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute pointer-events-none bg-card border border-primary/30 rounded-lg px-3 py-2 shadow-lg shadow-primary/20"
            style={{
              left: `${(hoveredPoint / (chartData.length - 1)) * 100}%`,
              top: `${100 - (chartData[hoveredPoint].value / maxValue) * 93}%`,
              transform: 'translate(-50%, -120%)',
            }}
          >
            <p className="text-xs font-mono text-muted-foreground">{chartData[hoveredPoint].month}</p>
            <p className="text-sm font-bold text-primary">{formatValue(chartData[hoveredPoint].value)} threats</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-muted-foreground">
        {chartData.map((d, i) => (
          <motion.span 
            key={i} 
            className="font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: i <= Math.floor(animationProgress * chartData.length) ? 1 : 0 }}
            transition={{ delay: i * 0.15 }}
          >
            {d.month.split(' ')[0]}
          </motion.span>
        ))}
      </div>
      <div className="absolute top-2 left-2 text-xs">
        <span className="font-mono text-muted-foreground">THREAT_COUNT: </span>
        <span className="font-mono text-primary">-98.2%</span>
      </div>
    </div>
  );
}

function AnimatedFilterTabs({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: { 
  categories: string[]; 
  activeCategory: string; 
  onCategoryChange: (cat: string) => void;
}) {
  const [tabDimensions, setTabDimensions] = useState<{ left: number; width: number } | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeIndex = categories.indexOf(activeCategory);
    const activeTab = tabRefs.current[activeIndex];
    const container = containerRef.current;
    
    if (activeTab && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      setTabDimensions({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [activeCategory, categories]);

  return (
    <div ref={containerRef} className="relative flex flex-wrap gap-2">
      {tabDimensions && (
        <motion.div
          className="absolute h-full rounded-lg bg-primary/20 border border-primary/40"
          style={{
            boxShadow: '0 0 20px rgba(61, 112, 183, 0.3), inset 0 0 20px rgba(61, 112, 183, 0.1)',
          }}
          initial={false}
          animate={{
            left: tabDimensions.left,
            width: tabDimensions.width,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}
      
      {categories.map((cat, index) => (
        <button
          key={cat}
          ref={(el) => { tabRefs.current[index] = el; }}
          onClick={() => onCategoryChange(cat)}
          data-testid={`filter-${cat.toLowerCase().replace(' ', '-')}`}
          className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors z-10 ${
            activeCategory === cat
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          style={{
            textShadow: activeCategory === cat ? '0 0 10px rgba(61, 112, 183, 0.5)' : 'none',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function FlipCard({ study, index }: { study: typeof caseStudies[0]; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, rotateY: -10 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      data-testid={`card-case-study-${index}`}
      className="relative h-[380px]"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="w-full h-full relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onClick={() => setIsFlipped(!isFlipped)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsFlipped(!isFlipped);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${study.title} - ${isFlipped ? 'showing details, press to show summary' : 'press to show challenge and solution details'}`}
        whileHover={{ 
          scale: 1.02,
          z: 50,
          transition: { duration: 0.2 }
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-xl border border-white/10 bg-card/50 p-6"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          whileHover={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(61, 112, 183, 0.15)',
            borderColor: 'rgba(61, 112, 183, 0.4)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className={`w-1.5 h-1.5 rounded-full ${
              study.category === "VAPT" ? "bg-red-500" :
              study.category === "ISO Audit" ? "bg-green-500" :
              study.category === "Software" ? "bg-blue-500" :
              study.category === "Enterprise" ? "bg-cyan-500" :
              "bg-cyan-500"
            }`} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {study.category}
            </span>
          </div>

          <h3 className="font-display text-lg font-bold mb-3">{study.title}</h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {study.description}
          </p>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 text-xs text-primary">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Click to see details</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-xl border border-primary/30 bg-card/80 backdrop-blur-sm p-6"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: '0 0 30px rgba(61, 112, 183, 0.2)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Case Details
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Click to flip back</span>
            </div>
          </div>

          <h3 className="font-display text-lg font-bold mb-4 text-primary">{study.title}</h3>

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-[10px] text-red-400 uppercase tracking-wider mb-1 font-semibold">Challenge</p>
              <p className="text-sm text-foreground">{study.challenge}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-[10px] text-green-400 uppercase tracking-wider mb-1 font-semibold">Solution</p>
              <p className="text-sm text-foreground">{study.solution}</p>
            </div>
          </div>

          <button className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2 rounded-lg bg-primary/10 hover:bg-primary/20">
            View Full Report
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function CaseStudies() {
  const [activeCategory, setActiveCategory] = useState("All sectors");
  
  const filteredStudies = activeCategory === "All sectors" 
    ? caseStudies 
    : caseStudies.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-background aurora-bg">
      <AmbientParticles variant="data" count={15} opacity={0.1} />
      <Navbar />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          background: `radial-gradient(ellipse at 30% 50%, rgba(61, 112, 183, 0.06) 0%, transparent 55%),
                       radial-gradient(ellipse at 75% 25%, rgba(28, 44, 90, 0.05) 0%, transparent 50%)`
        }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-16"
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Security <span className="text-gradient">Impact</span> & Case Studies
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Quantifiable results from the front lines of global cybersecurity. Explore how
              Arica Tech protects critical infrastructure and high-value assets.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid lg:grid-cols-2 gap-6 mb-20"
          >
            <div className="rounded-2xl border border-white/10 bg-card/50 p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-medium text-primary uppercase tracking-wider px-2 py-1 rounded bg-primary/10">
                  Featured VAPT Success
                </span>
              </div>
              
              <h2 className="font-display text-2xl font-bold mb-6">
                Vulnerability Reduction Impact
              </h2>

              <div className="flex gap-8 mb-6">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Critical Vulnerabilities Found</p>
                  <p className="font-display text-3xl font-bold text-primary">
                    <AnimatedCounter value={47} /> <span className="text-sm text-muted-foreground">identified</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Post-Remediation</p>
                  <p className="font-display text-3xl font-bold text-green-500">
                    <AnimatedCounter value={0} /> <span className="text-sm text-muted-foreground">critical</span>
                  </p>
                </div>
              </div>

              <ThreatChart />
            </div>

            <div className="rounded-2xl border border-white/10 bg-card/50 p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">ISO Audit</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">Nov 2024</span>
              </div>

              <h2 className="font-display text-2xl font-bold mb-4">
                ISO 27001:2022 Certification Achievement
              </h2>

              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Guided a multinational enterprise through complete ISO 27001:2022 certification, 
                establishing a robust Information Security Management System across 15 global offices.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-[10px] text-primary uppercase tracking-wider mb-2 font-semibold">Remediation Rate</p>
                  <p className="font-display text-2xl font-bold text-primary">
                    <AnimatedCounter value={100} suffix="%" />
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/10">
                  <p className="text-[10px] text-green-400 uppercase tracking-wider mb-2 font-semibold">Global Offices</p>
                  <p className="font-display text-2xl font-bold text-green-500">
                    <AnimatedCounter value={15} />
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Challenge</p>
                  <p className="text-sm">No existing ISMS framework with scattered security documentation.</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Solution</p>
                  <p className="text-sm">Arica Tech's end-to-end ISO certification support & gap analysis.</p>
                </div>
              </div>

              <Button variant="outline" className="border-white/20 hover:bg-white/5 group">
                View Full Impact Report
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold mb-2">Security Success Stories</h2>
              <p className="text-muted-foreground">Industry-specific implementations and measurable outcomes.</p>
            </div>
            
            <AnimatedFilterTabs 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredStudies.map((study, index) => (
                <FlipCard 
                  key={study.title} 
                  study={study} 
                  index={index} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: 500, suffix: "+", label: "Security Assessments" },
              { value: 98, suffix: "%", label: "Client Satisfaction" },
              { value: 2500, suffix: "+", label: "Vulnerabilities Fixed" },
              { value: 50, suffix: "+", label: "Enterprise Clients" },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-card/30 border border-white/5 hover:border-primary/30 transition-colors"
              >
                <p className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} duration={2.5} />
                </p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <EtherealShadow
            color="rgba(59, 130, 246, 0.5)"
            animation={{ scale: 70, speed: 50 }}
            noise={{ opacity: 0.4, scale: 1 }}
            sizing="fill"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80" />

        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Achieve <span className="text-gradient">These Results.</span>
            </h2>

            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Speak with our principal analysts today to discuss how our security
              methodologies can be tailored to your organization's specific threat
              landscape.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button
                  data-testid="button-cta-consultation"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                >
                  Book Consultation
                </Button>
              </Link>
              <Button
                data-testid="button-download-pdf"
                size="lg"
                variant="outline"
                className="border-white/20 hover:bg-white/5 font-semibold"
              >
                Download Impact PDF
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
