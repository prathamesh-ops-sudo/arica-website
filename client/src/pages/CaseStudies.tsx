import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { EtherealShadow } from "@/components/ui/ethereal-shadow";
import { AmbientParticles } from "@/components/ui/ambient-particles";

const categories = ["All sectors", "VAPT", "ISO Audit", "Software", "Enterprise"];

const caseStudies = [
  {
    category: "VAPT",
    title: "Banking Infrastructure Penetration Testing",
    description: "VAPT assessment covering application attack-surface discovery, validation, and remediation planning.",
    challenge: "Legacy systems with unknown security gaps and inconsistent testing coverage.",
    solution: "Scoped penetration testing using recognised methodologies, evidence-led reporting, and prioritised remediation guidance.",
  },
  {
    category: "ISO Audit",
    title: "ISO 27001 Certification Support",
    description: "ISO 27001 engagement supporting the development and operation of an information security management system.",
    challenge: "No consistent ISMS framework, scattered documentation, and unclear ownership of controls.",
    solution: "Gap analysis, policy development, risk assessment, internal audit preparation, and certification audit support.",
  },
  {
    category: "Software",
    title: "Secure E-Commerce Platform Development",
    description: "Secure software engagement for a commerce platform requiring stronger protection around payment workflows.",
    challenge: "Custom payment integration required secure handling of sensitive data and clear security ownership.",
    solution: "Secure SDLC implementation, code review, threat modelling, and continuous security testing guidance.",
  },
  {
    category: "ISO Audit",
    title: "Healthcare Privacy and Security Compliance",
    description: "Healthcare compliance engagement covering privacy, information security, and operational control design.",
    challenge: "Fragmented systems and documentation created uncertainty around protection of sensitive health information.",
    solution: "Unified compliance framework, control implementation support, evidence preparation, and staff training.",
  },
  {
    category: "VAPT",
    title: "SCADA System Penetration Testing",
    description: "Operational technology security assessment focused on industrial environments and safety-conscious testing.",
    challenge: "Industrial control systems with exposed attack vectors and legacy protocols.",
    solution: "OT-specific penetration testing, network segmentation, and ICS security hardening.",
  },
  {
    category: "Software",
    title: "Secure Software Development Lifecycle",
    description: "DevSecOps engagement embedding security checks into software delivery workflows.",
    challenge: "Rapid release cycles introduced security debt and left code changes inconsistently reviewed.",
    solution: "SAST/DAST integration, security gates, remediation workflows, and developer security training.",
  },
  {
    category: "Enterprise",
    title: "Enterprise Network Security Assessment",
    description: "Enterprise security assessment covering hybrid infrastructure, policy consistency, and remediation planning.",
    challenge: "Complex hybrid infrastructure with inconsistent security policies.",
    solution: "Comprehensive vulnerability assessment, red team exercises, and remediation roadmap.",
  },
  {
    category: "Enterprise",
    title: "Zero Trust Architecture Implementation",
    description: "Zero-trust architecture engagement for organisations modernising access across remote and cloud environments.",
    challenge: "Traditional perimeter security inadequate for remote workforce and cloud migration.",
    solution: "Identity-centric security, micro-segmentation, and continuous verification protocols.",
  },
];

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
              study.category === "ISO Audit" ? "bg-[#42BA90]" :
              study.category === "Software" ? "bg-blue-500" :
              study.category === "Enterprise" ? "bg-[#3D70B7]" :
              "bg-[#3D70B7]"
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
            <div className="p-3 rounded-lg bg-[#42BA90]/10 border border-[#42BA90]/20">
              <p className="text-[10px] text-[#42BA90] uppercase tracking-wider mb-1 font-semibold">Solution</p>
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
    <div className="min-h-screen bg-background">
      <AmbientParticles variant="data" count={15} opacity={0.1} />

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
              Explore anonymised engagement scenarios and the methodologies used to address
              common security, software, and compliance challenges.
            </p>
            <p className="mt-5 text-sm text-primary/80 border-l-2 border-primary pl-4">
              These examples are anonymised for confidentiality and illustrate service capabilities rather than named client engagements.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid lg:grid-cols-2 gap-6 mb-20"
          >
            <div className="rounded-2xl border border-white/10 bg-card/50 p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-medium text-primary uppercase tracking-wider px-2 py-1 rounded bg-primary/10">
                  Featured Engagement
                </span>
              </div>
              
              <h2 className="font-display text-2xl font-bold mb-6">
                Vulnerability Assessment & Remediation Planning
              </h2>

              <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                An engagement can combine attack-surface discovery, manual validation, evidence-led reporting, and a practical remediation roadmap for security teams.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-card/50 p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">ISO Audit</span>
                <span className="text-xs text-muted-foreground">•</span>
              </div>

              <h2 className="font-display text-2xl font-bold mb-4">
                ISO 27001 Certification Support
              </h2>

              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Support for developing and operating an Information Security Management System, including gap analysis, evidence preparation, and certification audit readiness.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Challenge</p>
                  <p className="text-sm">No existing ISMS framework with scattered security documentation.</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Solution</p>
                  <p className="text-sm">Framework guidance, gap analysis, and certification audit support.</p>
                </div>
              </div>

              <Button variant="outline" className="border-white/20 hover:bg-white/5 group">
                Discuss a Similar Engagement
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
              <p className="text-muted-foreground">Methodology-led examples across core service areas.</p>
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



    </div>
  );
}
