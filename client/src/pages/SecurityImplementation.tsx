import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Text, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  ArrowLeft, Shield, Building2, CheckCircle2, Clock,
  Target, Layers, Settings, Users, TrendingUp, Check,
  Circle, ChevronRight, Sparkles, Hammer, HardHat, Save,
  ChevronDown, ChevronUp, Activity, Bug, ShieldCheck, Zap,
  AlertTriangle, Lock, Eye, Database
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { WebGLFallback } from '@/components/ui/webgl-fallback';

const CYAN = '#3D70B7';
const PURPLE = '#3D70B7';
const NAVY = 'hsl(222, 47%, 5%)';

interface BuildingBlock {
  id: number;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  scale: number;
  color: THREE.Color;
  placed: boolean;
  phaseIndex: number;
  label: string;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  color: THREE.Color;
}

const securityControls = [
  { name: 'Identity & Access', phase: 0, color: CYAN },
  { name: 'Network Security', phase: 0, color: CYAN },
  { name: 'Firewall Rules', phase: 1, color: '#00FF88' },
  { name: 'Encryption Layer', phase: 1, color: '#00FF88' },
  { name: 'SIEM Integration', phase: 2, color: '#FFD700' },
  { name: 'DLP Controls', phase: 2, color: '#FFD700' },
  { name: 'Endpoint Protection', phase: 2, color: '#FFD700' },
  { name: 'API Gateway', phase: 3, color: PURPLE },
  { name: 'WAF Config', phase: 3, color: PURPLE },
  { name: 'MFA System', phase: 4, color: '#FF6B6B' },
  { name: 'Security Training', phase: 4, color: '#FF6B6B' },
  { name: 'Monitoring Dashboard', phase: 5, color: '#3D70B7' },
];

function BuildingBlock3D({ block, isActive }: { block: BuildingBlock; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [arrived, setArrived] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (!block.placed) {
      meshRef.current.position.lerp(block.targetPosition, delta * 2);
      const distance = meshRef.current.position.distanceTo(block.targetPosition);
      if (distance < 0.05 && !arrived) {
        setArrived(true);
      }
    }

    meshRef.current.rotation.y += delta * 0.2;
    
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3 + block.id) * 0.1 + 0.2;
      glowRef.current.scale.setScalar(1.2 + pulse);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = isActive ? 0.2 : 0.05;
    }
  });

  return (
    <group>
      <mesh ref={glowRef} position={block.targetPosition}>
        <boxGeometry args={[1.1, 0.55, 1.1]} />
        <meshBasicMaterial color={block.color} transparent opacity={0.1} />
      </mesh>
      
      <Trail
        width={0.5}
        length={6}
        color={block.color}
        attenuation={(t) => t * t}
      >
        <mesh ref={meshRef} position={[block.position.x, block.position.y, block.position.z]}>
          <boxGeometry args={[0.9, 0.45, 0.9]} />
          <meshStandardMaterial
            color={block.color}
            emissive={block.color}
            emissiveIntensity={isActive ? 0.3 : 0.1}
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Trail>
    </group>
  );
}

function Crane({ position, isActive }: { position: [number, number, number]; isActive: boolean }) {
  const armRef = useRef<THREE.Group>(null);
  const cableRef = useRef<THREE.Mesh>(null);
  const hookRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (armRef.current && isActive) {
      armRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
    if (cableRef.current) {
      const swing = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      cableRef.current.rotation.z = swing;
    }
    if (hookRef.current) {
      hookRef.current.position.y = -3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 1, 0.5, 8]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.3} transparent opacity={0.6} />
      </mesh>
      
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[0.4, 6, 0.4]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.4} transparent opacity={0.6} />
      </mesh>
      
      <group ref={armRef} position={[0, 6, 0]}>
        <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.3, 4, 0.3]} />
          <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.4} transparent opacity={0.6} />
        </mesh>
        
        <mesh ref={cableRef} position={[3.5, -1.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.5} />
        </mesh>
        
        <mesh ref={hookRef} position={[3.5, -3, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.3} transparent opacity={0.7} />
        </mesh>
      </group>
      
      <pointLight position={[0, 7, 0]} color={CYAN} intensity={isActive ? 1 : 0.3} distance={10} />
    </group>
  );
}

function ParticleSystem({ particles }: { particles: Particle[] }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particles.length * 3);
    const col = new Float32Array(particles.length * 3);

    particles.forEach((p, i) => {
      pos[i * 3] = p.position.x;
      pos[i * 3 + 1] = p.position.y;
      pos[i * 3 + 2] = p.position.z;
      col[i * 3] = p.color.r;
      col[i * 3 + 1] = p.color.g;
      col[i * 3 + 2] = p.color.b;
    });

    return { positions: pos, colors: col };
  }, [particles]);

  useFrame(() => {
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      particles.forEach((p, i) => {
        p.position.add(p.velocity);
        p.life -= 0.02;
        posAttr.setXYZ(i, p.position.x, p.position.y, p.position.z);
      });
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.5} />
    </points>
  );
}

function BuildingFoundation() {
  return (
    <group position={[0, -2.5, 0]}>
      <mesh>
        <boxGeometry args={[8, 0.3, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.3} transparent opacity={0.5} />
      </mesh>
      
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <mesh key={`grid-x-${i}`} position={[x, 0.16, 0]}>
          <boxGeometry args={[0.02, 0.02, 8]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.15} />
        </mesh>
      ))}
      {[-3, -1.5, 0, 1.5, 3].map((z, i) => (
        <mesh key={`grid-z-${i}`} position={[0, 0.16, z]}>
          <boxGeometry args={[8, 0.02, 0.02]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.15} />
        </mesh>
      ))}
      
      {[[-3.5, -3.5], [-3.5, 3.5], [3.5, -3.5], [3.5, 3.5]].map(([x, z], i) => (
        <mesh key={`pillar-${i}`} position={[x, 0.5, z]}>
          <cylinderGeometry args={[0.15, 0.2, 1, 8]} />
          <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={0.2} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function SecurityFortress({ blocks, currentPhase, buildProgress }: {
  blocks: BuildingBlock[];
  currentPhase: number;
  buildProgress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <BuildingFoundation />
      
      {blocks.map((block, i) => (
        <BuildingBlock3D
          key={block.id}
          block={block}
          isActive={block.phaseIndex === currentPhase}
        />
      ))}
      
      {buildProgress > 0.3 && (
        <group position={[0, 0, 0]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={`wall-${i}`}
              position={[
                Math.cos((i * Math.PI) / 2) * 3.5,
                0,
                Math.sin((i * Math.PI) / 2) * 3.5,
              ]}
              rotation={[0, (i * Math.PI) / 2, 0]}
            >
              <boxGeometry args={[0.1, buildProgress * 4, 3]} />
              <meshStandardMaterial
                color={CYAN}
                transparent
                opacity={0.05}
                emissive={CYAN}
                emissiveIntensity={0.1}
              />
            </mesh>
          ))}
        </group>
      )}
      
      {buildProgress > 0.7 && (
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={CYAN}
            transparent
            opacity={(buildProgress - 0.7) * 0.15}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

function ConstructionScene({ buildProgress, currentPhase, isBuilding }: {
  buildProgress: number;
  currentPhase: number;
  isBuilding: boolean;
}) {
  const [blocks, setBlocks] = useState<BuildingBlock[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const initialBlocks: BuildingBlock[] = securityControls.map((control, i) => {
      const layer = Math.floor(i / 4);
      const posInLayer = i % 4;
      const angle = (posInLayer * Math.PI * 2) / 4;
      const radius = 1.5;

      return {
        id: i,
        position: new THREE.Vector3(
          Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5,
          8 + layer * 0.5,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 0.5
        ),
        targetPosition: new THREE.Vector3(
          Math.cos(angle) * radius,
          -2 + layer * 0.5,
          Math.sin(angle) * radius
        ),
        scale: 1,
        color: new THREE.Color(control.color),
        placed: false,
        phaseIndex: control.phase,
        label: control.name,
      };
    });

    setBlocks(initialBlocks);
  }, []);

  useEffect(() => {
    if (isBuilding) {
      const interval = setInterval(() => {
        setParticles((prev) => {
          const newParticles = [...prev];
          
          for (let i = 0; i < 2; i++) {
            newParticles.push({
              position: new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                Math.random() * 3 - 1,
                (Math.random() - 0.5) * 4
              ),
              velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                Math.random() * 0.05,
                (Math.random() - 0.5) * 0.05
              ),
              life: 1,
              color: new THREE.Color(Math.random() > 0.5 ? CYAN : PURPLE),
            });
          }

          return newParticles.filter((p) => p.life > 0).slice(-50);
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [isBuilding]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color={CYAN} />
      <pointLight position={[-10, 5, -10]} intensity={0.3} color={PURPLE} />
      <spotLight
        position={[0, 15, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={isBuilding ? 1 : 0.3}
        color={CYAN}
      />

      <SecurityFortress
        blocks={blocks}
        currentPhase={currentPhase}
        buildProgress={buildProgress}
      />

      <Crane position={[5, -2.3, 5]} isActive={isBuilding} />
      <Crane position={[-5, -2.3, -5]} isActive={isBuilding} />

      <ParticleSystem particles={particles} />

      <Stars radius={100} depth={50} count={1000} factor={3} fade speed={0.3} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.7, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={NAVY} transparent opacity={0.3} />
      </mesh>
    </>
  );
}

function CameraController() {
  const { camera } = useThree();

  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 2 + 8;
    camera.position.y = 5 + Math.sin(state.clock.elapsedTime * 0.15) * 0.5;
    camera.position.z = Math.cos(state.clock.elapsedTime * 0.1) * 2 + 8;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

const implementationPhases = [
  {
    id: 'assessment',
    name: 'Assessment & Planning',
    icon: Target,
    duration: '2-3 weeks',
    description: 'Comprehensive security assessment and strategic planning phase to identify gaps and create roadmap.',
    deliverables: ['Gap Analysis Report', 'Risk Assessment', 'Project Roadmap', 'Resource Plan'],
    dependencies: ['Business Requirements', 'Stakeholder Sign-off'],
    tasks: ['Stakeholder interviews', 'Asset inventory', 'Threat modeling', 'Budget estimation'],
    color: CYAN,
  },
  {
    id: 'architecture',
    name: 'Architecture Design',
    icon: Layers,
    duration: '3-4 weeks',
    description: 'Design the security architecture framework with detailed network and data flow specifications.',
    deliverables: ['Security Architecture Doc', 'Network Diagrams', 'Data Flow Maps', 'Tool Selection'],
    dependencies: ['Assessment Completion', 'Budget Approval'],
    tasks: ['Zero-trust design', 'Network segmentation', 'Encryption strategy', 'Vendor evaluation'],
    color: '#00FF88',
  },
  {
    id: 'deployment',
    name: 'Core Controls Deployment',
    icon: Settings,
    duration: '6-8 weeks',
    description: 'Deploy and configure essential security controls including IAM, firewalls, and monitoring systems.',
    deliverables: ['IAM Implementation', 'Firewall Configuration', 'Encryption Setup', 'SIEM Deployment'],
    dependencies: ['Architecture Sign-off', 'Infrastructure Ready'],
    tasks: ['SSO configuration', 'Firewall rules', 'Certificate management', 'Log aggregation'],
    color: '#FFD700',
  },
  {
    id: 'integration',
    name: 'Integration & Testing',
    icon: Building2,
    duration: '4-5 weeks',
    description: 'Integrate security controls and conduct comprehensive testing including penetration tests.',
    deliverables: ['Integration Tests', 'Penetration Test Report', 'Vulnerability Assessment', 'Performance Report'],
    dependencies: ['Core Controls Active', 'Test Environment'],
    tasks: ['API integration', 'Penetration testing', 'Load testing', 'Compliance validation'],
    color: PURPLE,
  },
  {
    id: 'training',
    name: 'User Training & Rollout',
    icon: Users,
    duration: '3-4 weeks',
    description: 'Train end users and security team, then execute phased rollout across the organization.',
    deliverables: ['Training Materials', 'User Documentation', 'Rollout Plan', 'Support Procedures'],
    dependencies: ['Testing Complete', 'Training Schedule'],
    tasks: ['Training sessions', 'Documentation', 'Phased deployment', 'Support setup'],
    color: '#FF6B6B',
  },
  {
    id: 'improvement',
    name: 'Continuous Improvement',
    icon: TrendingUp,
    duration: 'Ongoing',
    description: 'Establish continuous monitoring, incident response, and security optimization processes.',
    deliverables: ['Monitoring Dashboard', 'Incident Playbooks', 'Metrics Reports', 'Optimization Plan'],
    dependencies: ['Full Deployment', 'Baseline Metrics'],
    tasks: ['24/7 monitoring', 'Incident response', 'Quarterly reviews', 'Threat intelligence'],
    color: '#3D70B7',
  },
];

const deliverables = [
  { id: 1, name: 'Security Policy Framework', phase: 0, completed: true },
  { id: 2, name: 'Risk Assessment Report', phase: 0, completed: true },
  { id: 3, name: 'Network Security Architecture', phase: 1, completed: true },
  { id: 4, name: 'Identity Management Design', phase: 1, completed: true },
  { id: 5, name: 'Firewall Implementation', phase: 2, completed: true },
  { id: 6, name: 'SIEM Configuration', phase: 2, completed: false },
  { id: 7, name: 'Endpoint Protection Deployment', phase: 2, completed: false },
  { id: 8, name: 'Penetration Testing', phase: 3, completed: false },
  { id: 9, name: 'Integration Testing Report', phase: 3, completed: false },
  { id: 10, name: 'Security Awareness Training', phase: 4, completed: false },
  { id: 11, name: 'User Documentation', phase: 4, completed: false },
  { id: 12, name: 'Continuous Monitoring Setup', phase: 5, completed: false },
];

const STORAGE_KEY = 'security-implementation-checklist';

function loadChecklistState(): { id: number; completed: boolean }[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load checklist state');
  }
  return [];
}

function saveChecklistState(items: { id: number; completed: boolean }[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map(({ id, completed }) => ({ id, completed }))));
  } catch (e) {
    console.warn('Failed to save checklist state');
  }
}

function AnimatedCounter({ value, duration = 2000, suffix = '' }: { value: number; duration?: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    
    const startTime = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (value - startValue) * easeOut);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };
    
    const timeout = setTimeout(() => {
      animate();
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [value, duration, hasAnimated]);

  return <span>{displayValue}{suffix}</span>;
}

function MetricCard({ icon: Icon, label, value, suffix = '', color, delay = 0 }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: number;
  suffix?: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      className="relative p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group hover:bg-white/10 transition-all"
      data-testid={`metric-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${color}10, transparent)` }} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <span className="text-sm text-white/60">{label}</span>
        </div>
        
        <div className="text-3xl font-bold" style={{ color }}>
          <AnimatedCounter value={value} suffix={suffix} />
        </div>
        
        <motion.div
          className="absolute bottom-0 left-0 h-1 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: delay + 0.5, duration: 1, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

function PhaseProgressIndicator({ phases, currentPhase, buildProgress }: {
  phases: typeof implementationPhases;
  currentPhase: number;
  buildProgress: number;
}) {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
      {phases.map((phase, index) => {
        const isComplete = index < currentPhase;
        const isActive = index === currentPhase;
        const phaseProgress = isComplete ? 100 : isActive ? Math.round(buildProgress * 100) : 0;
        
        return (
          <motion.div
            key={phase.id}
            className="flex items-center gap-2 flex-shrink-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isComplete
                  ? 'bg-green-500 text-white'
                  : isActive
                  ? 'bg-gradient-to-r from-[#42BA90] to-cyan-500 text-white'
                  : 'bg-white/10 text-white/40'
              }`}
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {isComplete ? <Check className="w-4 h-4" /> : index + 1}
            </motion.div>
            
            {index < phases.length - 1 && (
              <div className="w-8 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#42BA90] to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${isComplete ? 100 : isActive ? phaseProgress : 0}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function SecurityImplementation() {
  const [currentPhase, setCurrentPhase] = useState(2);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0.42);
  const [deliverableItems, setDeliverableItems] = useState(() => {
    const savedState = loadChecklistState();
    if (savedState.length > 0) {
      return deliverables.map(d => {
        const saved = savedState.find(s => s.id === d.id);
        return saved ? { ...d, completed: saved.completed } : d;
      });
    }
    return deliverables;
  });
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [phaseTransition, setPhaseTransition] = useState(false);
  const isMobile = useIsMobile();

  const completedCount = deliverableItems.filter((d) => d.completed).length;
  const progressPercentage = Math.round((completedCount / deliverableItems.length) * 100);
  
  const controlsImplemented = Math.floor(buildProgress * securityControls.length);
  const vulnerabilitiesFixed = Math.floor(buildProgress * 47);
  const complianceScore = Math.floor(buildProgress * 98);

  const toggleDeliverable = (id: number) => {
    setDeliverableItems((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d));
      saveChecklistState(updated);
      setLastSaved(new Date());
      return updated;
    });
  };

  useEffect(() => {
    if (isBuilding) {
      const interval = setInterval(() => {
        setBuildProgress((prev) => {
          const newProgress = prev + 0.005;
          
          const newPhase = Math.min(5, Math.floor(newProgress * 6));
          if (newPhase > currentPhase && newPhase <= 5) {
            setPhaseTransition(true);
            setTimeout(() => {
              setCurrentPhase(newPhase);
              setPhaseTransition(false);
            }, 300);
          }
          
          if (newProgress >= 1) {
            setIsBuilding(false);
            return 1;
          }
          return newProgress;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isBuilding, currentPhase]);

  const startBuild = () => {
    setIsBuilding(true);
  };

  const resetBuild = () => {
    setBuildProgress(0);
    setIsBuilding(false);
    setCurrentPhase(0);
    setPhaseTransition(false);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: NAVY }}>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-[#1C2C5A]/10" />

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

      <div className="relative z-10 container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#42BA90]/10 border border-[#42BA90]/30 mb-6">
            <HardHat className="w-4 h-4 text-[#3D70B7]" />
            <span className="text-[#3D70B7] text-sm font-medium">Security Implementation</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Building Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#3D70B7] to-cyan-400">
              Security Fortress
            </span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Watch as enterprise security controls are systematically implemented, tested, and integrated
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
            <Activity className="w-5 h-5 text-[#3D70B7]" />
            Live Metrics Dashboard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              icon={ShieldCheck}
              label="Controls Implemented"
              value={controlsImplemented}
              suffix={`/${securityControls.length}`}
              color={CYAN}
              delay={0}
            />
            <MetricCard
              icon={Bug}
              label="Vulnerabilities Fixed"
              value={vulnerabilitiesFixed}
              color="#22c55e"
              delay={0.1}
            />
            <MetricCard
              icon={Shield}
              label="Compliance Score"
              value={complianceScore}
              suffix="%"
              color={PURPLE}
              delay={0.2}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div
            className="w-full h-[350px] rounded-2xl overflow-hidden border border-white/10 bg-black/20 relative"
            style={{ opacity: 0.85 }}
            data-testid="construction-canvas"
          >
            <WebGLFallback>
              <Canvas camera={{ position: [10, 6, 10], fov: 50 }}>
                <CameraController />
                <ConstructionScene
                  buildProgress={buildProgress}
                  currentPhase={currentPhase}
                  isBuilding={isBuilding}
                />
              </Canvas>
            </WebGLFallback>

            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isBuilding ? () => setIsBuilding(false) : startBuild}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#42BA90] to-cyan-500 hover:from-[#3D70B7] hover:to-cyan-400 transition-all shadow-lg shadow-[#42BA90]/25"
                  data-testid="button-build"
                >
                  {isBuilding ? (
                    <>
                      <Hammer className="w-4 h-4 animate-bounce" />
                      Building...
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      Start Build
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetBuild}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
                  data-testid="button-reset"
                >
                  Reset
                </motion.button>
              </div>

              <div className="flex items-center gap-4 bg-black/60 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/10">
                <span className="text-sm text-white/60">Build Progress</span>
                <div className="w-32 sm:w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#42BA90] to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${buildProgress * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-sm font-semibold text-[#3D70B7]">
                  {Math.round(buildProgress * 100)}%
                </span>
              </div>
            </div>
            
            <AnimatePresence>
              {phaseTransition && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#42BA90]/20 to-cyan-500/20 border border-[#42BA90]/50"
                  >
                    <Sparkles className="w-6 h-6 text-[#3D70B7] animate-pulse" />
                    <span className="text-xl font-bold text-white">Phase Complete!</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Layers className="w-6 h-6 text-[#3D70B7]" />
            Implementation Phases
          </h2>
          
          <PhaseProgressIndicator
            phases={implementationPhases}
            currentPhase={currentPhase}
            buildProgress={buildProgress}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {implementationPhases.map((phase, index) => {
              const Icon = phase.icon;
              const isActive = index === currentPhase;
              const isComplete = index < currentPhase;
              const phaseProgress = isComplete ? 100 : isActive ? Math.round(buildProgress * 100) : 0;
              const isExpanded = selectedPhase === index;

              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  layout
                  onClick={() => setSelectedPhase(isExpanded ? null : index)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-[#42BA90]/20 to-cyan-500/20 border-[#42BA90]/50 shadow-lg shadow-[#42BA90]/10'
                      : isComplete
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                  data-testid={`phase-card-${phase.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <motion.div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${phase.color}20` }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-6 h-6" style={{ color: phase.color }} />
                    </motion.div>
                    <div className="flex items-center gap-2">
                      {isComplete ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        </motion.div>
                      ) : isActive ? (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[#3D70B7] animate-pulse" />
                          <span className="text-xs font-semibold text-[#3D70B7] animate-pulse">ACTIVE</span>
                        </div>
                      ) : (
                        <Circle className="w-6 h-6 text-white/30" />
                      )}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-white/40" />
                      </motion.div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-1">{phase.name}</h3>
                  
                  <p className="text-sm text-white/50 mb-3 line-clamp-2">{phase.description}</p>

                  <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{phase.duration}</span>
                    {isActive && (
                      <motion.span
                        className="ml-2 text-xs text-[#3D70B7] font-medium"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        {phaseProgress}% complete
                      </motion.span>
                    )}
                  </div>

                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: phase.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${phaseProgress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-yellow-400" />
                              Key Tasks
                            </h4>
                            <ul className="space-y-1.5">
                              {phase.tasks.map((task, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="flex items-center gap-2 text-sm text-white/60"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: phase.color }} />
                                  {task}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                              <Database className="w-4 h-4 text-[#3D70B7]" />
                              Deliverables
                            </h4>
                            <ul className="space-y-1.5">
                              {phase.deliverables.map((d, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="flex items-center gap-2 text-sm text-white/60"
                                >
                                  <ChevronRight className="w-3 h-3 text-[#3D70B7]" />
                                  {d}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                              <Lock className="w-4 h-4 text-cyan-400" />
                              Dependencies
                            </h4>
                            <ul className="space-y-1.5">
                              {phase.dependencies.map((d, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="flex items-center gap-2 text-sm text-white/60"
                                >
                                  <AlertTriangle className="w-3 h-3 text-yellow-400" />
                                  {d}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-[#3D70B7]" />
            Implementation Timeline
          </h2>

          {isMobile ? (
            <div className="space-y-3">
              {implementationPhases.map((phase, index) => {
                const Icon = phase.icon;
                const isActive = index === currentPhase;
                const isComplete = index < currentPhase;
                const phaseProgress = isComplete ? 100 : isActive ? Math.round(buildProgress * 100) : 0;

                return (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className={`p-4 rounded-xl border ${
                      isActive
                        ? 'bg-gradient-to-r from-[#42BA90]/20 to-cyan-500/20 border-[#42BA90]/50'
                        : isComplete
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                    data-testid={`timeline-row-${phase.id}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${phase.color}20` }}>
                        <Icon className="w-4 h-4" style={{ color: phase.color }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{phase.name}</h4>
                        <span className="text-xs text-white/50">{phase.duration}</span>
                      </div>
                      {isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : isActive ? (
                        <Sparkles className="w-5 h-5 text-[#3D70B7] animate-pulse" />
                      ) : (
                        <Circle className="w-5 h-5 text-white/30" />
                      )}
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: phase.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${phaseProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="flex items-center mb-4 text-sm text-white/40">
                  <div className="w-48 flex-shrink-0">Phase</div>
                  <div className="flex-1 flex">
                    {['Week 1-2', 'Week 3-4', 'Week 5-8', 'Week 9-12', 'Week 13-16', 'Week 17+'].map((w, i) => (
                      <div key={i} className="flex-1 text-center">{w}</div>
                    ))}
                  </div>
                </div>

                {implementationPhases.map((phase, index) => {
                  const isActive = index === currentPhase;
                  const isComplete = index < currentPhase;
                  const startWeek = index * 2;
                  const duration = phase.duration === 'Ongoing' ? 6 : parseInt(phase.duration) || 3;

                  return (
                    <div key={phase.id} className="flex items-center mb-3" data-testid={`timeline-row-${phase.id}`}>
                      <div className="w-48 flex-shrink-0 flex items-center gap-2">
                        {isComplete ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : isActive ? (
                          <Sparkles className="w-4 h-4 text-[#3D70B7]" />
                        ) : (
                          <Circle className="w-4 h-4 text-white/30" />
                        )}
                        <span className={`text-sm ${isActive ? 'text-white font-semibold' : 'text-white/60'}`}>
                          {phase.name}
                        </span>
                      </div>
                      <div className="flex-1 flex relative h-8">
                        <motion.div
                          className="absolute h-6 rounded-lg flex items-center px-3"
                          style={{
                            left: `${(startWeek / 12) * 100}%`,
                            width: `${(duration / 12) * 100}%`,
                            backgroundColor: isComplete ? '#22c55e40' : isActive ? `${phase.color}40` : '#ffffff10',
                            borderLeft: `3px solid ${isComplete ? '#22c55e' : phase.color}`,
                          }}
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{ delay: 0.1 * index, duration: 0.5 }}
                        >
                          <span className="text-xs text-white/80 whitespace-nowrap">{phase.duration}</span>
                        </motion.div>

                        {isComplete && (
                          <motion.div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-green-500 border-2 border-green-400 flex items-center justify-center"
                            style={{ left: `${((startWeek + duration) / 12) * 100}%` }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 * index }}
                          >
                            <Check className="w-2 h-2 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#3D70B7]" />
              Deliverables Checklist
            </h2>
            <div className="flex flex-wrap items-center gap-3 bg-white/5 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/10">
              <span className="text-white/60">Progress:</span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D70B7] to-cyan-400">
                {progressPercentage}%
              </span>
              <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#42BA90] to-cyan-500"
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <AnimatePresence>
                {lastSaved && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-1 text-xs text-green-400"
                  >
                    <Save className="w-3 h-3" />
                    Saved
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {deliverableItems.map((item, index) => {
              const phase = implementationPhases[item.phase];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => toggleDeliverable(item.id)}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    item.completed
                      ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  data-testid={`deliverable-${item.id}`}
                >
                  <motion.div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      item.completed ? 'bg-green-500' : 'bg-white/10'
                    }`}
                    whileTap={{ scale: 0.9 }}
                    animate={item.completed ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {item.completed && <Check className="w-4 h-4 text-white" />}
                  </motion.div>

                  <div className="flex-1">
                    <span className={item.completed ? 'line-through text-white/50' : 'text-white'}>
                      {item.name}
                    </span>
                  </div>

                  <div
                    className="px-2 py-1 rounded-md text-xs"
                    style={{ backgroundColor: `${phase.color}20`, color: phase.color }}
                  >
                    {phase.name.split(' ')[0]}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
