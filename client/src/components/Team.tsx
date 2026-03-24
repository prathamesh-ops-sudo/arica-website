import { motion } from "framer-motion";
import { TypewriterTestimonial } from "@/components/ui/typewriter-testimonial";

const teamIntros = [
  {
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    text: "Our mission is to protect businesses from evolving digital threats. Every vulnerability we find is one less attack vector for malicious actors.",
    name: "Dr. Arica Kumar",
    jobtitle: "Founder & CEO - Former NSA Cybersecurity Analyst",
  },
  {
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    text: "Security isn't just about technology—it's about building systems that are resilient by design. We bring that mindset to every project.",
    name: "James Wilson",
    jobtitle: "CTO - Ex-Google Security Engineer",
  },
  {
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    text: "Digital forensics is like solving a puzzle. Every piece of evidence tells a story, and we're dedicated to uncovering the truth.",
    name: "Elena Rodriguez",
    jobtitle: "Head of Forensics - FBI-trained Expert",
  },
  {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    text: "Navigating cyber regulations requires both legal expertise and technical understanding. We bridge that gap for our clients.",
    name: "David Chen",
    jobtitle: "Legal Counsel - Cyber Law Specialist",
  },
];

export function Team() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-sm font-semibold text-primary tracking-wider uppercase mb-4">
            Our Team
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Meet the <span className="text-gradient">Experts</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hover over a profile to learn about the people protecting your digital assets.
          </p>
        </motion.div>

        <TypewriterTestimonial testimonials={teamIntros} />
      </div>
    </section>
  );
}
