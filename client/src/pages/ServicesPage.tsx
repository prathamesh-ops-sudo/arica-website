import { motion } from "framer-motion";
import {
  Shield,
  Search,
  Scale,
  RefreshCcw,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "prevention",
    icon: Shield,
    title: "Prevention Services",
    description:
      "Proactive security measures to stop threats before they impact your business. Our prevention services create multiple layers of defense.",
    features: [
      "Advanced Firewall Management & Configuration",
      "Intrusion Detection & Prevention Systems (IDS/IPS)",
      "Vulnerability Assessment & Penetration Testing",
      "Security Awareness Training for Employees",
      "Email Security & Phishing Protection",
      "Endpoint Detection & Response (EDR)",
      "Zero Trust Architecture Implementation",
      "Security Policy Development",
    ],
    color: "primary",
  },
  {
    id: "forensics",
    icon: Search,
    title: "Digital Forensics",
    description:
      "Expert investigation of security incidents. We trace attacks to their source, identify vulnerabilities, and provide court-admissible evidence.",
    features: [
      "Incident Investigation & Analysis",
      "Digital Evidence Collection & Preservation",
      "Malware Analysis & Reverse Engineering",
      "Data Recovery from Compromised Systems",
      "Chain of Custody Documentation",
      "Timeline Reconstruction of Attacks",
      "Attribution Analysis",
      "Detailed Technical Reporting",
    ],
    color: "accent",
  },
  {
    id: "legal",
    icon: Scale,
    title: "Legal Support",
    description:
      "Comprehensive legal assistance for cybersecurity incidents. From expert testimony to compliance guidance, we support you through the legal process.",
    features: [
      "Expert Witness Testimony",
      "Regulatory Compliance Guidance (GDPR, HIPAA, SOC2)",
      "Data Breach Notification Assistance",
      "Law Enforcement Liaison",
      "Contract Review for Security Provisions",
      "Cyber Insurance Claims Support",
      "Litigation Support & Documentation",
      "Privacy Impact Assessments",
    ],
    color: "primary",
  },
  {
    id: "recovery",
    icon: RefreshCcw,
    title: "Post-Attack Recovery",
    description:
      "Rapid response and recovery services to minimize damage and restore operations after a security breach. We get you back online safely.",
    features: [
      "24/7 Incident Response Team",
      "Business Continuity Planning",
      "Data Recovery & System Restoration",
      "Ransomware Negotiation & Recovery",
      "Infrastructure Rebuilding",
      "Security Gap Analysis",
      "Remediation Implementation",
      "Post-Incident Security Hardening",
    ],
    color: "accent",
  },
];

const caseStudies = [
  {
    title: "Financial Institution Breach Prevention",
    industry: "Banking",
    result: "Prevented $10M+ potential loss",
    description:
      "Identified and neutralized an advanced persistent threat targeting customer financial data.",
  },
  {
    title: "Healthcare Ransomware Recovery",
    industry: "Healthcare",
    result: "100% data recovery in 48 hours",
    description:
      "Rapid response to ransomware attack, achieving full system restoration without paying ransom.",
  },
  {
    title: "Government Compliance Audit",
    industry: "Government",
    result: "Full regulatory compliance achieved",
    description:
      "Guided agency through complex compliance requirements, passing all security audits.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-4">
              Our Services
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              End-to-End Security{" "}
              <span className="text-gradient">Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From prevention to recovery, we provide comprehensive cybersecurity
              services tailored to protect your business at every stage.
            </p>
          </motion.div>
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
                <div
                  className={`inline-flex p-4 rounded-xl mb-6 ${
                    service.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  <service.icon className="w-10 h-10" />
                </div>
                <h2 className="font-display text-4xl font-bold mb-6">
                  {service.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {service.description}
                </p>
                <Link href="/contact">
                  <Button
                    data-testid={`button-service-${service.id}`}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              <div
                className={`glass rounded-2xl p-8 ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <h3 className="font-display text-xl font-bold mb-6">
                  What's Included
                </h3>
                <ul className="space-y-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          service.color === "primary"
                            ? "text-primary"
                            : "text-accent"
                        }`}
                      />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      <section className="py-20 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-4">
              Case Studies
            </span>
            <h2 className="font-display text-4xl font-bold mb-6">
              Real-World <span className="text-gradient">Results</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how we've helped organizations across industries protect their
              digital assets.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                data-testid={`card-case-study-${index}`}
                className="glass rounded-2xl p-8 hover:bg-card/80 transition-all duration-500"
              >
                <span className="inline-block text-xs font-semibold text-primary tracking-wider uppercase mb-4 px-3 py-1 rounded-full bg-primary/10">
                  {study.industry}
                </span>
                <h3 className="font-display text-xl font-bold mb-2">
                  {study.title}
                </h3>
                <p className="text-primary font-semibold mb-4">{study.result}</p>
                <p className="text-muted-foreground text-sm">
                  {study.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}
