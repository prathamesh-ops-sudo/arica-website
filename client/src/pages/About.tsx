import { motion } from "framer-motion";
import { Shield, Target, Eye, Award, Users, Globe } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Team } from "@/components/Team";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description: "We operate with the highest ethical standards, ensuring trust in every interaction.",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "We deliver world-class security solutions that exceed client expectations.",
  },
  {
    icon: Eye,
    title: "Vigilance",
    description: "24/7 monitoring and proactive threat detection to stay ahead of adversaries.",
  },
];

const stats = [
  { icon: Users, value: "500+", label: "Clients Protected" },
  { icon: Globe, value: "30+", label: "Countries Served" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: Shield, value: "99.9%", label: "Threat Detection" },
];

export default function About() {
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
              About Us
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

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                data-testid={`stat-${index}`}
                className="glass rounded-2xl p-8 text-center"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <p className="font-display text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-4">
                Our Story
              </span>
              <h2 className="font-display text-4xl font-bold mb-6">
                From Humble Beginnings to{" "}
                <span className="text-gradient">Industry Leader</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Arica Tech Security was founded by Dr. Arica Kumar, a former
                  NSA analyst who saw the growing gap between evolving cyber
                  threats and the security capabilities of most organizations.
                </p>
                <p>
                  Starting with just a small team of security experts, we've
                  grown to serve over 500 clients worldwide, from startups to
                  Fortune 500 companies and government agencies.
                </p>
                <p>
                  Today, we're at the forefront of cybersecurity innovation,
                  combining cutting-edge technology with deep expertise to
                  deliver comprehensive protection for the digital age.
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
              <div className="glass rounded-2xl p-6 col-span-2">
                <h3 className="font-display text-xl font-bold mb-2">
                  Our Mission
                </h3>
                <p className="text-muted-foreground">
                  To empower organizations with robust cybersecurity solutions
                  that protect their assets, reputation, and future.
                </p>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-xl font-bold mb-2">Vision</h3>
                <p className="text-sm text-muted-foreground">
                  A world where every business can operate securely in the
                  digital realm.
                </p>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-xl font-bold mb-2">Values</h3>
                <p className="text-sm text-muted-foreground">
                  Integrity, excellence, and vigilance in everything we do.
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
            <span className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-4">
              Our Values
            </span>
            <h2 className="font-display text-4xl font-bold">
              What Drives <span className="text-gradient">Us</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="glass rounded-2xl p-8 text-center"
              >
                <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-6">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
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
