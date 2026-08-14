import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Bug, Lock, Key, Package, Code, Play, BarChart3, TrendingUp, TrendingDown, Zap, Target, FileCode, GitBranch, CheckCircle2, XCircle, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { PurpleGalaxyBackground } from '@/components/ui/purple-galaxy-background';
import { useGsapStagger } from '@/hooks/useGsapStagger';
import { WebGLFallback } from '@/components/ui/webgl-fallback';

const CYAN = '#3D70B7';
const PURPLE = '#3D70B7';
const RED = '#ff4444';
const AMBER = '#ffaa44';

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

function MatrixCodeRain() {
  const chars = useMemo(() => {
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      opacity: 0.1 + Math.random() * 0.2,
      size: 10 + Math.random() * 8,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-30" aria-hidden="true">
      <style>{`
        @keyframes matrixFall {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .matrix-char {
          position: absolute;
          font-family: 'Courier New', monospace;
          color: ${CYAN};
          text-shadow: 0 0 10px ${CYAN}, 0 0 20px ${CYAN};
          animation: matrixFall linear infinite;
        }
      `}</style>
      {chars.map(c => (
        <span
          key={c.id}
          className="matrix-char"
          style={{
            left: `${c.left}%`,
            opacity: c.opacity,
            fontSize: c.size,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        >
          {c.char}
        </span>
      ))}
    </div>
  );
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
    ? (vulnerable ? '#ff3333' : '#42BA90')
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
        color={highlighted ? (vulnerable ? '#ff0000' : '#42BA90') : '#ffffff'}
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
  { id: 'auth', name: 'Auth Bypass', icon: Lock, count: 3, critical: 1, color: '#3D70B7' },
  { id: 'deps', name: 'Insecure Dependencies', icon: Package, count: 15, critical: 2, color: '#3D70B7' },
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

const pipelineStages = [
  { id: 'parse', name: 'Parse', icon: FileCode, status: 'pending' },
  { id: 'analyze', name: 'Analyze', icon: Target, status: 'pending' },
  { id: 'detect', name: 'Detect', icon: Bug, status: 'pending' },
  { id: 'review', name: 'Review', icon: Eye, status: 'pending' },
  { id: 'report', name: 'Report', icon: CheckCircle2, status: 'pending' },
];

function AnimatedCounter({ value, label, icon: Icon, color, suffix = '' }: { value: number; label: string; icon: any; color: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(start + (end - start) * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [value]);

  return (
    <motion.div 
      className="relative p-4 rounded-2xl border overflow-hidden group"
      style={{ backgroundColor: `${color}10`, borderColor: `${color}40` }}
      whileHover={{ scale: 1.05, borderColor: color }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${color}20, transparent 70%)` }} />
      </div>
      <div className="relative z-10">
        <Icon className="w-6 h-6 mb-2" style={{ color }} />
        <div className="text-2xl font-bold" style={{ color }}>
          {displayValue.toLocaleString()}{suffix}
        </div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
      <motion.div 
        className="absolute bottom-0 left-0 h-1"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, ease: 'easeOut' }}
      />
    </motion.div>
  );
}

function PulsingVulnerabilityMarker({ severity, delay = 0 }: { severity: string; delay?: number }) {
  const color = severity === 'critical' ? RED : severity === 'high' ? AMBER : CYAN;
  
  return (
    <motion.div 
      className="absolute -left-2 top-1/2 -translate-y-1/2"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring' }}
    >
      <div className="relative">
        <motion.div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ 
            boxShadow: [`0 0 0 0 ${color}80`, `0 0 0 10px ${color}00`],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 w-4 h-4 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}

function InteractiveVulnerabilityCard({ 
  result, 
  index, 
  isExpanded, 
  onToggle 
}: { 
  result: { type: string; line: number; severity: string; message: string; codeSnippet?: string }; 
  index: number; 
  isExpanded: boolean; 
  onToggle: () => void;
}) {
  const severityColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    critical: { bg: 'rgba(255, 68, 68, 0.15)', border: '#ff4444', text: '#ff6666', glow: '#ff4444' },
    high: { bg: 'rgba(255, 170, 68, 0.15)', border: '#ffaa44', text: '#ffcc66', glow: '#ffaa44' },
    medium: { bg: 'rgba(255, 255, 68, 0.15)', border: '#ffff44', text: '#ffff88', glow: '#ffff44' },
    info: { bg: 'rgba(66, 186, 144, 0.15)', border: '#42BA90', text: '#42BA90', glow: '#42BA90' },
  };
  
  const colors = severityColors[result.severity] || severityColors.info;
  
  const codeForSeverity: Record<string, string> = {
    'SQL Injection': `// Vulnerable code:\nconst query = "SELECT * FROM users WHERE id = '" + input + "'";\n\n// Fix:\nconst query = db.query('SELECT * FROM users WHERE id = ?', [input]);`,
    'XSS': `// Vulnerable code:\ndocument.getElementById('output').innerHTML = input;\n\n// Fix:\ndocument.getElementById('output').textContent = input;\n// Or use: DOMPurify.sanitize(input)`,
    'Hardcoded Secret': `// Vulnerable code:\nconst API_KEY = "sk-prod-abc123xyz789";\n\n// Fix:\nconst API_KEY = process.env.API_KEY;`,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, rotateY: -15 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
      className="relative perspective-1000"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="p-4 rounded-xl border cursor-pointer relative overflow-hidden"
        style={{ 
          backgroundColor: colors.bg,
          borderColor: colors.border,
          boxShadow: isExpanded ? `0 0 30px ${colors.glow}40` : 'none',
        }}
        whileHover={{ 
          scale: 1.02,
          rotateX: 2,
          rotateY: 5,
          boxShadow: `0 10px 40px ${colors.glow}30`,
        }}
        onClick={onToggle}
        data-testid={`card-vulnerability-result-${index}`}
      >
        <PulsingVulnerabilityMarker severity={result.severity} delay={index * 0.1} />
        
        <div className="flex items-center justify-between mb-2 pl-4">
          <div className="flex items-center gap-2">
            <motion.span 
              className="font-semibold"
              style={{ color: colors.text }}
              animate={{ textShadow: [`0 0 0px ${colors.glow}`, `0 0 10px ${colors.glow}`, `0 0 0px ${colors.glow}`] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {result.type}
            </motion.span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-black/40" style={{ color: colors.text }}>
              {result.severity.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-black/30 text-gray-400">Line {result.line}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </div>
        </div>
        
        <p className="text-sm opacity-80 pl-4" style={{ color: colors.text }}>{result.message}</p>
        
        <AnimatePresence>
          {isExpanded && codeForSeverity[result.type] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pl-4 overflow-hidden"
            >
              <div className="p-3 rounded-lg bg-black/60 font-mono text-xs overflow-x-auto">
                <pre className="text-gray-300">
                  {codeForSeverity[result.type].split('\n').map((line, i) => (
                    <div 
                      key={i} 
                      className={line.includes('// Fix:') ? 'text-[#42BA90]' : line.includes('// Vulnerable') ? 'text-red-400' : ''}
                    >
                      {line}
                    </div>
                  ))}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="absolute top-0 right-0 w-20 h-20 opacity-10"
          style={{ background: `radial-gradient(circle, ${colors.glow}, transparent 70%)` }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}

function CodeFlowPipeline({ scanProgress, isScanning }: { scanProgress: number; isScanning: boolean }) {
  const stages = useMemo(() => {
    const progressPerStage = 100 / pipelineStages.length;
    return pipelineStages.map((stage, i) => {
      const stageStart = i * progressPerStage;
      const stageEnd = (i + 1) * progressPerStage;
      let status: 'pending' | 'active' | 'complete' = 'pending';
      
      if (scanProgress >= stageEnd) status = 'complete';
      else if (scanProgress > stageStart) status = 'active';
      
      return { ...stage, status };
    });
  }, [scanProgress]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = stage.status === 'active';
          const isComplete = stage.status === 'complete';
          
          return (
            <div key={stage.id} className="flex items-center flex-1">
              <motion.div
                className="flex flex-col items-center relative z-10"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  opacity: isActive || isComplete ? 1 : 0.5,
                }}
              >
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center border-2 relative"
                  style={{ 
                    backgroundColor: isComplete ? `${CYAN}30` : isActive ? `${PURPLE}30` : 'rgba(0,0,0,0.4)',
                    borderColor: isComplete ? CYAN : isActive ? PURPLE : 'rgba(255,255,255,0.2)',
                  }}
                  animate={isActive ? { 
                    boxShadow: [`0 0 0 0 ${PURPLE}80`, `0 0 0 15px ${PURPLE}00`],
                  } : {}}
                  transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                >
                  {isComplete ? (
                    <CheckCircle className="w-6 h-6" style={{ color: CYAN }} />
                  ) : (
                    <Icon className="w-5 h-5" style={{ color: isActive ? PURPLE : 'rgba(255,255,255,0.5)' }} />
                  )}
                  
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: PURPLE }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </motion.div>
                <span className={`text-xs mt-2 ${isActive || isComplete ? 'text-white' : 'text-gray-500'}`}>
                  {stage.name}
                </span>
              </motion.div>
              
              {i < stages.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <motion.div
                    className="absolute inset-y-0 left-0"
                    style={{ backgroundColor: CYAN }}
                    initial={{ width: 0 }}
                    animate={{ width: isComplete ? '100%' : isActive ? '50%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                  {isActive && (
                    <motion.div
                      className="absolute inset-y-0 w-8 left-0"
                      style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)` }}
                      animate={{ left: ['0%', '100%'] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScannerLineEffect({ scanProgress, isScanning }: { scanProgress: number; isScanning: boolean }) {
  if (!isScanning) return null;
  
  const lineCount = 17;
  const currentLine = Math.floor((scanProgress / 100) * lineCount);
  
  return (
    <motion.div 
      className="absolute left-0 right-0 h-6 pointer-events-none z-20"
      style={{ 
        top: `${(currentLine / lineCount) * 100}%`,
        background: `linear-gradient(180deg, transparent, ${CYAN}40, ${CYAN}60, ${CYAN}40, transparent)`,
        boxShadow: `0 0 20px ${CYAN}, 0 0 40px ${CYAN}50`,
      }}
      animate={{ 
        opacity: [0.5, 1, 0.5],
      }}
      transition={{ duration: 0.5, repeat: Infinity }}
    >
      <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)` }} />
    </motion.div>
  );
}

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
  const [linesScanned, setLinesScanned] = useState(0);
  const [issuesFound, setIssuesFound] = useState(0);
  const [securityScore, setSecurityScore] = useState(100);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [results, setResults] = useState<{ type: string; line: number; severity: string; message: string }[]>([]);
  const gsapContainerRef = useRef<HTMLDivElement>(null);
  
  useGsapStagger(gsapContainerRef);

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setScanProgress(0);
    setLinesScanned(0);
    setIssuesFound(0);
    setSecurityScore(100);
    setResults([]);
    setExpandedCard(null);

    const totalLines = 847;
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsScanning(false);
          setScanComplete(true);
          generateResults();
          return 100;
        }
        
        setLinesScanned(Math.floor((prev / 100) * totalLines));
        
        if (prev === 20) { setIssuesFound(1); setSecurityScore(85); }
        if (prev === 40) { setIssuesFound(2); setSecurityScore(72); }
        if (prev === 60) { setIssuesFound(3); setSecurityScore(65); }
        
        return prev + 2;
      });
    }, 100);
  };

  const generateResults = () => {
    setLinesScanned(847);
    setIssuesFound(3);
    setSecurityScore(65);
    setResults([
      { type: 'SQL Injection', line: 3, severity: 'critical', message: 'User input directly concatenated into SQL query' },
      { type: 'XSS', line: 6, severity: 'high', message: 'Unsanitized input assigned to innerHTML' },
      { type: 'Hardcoded Secret', line: 9, severity: 'critical', message: 'API key exposed in source code' },
      { type: 'Safe', line: 12, severity: 'info', message: 'Parameterized query - properly secured' },
      { type: 'Safe', line: 15, severity: 'info', message: 'Input sanitized with DOMPurify' },
    ]);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: '#0a0a1e' }}>
      <PurpleGalaxyBackground />
      <MatrixCodeRain />
      
      <div className="fixed inset-0 z-[1]" data-testid="code-review-3d-scene">
        <WebGLFallback showMessage>
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} dpr={[1, 2]}>
            <CodeAnalysisScene isScanning={isScanning} />
          </Canvas>
        </WebGLFallback>
      </div>

      <div className="relative z-10">
        <div className="fixed top-6 left-6 z-50">
          <Link href="/experience" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all" data-testid="link-back-experience">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Experience</span>
          </Link>
        </div>

        <div className="container mx-auto px-6 py-24" ref={gsapContainerRef}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 gsap-fade-in" style={{ backgroundColor: 'rgba(61, 112, 183, 0.1)', borderColor: 'rgba(61, 112, 183, 0.3)' }}>
              <Code className="w-4 h-4" style={{ color: CYAN }} />
              <span className="text-sm font-medium" style={{ color: CYAN }}>Code Review</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 gsap-fade-in">
              AI-Powered
              <span className="block text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${CYAN}, ${PURPLE})` }}>
                Code Analysis
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto gsap-fade-in">
              Watch as our scanner beam analyzes code in an interactive demonstration, detecting vulnerabilities and security issues with particle explosion effects.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimatedCounter value={linesScanned} label="Lines Scanned" icon={FileCode} color={CYAN} />
              <AnimatedCounter value={issuesFound} label="Issues Found" icon={Bug} color={RED} />
              <AnimatedCounter value={securityScore} label="Security Score" icon={Shield} color={securityScore > 70 ? '#42BA90' : AMBER} suffix="%" />
              <AnimatedCounter value={scanComplete ? 5 : 0} label="Stages Complete" icon={GitBranch} color={PURPLE} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.15 }}
            className="mb-12 p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: CYAN }} />
              Code Review Pipeline
            </h3>
            <CodeFlowPipeline scanProgress={scanProgress} isScanning={isScanning} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center gsap-fade-in">Vulnerability Categories</h2>
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
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      rotateX: 5,
                      boxShadow: `0 10px 40px ${cat.color}40`,
                    }}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${activeCategory === cat.id ? 'border-opacity-100' : 'border-white/10 hover:border-white/30'}`}
                    style={{ 
                      backgroundColor: activeCategory === cat.id ? `${cat.color}20` : 'rgba(0,0,0,0.4)',
                      borderColor: activeCategory === cat.id ? cat.color : undefined,
                      transformStyle: 'preserve-3d',
                    }}
                    data-testid={`card-vulnerability-${cat.id}`}
                  >
                    <motion.div
                      animate={activeCategory === cat.id ? { rotateY: [0, 360] } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-8 h-8 mb-3" style={{ color: cat.color }} />
                    </motion.div>
                    <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{cat.count} found</span>
                      <motion.span 
                        className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {cat.critical} critical
                      </motion.span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center gsap-fade-in">Code Quality Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 gsap-fade-in">
                <div className="flex justify-around">
                  <AnimatedGauge value={78} max={100} label="Coverage" color={CYAN} />
                  <AnimatedGauge value={42} max={100} label="Complexity" color={PURPLE} />
                  <AnimatedGauge value={15} max={100} label="Duplication" color="#42BA90" />
                </div>
              </div>
              
              <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 gsap-fade-in">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" style={{ color: CYAN }} />
                  Issues Trend
                </h3>
                <div className="flex items-end justify-between h-32 gap-2">
                  {[45, 38, 52, 41, 35, 28, 22].map((val, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t relative overflow-hidden"
                      style={{ background: `linear-gradient(to top, ${CYAN}, ${PURPLE})` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ y: '100%' }}
                        animate={{ y: '-100%' }}
                        transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity, repeatDelay: 3 }}
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingDown className="w-4 h-4 text-[#42BA90]" />
                    <span className="text-[#42BA90]">-23% issues</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-[#3D70B7]" />
                    <span style={{ color: CYAN }}>+15% fixed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center gsap-fade-in">Demo Code Scanner</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-red-500"
                      animate={isScanning ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-yellow-500"
                      animate={isScanning ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-[#42BA90]"
                      animate={isScanning ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 font-mono">vulnerable-code.js</span>
                  <motion.button
                    onClick={startScan}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
                    style={{ background: `linear-gradient(to right, ${CYAN}, ${PURPLE})` }}
                    whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${CYAN}50` }}
                    whileTap={{ scale: 0.95 }}
                    data-testid="button-scan-code"
                  >
                    <Play className="w-4 h-4" />
                    {isScanning ? 'Scanning...' : 'Scan'}
                  </motion.button>
                </div>
                <div className="p-4 font-mono text-sm overflow-x-auto max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#3D70B7]/30 scrollbar-track-transparent relative">
                  <ScannerLineEffect scanProgress={scanProgress} isScanning={isScanning} />
                  <pre className="text-gray-300 relative">
                    {demoCode.split('\n').map((line, i) => {
                      const result = results.find(r => r.line === i + 1);
                      const isCurrentScanLine = isScanning && Math.floor((scanProgress / 100) * 17) === i;
                      
                      return (
                        <motion.div 
                          key={i} 
                          className={`flex -mx-4 px-4 py-0.5 transition-all relative ${
                            result 
                              ? result.severity === 'critical' ? 'bg-red-500/30 border-l-4 border-red-500' 
                              : result.severity === 'high' ? 'bg-orange-500/30 border-l-4 border-orange-500'
                              : result.severity === 'info' ? 'bg-[#42BA90]/20 border-l-4 border-[#42BA90]'
                              : '' 
                              : ''
                          }`}
                          initial={{ opacity: 0.5 }}
                          animate={{ 
                            opacity: 1,
                            backgroundColor: isCurrentScanLine ? `${CYAN}20` : undefined,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-gray-600 w-8 select-none">{i + 1}</span>
                          <span className={
                            result && result.severity !== 'info' ? 'text-red-300' : 
                            result?.severity === 'info' ? 'text-[#42BA90]' : 
                            isCurrentScanLine ? 'text-[#3D70B7]' : ''
                          }>
                            {line || ' '}
                          </span>
                          {result && result.severity !== 'info' && (
                            <motion.span 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="ml-auto text-xs text-red-400 flex items-center gap-1"
                            >
                              <motion.span
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                ⚠
                              </motion.span>
                              {result.type}
                            </motion.span>
                          )}
                        </motion.div>
                      );
                    })}
                  </pre>
                </div>
                {isScanning && (
                  <div className="px-4 py-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <motion.span 
                        style={{ color: CYAN }}
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        Analyzing code...
                      </motion.span>
                      <span className="text-gray-400">{scanProgress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
                      <motion.div
                        className="h-full relative"
                        style={{ background: `linear-gradient(to right, ${CYAN}, ${PURPLE})` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${scanProgress}%` }}
                      >
                        <motion.div
                          className="absolute inset-y-0 right-0 w-8"
                          style={{ background: `linear-gradient(90deg, transparent, white, transparent)` }}
                          animate={{ opacity: [0.3, 0.8, 0.3] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 bg-black/40">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5" style={{ color: CYAN }} />
                    Scan Results
                    {scanComplete && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-2 text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${CYAN}20`, color: CYAN }}
                      >
                        {results.length} findings
                      </motion.span>
                    )}
                  </h3>
                </div>
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {!scanComplete && !isScanning && (
                      <motion.div 
                        className="text-center py-12 text-gray-500"
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Code className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        </motion.div>
                        <p>Click "Scan" to analyze the code</p>
                      </motion.div>
                    )}
                    {isScanning && (
                      <motion.div 
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                          <Target className="w-12 h-12 mx-auto mb-4" style={{ color: CYAN }} />
                        </motion.div>
                        <p style={{ color: CYAN }}>Scanning for vulnerabilities...</p>
                      </motion.div>
                    )}
                    {scanComplete && results.map((result, i) => (
                      <InteractiveVulnerabilityCard
                        key={i}
                        result={result}
                        index={i}
                        isExpanded={expandedCard === i}
                        onToggle={() => setExpandedCard(expandedCard === i ? null : i)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                {scanComplete && (
                  <motion.div 
                    className="px-4 py-3 border-t border-white/10 bg-black/40"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <motion.span 
                          className="text-red-400 flex items-center gap-1"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <XCircle className="w-4 h-4" /> 2 Critical
                        </motion.span>
                        <span className="text-orange-400">1 High</span>
                        <span className="text-[#42BA90] flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> 2 Safe
                        </span>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <CheckCircle className="w-5 h-5 text-[#42BA90]" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
