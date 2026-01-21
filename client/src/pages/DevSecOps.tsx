import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Text, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowLeft, Play, RotateCcw, Shield, Code, Package, 
  Server, Eye, Lock, Zap, Clock, CheckCircle, XCircle, 
  AlertTriangle, Search, FileSearch, Container, Key, ClipboardCheck
} from 'lucide-react';
import { PurpleGalaxyBackground } from '@/components/ui/purple-galaxy-background';
import { useGsapStagger } from '@/hooks/useGsapStagger';
import { WebGLFallback } from '@/components/ui/webgl-fallback';

const CYAN = '#00D4FF';
const PURPLE = '#9944ff';
const NAVY = 'hsl(222, 47%, 5%)';

const pipelineStages = [
  { id: 'code', name: 'Code', position: [-12, 0, 0], color: CYAN },
  { id: 'build', name: 'Build', position: [-6, 0, 0], color: '#00FF88' },
  { id: 'test', name: 'Test', position: [0, 0, 0], color: '#FFD700' },
  { id: 'security', name: 'Security Scan', position: [6, 0, 0], color: PURPLE },
  { id: 'deploy', name: 'Deploy', position: [12, 0, 0], color: '#FF6B6B' },
  { id: 'monitor', name: 'Monitor', position: [18, 0, 0], color: '#00D4FF' },
];

interface PackageData {
  id: number;
  position: THREE.Vector3;
  velocity: number;
  stage: number;
  status: 'pending' | 'scanning' | 'passed' | 'failed';
  color: THREE.Color;
}

function PipelineStage({ position, name, color, isActive, isScanning }: { 
  position: [number, number, number]; 
  name: string; 
  color: string;
  isActive: boolean;
  isScanning: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const laserRef = useRef<THREE.Mesh>(null);
  
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
    if (laserRef.current && isScanning) {
      laserRef.current.rotation.z = state.clock.elapsedTime * 8;
      laserRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.3;
    }
  });

  return (
    <group position={position}>
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 0.15 : 0.05} />
      </mesh>
      
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
          <pointLight color={CYAN} intensity={2} distance={3} />
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
    </group>
  );
}

function PipelineConnector({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      p.push(new THREE.Vector3(
        start[0] + (end[0] - start[0]) * t,
        start[1] + Math.sin(t * Math.PI) * 0.3,
        start[2]
      ));
    }
    return p;
  }, [start, end]);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.4 });
    return { geometry: geo, material: mat };
  }, [points]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  const lineObj = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

  return <primitive object={lineObj} />;
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
      case 'scanning': return '#FFD700';
      case 'passed': return '#00FF88';
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
        />
      ))}

      {pipelineStages.slice(0, -1).map((stage, index) => (
        <PipelineConnector
          key={`connector-${index}`}
          start={stage.position as [number, number, number]}
          end={pipelineStages[index + 1].position as [number, number, number]}
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
    color: '#00D4FF'
  },
  { 
    id: 'dast', 
    name: 'DAST', 
    fullName: 'Dynamic Analysis',
    icon: Eye,
    description: 'Test running applications for runtime vulnerabilities',
    color: '#FF6B6B'
  },
  { 
    id: 'sca', 
    name: 'SCA', 
    fullName: 'Software Composition',
    icon: Package,
    description: 'Scan dependencies for known CVEs and license issues',
    color: '#00FF88'
  },
  { 
    id: 'container', 
    name: 'Container', 
    fullName: 'Container Scanning',
    icon: Container,
    description: 'Analyze container images for vulnerabilities and misconfigurations',
    color: '#FFD700'
  },
  { 
    id: 'secret', 
    name: 'Secrets', 
    fullName: 'Secret Detection',
    icon: Key,
    description: 'Detect hardcoded secrets, API keys, and credentials in code',
    color: PURPLE
  },
  { 
    id: 'compliance', 
    name: 'Compliance', 
    fullName: 'Compliance Checks',
    icon: ClipboardCheck,
    description: 'Validate against security policies and regulatory requirements',
    color: '#FF8800'
  },
];

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
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
  
  return <span>{displayValue.toLocaleString()}</span>;
}

export default function DevSecOps() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeSecurityType, setActiveSecurityType] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    successRate: 94.7,
    issuesBlocked: 1247,
    mttr: 4.2,
    deployFrequency: 12,
  });
  const [passedCount, setPassedCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const gsapContainerRef = useRef<HTMLDivElement>(null);
  
  useGsapStagger(gsapContainerRef);

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
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10 z-[1]" />

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6 gsap-fade-in">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">DevSecOps Pipeline</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gsap-fade-in">
            Security-Integrated
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
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
            className="w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-black/40"
            data-testid="pipeline-canvas"
          >
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
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90'
              }`}
              data-testid="button-run-pipeline"
            >
              {isRunning ? <XCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? 'Stop Pipeline' : 'Run Pipeline'}
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

          {isRunning && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-8 mt-4"
            >
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>Passed: {passedCount}</span>
              </div>
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="w-4 h-4" />
                <span>Blocked: {blockedCount}</span>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-center gsap-fade-in">Security Integration Points</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {securityIntegrations.map((integration, index) => {
              const Icon = integration.icon;
              const isActive = activeSecurityType === integration.id;
              
              return (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setActiveSecurityType(isActive ? null : integration.id)}
                  className={`relative p-4 rounded-xl cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-white/10 border-2' 
                      : 'bg-black/40 border border-white/10 hover:border-white/30'
                  }`}
                  style={{ borderColor: isActive ? integration.color : undefined }}
                  data-testid={`card-security-${integration.id}`}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto"
                    style={{ backgroundColor: `${integration.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: integration.color }} />
                  </div>
                  <h3 className="font-semibold text-center text-sm">{integration.name}</h3>
                  <p className="text-xs text-white/50 text-center mt-1">{integration.fullName}</p>
                  
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-white/10"
                      >
                        <p className="text-xs text-white/70">{integration.description}</p>
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
          <h2 className="text-2xl font-bold mb-6 text-center gsap-fade-in">Pipeline Metrics Dashboard</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-black/40 border border-white/10 gsap-fade-in"
              data-testid="metric-success-rate"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-white/60 text-sm">Build Success Rate</span>
              </div>
              <div className="text-3xl font-bold text-green-400">
                <AnimatedCounter value={metrics.successRate} />%
              </div>
              <div className="mt-3 flex items-end justify-between h-16 gap-1">
                {[75, 82, 88, 91, 94, 89, 95].map((val, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-green-600 to-green-400"
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-white/40 mt-1">
                <span>Mon</span><span>Sun</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-black/40 border border-white/10 gsap-fade-in"
              data-testid="metric-issues-blocked"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-white/60 text-sm">Security Issues Blocked</span>
              </div>
              <div className="text-3xl font-bold text-red-400">
                <AnimatedCounter value={metrics.issuesBlocked} />
              </div>
              <div className="mt-2 text-xs text-white/40">
                +{blockedCount} this session
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-black/40 border border-white/10"
              data-testid="metric-mttr"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-white/60 text-sm">Mean Time to Remediate</span>
              </div>
              <div className="text-3xl font-bold text-yellow-400">
                {metrics.mttr}h
              </div>
              <div className="mt-2 text-xs text-white/40">
                -23% from last month
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-black/40 border border-white/10"
              data-testid="metric-deploy-frequency"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-white/60 text-sm">Deployment Frequency</span>
              </div>
              <div className="text-3xl font-bold text-cyan-400">
                <AnimatedCounter value={metrics.deployFrequency} />/day
              </div>
              <div className="mt-2 text-xs text-white/40">
                +8% from last week
              </div>
            </motion.div>
          </div>
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
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold hover:opacity-90 transition-all"
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
