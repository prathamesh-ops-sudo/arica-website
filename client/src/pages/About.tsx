import { motion } from "framer-motion";
import { Shield, Target, Eye, Award, Users, Globe } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Team } from "@/components/Team";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "We approach every engagement with a defense-in-depth mindset, ensuring comprehensive protection.",
  },
  {
    icon: Target,
    title: "Precision",
    description: "Our assessments are thorough and methodical, leaving no vulnerability uncovered.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Clear reporting and honest communication throughout every security assessment and audit.",
  },
];

const stats = [
  { icon: Users, value: "200+", label: "Security Assessments" },
  { icon: Globe, value: "50+", label: "Enterprise Clients" },
  { icon: Award, value: "10+", label: "Years Experience" },
  { icon: Shield, value: "100%", label: "Audit Success Rate" },
];

export default function About() {
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
                About Us
              </span>
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Defending the Digital{" "}
              <span className="text-gradient">Frontier</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Founded in 2010, Arica Tech Security has grown from a small
              consulting firm to a global leader in cybersecurity. Our mission
              is simple: protect businesses from evolving digital threats.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                data-testid={`stat-${index}`}
                className="rounded-xl p-6 border border-white/10 bg-card/50 text-center"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <p className="font-display text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden bg-card/30">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-4xl font-bold mb-6">
                From Humble Beginnings to{" "}
                <span className="text-gradient">Industry Leader</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Arica Tech Security was founded by the founding team with deep
                  backgrounds in offensive security and compliance, who recognized
                  the critical need for specialized security consulting services.
                </p>
                <p>
                  We specialize in Vulnerability Assessment and Penetration Testing
                  (VAPT), ISO compliance audits, and secure custom software development.
                  Our expertise helps organizations identify risks before attackers do.
                </p>
                <p>
                  Today, we partner with enterprises across industries to strengthen
                  their security posture through rigorous testing, comprehensive audits,
                  and building secure software from the ground up.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="rounded-xl p-6 border border-white/10 bg-card/80 col-span-2">
                <h3 className="font-display text-lg font-bold mb-2">
                  Our Mission
                </h3>
                <p className="text-sm text-muted-foreground">
                  To deliver expert security assessments, compliance guidance,
                  and secure software solutions that protect organizations.
                </p>
              </div>
              <div className="rounded-xl p-5 border border-white/10 bg-card/80">
                <h3 className="font-display font-bold mb-2">Vision</h3>
                <p className="text-xs text-muted-foreground">
                  A world where every business can operate securely in the
                  digital realm.
                </p>
              </div>
              <div className="rounded-xl p-5 border border-white/10 bg-card/80">
                <h3 className="font-display font-bold mb-2">Values</h3>
                <p className="text-xs text-muted-foreground">
                  Security first, precision, and transparency in every engagement.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold">
              What Drives <span className="text-gradient">Us</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-xl p-8 border border-white/10 bg-card/50 text-center"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-6">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Team />
      <CTA />
      <Footer />
    </div>
  );
}
