import { motion } from "framer-motion";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { TypewriterTestimonial } from "@/components/ui/typewriter-testimonial";

const teamMembers = [
  {
    quote: "Our mission is to protect businesses from evolving digital threats. Every vulnerability we find is one less attack vector for malicious actors.",
    name: "Dr. Arica Kumar",
    designation: "Founder & CEO - Former NSA Cybersecurity Analyst",
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop&crop=face",
  },
  {
    quote: "Security isn't just about technology—it's about building systems that are resilient by design. We bring that mindset to every project.",
    name: "James Wilson",
    designation: "Chief Technology Officer - Ex-Google Security Engineer",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop&crop=face",
  },
  {
    quote: "Digital forensics is like solving a puzzle. Every piece of evidence tells a story, and we're dedicated to uncovering the truth.",
    name: "Elena Rodriguez",
    designation: "Head of Forensics - FBI-trained Expert",
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop&crop=face",
  },
  {
    quote: "Navigating cyber regulations requires both legal expertise and technical understanding. We bridge that gap for our clients.",
    name: "David Chen",
    designation: "Legal Counsel - Cyber Law Specialist",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=face",
  },
];

const clientTestimonials = [
  {
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
    text: "Arica Tech uncovered critical vulnerabilities in our payment infrastructure that three previous auditors missed. Their VAPT methodology is truly world-class.",
    name: "Rajesh Mehta",
    jobtitle: "CTO, FinSecure Banking",
  },
  {
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face",
    text: "The ISO 27001 certification process was seamless with Arica Tech. They guided us from gap analysis to successful audit in under 6 months.",
    name: "Anand Sharma",
    jobtitle: "VP Engineering, CloudNova",
  },
  {
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=face",
    text: "Their penetration testing revealed attack vectors we never considered. The detailed remediation report helped us close every vulnerability within weeks.",
    name: "Vikram Patel",
    jobtitle: "CISO, MediGuard Health",
  },
  {
    image: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=200&h=200&fit=crop&crop=face",
    text: "Arica Tech's secure development practices transformed how our team writes code. Security is now baked into our SDLC from day one.",
    name: "Priya Desai",
    jobtitle: "Engineering Lead, TechShield",
  },
  {
    image: "https://images.unsplash.com/photo-1507003211169-0a6dd7228f2d?w=200&h=200&fit=crop&crop=face",
    text: "After a ransomware scare, Arica Tech helped us build a comprehensive incident response plan. We now have 24/7 monitoring and peace of mind.",
    name: "Suresh Kumar",
    jobtitle: "Director IT, Apex Manufacturing",
  },
  {
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    text: "The cloud security assessment by Arica Tech identified misconfigurations across our AWS and Azure environments that could have led to data breaches.",
    name: "Neha Joshi",
    jobtitle: "Cloud Architect, DataVault",
  },
  {
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=200&fit=crop&crop=face",
    text: "Their mobile app security testing caught injection vulnerabilities and insecure data storage before our product launch. Invaluable partnership.",
    name: "Arjun Nair",
    jobtitle: "Product Manager, SecureApp",
  },
  {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    text: "Working with Arica Tech on our compliance roadmap was exceptional. They made PCI-DSS and SOC 2 compliance achievable for our growing startup.",
    name: "Karan Singh",
    jobtitle: "CEO, PayGuard Solutions",
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
            World-class security professionals dedicated to protecting your
            digital assets.
          </p>
        </motion.div>

        <AnimatedTestimonials testimonials={teamMembers} autoplay />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-24 mb-10"
        >
          <span className="inline-block text-sm font-semibold text-[#42BA90] tracking-wider uppercase mb-4">
            Client Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            What Our <span className="text-gradient">Clients Say</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Hover over a profile to hear what our clients have to say about working with us.
          </p>
        </motion.div>

        <TypewriterTestimonial testimonials={clientTestimonials} />
      </div>
    </section>
  );
}
