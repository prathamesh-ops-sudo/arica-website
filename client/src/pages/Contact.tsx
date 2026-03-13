import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Shield, Lock, Globe } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ContactForm } from "@/components/ContactForm";
import { useRef, useState, useEffect } from "react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "contact@aricatech.com",
    description: "We respond within 24 hours",
    isEmergency: false,
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 70911 75596",
    description: "Mon-Sat 9AM-6PM IST",
    isEmergency: false,
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Pune, Maharashtra, India",
    description: "Office no: 1204, CTS, 682/686 Kotibhaskar and Mahati Residency, Kothrud, 411038",
    isEmergency: false,
  },
  {
    icon: Clock,
    title: "Emergency",
    value: "+91 96510 39355",
    description: "24/7 Incident Response",
    isEmergency: true,
  },
];

const officeLocations = [
  { name: "Pune, India", x: 68, y: 45, isPrimary: true },
];

const floatingIcons = [
  { Icon: Mail, initialX: 10, initialY: 20, size: 24, delay: 0 },
  { Icon: Phone, initialX: 85, initialY: 15, size: 20, delay: 0.5 },
  { Icon: Shield, initialX: 90, initialY: 70, size: 28, delay: 1 },
  { Icon: Lock, initialX: 5, initialY: 75, size: 22, delay: 1.5 },
  { Icon: Globe, initialX: 50, initialY: 10, size: 26, delay: 2 },
  { Icon: MapPin, initialX: 75, initialY: 85, size: 20, delay: 2.5 },
];

function TiltCard({ children, className, isEmergency = false }: { children: React.ReactNode; className?: string; isEmergency?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${className} transition-shadow duration-300 relative ${
        isEmergency 
          ? 'hover:shadow-[0_0_30px_rgba(139,0,0,0.4)]' 
          : 'hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]'
      }`}
    >
      {children}
    </motion.div>
  );
}

function FloatingIcon({ Icon, initialX, initialY, size, delay, mousePosition }: { Icon: any; initialX: number; initialY: number; size: number; delay: number; mousePosition: { x: number; y: number } }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 0.15, 
        scale: 1,
        x: mousePosition.x * (1 + delay * 0.2),
        y: mousePosition.y * (1 + delay * 0.2),
      }}
      transition={{ 
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        x: { duration: 0.3, ease: "easeOut" },
        y: { duration: 0.3, ease: "easeOut" },
      }}
      className="absolute pointer-events-none text-primary/30"
      style={{ 
        left: `${initialX}%`, 
        top: `${initialY}%`,
      }}
    >
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ 
          duration: 4 + delay, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <Icon size={size} />
      </motion.div>
    </motion.div>
  );
}

function WorldMap() {
  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-white/10">
      <svg
        viewBox="0 0 100 50"
        className="w-full h-full opacity-40"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 212, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(0, 212, 255, 0.1)" />
          </linearGradient>
        </defs>
        <path
          d="M5,25 Q15,20 25,22 T45,20 Q55,18 65,22 T85,20 Q95,22 95,25"
          fill="none"
          stroke="url(#mapGradient)"
          strokeWidth="0.5"
        />
        <path
          d="M10,30 Q20,35 30,32 T50,35 Q60,38 70,32 T90,35"
          fill="none"
          stroke="url(#mapGradient)"
          strokeWidth="0.5"
        />
        <ellipse cx="20" cy="28" rx="8" ry="4" fill="rgba(0, 212, 255, 0.1)" />
        <ellipse cx="50" cy="32" rx="12" ry="5" fill="rgba(0, 212, 255, 0.08)" />
        <ellipse cx="75" cy="35" rx="10" ry="4" fill="rgba(0, 212, 255, 0.1)" />
        <ellipse cx="60" cy="25" rx="6" ry="3" fill="rgba(0, 212, 255, 0.08)" />
      </svg>
      
      {officeLocations.map((location, index) => (
        <motion.div
          key={location.name}
          className="absolute"
          style={{ left: `${location.x}%`, top: `${location.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
        >
          <div className="relative">
            <motion.div
              className={`w-3 h-3 rounded-full ${
                location.isPrimary ? 'bg-primary' : 'bg-primary/70'
              }`}
              animate={{
                boxShadow: [
                  `0 0 0 0 ${location.isPrimary ? 'rgba(0, 212, 255, 0.7)' : 'rgba(0, 212, 255, 0.4)'}`,
                  `0 0 0 8px ${location.isPrimary ? 'rgba(0, 212, 255, 0)' : 'rgba(0, 212, 255, 0)'}`,
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-primary/80 font-medium"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.2 }}
            >
              {location.name}
            </motion.div>
          </div>
        </motion.div>
      ))}
      
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

function GlowingIcon({ Icon, isEmergency = false }: { Icon: any; isEmergency?: boolean }) {
  return (
    <motion.div
      className={`p-2.5 rounded-lg relative ${
        isEmergency 
          ? 'bg-red-500/20 text-red-400' 
          : 'bg-primary/10 text-primary'
      }`}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg"
        animate={{
          boxShadow: isEmergency
            ? [
                '0 0 10px rgba(139, 0, 0, 0.3)',
                '0 0 20px rgba(139, 0, 0, 0.5)',
                '0 0 10px rgba(139, 0, 0, 0.3)',
              ]
            : [
                '0 0 10px rgba(0, 212, 255, 0.2)',
                '0 0 20px rgba(0, 212, 255, 0.4)',
                '0 0 10px rgba(0, 212, 255, 0.2)',
              ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <Icon className="w-5 h-5 relative z-10" />
    </motion.div>
  );
}

export default function Contact() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="min-h-screen bg-background aurora-bg">
      <Navbar />

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 212, 255, 0.12) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {floatingIcons.map((icon, index) => (
          <FloatingIcon key={index} {...icon} mousePosition={mousePosition} />
        ))}

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <motion.span 
                className="w-1.5 h-1.5 bg-primary rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs text-primary font-medium tracking-wider uppercase">
                Contact Us
              </span>
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Let's Secure Your{" "}
              <span className="text-gradient">Future</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to protect your business? Get in touch for a free security
              assessment.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <TiltCard
                  key={info.title}
                  isEmergency={info.isEmergency}
                  className={`rounded-xl p-5 border cursor-pointer ${
                    info.isEmergency 
                      ? 'border-red-500/30 bg-red-500/10' 
                      : 'border-white/10 bg-card/50 hover:border-primary/30'
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    data-testid={`contact-info-${index}`}
                    className="flex items-start gap-4"
                  >
                    <GlowingIcon Icon={info.icon} isEmergency={info.isEmergency} />
                    <div>
                      <p className="font-semibold text-sm mb-0.5 text-halo-white">{info.title}</p>
                      <p className={`text-sm font-medium ${info.isEmergency ? 'text-red-400' : 'text-primary'}`}>{info.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {info.description}
                      </p>
                    </div>
                  </motion.div>
                  
                  {info.isEmergency && (
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(139, 0, 0, 0.2), inset 0 0 20px rgba(139, 0, 0, 0.05)',
                          '0 0 40px rgba(139, 0, 0, 0.4), inset 0 0 30px rgba(139, 0, 0, 0.1)',
                          '0 0 20px rgba(139, 0, 0, 0.2), inset 0 0 20px rgba(139, 0, 0, 0.05)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </TiltCard>
              ))}

              <TiltCard className="rounded-xl p-5 border border-white/10 bg-card/50 hover:border-primary/30">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="font-display font-bold mb-4">
                    Global Offices
                  </h3>
                  <WorldMap />
                </motion.div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
