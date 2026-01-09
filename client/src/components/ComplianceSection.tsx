import { motion } from "framer-motion";
import { Link } from "wouter";
import { ClipboardCheck, Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import shieldImage from "@assets/generated_images/3d_shield_compliance_icon.png";

const complianceItems = [
  "Federal Cybersecurity Mandates",
  "GDPR & International Data Protection",
  "Risk Management Framework (RMF)",
];

const certifications = [
  { name: "ISO 27001", description: "Information Security" },
  { name: "SOC 2 Type II", description: "Trust Services" },
  { name: "NIST 800-53", description: "Security Controls" },
];

export function ComplianceSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Regulatory &
              <br />
              <span className="text-gradient">Legal Compliance</span>
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Navigate the complex landscape of GDPR, HIPAA, and federal
              cybersecurity mandates. We provide automated auditing and risk
              mitigation strategies to keep your organization aligned with global
              standards.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-5 rounded-xl border border-white/10 bg-card/50">
                <ClipboardCheck className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-semibold mb-1">Audit Readiness</h3>
                <p className="text-xs text-muted-foreground">
                  Continuous monitoring ensures you are always ready for unexpected inspections.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-white/10 bg-card/50">
                <Bot className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-semibold mb-1">Automated Auditing</h3>
                <p className="text-xs text-muted-foreground">
                  AI-powered systems provide real-time compliance tracking and reporting.
                </p>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {complianceItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/contact">
              <Button
                data-testid="button-get-compliant"
                className="bg-primary text-primary-foreground hover:bg-primary/90 group"
              >
                Get Compliant Now
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-l from-primary/10 to-transparent rounded-3xl blur-2xl" />
            <div className="relative">
              <img
                src={shieldImage}
                alt="Compliance shield"
                className="w-full max-w-md mx-auto h-auto"
              />
              
              <div className="flex justify-center gap-4 mt-8">
                {certifications.map((cert) => (
                  <div
                    key={cert.name}
                    className="px-4 py-3 rounded-lg border border-white/10 bg-card/80 backdrop-blur-sm text-center"
                  >
                    <p className="font-mono text-xs text-primary">{cert.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{cert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
