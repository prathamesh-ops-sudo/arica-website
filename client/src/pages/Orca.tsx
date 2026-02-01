import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, MeshTransmissionMaterial, Environment, Stars } from '@react-three/drei';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  FileText, 
  Lock,
  Server,
  Monitor,
  Cpu,
  Database,
  Eye,
  Terminal,
  Bug,
  ShieldCheck,
  FileSearch,
  ClipboardCheck,
  Home,
  Info,
  Briefcase,
  Mail
} from 'lucide-react';
import { AnimeNavBar } from '@/components/ui/anime-navbar';
import { isWebGLAvailable } from '@/lib/webgl-utils';

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "About", url: "/about", icon: Info },
  { name: "Services", url: "/services", icon: Briefcase },
  { name: "Contact", url: "/contact", icon: Mail },
];

interface SceneProps {
  scrollProgress: number;
}

function OfficeDesk({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[-0.6, 0.2, 0]}>
        <boxGeometry args={[0.05, 0.4, 0.6]} />
        <meshStandardMaterial color="#1a1a2a" />
      </mesh>
      <mesh position={[0.6, 0.2, 0]}>
        <boxGeometry args={[0.05, 0.4, 0.6]} />
        <meshStandardMaterial color="#1a1a2a" />
      </mesh>
    </group>
  );
}

function OfficeMonitor({ 
  position, 
  showError = false,
  isTarget = false,
  glowIntensity = 0
}: { 
  position: [number, number, number]; 
  showError?: boolean;
  isTarget?: boolean;
  glowIntensity?: number;
}) {
  const screenRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      if (showError) {
        material.emissive = new THREE.Color('#ff0000');
        material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
      } else if (isTarget) {
        material.emissive = new THREE.Color('#00D4FF');
        material.emissiveIntensity = glowIntensity;
      } else {
        material.emissive = new THREE.Color('#00D4FF');
        material.emissiveIntensity = 0.1;
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={frameRef}>
        <boxGeometry args={[0.8, 0.5, 0.05]} />
        <meshStandardMaterial color="#111122" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={screenRef} position={[0, 0, 0.03]}>
        <planeGeometry args={[0.7, 0.4]} />
        <meshStandardMaterial 
          color={showError ? "#220000" : "#001122"} 
          emissive={showError ? "#ff0000" : "#00D4FF"}
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.04, 0.1]} />
        <meshStandardMaterial color="#222233" metalness={0.5} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[0.15, 0.02, 0.1]} />
        <meshStandardMaterial color="#222233" metalness={0.5} />
      </mesh>
    </group>
  );
}

function DataStream({ startPos, endPos, color = "#00D4FF", speed = 1 }: {
  startPos: [number, number, number];
  endPos: [number, number, number];
  color?: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const progress = useRef(Math.random());

  useFrame((state, delta) => {
    if (ref.current) {
      progress.current = (progress.current + delta * speed * 0.5) % 1;
      const t = progress.current;
      ref.current.position.x = startPos[0] + (endPos[0] - startPos[0]) * t;
      ref.current.position.y = startPos[1] + (endPos[1] - startPos[1]) * t;
      ref.current.position.z = startPos[2] + (endPos[2] - startPos[2]) * t;
      ref.current.scale.setScalar(0.5 + Math.sin(t * Math.PI) * 0.5);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function SecurityShield({ position, scale = 1, color = "#00D4FF" }: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[0.3, 1]} />
        <MeshTransmissionMaterial
          color={color}
          thickness={0.2}
          roughness={0.1}
          transmission={0.9}
          ior={1.5}
          chromaticAberration={0.03}
        />
      </mesh>
    </Float>
  );
}

function ScanningBeam({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current && active) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 2;
      const material = ref.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
    }
  });

  if (!active) return null;

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 0.05]} />
      <meshBasicMaterial color="#00D4FF" transparent opacity={0.5} />
    </mesh>
  );
}

function BinaryRain({ count = 100 }: { count?: number }) {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          Math.random() * 10,
          (Math.random() - 0.5) * 10
        ] as [number, number, number],
        speed: 0.5 + Math.random() * 1.5,
        char: Math.random() > 0.5 ? '1' : '0'
      });
    }
    return temp;
  }, [count]);

  return (
    <group>
      {particles.map((p, i) => (
        <BinaryChar key={i} initialPos={p.position} speed={p.speed} char={p.char} />
      ))}
    </group>
  );
}

function BinaryChar({ initialPos, speed, char }: {
  initialPos: [number, number, number];
  speed: number;
  char: string;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.y -= delta * speed;
      if (ref.current.position.y < -5) {
        ref.current.position.y = 5;
      }
    }
  });

  return (
    <group ref={ref} position={initialPos}>
      <Text
        fontSize={0.1}
        color="#00D4FF"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.6}
      >
        {char}
      </Text>
    </group>
  );
}

function CyberGrid() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <gridHelper args={[50, 50, '#00D4FF', '#00D4FF']} />
      <mesh>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#000510" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function ForensicsScene({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#9944ff" />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, Math.PI / 4]}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <Float key={i} speed={1 + i * 0.2} floatIntensity={0.3}>
            <mesh position={[Math.cos(angle) * 2.5, Math.sin(angle) * 0.5, Math.sin(angle) * 2.5]}>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial 
                color={i % 2 === 0 ? "#00D4FF" : "#9944ff"} 
                emissive={i % 2 === 0 ? "#00D4FF" : "#9944ff"}
                emissiveIntensity={0.5}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

const incidentStreamPositions = Array.from({ length: 20 }).map((_, i) => ({
  startPos: [
    (Math.sin(i * 1.7) * 0.5) * 10,
    (Math.cos(i * 2.3) * 0.5) * 6,
    -8
  ] as [number, number, number],
  speed: 1 + (i % 5) * 0.4
}));

function MainScene({ scrollProgress }: SceneProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  const scene = useMemo(() => {
    if (scrollProgress < 0.15) return 'office';
    if (scrollProgress < 0.25) return 'error';
    if (scrollProgress < 0.35) return 'zoom';
    if (scrollProgress < 0.50) return 'iso';
    if (scrollProgress < 0.65) return 'vapt';
    if (scrollProgress < 0.80) return 'incident';
    if (scrollProgress < 0.90) return 'forensics';
    return 'report';
  }, [scrollProgress]);

  useFrame(() => {
    if (scrollProgress < 0.15) {
      camera.position.lerp(new THREE.Vector3(0, 2, 8), 0.05);
      camera.lookAt(0, 0, 0);
    } else if (scrollProgress < 0.25) {
      camera.position.lerp(new THREE.Vector3(0, 1.5, 5), 0.05);
      camera.lookAt(0, 0.5, 0);
    } else if (scrollProgress < 0.35) {
      const zoomProgress = (scrollProgress - 0.25) / 0.1;
      camera.position.lerp(new THREE.Vector3(0, 0.5, 3 - zoomProgress * 2.5), 0.08);
      camera.lookAt(0, 0.5, 0);
    } else if (scrollProgress < 0.50) {
      camera.position.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      camera.lookAt(0, 0, -5);
    } else if (scrollProgress < 0.65) {
      camera.position.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      camera.lookAt(0, 0, -5);
    } else if (scrollProgress < 0.80) {
      camera.position.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      camera.lookAt(0, 0, -5);
    } else if (scrollProgress < 0.90) {
      camera.position.lerp(new THREE.Vector3(0, 0, 3), 0.05);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.lerp(new THREE.Vector3(0, 2, 6), 0.05);
      camera.lookAt(0, 0, 0);
    }
  });

  const showError = scrollProgress >= 0.15 && scrollProgress < 0.35;
  const isZooming = scrollProgress >= 0.25 && scrollProgress < 0.35;
  const insideSystem = scrollProgress >= 0.35;

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00D4FF" />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#9944ff" />
      
      <Stars radius={100} depth={50} count={insideSystem ? 2000 : 500} factor={4} saturation={0} fade speed={1} />
      
      {!insideSystem && (
        <group ref={groupRef}>
          <OfficeDesk position={[-2, 0, -1]} rotation={0.2} />
          <OfficeDesk position={[0, 0, 0]} />
          <OfficeDesk position={[2, 0, -1]} rotation={-0.2} />
          
          <OfficeMonitor position={[-2, 0.7, -1]} />
          <OfficeMonitor position={[0, 0.7, 0]} showError={showError} isTarget={isZooming} glowIntensity={isZooming ? 1 : 0} />
          <OfficeMonitor position={[2, 0.7, -1]} />
          
          <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#0a0a15" />
          </mesh>
          
          <mesh position={[0, 5, -5]}>
            <planeGeometry args={[20, 10]} />
            <meshStandardMaterial color="#050510" />
          </mesh>
        </group>
      )}

      {insideSystem && (
        <group>
          <CyberGrid />
          <BinaryRain count={scrollProgress > 0.5 ? 150 : 50} />
          
          {scene === 'iso' && (
            <>
              <SecurityShield position={[-3, 1, -3]} scale={1.5} color="#00D4FF" />
              <SecurityShield position={[3, 1.5, -4]} scale={1.2} color="#9944ff" />
              <SecurityShield position={[0, 2, -5]} scale={1.8} color="#00ff88" />
              {Array.from({ length: 5 }).map((_, i) => (
                <DataStream 
                  key={i}
                  startPos={[-5 + i * 2.5, 3, -3]}
                  endPos={[-5 + i * 2.5, -2, -3]}
                  color={i % 2 === 0 ? "#00D4FF" : "#9944ff"}
                  speed={1 + i * 0.3}
                />
              ))}
            </>
          )}
          
          {scene === 'vapt' && (
            <>
              <ScanningBeam active={true} />
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const radius = 3;
                return (
                  <Float key={i} speed={2} floatIntensity={0.5}>
                    <mesh position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius - 5]}>
                      <octahedronGeometry args={[0.2]} />
                      <meshStandardMaterial 
                        color={i < 4 ? "#ff4444" : i < 8 ? "#ffaa00" : "#00ff88"}
                        emissive={i < 4 ? "#ff4444" : i < 8 ? "#ffaa00" : "#00ff88"}
                        emissiveIntensity={0.5}
                      />
                    </mesh>
                  </Float>
                );
              })}
              <mesh position={[0, 0, -5]}>
                <torusGeometry args={[3, 0.02, 16, 100]} />
                <meshBasicMaterial color="#00D4FF" transparent opacity={0.5} />
              </mesh>
              <mesh position={[0, 0, -5]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[3, 0.02, 16, 100]} />
                <meshBasicMaterial color="#9944ff" transparent opacity={0.5} />
              </mesh>
            </>
          )}
          
          {scene === 'incident' && (
            <>
              <Float speed={1.5} floatIntensity={0.8}>
                <mesh position={[0, 0, -5]}>
                  <boxGeometry args={[2, 2, 2]} />
                  <meshStandardMaterial 
                    color="#ff4444" 
                    emissive="#ff0000"
                    emissiveIntensity={0.3}
                    wireframe
                  />
                </mesh>
              </Float>
              {incidentStreamPositions.map((stream, i) => (
                <DataStream 
                  key={i}
                  startPos={stream.startPos}
                  endPos={[0, 0, -5]}
                  color="#ff4444"
                  speed={stream.speed}
                />
              ))}
              <SecurityShield position={[-2, 1, -4]} scale={1} color="#00D4FF" />
              <SecurityShield position={[2, 1, -4]} scale={1} color="#00D4FF" />
              <SecurityShield position={[0, -1, -4]} scale={1} color="#9944ff" />
            </>
          )}
          
          {scene === 'forensics' && (
            <ForensicsScene progress={scrollProgress} />
          )}
          
          {scene === 'report' && (
            <>
              <Float speed={1} floatIntensity={0.3}>
                <mesh position={[0, 0, -3]}>
                  <boxGeometry args={[2.5, 3.5, 0.1]} />
                  <meshStandardMaterial 
                    color="#112233" 
                    emissive="#00D4FF"
                    emissiveIntensity={0.1}
                  />
                </mesh>
              </Float>
              <Text
                position={[0, 1, -2.9]}
                fontSize={0.2}
                color="#00D4FF"
                anchorX="center"
              >
                SECURITY REPORT
              </Text>
              <Text
                position={[0, 0.5, -2.9]}
                fontSize={0.1}
                color="#00ff88"
                anchorX="center"
              >
                ✓ ISO 27001 COMPLIANT
              </Text>
              <Text
                position={[0, 0.2, -2.9]}
                fontSize={0.1}
                color="#00ff88"
                anchorX="center"
              >
                ✓ VAPT COMPLETED
              </Text>
              <Text
                position={[0, -0.1, -2.9]}
                fontSize={0.1}
                color="#00ff88"
                anchorX="center"
              >
                ✓ INCIDENT RESOLVED
              </Text>
              <Text
                position={[0, -0.4, -2.9]}
                fontSize={0.1}
                color="#00ff88"
                anchorX="center"
              >
                ✓ FORENSICS COMPLETE
              </Text>
              <SecurityShield position={[0, -1.2, -2.5]} scale={1.5} color="#00D4FF" />
            </>
          )}
        </group>
      )}
      
      <Environment preset="night" />
    </>
  );
}

function ScrollIndicator({ progress }: { progress: number }) {
  const stages = [
    { id: 'office', label: 'Office', icon: Monitor, range: [0, 0.15] },
    { id: 'error', label: 'Alert', icon: AlertTriangle, range: [0.15, 0.25] },
    { id: 'dive', label: 'Dive In', icon: Eye, range: [0.25, 0.35] },
    { id: 'iso', label: 'ISO Audit', icon: ClipboardCheck, range: [0.35, 0.50] },
    { id: 'vapt', label: 'VAPT', icon: Bug, range: [0.50, 0.65] },
    { id: 'incident', label: 'Incident', icon: Shield, range: [0.65, 0.80] },
    { id: 'forensics', label: 'Forensics', icon: FileSearch, range: [0.80, 0.90] },
    { id: 'report', label: 'Report', icon: FileText, range: [0.90, 1] },
  ];

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="flex flex-col gap-3">
        {stages.map((stage, i) => {
          const isActive = progress >= stage.range[0] && progress < stage.range[1];
          const isCompleted = progress >= stage.range[1];
          const Icon = stage.icon;
          
          return (
            <motion.div
              key={stage.id}
              className={`flex items-center gap-3 transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-40'
              }`}
              animate={{
                x: isActive ? 10 : 0,
                scale: isActive ? 1.1 : 1
              }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                isCompleted 
                  ? 'bg-[#00ff88]/20 border-[#00ff88] text-[#00ff88]'
                  : isActive 
                    ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.5)]'
                    : 'bg-transparent border-white/20 text-white/40'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span className={`text-sm font-medium transition-all duration-300 ${
                isActive ? 'text-[#00D4FF]' : isCompleted ? 'text-[#00ff88]' : 'text-white/40'
              }`}>
                {stage.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function SceneOverlay({ scrollProgress }: { scrollProgress: number }) {
  const getSceneInfo = () => {
    if (scrollProgress < 0.15) {
      return {
        title: "A Normal Day at the Office",
        subtitle: "Business as usual...",
        icon: Monitor,
        color: "#00D4FF"
      };
    }
    if (scrollProgress < 0.25) {
      return {
        title: "⚠️ SECURITY ALERT DETECTED",
        subtitle: "Something's wrong. A system has been compromised.",
        icon: AlertTriangle,
        color: "#ff4444"
      };
    }
    if (scrollProgress < 0.35) {
      return {
        title: "Entering the System",
        subtitle: "ARICA Security Team deploying...",
        icon: Terminal,
        color: "#9944ff"
      };
    }
    if (scrollProgress < 0.50) {
      return {
        title: "ISO 27001 Compliance Check",
        subtitle: "Auditing security controls and policies",
        icon: ClipboardCheck,
        color: "#00D4FF"
      };
    }
    if (scrollProgress < 0.65) {
      return {
        title: "VAPT in Progress",
        subtitle: "Scanning for vulnerabilities and threats",
        icon: Bug,
        color: "#ffaa00"
      };
    }
    if (scrollProgress < 0.80) {
      return {
        title: "Incident Response",
        subtitle: "Containing and neutralizing the threat",
        icon: Shield,
        color: "#ff4444"
      };
    }
    if (scrollProgress < 0.90) {
      return {
        title: "Digital Forensics",
        subtitle: "Analyzing evidence and tracing the attack",
        icon: FileSearch,
        color: "#9944ff"
      };
    }
    return {
      title: "Mission Complete",
      subtitle: "Security restored. Full report delivered.",
      icon: ShieldCheck,
      color: "#00ff88"
    };
  };

  const scene = getSceneInfo();
  const Icon = scene.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none"
      >
        <div className="bg-[#000a15]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-6 max-w-lg">
          <motion.div 
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ 
              backgroundColor: `${scene.color}20`,
              boxShadow: `0 0 30px ${scene.color}40`
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className="w-8 h-8" style={{ color: scene.color }} />
          </motion.div>
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: scene.color }}
          >
            {scene.title}
          </h2>
          <p className="text-white/70">{scene.subtitle}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-white/10">
      <motion.div 
        className="h-full bg-gradient-to-r from-[#00D4FF] via-[#9944ff] to-[#00ff88]"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

function WebGLFallbackUI() {
  return (
    <div className="min-h-screen bg-[#000510] flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-[#00D4FF]/20 flex items-center justify-center mx-auto mb-6">
          <Monitor className="w-10 h-10 text-[#00D4FF]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">WebGL Required</h2>
        <p className="text-white/70 mb-6">
          This immersive experience requires WebGL support. Please use a modern browser with hardware acceleration enabled.
        </p>
        <a 
          href="/"
          className="inline-block px-6 py-3 bg-[#00D4FF] text-black font-semibold rounded-lg hover:bg-[#00D4FF]/80 transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}

export default function Orca() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    setWebglAvailable(isWebGLAvailable());
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setScrollProgress(v);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  if (!webglAvailable) {
    return <WebGLFallbackUI />;
  }

  return (
    <div ref={containerRef} className="relative bg-[#000510]" style={{ height: '800vh' }}>
      <AnimeNavBar items={navItems} />
      <ProgressBar progress={scrollProgress} />
      
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 2, 8], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <MainScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>
      
      <ScrollIndicator progress={scrollProgress} />
      <SceneOverlay scrollProgress={scrollProgress} />
      
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/50 text-sm flex flex-col items-center gap-2"
        >
          <span>Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div 
              className="w-1.5 h-1.5 bg-[#00D4FF] rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
      
      {scrollProgress > 0.95 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
              className="w-32 h-32 rounded-full bg-[#00ff88]/20 border-2 border-[#00ff88] flex items-center justify-center mx-auto mb-8"
              style={{ boxShadow: '0 0 60px rgba(0,255,136,0.3)' }}
            >
              <ShieldCheck className="w-16 h-16 text-[#00ff88]" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              System Secured
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-[#00D4FF] mb-8"
            >
              Protected by ARICA Security
            </motion.p>
            <motion.a
              href="/contact"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="inline-block px-8 py-4 bg-[#00D4FF] text-black font-bold rounded-lg hover:bg-[#00D4FF]/80 transition-colors pointer-events-auto"
            >
              Protect Your Business
            </motion.a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
