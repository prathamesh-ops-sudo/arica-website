import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Text, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowLeft, Play, RotateCcw, Shield, Code, Package, 
  Server, Eye, Lock, Zap, Clock, CheckCircle, XCircle, 
  AlertTriangle, Search, FileSearch, Container, Key, ClipboardCheck,
  Activity, GitBranch, Cpu, Database, Loader2
} from 'lucide-react';
import { PurpleGalaxyBackground } from '@/components/ui/purple-galaxy-background';
import { useGsapStagger } from '@/hooks/useGsapStagger';
import { WebGLFallback } from '@/components/ui/webgl-fallback';

const CYAN = '#3D70B7';
const PURPLE = '#3D70B7';
const NAVY = 'hsl(222, 47%, 5%)';

const pipelineStages = [
  { id: 'code', name: 'Code', position: [-12, 0, 0], color: CYAN, icon: Code },
  { id: 'build', name: 'Build', position: [-6, 0, 0], color: '#42BA90', icon: Package },
  { id: 'test', name: 'Test', position: [0, 0, 0], color: '#42BA90', icon: Activity },
  { id: 'security', name: 'Security Scan', position: [6, 0, 0], color: PURPLE, icon: Shield },
  { id: 'deploy', name: 'Deploy', position: [12, 0, 0], color: '#3D70B7', icon: Server },
  { id: 'monitor', name: 'Monitor', position: [18, 0, 0], color: '#3D70B7', icon: Eye },
];

interface PackageData {
  id: number;
  position: THREE.Vector3;
  velocity: number;
  stage: number;
  status: 'pending' | 'scanning' | 'passed' | 'failed';
  color: THREE.Color;
}

function FlowingCodeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
      <style>{`
        @keyframes codeScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.08; }
        }
        @keyframes scanLine {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes dataFlow {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 100%; }
        }
      `}</style>
      
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${CYAN}10 0%, transparent 60%)`,
          animation: 'gridPulse 4s ease-in-out infinite',
        }}
      />
      
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 text-[10px] font-mono select-none"
          style={{
            left: `${(i + 1) * 9}%`,
            color: i % 2 === 0 ? CYAN : PURPLE,
            opacity: 0.06,
            animation: `codeScroll ${25 + i * 3}s linear infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        >
          {Array.from({ length: 60 }).map((_, j) => (
            <div key={j} className="whitespace-nowrap leading-relaxed">
              {['const', 'function', 'return', 'async', 'await', 'import', 'export', 'class', 'if', 'for', 'while', 'try'][j % 12]} {'{...}'}
            </div>
          ))}
        </div>
      ))}
      
      <div
        className="absolute inset-x-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${CYAN}80, transparent)`,
          animation: 'scanLine 6s linear infinite',
          boxShadow: `0 0 30px ${CYAN}`,
        }}
      />
      <div
        className="absolute inset-x-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${PURPLE}80, transparent)`,
          animation: 'scanLine 9s linear infinite',
          animationDelay: '3s',
          boxShadow: `0 0 30px ${PURPLE}`,
        }}
      />
    </div>
  );
}

function PipelineStage({ position, name, color, isActive, isScanning, stageIndex }: { 
  position: [number, number, number]; 
  name: string; 
  color: string;
  isActive: boolean;
  isScanning: boolean;
  stageIndex: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const laserRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const scanPlaneRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      if (isActive) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
      }
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2);
    }
    if (ringRef.current && isActive) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
    }
    if (laserRef.current && isScanning) {
      laserRef.current.rotation.z = state.clock.elapsedTime * 8;
      laserRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.3;
    }
    if (scanPlaneRef.current && isScanning) {
      scanPlaneRef.current.position.y = Math.sin(state.clock.elapsedTime * 5) * 1.5;
      (scanPlaneRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(state.clock.elapsedTime * 8) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 0.15 : 0.05} />
      </mesh>
      
      {isActive && (
        <mesh ref={ringRef} position={[0, 0, 0]}>
          <torusGeometry args={[1.4, 0.03, 8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}
      
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={isActive ? 0.5 : 0.2} 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {isScanning && name === 'Security Scan' && (
        <group>
          <mesh ref={laserRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 4, 8]} />
            <meshBasicMaterial color={CYAN} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 4, 8]} />
            <meshBasicMaterial color={PURPLE} transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.015, 0.015, 4, 8]} />
            <meshBasicMaterial color={CYAN} transparent opacity={0.4} />
          </mesh>
          
          <mesh ref={scanPlaneRef} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3, 3]} />
            <meshBasicMaterial color={PURPLE} transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
          
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i} position={[
              Math.cos(i * Math.PI / 4) * 1.8,
              Math.sin(i * Math.PI / 4) * 1.8,
              0
            ]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color={CYAN} />
            </mesh>
          ))}
          
          <pointLight color={CYAN} intensity={3} distance={5} />
          <pointLight color={PURPLE} intensity={2} distance={4} />
        </group>
      )}

      <Text
        position={[0, -1.8, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {`0${stageIndex + 1}`}
      </Text>
    </group>
  );
}

function PipelineConnector({ start, end, isActive }: { 
  start: [number, number, number]; 
  end: [number, number, number];
  isActive: boolean;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { points, particlePositions, particleCount } = useMemo(() => {
    const p = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      p.push(new THREE.Vector3(
        start[0] + (end[0] - start[0]) * t,
        start[1] + Math.sin(t * Math.PI) * 0.3,
        start[2]
      ));
    }
    
    const count = 5;
    const positions = new Float32Array(count * 3);
    
    return { points: p, particlePositions: positions, particleCount: count };
  }, [start, end]);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ 
      color: CYAN, 
      transparent: true, 
      opacity: isActive ? 0.6 : 0.3 
    });
    return { geometry: geo, material: mat };
  }, [points, isActive]);

  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    return geo;
  }, [particlePositions]);

  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: CYAN,
      size: 0.15,
      transparent: true,
      opacity: 0.8,
    });
  }, []);

  useFrame((state) => {
    if (particlesRef.current && isActive) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const t = ((state.clock.elapsedTime * 0.5 + i * 0.2) % 1);
        const idx = Math.floor(t * (points.length - 1));
        const nextIdx = Math.min(idx + 1, points.length - 1);
        const localT = (t * (points.length - 1)) - idx;
        
        positions[i * 3] = points[idx].x + (points[nextIdx].x - points[idx].x) * localT;
        positions[i * 3 + 1] = points[idx].y + (points[nextIdx].y - points[idx].y) * localT;
        positions[i * 3 + 2] = points[idx].z + (points[nextIdx].z - points[idx].z) * localT;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [geometry, material, particleGeometry, particleMaterial]);

  const lineObj = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

  return (
    <group>
      <primitive object={lineObj} />
      {isActive && (
        <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
      )}
    </group>
  );
}

function FlowingPackage({ packageData, onStageComplete }: { 
  packageData: PackageData;
  onStageComplete: (id: number, stage: number, passed: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [localStatus, setLocalStatus] = useState(packageData.status);
  const scanStarted = useRef(false);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const targetX = pipelineStages[Math.min(packageData.stage, pipelineStages.length - 1)].position[0];
    const currentX = meshRef.current.position.x;
    
    if (localStatus === 'pending' || localStatus === 'passed') {
      if (currentX < targetX - 0.1) {
        meshRef.current.position.x += packageData.velocity * delta * 60;
      } else if (packageData.stage === 3 && !scanStarted.current) {
        scanStarted.current = true;
        setLocalStatus('scanning');
        setTimeout(() => {
          const passed = Math.random() > 0.2;
          setLocalStatus(passed ? 'passed' : 'failed');
          onStageComplete(packageData.id, packageData.stage, passed);
          scanStarted.current = false;
        }, 1500);
      } else if (currentX >= targetX - 0.1 && packageData.stage !== 3) {
        onStageComplete(packageData.id, packageData.stage, true);
      }
    }
    
    meshRef.current.rotation.x += delta * 2;
    meshRef.current.rotation.y += delta * 1.5;
    
    if (localStatus === 'scanning') {
      meshRef.current.scale.setScalar(0.3 + Math.sin(state.clock.elapsedTime * 10) * 0.05);
    } else if (localStatus === 'failed') {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 5) * 0.2 - 2;
    }
  });

  const color = useMemo(() => {
    switch (localStatus) {
      case 'scanning': return '#42BA90';
      case 'passed': return '#42BA90';
      case 'failed': return '#FF4444';
      default: return CYAN;
    }
  }, [localStatus]);

  if (localStatus === 'failed' && meshRef.current && meshRef.current.position.y < -3) {
    return null;
  }

  return (
    <Trail
      width={0.3}
      length={8}
      color={new THREE.Color(color)}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef} position={[packageData.position.x, packageData.position.y, packageData.position.z]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
    </Trail>
  );
}

function PipelineScene({ isRunning, activeSecurityType, onMetricsUpdate }: { 
  isRunning: boolean;
  activeSecurityType: string | null;
  onMetricsUpdate: (passed: boolean) => void;
}) {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const packageIdRef = useRef(0);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStageComplete = useCallback((id: number, stage: number, passed: boolean) => {
    if (stage === 3) {
      onMetricsUpdate(passed);
    }
    
    setPackages(prev => prev.map(p => {
      if (p.id === id) {
        if (!passed) {
          return { ...p, status: 'failed' as const };
        }
        if (stage < pipelineStages.length - 1) {
          return { ...p, stage: stage + 1, status: 'pending' as const };
        }
      }
      return p;
    }).filter(p => !(p.status === 'failed' && p.stage > 3)));
  }, [onMetricsUpdate]);

  useEffect(() => {
    if (isRunning) {
      spawnIntervalRef.current = setInterval(() => {
        const newPackage: PackageData = {
          id: packageIdRef.current++,
          position: new THREE.Vector3(-15, 0, 0),
          velocity: 0.08 + Math.random() * 0.04,
          stage: 0,
          status: 'pending',
          color: new THREE.Color(CYAN),
        };
        setPackages(prev => [...prev.slice(-15), newPackage]);
      }, 800);
    } else {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    }

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    return () => {
      setPackages([]);
    };
  }, []);

  const activeStageIndex = activeSecurityType 
    ? ['sast', 'dast', 'sca', 'container', 'secret', 'compliance'].indexOf(activeSecurityType) >= 0 ? 3 : -1
    : -1;

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 10]} intensity={1} color={CYAN} />
      <pointLight position={[10, -5, -10]} intensity={0.5} color={PURPLE} />

      {pipelineStages.map((stage, index) => (
        <PipelineStage
          key={stage.id}
          position={stage.position as [number, number, number]}
          name={stage.name}
          color={stage.color}
          isActive={isRunning || activeStageIndex === index}
          isScanning={isRunning && index === 3}
          stageIndex={index}
        />
      ))}

      {pipelineStages.slice(0, -1).map((stage, index) => (
        <PipelineConnector
          key={`connector-${index}`}
          start={stage.position as [number, number, number]}
          end={pipelineStages[index + 1].position as [number, number, number]}
          isActive={isRunning}
        />
      ))}

      {packages.map(pkg => (
        <FlowingPackage
          key={pkg.id}
          packageData={pkg}
          onStageComplete={handleStageComplete}
        />
      ))}

      <Stars radius={100} depth={50} count={1500} factor={4} fade speed={0.5} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, -3, 0]}>
        <planeGeometry args={[50, 20]} />
        <meshStandardMaterial color={NAVY} transparent opacity={0.3} />
      </mesh>
    </>
  );
}

function CameraController() {
  const { camera } = useThree();
  
  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 2 + 3;
    camera.position.y = 6 + Math.sin(state.clock.elapsedTime * 0.15) * 0.5;
    camera.lookAt(3, 0, 0);
  });

  return null;
}

const securityIntegrations = [
  { 
    id: 'sast', 
    name: 'SAST', 
    fullName: 'Static Analysis',
    icon: Code,
    description: 'Analyze source code for security vulnerabilities before compilation',
    color: '#3D70B7',
    stats: { scansToday: 847, issuesFound: 23 }
  },
  { 
    id: 'dast', 
    name: 'DAST', 
    fullName: 'Dynamic Analysis',
    icon: Eye,
    description: 'Test running applications for runtime vulnerabilities',
    color: '#3D70B7',
    stats: { scansToday: 156, issuesFound: 8 }
  },
  { 
    id: 'sca', 
    name: 'SCA', 
    fullName: 'Software Composition',
    icon: Package,
    description: 'Scan dependencies for known CVEs and license issues',
    color: '#42BA90',
    stats: { scansToday: 2341, issuesFound: 67 }
  },
  { 
    id: 'container', 
    name: 'Container', 
    fullName: 'Container Scanning',
    icon: Container,
    description: 'Analyze container images for vulnerabilities and misconfigurations',
    color: '#42BA90',
    stats: { scansToday: 432, issuesFound: 12 }
  },
  { 
    id: 'secret', 
    name: 'Secrets', 
    fullName: 'Secret Detection',
    icon: Key,
    description: 'Detect hardcoded secrets, API keys, and credentials in code',
    color: PURPLE,
    stats: { scansToday: 1893, issuesFound: 34 }
  },
  { 
    id: 'compliance', 
    name: 'Compliance', 
    fullName: 'Compliance Checks',
    icon: ClipboardCheck,
    description: 'Validate against security policies and regulatory requirements',
    color: '#FF8800',
    stats: { scansToday: 567, issuesFound: 5 }
  },
];

function AnimatedCounter({ value, duration = 2000, suffix = '' }: { value: number; duration?: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);
  
  return <span>{displayValue.toLocaleString()}{suffix}</span>;
}

function LiveMetric({ value, label, icon: Icon, color, trend, trendLabel }: {
  value: number;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  trend?: 'up' | 'down';
  trendLabel?: string;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const prevValue = useRef(value);
  
  useEffect(() => {
    if (value !== prevValue.current) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 500);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);
  
  return (
    <motion.div
      animate={isUpdating ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {isUpdating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -inset-1 rounded-2xl"
          style={{ 
            background: `linear-gradient(135deg, ${color}20, transparent)`,
            boxShadow: `0 0 20px ${color}30`
          }}
        />
      )}
      <div className="relative p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
            animate={isUpdating ? { rotate: [0, 360] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </motion.div>
          <span className="text-white/60 text-sm">{label}</span>
        </div>
        <div className="text-3xl font-bold" style={{ color }}>
          <AnimatedCounter value={value} />
        </div>
        {trendLabel && (
          <div className={`mt-2 text-xs flex items-center gap-1 ${trend === 'up' ? 'text-[#42BA90]' : 'text-red-400'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendLabel}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function InteractiveStageCard({ 
  stage, 
  index, 
  isActive, 
  onClick 
}: { 
  stage: typeof securityIntegrations[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = stage.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        perspective: '1000px',
      }}
      className="cursor-pointer"
      data-testid={`card-security-${stage.id}`}
    >
      <motion.div
        animate={{
          rotateX: isHovered ? -5 : 0,
          rotateY: isHovered ? 5 : 0,
          scale: isHovered ? 1.05 : 1,
          z: isHovered ? 50 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`relative p-4 rounded-xl transition-colors ${
          isActive 
            ? 'bg-white/15 border-2' 
            : 'bg-black/40 border border-white/10 hover:border-white/30'
        }`}
        style={{ 
          borderColor: isActive ? stage.color : undefined,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered ? `0 25px 50px -12px ${stage.color}30` : 'none',
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            opacity: isHovered ? 0.3 : 0,
          }}
          style={{
            background: `radial-gradient(circle at center, ${stage.color}40, transparent 70%)`,
          }}
        />
        
        <div className="absolute top-2 right-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: stage.color }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        
        <motion.div 
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto relative"
          style={{ 
            backgroundColor: `${stage.color}20`,
            transform: 'translateZ(20px)',
          }}
          animate={isActive ? {
            boxShadow: [`0 0 0px ${stage.color}`, `0 0 20px ${stage.color}`, `0 0 0px ${stage.color}`],
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            animate={isActive ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Icon className="w-6 h-6" style={{ color: stage.color }} />
          </motion.div>
        </motion.div>
        
        <h3 className="font-semibold text-center text-sm">{stage.name}</h3>
        <p className="text-xs text-white/50 text-center mt-1">{stage.fullName}</p>
        
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-white/10"
            >
              <p className="text-xs text-white/70 mb-3">{stage.description}</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <div className="text-lg font-bold" style={{ color: stage.color }}>
                    {stage.stats.scansToday}
                  </div>
                  <div className="text-[10px] text-white/40">Scans Today</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-white/5">
                  <div className="text-lg font-bold text-red-400">
                    {stage.stats.issuesFound}
                  </div>
                  <div className="text-[10px] text-white/40">Issues Found</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function BuildStatusIndicator({ isRunning, passedCount, blockedCount }: {
  isRunning: boolean;
  passedCount: number;
  blockedCount: number;
}) {
  const total = passedCount + blockedCount;
  const successRate = total > 0 ? (passedCount / total) * 100 : 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-center gap-6 mt-4 p-4 rounded-xl bg-black/30 border border-white/10"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={isRunning ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          {isRunning ? (
            <Loader2 className="w-5 h-5 text-[#3D70B7]" />
          ) : (
            <Activity className="w-5 h-5 text-white/60" />
          )}
        </motion.div>
        <span className={isRunning ? 'text-[#3D70B7]' : 'text-white/60'}>
          {isRunning ? 'Pipeline Active' : 'Pipeline Idle'}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${CYAN}, #42BA90)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${successRate}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-sm text-white/60">
          {successRate.toFixed(0)}% pass
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[#42BA90]">
          <CheckCircle className="w-4 h-4" />
          <span>{passedCount}</span>
        </div>
        <div className="flex items-center gap-2 text-red-400">
          <XCircle className="w-4 h-4" />
          <span>{blockedCount}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function DevSecOps() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeSecurityType, setActiveSecurityType] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    successRate: 94.7,
    issuesBlocked: 1247,
    mttr: 4.2,
    deployFrequency: 12,
    buildsToday: 847,
  });
  const [passedCount, setPassedCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const gsapContainerRef = useRef<HTMLDivElement>(null);
  
  useGsapStagger(gsapContainerRef);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          buildsToday: prev.buildsToday + Math.floor(Math.random() * 3),
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const handleMetricsUpdate = useCallback((passed: boolean) => {
    if (passed) {
      setPassedCount(prev => prev + 1);
    } else {
      setBlockedCount(prev => prev + 1);
      setMetrics(prev => ({
        ...prev,
        issuesBlocked: prev.issuesBlocked + 1,
      }));
    }
  }, []);

  const runPipeline = () => {
    setIsRunning(true);
    setPassedCount(0);
    setBlockedCount(0);
  };

  const stopPipeline = () => {
    setIsRunning(false);
  };

  const [isResetting, setIsResetting] = useState(false);

  const resetPipeline = () => {
    setIsResetting(true);
    setIsRunning(false);
    setTimeout(() => {
      setPassedCount(0);
      setBlockedCount(0);
      setActiveSecurityType(null);
      setIsResetting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: '#0a0a1e' }}>
      <PurpleGalaxyBackground />
      <FlowingCodeBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C2C5A]/10 via-transparent to-[#1C2C5A]/10 z-[1]" />

      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/experience"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all"
          data-testid="link-back-experience"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Experience</span>
        </Link>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24" ref={gsapContainerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#42BA90]/10 border border-[#42BA90]/30 mb-6 gsap-fade-in">
            <motion.div
              animate={{ rotate: isRunning ? 360 : 0 }}
              transition={{ duration: 2, repeat: isRunning ? Infinity : 0, ease: 'linear' }}
            >
              <Shield className="w-4 h-4 text-[#3D70B7]" />
            </motion.div>
            <span className="text-[#3D70B7] text-sm font-medium">DevSecOps Pipeline</span>
            {isRunning && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-2 px-2 py-0.5 rounded-full bg-[#42BA90]/20 text-[#42BA90] text-xs"
              >
                LIVE
              </motion.span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gsap-fade-in">
            Security-Integrated
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#3D70B7] to-[#42BA90]">
              CI/CD Pipeline
            </span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto gsap-fade-in">
            Watch security seamlessly integrate into every stage of your development lifecycle
          </p>
        </motion.div>

        <div className="mb-8">
          <div 
            ref={canvasRef}
            className="w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 relative"
            data-testid="pipeline-canvas"
          >
            <div className="absolute inset-0 pointer-events-none z-10">
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: `
                    radial-gradient(circle at 20% 50%, ${CYAN}10 0%, transparent 40%),
                    radial-gradient(circle at 80% 50%, ${PURPLE}10 0%, transparent 40%)
                  `,
                }}
              />
            </div>
            
            <WebGLFallback>
              <Canvas camera={{ position: [3, 6, 18], fov: 50 }}>
                <CameraController />
                <PipelineScene 
                  isRunning={isRunning} 
                  activeSecurityType={activeSecurityType}
                  onMetricsUpdate={handleMetricsUpdate}
                />
              </Canvas>
            </WebGLFallback>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRunning ? stopPipeline : runPipeline}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                isRunning 
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30' 
                  : 'bg-gradient-to-r from-[#42BA90] to-[#42BA90] hover:opacity-90'
              }`}
              data-testid="button-run-pipeline"
            >
              {isRunning ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <XCircle className="w-5 h-5" />
                  </motion.div>
                  Stop Pipeline
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Run Pipeline
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetPipeline}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
              data-testid="button-reset-pipeline"
            >
              <motion.div
                animate={isResetting ? { rotate: -360 } : { rotate: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <RotateCcw className="w-5 h-5" />
              </motion.div>
              Reset
            </motion.button>
          </div>

          <BuildStatusIndicator 
            isRunning={isRunning}
            passedCount={passedCount}
            blockedCount={blockedCount}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center gsap-fade-in">Security Integration Points</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {securityIntegrations.map((integration, index) => (
              <InteractiveStageCard
                key={integration.id}
                stage={integration}
                index={index}
                isActive={activeSecurityType === integration.id}
                onClick={() => setActiveSecurityType(
                  activeSecurityType === integration.id ? null : integration.id
                )}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center gsap-fade-in">Live Pipeline Metrics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            <LiveMetric
              value={metrics.buildsToday}
              label="Builds Today"
              icon={GitBranch}
              color="#3D70B7"
              trend="up"
              trendLabel="+12% from yesterday"
            />
            <LiveMetric
              value={Math.round(metrics.successRate)}
              label="Success Rate %"
              icon={CheckCircle}
              color="#42BA90"
              trend="up"
              trendLabel="+2.3% this week"
            />
            <LiveMetric
              value={metrics.issuesBlocked}
              label="Issues Blocked"
              icon={Shield}
              color="#3D70B7"
              trend="down"
              trendLabel="-15% (good!)"
            />
            <LiveMetric
              value={metrics.deployFrequency}
              label="Deploys/Day"
              icon={Zap}
              color={PURPLE}
              trend="up"
              trendLabel="+8% this week"
            />
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-black/40 border border-white/10"
              data-testid="metric-mttr"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-white/60 text-sm">MTTR</span>
              </div>
              <div className="text-3xl font-bold text-yellow-400">
                {metrics.mttr}h
              </div>
              <div className="mt-2 text-xs text-[#42BA90]">
                ↓ -23% from last month
              </div>
            </motion.div>
          </div>
          
          <motion.div
            className="mt-6 p-6 rounded-2xl bg-black/40 border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4">Weekly Build Activity</h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {[65, 82, 78, 91, 85, 94, 88].map((val, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t relative group"
                  style={{
                    background: `linear-gradient(to top, ${CYAN}, ${PURPLE})`,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                >
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: CYAN }}
                  >
                    {val}%
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-white/40 mt-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#42BA90] to-[#42BA90] font-semibold hover:opacity-90 transition-all"
              data-testid="link-implement-devsecops"
            >
              Implement DevSecOps
            </Link>
            <Link
              href="/devsecops-pipeline"
              className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition-all"
              data-testid="link-view-detailed-pipeline"
            >
              View Detailed Pipeline
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
