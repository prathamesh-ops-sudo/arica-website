import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Text, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowLeft, BookOpen, Shield, Lock, Mail, FileText, AlertTriangle, 
  Eye, Trophy, Award, Flame, CheckCircle, XCircle, Clock, Users,
  TrendingUp, Star, Zap, Target, Activity, BarChart3, GraduationCap
} from 'lucide-react';
import { PurpleGalaxyBackground } from '@/components/ui/purple-galaxy-background';
import { useGsapStagger } from '@/hooks/useGsapStagger';
import { WebGLFallback } from '@/components/ui/webgl-fallback';

const CYAN = '#3D70B7';
const PURPLE = '#42BA90';
const NAVY = 'hsl(222, 47%, 5%)';
const GREEN = '#42BA90';

const trainingModules = [
  { 
    id: 1, 
    name: 'Security Awareness Basics', 
    icon: Shield, 
    duration: '30 min', 
    difficulty: 'Beginner',
    completionRate: 92,
    description: 'Learn fundamental security concepts and best practices',
    position: [-8, 2, 0],
    completed: true
  },
  { 
    id: 2, 
    name: 'Phishing & Social Engineering', 
    icon: Mail, 
    duration: '45 min', 
    difficulty: 'Intermediate',
    completionRate: 78,
    description: 'Identify and prevent social engineering attacks',
    position: [-4, -1, 0],
    completed: true
  },
  { 
    id: 3, 
    name: 'Password Security & MFA', 
    icon: Lock, 
    duration: '25 min', 
    difficulty: 'Beginner',
    completionRate: 88,
    description: 'Create strong passwords and enable multi-factor authentication',
    position: [0, 2, 0],
    completed: true
  },
  { 
    id: 4, 
    name: 'Data Handling Best Practices', 
    icon: FileText, 
    duration: '40 min', 
    difficulty: 'Intermediate',
    completionRate: 65,
    description: 'Properly handle, store, and transmit sensitive data',
    position: [4, -1, 0],
    completed: false
  },
  { 
    id: 5, 
    name: 'Incident Reporting', 
    icon: AlertTriangle, 
    duration: '20 min', 
    difficulty: 'Beginner',
    completionRate: 71,
    description: 'Report security incidents quickly and effectively',
    position: [8, 2, 0],
    completed: false
  },
  { 
    id: 6, 
    name: 'Advanced Threat Detection', 
    icon: Eye, 
    duration: '60 min', 
    difficulty: 'Advanced',
    completionRate: 45,
    description: 'Identify sophisticated cyber threats and APTs',
    position: [12, -1, 0],
    completed: false
  },
];

const quizQuestions = [
  {
    id: 1,
    question: "What is the most common method attackers use to gain initial access?",
    options: [
      "Brute force attacks",
      "Phishing emails",
      "Zero-day exploits",
      "Physical access"
    ],
    correctAnswer: 1,
    explanation: "Phishing remains a common initial attack vector and is a key focus of security awareness training."
  },
  {
    id: 2,
    question: "Which of the following is the strongest password?",
    options: [
      "Password123!",
      "MyDogMax2020",
      "Tr0ub4dor&3",
      "xK9#mL2$vQ7@nP4!"
    ],
    correctAnswer: 3,
    explanation: "Long, random passwords with mixed characters are significantly harder to crack than pattern-based passwords."
  },
  {
    id: 3,
    question: "What should you do if you receive a suspicious email?",
    options: [
      "Open it to investigate",
      "Forward it to colleagues",
      "Report it to IT security",
      "Delete it immediately"
    ],
    correctAnswer: 2,
    explanation: "Always report suspicious emails to IT security so they can investigate and protect other employees."
  },
  {
    id: 4,
    question: "Which security measure provides the strongest protection against unauthorized access?",
    options: [
      "Strong password alone",
      "Biometric authentication only",
      "Multi-factor authentication (MFA)",
      "Security questions"
    ],
    correctAnswer: 2,
    explanation: "MFA combines multiple authentication factors, making it significantly harder for attackers to gain access."
  },
  {
    id: 5,
    question: "What is a common indicator of a phishing website?",
    options: [
      "HTTPS in the URL",
      "Misspelled domain names",
      "Professional design",
      "Contact information"
    ],
    correctAnswer: 1,
    explanation: "Attackers often use domains with slight misspellings (typosquatting) to trick users."
  },
];

const teamProgress = [
  { team: 'Engineering', progress: 87, members: 45, color: CYAN },
  { team: 'Marketing', progress: 72, members: 28, color: PURPLE },
  { team: 'Sales', progress: 91, members: 52, color: GREEN },
  { team: 'Operations', progress: 68, members: 31, color: '#42BA90' },
  { team: 'HR', progress: 95, members: 12, color: '#3D70B7' },
];

function AnimatedCounter({ value, duration = 2000, prefix = '', suffix = '' }: { 
  value: number; 
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);
  
  return <>{prefix}{count.toLocaleString()}{suffix}</>;
}

function LiveStatCard({ 
  icon: Icon, 
  label, 
  value, 
  suffix = '',
  color,
  increment 
}: { 
  icon: any; 
  label: string; 
  value: number;
  suffix?: string;
  color: string;
  increment?: number;
}) {
  const [liveValue, setLiveValue] = useState(value);
  
  useEffect(() => {
    if (!increment) return;
    const interval = setInterval(() => {
      setLiveValue(prev => prev + Math.floor(Math.random() * increment) + 1);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [increment]);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${color}22, transparent)` }} />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
        </div>
        <motion.div 
          key={liveValue}
          initial={{ scale: 1.1, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold" 
          style={{ color }}
        >
          <AnimatedCounter value={liveValue} duration={1500} suffix={suffix} />
        </motion.div>
      </div>
      <motion.div
        className="absolute top-2 right-2 w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

function TeamProgressBar({ team, progress, members, color, delay }: { 
  team: string; 
  progress: number; 
  members: number;
  color: string;
  delay: number;
}) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          const increment = Math.random() * 2;
          const newValue = Math.min(prev + increment, progress);
          if (newValue >= progress) {
            clearInterval(interval);
          }
          return newValue;
        });
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [progress, delay]);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay / 1000 }}
      className="mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{team}</span>
          <span className="text-xs text-gray-500">({members} members)</span>
        </div>
        <motion.span 
          className="text-sm font-bold"
          style={{ color }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
        >
          {Math.round(animatedProgress)}%
        </motion.span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full rounded-full relative"
          style={{ 
            width: `${animatedProgress}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`
          }}
        >
          <motion.div
            className="absolute inset-0 opacity-50"
            style={{ 
              background: `linear-gradient(90deg, transparent, white, transparent)`,
              backgroundSize: '200% 100%'
            }}
            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-[10px] font-bold text-white drop-shadow-lg">
              {Math.round(members * animatedProgress / 100)} completed
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function LearningNode({ 
  position, 
  name, 
  completed, 
  isActive,
  isMilestone 
}: { 
  position: [number, number, number]; 
  name: string; 
  completed: boolean;
  isActive: boolean;
  isMilestone: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const color = completed ? GREEN : (isActive ? CYAN : '#666666');
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      if (isActive) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
      }
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={completed ? 0.2 : 0.1} />
      </mesh>
      
      {isMilestone ? (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh ref={meshRef}>
            <octahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial 
              color={'#42BA90'} 
              emissive={'#42BA90'} 
              emissiveIntensity={0.6} 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.9, 0.05, 8, 32]} />
            <meshBasicMaterial color={'#42BA90'} transparent opacity={0.6} />
          </mesh>
        </Float>
      ) : (
        <mesh ref={meshRef}>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={completed ? 0.5 : 0.2} 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      )}

      {isActive && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.03, 8, 32]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.8} />
        </mesh>
      )}

      <Text
        position={[0, -1.2, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
      >
        {name}
      </Text>
    </group>
  );
}

function PulsingPathConnection({ start, end, completed, index }: { 
  start: [number, number, number]; 
  end: [number, number, number];
  completed: boolean;
  index: number;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [pulseProgress, setPulseProgress] = useState(0);
  
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      p.push(new THREE.Vector3(
        start[0] + (end[0] - start[0]) * t,
        start[1] + (end[1] - start[1]) * t + Math.sin(t * Math.PI) * 0.5,
        start[2] + (end[2] - start[2]) * t
      ));
    }
    return p;
  }, [start, end]);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const color = completed ? GREEN : '#444444';
    const mat = new THREE.LineBasicMaterial({ 
      color, 
      transparent: true, 
      opacity: completed ? 0.8 : 0.4 
    });
    return { geometry: geo, material: mat };
  }, [points, completed]);

  useFrame((state) => {
    if (completed && pulseRef.current) {
      const t = ((state.clock.elapsedTime * 0.3 + index * 0.5) % 1);
      const pos = new THREE.Vector3(
        start[0] + (end[0] - start[0]) * t,
        start[1] + (end[1] - start[1]) * t + Math.sin(t * Math.PI) * 0.5,
        start[2] + (end[2] - start[2]) * t
      );
      pulseRef.current.position.copy(pos);
      pulseRef.current.scale.setScalar(0.8 + Math.sin(state.clock.elapsedTime * 5) * 0.3);
    }
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  const lineObj = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

  return (
    <group>
      <primitive object={lineObj} />
      {completed && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshBasicMaterial color={GREEN} transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}

function StudentParticle({ completedModules }: { completedModules: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [targetIndex, setTargetIndex] = useState(0);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const currentModule = trainingModules[Math.min(targetIndex, trainingModules.length - 1)];
    const targetPos = currentModule.position;
    
    meshRef.current.position.x += (targetPos[0] - meshRef.current.position.x) * 0.02;
    meshRef.current.position.y += (targetPos[1] - meshRef.current.position.y) * 0.02 + 
      Math.sin(state.clock.elapsedTime * 3) * 0.02;
    meshRef.current.position.z = targetPos[2] + 1;
    
    meshRef.current.rotation.y = state.clock.elapsedTime * 2;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetIndex(prev => {
        if (prev < completedModules - 1) {
          return prev + 1;
        }
        return 0;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [completedModules]);

  return (
    <Trail
      width={0.4}
      length={10}
      color={new THREE.Color(CYAN)}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef} position={[-8, 2, 1]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={CYAN} 
          emissive={CYAN} 
          emissiveIntensity={1}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
    </Trail>
  );
}

function AchievementTrophy({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 0.4, 16]} />
          <meshStandardMaterial 
            color="#42BA90" 
            emissive="#42BA90" 
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
          <meshStandardMaterial color="#42BA90" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.25, 0.2, 0.1, 16]} />
          <meshStandardMaterial color="#42BA90" metalness={0.9} roughness={0.1} />
        </mesh>
        <pointLight color="#42BA90" intensity={1} distance={3} />
      </group>
    </Float>
  );
}

function LearningPathScene({ completedModules, activeModule }: { 
  completedModules: number;
  activeModule: number;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 10, 10]} intensity={1} color={CYAN} />
      <pointLight position={[-10, -5, -10]} intensity={0.5} color={PURPLE} />

      {trainingModules.map((module, index) => (
        <LearningNode
          key={module.id}
          position={module.position as [number, number, number]}
          name={module.name.split(' ').slice(0, 2).join(' ')}
          completed={index < completedModules}
          isActive={index === activeModule}
          isMilestone={index === 2 || index === 5}
        />
      ))}

      {trainingModules.slice(0, -1).map((module, index) => (
        <PulsingPathConnection
          key={`path-${index}`}
          start={module.position as [number, number, number]}
          end={trainingModules[index + 1].position as [number, number, number]}
          completed={index < completedModules - 1}
          index={index}
        />
      ))}

      <StudentParticle completedModules={Math.max(completedModules, 1)} />

      {completedModules >= 3 && (
        <AchievementTrophy position={[0, 4, 0]} />
      )}
      {completedModules >= 6 && (
        <AchievementTrophy position={[12, 4, 0]} />
      )}

      <Stars radius={100} depth={50} count={1000} factor={3} fade speed={0.3} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, -4, 0]}>
        <planeGeometry args={[30, 15]} />
        <meshStandardMaterial color={NAVY} transparent opacity={0.3} />
      </mesh>
    </>
  );
}

function CameraController() {
  const { camera } = useThree();
  
  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 2 + 2;
    camera.position.y = 5 + Math.sin(state.clock.elapsedTime * 0.15) * 0.5;
    camera.lookAt(2, 0, 0);
  });

  return null;
}

function ProgressRing({ percentage }: { percentage: number }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 -rotate-90">
        <circle 
          cx="64" 
          cy="64" 
          r="45" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="10" 
          fill="none" 
        />
        <motion.circle
          cx="64"
          cy="64"
          r="45"
          stroke={CYAN}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <motion.span
          className="text-3xl font-bold"
          style={{ color: CYAN }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {percentage}%
        </motion.span>
        <span className="text-xs text-gray-400">Complete</span>
      </div>
    </div>
  );
}

function SkillRadarChart({ skills }: { skills: { name: string; value: number }[] }) {
  const size = 200;
  const center = size / 2;
  const radius = 70;
  const angleStep = (2 * Math.PI) / skills.length;
  
  const points = skills.map((skill, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const r = (skill.value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 25) * Math.cos(angle),
      labelY: center + (radius + 25) * Math.sin(angle),
      name: skill.name,
      value: skill.value,
    };
  });
  
  const pathD = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="mx-auto">
      {[20, 40, 60, 80, 100].map((level) => (
        <polygon
          key={level}
          points={skills.map((_, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const r = (level / 100) * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}
      
      {skills.map((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        );
      })}
      
      <motion.path
        d={pathD}
        fill={`${CYAN}33`}
        stroke={CYAN}
        strokeWidth="2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{ transformOrigin: 'center' }}
      />
      
      {points.map((p, i) => (
        <g key={i}>
          <motion.circle
            cx={p.x}
            cy={p.y}
            r="4"
            fill={CYAN}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
          <text
            x={p.labelX}
            y={p.labelY}
            fill="white"
            fontSize="10"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {p.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ConfettiEffect({ active }: { active: boolean }) {
  if (!active) return null;
  
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random(),
    color: [GREEN, CYAN, '#42BA90', PURPLE][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            left: `${p.x}%`, 
            top: '-10px',
            backgroundColor: p.color 
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ 
            y: '100vh', 
            opacity: 0,
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1)
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
}

function ScoreExplosion({ show, isCorrect }: { show: boolean; isCorrect: boolean }) {
  if (!show) return null;
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: [0, 1.5, 2], opacity: [1, 0.8, 0] }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <div 
        className="text-6xl font-bold"
        style={{ color: isCorrect ? GREEN : '#FF4444' }}
      >
        {isCorrect ? '+100' : '-50'}
      </div>
    </motion.div>
  );
}

export default function SecurityTraining() {
  const [completedModules, setCompletedModules] = useState(() => {
    const saved = localStorage.getItem('security-training-completed');
    return saved ? parseInt(saved, 10) : 3;
  });
  const [activeModule, setActiveModule] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('security-training-score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [totalScore, setTotalScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showScoreExplosion, setShowScoreExplosion] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [shake, setShake] = useState(false);
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('security-training-streak');
    return saved ? parseInt(saved, 10) : 7;
  });
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const gsapContainerRef = useRef<HTMLDivElement>(null);
  
  useGsapStagger(gsapContainerRef);

  useEffect(() => {
    localStorage.setItem('security-training-completed', completedModules.toString());
    localStorage.setItem('security-training-score', score.toString());
    localStorage.setItem('security-training-streak', streak.toString());
  }, [completedModules, score, streak]);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerActive) {
      handleSubmitAnswer();
    }
  }, [timeLeft, timerActive]);

  const skills = [
    { name: 'Awareness', value: 85 },
    { name: 'Phishing', value: 70 },
    { name: 'Passwords', value: 90 },
    { name: 'Data', value: 45 },
    { name: 'Reporting', value: 60 },
    { name: 'Threats', value: 30 },
  ];

  const badges = [
    { name: 'Quick Learner', icon: Zap, earned: true },
    { name: 'Perfect Score', icon: Star, earned: true },
    { name: 'Streak Master', icon: Flame, earned: true },
    { name: 'Security Pro', icon: Shield, earned: false },
  ];

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(30);
    setTimerActive(true);
    setTotalScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null && timeLeft > 0) return;
    
    setShowResult(true);
    setTimerActive(false);
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
    setLastAnswerCorrect(isCorrect);
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 3);
      const questionScore = 100 + timeBonus;
      setScore(prev => prev + 1);
      setTotalScore(prev => prev + questionScore);
      setShowConfetti(true);
      setShowScoreExplosion(true);
      setQuizFeedback(`Correct! +${questionScore} points (includes ${timeBonus} time bonus)`);
      setTimeout(() => {
        setShowConfetti(false);
        setShowScoreExplosion(false);
      }, 2000);
    } else {
      setShake(true);
      setShowScoreExplosion(true);
      setTotalScore(prev => Math.max(0, prev - 50));
      setQuizFeedback(quizQuestions[currentQuestion].explanation);
      setTimeout(() => {
        setShake(false);
        setShowScoreExplosion(false);
      }, 500);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setQuizFeedback(null);
      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-[#42BA90] bg-[#42BA90]/20 border-[#42BA90]/30';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Advanced': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: '#0a0a1e' }}>
      <div className="fixed inset-0 z-0 opacity-30">
        <PurpleGalaxyBackground />
      </div>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3D70B7]/10 border border-[#3D70B7]/30 mb-6 gsap-fade-in">
            <BookOpen className="w-4 h-4 text-[#3D70B7]" />
            <span className="text-[#3D70B7] text-sm font-medium">Security Training Center</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gsap-fade-in">
            Learn & Master
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#3D70B7] to-[#42BA90]">
              Cybersecurity Skills
            </span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto gsap-fade-in">
            Interactive training modules to enhance your security awareness and protect your organization
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          data-testid="live-stats-section"
        >
          <LiveStatCard 
            icon={GraduationCap} 
            label="Courses Completed Today" 
            value={847} 
            color={CYAN}
            increment={3}
          />
          <LiveStatCard 
            icon={Users} 
            label="Active Learners" 
            value={1284} 
            color={PURPLE}
            increment={2}
          />
          <LiveStatCard 
            icon={BarChart3} 
            label="Avg Quiz Score" 
            value={87} 
            suffix="%" 
            color={GREEN}
          />
          <LiveStatCard 
            icon={Activity} 
            label="Training Hours" 
            value={3542} 
            color="#42BA90"
            increment={1}
          />
        </motion.div>

        <div className="mb-12">
          <div 
            ref={canvasRef}
            className="w-full h-[300px] rounded-2xl overflow-hidden border border-white/10 bg-black/40 relative z-[5]"
            data-testid="learning-path-canvas"
          >
            <WebGLFallback>
              <Canvas camera={{ position: [2, 5, 15], fov: 50 }}>
                <CameraController />
                <LearningPathScene 
                  completedModules={completedModules} 
                  activeModule={activeModule}
                />
              </Canvas>
            </WebGLFallback>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
        >
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3D70B7]" />
              Team Training Progress
              <motion.span 
                className="ml-auto text-xs px-2 py-1 rounded-full bg-[#42BA90]/20 text-[#42BA90]"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                DEMO
              </motion.span>
            </h3>
            {teamProgress.map((team, index) => (
              <TeamProgressBar 
                key={team.team}
                {...team}
                delay={index * 200}
              />
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#3D70B7]" />
              Skill Proficiency
            </h3>
            <SkillRadarChart skills={skills} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 gsap-fade-in"
            data-testid="progress-dashboard"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3D70B7]" />
              Your Progress
            </h3>
            
            <div className="flex justify-center mb-6">
              <ProgressRing percentage={Math.round((completedModules / trainingModules.length) * 100)} />
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-xl border border-orange-500/30 mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-sm">Current Streak</span>
              </div>
              <span className="text-xl font-bold text-orange-400">{streak} days</span>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-gray-400">Badges Earned</span>
              <div className="grid grid-cols-2 gap-2">
                {badges.map((badge, i) => (
                  <motion.div
                    key={badge.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={badge.earned ? { scale: 1.1 } : undefined}
                    className={`flex items-center gap-2 p-2 rounded-lg border ${
                      badge.earned 
                        ? 'bg-[#3D70B7]/10 border-[#3D70B7]/30' 
                        : 'bg-gray-500/10 border-gray-500/30 opacity-50'
                    }`}
                    data-testid={`badge-${badge.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <motion.div
                      animate={badge.earned ? { rotateY: [0, 360] } : undefined}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                    >
                      <badge.icon className={`w-4 h-4 ${badge.earned ? 'text-[#3D70B7]' : 'text-gray-500'}`} />
                    </motion.div>
                    <span className="text-xs">{badge.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#3D70B7]" />
              Training Modules
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainingModules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`relative bg-white/5 backdrop-blur-xl rounded-xl border p-4 cursor-pointer transition-all ${
                    index < completedModules 
                      ? 'border-[#42BA90]/30' 
                      : index === activeModule 
                        ? 'border-[#3D70B7]/50' 
                        : 'border-white/10'
                  }`}
                  onClick={() => {
                    if (index >= completedModules) {
                      setCompletedModules(index + 1);
                      setActiveModule(index + 1);
                    }
                  }}
                  data-testid={`module-${module.id}`}
                >
                  {index < completedModules && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-5 h-5 text-[#42BA90]" />
                    </div>
                  )}
                  
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    index < completedModules ? 'bg-[#42BA90]/20' : 'bg-[#3D70B7]/20'
                  }`}>
                    <module.icon className={`w-5 h-5 ${
                      index < completedModules ? 'text-[#42BA90]' : 'text-[#3D70B7]'
                    }`} />
                  </div>
                  
                  <h3 className="text-sm font-semibold mb-1">{module.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {module.duration}
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getDifficultyColor(module.difficulty)}`}>
                      {module.difficulty}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Completion</span>
                      <span className="text-[#3D70B7]">{module.completionRate}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: CYAN }}
                        initial={{ width: 0 }}
                        animate={{ width: `${module.completionRate}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
          data-testid="quiz-section"
        >
          <ConfettiEffect active={showConfetti} />
          <ScoreExplosion show={showScoreExplosion} isCorrect={lastAnswerCorrect} />
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#3D70B7]" />
              Interactive Security Quiz
            </h2>
            {quizStarted && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      timeLeft <= 10 ? 'border-red-500 text-red-400' : 'border-[#3D70B7] text-[#3D70B7]'
                    }`}
                    animate={timeLeft <= 10 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <span className="text-lg font-bold">{timeLeft}</span>
                  </motion.div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Score</div>
                  <motion.div 
                    key={totalScore}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-xl font-bold text-[#3D70B7]"
                  >
                    {totalScore}
                  </motion.div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#3D70B7]/10 rounded-xl border border-[#3D70B7]/30">
                  <Trophy className="w-4 h-4 text-[#3D70B7]" />
                  <span className="font-bold text-[#3D70B7]">{score}/{quizQuestions.length}</span>
                </div>
              </div>
            )}
          </div>

          {!quizStarted ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#3D70B7]/20 to-[#42BA90]/20 border border-[#3D70B7]/30 flex items-center justify-center mb-4">
                  <Zap className="w-12 h-12 text-[#3D70B7]" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Ready to Test Your Knowledge?</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Answer {quizQuestions.length} security questions. Earn bonus points for quick answers!
                </p>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartQuiz}
                className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-[#3D70B7] to-[#42BA90] text-lg"
                data-testid="button-start-quiz"
              >
                Start Quiz
              </motion.button>
            </div>
          ) : (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={shake ? 'animate-shake' : ''}
              style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {quizQuestions.map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < currentQuestion ? 'bg-[#42BA90]' : 
                        i === currentQuestion ? 'bg-[#3D70B7]' : 'bg-white/20'
                      }`}
                      animate={i === currentQuestion ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400 ml-2">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
              </div>

              <p className="text-xl mb-6">{quizQuestions[currentQuestion].question}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`p-4 rounded-xl text-left transition-all border relative overflow-hidden ${
                      showResult
                        ? index === quizQuestions[currentQuestion].correctAnswer
                          ? 'bg-[#42BA90]/20 border-[#42BA90]/50 text-[#42BA90]'
                          : selectedAnswer === index
                            ? 'bg-red-500/20 border-red-500/50 text-red-400'
                            : 'bg-white/5 border-white/10'
                        : selectedAnswer === index
                          ? 'bg-[#3D70B7]/20 border-[#3D70B7]/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    data-testid={`quiz-option-${index}`}
                  >
                    {selectedAnswer === index && !showResult && (
                      <motion.div
                        className="absolute inset-0 bg-[#3D70B7]/10"
                        layoutId="selected-answer"
                      />
                    )}
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                      {showResult && index === quizQuestions[currentQuestion].correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-[#42BA90] ml-auto" />
                      )}
                      {showResult && selectedAnswer === index && index !== quizQuestions[currentQuestion].correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {quizFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className={`mb-4 p-4 rounded-xl border ${
                      lastAnswerCorrect 
                        ? 'bg-[#42BA90]/20 border-[#42BA90]/50 text-[#42BA90]' 
                        : 'bg-red-500/20 border-red-500/50 text-red-400'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {lastAnswerCorrect ? (
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{quizFeedback}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-end gap-4">
                {!showResult ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#3D70B7] to-[#42BA90] disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-submit-answer"
                  >
                    Submit Answer
                  </motion.button>
                ) : currentQuestion < quizQuestions.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextQuestion}
                    className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#3D70B7] to-[#42BA90]"
                    data-testid="button-next-question"
                  >
                    Next Question
                  </motion.button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Final Score</div>
                      <motion.div 
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-bold text-[#3D70B7]"
                      >
                        {totalScore}
                      </motion.div>
                      <div className="text-sm text-gray-400">
                        {score}/{quizQuestions.length} correct
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStartQuiz}
                      className="px-8 py-3 rounded-xl font-semibold bg-white/10 border border-white/20 hover:bg-white/20"
                      data-testid="button-restart-quiz"
                    >
                      Play Again
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
