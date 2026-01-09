import { motion } from "framer-motion";
import { Linkedin, Twitter } from "lucide-react";

const team = [
  {
    name: "Dr. Arica Kumar",
    role: "Founder & CEO",
    bio: "Former NSA cybersecurity analyst with 20+ years of experience protecting critical infrastructure.",
    initials: "AK",
  },
  {
    name: "James Wilson",
    role: "Chief Technology Officer",
    bio: "Ex-Google security engineer specializing in cloud infrastructure and zero-trust architecture.",
    initials: "JW",
  },
  {
    name: "Elena Rodriguez",
    role: "Head of Forensics",
    bio: "FBI-trained digital forensics expert with experience in high-profile cybercrime investigations.",
    initials: "ER",
  },
  {
    name: "David Chen",
    role: "Legal Counsel",
    bio: "Cyber law specialist helping organizations navigate complex regulatory requirements.",
    initials: "DC",
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
          className="text-center mb-20"
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              data-testid={`card-team-${index}`}
              className="group glass rounded-2xl p-6 text-center hover:bg-card/80 transition-all duration-500"
            >
              <div className="relative mb-6 mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30 group-hover:border-primary/50 transition-colors">
                  <span className="font-display text-2xl font-bold text-primary">
                    {member.initials}
                  </span>
                </div>
              </div>

              <h3 className="font-display text-xl font-bold mb-1">
                {member.name}
              </h3>
              <p className="text-primary text-sm font-medium mb-4">
                {member.role}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {member.bio}
              </p>

              <div className="flex items-center justify-center gap-3">
                <a
                  href="#"
                  className="p-2 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
