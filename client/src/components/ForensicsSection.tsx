import { motion } from "framer-motion";
import { Link } from "wouter";
import { Zap, ShieldCheck, Scale, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkPreview } from "@/components/ui/link-preview";
import { SecurityScanAnimation } from "@/components/ui/security-scan-animation";

const features = [
  {
    icon: Zap,
    title: "Black Box Testing",
    description: "Simulate real-world attacks without prior system knowledge to uncover hidden vulnerabilities.",
  },
  {
    icon: ShieldCheck,
    title: "White Box Testing",
    description: "Comprehensive code review and security analysis with full system access and documentation.",
  },
  {
    icon: Scale,
    title: "Compliance Reports",
    description: "Detailed vulnerability reports aligned with industry standards like OWASP and NIST.",
  },
];

export function ForensicsSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-card/30">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 212, 255, 0.15) 1px, transparent 0)`,
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
            <SecurityScanAnimation />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Vulnerability Assessment &
              <br />
              <span className="text-gradient">Penetration Testing</span>
            </h2>

            <p className="text-muted-foreground mb-6 leading-relaxed max-w-lg text-lg">
              Our security experts follow{" "}
              <LinkPreview
                url="https://owasp.org/www-project-web-security-testing-guide/"
                className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-cyan-400"
              >
                OWASP Testing Guidelines
              </LinkPreview>{" "}
              to identify vulnerabilities across your networks, applications, and infrastructure.
            </p>

            <p className="text-muted-foreground mb-10 leading-relaxed max-w-lg">
              We utilize industry-leading tools from{" "}
              <LinkPreview
                url="https://www.tenable.com/products/nessus"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Tenable Nessus
              </LinkPreview>{" "}
              and{" "}
              <LinkPreview
                url="https://portswigger.net/burp"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Burp Suite
              </LinkPreview>{" "}
              to provide comprehensive security assessments with actionable remediation guidance.
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
                Request VAPT Assessment
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
