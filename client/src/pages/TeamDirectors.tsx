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
  bio: string;
  expertise: string[];
  certifications?: string[];
}

const teamMembers: TeamMember[] = [
  {
    firstName: "Chitra",
    lastName: "Mete",
    role: "Managing Partner",
    location: "Pune",
    image: "/team/chitra-mete.jpg",
    bio: "Brings 26+ years of experience in integrated communication across social impact, government, and corporate sectors. With expertise in advertising and visual communication, she has led campaigns for UNICEF, WHO, Tata Trusts, and state bodies, driving change in public health, gender equity, road safety, and civic participation. A strategic leader, she blends creative direction, research, and narrative design to deliver impactful, culturally resonant work.",
    expertise: ["Brand & Marketing Strategy", "Digital & Data-Led Growth", "Market Expansion & Operating Model Design", "Customer Engagement & Retention"],
    certifications: [],
  },
  {
    firstName: "Sahil",
    lastName: "Phadnis",
    role: "Managing Partner",
    location: "Pune",
    image: "/team/sahil-phadnis.jpg",
    bio: "A business strategist with deep operational expertise, focused on driving brand-led, data-driven growth. Works at the intersection of strategy, execution, and customer insight to build scalable growth programs. At Zomato, played a key role in revenue growth, market expansion, and operational scale across multiple regions. Aligns brand positioning with long-term commercial impact.",
    expertise: ["B2B Partnerships & Revenue Strategy", "Digital & Data-Led Growth", "Market Expansion & Operating Model Design", "Customer Engagement & Retention Programs"],
    certifications: [],
  },
  {
    firstName: "Siddhant",
    lastName: "Malegaonkar",
    role: "Criminal Law Advocate",
    location: "Pune",
    image: "/team/siddhant-malegaonkar.jpg",
    bio: "A Pune-based practicing advocate specialising in cyber law, information technology law, and digital crimes. With grounding in traditional litigation and a strong focus on technology-driven disputes, he advises and represents clients across cybercrime litigation, digital compliance, and data protection matters in an increasingly digital legal environment.",
    expertise: ["Cybercrime & Digital Offences Litigation", "IT Act Compliance & Advisory", "Data Protection & Privacy Advisory", "Digital Evidence & Technology Risk"],
    certifications: [],
  },
  {
    firstName: "H. B.",
    lastName: "Keshava",
    role: "CEO & Managing Partner",
    location: "Pune",
    image: "/team/hb-keshava.jpg",
    bio: "Leads Arica Tech Security LLP with expertise across cybersecurity governance, cyber law, and digital risk management. Actively engaged with leading universities as an educator in cyber law, data protection, and digital ethics. Advises organisations on cybersecurity compliance, cybercrime response, forensic documentation, and regulation-aligned security frameworks. Honoured at IP Gorilla Conference, Singapore. Featured in Forbes India 2026.",
    expertise: ["Cyber Law & IT Act Compliance", "Data Protection & Privacy Governance", "ISO 27001 Audits & Security Governance", "Cyber Incident & Forensic Documentation"],
    certifications: ["PHD", "PGDCS", "ISO 27001 Information Security Lead Auditor", "ISO 9001 Lead Auditor"],
  },
  {
    firstName: "Kunal",
    lastName: "Dhonge",
    role: "Chief Operations Officer",
    location: "Pune",
    image: "/team/kunal-dhonge.jpg",
    bio: "Brings hands-on expertise in cybercrime investigation, digital forensics, and incident response. Has supported police departments and corporate investigations across fraud, phishing, ransomware, and data breach cases, with a focus on evidence integrity, forensic reporting, and post-incident security improvement. Trained 200+ professionals and students in cybersecurity.",
    expertise: ["Cybercrime Investigation & Digital Forensics", "Incident Response & Threat Mitigation", "Disk Imaging & Evidence Handling", "Cyber Audit & Security Documentation"],
    certifications: ["Certified Ethical Hacker", "Certified Cyber Crime Investigator & Forensic Expert", "ISO 27001 Lead Auditor", "ISO 27017 Lead Auditor"],
  },
  {
    firstName: "Uttakarsh",
    lastName: "Mattikop",
    role: "Lead Consultant",
    location: "Pune",
    image: "/team/uttakarsh-mattikop.jpg",
    bio: "A technology-focused consultant specialising in cyber law, data protection, and cybersecurity governance. Actively involved in academia, teaching cyber law, AI & law, and technology governance at leading universities. Supports organisations with ISO 27001 alignment, regulatory compliance, cyber risk advisory, and incident-response documentation. Founder of Exordium Alliances (AI & Cyber Law education).",
    expertise: ["Cyber Law & IT Act Compliance", "Data Protection & Privacy Frameworks", "ISO 27001 Audits & Documentation", "Cyber Risk & Incident Advisory"],
    certifications: ["ISO 27001:2022 Information Security Lead Implementer & Advisor"],
  },
  {
    firstName: "K.",
    lastName: "Shhyamsundar",
    role: "Business Development Officer",
    location: "Pune",
    image: "/team/k-shhyamsundar.jpg",
    bio: "Drives business development and strategic partnerships, working closely with leadership and delivery teams. Brings experience in vendor management, contract negotiation, market intelligence, and operational alignment to support scalable and compliant growth. Led high-value negotiations across enterprise environments and built scalable partner ecosystems.",
    expertise: ["Strategic Partnerships & Client Development", "Contract Negotiation & Deal Structuring", "Market Intelligence & Opportunity Assessment", "Operational Strategy & Governance"],
    certifications: ["Information Technology", "Business Strategist & Advisor"],
  },
  {
    firstName: "Prathamesh",
    lastName: "Dabir",
    role: "Associate | Security Operations & Threat Intelligence",
    location: "Pune",
    image: "/team/prathamesh-dabir.jpg",
    bio: "Works across security operations, threat hunting, and detection engineering to strengthen proactive defence and SOC efficiency. Experienced with SIEM platforms, endpoint monitoring, cloud security, and automation-led workflows. Actively involved in cybersecurity research and technical community initiatives. Top 13 in India on TryHackMe. Speaker at TryHackMe Pune Chapter.",
    expertise: ["Threat Hunting & Detection Engineering", "SIEM & Endpoint Monitoring", "Incident Response & Log Correlation", "Vulnerability Assessment & Pentesting"],
    certifications: ["Certified Ethical Hacking", "Neo4j Certified Professional", "Cyber Security Analyst", "ISO 27001 Lead Auditor", "ISO 27017 Lead Auditor"],
  },
  {
    firstName: "Bhargav",
    lastName: "Iyer",
    role: "Associate | Cyber Law & Data Protection",
    location: "Pune",
    image: "/team/bhargav-iyer.jpg",
    bio: "Supports Arica\u2019s cyber-legal and compliance practice with a focus on data protection, platform governance, and technology documentation. Assists in drafting privacy policies, platform terms, IT contracts, and compliance frameworks for digital platforms and SaaS organisations. Certified in GDPR & Technology Law.",
    expertise: ["Cyber Law & Digital Regulation", "Data Protection & Privacy Compliance", "Platform Policies & IT Contracts", "Cyber Incident Documentation Support"],
    certifications: ["ISO 27001:2022 Lead Implementor", "Lead Auditor", "Certified in GDPR & Technology Law"],
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
  return (
    <li className="relative">
      <motion.button
        className="w-full text-left py-6 sm:py-8 md:py-10 cursor-pointer relative group"
        onClick={onToggle}
        aria-expanded={isExpanded}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        {/* Full name - single line */}
        <span
          className="block font-bold tracking-tight leading-none transition-colors duration-300"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.2rem, 4vw, 5rem)",
            color: isExpanded ? "hsl(var(--primary))" : "hsl(var(--foreground))",
          }}
        >
          {member.firstName.toUpperCase()} {member.lastName.toUpperCase()}
        </span>

        {/* Role - small text below */}
        <span className="block text-xs sm:text-sm tracking-[0.15em] uppercase text-muted-foreground mt-2">
          {member.role}
        </span>

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
                  {member.certifications && member.certifications.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-semibold mb-3">
                        Certifications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {member.certifications.map((cert) => (
                          <span
                            key={cert}
                            className="px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-muted-foreground"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
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
                Meet Our Team
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
