import { useState, useCallback } from "react";
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
    firstName: "H. B.",
    lastName: "Keshava",
    role: "CEO & Managing Partner",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop&crop=face",
    secondaryImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    bio: "Leads Arica Tech Security LLP with expertise across cybersecurity governance, cyber law, and digital risk management. Actively engaged with leading universities as an educator in cyber law, data protection, and digital ethics. Advises organisations on cybersecurity compliance, cybercrime response, forensic documentation, and regulation-aligned security frameworks. Honoured at IP Gorilla Conference, Singapore. Featured in Forbes India 2026.",
    expertise: ["Cyber Law & IT Act Compliance", "Data Protection & Privacy Governance", "ISO 27001 Audits & Security Governance", "Cyber Incident & Forensic Documentation"],
  },
  {
    firstName: "Chitra",
    lastName: "Mete",
    role: "Managing Partner",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop&crop=face",
    secondaryImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    bio: "Brings 26+ years of experience in integrated communication across social impact, government, and corporate sectors. With expertise in advertising and visual communication, she has led campaigns for UNICEF, WHO, Tata Trusts, and state bodies, driving change in public health, gender equity, road safety, and civic participation. A strategic leader, she blends creative direction, research, and narrative design to deliver impactful, culturally resonant work.",
    expertise: ["Brand & Marketing Strategy", "Digital & Data-Led Growth", "Market Expansion & Operating Model Design", "Customer Engagement & Retention"],
  },
  {
    firstName: "Sahil",
    lastName: "Phadnis",
    role: "Managing Partner",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&crop=face",
    secondaryImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    bio: "A business strategist with deep operational expertise, focused on driving brand-led, data-driven growth. Works at the intersection of strategy, execution, and customer insight to build scalable growth programs. At Zomato, played a key role in revenue growth, market expansion, and operational scale across multiple regions. Aligns brand positioning with long-term commercial impact.",
    expertise: ["B2B Partnerships & Revenue Strategy", "Digital & Data-Led Growth", "Market Expansion & Operating Model Design", "Customer Engagement & Retention Programs"],
  },
  {
    firstName: "Siddhant",
    lastName: "Malegaonkar",
    role: "Criminal Law Advocate",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
    secondaryImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop",
    bio: "A Pune-based practicing advocate specialising in cyber law, information technology law, and digital crimes. With grounding in traditional litigation and a strong focus on technology-driven disputes, he advises and represents clients across cybercrime litigation, digital compliance, and data protection matters in an increasingly digital legal environment.",
    expertise: ["Cybercrime & Digital Offences Litigation", "IT Act Compliance & Advisory", "Data Protection & Privacy Advisory", "Digital Evidence & Technology Risk"],
  },
  {
    firstName: "Kunal",
    lastName: "Dhonge",
    role: "Chief Operations Officer",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop&crop=face",
    secondaryImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
    bio: "Brings hands-on expertise in cybercrime investigation, digital forensics, and incident response. Has supported police departments and corporate investigations across fraud, phishing, ransomware, and data breach cases, with a focus on evidence integrity, forensic reporting, and post-incident security improvement. Trained 200+ professionals and students in cybersecurity.",
    expertise: ["Cybercrime Investigation & Digital Forensics", "Incident Response & Threat Mitigation", "Disk Imaging & Evidence Handling", "Cyber Audit & Security Documentation"],
  },
  {
    firstName: "Uttakarsh Manoj",
    lastName: "Mattikop",
    role: "Lead Consultant",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face",
    secondaryImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
    bio: "A technology-focused consultant specialising in cyber law, data protection, and cybersecurity governance. Actively involved in academia, teaching cyber law, AI & law, and technology governance at leading universities. Supports organisations with ISO 27001 alignment, regulatory compliance, cyber risk advisory, and incident-response documentation. Founder of Exordium Alliances (AI & Cyber Law education).",
    expertise: ["Cyber Law & IT Act Compliance", "Data Protection & Privacy Frameworks", "ISO 27001 Audits & Documentation", "Cyber Risk & Incident Advisory"],
  },
  {
    firstName: "K.",
    lastName: "Shhyamsundar",
    role: "Business Development Officer",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop&crop=face",
    secondaryImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
    bio: "Drives business development and strategic partnerships, working closely with leadership and delivery teams. Brings experience in vendor management, contract negotiation, market intelligence, and operational alignment to support scalable and compliant growth. Led high-value negotiations across enterprise environments and built scalable partner ecosystems.",
    expertise: ["Strategic Partnerships & Client Development", "Contract Negotiation & Deal Structuring", "Market Intelligence & Opportunity Assessment", "Operational Strategy & Governance"],
  },
  {
    firstName: "Prathamesh",
    lastName: "Dabir",
    role: "Associate | Security Operations & Threat Intelligence",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=600&h=800&fit=crop&crop=face",
    secondaryImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop",
    bio: "Works across security operations, threat hunting, and detection engineering to strengthen proactive defence and SOC efficiency. Experienced with SIEM platforms, endpoint monitoring, cloud security, and automation-led workflows. Actively involved in cybersecurity research and technical community initiatives. Top 13 in India on TryHackMe. Speaker at TryHackMe Pune Chapter.",
    expertise: ["Threat Hunting & Detection Engineering", "SIEM & Endpoint Monitoring", "Incident Response & Log Correlation", "Vulnerability Assessment & Pentesting"],
  },
  {
    firstName: "Bhargav",
    lastName: "Iyer",
    role: "Associate | Cyber Law & Data Protection",
    location: "Pune",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop&crop=face",
    secondaryImage: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&h=400&fit=crop",
    bio: "Supports Arica\u2019s cyber-legal and compliance practice with a focus on data protection, platform governance, and technology documentation. Assists in drafting privacy policies, platform terms, IT contracts, and compliance frameworks for digital platforms and SaaS organisations. Certified in GDPR & Technology Law.",
    expertise: ["Cyber Law & Digital Regulation", "Data Protection & Privacy Compliance", "Platform Policies & IT Contracts", "Cyber Incident Documentation Support"],
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

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <li className="relative">
      <motion.button
        className="w-full text-center py-4 sm:py-6 md:py-8 cursor-pointer relative group"
        onClick={onToggle}
        aria-expanded={isExpanded}
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
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2.5rem, 8vw, 8rem)",
            color: isHovered ? "hsl(var(--primary))" : "hsl(var(--foreground))",
          }}
        >
          {member.lastName.toUpperCase()}
        </span>

        {/* Role - small text below */}
        <span className="block text-xs sm:text-sm tracking-[0.15em] uppercase text-muted-foreground mt-1">
          {member.role}
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
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 900,
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
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 900,
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
