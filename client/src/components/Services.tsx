import { motion } from "framer-motion";
import { Link } from "wouter";
import { Shield, Scale, Code, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Shield,
    title: "VAPT Services",
    description:
      "Comprehensive Vulnerability Assessment and Penetration Testing to identify security weaknesses before attackers do. Our certified experts simulate real-world attacks to strengthen your defenses.",
    features: ["Network Penetration Testing", "Web Application Security", "Mobile App Assessment"],
    color: "primary",
  },
  {
    icon: Scale,
    title: "ISO Audit",
    description:
      "Expert ISO 27001 audit and certification services to ensure your organization meets international information security standards and regulatory requirements.",
    features: ["Gap Analysis", "Documentation Review", "Certification Support"],
    color: "accent",
  },
  {
    icon: Code,
    title: "Custom Software Development",
    description:
      "Secure-by-design software solutions built with security at the core. From web applications to enterprise systems, we develop with best security practices.",
    features: ["Secure Code Development", "Security Architecture", "DevSecOps Integration"],
    color: "primary",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Services() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-4">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Comprehensive Security{" "}
            <span className="text-gradient">Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From security testing to compliance audits, we provide specialized
            cybersecurity and software development services for your business.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={item}
              data-testid={`card-service-${index}`}
              className="group relative glass rounded-2xl p-8 hover:bg-card/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20"
              whileHover={{ y: -4 }}
            >
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  service.color === "primary" ? "glow-cyan" : "glow-purple"
                }`}
                style={{ background: "transparent" }}
              />

              <div className="relative z-10">
                <div
                  className={`inline-flex p-4 rounded-xl mb-6 ${
                    service.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  <service.icon className="w-8 h-8" />
                </div>

                <h3 className="font-display text-2xl font-bold mb-4 group-hover:text-gradient transition-all">
                  {service.title}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          service.color === "primary"
                            ? "bg-primary"
                            : "bg-accent"
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/services">
                  <Button
                    variant="ghost"
                    className="group/btn p-0 h-auto font-semibold text-primary hover:bg-transparent"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
