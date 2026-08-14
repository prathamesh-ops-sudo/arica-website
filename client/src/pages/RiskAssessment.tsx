import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowLeft, Shield, AlertTriangle, CheckCircle, TrendingUp, TrendingDown,
  Network, Code, Database, Lock, AlertCircle, FileCheck, ChevronDown, ChevronUp,
  Target, Zap, Clock, ArrowRight, Info, HelpCircle, Activity, ShieldAlert
} from 'lucide-react';
import { AmbientParticles } from '@/components/ui/ambient-particles';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedProgress } from '@/components/ui/animated-progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const riskCategoryTooltips: Record<string, string> = {
  network: 'Evaluates firewall configurations, network segmentation, VPN security, and external exposure points.',
  application: 'Assesses code vulnerabilities, API security, dependency management, and secure coding practices.',
  data: 'Reviews encryption standards, backup procedures, data classification, and retention policies.',
  access: 'Analyzes authentication mechanisms, privilege management, and identity governance.',
  incident: 'Examines incident response capabilities, playbooks, and disaster recovery readiness.',
  compliance: 'Tracks adherence to regulatory requirements and industry standards.',
};

interface RiskCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  score: number;
  findings: string[];
  status: 'critical' | 'high' | 'medium' | 'low';
}

interface Threat {
  id: string;
  name: string;
  likelihood: number;
  impact: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

interface RiskEvent {
  id: number;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  target: string;
  time: string;
  isNew?: boolean;
}

interface ActionItem {
  id: string;
  title: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  impact: number;
  addressed: boolean;
}

interface ComplianceFramework {
  id: string;
  name: string;
  progress: number;
  requirements: string[];
}

const riskCategories: RiskCategory[] = [
  { 
    id: 'network', 
    name: 'Network Security', 
    icon: Network, 
    score: 72, 
    status: 'medium',
    findings: ['Unpatched firewall firmware', 'Open ports detected (22, 3389)', 'Missing network segmentation', 'Weak VPN configuration']
  },
  { 
    id: 'application', 
    name: 'Application Security', 
    icon: Code, 
    score: 58, 
    status: 'high',
    findings: ['SQL injection vulnerabilities', 'Cross-site scripting (XSS)', 'Outdated dependencies', 'Missing input validation', 'Insecure API endpoints']
  },
  { 
    id: 'data', 
    name: 'Data Protection', 
    icon: Database, 
    score: 81, 
    status: 'low',
    findings: ['Encryption at rest enabled', 'Backup procedures verified', 'Minor classification gaps']
  },
  { 
    id: 'access', 
    name: 'Access Control', 
    icon: Lock, 
    score: 65, 
    status: 'medium',
    findings: ['Privileged accounts review needed', 'MFA not enforced globally', 'Stale user accounts detected', 'Role-based access gaps']
  },
  { 
    id: 'incident', 
    name: 'Incident Response', 
    icon: AlertCircle, 
    score: 45, 
    status: 'critical',
    findings: ['No documented IR plan', 'Missing playbooks', 'Untested recovery procedures', 'No 24/7 monitoring', 'Communication gaps']
  },
  { 
    id: 'compliance', 
    name: 'Compliance', 
    icon: FileCheck, 
    score: 78, 
    status: 'low',
    findings: ['Minor policy updates needed', 'Documentation current', 'Training records complete']
  },
];

const threats: Threat[] = [
  { id: 't1', name: 'Ransomware Attack', likelihood: 4, impact: 5, severity: 'critical', description: 'Encryption of critical business data with ransom demand' },
  { id: 't2', name: 'Phishing Campaign', likelihood: 5, impact: 3, severity: 'high', description: 'Targeted email attacks against employees' },
  { id: 't3', name: 'Insider Threat', likelihood: 3, impact: 4, severity: 'high', description: 'Malicious or negligent employee actions' },
  { id: 't4', name: 'DDoS Attack', likelihood: 4, impact: 3, severity: 'medium', description: 'Distributed denial of service against web services' },
  { id: 't5', name: 'Supply Chain', likelihood: 2, impact: 5, severity: 'high', description: 'Third-party vendor compromise' },
  { id: 't6', name: 'Data Breach', likelihood: 3, impact: 5, severity: 'critical', description: 'Unauthorized access to sensitive data' },
  { id: 't7', name: 'API Abuse', likelihood: 4, impact: 2, severity: 'medium', description: 'Exploitation of API vulnerabilities' },
  { id: 't8', name: 'Social Engineering', likelihood: 5, impact: 2, severity: 'medium', description: 'Manipulation of staff for information' },
  { id: 't9', name: 'Zero-Day Exploit', likelihood: 1, impact: 5, severity: 'high', description: 'Unknown vulnerability exploitation' },
  { id: 't10', name: 'Credential Theft', likelihood: 4, impact: 4, severity: 'critical', description: 'Stolen login credentials' },
];

const riskEventTypes = [
  'Suspicious Login',
  'Port Scan Detected',
  'Malware Signature',
  'DDoS Attempt',
  'SQL Injection',
  'Brute Force Attack',
  'Data Exfiltration',
  'Privilege Escalation',
  'Unauthorized Access',
  'API Rate Limit',
];

const sourceLocations = [
  'Beijing, China',
  'Moscow, Russia',
  'São Paulo, Brazil',
  'Lagos, Nigeria',
  'Mumbai, India',
  'Unknown Proxy',
  'Tor Exit Node',
  'Berlin, Germany',
  'London, UK',
  'New York, USA',
];

const targetSystems = [
  'Web Server #1',
  'Database Cluster',
  'API Gateway',
  'Auth Service',
  'File Storage',
  'Email Server',
  'VPN Endpoint',
  'Load Balancer',
  'CDN Edge',
  'Admin Panel',
];

const initialActionItems: ActionItem[] = [
  { id: 'a1', title: 'Implement Multi-Factor Authentication', priority: 'urgent', impact: 8, addressed: false },
  { id: 'a2', title: 'Develop Incident Response Plan', priority: 'urgent', impact: 12, addressed: false },
  { id: 'a3', title: 'Patch Critical Vulnerabilities', priority: 'high', impact: 10, addressed: false },
  { id: 'a4', title: 'Deploy Endpoint Detection & Response', priority: 'high', impact: 7, addressed: false },
  { id: 'a5', title: 'Conduct Security Awareness Training', priority: 'medium', impact: 5, addressed: false },
  { id: 'a6', title: 'Review Access Control Policies', priority: 'medium', impact: 4, addressed: false },
  { id: 'a7', title: 'Implement Network Segmentation', priority: 'high', impact: 6, addressed: false },
  { id: 'a8', title: 'Update Security Documentation', priority: 'low', impact: 2, addressed: false },
];

const complianceFrameworks: ComplianceFramework[] = [
  { 
    id: 'iso', 
    name: 'ISO 27001', 
    progress: 73, 
    requirements: ['Information Security Policy', 'Risk Assessment Process', 'Access Control Policy', 'Cryptographic Controls', 'Physical Security']
  },
  { 
    id: 'nist', 
    name: 'NIST CSF', 
    progress: 68, 
    requirements: ['Identify Assets', 'Protect Systems', 'Detect Threats', 'Respond to Incidents', 'Recover Operations']
  },
  { 
    id: 'soc2', 
    name: 'SOC 2', 
    progress: 82, 
    requirements: ['Security Controls', 'Availability Measures', 'Processing Integrity', 'Confidentiality', 'Privacy Practices']
  },
];

const trendData = [68, 65, 62, 64, 58, 55, 52, 48, 45, 42, 38, 35];

function AnimatedRiskGauge({ 
  value, 
  size = 192, 
  strokeWidth = 12, 
  label 
}: { 
  value: number; 
  size?: number; 
  strokeWidth?: number; 
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const getColorByValue = (v: number) => {
    if (v <= 33) return { color: '#42BA90', name: 'green' };
    if (v <= 66) return { color: '#f59e0b', name: 'amber' };
    return { color: '#ef4444', name: 'red' };
  };
  
  const colorInfo = getColorByValue(value);

  useEffect(() => {
    if (!isInView) return;
    
    let currentValue = 0;
    const increment = value / 60;
    const timer = setInterval(() => {
      currentValue = Math.min(currentValue + increment, value);
      setDisplayValue(Math.round(currentValue));
      if (currentValue >= value) clearInterval(timer);
    }, 16);
    
    return () => clearInterval(timer);
  }, [isInView, value]);

  useEffect(() => {
    const pulseTimer = setInterval(() => {
      setPulseIntensity(prev => (prev + 0.05) % 1);
    }, 50);
    return () => clearInterval(pulseTimer);
  }, []);

  const strokeDashoffset = circumference - (displayValue / 100) * circumference;
  const glowIntensity = 0.3 + Math.sin(pulseIntensity * Math.PI * 2) * 0.2;

  return (
    <div
      ref={ref}
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      data-testid="animated-risk-gauge"
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorInfo.color} />
            <stop offset="100%" stopColor={colorInfo.color} stopOpacity="0.6" />
          </linearGradient>
          <filter id="gauge-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter="url(#gauge-glow)"
          style={{
            transition: 'stroke-dashoffset 0.1s ease-out',
            filter: `drop-shadow(0 0 ${8 + glowIntensity * 12}px ${colorInfo.color})`,
          }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 4}
          fill="none"
          stroke={colorInfo.color}
          strokeWidth="2"
          strokeDasharray={circumference * 1.05}
          strokeDashoffset={strokeDashoffset * 1.05}
          opacity={glowIntensity}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-4xl font-bold"
          style={{ color: colorInfo.color }}
          animate={{ 
            textShadow: [
              `0 0 10px ${colorInfo.color}40`,
              `0 0 20px ${colorInfo.color}60`,
              `0 0 10px ${colorInfo.color}40`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {displayValue}
        </motion.span>
        {label && (
          <span className="text-xs text-muted-foreground mt-1">{label}</span>
        )}
      </div>
    </div>
  );
}

function ThreatGridBackground({ riskLevel }: { riskLevel: number }) {
  const gridSize = 20;
  const [activeCells, setActiveCells] = useState<Set<number>>(new Set());
  
  useEffect(() => {
    const interval = setInterval(() => {
      const numActive = Math.ceil(riskLevel / 10);
      const newActive = new Set<number>();
      for (let i = 0; i < numActive; i++) {
        newActive.add(Math.floor(Math.random() * (gridSize * gridSize)));
      }
      setActiveCells(newActive);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [riskLevel]);

  const getColor = () => {
    if (riskLevel <= 33) return '#42BA90';
    if (riskLevel <= 66) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at 40% 30%, rgba(61, 112, 183, 0.05) 0%, transparent 55%),
                       radial-gradient(ellipse at 70% 70%, rgba(28, 44, 90, 0.04) 0%, transparent 50%)`,
        }}
      />
      <svg className="absolute inset-0 w-full h-full">
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const x = (i % gridSize) * (100 / gridSize);
          const y = Math.floor(i / gridSize) * (100 / gridSize);
          const isActive = activeCells.has(i);
          
          return (
            <motion.circle
              key={i}
              cx={`${x + 100 / gridSize / 2}%`}
              cy={`${y + 100 / gridSize / 2}%`}
              r={isActive ? 4 : 1}
              fill={isActive ? getColor() : 'rgba(61, 112, 183,0.1)'}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: isActive ? [0, 0.8, 0] : 0.2,
                scale: isActive ? [0, 1.5, 0] : 1,
              }}
              transition={{ 
                duration: isActive ? 1.5 : 0,
                ease: 'easeOut'
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

function LiveThreatMatrix({ 
  threats, 
  hoveredThreat, 
  setHoveredThreat 
}: { 
  threats: Threat[];
  hoveredThreat: Threat | null;
  setHoveredThreat: (t: Threat | null) => void;
}) {
  const [pulsingCells, setPulsingCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const newPulsing = new Set<string>();
      threats.forEach(t => {
        if (Math.random() > 0.6) {
          newPulsing.add(`${t.likelihood}-${t.impact}`);
        }
      });
      setPulsingCells(newPulsing);
    }, 1500);
    return () => clearInterval(interval);
  }, [threats]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#42BA90';
      default: return '#6b7280';
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-12 w-12 flex flex-col justify-between items-center text-xs text-muted-foreground">
        {[5, 4, 3, 2, 1].map(n => (
          <span key={n} className={`px-1 rounded ${
            n >= 4 ? 'bg-red-500/20' : n >= 3 ? 'bg-orange-500/20' : 'bg-[#42BA90]/20'
          }`}>{n}</span>
        ))}
      </div>
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground font-medium tracking-wider whitespace-nowrap">
        IMPACT →
      </div>
      <div className="ml-14">
        <div className="grid grid-cols-5 gap-1 aspect-square max-w-lg mx-auto border border-white/10 rounded-lg p-1 bg-white/5">
          {[5, 4, 3, 2, 1].map(impact => (
            [1, 2, 3, 4, 5].map(likelihood => {
              const cellThreats = threats.filter(t => t.likelihood === likelihood && t.impact === impact);
              const riskLevel = likelihood * impact;
              const isPulsing = pulsingCells.has(`${likelihood}-${impact}`);
              let bgColor = 'bg-[#42BA90]/20';
              if (riskLevel >= 15) bgColor = 'bg-red-500/30';
              else if (riskLevel >= 8) bgColor = 'bg-orange-500/25';
              else if (riskLevel >= 4) bgColor = 'bg-yellow-500/20';
              
              return (
                <motion.div
                  key={`${likelihood}-${impact}`}
                  className={`${bgColor} rounded-lg p-2 relative flex items-center justify-center min-h-[60px] border border-white/5`}
                  animate={isPulsing && cellThreats.length > 0 ? {
                    boxShadow: [
                      '0 0 0 rgba(61, 112, 183,0)',
                      '0 0 20px rgba(61, 112, 183,0.4)',
                      '0 0 0 rgba(61, 112, 183,0)'
                    ],
                    borderColor: ['rgba(255,255,255,0.05)', 'rgba(61, 112, 183,0.5)', 'rgba(255,255,255,0.05)']
                  } : {}}
                  transition={{ duration: 1 }}
                >
                  {cellThreats.map((threat, i) => (
                    <motion.div
                      key={threat.id}
                      className="cursor-pointer absolute"
                      style={{ 
                        left: `${20 + (i * 20)}%`,
                        top: '50%',
                      }}
                      whileHover={{ scale: 1.8 }}
                      animate={isPulsing ? {
                        scale: [1, 1.3, 1],
                        boxShadow: [
                          `0 0 10px ${getSeverityColor(threat.severity)}`,
                          `0 0 25px ${getSeverityColor(threat.severity)}`,
                          `0 0 10px ${getSeverityColor(threat.severity)}`
                        ]
                      } : {}}
                      transition={{ duration: 0.8 }}
                      onMouseEnter={() => setHoveredThreat(threat)}
                      onMouseLeave={() => setHoveredThreat(null)}
                      data-testid={`threat-dot-${threat.id}`}
                    >
                      <div
                        className="w-4 h-4 rounded-full transform -translate-y-1/2"
                        style={{ 
                          backgroundColor: getSeverityColor(threat.severity),
                          boxShadow: `0 0 12px ${getSeverityColor(threat.severity)}`
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              );
            })
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground max-w-lg mx-auto px-1">
          {[1, 2, 3, 4, 5].map(n => (
            <span key={n} className={`px-1 rounded ${
              n >= 4 ? 'bg-red-500/20' : n >= 3 ? 'bg-orange-500/20' : 'bg-[#42BA90]/20'
            }`}>{n}</span>
          ))}
        </div>
        <div className="text-center text-xs text-muted-foreground mt-2 font-medium tracking-wider">
          LIKELIHOOD →
        </div>
      </div>
      <AnimatePresence>
        {hoveredThreat && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-4 right-4 p-4 rounded-xl bg-[rgba(10,10,30,0.95)] backdrop-blur-xl border border-[#3D70B7]/40 max-w-xs"
            style={{
              boxShadow: `0 0 40px rgba(61, 112, 183,0.3), 0 0 80px ${getSeverityColor(hoveredThreat.severity)}20`
            }}
            data-testid="threat-tooltip"
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getSeverityColor(hoveredThreat.severity) }}
                animate={{ 
                  boxShadow: [
                    `0 0 5px ${getSeverityColor(hoveredThreat.severity)}`,
                    `0 0 15px ${getSeverityColor(hoveredThreat.severity)}`,
                    `0 0 5px ${getSeverityColor(hoveredThreat.severity)}`
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="font-semibold">{hoveredThreat.name}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{hoveredThreat.description}</p>
            <div className="flex gap-4 text-xs">
              <span className="px-2 py-1 rounded bg-white/10">Likelihood: {hoveredThreat.likelihood}/5</span>
              <span className="px-2 py-1 rounded bg-white/10">Impact: {hoveredThreat.impact}/5</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RealTimeRiskFeed({ events }: { events: RiskEvent[] }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50', glow: 'rgba(239,68,68,0.3)' };
      case 'high': return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50', glow: 'rgba(249,115,22,0.3)' };
      case 'medium': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', glow: 'rgba(234,179,8,0.3)' };
      case 'low': return { bg: 'bg-[#42BA90]/20', text: 'text-[#42BA90]', border: 'border-[#42BA90]/50', glow: 'rgba(66,186,144,0.3)' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/50', glow: 'rgba(107,114,128,0.3)' };
    }
  };

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
      <AnimatePresence mode="popLayout">
        {events.map((event) => {
          const colors = getSeverityColor(event.severity);
          return (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, x: -50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`p-3 rounded-lg border ${colors.bg} ${colors.border} relative overflow-hidden`}
              style={event.isNew ? { boxShadow: `0 0 20px ${colors.glow}` } : {}}
              data-testid={`risk-event-${event.id}`}
            >
              {event.isNew && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 0.8 }}
                />
              )}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={event.isNew ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: event.isNew ? 3 : 0 }}
                  >
                    <ShieldAlert className={`w-4 h-4 ${colors.text}`} />
                  </motion.div>
                  <div>
                    <span className={`text-sm font-medium ${colors.text}`}>{event.type}</span>
                    <div className="text-xs text-muted-foreground">
                      {event.source} → {event.target}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {event.severity}
                  </span>
                  <span className="text-xs text-muted-foreground">{event.time}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function InteractiveRiskCard({
  category,
  isExpanded,
  onToggle,
  index
}: {
  category: RiskCategory;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  const Icon = category.icon;
  const [isHovered, setIsHovered] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#42BA90';
      default: return '#3D70B7';
    }
  };

  const getStatusGlowColor = (status: string): 'red' | 'amber' | 'green' | 'cyan' => {
    switch (status) {
      case 'critical': return 'red';
      case 'high': return 'amber';
      case 'medium': return 'amber';
      case 'low': return 'green';
      default: return 'cyan';
    }
  };

  const statusColor = getStatusColor(category.status);

  return (
    <GlassCard
      glowColor={getStatusGlowColor(category.status)}
      className="p-6 relative overflow-hidden"
      onClick={onToggle}
      hover3D={true}
      data-testid={`card-category-${category.id}`}
    >
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl"
        style={{ backgroundColor: statusColor }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <motion.div 
          className="p-3 rounded-xl bg-white/10 border border-white/10"
          animate={isHovered ? { 
            boxShadow: `0 0 20px ${statusColor}40`,
            borderColor: `${statusColor}50`
          } : {}}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded-full hover:bg-white/10 transition-colors" data-testid={`tooltip-trigger-${category.id}`}>
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-[rgba(10,10,30,0.95)] border-[#3D70B7]/30">
              <p className="text-sm">{riskCategoryTooltips[category.id]}</p>
            </TooltipContent>
          </Tooltip>
          <div className="text-right">
            <motion.div 
              className="text-3xl font-bold"
              style={{ color: statusColor }}
              animate={{
                textShadow: [
                  `0 0 10px ${statusColor}20`,
                  `0 0 20px ${statusColor}40`,
                  `0 0 10px ${statusColor}20`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {category.score}
            </motion.div>
            <motion.div 
              className="text-xs uppercase tracking-wide flex items-center gap-1"
              style={{ color: statusColor }}
            >
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusColor }}
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {category.status}
            </motion.div>
          </div>
        </div>
      </div>
      
      <h4 className="font-semibold mb-2 relative z-10">{category.name}</h4>
      
      <div className="relative z-10 mb-3">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ 
              backgroundColor: statusColor,
              boxShadow: `0 0 10px ${statusColor}`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${100 - category.score}%` }}
            transition={{ duration: 1, delay: index * 0.1 }}
          />
        </div>
      </div>
      
      <div 
        className="flex items-center justify-between text-sm opacity-70 relative z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span>{category.findings.length} findings</span>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-white/10 relative z-10"
          >
            <ul className="space-y-2">
              {category.findings.map((finding, i) => (
                <motion.li 
                  key={i} 
                  className="flex items-start gap-2 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.div
                    animate={{ 
                      color: [statusColor, '#ffffff', statusColor]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  </motion.div>
                  <span>{finding}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

function AnimatedTrendChart({ data, animatedData }: { data: number[]; animatedData: number[] }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(chartRef, { once: true, margin: '-100px' });
  const [pulsingPoint, setPulsingPoint] = useState<number | null>(null);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setPulsingPoint(Math.floor(Math.random() * animatedData.length));
    }, 2000);
    return () => clearInterval(interval);
  }, [isInView, animatedData.length]);

  return (
    <div ref={chartRef} className="relative h-48">
      <div className="absolute inset-0 flex items-end justify-between gap-1">
        {animatedData.map((value, index) => (
          <motion.div
            key={index}
            initial={{ height: 0, opacity: 0 }}
            animate={isInView ? { height: `${(value / 100) * 100}%`, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className={`flex-1 rounded-t-lg relative overflow-hidden ${
              value <= 33 ? 'bg-[#42BA90]/60' : value <= 66 ? 'bg-yellow-500/60' : 'bg-red-500/60'
            }`}
            style={{
              boxShadow: pulsingPoint === index 
                ? `0 0 30px ${value <= 33 ? 'rgba(66,186,144,0.6)' : value <= 66 ? 'rgba(234,179,8,0.6)' : 'rgba(239,68,68,0.6)'}`
                : `0 0 10px ${value <= 33 ? 'rgba(66,186,144,0.3)' : value <= 66 ? 'rgba(234,179,8,0.3)' : 'rgba(239,68,68,0.3)'}`
            }}
          >
            {pulsingPoint === index && (
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 1 }}
              />
            )}
          </motion.div>
        ))}
      </div>
      <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <filter id="glow-line-enhanced" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="trendGradientEnhanced" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3D70B7" />
            <stop offset="50%" stopColor="#3D70B7" />
            <stop offset="100%" stopColor="#42BA90" />
          </linearGradient>
        </defs>
        {isInView && animatedData.length > 1 && (
          <>
            <motion.polyline
              fill="none"
              stroke="url(#trendGradientEnhanced)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-line-enhanced)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              points={animatedData.map((value, index) => 
                `${(index / (data.length - 1)) * 100}%,${100 - value}%`
              ).join(' ')}
            />
            {animatedData.map((value, index) => (
              <motion.g key={index}>
                <motion.circle
                  cx={`${(index / (data.length - 1)) * 100}%`}
                  cy={`${100 - value}%`}
                  r={pulsingPoint === index ? 10 : 6}
                  fill={value <= 40 ? '#42BA90' : '#3D70B7'}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    r: pulsingPoint === index ? [6, 10, 6] : 6
                  }}
                  transition={{ 
                    delay: index * 0.1 + 0.5,
                    r: { duration: 1, repeat: pulsingPoint === index ? Infinity : 0 }
                  }}
                  style={{
                    filter: `drop-shadow(0 0 ${pulsingPoint === index ? 15 : 8}px ${value <= 40 ? '#42BA90' : '#3D70B7'})`
                  }}
                />
              </motion.g>
            ))}
          </>
        )}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground pt-2">
        <span>12 months ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export default function RiskAssessment() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [hoveredThreat, setHoveredThreat] = useState<Threat | null>(null);
  const [actionItems, setActionItems] = useState(initialActionItems);
  const [expandedFramework, setExpandedFramework] = useState<string | null>(null);
  const [animatedTrend, setAnimatedTrend] = useState<number[]>([]);
  const [expandedPriorities, setExpandedPriorities] = useState<string[]>(['urgent', 'high']);
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>([]);
  const [eventIdCounter, setEventIdCounter] = useState(0);

  const targetScore = 35;
  const previousScore = 42;
  const improvement = previousScore - targetScore;

  const generateRiskEvent = useCallback(() => {
    const newEvent: RiskEvent = {
      id: eventIdCounter,
      type: riskEventTypes[Math.floor(Math.random() * riskEventTypes.length)],
      severity: (['critical', 'high', 'medium', 'low'] as const)[Math.floor(Math.random() * 4)],
      source: sourceLocations[Math.floor(Math.random() * sourceLocations.length)],
      target: targetSystems[Math.floor(Math.random() * targetSystems.length)],
      time: 'Just now',
      isNew: true,
    };
    
    setRiskEvents(prev => {
      const updated = prev.map(e => ({ ...e, isNew: false, time: updateTime(e.time) }));
      return [newEvent, ...updated].slice(0, 15);
    });
    setEventIdCounter(prev => prev + 1);
  }, [eventIdCounter]);

  const updateTime = (time: string) => {
    if (time === 'Just now') return '5s ago';
    if (time === '5s ago') return '10s ago';
    if (time === '10s ago') return '30s ago';
    if (time === '30s ago') return '1m ago';
    if (time === '1m ago') return '2m ago';
    return time;
  };

  useEffect(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => generateRiskEvent(), i * 100);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(generateRiskEvent, 3000);
    return () => clearInterval(interval);
  }, [generateRiskEvent]);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const trendProgress = Math.min(step / 30, 1);
      const pointsToShow = Math.ceil(trendData.length * trendProgress);
      setAnimatedTrend(trendData.slice(0, pointsToShow));

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const toggleActionItem = (id: string) => {
    setActionItems(prev => prev.map(item => 
      item.id === id ? { ...item, addressed: !item.addressed } : item
    ));
  };

  const togglePriority = (priority: string) => {
    setExpandedPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority) 
        : [...prev, priority]
    );
  };

  const priorityGroups = ['urgent', 'high', 'medium', 'low'] as const;
  const groupedActions = priorityGroups.map(priority => ({
    priority,
    items: actionItems.filter(item => item.priority === priority)
  })).filter(group => group.items.length > 0);

  const addressedImpact = actionItems.filter(a => a.addressed).reduce((sum, a) => sum + a.impact, 0);
  const projectedScore = Math.max(0, targetScore - addressedImpact);

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-background text-white relative overflow-hidden">
      <ThreatGridBackground riskLevel={targetScore} />
      <AmbientParticles variant="network" count={30} color="#3D70B7" opacity={0.15} />

      <div className="relative z-10">
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

        <div className="container mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3D70B7]/10 border border-[#3D70B7]/30 mb-6"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(61, 112, 183,0.1)',
                  '0 0 40px rgba(61, 112, 183,0.2)',
                  '0 0 20px rgba(61, 112, 183,0.1)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <Target className="w-4 h-4 text-[#3D70B7]" />
              </motion.div>
              <span className="text-[#3D70B7] text-sm font-medium">Interactive Risk Assessment Demo</span>
              <motion.div
                className="w-2 h-2 rounded-full bg-[#42BA90]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Cybersecurity
              <motion.span 
                className="block text-transparent bg-clip-text bg-gradient-to-r from-[#3D70B7] to-[#42BA90]"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Risk Assessment
              </motion.span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real-time analysis of your organization's security posture with live threat detection and actionable insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <GlassCard
              glowColor="cyan"
              className="lg:col-span-1 p-8 flex flex-col items-center justify-center"
              data-testid="risk-score-dashboard"
            >
              <AnimatedRiskGauge
                value={targetScore}
                size={192}
                strokeWidth={12}
                label="Risk Score"
              />
              <div className="text-center mt-6">
                <h3 className="text-xl font-bold mb-2">Overall Risk Level</h3>
                <motion.div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[#42BA90] bg-[#42BA90]/10 border border-[#42BA90]/30"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(66,186,144,0.2)',
                      '0 0 20px rgba(66,186,144,0.4)',
                      '0 0 10px rgba(66,186,144,0.2)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </motion.div>
                  <span className="text-sm font-medium">Low Risk</span>
                </motion.div>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                  <TrendingDown className="w-4 h-4 text-[#42BA90]" />
                  <span className="text-[#42BA90]">-{improvement} pts</span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard
              glowColor="purple"
              className="lg:col-span-2 p-6"
              data-testid="risk-trend-chart"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Risk Score Trend
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Activity className="w-5 h-5 text-[#3D70B7]" />
                  </motion.div>
                </h3>
                <div className="flex items-center gap-2 text-[#42BA90] text-sm">
                  <TrendingDown className="w-4 h-4" />
                  <span>Improving</span>
                </div>
              </div>
              <AnimatedTrendChart data={trendData} animatedData={animatedTrend} />
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                data-testid="risk-categories-grid"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  Risk Categories
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#3D70B7]"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {riskCategories.map((category, index) => (
                    <InteractiveRiskCard
                      key={category.id}
                      category={category}
                      isExpanded={expandedCategory === category.id}
                      onToggle={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            <GlassCard
              glowColor="red"
              className="p-6"
              data-testid="live-risk-feed"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Simulated Risk Feed
                  <motion.div
                    className="w-2 h-2 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </h3>
                <span className="text-xs text-muted-foreground">{riskEvents.length} events</span>
              </div>
              <RealTimeRiskFeed events={riskEvents} />
            </GlassCard>
          </div>

          <GlassCard
            glowColor="purple"
            className="mb-12 p-6"
            data-testid="threat-matrix"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                Simulated Threat Matrix
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Shield className="w-5 h-5 text-[#3D70B7]" />
                </motion.div>
              </h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-white/10 transition-colors" data-testid="threat-matrix-help">
                    <HelpCircle className="w-5 h-5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-[rgba(10,10,30,0.95)] border-[#3D70B7]/30">
                  <p className="text-sm">Hover over threat dots to see details. Cells pulse when threats are actively detected. Position indicates likelihood (x-axis) and impact (y-axis).</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <LiveThreatMatrix 
              threats={threats} 
              hoveredThreat={hoveredThreat}
              setHoveredThreat={setHoveredThreat}
            />
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              {[
                { severity: 'Critical', color: '#ef4444' },
                { severity: 'High', color: '#f97316' },
                { severity: 'Medium', color: '#eab308' },
                { severity: 'Low', color: '#42BA90' },
              ].map(({ severity, color }) => (
                <div key={severity} className="flex items-center gap-2">
                  <motion.div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                  />
                  <span>{severity}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <GlassCard
              glowColor="cyan"
              className="p-6"
              data-testid="action-items-panel"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Action Items</h3>
                <div className="text-sm text-muted-foreground">
                  {actionItems.filter(a => a.addressed).length}/{actionItems.length} addressed
                </div>
              </div>
              {addressedImpact > 0 && (
                <motion.div 
                  className="mb-4 p-3 rounded-xl bg-[#42BA90]/10 border border-[#42BA90]/30 text-[#42BA90] text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    <span>Projected score after addressing: <strong>{projectedScore}</strong> (-{addressedImpact} pts)</span>
                  </div>
                </motion.div>
              )}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {groupedActions.map((group) => {
                  const isExpanded = expandedPriorities.includes(group.priority);
                  const addressedCount = group.items.filter(i => i.addressed).length;
                  const totalImpact = group.items.reduce((sum, i) => sum + i.impact, 0);
                  
                  return (
                    <div key={group.priority} className="rounded-xl overflow-hidden border border-white/10">
                      <button
                        onClick={() => togglePriority(group.priority)}
                        className={`w-full p-4 flex items-center justify-between transition-all ${getPriorityStyle(group.priority).replace('border-', 'bg-').replace('/50', '/10')}`}
                        data-testid={`accordion-${group.priority}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${getPriorityStyle(group.priority)}`}>
                            {group.priority.charAt(0).toUpperCase() + group.priority.slice(1)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {addressedCount}/{group.items.length} done • -{totalImpact} pts potential
                          </span>
                        </div>
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                          <ChevronDown className="w-5 h-5" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 space-y-2 bg-white/5">
                              {group.items.map((item) => (
                                <motion.div
                                  key={item.id}
                                  layout
                                  className={`p-3 rounded-lg border transition-all ${
                                    item.addressed 
                                      ? 'bg-[#42BA90]/10 border-[#42BA90]/30 opacity-60' 
                                      : 'bg-white/5 border-white/10 hover:border-[#3D70B7]/50'
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                  data-testid={`action-item-${item.id}`}
                                >
                                  <div className="flex items-start gap-3">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleActionItem(item.id);
                                      }}
                                      className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                        item.addressed 
                                          ? 'bg-[#42BA90] border-[#42BA90]' 
                                          : 'border-white/30 hover:border-[#3D70B7]'
                                      }`}
                                      data-testid={`checkbox-${item.id}`}
                                    >
                                      {item.addressed && <CheckCircle className="w-3 h-3 text-white" />}
                                    </button>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-muted-foreground">-{item.impact} pts impact</span>
                                      </div>
                                      <p className={`text-sm ${item.addressed ? 'line-through' : ''}`}>{item.title}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            <GlassCard
              glowColor="purple"
              className="p-6"
              data-testid="compliance-scorecard"
            >
              <h3 className="text-xl font-bold mb-6">Compliance Scorecard</h3>
              <div className="space-y-4">
                {complianceFrameworks.map((framework) => {
                  const isExpanded = expandedFramework === framework.id;
                  const progressColor = framework.progress >= 80 ? 'green' : framework.progress >= 60 ? 'amber' : 'red';
                  return (
                    <GlassCard
                      key={framework.id}
                      glowColor={progressColor as 'green' | 'amber' | 'red'}
                      className="p-4"
                      onClick={() => setExpandedFramework(isExpanded ? null : framework.id)}
                      data-testid={`framework-${framework.id}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{framework.name}</h4>
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </div>
                      <AnimatedProgress
                        value={framework.progress}
                        color={progressColor as 'green' | 'amber' | 'red'}
                        size="md"
                      />
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-4 border-t border-white/10"
                          >
                            <p className="text-sm text-muted-foreground mb-3">Key Requirements:</p>
                            <ul className="space-y-2">
                              {framework.requirements.map((req, i) => (
                                <motion.li 
                                  key={i} 
                                  className="flex items-center gap-2 text-sm"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                >
                                  <motion.div 
                                    className={`w-2 h-2 rounded-full ${
                                      i < Math.ceil(framework.requirements.length * (framework.progress / 100))
                                        ? 'bg-[#42BA90]'
                                        : 'bg-white/20'
                                    }`}
                                    animate={i < Math.ceil(framework.requirements.length * (framework.progress / 100)) ? {
                                      boxShadow: ['0 0 0 rgba(66,186,144,0)', '0 0 8px rgba(66,186,144,0.6)', '0 0 0 rgba(66,186,144,0)']
                                    } : {}}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                  />
                                  <span>{req}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          <GlassCard
            glowColor="cyan"
            className="text-center p-8"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="w-12 h-12 text-[#3D70B7] mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">Ready for a Complete Assessment?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Our cybersecurity experts can provide a comprehensive risk assessment tailored to your organization's specific needs.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-[#3D70B7] to-[#42BA90] hover:opacity-90 transition-all shadow-[0_0_30px_rgba(61, 112, 183,0.3)]"
              data-testid="link-contact-assessment"
            >
              Request Full Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}
