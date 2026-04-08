import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, Key, Lock, Server, Zap, Eye, Clock, Send, FileJson, Activity, Wifi, Database, ShieldAlert, Terminal, Radio } from 'lucide-react';

interface ApiVulnerability {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  endpoint: string;
  description: string;
  category: 'auth' | 'rate-limit' | 'data-exposure' | 'injection';
}

interface RequestResponse {
  method: string;
  endpoint: string;
  status: number;
  responseTime: number;
  headers: Record<string, string>;
  body: Record<string, unknown>;
}

type AuthTestStatus = 'pending' | 'pass' | 'fail';

interface AuthTest {
  name: string;
  icon: typeof Key;
  status: AuthTestStatus;
}

interface LiveMetrics {
  requestsPerSecond: number;
  avgLatency: number;
  errorRate: number;
  blockedAttacks: number;
  activeConnections: number;
}

interface AttackEvent {
  id: number;
  type: string;
  source: string;
  target: string;
  status: 'blocked' | 'detected' | 'analyzing';
  timestamp: Date;
}

const authTests: AuthTest[] = [
  { name: 'JWT Token Validation', icon: Key, status: 'pending' },
  { name: 'OAuth 2.0 Flow Security', icon: Lock, status: 'pending' },
  { name: 'API Key Exposure', icon: Shield, status: 'pending' },
  { name: 'Session Management', icon: Clock, status: 'pending' },
];

interface AuthFlowStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'success' | 'warning' | 'error';
}

const authFlowSteps: AuthFlowStep[] = [
  { id: 'request', label: 'Client Request', status: 'pending' },
  { id: 'auth', label: 'Authentication', status: 'pending' },
  { id: 'token', label: 'Token Validation', status: 'pending' },
  { id: 'rate', label: 'Rate Limiting', status: 'pending' },
  { id: 'response', label: 'API Response', status: 'pending' },
];

const rateLimitData = [
  [0.2, 0.3, 0.5, 0.4, 0.6, 0.8, 0.9, 1.0],
  [0.1, 0.2, 0.4, 0.5, 0.7, 0.6, 0.8, 0.7],
  [0.3, 0.4, 0.6, 0.8, 0.9, 0.7, 0.5, 0.4],
  [0.4, 0.5, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2],
  [0.2, 0.3, 0.4, 0.5, 0.4, 0.3, 0.2, 0.1],
];

const attackTypes = [
  'SQL Injection',
  'XSS Attack',
  'Rate Limit Breach',
  'Auth Bypass',
  'CSRF Attempt',
  'Brute Force',
];

const sourceIPs = [
  '192.168.1.x',
  '10.0.0.x',
  '172.16.x.x',
  '45.33.x.x',
  '91.102.x.x',
];

function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '#3D70B7' : '#3D70B7',
      });
    }
    
    let time = 0;
    
    const animate = () => {
      time += 0.01;
      ctx.fillStyle = 'rgba(2, 6, 23, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = 'rgba(61, 112, 183, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        const pulse = Math.sin(time * 2 + i * 0.5) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const alpha = p.opacity * pulse;
        ctx.fillStyle = p.color === '#3D70B7' 
          ? `rgba(61, 112, 183, ${alpha})` 
          : `rgba(66, 186, 144, ${alpha})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, p.color === '#3D70B7' ? 'rgba(61, 112, 183, 0.2)' : 'rgba(66, 186, 144, 0.2)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(61, 112, 183, ${(1 - dist / 120) * 0.15})`;
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 500;
    const steps = 20;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
}

function TypewriterText({ text, speed = 30, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);
  
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);
  
  return (
    <span>
      {displayText}
      <span className="animate-pulse text-[#3D70B7]">▋</span>
    </span>
  );
}

function LiveRequestPanel({ isActive, method, endpoint }: { isActive: boolean; method: string; endpoint: string }) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  
  const curlLines = useMemo(() => [
    `$ curl -X ${method} "${endpoint}"`,
    '  -H "Authorization: Bearer eyJhbGc..."',
    '  -H "Content-Type: application/json"',
    '  -H "X-API-Key: sk_live_***"',
    '',
    '> Connecting to API gateway...',
    '> TLS 1.3 handshake complete',
    '> Request authenticated',
    '> Rate limit check: PASS (87/100)',
    '> Processing request...',
  ], [method, endpoint]);
  
  useEffect(() => {
    if (!isActive) {
      setLines([]);
      setCurrentLine(0);
      return;
    }
    
    if (currentLine < curlLines.length) {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, curlLines[currentLine]]);
        setCurrentLine(prev => prev + 1);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isActive, currentLine, curlLines]);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 rounded-xl bg-[rgba(2,6,23,0.9)] border border-[#3D70B7]/30 font-mono text-xs overflow-hidden"
      style={{ boxShadow: '0 0 30px rgba(61, 112, 183, 0.1)' }}
    >
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800">
        <Terminal className="w-4 h-4 text-[#3D70B7]" />
        <span className="text-[#3D70B7]">Live Request Stream</span>
        <div className="ml-auto flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-emerald-500"
          />
          <span className="text-emerald-400 text-[10px]">LIVE</span>
        </div>
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${line.startsWith('$') ? 'text-emerald-400' : line.startsWith('>') ? 'text-[#3D70B7]' : 'text-slate-400'}`}
          >
            {line}
          </motion.div>
        ))}
        {isActive && currentLine < curlLines.length && (
          <span className="text-[#3D70B7] animate-pulse">▋</span>
        )}
      </div>
    </motion.div>
  );
}

function AttackVisualization({ attacks }: { attacks: AttackEvent[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 rounded-xl bg-[rgba(2,6,23,0.9)] border border-[#3D70B7]/30"
      style={{ boxShadow: '0 0 30px rgba(61, 112, 183, 0.1)' }}
    >
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800">
        <ShieldAlert className="w-4 h-4 text-[#3D70B7]" />
        <span className="text-[#3D70B7]">Attack Detection Feed</span>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="ml-auto"
        >
          <Radio className="w-4 h-4 text-red-500" />
        </motion.div>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        <AnimatePresence>
          {attacks.slice(-5).map((attack) => (
            <motion.div
              key={attack.id}
              initial={{ opacity: 0, x: 20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: -20 }}
              className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                attack.status === 'blocked' ? 'bg-red-950/50 border border-red-900/50' :
                attack.status === 'detected' ? 'bg-amber-950/50 border border-amber-900/50' :
                'bg-[#3D70B7]/10 border border-[#3D70B7]/30'
              }`}
            >
              <motion.div
                animate={{ rotate: attack.status === 'analyzing' ? 360 : 0 }}
                transition={{ duration: 1, repeat: attack.status === 'analyzing' ? Infinity : 0, ease: 'linear' }}
              >
                {attack.status === 'blocked' ? (
                  <XCircle className="w-3 h-3 text-red-400" />
                ) : attack.status === 'detected' ? (
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                ) : (
                  <Activity className="w-3 h-3 text-[#3D70B7]" />
                )}
              </motion.div>
              <span className="text-slate-300 flex-1 truncate">{attack.type}</span>
              <span className="text-slate-500">{attack.source}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-medium ${
                attack.status === 'blocked' ? 'bg-red-900/50 text-red-400' :
                attack.status === 'detected' ? 'bg-amber-900/50 text-amber-400' :
                'bg-[#3D70B7]/30 text-[#3D70B7]'
              }`}>
                {attack.status}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function MetricsPanel({ metrics }: { metrics: LiveMetrics }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {[
        { label: 'Requests/sec', value: metrics.requestsPerSecond, icon: Activity, color: '#3D70B7', suffix: '' },
        { label: 'Avg Latency', value: metrics.avgLatency, icon: Clock, color: '#3D70B7', suffix: 'ms' },
        { label: 'Error Rate', value: metrics.errorRate, icon: AlertTriangle, color: metrics.errorRate > 5 ? '#ff4444' : '#3D70B7', suffix: '%' },
        { label: 'Attacks Blocked', value: metrics.blockedAttacks, icon: Shield, color: '#3D70B7', suffix: '' },
        { label: 'Connections', value: metrics.activeConnections, icon: Wifi, color: '#3D70B7', suffix: '' },
      ].map((metric, i) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 rounded-xl bg-[rgba(2,6,23,0.8)] border border-slate-800/50 hover:border-[#3D70B7]/30 transition-all duration-300 group"
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" style={{ color: metric.color }} />
              <span className="text-xs text-slate-500">{metric.label}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: metric.color }}>
              <AnimatedCounter value={metric.value} suffix={metric.suffix} />
            </div>
            <motion.div
              className="h-1 rounded-full mt-2 overflow-hidden bg-slate-800"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(metric.value / (metric.label === 'Avg Latency' ? 500 : metric.label === 'Error Rate' ? 100 : 200) * 100, 100)}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: metric.color }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

function GlassCard({ 
  children, 
  className = '', 
  glowColor = 'cyan',
  onClick 
}: { 
  children: React.ReactNode; 
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'red' | 'amber' | 'emerald';
  onClick?: () => void;
}) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  
  const colors = {
    cyan: { border: '#3D70B7', shadow: 'rgba(61, 112, 183, 0.15)' },
    purple: { border: '#3D70B7', shadow: 'rgba(61, 112, 183, 0.15)' },
    red: { border: '#ff4444', shadow: 'rgba(255, 68, 68, 0.15)' },
    amber: { border: '#ffaa00', shadow: 'rgba(255, 170, 0, 0.15)' },
    emerald: { border: '#3D70B7', shadow: 'rgba(61, 112, 183, 0.15)' },
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    setRotateX((mouseY / (rect.height / 2)) * -5);
    setRotateY((mouseX / (rect.width / 2)) * 5);
  };
  
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };
  
  return (
    <motion.div
      className={`relative rounded-xl bg-[rgba(2,6,23,0.8)] backdrop-blur-xl border transition-all duration-300 ${className}`}
      style={{
        borderColor: `${colors[glowColor].border}20`,
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{
        borderColor: `${colors[glowColor].border}40`,
        boxShadow: `0 0 40px ${colors[glowColor].shadow}`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

function PulsingDot({ color = '#3D70B7', size = 8 }: { color?: string; size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export default function ApiSecurityLab() {
  const [targetUrl, setTargetUrl] = useState('https://api.example.com/v1');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [vulnerabilities, setVulnerabilities] = useState<ApiVulnerability[]>([]);
  const [scanPhase, setScanPhase] = useState('');
  const [scanComplete, setScanComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<'auth' | 'rate-limit' | 'data' | 'request'>('request');
  const [authTestResults, setAuthTestResults] = useState(authTests);
  const [requestResponse, setRequestResponse] = useState<RequestResponse | null>(null);
  const [flowSteps, setFlowSteps] = useState(authFlowSteps);
  const [customMethod, setCustomMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [customHeaders, setCustomHeaders] = useState('Authorization: Bearer <token>');
  const [customBody, setCustomBody] = useState('{"example": "data"}');
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    requestsPerSecond: 0,
    avgLatency: 0,
    errorRate: 0,
    blockedAttacks: 0,
    activeConnections: 0,
  });
  const [attackEvents, setAttackEvents] = useState<AttackEvent[]>([]);
  const [typedResponse, setTypedResponse] = useState('');
  const [isTypingResponse, setIsTypingResponse] = useState(false);
  const attackIdRef = useRef(0);

  useEffect(() => {
    const metricsInterval = setInterval(() => {
      setLiveMetrics(prev => ({
        requestsPerSecond: Math.floor(Math.random() * 50) + 100 + (isScanning ? 50 : 0),
        avgLatency: Math.floor(Math.random() * 50) + 45,
        errorRate: Math.random() * 3 + (isScanning ? 2 : 0.5),
        blockedAttacks: prev.blockedAttacks + (Math.random() > 0.7 ? 1 : 0),
        activeConnections: Math.floor(Math.random() * 20) + 40,
      }));
    }, 1000);
    
    return () => clearInterval(metricsInterval);
  }, [isScanning]);

  useEffect(() => {
    if (!isScanning && !scanComplete) return;
    
    const attackInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newAttack: AttackEvent = {
          id: attackIdRef.current++,
          type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
          source: sourceIPs[Math.floor(Math.random() * sourceIPs.length)],
          target: '/api/v1/users',
          status: Math.random() > 0.3 ? 'blocked' : Math.random() > 0.5 ? 'detected' : 'analyzing',
          timestamp: new Date(),
        };
        setAttackEvents(prev => [...prev.slice(-10), newAttack]);
      }
    }, 800);
    
    return () => clearInterval(attackInterval);
  }, [isScanning, scanComplete]);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setVulnerabilities([]);
    setScanComplete(false);
    setAuthTestResults(authTests.map(t => ({ ...t, status: 'pending' as const })));
    setRequestResponse(null);
    setTypedResponse('');
    setIsTypingResponse(false);
    setFlowSteps(authFlowSteps.map(s => ({ ...s, status: 'pending' as const })));

    const phases = [
      'Initializing API security scan...',
      'Discovering API endpoints...',
      'Testing authentication mechanisms...',
      'Analyzing JWT token security...',
      'Checking OAuth 2.0 implementation...',
      'Testing API key exposure...',
      'Analyzing rate limiting policies...',
      'Checking for data exposure...',
      'Testing for injection vulnerabilities...',
      'Validating response headers...',
      'Generating security report...',
    ];

    let currentPhase = 0;
    let progress = 0;

    const phaseInterval = setInterval(() => {
      if (currentPhase < phases.length) {
        setScanPhase(phases[currentPhase]);
        
        if (currentPhase >= 2 && currentPhase <= 5) {
          const authIndex = currentPhase - 2;
          if (authIndex < authTestResults.length) {
            setAuthTestResults(prev => prev.map((t, i) => 
              i === authIndex ? { ...t, status: (Math.random() > 0.5 ? 'pass' : 'fail') as AuthTestStatus } : t
            ));
          }
        }

        const flowIndex = Math.min(Math.floor(currentPhase / 2), authFlowSteps.length - 1);
        setFlowSteps(prev => prev.map((step, i) => ({
          ...step,
          status: i < flowIndex ? (Math.random() > 0.3 ? 'success' : 'warning') as AuthFlowStep['status']
                : i === flowIndex ? 'active' as AuthFlowStep['status']
                : 'pending' as AuthFlowStep['status']
        })));
        
        currentPhase++;
      }
    }, 800);

    const progressInterval = setInterval(() => {
      progress += Math.random() * 3 + 1;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        clearInterval(phaseInterval);
        setIsScanning(false);
        setScanComplete(true);
        generateResults();
      }
      setScanProgress(Math.min(progress, 100));
    }, 100);
  };

  const generateResults = useCallback(() => {
    const severities: ('critical' | 'high' | 'medium' | 'low' | 'info')[] = ['critical', 'high', 'medium', 'low', 'info'];
    
    const vulnerabilityTypes = [
      { name: 'Broken Object Level Authorization', category: 'auth' },
      { name: 'Broken Authentication', category: 'auth' },
      { name: 'Excessive Data Exposure', category: 'data-exposure' },
      { name: 'Lack of Resources & Rate Limiting', category: 'rate-limit' },
      { name: 'Broken Function Level Authorization', category: 'auth' },
      { name: 'Mass Assignment', category: 'injection' },
      { name: 'Security Misconfiguration', category: 'auth' },
      { name: 'Injection Vulnerabilities', category: 'injection' },
      { name: 'Improper Assets Management', category: 'data-exposure' },
      { name: 'Insufficient Logging & Monitoring', category: 'data-exposure' },
    ];

    const results: ApiVulnerability[] = [];
    const endpoints = ['/users', '/auth/token', '/products', '/admin', '/config', '/api/v1/data'];

    vulnerabilityTypes.forEach((vuln, index) => {
      const found = Math.random() > 0.4;
      if (found) {
        results.push({
          id: `vuln-${index}`,
          type: vuln.name,
          severity: severities[Math.floor(Math.random() * severities.length)],
          endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
          description: `Potential ${vuln.name} vulnerability detected in API endpoint.`,
          category: vuln.category as 'auth' | 'rate-limit' | 'data-exposure' | 'injection',
        });
      }
    });

    setVulnerabilities(results);

    const response = {
      method: 'GET',
      endpoint: '/api/v1/users',
      status: 200,
      responseTime: Math.floor(Math.random() * 200) + 50,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '87',
        'Authorization': 'Bearer ***REDACTED***',
      },
      body: {
        users: [
          { id: 1, email: 'user@example.com', role: 'admin' },
          { id: 2, email: 'test@example.com', role: 'user' },
        ],
        meta: { total: 2, page: 1 },
      },
    };
    
    setRequestResponse(response);
    setIsTypingResponse(true);

    setAuthTestResults(prev => prev.map(t => ({
      ...t,
      status: (Math.random() > 0.4 ? 'pass' : 'fail') as AuthTestStatus,
    })));
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-950/50 border-red-900/50';
      case 'high': return 'text-orange-400 bg-orange-950/50 border-orange-900/50';
      case 'medium': return 'text-amber-400 bg-amber-950/50 border-amber-900/50';
      case 'low': return 'text-slate-300 bg-slate-800/50 border-slate-700/50';
      case 'info': return 'text-slate-400 bg-slate-800/50 border-slate-700/50';
      default: return 'text-slate-300 bg-slate-800/50 border-slate-700/50';
    }
  };

  const getHeatmapColor = (value: number) => {
    if (value > 0.8) return 'bg-red-600';
    if (value > 0.6) return 'bg-orange-600';
    if (value > 0.4) return 'bg-amber-600';
    if (value > 0.2) return 'bg-[#3D70B7]/50';
    return 'bg-slate-700';
  };

  const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
  const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
  const mediumCount = vulnerabilities.filter(v => v.severity === 'medium').length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 relative overflow-hidden">
      <CyberBackground />
      
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/experience"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(2,6,23,0.9)] border border-[#3D70B7]/30 hover:border-[#3D70B7]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(61, 112, 183,0.2)]"
          data-testid="link-back-experience"
        >
          <ArrowLeft className="w-4 h-4 text-[#3D70B7]" />
          <span className="text-sm">Back to Experience</span>
        </Link>
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[rgba(61,112,183,0.1)] border border-[#3D70B7]/30 mb-6"
          >
            <PulsingDot color="#3D70B7" />
            <Server className="w-4 h-4 text-[#3D70B7]" />
            <span className="text-[#3D70B7] text-sm font-medium">API Security Operations Center</span>
            <PulsingDot color="#3D70B7" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span style={{ color: '#3D70B7' }}>
              API Security Lab
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            Real-time API security testing and attack simulation. Monitor threats, analyze vulnerabilities, and secure your endpoints.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <MetricsPanel metrics={liveMetrics} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <GlassCard className="p-6" glowColor="cyan">
            <div className="space-y-4">
              <div className="flex gap-3 p-2 rounded-xl bg-[rgba(0,0,0,0.3)] border border-slate-800/50">
                <div className="flex items-center gap-2 px-3 border-r border-slate-700/50">
                  <select
                    value={customMethod}
                    onChange={(e) => setCustomMethod(e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE')}
                    className="bg-transparent text-[#3D70B7] font-mono text-sm outline-none cursor-pointer"
                    disabled={isScanning}
                    data-testid="select-method"
                  >
                    <option value="GET" className="bg-slate-900">GET</option>
                    <option value="POST" className="bg-slate-900">POST</option>
                    <option value="PUT" className="bg-slate-900">PUT</option>
                    <option value="DELETE" className="bg-slate-900">DELETE</option>
                  </select>
                </div>
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Database className="w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="Enter API endpoint URL..."
                    className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-slate-200 placeholder:text-slate-600"
                    disabled={isScanning}
                    data-testid="input-api-endpoint"
                  />
                </div>
                <motion.button
                  onClick={startScan}
                  disabled={isScanning}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 rounded-lg font-medium text-sm bg-gradient-to-r from-[#3D70B7] to-[#3D70B7] text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(61, 112, 183,0.3)]"
                  data-testid="button-test-endpoint"
                >
                  {isScanning ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Activity className="w-4 h-4" />
                      </motion.div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Test Endpoint
                    </>
                  )}
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-[rgba(0,0,0,0.3)] border border-slate-800/50">
                  <label className="text-xs text-[#3D70B7] font-medium mb-2 block flex items-center gap-2">
                    <Key className="w-3 h-3" />
                    Headers
                  </label>
                  <textarea
                    value={customHeaders}
                    onChange={(e) => setCustomHeaders(e.target.value)}
                    className="w-full h-20 bg-transparent text-slate-300 font-mono text-xs outline-none resize-none placeholder:text-slate-600"
                    placeholder="Authorization: Bearer <token>"
                    disabled={isScanning}
                    data-testid="input-headers"
                  />
                </div>
                <div className="p-3 rounded-lg bg-[rgba(0,0,0,0.3)] border border-slate-800/50">
                  <label className="text-xs text-[#3D70B7] font-medium mb-2 block flex items-center gap-2">
                    <FileJson className="w-3 h-3" />
                    Request Body (JSON)
                  </label>
                  <textarea
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    className="w-full h-20 bg-transparent text-slate-300 font-mono text-xs outline-none resize-none placeholder:text-slate-600"
                    placeholder='{"key": "value"}'
                    disabled={isScanning}
                    data-testid="input-body"
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <GlassCard className="p-6" glowColor="cyan">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Activity className="w-5 h-5 text-[#3D70B7]" />
                    </motion.div>
                    <span className="text-sm text-slate-400 font-mono">
                      {scanPhase}
                    </span>
                  </div>
                  <span className="text-sm text-[#3D70B7] font-mono font-bold">{Math.round(scanProgress)}%</span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#3D70B7] to-[#3D70B7] rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/30"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {authTestResults.map((test, i) => {
                    const Icon = test.icon;
                    const isActive = scanProgress > (i + 1) * 20;
                    return (
                      <motion.div
                        key={test.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-3 rounded-lg border transition-all duration-300 ${
                          isActive 
                            ? 'border-[#3D70B7]/50 bg-[#3D70B7]/10' 
                            : 'border-slate-800/50 bg-slate-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-[#3D70B7]' : 'text-slate-600'}`} />
                          </motion.div>
                          <span className={`text-xs ${isActive ? 'text-[#3D70B7]' : 'text-slate-600'}`}>
                            {test.name.split(' ')[0]}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>
              
              <div className="space-y-4">
                <LiveRequestPanel isActive={isScanning} method={customMethod} endpoint={targetUrl} />
                <AttackVisualization attacks={attackEvents} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {scanComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Found', value: vulnerabilities.length, color: 'cyan' as const },
                  { label: 'Critical', value: criticalCount, color: 'red' as const },
                  { label: 'High', value: highCount, color: 'amber' as const },
                  { label: 'Medium', value: mediumCount, color: 'purple' as const },
                ].map((stat, i) => (
                  <GlassCard key={stat.label} className="p-5" glowColor={stat.color}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1, type: 'spring' }}
                      className="text-3xl font-bold mb-1"
                      style={{ 
                        color: stat.color === 'cyan' ? '#3D70B7' : 
                               stat.color === 'red' ? '#ff4444' :
                               stat.color === 'amber' ? '#ffaa00' : '#3D70B7'
                      }}
                    >
                      <AnimatedCounter value={stat.value} />
                    </motion.div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </GlassCard>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="md:col-span-2">
                  <GlassCard className="p-4" glowColor="cyan">
                    <AttackVisualization attacks={attackEvents} />
                  </GlassCard>
                </div>
                <GlassCard className="p-4" glowColor="purple">
                  <LiveRequestPanel isActive={true} method={customMethod} endpoint={targetUrl} />
                </GlassCard>
              </div>

              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {[
                  { id: 'request', label: 'Request/Response', icon: FileJson, color: '#3D70B7' },
                  { id: 'auth', label: 'Authentication', icon: Key, color: '#3D70B7' },
                  { id: 'rate-limit', label: 'Rate Limiting', icon: Zap, color: '#ffaa00' },
                  { id: 'data', label: 'Data Exposure', icon: Eye, color: '#ff4444' },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-white'
                          : 'bg-[rgba(2,6,23,0.8)] text-slate-400 border border-slate-800/50 hover:border-slate-700/50'
                      }`}
                      style={activeTab === tab.id ? {
                        background: `linear-gradient(135deg, ${tab.color}40, ${tab.color}20)`,
                        borderColor: `${tab.color}60`,
                        boxShadow: `0 0 20px ${tab.color}30`,
                      } : {}}
                      data-testid={`tab-${tab.id}`}
                    >
                      <Icon className="w-4 h-4" style={{ color: activeTab === tab.id ? tab.color : undefined }} />
                      {tab.label}
                    </motion.button>
                  );
                })}
              </div>

              <GlassCard className="p-6 mb-8" glowColor={activeTab === 'auth' ? 'purple' : activeTab === 'rate-limit' ? 'amber' : activeTab === 'data' ? 'red' : 'cyan'}>
                {activeTab === 'request' && requestResponse && (
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-slate-200">
                      <FileJson className="w-5 h-5 text-[#3D70B7]" />
                      Request/Response Visualization
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 rounded-lg bg-[rgba(0,0,0,0.4)] border border-slate-800/50"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <motion.span 
                            animate={{ boxShadow: ['0 0 10px rgba(61, 112, 183,0.3)', '0 0 20px rgba(61, 112, 183,0.5)', '0 0 10px rgba(61, 112, 183,0.3)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="px-2 py-1 rounded text-xs font-mono bg-[#3D70B7]/20 text-[#3D70B7] border border-[#3D70B7]/50"
                          >
                            {requestResponse.method}
                          </motion.span>
                          <span className="text-sm font-mono text-slate-300">{requestResponse.endpoint}</span>
                        </div>
                        <div className="text-xs font-mono text-slate-500 mb-2">// Headers:</div>
                        <pre className="text-xs font-mono text-slate-400 overflow-x-auto" data-testid="request-headers">
                          {isTypingResponse ? (
                            <TypewriterText 
                              text={JSON.stringify(requestResponse.headers, null, 2)} 
                              speed={10}
                            />
                          ) : (
                            JSON.stringify(requestResponse.headers, null, 2)
                          )}
                        </pre>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 rounded-lg bg-[rgba(0,0,0,0.4)] border border-slate-800/50"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <motion.span 
                            animate={{ boxShadow: ['0 0 10px rgba(0,255,136,0.3)', '0 0 20px rgba(0,255,136,0.5)', '0 0 10px rgba(0,255,136,0.3)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`px-2 py-1 rounded text-xs font-mono ${requestResponse.status === 200 ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/50' : 'bg-red-950/50 text-red-400 border border-red-500/50'}`}
                          >
                            {requestResponse.status}
                          </motion.span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {requestResponse.responseTime}ms
                          </span>
                        </div>
                        <div className="text-xs font-mono text-slate-500 mb-2">// Response Body:</div>
                        <pre className="text-xs font-mono text-slate-400 overflow-x-auto" data-testid="response-body">
                          {JSON.stringify(requestResponse.body, null, 2)}
                        </pre>
                      </motion.div>
                    </div>
                  </div>
                )}

                {activeTab === 'auth' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-slate-200">
                      <Key className="w-5 h-5 text-[#3D70B7]" />
                      Authentication Security Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {authTestResults.map((test, i) => {
                        const Icon = test.icon;
                        return (
                          <motion.div
                            key={test.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 rounded-lg border transition-all ${
                              test.status === 'pass' ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50' :
                              test.status === 'fail' ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/50' :
                              'bg-slate-900/40 border-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <motion.div
                                  animate={test.status !== 'pending' ? { scale: [1, 1.2, 1] } : {}}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Icon className={`w-5 h-5 ${
                                    test.status === 'pass' ? 'text-emerald-400' :
                                    test.status === 'fail' ? 'text-red-400' :
                                    'text-slate-500'
                                  }`} />
                                </motion.div>
                                <span className="text-sm font-medium text-slate-200">{test.name}</span>
                              </div>
                              <AnimatePresence mode="wait">
                                {test.status === 'pass' ? (
                                  <motion.div
                                    key="pass"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                  >
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                  </motion.div>
                                ) : test.status === 'fail' ? (
                                  <motion.div
                                    key="fail"
                                    initial={{ scale: 0, rotate: 180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                  >
                                    <XCircle className="w-5 h-5 text-red-400" />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="pending"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-5 h-5 rounded-full border-2 border-slate-600 border-t-[#3D70B7]"
                                  />
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="p-4 rounded-lg bg-[rgba(0,0,0,0.4)] border border-slate-800/50">
                      <h4 className="text-sm font-medium text-slate-300 mb-4">Authentication Flow</h4>
                      <div className="flex items-center justify-between">
                        {flowSteps.map((step, i) => (
                          <div key={step.id} className="flex items-center">
                            <motion.div 
                              animate={step.status === 'active' ? { 
                                boxShadow: ['0 0 10px rgba(61, 112, 183,0.3)', '0 0 25px rgba(61, 112, 183,0.6)', '0 0 10px rgba(61, 112, 183,0.3)']
                              } : {}}
                              transition={{ duration: 1, repeat: step.status === 'active' ? Infinity : 0 }}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                                step.status === 'success' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/50' :
                                step.status === 'warning' ? 'bg-amber-950/50 text-amber-400 border border-amber-500/50' :
                                step.status === 'error' ? 'bg-red-950/50 text-red-400 border border-red-500/50' :
                                step.status === 'active' ? 'bg-[#3D70B7]/20 text-[#3D70B7] border border-[#3D70B7]/50' :
                                'bg-slate-900 text-slate-600 border border-slate-800/50'
                              }`}
                            >
                              {i + 1}
                            </motion.div>
                            {i < flowSteps.length - 1 && (
                              <motion.div 
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: i * 0.2 }}
                                className={`w-8 h-0.5 origin-left ${
                                  step.status === 'success' || step.status === 'warning' ? 'bg-gradient-to-r from-[#3D70B7] to-[#3D70B7]' : 'bg-slate-800'
                                }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        {flowSteps.map((step) => (
                          <span key={step.id} className="text-[10px] text-slate-500 w-10 text-center">
                            {step.label.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'rate-limit' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-slate-200">
                      <Zap className="w-5 h-5 text-amber-400" />
                      Rate Limiting Analysis
                    </h3>
                    <div className="p-4 rounded-lg bg-[rgba(0,0,0,0.4)] border border-slate-800/50 mb-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-3">Request Rate Heatmap</h4>
                      <div className="grid gap-1">
                        {rateLimitData.map((row, i) => (
                          <div key={i} className="flex gap-1">
                            {row.map((value, j) => (
                              <motion.div
                                key={j}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (i * 8 + j) * 0.02 }}
                                whileHover={{ scale: 1.2, zIndex: 10 }}
                                className={`w-8 h-6 rounded cursor-pointer transition-all ${getHeatmapColor(value)}`}
                                style={{
                                  boxShadow: value > 0.6 ? `0 0 ${value * 15}px rgba(255, ${100 - value * 100}, 0, 0.5)` : undefined
                                }}
                                title={`${(value * 100).toFixed(0)}% capacity`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-slate-700" />
                          <span>Low</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-[#3D70B7]/50" />
                          <span>Normal</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-amber-600" />
                          <span>Medium</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-red-600" />
                          <span>High</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Requests/min', value: 100, icon: Activity },
                        { label: 'Remaining', value: 87, icon: Database },
                        { label: 'Reset', value: '45s', icon: Clock },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="p-3 rounded-lg bg-[rgba(0,0,0,0.4)] border border-slate-800/50 text-center hover:border-amber-500/30 transition-all"
                          >
                            <Icon className="w-4 h-4 text-amber-400 mx-auto mb-2" />
                            <div className="text-2xl font-semibold text-slate-100">
                              {typeof item.value === 'number' ? <AnimatedCounter value={item.value} /> : item.value}
                            </div>
                            <div className="text-xs text-slate-500">{item.label}</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'data' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-slate-200">
                      <Eye className="w-5 h-5 text-red-400" />
                      Data Exposure Analysis
                    </h3>
                    <div className="space-y-3">
                      {vulnerabilities.filter(v => v.category === 'data-exposure').map((vuln, i) => (
                        <motion.div
                          key={vuln.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ scale: 1.01, x: 5 }}
                          className="p-4 rounded-lg bg-[rgba(0,0,0,0.4)] border border-slate-800/50 hover:border-red-500/30 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <motion.span 
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`px-2 py-0.5 rounded text-xs font-medium uppercase border ${getSeverityColor(vuln.severity)}`}
                            >
                              {vuln.severity}
                            </motion.span>
                            <span className="font-medium text-slate-200">{vuln.type}</span>
                          </div>
                          <p className="text-sm text-slate-500 mb-2">{vuln.description}</p>
                          <code className="text-xs text-[#3D70B7] bg-[#3D70B7]/10 px-2 py-1 rounded font-mono border border-[#3D70B7]/20">{vuln.endpoint}</code>
                        </motion.div>
                      ))}
                      {vulnerabilities.filter(v => v.category === 'data-exposure').length === 0 && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-8"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <CheckCircle className="w-10 h-10 text-emerald-500/70 mx-auto mb-3" />
                          </motion.div>
                          <p className="text-slate-400 text-sm">No data exposure vulnerabilities detected</p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </GlassCard>

              <GlassCard className="p-6" glowColor="red">
                <h3 className="text-lg font-medium mb-6 text-slate-200 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  All Vulnerabilities
                </h3>
                <div className="space-y-3">
                  {vulnerabilities.map((vuln, index) => (
                    <motion.div
                      key={vuln.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 5, boxShadow: '0 0 20px rgba(255, 68, 68, 0.1)' }}
                      className="p-4 rounded-lg bg-[rgba(0,0,0,0.4)] border border-slate-800/50 hover:border-red-500/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <motion.span 
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`px-2 py-0.5 rounded text-xs font-medium uppercase border ${getSeverityColor(vuln.severity)}`}
                            >
                              {vuln.severity}
                            </motion.span>
                            <span className="font-medium text-slate-200">{vuln.type}</span>
                          </div>
                          <p className="text-sm text-slate-500 mb-2">{vuln.description}</p>
                          <code className="text-xs text-[#3D70B7] bg-[#3D70B7]/10 px-2 py-1 rounded font-mono border border-[#3D70B7]/20">{vuln.endpoint}</code>
                        </div>
                        <motion.div
                          whileHover={{ rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <XCircle className="w-5 h-5 text-red-500/70 flex-shrink-0" />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                  {vulnerabilities.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle className="w-12 h-12 text-emerald-500/70 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-slate-400">No vulnerabilities detected</p>
                    </motion.div>
                  )}
                </div>
              </GlassCard>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(61, 112, 183, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium bg-gradient-to-r from-[#3D70B7] to-[#3D70B7] text-white transition-all shadow-[0_0_30px_rgba(61, 112, 183,0.2)]"
                    data-testid="link-get-assessment"
                  >
                    <Shield className="w-5 h-5" />
                    Get Professional API Security Assessment
                  </motion.button>
                </Link>
                <p className="text-sm text-slate-600 mt-4">
                  This is a simulation. Real API security assessments are performed by our certified experts.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
