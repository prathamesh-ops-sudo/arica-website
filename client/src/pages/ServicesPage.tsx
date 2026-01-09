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
    title: "Threat Prevention",
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
  },
  {
    id: "recovery",
    icon: RefreshCcw,
    title: "Incident Recovery",
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
  },
];

export default function ServicesPage() {
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
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span className="text-xs text-primary font-medium tracking-wider uppercase">
                Our Services
              </span>
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Enterprise Security{" "}
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
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-6">
                  <service.icon className="w-8 h-8" />
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
                    className="bg-primary text-primary-foreground hover:bg-primary/90 group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              <div
                className={`rounded-2xl p-8 border border-white/10 bg-card/50 ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <h3 className="font-display text-xl font-bold mb-6">
                  What's Included
                </h3>
                <ul className="space-y-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      <CTA />
      <Footer />
    </div>
  );
}
