import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface TeamMember {
  firstName: string;
  lastName: string;
  role: string;
  location: string;
  image: string;
  secondaryImage: string;
  bio: string;
  expertise: string[];
}

const teamMembers: TeamMember[] = [
  {
    firstName: "Dr. Arica",
    lastName: "Kumar",
    role: "Founder & CEO",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop&crop=face",
    secondaryImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    bio: "Former NSA Cybersecurity Analyst with over 15 years of experience in offensive security. Founded Arica Tech to protect businesses from evolving digital threats. Every vulnerability we find is one less attack vector for malicious actors.",
    expertise: ["Penetration Testing", "Threat Intelligence", "Security Architecture"],
  },
  {
    firstName: "James",
    lastName: "Wilson",
    role: "Chief Technology Officer",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&crop=face",
    secondaryImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    bio: "Ex-Google Security Engineer who has built and scaled security systems for billions of users. Security isn't just about technology — it's about building systems that are resilient by design.",
    expertise: ["Cloud Security", "DevSecOps", "Secure Architecture"],
  },
  {
    firstName: "Elena",
    lastName: "Rodriguez",
    role: "Head of Forensics",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop&crop=face",
    secondaryImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
    bio: "FBI-trained digital forensics expert with a track record of solving complex cyber incidents. Digital forensics is like solving a puzzle — every piece of evidence tells a story.",
    expertise: ["Digital Forensics", "Incident Response", "Malware Analysis"],
  },
  {
    firstName: "David",
    lastName: "Chen",
    role: "Legal Counsel",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
    secondaryImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop",
    bio: "Cyber law specialist who bridges the gap between legal expertise and technical understanding. Navigating cyber regulations requires both perspectives to protect our clients effectively.",
    expertise: ["Cyber Law", "Compliance", "Data Privacy"],
  },
];

function TeamMemberRow({
  member,
  index,
  isExpanded,
  onToggle,
}: {
  member: TeamMember;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const rowRef = useRef<HTMLLIElement>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <li ref={rowRef} className="relative">
      <motion.button
        className="w-full text-center py-4 sm:py-6 md:py-8 cursor-pointer relative group"
        onClick={onToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        {/* First name - small text */}
        <span className="block text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground mb-1 font-medium">
          {member.firstName}
        </span>

        {/* Last name - large serif text */}
        <span
          className="block font-bold tracking-tight leading-none transition-colors duration-300"
          style={{
            fontFamily: "'Alfa Slab One', serif",
            fontSize: "clamp(2.5rem, 8vw, 8rem)",
            color: isHovered ? "hsl(var(--primary))" : "hsl(var(--foreground))",
          }}
        >
          {member.lastName.toUpperCase()}
        </span>

        {/* Role - small text to the right */}
        <span className="block text-xs sm:text-sm tracking-[0.15em] uppercase text-muted-foreground mt-1">
          {member.location}
        </span>

        {/* Hover images - left side */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute left-2 sm:left-8 md:left-16 top-1/2 -translate-y-1/2 pointer-events-none z-20 hidden md:block"
              initial={{ opacity: 0, x: -40, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="w-36 lg:w-48 h-48 lg:h-64 rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={member.image}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover images - right side */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute right-2 sm:right-8 md:right-16 top-1/2 -translate-y-1/2 pointer-events-none z-20 hidden md:block"
              initial={{ opacity: 0, x: 40, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
            >
              <div className="w-36 lg:w-48 h-48 lg:h-64 rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={member.secondaryImage}
                  alt={`${member.firstName} ${member.lastName} work`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-border"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
        />
      </motion.button>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="py-8 sm:py-12 px-4 sm:px-8 md:px-16 border-b border-border">
              <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_2fr] gap-8 md:gap-12">
                {/* Photo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden">
                    <img
                      src={member.image}
                      alt={`${member.firstName} ${member.lastName}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </motion.div>

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col justify-center"
                >
                  <h3 className="text-sm tracking-[0.2em] uppercase text-primary font-semibold mb-2">
                    {member.role}
                  </h3>
                  <h2
                    className="font-bold mb-6"
                    style={{
                      fontFamily: "'Alfa Slab One', serif",
                      fontSize: "clamp(1.5rem, 4vw, 3rem)",
                      lineHeight: 1.1,
                    }}
                  >
                    {member.firstName} {member.lastName}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-8 text-sm sm:text-base">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-1.5 rounded-full text-xs font-medium border border-primary/30 bg-primary/5 text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function TeamDirectors() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <Link href="/about">
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-4">
                  <ArrowLeft className="w-4 h-4" />
                  About
                </span>
              </Link>
              <h1
                className="mt-2"
                style={{
                  fontFamily: "'Alfa Slab One', serif",
                  fontSize: "clamp(1.5rem, 4vw, 3rem)",
                  lineHeight: 1.2,
                }}
              >
                Our Team
              </h1>
            </div>
            <span className="text-muted-foreground text-sm">
              ({teamMembers.length})
            </span>
          </motion.div>
        </div>

        {/* Team list */}
        <ul className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-border" />
          {teamMembers.map((member, index) => (
            <TeamMemberRow
              key={`${member.firstName}-${member.lastName}`}
              member={member}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}
