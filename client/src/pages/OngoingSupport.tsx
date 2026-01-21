import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowLeft, Shield, Clock, Activity, AlertTriangle, CheckCircle,
  Phone, Mail, Headphones, FileText, TrendingUp, Zap, Eye, 
  RefreshCw, Calendar, MessageSquare, Server, Globe2, Lock
} from 'lucide-react';
import { WebGLFallback } from '@/components/ui/webgl-fallback';

const CYAN = '#00D4FF';
const NAVY = 'hsl(222, 47%, 5%)';
const GREEN = '#00FF88';

const supportServices = [
  {
    id: 1,
    name: '24/7 Monitoring & Response',
    icon: Eye,
    sla: '< 15 min response',
    description: 'Round-the-clock security monitoring with immediate threat response',
    status: 'active',
    contactOptions: ['phone', 'email', 'chat'],
  },
  {
    id: 2,
    name: 'Patch Management',
    icon: RefreshCw,
    sla: 'Critical: 24h, High: 72h',
    description: 'Automated vulnerability patching and update management',
    status: 'active',
    contactOptions: ['email', 'portal'],
  },
  {
    id: 3,
    name: 'Threat Intelligence Updates',
    icon: AlertTriangle,
    sla: 'Real-time feeds',
    description: 'Continuous threat intelligence and early warning alerts',
    status: 'active',
    contactOptions: ['email', 'portal'],
  },
  {
    id: 4,
    name: 'Security Advisory Services',
    icon: FileText,
    sla: '4h consultation',
    description: 'Expert security guidance and strategic consulting',
    status: 'active',
    contactOptions: ['phone', 'email', 'chat'],
  },
  {
    id: 5,
    name: 'Quarterly Security Reviews',
    icon: Calendar,
    sla: 'Scheduled quarterly',
    description: 'Comprehensive security posture assessments and reporting',
    status: 'scheduled',
    contactOptions: ['email', 'portal'],
  },
  {
    id: 6,
    name: 'Emergency Incident Response',
    icon: Zap,
    sla: '< 5 min activation',
    description: 'Rapid incident containment and forensic investigation',
    status: 'standby',
    contactOptions: ['phone', 'hotline'],
  },
];

const slaTiers = [
  {
    name: 'Bronze',
    color: '#CD7F32',
    responseTime: '4 hours',
    features: ['Business hours support', 'Email support', 'Monthly reports'],
    price: '$2,500/mo',
  },
  {
    name: 'Silver',
    color: '#C0C0C0',
    responseTime: '1 hour',
    features: ['Extended hours (6AM-10PM)', 'Email & phone', 'Weekly reports', 'Patch management'],
    price: '$5,000/mo',
  },
  {
    name: 'Gold',
    color: '#FFD700',
    responseTime: '30 minutes',
    features: ['24/7 support', 'All channels', 'Daily reports', 'Threat intelligence', 'Quarterly reviews'],
    price: '$10,000/mo',
  },
  {
    name: 'Platinum',
    color: '#E5E4E2',
    responseTime: '< 15 minutes',
    features: ['24/7 dedicated team', 'Priority escalation', 'Real-time dashboards', 'Full SIEM integration', 'Incident response retainer'],
    price: '$25,000/mo',
  },
];

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
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.3} />
      </mesh>
      
      <mesh ref={pulseRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.2} />
      </mesh>
      
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.6} />
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
      
      <HolographicScreen position={[-4, 2, -2]} rotation={[0, 0.3, 0]} size={[2, 1.5]} color={CYAN} />
      <HolographicScreen position={[4, 2, -2]} rotation={[0, -0.3, 0]} size={[2, 1.5]} color={CYAN} />
      <HolographicScreen position={[-3, -1, -1]} rotation={[0.2, 0.2, 0]} size={[1.5, 1]} color={GREEN} pulseSpeed={1.5} />
      <HolographicScreen position={[3, -1, -1]} rotation={[0.2, -0.2, 0]} size={[1.5, 1]} color={GREEN} pulseSpeed={1.5} />
      <HolographicScreen position={[0, 3, -3]} rotation={[-0.2, 0, 0]} size={[3, 1.5]} color={CYAN} pulseSpeed={0.8} />
      <HolographicScreen position={[-5, 0, 0]} rotation={[0, 0.5, 0]} size={[1.2, 2]} color="#9944ff" pulseSpeed={1.2} />
      <HolographicScreen position={[5, 0, 0]} rotation={[0, -0.5, 0]} size={[1.2, 2]} color="#9944ff" pulseSpeed={1.2} />
      
      <DataStream start={[-4, 2, -2]} end={[0, 0, 0]} color={CYAN} speed={1.5} />
      <DataStream start={[4, 2, -2]} end={[0, 0, 0]} color={CYAN} speed={1.5} />
      <DataStream start={[0, 3, -3]} end={[0, 0, 0]} color={CYAN} speed={1.2} />
      <DataStream start={[-5, 0, 0]} end={[-3, -1, -1]} color="#9944ff" speed={1} />
      <DataStream start={[5, 0, 0]} end={[3, -1, -1]} color="#9944ff" speed={1} />
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

function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current * 100) / 100);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="tabular-nums">
      {prefix}{displayValue.toLocaleString(undefined, { minimumFractionDigits: suffix === '%' ? 2 : 0, maximumFractionDigits: 2 })}{suffix}
    </span>
  );
}

function LiveTicker({ baseValue, maxVariation }: { baseValue: number; maxVariation: number }) {
  const [value, setValue] = useState(baseValue);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * maxVariation;
      setValue(Math.max(1, baseValue + variation));
    }, 2000);
    return () => clearInterval(interval);
  }, [baseValue, maxVariation]);

  return (
    <span className="tabular-nums">
      {value.toFixed(1)} min
    </span>
  );
}

function IncrementingCounter({ baseValue, incrementRate }: { baseValue: number; incrementRate: number }) {
  const [value, setValue] = useState(baseValue);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => prev + Math.floor(Math.random() * incrementRate) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [incrementRate]);

  return (
    <motion.span 
      key={value}
      initial={{ scale: 1.2, color: '#00FF88' }}
      animate={{ scale: 1, color: '#00D4FF' }}
      className="tabular-nums"
    >
      {value.toLocaleString()}
    </motion.span>
  );
}

function ServiceCard({ service }: { service: typeof supportServices[0] }) {
  const Icon = service.icon;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'standby': return 'bg-yellow-500';
      default: return 'bg-gray-500';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, borderColor: CYAN }}
      className="bg-[#000a15]/80 backdrop-blur-sm border border-[#00D4FF]/20 rounded-xl p-6 transition-all duration-300"
      data-testid={`service-card-${service.id}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/30">
          <Icon className="w-6 h-6 text-[#00D4FF]" />
        </div>
        <div className="flex items-center gap-2">
          <motion.div 
            className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{ 
              duration: service.status === 'active' ? 1.5 : service.status === 'standby' ? 2 : 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span className="text-xs font-mono text-[#00D4FF]/70 uppercase">{service.status}</span>
        </div>
      </div>
      
      <h3 className="font-mono text-lg font-bold text-white mb-2">{service.name}</h3>
      <p className="text-[#00D4FF]/60 text-sm mb-4">{service.description}</p>
      
      <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-[#00D4FF]/5 rounded-lg border border-[#00D4FF]/20">
        <Clock className="w-4 h-4 text-[#00D4FF]" />
        <span className="text-sm font-mono text-[#00D4FF]">{service.sla}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#00D4FF]/50">Contact:</span>
        <div className="flex gap-2">
          {service.contactOptions.map((option) => (
            <div 
              key={option}
              className="p-1.5 rounded bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20 transition-colors cursor-pointer"
              title={option}
            >
              {getContactIcon(option)}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SLATierCard({ tier, index, isSelected, onSelect }: { 
  tier: typeof slaTiers[0]; 
  index: number; 
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      className={`relative bg-[#000a15]/80 backdrop-blur-sm border rounded-xl p-6 overflow-hidden transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-2 ring-2 ring-offset-2 ring-offset-[#000510]' 
          : 'border-[#00D4FF]/20 hover:border-[#00D4FF]/50'
      }`}
      style={isSelected ? { borderColor: tier.color, ringColor: tier.color } : undefined}
      data-testid={`sla-tier-${tier.name.toLowerCase()}`}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: tier.color }}
        >
          <CheckCircle className="w-4 h-4 text-black" />
        </motion.div>
      )}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: isHovered 
            ? `radial-gradient(circle at 50% 0%, ${tier.color}20 0%, transparent 70%)`
            : 'transparent'
        }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 -translate-y-1/2"
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
          opacity: isHovered ? 1 : 0.5
        }}
        transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
      >
        <Shield className="w-full h-full" style={{ color: tier.color }} />
      </motion.div>
      
      <div className="mt-6 text-center mb-4">
        <h3 className="font-mono text-2xl font-bold" style={{ color: tier.color }}>{tier.name}</h3>
        <p className="text-3xl font-bold text-white mt-2">{tier.price}</p>
      </div>
      
      <div className="text-center py-3 mb-4 bg-[#00D4FF]/5 rounded-lg border border-[#00D4FF]/20">
        <span className="text-xs text-[#00D4FF]/70 block">Response Time</span>
        <span className="text-xl font-mono font-bold text-[#00D4FF]">{tier.responseTime}</span>
      </div>
      
      <ul className="space-y-2">
        {tier.features.map((feature, i) => (
          <motion.li 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + i * 0.05 }}
            className="flex items-center gap-2 text-sm text-[#00D4FF]/80"
          >
            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            {feature}
          </motion.li>
        ))}
      </ul>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full mt-6 py-3 rounded-lg font-mono font-bold transition-all ${
          isSelected ? 'bg-gradient-to-r' : ''
        }`}
        style={{ 
          backgroundColor: isSelected ? tier.color : `${tier.color}20`,
          borderColor: tier.color,
          borderWidth: 1,
          color: isSelected ? '#000' : tier.color
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {isSelected ? 'Selected ✓' : 'Select Plan'}
      </motion.button>
    </motion.div>
  );
}

export default function OngoingSupport() {
  const [metrics, setMetrics] = useState({
    uptime: 99.99,
    responseTime: 12.5,
    threatsBlocked: 15847,
    activeSessions: 247,
  });
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <div className="min-h-screen bg-[#000510] text-white relative overflow-hidden">
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 212, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0, 212, 255, 0.05) 0%, transparent 40%)',
        }}
      />
      
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#000510]/90 border-b border-[#00D4FF]/20">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors font-mono text-sm"
              data-testid="link-back-home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 font-mono text-xs">
                <div className="flex items-center gap-2 text-green-400">
                  <Activity className="w-3 h-3" />
                  <span>ALL SYSTEMS OPERATIONAL</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#00D4FF]/10 px-3 py-1.5 rounded border border-[#00D4FF]/30">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-[#00D4FF] font-mono font-bold">24/7 ACTIVE</span>
              </div>
            </div>
          </div>
        </header>

        <main className="pt-20">
          <section className="relative h-[60vh] min-h-[500px]">
            <WebGLFallback className="absolute inset-0">
              <Canvas
                camera={{ position: [0, 2, 8], fov: 60 }}
                className="absolute inset-0"
                dpr={[1, 2]}
              >
                <CommandCenterScene />
              </Canvas>
            </WebGLFallback>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded px-4 py-2 mb-4 font-mono text-xs backdrop-blur-sm">
                  <Headphones className="w-4 h-4 text-[#00D4FF]" />
                  <span className="text-[#00D4FF]">SECURITY OPERATIONS CENTER</span>
                </div>
                <h1 className="font-mono text-4xl md:text-6xl font-bold mb-4">
                  <span className="text-[#00D4FF]">Ongoing </span>
                  <span className="text-white">Support</span>
                </h1>
                <p className="text-[#00D4FF]/60 font-mono text-sm max-w-xl mx-auto backdrop-blur-sm">
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
                <div className="bg-[#000a15]/80 backdrop-blur-sm border border-[#00D4FF]/20 rounded-xl p-6 text-center" data-testid="metric-uptime">
                  <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-green-400 mb-1">
                    <AnimatedCounter value={metrics.uptime} suffix="%" />
                  </div>
                  <div className="text-xs text-[#00D4FF]/60 font-mono">UPTIME</div>
                </div>
                
                <div className="bg-[#000a15]/80 backdrop-blur-sm border border-[#00D4FF]/20 rounded-xl p-6 text-center" data-testid="metric-response">
                  <Clock className="w-8 h-8 text-[#00D4FF] mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-[#00D4FF] mb-1">
                    <LiveTicker baseValue={metrics.responseTime} maxVariation={5} />
                  </div>
                  <div className="text-xs text-[#00D4FF]/60 font-mono">AVG RESPONSE</div>
                </div>
                
                <div className="bg-[#000a15]/80 backdrop-blur-sm border border-[#00D4FF]/20 rounded-xl p-6 text-center" data-testid="metric-threats">
                  <Shield className="w-8 h-8 text-[#00D4FF] mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-[#00D4FF] mb-1">
                    <IncrementingCounter baseValue={metrics.threatsBlocked} incrementRate={5} />
                  </div>
                  <div className="text-xs text-[#00D4FF]/60 font-mono">THREATS BLOCKED TODAY</div>
                </div>
                
                <div className="bg-[#000a15]/80 backdrop-blur-sm border border-[#00D4FF]/20 rounded-xl p-6 text-center" data-testid="metric-sessions">
                  <Server className="w-8 h-8 text-[#00D4FF] mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold text-[#00D4FF] mb-1">
                    <AnimatedCounter value={metrics.activeSessions} />
                  </div>
                  <div className="text-xs text-[#00D4FF]/60 font-mono">ACTIVE SESSIONS</div>
                </div>
              </motion.div>
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
                  <span className="text-[#00D4FF]">Support </span>
                  <span className="text-white">Services</span>
                </h2>
                <p className="text-[#00D4FF]/60 font-mono text-sm max-w-2xl mx-auto">
                  Comprehensive security support tailored to your organization's needs
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supportServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 px-6 bg-gradient-to-b from-transparent via-[#00D4FF]/5 to-transparent">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded px-4 py-2 mb-4 font-mono text-xs">
                  <Lock className="w-4 h-4 text-[#00D4FF]" />
                  <span className="text-[#00D4FF]">SLA GUARANTEED</span>
                </div>
                <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">
                  <span className="text-white">Service Level </span>
                  <span className="text-[#00D4FF]">Agreements</span>
                </h2>
                <p className="text-[#00D4FF]/60 font-mono text-sm max-w-2xl mx-auto">
                  Choose the protection level that matches your security requirements
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {slaTiers.map((tier, index) => (
                  <SLATierCard 
                    key={tier.name} 
                    tier={tier} 
                    index={index} 
                    isSelected={selectedPlan === tier.name}
                    onSelect={() => {
                      setSelectedPlan(tier.name);
                      setShowConfirmation(true);
                    }}
                  />
                ))}
              </div>
              
              {selectedPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center"
                >
                  <div className="inline-flex items-center gap-4 p-4 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-xl">
                    <span className="text-[#00D4FF]">Selected Plan:</span>
                    <span className="font-bold text-white">{selectedPlan}</span>
                    <span className="text-[#00D4FF]/60">|</span>
                    <span className="text-white">{slaTiers.find(t => t.name === selectedPlan)?.price}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          <AnimatePresence>
            {showConfirmation && selectedPlan && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                onClick={() => setShowConfirmation(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#000510] border border-[#00D4FF]/30 rounded-2xl p-8 max-w-md w-full text-center"
                  data-testid="plan-confirmation-modal"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: slaTiers.find(t => t.name === selectedPlan)?.color + '30' }}
                  >
                    <CheckCircle className="w-8 h-8" style={{ color: slaTiers.find(t => t.name === selectedPlan)?.color }} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Plan Selected!</h3>
                  <p className="text-[#00D4FF]/70 mb-4">
                    You've selected the <span className="font-bold" style={{ color: slaTiers.find(t => t.name === selectedPlan)?.color }}>{selectedPlan}</span> plan
                  </p>
                  <div className="p-4 bg-[#00D4FF]/5 rounded-xl border border-[#00D4FF]/20 mb-6">
                    <div className="text-3xl font-bold text-white mb-1">{slaTiers.find(t => t.name === selectedPlan)?.price}</div>
                    <div className="text-sm text-[#00D4FF]/60">Response Time: {slaTiers.find(t => t.name === selectedPlan)?.responseTime}</div>
                  </div>
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 py-3 rounded-lg border border-[#00D4FF]/30 text-[#00D4FF] font-mono hover:bg-[#00D4FF]/10"
                    >
                      Close
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowConfirmation(false);
                      }}
                      className="flex-1 py-3 rounded-lg font-mono font-bold"
                      style={{ 
                        backgroundColor: slaTiers.find(t => t.name === selectedPlan)?.color,
                        color: '#000'
                      }}
                    >
                      Confirm
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <section className="py-16 px-6">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-[#00D4FF]/10 via-[#00D4FF]/5 to-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-2xl p-8 md:p-12 text-center"
              >
                <h2 className="font-mono text-2xl md:text-3xl font-bold mb-4">
                  Need <span className="text-[#00D4FF]">Immediate Assistance</span>?
                </h2>
                <p className="text-[#00D4FF]/60 font-mono text-sm mb-8 max-w-xl mx-auto">
                  Our security operations center is available around the clock for emergency response
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="tel:+1-800-SECURITY"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 font-mono font-bold hover:bg-red-500/30 transition-colors"
                    data-testid="btn-emergency-hotline"
                  >
                    <Phone className="w-5 h-5" />
                    Emergency Hotline
                  </motion.a>
                  <motion.a
                    href="/contact"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#00D4FF]/20 border border-[#00D4FF] rounded-lg text-[#00D4FF] font-mono font-bold hover:bg-[#00D4FF]/30 transition-colors"
                    data-testid="btn-contact-support"
                  >
                    <Mail className="w-5 h-5" />
                    Contact Support
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#00D4FF]/20 py-8 px-6">
          <div className="container mx-auto text-center">
            <p className="text-[#00D4FF]/40 font-mono text-xs">
              © 2026 CyberSec. All rights reserved. 24/7 Security Operations Center.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
