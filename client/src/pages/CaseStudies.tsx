import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, TrendingDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { EtherealShadow } from "@/components/ui/ethereal-shadow";

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

function ThreatChart() {
  const maxValue = Math.max(...chartData.map(d => d.value));
  
  return (
    <div className="relative h-48 w-full">
      <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(192, 95%, 50%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(192, 95%, 50%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 ${150 - (chartData[0].value / maxValue) * 140} ${chartData.map((d, i) => `L ${(i / (chartData.length - 1)) * 400} ${150 - (d.value / maxValue) * 140}`).join(' ')} L 400 150 L 0 150 Z`}
          fill="url(#chartGradient)"
        />
        <path
          d={`M 0 ${150 - (chartData[0].value / maxValue) * 140} ${chartData.map((d, i) => `L ${(i / (chartData.length - 1)) * 400} ${150 - (d.value / maxValue) * 140}`).join(' ')}`}
          fill="none"
          stroke="hsl(192, 95%, 50%)"
          strokeWidth="2"
        />
        {chartData.map((d, i) => (
          <circle
            key={i}
            cx={(i / (chartData.length - 1)) * 400}
            cy={150 - (d.value / maxValue) * 140}
            r="4"
            fill="hsl(192, 95%, 50%)"
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
    <div className="min-h-screen bg-background aurora-bg">
      <Navbar />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 212, 255, 0.12) 1px, transparent 0)`,
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
                  Featured VAPT Success
                </span>
              </div>
              
              <h2 className="font-display text-2xl font-bold mb-6">
                Vulnerability Reduction Impact
              </h2>

              <div className="flex gap-8 mb-6">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Critical Vulnerabilities Found</p>
                  <p className="font-display text-3xl font-bold text-primary">47 <span className="text-sm text-muted-foreground">identified</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Post-Remediation</p>
                  <p className="font-display text-3xl font-bold text-green-500">0 <span className="text-sm text-muted-foreground">critical</span></p>
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
                    study.category === "VAPT" ? "bg-red-500" :
                    study.category === "ISO Audit" ? "bg-green-500" :
                    study.category === "Software" ? "bg-blue-500" :
                    study.category === "Enterprise" ? "bg-purple-500" :
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
