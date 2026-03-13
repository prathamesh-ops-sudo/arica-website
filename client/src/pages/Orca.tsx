import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Monitor,
  Eye,
  Terminal,
  Bug,
  ShieldCheck,
  FileSearch,
  ClipboardCheck,
  Home,
  Info,
  Briefcase,
  Mail,
  Sparkles
} from 'lucide-react';
import { useLocation } from 'wouter';
import { AnimeNavBar } from '@/components/ui/anime-navbar';
import { isWebGLAvailable } from '@/lib/webgl-utils';
import { useHyperspaceTransition } from '@/components/ui/hyperspace-transition';

const CHROMATIC_OFFSET = new THREE.Vector2(0.002, 0.002);

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
        <meshStandardMaterial color="#2c2c2e" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[-0.6, 0.2, 0]}>
        <boxGeometry args={[0.05, 0.4, 0.6]} />
        <meshStandardMaterial color="#0a0510" />
      </mesh>
      <mesh position={[0.6, 0.2, 0]}>
        <boxGeometry args={[0.05, 0.4, 0.6]} />
        <meshStandardMaterial color="#0a0510" />
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
        material.emissive = new THREE.Color('#ff453a');
        material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
      } else if (isTarget) {
        material.emissive = new THREE.Color('#00B4D8');
        material.emissiveIntensity = glowIntensity;
      } else {
        material.emissive = new THREE.Color('#00B4D8');
        material.emissiveIntensity = 0.1;
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={frameRef}>
        <boxGeometry args={[0.8, 0.5, 0.05]} />
        <meshStandardMaterial color="#2c2c2e" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={screenRef} position={[0, 0, 0.03]}>
        <planeGeometry args={[0.7, 0.4]} />
        <meshStandardMaterial 
          color={showError ? "#2c1810" : "#0a0510"} 
          emissive={showError ? "#ff453a" : "#00B4D8"}
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.04, 0.1]} />
        <meshStandardMaterial color="#3a3a3c" metalness={0.5} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[0.15, 0.02, 0.1]} />
        <meshStandardMaterial color="#3a3a3c" metalness={0.5} />
      </mesh>
    </group>
  );
}

function DataStream({ startPos, endPos, color = "#8e8e93", speed = 1 }: {
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

function SecurityShield({ position, scale = 1, color = "#8e8e93" }: {
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
      <meshBasicMaterial color="#00B4D8" transparent opacity={0.5} />
    </mesh>
  );
}

function DataParticles({ count = 80 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = Math.random() * 12 - 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      velocities[i] = 0.3 + Math.random() * 0.8;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        colors[i * 3] = 0.48; colors[i * 3 + 1] = 0.18; colors[i * 3 + 2] = 0.88;
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 0.56; colors[i * 3 + 1] = 0.56; colors[i * 3 + 2] = 0.58;
      } else {
        colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0.9;
      }
    }
    return { positions, velocities, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= delta * particles.velocities[i];
      if (positions[i * 3 + 1] < -6) {
        positions[i * 3 + 1] = 6;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const positionAttr = useMemo(() => new THREE.BufferAttribute(particles.positions, 3), [particles.positions]);
  const colorAttr = useMemo(() => new THREE.BufferAttribute(particles.colors, 3), [particles.colors]);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={positionAttr} />
        <primitive attach="attributes-color" object={colorAttr} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function CyberGrid() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <gridHelper args={[50, 50, '#3a3a3c', '#3a3a3c']} />
      <mesh>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#050505" transparent opacity={0.9} />
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
        <meshBasicMaterial color="#8e8e93" />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00B4D8" />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, Math.PI / 4]}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshBasicMaterial color="#30d158" />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <Float key={i} speed={1 + i * 0.2} floatIntensity={0.3}>
            <mesh position={[Math.cos(angle) * 2.5, Math.sin(angle) * 0.5, Math.sin(angle) * 2.5]}>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial 
                color={i % 2 === 0 ? "#8e8e93" : "#00B4D8"} 
                emissive={i % 2 === 0 ? "#8e8e93" : "#00B4D8"}
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

function CyberParticles({ count = 500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, [count]);
  
  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      if (r < 0.4) { cols[i*3] = 0; cols[i*3+1] = 0.8 + Math.random()*0.2; cols[i*3+2] = 0.5 + Math.random()*0.3; }
      else if (r < 0.7) { cols[i*3] = 0; cols[i*3+1] = 0.6 + Math.random()*0.2; cols[i*3+2] = 0.9 + Math.random()*0.1; }
      else { cols[i*3] = 0.4 + Math.random()*0.2; cols[i*3+1] = 0.1 + Math.random()*0.1; cols[i*3+2] = 0.8 + Math.random()*0.2; }
    }
    return cols;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= delta * (5 + (i % 10));
      if (arr[i * 3 + 1] < -100) arr[i * 3 + 1] = 100;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.15} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

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
      <pointLight position={[10, 10, 10]} intensity={1} color="#e5e5e5" />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#00B4D8" />
      
      <CyberParticles count={insideSystem ? 2000 : 500} />
      
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
            <meshStandardMaterial color="#050505" />
          </mesh>
          
          <mesh position={[0, 5, -5]}>
            <planeGeometry args={[20, 10]} />
            <meshStandardMaterial color="#0a0510" />
          </mesh>
        </group>
      )}

      {insideSystem && (
        <group>
          <CyberGrid />
          <DataParticles count={scrollProgress > 0.5 ? 100 : 60} />
          
          {scene === 'iso' && (
            <>
              <SecurityShield position={[-3, 1, -3]} scale={1.5} color="#8e8e93" />
              <SecurityShield position={[3, 1.5, -4]} scale={1.2} color="#00B4D8" />
              <SecurityShield position={[0, 2, -5]} scale={1.8} color="#30d158" />
              {Array.from({ length: 5 }).map((_, i) => (
                <DataStream 
                  key={i}
                  startPos={[-5 + i * 2.5, 3, -3]}
                  endPos={[-5 + i * 2.5, -2, -3]}
                  color={i % 2 === 0 ? "#8e8e93" : "#00B4D8"}
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
                        color={i < 4 ? "#ff453a" : i < 8 ? "#ff9f0a" : "#30d158"}
                        emissive={i < 4 ? "#ff453a" : i < 8 ? "#ff9f0a" : "#30d158"}
                        emissiveIntensity={0.5}
                      />
                    </mesh>
                  </Float>
                );
              })}
              <mesh position={[0, 0, -5]}>
                <torusGeometry args={[3, 0.02, 16, 100]} />
                <meshBasicMaterial color="#8e8e93" transparent opacity={0.5} />
              </mesh>
              <mesh position={[0, 0, -5]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[3, 0.02, 16, 100]} />
                <meshBasicMaterial color="#00B4D8" transparent opacity={0.5} />
              </mesh>
            </>
          )}
          
          {scene === 'incident' && (
            <>
              <Float speed={1.5} floatIntensity={0.8}>
                <mesh position={[0, 0, -5]}>
                  <boxGeometry args={[2, 2, 2]} />
                  <meshStandardMaterial 
                    color="#ff453a" 
                    emissive="#ff453a"
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
                  color="#ff453a"
                  speed={stream.speed}
                />
              ))}
              <SecurityShield position={[-2, 1, -4]} scale={1} color="#8e8e93" />
              <SecurityShield position={[2, 1, -4]} scale={1} color="#8e8e93" />
              <SecurityShield position={[0, -1, -4]} scale={1} color="#00B4D8" />
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
                    color="#0a0510" 
                    emissive="#00B4D8"
                    emissiveIntensity={0.1}
                  />
                </mesh>
              </Float>
              <Text
                position={[0, 1, -2.9]}
                fontSize={0.2}
                color="#e5e5e5"
                anchorX="center"
              >
                SECURITY REPORT
              </Text>
              <Text
                position={[0, 0.5, -2.9]}
                fontSize={0.1}
                color="#30d158"
                anchorX="center"
              >
                ✓ ISO 27001 COMPLIANT
              </Text>
              <Text
                position={[0, 0.2, -2.9]}
                fontSize={0.1}
                color="#30d158"
                anchorX="center"
              >
                ✓ VAPT COMPLETED
              </Text>
              <Text
                position={[0, -0.1, -2.9]}
                fontSize={0.1}
                color="#30d158"
                anchorX="center"
              >
                ✓ INCIDENT RESOLVED
              </Text>
              <Text
                position={[0, -0.4, -2.9]}
                fontSize={0.1}
                color="#30d158"
                anchorX="center"
              >
                ✓ FORENSICS COMPLETE
              </Text>
              <SecurityShield position={[0, -1.2, -2.5]} scale={1.5} color="#00B4D8" />
            </>
          )}
        </group>
      )}
      
      <Environment preset="night" />
      
      <EffectComposer>
        <Bloom 
          intensity={insideSystem ? 1.5 : 0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette 
          offset={0.3}
          darkness={insideSystem ? 0.7 : 0.5}
          blendFunction={BlendFunction.NORMAL}
        />
        <Noise 
          opacity={0.03}
          blendFunction={BlendFunction.OVERLAY}
        />
        <ChromaticAberration 
          offset={isZooming ? CHROMATIC_OFFSET : new THREE.Vector2(0, 0)}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
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
                  ? 'bg-[#30d158]/20 border-[#30d158] text-[#30d158]'
                  : isActive 
                    ? 'bg-[#00B4D8]/20 border-[#00B4D8] text-[#00B4D8] shadow-[0_0_20px_rgba(0,180,216,0.5)]'
                    : 'bg-transparent border-white/20 text-white/40'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span className={`text-sm font-medium transition-all duration-300 ${
                isActive ? 'text-[#00B4D8]' : isCompleted ? 'text-[#30d158]' : 'text-white/40'
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
        color: "#8e8e93"
      };
    }
    if (scrollProgress < 0.25) {
      return {
        title: "⚠️ SECURITY ALERT DETECTED",
        subtitle: "Something's wrong. A system has been compromised.",
        icon: AlertTriangle,
        color: "#ff453a"
      };
    }
    if (scrollProgress < 0.35) {
      return {
        title: "Entering the System",
        subtitle: "ARICA Security Team deploying...",
        icon: Terminal,
        color: "#00B4D8"
      };
    }
    if (scrollProgress < 0.50) {
      return {
        title: "ISO 27001 Compliance Check",
        subtitle: "Auditing security controls and policies",
        icon: ClipboardCheck,
        color: "#8e8e93"
      };
    }
    if (scrollProgress < 0.65) {
      return {
        title: "VAPT in Progress",
        subtitle: "Scanning for vulnerabilities and threats",
        icon: Bug,
        color: "#ff9f0a"
      };
    }
    if (scrollProgress < 0.80) {
      return {
        title: "Incident Response",
        subtitle: "Containing and neutralizing the threat",
        icon: Shield,
        color: "#ff453a"
      };
    }
    if (scrollProgress < 0.90) {
      return {
        title: "Digital Forensics",
        subtitle: "Analyzing evidence and tracing the attack",
        icon: FileSearch,
        color: "#00B4D8"
      };
    }
    return {
      title: "Mission Complete",
      subtitle: "Security restored. Full report delivered.",
      icon: ShieldCheck,
      color: "#30d158"
    };
  };

  const scene = getSceneInfo();
  const Icon = scene.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene.title}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none"
      >
        <div 
          className="bg-gradient-to-b from-[#0a0510]/90 to-[#050505]/95 backdrop-blur-2xl border border-white/10 rounded-3xl px-10 py-8 max-w-md shadow-2xl"
          style={{ boxShadow: `0 8px 60px ${scene.color}30, 0 0 0 1px ${scene.color}10` }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${scene.color}30, ${scene.color}10)`,
                border: `1px solid ${scene.color}40`
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className="w-7 h-7" style={{ color: scene.color }} />
            </motion.div>
          </div>
          <h2 
            className="text-xl md:text-2xl font-bold mb-2 tracking-tight"
            style={{ color: scene.color, textShadow: `0 0 40px ${scene.color}60` }}
          >
            {scene.title}
          </h2>
          <p className="text-white/60 text-sm md:text-base">{scene.subtitle}</p>
          <motion.div 
            className="mt-4 h-1 rounded-full mx-auto"
            style={{ backgroundColor: `${scene.color}40`, width: 60 }}
            animate={{ width: [60, 100, 60] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  const getProgressColor = () => {
    if (progress < 0.33) return 'from-[#ff453a] via-[#ff6b3d] to-[#ff9500]';
    if (progress < 0.66) return 'from-[#ff9500] via-[#ffcc00] to-[#30d158]';
    return 'from-[#30d158] via-[#00B4D8] to-[#00D4FF]';
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-black/40 backdrop-blur-sm">
      <motion.div 
        className={`h-full bg-gradient-to-r ${getProgressColor()}`}
        style={{ width: `${progress * 100}%` }}
        animate={{ 
          boxShadow: ['0 0 10px rgba(0,180,216,0.5)', '0 0 20px rgba(0,180,216,0.8)', '0 0 10px rgba(0,180,216,0.5)']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

function WebGLFallbackUI() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-[#00B4D8]/20 flex items-center justify-center mx-auto mb-6">
          <Monitor className="w-10 h-10 text-[#00B4D8]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">WebGL Required</h2>
        <p className="text-white/70 mb-6">
          This immersive experience requires WebGL support. Please use a modern browser with hardware acceleration enabled.
        </p>
        <a 
          href="/"
          className="inline-block px-6 py-3 bg-[#00B4D8] text-white font-semibold rounded-lg hover:bg-[#00B4D8]/80 transition-colors"
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
    <div ref={containerRef} className="relative bg-[#050505]" style={{ height: '800vh' }}>
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
              className="w-1.5 h-1.5 bg-[#8e8e93] rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
      
      {scrollProgress > 0.95 && (
        <CompletionOverlay />
      )}
    </div>
  );
}

function CompletionOverlay() {
  const [, setLocation] = useLocation();
  const { triggerTransition } = useHyperspaceTransition();
  
  const handleExploreServices = () => {
    triggerTransition(() => {
      setLocation('/experience');
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
    >
      <div className="absolute inset-0 bg-gradient-radial from-[#30d158]/10 via-transparent to-transparent" />
      
      <div className="text-center relative z-10 px-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, duration: 0.8 }}
          className="relative w-36 h-36 mx-auto mb-10"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#30d158]/30 to-[#30d158]/10 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#30d158]/20 to-transparent backdrop-blur-xl border border-[#30d158]/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="w-16 h-16 text-[#30d158]" />
          </div>
          <motion.div 
            className="absolute -inset-4 rounded-full border border-[#30d158]/30"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl font-bold text-white mb-3 tracking-tight"
          style={{ textShadow: '0 0 60px rgba(48,209,88,0.4)' }}
        >
          System Secured
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl text-[#8e8e93] mb-10 max-w-md mx-auto"
        >
          Protected by ARICA Security
        </motion.p>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto"
        >
          <button
            onClick={handleExploreServices}
            data-testid="button-explore-network"
            className="group relative px-10 py-5 bg-gradient-to-r from-[#0077B6] to-[#00D4FF] text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 justify-center overflow-hidden"
            style={{ boxShadow: '0 0 40px rgba(0,119,182,0.5)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <ShieldCheck className="w-5 h-5" />
            <span className="relative">Explore Our Cyber Network</span>
            <Sparkles className="w-5 h-5" />
          </button>
          
          <a
            href="/contact"
            data-testid="button-protect-business"
            className="px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center gap-3 justify-center"
          >
            <Shield className="w-5 h-5" />
            Protect Your Business
          </a>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-sm text-white/30 mt-8"
        >
          Discover our comprehensive security services in the Cyber Network
        </motion.p>
      </div>
    </motion.div>
  );
}
