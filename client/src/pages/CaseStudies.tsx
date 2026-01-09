import { motion } from "framer-motion";
import { ArrowRight, Building2, Heart, Landmark, ShoppingCart } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const caseStudies = [
  {
    icon: Building2,
    industry: "Financial Services",
    title: "Major Bank Threat Prevention",
    result: "$10M+ potential loss prevented",
    description: "Identified and neutralized an advanced persistent threat targeting customer financial data before any breach occurred.",
    stats: [
      { label: "Threats Blocked", value: "2,400+" },
      { label: "Response Time", value: "< 15 min" },
      { label: "Downtime", value: "Zero" },
    ],
  },
  {
    icon: Heart,
    industry: "Healthcare",
    title: "Hospital Ransomware Recovery",
    result: "100% data recovery in 48 hours",
    description: "Rapid response to ransomware attack on critical healthcare infrastructure, achieving full system restoration without paying ransom.",
    stats: [
      { label: "Data Recovered", value: "100%" },
      { label: "Recovery Time", value: "48 hrs" },
      { label: "Patient Impact", value: "None" },
    ],
  },
  {
    icon: Landmark,
    industry: "Government",
    title: "Federal Agency Compliance",
    result: "Full NIST 800-53 compliance",
    description: "Guided federal agency through complex compliance requirements, implementing comprehensive security controls.",
    stats: [
      { label: "Controls Implemented", value: "325" },
      { label: "Audit Score", value: "98%" },
      { label: "Timeline", value: "6 months" },
    ],
  },
  {
    icon: ShoppingCart,
    industry: "E-Commerce",
    title: "Retail Chain Forensics",
    result: "Attacker identified and prosecuted",
    description: "Comprehensive digital forensics investigation that traced a sophisticated POS breach to its source.",
    stats: [
      { label: "Evidence Items", value: "1,200+" },
      { label: "Investigation", value: "30 days" },
      { label: "Prosecution", value: "Successful" },
    ],
  },
];

export default function CaseStudies() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 relative overflow-hidden">
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
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span className="text-xs text-primary font-medium tracking-wider uppercase">
                Case Studies
              </span>
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Real-World{" "}
              <span className="text-gradient">Results</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              See how we've helped organizations across industries protect their
              digital assets and respond to security incidents.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                data-testid={`card-case-study-${index}`}
                className="rounded-2xl border border-white/10 bg-card/50 overflow-hidden group hover:border-primary/30 transition-colors"
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <study.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {study.industry}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold mb-2">
                    {study.title}
                  </h3>
                  <p className="text-primary font-semibold mb-4">{study.result}</p>
                  <p className="text-muted-foreground text-sm mb-6">
                    {study.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                    {study.stats.map((stat) => (
                      <div key={stat.label}>
                        <p className="font-display font-bold text-lg">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/contact">
              <Button
                data-testid="button-discuss-case"
                className="bg-primary text-primary-foreground hover:bg-primary/90 group"
              >
                Discuss Your Case
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}
