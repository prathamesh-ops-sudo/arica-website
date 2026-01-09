import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, TrendingDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { EtherealShadow } from "@/components/ui/ethereal-shadow";

const categories = ["All sectors", "Finance", "Healthcare", "Energy"];

const caseStudies = [
  {
    category: "Finance",
    title: "Swift-Action Banking Forensics",
    description: "Recovering $45M in compromised assets through advanced cryptographic tracing and rapid incident response.",
    challenge: "Multi-vector ransomware attack on core transaction ledger.",
    solution: "Real-time isolation and private key recovery protocols.",
  },
  {
    category: "Logistics",
    title: "Supply Chain Integrity Audit",
    description: "Securing the global distribution network of a Fortune 500 retailer against hardware-level vulnerabilities.",
    challenge: "Third-party hardware components with embedded backdoors.",
    solution: "End-to-end hardware validation & firmware hardening.",
  },
  {
    category: "Healthcare",
    title: "HIPAA Compliance Automation",
    description: "Transforming patient data security for a regional hospital network using AI-driven compliance tracking.",
    challenge: "Fragmented EHR systems failing regulatory audits.",
    solution: "Unified identity management and automated reporting.",
  },
  {
    category: "Energy",
    title: "Smart Grid Resilience",
    description: "Protecting critical power distribution infrastructure from nation-state coordinated DDoS attacks.",
    challenge: "SCADA systems vulnerable to remote execution.",
    solution: "Air-gapped monitoring and protocol filtering.",
  },
  {
    category: "Legal",
    title: "High-Stakes E-Discovery",
    description: "Preserving digital chain-of-custody for a international litigation case involving proprietary trade secrets.",
    challenge: "Evidence destruction by internal malicious actors.",
    solution: "Write-once immutable logging and expert testimony.",
  },
  {
    category: "Aerospace",
    title: "Satellite Link Encryption",
    description: "Implementing quantum-resistant encryption for secure telemetry between ground control and orbital assets.",
    challenge: "Emerging risk of legacy unencrypted signals.",
    solution: "Post-quantum cryptographic wrapper deployment.",
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

function ThreatChart() {
  const maxValue = Math.max(...chartData.map(d => d.value));
  
  return (
    <div className="relative h-48 w-full">
      <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(185, 85%, 50%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(185, 85%, 50%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 ${150 - (chartData[0].value / maxValue) * 140} ${chartData.map((d, i) => `L ${(i / (chartData.length - 1)) * 400} ${150 - (d.value / maxValue) * 140}`).join(' ')} L 400 150 L 0 150 Z`}
          fill="url(#chartGradient)"
        />
        <path
          d={`M 0 ${150 - (chartData[0].value / maxValue) * 140} ${chartData.map((d, i) => `L ${(i / (chartData.length - 1)) * 400} ${150 - (d.value / maxValue) * 140}`).join(' ')}`}
          fill="none"
          stroke="hsl(185, 85%, 50%)"
          strokeWidth="2"
        />
        {chartData.map((d, i) => (
          <circle
            key={i}
            cx={(i / (chartData.length - 1)) * 400}
            cy={150 - (d.value / maxValue) * 140}
            r="4"
            fill="hsl(185, 85%, 50%)"
          />
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-muted-foreground">
        {chartData.map((d, i) => (
          <span key={i} className="font-mono">{d.month.split(' ')[0]}</span>
        ))}
      </div>
      <div className="absolute top-2 left-2 text-xs">
        <span className="font-mono text-muted-foreground">THREAT_COUNT: </span>
        <span className="font-mono text-primary">-98.2%</span>
      </div>
    </div>
  );
}

export default function CaseStudies() {
  const [activeCategory, setActiveCategory] = useState("All sectors");
  
  const filteredStudies = activeCategory === "All sectors" 
    ? caseStudies 
    : caseStudies.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

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
                  Featured Case Study
                </span>
              </div>
              
              <h2 className="font-display text-2xl font-bold mb-6">
                Threat Neutralization Impact
              </h2>

              <div className="flex gap-8 mb-6">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Initial Attack Volume</p>
                  <p className="font-display text-3xl font-bold text-primary">4.2M <span className="text-sm text-muted-foreground">/ day</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Post-Deployment</p>
                  <p className="font-display text-3xl font-bold text-green-500">&lt; 120 <span className="text-sm text-muted-foreground">/ day</span></p>
                </div>
              </div>

              <ThreatChart />
            </div>

            <div className="rounded-2xl border border-white/10 bg-card/50 p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Government</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">Oct 2024</span>
              </div>

              <h2 className="font-display text-2xl font-bold mb-4">
                Federal Data Infrastructure Protection
              </h2>

              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Successfully neutralized a sustained APT campaign targeting state-level digital infrastructure. 
                Implemented zero-trust architecture and real-time behavioral analysis.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Challenge</p>
                  <p className="text-sm">Advanced Persistent Threats (APT) infiltrating legacy systems.</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Solution</p>
                  <p className="text-sm">Arica Sentience AI & Forensic Protocol 09.</p>
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
            
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  data-testid={`filter-${cat.toLowerCase().replace(' ', '-')}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/50 border border-white/10 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredStudies.map((study, index) => (
              <motion.div
                key={study.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                data-testid={`card-case-study-${index}`}
                className="rounded-xl border border-white/10 bg-card/50 p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    study.category === "Finance" ? "bg-blue-500" :
                    study.category === "Healthcare" ? "bg-green-500" :
                    study.category === "Energy" ? "bg-yellow-500" :
                    study.category === "Logistics" ? "bg-orange-500" :
                    study.category === "Legal" ? "bg-purple-500" :
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

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Challenge</p>
                    <p className="text-xs text-muted-foreground">{study.challenge}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Solution</p>
                    <p className="text-xs text-muted-foreground">{study.solution}</p>
                  </div>
                </div>

                <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group/btn">
                  View Full Report
                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </button>
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

      <Footer />
    </div>
  );
}
