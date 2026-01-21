import { motion } from "framer-motion";
import { Link } from "wouter";
import { ClipboardCheck, Bot, ArrowRight, Search, FileCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import shieldImage from "@assets/generated_images/3d_shield_compliance_icon.png";

const complianceItems = [
  { text: "Risk Assessment & Gap Analysis", icon: Search },
  { text: "ISMS Implementation & Documentation", icon: FileCheck },
  { text: "Internal Audit & Management Review", icon: Shield },
];

const certifications = [
  { id: "auditor", name: "ISO 27001", description: "Lead Auditor" },
  { id: "implementer", name: "ISO 27001", description: "Lead Implementer" },
  { id: "certified", name: "ISO 27001", description: "Certification Ready" },
];

export function ComplianceSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 212, 255, 0.12) 1px, transparent 0)`,
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
              ISO 27001
              <br />
              <span className="text-gradient">Audit & Certification</span>
            </h2>

            <p className="text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Achieve ISO 27001 certification with our expert audit services. We guide
              your organization through the entire certification journey, from initial
              gap analysis to successful certification and ongoing compliance.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-5 rounded-xl border border-white/10 bg-card/50">
                <ClipboardCheck className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-semibold mb-1">ISMS Development</h3>
                <p className="text-xs text-muted-foreground">
                  Complete Information Security Management System design and implementation.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-white/10 bg-card/50">
                <Bot className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-semibold mb-1">Certification Audit</h3>
                <p className="text-xs text-muted-foreground">
                  Expert guidance through Stage 1 and Stage 2 certification audits.
                </p>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {complianceItems.map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-sm">
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-muted-foreground">{item.text}</span>
                </li>
              ))}
            </ul>

            <Link href="/contact">
              <Button
                data-testid="button-get-compliant"
                className="bg-primary text-primary-foreground hover:bg-primary/90 group"
              >
                Start ISO 27001 Journey
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
                    key={cert.id}
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
