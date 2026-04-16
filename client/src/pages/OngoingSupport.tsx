import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowLeft, Shield, Clock, Activity, AlertTriangle, CheckCircle,
  Phone, Mail, Headphones, FileText, TrendingUp, Zap, Eye, 
  RefreshCw, Calendar, MessageSquare, Server, Globe2, Lock,
  XCircle, AlertOctagon, ChevronDown, ChevronUp, Wifi, Database,
  Cloud, Terminal, Bug, ShieldCheck, ShieldAlert, Radio
} from 'lucide-react';
import { WebGLFallback } from '@/components/ui/webgl-fallback';

const NEUTRAL_LIGHT = '#e5e5e5';
const NEUTRAL_MID = '#ACACAC';
const NEUTRAL_DARK = '#1C2C5A';
const ACCENT_BLUE = '#42BA90';
const NAVY = 'hsl(222, 47%, 5%)';
const GREEN = '#42BA90';
const RED = '#FF4444';
const YELLOW = '#FFD93D';
const PURPLE = '#3D70B7';

const supportServices = [
  {
    id: 1,
    name: '24/7 Monitoring & Response',
    icon: Eye,
    sla: '< 15 min response',
    description: 'Round-the-clock security monitoring with immediate threat response',
    status: 'active',
    contactOptions: ['phone', 'email', 'chat'],
    details: [
      'Real-time threat detection and alerting',
      'Automated incident classification',
      'Human analyst escalation protocols',
      'Custom alert thresholds and rules'
    ],
    stats: { eventsProcessed: 1247893, avgResponseTime: '4.2 min' }
  },
  {
    id: 2,
    name: 'Patch Management',
    icon: RefreshCw,
    sla: 'Critical: 24h, High: 72h',
    description: 'Automated vulnerability patching and update management',
    status: 'active',
    contactOptions: ['email', 'portal'],
    details: [
      'Zero-day vulnerability tracking',
      'Staged rollout with rollback capability',
      'Compliance-aware patch scheduling',
      'Emergency patching protocols'
    ],
    stats: { patchesDeployed: 3421, successRate: '99.8%' }
  },
  {
    id: 3,
    name: 'Threat Intelligence Updates',
    icon: AlertTriangle,
    sla: 'Real-time feeds',
    description: 'Continuous threat intelligence and early warning alerts',
    status: 'active',
    contactOptions: ['email', 'portal'],
    details: [
      'Global threat actor tracking',
      'Industry-specific threat briefings',
      'IOC (Indicators of Compromise) feeds',
      'Predictive threat modeling'
    ],
    stats: { feedsSources: 47, threatsIdentified: 892 }
  },
  {
    id: 4,
    name: 'Security Advisory Services',
    icon: FileText,
    sla: '4h consultation',
    description: 'Expert security guidance and strategic consulting',
    status: 'active',
    contactOptions: ['phone', 'email', 'chat'],
    details: [
      'On-demand security architecture review',
      'Compliance gap analysis',
      'Security roadmap development',
      'Executive risk briefings'
    ],
    stats: { consultationsCompleted: 234, clientSatisfaction: '4.9/5' }
  },
  {
    id: 5,
    name: 'Quarterly Security Reviews',
    icon: Calendar,
    sla: 'Scheduled quarterly',
    description: 'Comprehensive security posture assessments and reporting',
    status: 'scheduled',
    contactOptions: ['email', 'portal'],
    details: [
      'Full infrastructure security audit',
      'Penetration testing summary',
      'Compliance status reporting',
      'Strategic recommendations'
    ],
    stats: { reviewsCompleted: 156, issuesIdentified: 423 }
  },
  {
    id: 6,
    name: 'Emergency Incident Response',
    icon: Zap,
    sla: '< 5 min activation',
    description: 'Rapid incident containment and forensic investigation',
    status: 'standby',
    contactOptions: ['phone', 'hotline'],
    details: [
      'Instant response team mobilization',
      'Containment and eradication protocols',
      'Digital forensics and evidence preservation',
      'Post-incident analysis and hardening'
    ],
    stats: { incidentsHandled: 89, avgContainmentTime: '23 min' }
  },
];

const securityEventTypes = [
  { type: 'BLOCKED', icon: ShieldCheck, color: GREEN, messages: [
    'Blocked SQL injection attempt from',
    'Prevented brute force attack from',
    'Blocked malware download attempt from',
    'Stopped DDoS attack targeting',
    'Blocked unauthorized API access from'
  ]},
  { type: 'DETECTED', icon: AlertTriangle, color: YELLOW, messages: [
    'Suspicious login pattern detected from',
    'Anomalous network traffic detected from',
    'Potential phishing attempt detected from',
    'Unusual file access pattern from',
    'Port scanning detected from'
  ]},
  { type: 'MITIGATED', icon: Shield, color: ACCENT_BLUE, messages: [
    'Zero-day vulnerability patched on',
    'Ransomware attempt neutralized on',
    'Data exfiltration blocked on',
    'Privilege escalation prevented on',
    'Command injection mitigated on'
  ]},
  { type: 'RESOLVED', icon: CheckCircle, color: GREEN, messages: [
    'Incident #IR-2847 resolved for',
    'Security alert cleared for',
    'Threat eliminated on',
    'System restored for',
    'Access restored after verification for'
  ]}
];

const systemStatuses = [
  { name: 'Firewall', icon: Shield, status: 'operational' },
  { name: 'SIEM', icon: Terminal, status: 'operational' },
  { name: 'EDR', icon: Bug, status: 'operational' },
  { name: 'Network', icon: Wifi, status: 'operational' },
  { name: 'Database', icon: Database, status: 'operational' },
  { name: 'Cloud', icon: Cloud, status: 'operational' },
  { name: 'API Gateway', icon: Globe2, status: 'degraded' },
  { name: 'Backup', icon: Server, status: 'operational' }
];

function generateRandomIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function generateSecurityEvent() {
  const eventType = securityEventTypes[Math.floor(Math.random() * securityEventTypes.length)];
  const message = eventType.messages[Math.floor(Math.random() * eventType.messages.length)];
  const targets = ['192.168.1.', '10.0.0.', '172.16.0.', 'server-', 'endpoint-', 'client-'];
  const target = Math.random() > 0.5 ? generateRandomIP() : `${targets[Math.floor(Math.random() * targets.length)]}${Math.floor(Math.random() * 255)}`;
  
  return {
    id: Date.now() + Math.random(),
    type: eventType.type,
    icon: eventType.icon,
    color: eventType.color,
    message: `${message} ${target}`,
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
  };
}


function HolographicScreen({ position, rotation, size, color, pulseSpeed = 1 }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number];
  color: string;
  pulseSpeed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const borderRef = useRef<THREE.LineSegments>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.15 + Math.sin(clock.getElapsedTime() * pulseSpeed) * 0.05;
    }
    if (borderRef.current) {
      const material = borderRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.6 + Math.sin(clock.getElapsedTime() * pulseSpeed * 1.5) * 0.3;
    }
  });

  const borderGeometry = useMemo(() => {
    const [w, h] = size;
    const points = [
      new THREE.Vector3(-w/2, -h/2, 0),
      new THREE.Vector3(w/2, -h/2, 0),
      new THREE.Vector3(w/2, h/2, 0),
      new THREE.Vector3(-w/2, h/2, 0),
      new THREE.Vector3(-w/2, -h/2, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [size]);

  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      <mesh ref={meshRef}>
        <planeGeometry args={size} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments ref={borderRef} geometry={borderGeometry}>
        <lineBasicMaterial color={color} transparent opacity={0.8} />
      </lineSegments>
    </group>
  );
}

function DataStream({ start, end, color, speed = 1 }: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const particleCount = 20;
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      positions[i * 3] = start[0] + (end[0] - start[0]) * t;
      positions[i * 3 + 1] = start[1] + (end[1] - start[1]) * t;
      positions[i * 3 + 2] = start[2] + (end[2] - start[2]) * t;
      velocities[i] = Math.random() * 0.5 + 0.5;
    }
    
    return { positions, velocities };
  }, [start, end]);

  useFrame(({ clock }) => {
    if (ref.current) {
      const posArray = ref.current.geometry.attributes.position.array as Float32Array;
      const time = clock.getElapsedTime() * speed;
      
      for (let i = 0; i < particleCount; i++) {
        const t = ((time * velocities[i] + i / particleCount) % 1);
        posArray[i * 3] = start[0] + (end[0] - start[0]) * t;
        posArray[i * 3 + 1] = start[1] + (end[1] - start[1]) * t;
        posArray[i * 3 + 2] = start[2] + (end[2] - start[2]) * t;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color={color} size={0.08} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function CentralGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const indicatorsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (globeRef.current) {
      globeRef.current.rotation.y = time * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.3;
      ringRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }
    if (pulseRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.1;
      pulseRef.current.scale.set(scale, scale, scale);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 - Math.sin(time * 2) * 0.15;
    }
    if (indicatorsRef.current) {
      indicatorsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const pulse = Math.sin(time * 3 + i * 1.5) * 0.5 + 0.5;
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.5 + pulse * 0.5;
        mesh.scale.setScalar(0.08 + pulse * 0.04);
      });
    }
  });

  const indicatorPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < 12; i++) {
      const phi = Math.acos(-1 + (2 * i) / 12);
      const theta = Math.sqrt(12 * Math.PI) * phi;
      positions.push(new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi) * 1.1,
        Math.sin(theta) * Math.sin(phi) * 1.1,
        Math.cos(phi) * 1.1
      ));
    }
    return positions;
  }, []);

  return (
    <group>
      <mesh ref={globeRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={NEUTRAL_MID} wireframe transparent opacity={0.3} />
      </mesh>
      
      <mesh ref={pulseRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color={ACCENT_BLUE} transparent opacity={0.2} />
      </mesh>
      
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshBasicMaterial color={ACCENT_BLUE} transparent opacity={0.6} />
      </mesh>
      
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.7, 0.015, 16, 100]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.4} />
      </mesh>
      
      <group ref={indicatorsRef}>
        {indicatorPositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={i % 3 === 0 ? '#ff4444' : GREEN} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function AlertIndicator({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const flashInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 500);
      }
    }, 3000);
    return () => clearInterval(flashInterval);
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const material = ref.current.material as THREE.MeshBasicMaterial;
      if (isFlashing) {
        material.opacity = Math.sin(clock.getElapsedTime() * 20) * 0.5 + 0.5;
        material.color.setHex(0xff4444);
      } else {
        material.opacity = 0.6 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
        material.color.setHex(0x00ff88);
      }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.15]} />
      <meshBasicMaterial color={GREEN} transparent opacity={0.6} />
    </mesh>
  );
}

function CommandCenterScene() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <CentralGlobe />
      </Float>
      
      <HolographicScreen position={[-4, 2, -2]} rotation={[0, 0.3, 0]} size={[2, 1.5]} color={ACCENT_BLUE} />
      <HolographicScreen position={[4, 2, -2]} rotation={[0, -0.3, 0]} size={[2, 1.5]} color={ACCENT_BLUE} />
      <HolographicScreen position={[-3, -1, -1]} rotation={[0.2, 0.2, 0]} size={[1.5, 1]} color={GREEN} pulseSpeed={1.5} />
      <HolographicScreen position={[3, -1, -1]} rotation={[0.2, -0.2, 0]} size={[1.5, 1]} color={GREEN} pulseSpeed={1.5} />
      <HolographicScreen position={[0, 3, -3]} rotation={[-0.2, 0, 0]} size={[3, 1.5]} color={ACCENT_BLUE} pulseSpeed={0.8} />
      <HolographicScreen position={[-5, 0, 0]} rotation={[0, 0.5, 0]} size={[1.2, 2]} color="#3D70B7" pulseSpeed={1.2} />
      <HolographicScreen position={[5, 0, 0]} rotation={[0, -0.5, 0]} size={[1.2, 2]} color="#3D70B7" pulseSpeed={1.2} />
      
      <DataStream start={[-4, 2, -2]} end={[0, 0, 0]} color={ACCENT_BLUE} speed={1.5} />
      <DataStream start={[4, 2, -2]} end={[0, 0, 0]} color={ACCENT_BLUE} speed={1.5} />
      <DataStream start={[0, 3, -3]} end={[0, 0, 0]} color={ACCENT_BLUE} speed={1.2} />
      <DataStream start={[-5, 0, 0]} end={[-3, -1, -1]} color="#3D70B7" speed={1} />
      <DataStream start={[5, 0, 0]} end={[3, -1, -1]} color="#3D70B7" speed={1} />
      <DataStream start={[-3, -1, -1]} end={[0, 0, 0]} color={GREEN} speed={0.8} />
      <DataStream start={[3, -1, -1]} end={[0, 0, 0]} color={GREEN} speed={0.8} />
      
      <AlertIndicator position={[-4.5, 2.8, -2]} />
      <AlertIndicator position={[4.5, 2.8, -2]} />
      <AlertIndicator position={[0, 4, -3]} />
      <AlertIndicator position={[-2, 0, 1]} />
      <AlertIndicator position={[2, 0, 1]} />
    </>
  );
}

function GlowingMetricCard({ 
  icon: Icon, 
  value, 
  label, 
  color, 
  glowColor,
  children 
}: { 
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; 
  value: React.ReactNode; 
  label: string; 
  color: string;
  glowColor: string;
  children?: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative bg-[#000a15]/80 backdrop-blur-sm border border-[#3D70B7]/20 rounded-xl p-6 text-center overflow-hidden group cursor-pointer"
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor}20 0%, transparent 70%)`,
        }}
      />
      
      <motion.div
        className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor}40, transparent)`,
          filter: 'blur(8px)',
        }}
        animate={isHovered ? {
          x: ['-100%', '100%'],
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      <div className="relative z-10">
        <motion.div
          animate={{
            filter: isHovered ? [`drop-shadow(0 0 8px ${glowColor})`, `drop-shadow(0 0 20px ${glowColor})`, `drop-shadow(0 0 8px ${glowColor})`] : 'none',
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Icon className={`w-8 h-8 mx-auto mb-3`} style={{ color }} />
        </motion.div>
        
        <motion.div 
          className="text-3xl md:text-4xl font-bold mb-1"
          style={{ color }}
          animate={isHovered ? {
            textShadow: [`0 0 10px ${glowColor}`, `0 0 30px ${glowColor}`, `0 0 10px ${glowColor}`]
          } : {}}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          {children || value}
        </motion.div>
        
        <div className="text-xs text-[#3D70B7]/60 font-mono uppercase tracking-wider">{label}</div>
        
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent"
          style={{ color }}
          initial={{ scaleX: 0 }}
          animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

function DramaticCounter({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  
  useEffect(() => {
    setIsAnimating(true);
    const duration = 2500;
    const steps = 80;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        setIsAnimating(false);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.span 
      className="tabular-nums inline-block"
      animate={isAnimating ? {
        scale: [1, 1.02, 1],
      } : {}}
      transition={{ duration: 0.1, repeat: isAnimating ? Infinity : 0 }}
    >
      {displayValue.toLocaleString(undefined, { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      })}{suffix}
    </motion.span>
  );
}

function PulsingLiveTicker({ baseValue, maxVariation, unit = 'min' }: { baseValue: number; maxVariation: number; unit?: string }) {
  const [value, setValue] = useState(baseValue);
  const [flash, setFlash] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * maxVariation;
      setValue(Math.max(1, baseValue + variation));
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    }, 1500);
    return () => clearInterval(interval);
  }, [baseValue, maxVariation]);

  return (
    <motion.span 
      className="tabular-nums inline-flex items-center gap-1"
      animate={flash ? { scale: [1, 1.1, 1], color: [ACCENT_BLUE, GREEN, ACCENT_BLUE] } : {}}
      transition={{ duration: 0.3 }}
    >
      {value.toFixed(1)} 
      <span className="text-lg">{unit}</span>
      <motion.span
        className="inline-block w-2 h-2 rounded-full ml-1"
        style={{ backgroundColor: GREEN }}
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
    </motion.span>
  );
}

function ExplosiveIncrementCounter({ baseValue, incrementRate }: { baseValue: number; incrementRate: number }) {
  const [value, setValue] = useState(baseValue);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * incrementRate) + 1;
      setValue(prev => prev + increment);
      
      const newParticles = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 60 - 30,
        y: Math.random() * -40 - 10,
      }));
      setParticles(prev => [...prev, ...newParticles].slice(-15));
    }, 2000);
    return () => clearInterval(interval);
  }, [incrementRate]);

  return (
    <div className="relative inline-block">
      <AnimatePresence>
        {particles.map(p => (
          <motion.span
            key={p.id}
            className="absolute text-xs font-bold pointer-events-none"
            style={{ color: GREEN }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: p.x, y: p.y, scale: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            +{Math.floor(Math.random() * incrementRate) + 1}
          </motion.span>
        ))}
      </AnimatePresence>
      
      <motion.span 
        key={value}
        initial={{ scale: 1.3, color: GREEN }}
        animate={{ scale: 1, color: ACCENT_BLUE }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="tabular-nums"
      >
        {value.toLocaleString()}
      </motion.span>
    </div>
  );
}

function ServiceCard({ service, index }: { service: typeof supportServices[0]; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const Icon = service.icon;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return GREEN;
      case 'scheduled': return ACCENT_BLUE;
      case 'standby': return YELLOW;
      default: return '#666';
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="w-3 h-3" />;
      case 'hotline': return <Phone className="w-3 h-3 text-red-400" />;
      case 'email': return <Mail className="w-3 h-3" />;
      case 'chat': return <MessageSquare className="w-3 h-3" />;
      case 'portal': return <Globe2 className="w-3 h-3" />;
      default: return null;
    }
  };

  const statusColor = getStatusColor(service.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsExpanded(!isExpanded)}
      className="relative cursor-pointer"
      data-testid={`service-card-${service.id}`}
    >
      <motion.div
        className="absolute -inset-0.5 rounded-xl opacity-0"
        style={{
          background: `linear-gradient(135deg, ${statusColor}40, transparent 50%, ${ACCENT_BLUE}40)`,
        }}
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.div
        className="relative bg-[#000a15]/90 backdrop-blur-sm border border-[#3D70B7]/20 rounded-xl p-6 transition-all duration-300 overflow-hidden"
        animate={{
          borderColor: isHovered ? statusColor : 'rgba(61, 112, 183, 0.2)',
          boxShadow: isHovered ? `0 0 30px ${statusColor}20, inset 0 0 30px ${statusColor}05` : 'none',
        }}
        layout
      >
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, transparent, ${statusColor}, transparent)` }}
          animate={isHovered ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.3 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        <div className="flex items-start justify-between mb-4">
          <motion.div 
            className="p-3 rounded-lg bg-[#3D70B7]/10 border border-[#3D70B7]/30"
            animate={isHovered ? { 
              scale: [1, 1.1, 1],
              borderColor: [statusColor, ACCENT_BLUE, statusColor]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className="w-6 h-6 text-[#3D70B7]" />
          </motion.div>
          
          <div className="flex items-center gap-2">
            <motion.div 
              className="relative"
              animate={{ 
                scale: [1, 1.3, 1],
              }}
              transition={{ 
                duration: service.status === 'active' ? 1 : service.status === 'standby' ? 1.5 : 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: statusColor }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: statusColor }}
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            <span className="text-xs font-mono uppercase" style={{ color: statusColor }}>{service.status}</span>
          </div>
        </div>
        
        <h3 className="font-mono text-lg font-bold text-white mb-2 flex items-center gap-2">
          {service.name}
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4 text-[#3D70B7]/50" />
          </motion.span>
        </h3>
        <p className="text-[#3D70B7]/60 text-sm mb-4">{service.description}</p>
        
        <motion.div 
          className="flex items-center gap-2 mb-4 px-3 py-2 bg-[#3D70B7]/5 rounded-lg border border-[#3D70B7]/20"
          animate={isHovered ? { 
            backgroundColor: 'rgba(61, 112, 183, 0.1)',
            borderColor: statusColor
          } : {}}
        >
          <Clock className="w-4 h-4 text-[#3D70B7]" />
          <span className="text-sm font-mono text-[#3D70B7]">{service.sla}</span>
        </motion.div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-[#3D70B7]/10">
                <h4 className="text-xs font-mono text-[#3D70B7]/80 mb-3 uppercase tracking-wider">Capabilities</h4>
                <ul className="space-y-2 mb-4">
                  {service.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2 text-sm text-[#3D70B7]/70"
                    >
                      <CheckCircle className="w-3 h-3 text-[#42BA90] flex-shrink-0" />
                      {detail}
                    </motion.li>
                  ))}
                </ul>
                
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(service.stats).map(([key, val], i) => (
                    <motion.div
                      key={key}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="bg-[#3D70B7]/5 rounded-lg p-2 text-center"
                    >
                      <div className="text-lg font-bold text-[#3D70B7]">{val}</div>
                      <div className="text-[10px] text-[#3D70B7]/50 uppercase">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs text-[#3D70B7]/50">Contact:</span>
          <div className="flex gap-2">
            {service.contactOptions.map((option) => (
              <motion.div 
                key={option}
                whileHover={{ scale: 1.2, backgroundColor: 'rgba(61, 112, 183, 0.3)' }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded bg-[#3D70B7]/10 text-[#3D70B7] cursor-pointer"
                title={option}
              >
                {getContactIcon(option)}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LiveSecurityEventsFeed() {
  const [events, setEvents] = useState<ReturnType<typeof generateSecurityEvent>[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    const initialEvents = Array.from({ length: 5 }, () => generateSecurityEvent());
    setEvents(initialEvents);
  }, []);
  
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      const newEvent = generateSecurityEvent();
      setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#000a15]/80 backdrop-blur-sm border border-[#3D70B7]/20 rounded-xl overflow-hidden"
      data-testid="security-events-feed"
    >
      <div className="flex items-center justify-between p-4 border-b border-[#3D70B7]/20">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Radio className="w-5 h-5 text-[#3D70B7]" />
          </motion.div>
          <h3 className="font-mono text-lg font-bold text-white">Live Security Feed</h3>
          <motion.span
            className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-[#42BA90]/20 text-[#42BA90]"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#42BA90]" />
            LIVE
          </motion.span>
        </div>
        
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="text-xs font-mono px-3 py-1 rounded border border-[#3D70B7]/30 text-[#3D70B7] hover:bg-[#3D70B7]/10 transition-colors"
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>
      
      <div className="h-[300px] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#000a15] pointer-events-none z-10" />
        
        <AnimatePresence mode="popLayout">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ x: -100, opacity: 0, height: 0 }}
              animate={{ x: 0, opacity: 1, height: 'auto' }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b border-[#3D70B7]/10 last:border-0"
            >
              <div className="flex items-center gap-3 p-3 hover:bg-[#3D70B7]/5 transition-colors">
                <motion.div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${event.color}15` }}
                  animate={index === 0 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <event.icon className="w-4 h-4" style={{ color: event.color }} />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                      style={{ 
                        backgroundColor: `${event.color}20`,
                        color: event.color
                      }}
                    >
                      {event.type}
                    </span>
                    <span className="text-[10px] text-[#3D70B7]/40 font-mono">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-[#3D70B7]/80 truncate font-mono">
                    {event.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function SystemStatusDashboard() {
  const [statuses, setStatuses] = useState(systemStatuses);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStatuses(prev => prev.map(s => ({
        ...s,
        status: Math.random() > 0.95 ? (Math.random() > 0.5 ? 'degraded' : 'operational') : s.status
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'operational': return { color: GREEN, label: 'Operational', icon: CheckCircle };
      case 'degraded': return { color: YELLOW, label: 'Degraded', icon: AlertTriangle };
      case 'down': return { color: RED, label: 'Down', icon: XCircle };
      default: return { color: '#666', label: 'Unknown', icon: Activity };
    }
  };

  const operationalCount = statuses.filter(s => s.status === 'operational').length;
  const overallHealth = (operationalCount / statuses.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#000a15]/80 backdrop-blur-sm border border-[#3D70B7]/20 rounded-xl p-6"
      data-testid="system-status-dashboard"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-mono text-lg font-bold text-white">System Health</h3>
        <div className="flex items-center gap-2">
          <motion.div
            className="text-2xl font-bold font-mono"
            style={{ color: overallHealth === 100 ? GREEN : YELLOW }}
            animate={{ textShadow: [`0 0 10px ${overallHealth === 100 ? GREEN : YELLOW}40`, `0 0 20px ${overallHealth === 100 ? GREEN : YELLOW}40`] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          >
            {overallHealth.toFixed(0)}%
          </motion.div>
          <span className="text-xs text-[#3D70B7]/50 font-mono">HEALTH</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statuses.map((system, index) => {
          const statusInfo = getStatusInfo(system.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <motion.div
              key={system.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, borderColor: statusInfo.color }}
              className="relative p-3 rounded-lg border border-[#3D70B7]/20 bg-[#3D70B7]/5 text-center overflow-hidden"
            >
              <motion.div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 50% 100%, ${statusInfo.color}10 0%, transparent 70%)` }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <system.icon className="w-4 h-4 text-[#3D70B7]/70" />
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: statusInfo.color }}
                    animate={{ 
                      scale: [1, 1.3, 1],
                      boxShadow: [`0 0 0 0 ${statusInfo.color}`, `0 0 0 4px ${statusInfo.color}00`]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                <div className="text-xs font-mono text-white font-medium">{system.name}</div>
                <div className="text-[10px] font-mono mt-1" style={{ color: statusInfo.color }}>
                  {statusInfo.label}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function EmergencyContactSection() {
  const [pulseIntensity, setPulseIntensity] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIntensity(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 68, 68, 0.1) 0%, rgba(61, 112, 183, 0.05) 50%, rgba(255, 68, 68, 0.1) 100%)',
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      <motion.div
        className="absolute -inset-1 rounded-2xl"
        style={{
          background: `linear-gradient(90deg, ${RED}00, ${RED}40, ${RED}00)`,
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      
      <motion.div
        className="absolute inset-0 rounded-2xl border-2"
        style={{ borderColor: `${RED}40` }}
        animate={{
          borderColor: [`${RED}20`, `${RED}60`, `${RED}20`],
          boxShadow: [`0 0 20px ${RED}00`, `0 0 40px ${RED}30`, `0 0 20px ${RED}00`]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <div className="relative z-10 bg-gradient-to-r from-[#3D70B7]/10 via-[#3D70B7]/5 to-[#3D70B7]/10 border border-[#3D70B7]/30 rounded-2xl p-8 md:p-12 text-center">
        <motion.div
          className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/50 rounded-full px-4 py-2 mb-6"
          animate={{
            scale: [1, 1.05, 1],
            borderColor: [`${RED}50`, `${RED}`, `${RED}50`]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <AlertOctagon className="w-5 h-5 text-red-400" />
          </motion.div>
          <span className="text-sm font-mono font-bold text-red-400">EMERGENCY RESPONSE READY</span>
        </motion.div>
        
        <h2 className="font-mono text-2xl md:text-3xl font-bold mb-4">
          Need <motion.span 
            className="text-[#3D70B7]"
            animate={{ 
              textShadow: ['0 0 10px #3D70B740', '0 0 30px #3D70B780', '0 0 10px #3D70B740']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Immediate Assistance
          </motion.span>?
        </h2>
        
        <p className="text-[#3D70B7]/60 font-mono text-sm mb-8 max-w-xl mx-auto">
          Our security operations center is available around the clock for emergency response
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="tel:+1-800-SECURITY"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                `0 0 20px ${RED}30, inset 0 0 20px ${RED}10`,
                `0 0 40px ${RED}50, inset 0 0 30px ${RED}20`,
                `0 0 20px ${RED}30, inset 0 0 20px ${RED}10`
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="relative inline-flex items-center gap-2 px-8 py-4 bg-red-500/20 border-2 border-red-500 rounded-lg text-red-400 font-mono font-bold overflow-hidden group"
            data-testid="btn-emergency-hotline"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <Phone className="w-5 h-5 relative z-10" />
            </motion.div>
            <span className="relative z-10">Emergency Hotline</span>
          </motion.a>
          
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center gap-2 px-8 py-4 bg-[#3D70B7]/20 border border-[#3D70B7] rounded-lg text-[#3D70B7] font-mono font-bold overflow-hidden group hover:bg-[#3D70B7]/30 transition-colors"
            data-testid="btn-contact-support"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3D70B7]/20 to-transparent opacity-0 group-hover:opacity-100"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Mail className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Contact Support</span>
          </motion.a>
        </div>
        
        <motion.div
          className="mt-8 flex items-center justify-center gap-4 text-xs font-mono text-[#3D70B7]/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-[#42BA90]"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span>Response Team Online</span>
          </div>
          <div className="w-px h-4 bg-[#3D70B7]/30" />
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Avg Response: &lt;5 min</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function OngoingSupport() {
  const [metrics] = useState({
    uptime: 99.99,
    responseTime: 12.5,
    threatsBlocked: 15847,
    activeSessions: 247,
  });

  return (
    <div className="min-h-screen bg-[#000510] text-white relative overflow-hidden">
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(61, 112, 183, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(61, 112, 183, 0.05) 0%, transparent 40%)',
        }}
      />
      
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 25% 35%, rgba(61, 112, 183, 0.04) 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, rgba(28, 44, 90, 0.03) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#000510]/90 border-b border-[#3D70B7]/20">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <Link
              href="/experience"
              className="flex items-center gap-2 text-[#3D70B7] hover:text-[#3D70B7]/80 transition-colors font-mono text-sm"
              data-testid="link-back-experience"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Experience</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 font-mono text-xs">
                <motion.div 
                  className="flex items-center gap-2 text-[#42BA90]"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Activity className="w-3 h-3" />
                  <span>ALL SYSTEMS OPERATIONAL</span>
                </motion.div>
              </div>
              <motion.div 
                className="flex items-center gap-2 bg-[#3D70B7]/10 px-3 py-1.5 rounded border border-[#3D70B7]/30"
                animate={{
                  borderColor: ['rgba(61, 112, 183, 0.3)', 'rgba(61, 112, 183, 0.6)', 'rgba(61, 112, 183, 0.3)'],
                  boxShadow: ['0 0 10px rgba(61, 112, 183, 0)', '0 0 20px rgba(61, 112, 183, 0.2)', '0 0 10px rgba(61, 112, 183, 0)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div 
                  className="w-2 h-2 rounded-full bg-[#42BA90]"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-xs text-[#3D70B7] font-mono font-bold">24/7 ACTIVE</span>
              </motion.div>
            </div>
          </div>
        </header>

        <main className="pt-20">
          <section className="relative h-[60vh] min-h-[500px]">
            <div className="absolute inset-0">
              <WebGLFallback>
                <Canvas
                  camera={{ position: [0, 2, 8], fov: 60 }}
                  className="absolute inset-0"
                  dpr={[1, 2]}
                >
                  <CommandCenterScene />
                </Canvas>
              </WebGLFallback>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <motion.div 
                  className="inline-flex items-center gap-2 bg-[#3D70B7]/10 border border-[#3D70B7]/30 rounded px-4 py-2 mb-4 font-mono text-xs backdrop-blur-sm"
                  animate={{ 
                    borderColor: ['rgba(61, 112, 183, 0.3)', 'rgba(61, 112, 183, 0.6)', 'rgba(61, 112, 183, 0.3)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Headphones className="w-4 h-4 text-[#3D70B7]" />
                  </motion.div>
                  <span className="text-[#3D70B7]">SECURITY OPERATIONS CENTER</span>
                </motion.div>
                <h1 className="font-mono text-4xl md:text-6xl font-bold mb-4">
                  <motion.span 
                    className="text-[#3D70B7]"
                    animate={{ 
                      textShadow: ['0 0 20px #3D70B740', '0 0 40px #3D70B760', '0 0 20px #3D70B740']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Ongoing{' '}
                  </motion.span>
                  <span className="text-white">Support</span>
                </h1>
                <p className="text-[#3D70B7]/60 font-mono text-sm max-w-xl mx-auto backdrop-blur-sm">
                  24/7 security monitoring and response with industry-leading SLA guarantees
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-12 px-6">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <GlowingMetricCard 
                  icon={TrendingUp} 
                  value="" 
                  label="UPTIME" 
                  color={GREEN}
                  glowColor={GREEN}
                  data-testid="metric-uptime"
                >
                  <DramaticCounter value={metrics.uptime} suffix="%" decimals={2} />
                </GlowingMetricCard>
                
                <GlowingMetricCard 
                  icon={Clock} 
                  value="" 
                  label="AVG RESPONSE" 
                  color={ACCENT_BLUE}
                  glowColor={ACCENT_BLUE}
                  data-testid="metric-response"
                >
                  <PulsingLiveTicker baseValue={metrics.responseTime} maxVariation={5} />
                </GlowingMetricCard>
                
                <GlowingMetricCard 
                  icon={Shield} 
                  value="" 
                  label="THREATS BLOCKED TODAY" 
                  color={ACCENT_BLUE}
                  glowColor={ACCENT_BLUE}
                  data-testid="metric-threats"
                >
                  <ExplosiveIncrementCounter baseValue={metrics.threatsBlocked} incrementRate={5} />
                </GlowingMetricCard>
                
                <GlowingMetricCard 
                  icon={Server} 
                  value="" 
                  label="ACTIVE SESSIONS" 
                  color={ACCENT_BLUE}
                  glowColor={ACCENT_BLUE}
                  data-testid="metric-sessions"
                >
                  <DramaticCounter value={metrics.activeSessions} />
                </GlowingMetricCard>
              </motion.div>
            </div>
          </section>

          <section className="py-8 px-6">
            <div className="container mx-auto">
              <div className="grid lg:grid-cols-2 gap-6">
                <LiveSecurityEventsFeed />
                <SystemStatusDashboard />
              </div>
            </div>
          </section>

          <section className="py-16 px-6">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">
                  <motion.span 
                    className="text-[#3D70B7]"
                    animate={{ 
                      textShadow: ['0 0 10px #3D70B740', '0 0 25px #3D70B760', '0 0 10px #3D70B740']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Support{' '}
                  </motion.span>
                  <span className="text-white">Services</span>
                </h2>
                <p className="text-[#3D70B7]/60 font-mono text-sm max-w-2xl mx-auto">
                  Comprehensive security support tailored to your organization's needs
                </p>
                <p className="text-[#3D70B7]/40 font-mono text-xs mt-2">
                  Click any card to expand details
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supportServices.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 px-6">
            <div className="container mx-auto">
              <EmergencyContactSection />
            </div>
          </section>
        </main>

        <footer className="border-t border-[#3D70B7]/20 py-8 px-6">
          <div className="container mx-auto text-center">
            <p className="text-[#3D70B7]/40 font-mono text-xs">
              © 2026 CyberSec. All rights reserved. 24/7 Security Operations Center.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
