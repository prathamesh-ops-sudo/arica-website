import { motion } from "framer-motion";
import {
  Shield,
  Scale,
  Code,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/ui/typewriter";

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
  },
  {
    id: "iso-audit",
    icon: Scale,
    title: "ISO Audit",
    description:
      "Complete ISO 27001 compliance services to help your organization achieve and maintain information security certification. We guide you through every step of the compliance journey.",
    features: [
      "ISO 27001 Gap Analysis",
      "Compliance Roadmap",
      "Policy Development",
      "Internal Audit Preparation",
      "Certification Support",
      "Continuous Compliance Monitoring",
    ],
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
              <Typewriter 
                words={["VAPT Services", "ISO 27001 Audit", "Custom Development", "Enterprise Security"]}
                className="text-gradient"
              />
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Comprehensive cybersecurity services including vulnerability assessment,
              ISO compliance, and secure software development tailored to protect your business.
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
