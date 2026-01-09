import { motion } from "framer-motion";
import { Link } from "wouter";
import { Zap, ShieldCheck, Scale, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkPreview } from "@/components/ui/link-preview";
import fingerprintImage from "@assets/generated_images/digital_fingerprint_scan_visual.png";

const features = [
  {
    icon: Zap,
    title: "Rapid Response",
    description: "Immediate containment and investigation to minimize operational downtime.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence Integrity",
    description: "Meticulous chain-of-custody protocols for federal compliance.",
  },
  {
    icon: Scale,
    title: "Expert Testimony",
    description: "Professional witness services for high-stakes litigation and legal proceedings.",
  },
];

export function ForensicsSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-card/30">
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
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-transparent rounded-3xl blur-2xl" />
            <div className="relative">
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 z-10">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-xs font-mono text-primary tracking-wider">SCANNING SECTOR 74</span>
              </div>
              <img
                src={fingerprintImage}
                alt="Digital fingerprint analysis"
                className="w-full h-auto rounded-2xl border border-white/10"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Digital Evidence &
              <br />
              <span className="text-gradient">Threat Tracking</span>
            </h2>

            <p className="text-muted-foreground mb-6 leading-relaxed max-w-lg text-lg">
              Our forensics laboratory employs{" "}
              <LinkPreview
                url="https://www.nist.gov/cybersecurity"
                className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-cyan-400"
              >
                NIST-compliant methodologies
              </LinkPreview>{" "}
              to recover critical data and track sophisticated threat actors across global networks.
            </p>

            <p className="text-muted-foreground mb-10 leading-relaxed max-w-lg">
              We leverage advanced tools from{" "}
              <LinkPreview
                url="https://www.crowdstrike.com"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                CrowdStrike
              </LinkPreview>{" "}
              and{" "}
              <LinkPreview
                url="https://www.paloaltonetworks.com"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Palo Alto Networks
              </LinkPreview>{" "}
              to ensure evidence remains admissible for legal proceedings.
            </p>

            <div className="space-y-6 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary mt-1">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/case-studies">
              <Button
                data-testid="button-request-case-study"
                variant="outline"
                className="border-white/20 hover:bg-white/5 group"
              >
                Request a Case Study
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
