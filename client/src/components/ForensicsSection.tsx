import { motion } from "framer-motion";
import { Link } from "wouter";
import { Zap, ShieldCheck, Scale, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkPreview } from "@/components/ui/link-preview";
import { SecurityScanAnimation } from "@/components/ui/security-scan-animation";
import { NanobotParticles } from "@/components/ui/nanobot-particles";
import { FloatingCyberThreats } from "@/components/FloatingCyberThreats";

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
      <div className="absolute inset-0 opacity-40" style={{
        background: `radial-gradient(ellipse at 20% 50%, rgba(61, 112, 183, 0.08) 0%, transparent 60%),
                     radial-gradient(ellipse at 80% 20%, rgba(61, 112, 183, 0.05) 0%, transparent 50%)`
      }} />
      <FloatingCyberThreats variant="mixed" density="low" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Vulnerability Assessment &
            <br />
            <span className="text-gradient">Penetration Testing</span>
          </h2>

          <p className="text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto text-lg">
            Our security experts follow{" "}
            <LinkPreview
              url="https://owasp.org/www-project-web-security-testing-guide/"
              className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#42BA90] to-[#3D70B7]"
            >
              OWASP Testing Guidelines
            </LinkPreview>{" "}
            to identify vulnerabilities across your networks, applications, and infrastructure.
          </p>

          <p className="text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
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
        </motion.div>

        {/* Centered animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-lg mx-auto mb-16"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-transparent rounded-3xl blur-2xl" />
          <div className="relative">
            <NanobotParticles 
              particleCount={35} 
              color="123, 47, 224" 
              maxDistance={100}
              className="opacity-40"
            />
            <SecurityScanAnimation />
          </div>
        </motion.div>

        {/* Feature cards - centered grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl border border-white/10 bg-card/50 text-center"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary inline-flex mb-3">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
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
        </div>
      </div>
    </section>
  );
}
