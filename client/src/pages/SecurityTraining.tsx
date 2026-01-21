import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Text, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowLeft, BookOpen, Shield, Lock, Mail, FileText, AlertTriangle, 
  Eye, Trophy, Award, Flame, CheckCircle, XCircle, Clock, Users,
  TrendingUp, Star, Zap, Target
} from 'lucide-react';
import { PurpleGalaxyBackground } from '@/components/ui/purple-galaxy-background';
import { useGsapStagger } from '@/hooks/useGsapStagger';
import { WebGLFallback } from '@/components/ui/webgl-fallback';

const CYAN = '#00D4FF';
const PURPLE = '#9944ff';
const NAVY = 'hsl(222, 47%, 5%)';
const GREEN = '#00FF88';

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
  },
];

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
              color={'#FFD700'} 
              emissive={'#FFD700'} 
              emissiveIntensity={0.6} 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.9, 0.05, 8, 32]} />
            <meshBasicMaterial color={'#FFD700'} transparent opacity={0.6} />
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

function PathConnection({ start, end, completed }: { 
  start: [number, number, number]; 
  end: [number, number, number];
  completed: boolean;
}) {
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

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  const lineObj = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

  return <primitive object={lineObj} />;
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
            color="#FFD700" 
            emissive="#FFD700" 
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.25, 0.2, 0.1, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
        <pointLight color="#FFD700" intensity={1} distance={3} />
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
        <PathConnection
          key={`path-${index}`}
          start={module.position as [number, number, number]}
          end={trainingModules[index + 1].position as [number, number, number]}
          completed={index < completedModules - 1}
        />
      ))}

      <StudentParticle completedModules={Math.max(completedModules, 1)} />

      {completedModules >= 3 && (
        <AchievementTrophy position={[0, 4, 0]} />
      )}
      {completedModules >= 6 && (
        <AchievementTrophy position={[12, 4, 0]} />
      )}

      <Stars radius={100} depth={50} count={1500} factor={4} fade speed={0.5} />

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
    color: [GREEN, CYAN, '#FFD700', PURPLE][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('security-training-streak');
    return saved ? parseInt(saved, 10) : 7;
  });
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const gsapContainerRef = useRef<HTMLDivElement>(null);
  
  useGsapStagger(gsapContainerRef);

  useEffect(() => {
    localStorage.setItem('security-training-completed', completedModules.toString());
    localStorage.setItem('security-training-score', score.toString());
    localStorage.setItem('security-training-streak', streak.toString());
  }, [completedModules, score, streak]);

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

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setShowConfetti(true);
      setQuizFeedback("Correct! Great job!");
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setShake(true);
      setQuizFeedback(`Incorrect. The correct answer was: ${quizQuestions[currentQuestion].options[quizQuestions[currentQuestion].correctAnswer]}`);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setQuizFeedback(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Advanced': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
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
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">Security Training Center</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gsap-fade-in">
            Learn & Master
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Cybersecurity Skills
            </span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto gsap-fade-in">
            Interactive training modules to enhance your security awareness and protect your organization
          </p>
        </motion.div>

        <div className="mb-12">
          <div 
            ref={canvasRef}
            className="w-full h-[350px] rounded-2xl overflow-hidden border border-white/10 bg-black/40"
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 gsap-fade-in"
            data-testid="progress-dashboard"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Progress Dashboard
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
                        ? 'bg-cyan-500/10 border-cyan-500/30' 
                        : 'bg-gray-500/10 border-gray-500/30 opacity-50'
                    }`}
                    data-testid={`badge-${badge.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <motion.div
                      animate={badge.earned ? { rotateY: [0, 360] } : undefined}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                    >
                      <badge.icon className={`w-4 h-4 ${badge.earned ? 'text-cyan-400' : 'text-gray-500'}`} />
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
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Skill Proficiency
            </h3>
            <SkillRadarChart skills={skills} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            Training Modules
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative bg-white/5 backdrop-blur-xl rounded-2xl border p-6 cursor-pointer transition-all preserve-3d ${
                  index < completedModules 
                    ? 'border-green-500/30' 
                    : index === activeModule 
                      ? 'border-cyan-500/50' 
                      : 'border-white/10'
                }`}
                onClick={() => flippedCard === index ? setFlippedCard(null) : setFlippedCard(index)}
                style={{ 
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
                data-testid={`module-${module.id}`}
              >
                <motion.div
                  animate={{ rotateY: flippedCard === index ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative"
                >
                  <div style={{ backfaceVisibility: 'hidden' }} className={flippedCard === index ? 'invisible' : ''}>
                    {index < completedModules && (
                      <div className="absolute top-0 right-0">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      index < completedModules ? 'bg-green-500/20' : 'bg-cyan-500/20'
                    }`}>
                      <module.icon className={`w-6 h-6 ${
                        index < completedModules ? 'text-green-400' : 'text-cyan-400'
                      }`} />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{module.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{module.description}</p>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        {module.duration}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Completion Rate</span>
                        <span className="text-cyan-400">{module.completionRate}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: CYAN }}
                          initial={{ width: 0 }}
                          animate={{ width: `${module.completionRate}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-center text-cyan-400/50 mt-3">Click to flip for details</p>
                  </div>
                  
                  <div 
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      position: flippedCard === index ? 'relative' : 'absolute',
                      top: 0,
                      left: 0,
                      right: 0
                    }}
                    className={flippedCard !== index ? 'invisible' : ''}
                  >
                    <h3 className="text-lg font-semibold mb-3 text-cyan-400">{module.name}</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white">{module.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Difficulty:</span>
                        <span className={module.difficulty === 'Beginner' ? 'text-green-400' : module.difficulty === 'Intermediate' ? 'text-yellow-400' : 'text-red-400'}>{module.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={index < completedModules ? 'text-green-400' : 'text-gray-400'}>{index < completedModules ? 'Completed' : 'Not Started'}</span>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-gray-300">{module.description}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (index >= completedModules) {
                            setCompletedModules(index + 1);
                            setActiveModule(index + 1);
                          }
                          setFlippedCard(null);
                        }}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold"
                      >
                        {index < completedModules ? 'Review Module' : 'Start Module'}
                      </motion.button>
                    </div>
                    <p className="text-xs text-center text-cyan-400/50 mt-3">Click to flip back</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
          data-testid="quiz-section"
        >
          <ConfettiEffect active={showConfetti} />
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              Quick Security Quiz
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                <Trophy className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-cyan-400">{score}/{quizQuestions.length}</span>
              </div>
            </div>
          </div>

          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={shake ? 'animate-shake' : ''}
            style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}
          >
            <p className="text-xl mb-6">{quizQuestions[currentQuestion].question}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    showResult
                      ? index === quizQuestions[currentQuestion].correctAnswer
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : selectedAnswer === index
                          ? 'bg-red-500/20 border-red-500/50 text-red-400'
                          : 'bg-white/5 border-white/10'
                      : selectedAnswer === index
                        ? 'bg-cyan-500/20 border-cyan-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  data-testid={`quiz-option-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showResult && index === quizQuestions[currentQuestion].correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                    )}
                    {showResult && selectedAnswer === index && index !== quizQuestions[currentQuestion].correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {quizFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-4 rounded-xl border ${
                  quizFeedback.startsWith('Correct') 
                    ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                    : 'bg-red-500/20 border-red-500/50 text-red-400'
                }`}
              >
                {quizFeedback.startsWith('Correct') ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {quizFeedback}
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{quizFeedback}</span>
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex justify-end gap-4">
              {!showResult ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-submit-answer"
                >
                  Submit Answer
                </motion.button>
              ) : currentQuestion < quizQuestions.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                  className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-purple-500"
                  data-testid="button-next-question"
                >
                  Next Question
                </motion.button>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-lg">
                    Final Score: <span className="font-bold text-cyan-400">{score}/{quizQuestions.length}</span>
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCurrentQuestion(0);
                      setSelectedAnswer(null);
                      setShowResult(false);
                      setScore(0);
                    }}
                    className="px-8 py-3 rounded-xl font-semibold bg-white/10 border border-white/20 hover:bg-white/20"
                    data-testid="button-restart-quiz"
                  >
                    Restart Quiz
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
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
