import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Bug, Lock, Key, Package, Code, Play, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

const CYAN = '#00D4FF';
const PURPLE = '#9944ff';
const NAVY = '#000510';

const codeSnippets = [
  { code: 'SELECT * FROM users WHERE id = ' + "'$input'", vulnerable: true, type: 'SQL Injection' },
  { code: 'document.innerHTML = userInput;', vulnerable: true, type: 'XSS' },
  { code: 'char buffer[10]; strcpy(buffer, input);', vulnerable: true, type: 'Buffer Overflow' },
  { code: 'if (user.role === "admin") { ... }', vulnerable: false, type: 'Safe' },
  { code: 'const hash = bcrypt.hash(password, 12);', vulnerable: false, type: 'Safe' },
  { code: 'API_KEY = "sk-1234567890abcdef"', vulnerable: true, type: 'Hardcoded Secret' },
  { code: 'jwt.verify(token, secret)', vulnerable: false, type: 'Safe' },
  { code: 'eval(userCode);', vulnerable: true, type: 'Code Injection' },
  { code: 'const sanitized = DOMPurify.sanitize(html);', vulnerable: false, type: 'Safe' },
  { code: 'require("lodash@4.17.10")', vulnerable: true, type: 'Insecure Dependency' },
];

interface Particle {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  life: number;
}

function MatrixRain({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = Math.random() * 30 - 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 15;
      vel[i] = Math.random() * 0.1 + 0.05;
    }
    return [pos, vel];
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame(() => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= velocities[i];
        if (pos[i * 3 + 1] < -15) {
          pos[i * 3 + 1] = 15;
          pos[i * 3] = (Math.random() - 0.5) * 40;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.15} color={CYAN} transparent opacity={0.4} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

function ScannerBeam({ onScanPosition }: { onScanPosition: (x: number) => void }) {
  const beamRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const beamShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(CYAN) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      
      void main() {
        float glow = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 3.0);
        float scan = sin(vUv.y * 20.0 - time * 5.0) * 0.5 + 0.5;
        float alpha = glow * (0.5 + scan * 0.5);
        gl_FragColor = vec4(color, alpha * 0.8);
      }
    `,
  }), []);

  useFrame((state) => {
    if (beamRef.current && materialRef.current) {
      const t = state.clock.elapsedTime;
      const x = Math.sin(t * 0.5) * 12;
      beamRef.current.position.x = x;
      materialRef.current.uniforms.time.value = t;
      onScanPosition(x);
    }
  });

  return (
    <mesh ref={beamRef} position={[0, 0, 0]}>
      <planeGeometry args={[0.5, 20]} />
      <shaderMaterial ref={materialRef} {...beamShader} transparent side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function CodeBlock({ 
  position, 
  code, 
  vulnerable, 
  scanX,
  onExplode 
}: { 
  position: [number, number, number]; 
  code: string; 
  vulnerable: boolean;
  scanX: number;
  onExplode: (pos: THREE.Vector3) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [exploded, setExploded] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  
  useFrame(() => {
    if (meshRef.current && !exploded) {
      const dist = Math.abs(meshRef.current.position.x - scanX);
      if (dist < 1) {
        setHighlighted(true);
        if (vulnerable && dist < 0.3 && !exploded) {
          setExploded(true);
          onExplode(meshRef.current.position.clone());
        }
      } else {
        setHighlighted(false);
      }
    }
  });

  if (exploded) return null;

  const color = highlighted 
    ? (vulnerable ? '#ff3333' : '#33ff33')
    : (vulnerable ? '#ff6666' : CYAN);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[4, 0.6, 0.1]} />
        <meshBasicMaterial color={color} transparent opacity={highlighted ? 0.9 : 0.6} />
      </mesh>
      <Text
        position={[position[0], position[1], position[2] + 0.1]}
        fontSize={0.15}
        color={highlighted ? (vulnerable ? '#ff0000' : '#00ff00') : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        maxWidth={3.8}
      >
        {code.slice(0, 40)}
      </Text>
    </Float>
  );
}

function ExplosionParticles({ particles }: { particles: Particle[] }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particles.length * 3);
    const colors = new Float32Array(particles.length * 3);
    
    particles.forEach((p, i) => {
      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
      colors[i * 3] = p.color.r;
      colors[i * 3 + 1] = p.color.g;
      colors[i * 3 + 2] = p.color.b;
    });
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [particles]);

  useFrame(() => {
    if (pointsRef.current && particles.length > 0) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      particles.forEach((p, i) => {
        p.position.add(p.velocity);
        p.velocity.y -= 0.002;
        p.life -= 0.02;
        pos[i * 3] = p.position.x;
        pos[i * 3 + 1] = p.position.y;
        pos[i * 3 + 2] = p.position.z;
      });
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (particles.length === 0) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.1} vertexColors transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function CodeAnalysisScene({ isScanning }: { isScanning: boolean }) {
  const [scanX, setScanX] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [codeBlocks, setCodeBlocks] = useState(() => 
    codeSnippets.map((s, i) => ({
      ...s,
      id: i,
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 10 - 5
      ] as [number, number, number],
      visible: true
    }))
  );

  const handleExplode = useCallback((pos: THREE.Vector3) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: Date.now() + i,
        position: pos.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        ),
        color: new THREE.Color('#ff3333'),
        life: 1
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.filter(p => p.life > 0));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isScanning) {
      setCodeBlocks(codeSnippets.map((s, i) => ({
        ...s,
        id: i,
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 10 - 5
        ] as [number, number, number],
        visible: true
      })));
      setParticles([]);
    }
  }, [isScanning]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color={CYAN} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color={PURPLE} />
      
      <MatrixRain count={150} />
      
      {isScanning && <ScannerBeam onScanPosition={setScanX} />}
      
      {codeBlocks.filter(b => b.visible).map((block) => (
        <CodeBlock
          key={block.id}
          position={block.position}
          code={block.code}
          vulnerable={block.vulnerable}
          scanX={scanX}
          onExplode={handleExplode}
        />
      ))}
      
      <ExplosionParticles particles={particles} />
      
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.3} />
    </>
  );
}

const vulnerabilityCategories = [
  { id: 'sql', name: 'SQL Injection', icon: Bug, count: 12, critical: 3, color: '#ff4444' },
  { id: 'xss', name: 'XSS', icon: Code, count: 8, critical: 2, color: '#ff8844' },
  { id: 'buffer', name: 'Buffer Overflow', icon: AlertTriangle, count: 5, critical: 4, color: '#ffaa44' },
  { id: 'auth', name: 'Auth Bypass', icon: Lock, count: 3, critical: 1, color: '#aa44ff' },
  { id: 'deps', name: 'Insecure Dependencies', icon: Package, count: 15, critical: 2, color: '#4488ff' },
  { id: 'secrets', name: 'Hardcoded Secrets', icon: Key, count: 7, critical: 5, color: '#ff44aa' },
];

const demoCode = `function processUserInput(input) {
  // Potential SQL Injection vulnerability
  const query = "SELECT * FROM users WHERE id = '" + input + "'";
  
  // XSS vulnerability
  document.getElementById('output').innerHTML = input;
  
  // Hardcoded secret (detected)
  const API_KEY = "sk-prod-abc123xyz789";
  
  // Safe: Using parameterized queries
  const safeQuery = db.query('SELECT * FROM users WHERE id = ?', [input]);
  
  // Safe: Sanitized output
  const sanitized = DOMPurify.sanitize(input);
  
  return { query, safeQuery };
}`;

function AnimatedGauge({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
          <motion.circle
            cx="48"
            cy="48"
            r="40"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xl font-bold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {value}%
          </motion.span>
        </div>
      </div>
      <span className="text-sm text-gray-400 mt-2">{label}</span>
    </div>
  );
}

export default function CodeReview() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [results, setResults] = useState<{ type: string; line: number; severity: string; message: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setScanProgress(0);
    setResults([]);

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsScanning(false);
          setScanComplete(true);
          generateResults();
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const generateResults = () => {
    setResults([
      { type: 'SQL Injection', line: 3, severity: 'critical', message: 'User input directly concatenated into SQL query' },
      { type: 'XSS', line: 6, severity: 'high', message: 'Unsanitized input assigned to innerHTML' },
      { type: 'Hardcoded Secret', line: 9, severity: 'critical', message: 'API key exposed in source code' },
      { type: 'Safe', line: 12, severity: 'info', message: 'Parameterized query - properly secured' },
      { type: 'Safe', line: 15, severity: 'info', message: 'Input sanitized with DOMPurify' },
    ]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'info': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: NAVY }}>
      <div className="fixed inset-0 z-0" data-testid="code-review-3d-scene">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} dpr={[1, 2]}>
          <CodeAnalysisScene isScanning={isScanning} />
        </Canvas>
      </div>

      <div className="relative z-10">
        <div className="fixed top-6 left-6 z-50">
          <Link href="/experience" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all" data-testid="link-back-experience">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Experience</span>
          </Link>
        </div>

        <div className="container mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)', borderColor: 'rgba(0, 212, 255, 0.3)' }}>
              <Code className="w-4 h-4" style={{ color: CYAN }} />
              <span className="text-sm font-medium" style={{ color: CYAN }}>Code Review</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              AI-Powered
              <span className="block text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${CYAN}, ${PURPLE})` }}>
                Code Analysis
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Watch as our scanner beam analyzes code in real-time, detecting vulnerabilities and security issues with particle explosion effects.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Vulnerability Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {vulnerabilityCategories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${activeCategory === cat.id ? 'border-opacity-100 scale-105' : 'border-white/10 hover:border-white/30'}`}
                    style={{ 
                      backgroundColor: activeCategory === cat.id ? `${cat.color}20` : 'rgba(0,0,0,0.4)',
                      borderColor: activeCategory === cat.id ? cat.color : undefined
                    }}
                    data-testid={`card-vulnerability-${cat.id}`}
                  >
                    <Icon className="w-8 h-8 mb-3" style={{ color: cat.color }} />
                    <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{cat.count} found</span>
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">{cat.critical} critical</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Code Quality Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10">
                <div className="flex justify-around">
                  <AnimatedGauge value={78} max={100} label="Coverage" color={CYAN} />
                  <AnimatedGauge value={42} max={100} label="Complexity" color={PURPLE} />
                  <AnimatedGauge value={15} max={100} label="Duplication" color="#44ff88" />
                </div>
              </div>
              
              <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" style={{ color: CYAN }} />
                  Issues Trend
                </h3>
                <div className="flex items-end justify-between h-32 gap-2">
                  {[45, 38, 52, 41, 35, 28, 22].map((val, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{ background: `linear-gradient(to top, ${CYAN}, ${PURPLE})` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingDown className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">-23% issues</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span style={{ color: CYAN }}>+15% fixed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Live Code Scanner</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm text-gray-400 font-mono">vulnerable-code.js</span>
                  <button
                    onClick={startScan}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
                    style={{ background: `linear-gradient(to right, ${CYAN}, ${PURPLE})` }}
                    data-testid="button-scan-code"
                  >
                    <Play className="w-4 h-4" />
                    {isScanning ? 'Scanning...' : 'Scan'}
                  </button>
                </div>
                <div className="p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-300">
                    {demoCode.split('\n').map((line, i) => {
                      const result = results.find(r => r.line === i + 1);
                      const lineColor = result 
                        ? result.severity === 'critical' ? 'bg-red-500/20' 
                        : result.severity === 'high' ? 'bg-orange-500/20'
                        : result.severity === 'info' ? 'bg-green-500/10'
                        : '' : '';
                      
                      return (
                        <div key={i} className={`flex ${lineColor} -mx-4 px-4`}>
                          <span className="text-gray-600 w-8 select-none">{i + 1}</span>
                          <span className={result && result.severity !== 'info' ? 'text-red-300' : result?.severity === 'info' ? 'text-green-300' : ''}>
                            {line || ' '}
                          </span>
                        </div>
                      );
                    })}
                  </pre>
                </div>
                {isScanning && (
                  <div className="px-4 py-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span style={{ color: CYAN }}>Analyzing code...</span>
                      <span className="text-gray-400">{scanProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{ background: `linear-gradient(to right, ${CYAN}, ${PURPLE})` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 bg-black/40">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5" style={{ color: CYAN }} />
                    Scan Results
                  </h3>
                </div>
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {!scanComplete && !isScanning && (
                      <div className="text-center py-12 text-gray-500">
                        <Code className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>Click "Scan" to analyze the code</p>
                      </div>
                    )}
                    {scanComplete && results.map((result, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-3 rounded-xl border ${getSeverityColor(result.severity)}`}
                        data-testid={`result-item-${i}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{result.type}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-black/30">Line {result.line}</span>
                        </div>
                        <p className="text-xs opacity-80">{result.message}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {scanComplete && (
                  <div className="px-4 py-3 border-t border-white/10 bg-black/40">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-red-400">2 Critical</span>
                        <span className="text-orange-400">1 High</span>
                        <span className="text-green-400">2 Safe</span>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
