import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowLeft, Cloud, Shield, AlertTriangle, CheckCircle, XCircle, 
  Server, Lock, Eye, Settings, Activity, Zap, Globe2, 
  Container, Key, FileCheck, RefreshCw, TrendingUp, Users,
  Database, Network, Terminal, Cpu, HardDrive, Wifi, X, ChevronDown, ChevronUp
} from 'lucide-react';

type CloudProvider = 'aws' | 'azure' | 'gcp';

interface CloudRegion {
  id: string;
  name: string;
  provider: CloudProvider;
  x: number;
  y: number;
  status: 'healthy' | 'warning' | 'critical';
  resources: number;
  threats: number;
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'threat' | 'warning' | 'info';
  message: string;
  provider: CloudProvider;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  source?: string;
}

interface IAMPolicy {
  id: string;
  name: string;
  riskScore: number;
  issues: number;
  status: 'compliant' | 'non-compliant' | 'review';
  description?: string;
  lastAudit?: string;
}

interface ContainerStatus {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'vulnerable';
  vulnerabilities: number;
  image: string;
  cpu?: number;
  memory?: number;
}

interface ConfigCheck {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  compliant: boolean;
}

interface DataPacket {
  id: string;
  fromRegion: string;
  toRegion: string;
  progress: number;
  color: string;
}

const cloudRegions: CloudRegion[] = [
  { id: 'aws-us-east', name: 'US East (Virginia)', provider: 'aws', x: 25, y: 35, status: 'healthy', resources: 156, threats: 0 },
  { id: 'aws-us-west', name: 'US West (Oregon)', provider: 'aws', x: 12, y: 38, status: 'warning', resources: 89, threats: 2 },
  { id: 'aws-eu-west', name: 'EU West (Ireland)', provider: 'aws', x: 45, y: 28, status: 'healthy', resources: 124, threats: 0 },
  { id: 'aws-ap-south', name: 'Asia Pacific (Mumbai)', provider: 'aws', x: 68, y: 48, status: 'healthy', resources: 67, threats: 1 },
  { id: 'azure-eastus', name: 'East US', provider: 'azure', x: 28, y: 40, status: 'healthy', resources: 203, threats: 0 },
  { id: 'azure-westeu', name: 'West Europe', provider: 'azure', x: 48, y: 32, status: 'critical', resources: 178, threats: 5 },
  { id: 'azure-eastasia', name: 'East Asia', provider: 'azure', x: 82, y: 42, status: 'warning', resources: 95, threats: 3 },
  { id: 'gcp-us-central', name: 'US Central', provider: 'gcp', x: 20, y: 42, status: 'healthy', resources: 112, threats: 0 },
  { id: 'gcp-europe-west', name: 'Europe West', provider: 'gcp', x: 50, y: 30, status: 'healthy', resources: 88, threats: 0 },
  { id: 'gcp-asia-east', name: 'Asia East', provider: 'gcp', x: 85, y: 45, status: 'warning', resources: 76, threats: 2 },
];

const iamPolicies: IAMPolicy[] = [
  { id: 'iam-1', name: 'AdminAccess', riskScore: 85, issues: 3, status: 'non-compliant', description: 'Full administrative access policy with excessive permissions', lastAudit: '2026-01-15' },
  { id: 'iam-2', name: 'DeveloperAccess', riskScore: 45, issues: 1, status: 'review', description: 'Developer role with elevated S3 and Lambda permissions', lastAudit: '2026-01-18' },
  { id: 'iam-3', name: 'ReadOnlyAccess', riskScore: 15, issues: 0, status: 'compliant', description: 'Restricted read-only access for auditors', lastAudit: '2026-01-20' },
  { id: 'iam-4', name: 'S3FullAccess', riskScore: 72, issues: 2, status: 'non-compliant', description: 'Full S3 bucket access including public objects', lastAudit: '2026-01-12' },
  { id: 'iam-5', name: 'LambdaExecute', riskScore: 28, issues: 0, status: 'compliant', description: 'Lambda function execution role', lastAudit: '2026-01-19' },
];

const containers: ContainerStatus[] = [
  { id: 'c-1', name: 'api-gateway', status: 'running', vulnerabilities: 0, image: 'nginx:1.25', cpu: 23, memory: 45 },
  { id: 'c-2', name: 'auth-service', status: 'running', vulnerabilities: 2, image: 'node:18-alpine', cpu: 67, memory: 72 },
  { id: 'c-3', name: 'data-processor', status: 'vulnerable', vulnerabilities: 8, image: 'python:3.9', cpu: 89, memory: 84 },
  { id: 'c-4', name: 'cache-layer', status: 'running', vulnerabilities: 0, image: 'redis:7-alpine', cpu: 12, memory: 38 },
  { id: 'c-5', name: 'message-queue', status: 'stopped', vulnerabilities: 1, image: 'rabbitmq:3.12', cpu: 0, memory: 0 },
];

const initialConfigChecks: ConfigCheck[] = [
  { id: 'cfg-1', name: 'MFA Enabled for Root Account', category: 'Identity', enabled: true, compliant: true },
  { id: 'cfg-2', name: 'S3 Bucket Encryption', category: 'Storage', enabled: true, compliant: true },
  { id: 'cfg-3', name: 'VPC Flow Logs', category: 'Network', enabled: true, compliant: false },
  { id: 'cfg-4', name: 'CloudTrail Logging', category: 'Monitoring', enabled: true, compliant: true },
  { id: 'cfg-5', name: 'Security Groups Review', category: 'Network', enabled: false, compliant: false },
  { id: 'cfg-6', name: 'KMS Key Rotation', category: 'Encryption', enabled: true, compliant: true },
  { id: 'cfg-7', name: 'Public Access Block', category: 'Storage', enabled: true, compliant: false },
  { id: 'cfg-8', name: 'WAF Rules Active', category: 'Security', enabled: true, compliant: true },
];

const eventMessages = [
  { type: 'threat' as const, message: 'Unauthorized API call detected from unknown IP', severity: 'critical' as const, source: 'CloudTrail' },
  { type: 'warning' as const, message: 'IAM policy exceeds privilege threshold', severity: 'high' as const, source: 'IAM Analyzer' },
  { type: 'info' as const, message: 'Security group rule updated successfully', severity: 'low' as const, source: 'VPC' },
  { type: 'threat' as const, message: 'Suspicious login attempt blocked', severity: 'critical' as const, source: 'GuardDuty' },
  { type: 'warning' as const, message: 'Container image vulnerability detected', severity: 'high' as const, source: 'ECR' },
  { type: 'info' as const, message: 'Encryption key rotated automatically', severity: 'low' as const, source: 'KMS' },
  { type: 'threat' as const, message: 'Data exfiltration attempt prevented', severity: 'critical' as const, source: 'Macie' },
  { type: 'warning' as const, message: 'Unused credentials detected (90+ days)', severity: 'medium' as const, source: 'IAM' },
  { type: 'threat' as const, message: 'Cryptomining activity detected on EC2', severity: 'critical' as const, source: 'GuardDuty' },
  { type: 'warning' as const, message: 'Public S3 bucket access detected', severity: 'high' as const, source: 'Access Analyzer' },
];

function CircularProgress({ value, size = 80, strokeWidth = 6, color = '#00D4FF', label, sublabel }: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold font-mono" style={{ color }}>{Math.round(animatedValue)}%</span>
        {label && <span className="text-[9px] text-white/60 font-mono">{label}</span>}
        {sublabel && <span className="text-[8px] text-white/40 font-mono">{sublabel}</span>}
      </div>
    </div>
  );
}

function AnimatedGridBackground({ eventCount }: { eventCount: number }) {
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    setPulseIntensity(1);
    const timer = setTimeout(() => setPulseIntensity(0), 500);
    return () => clearTimeout(timer);
  }, [eventCount]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: 0.15 + pulseIntensity * 0.1,
          background: `radial-gradient(ellipse at 50% 30%, rgba(0, 212, 255, 0.05) 0%, transparent 60%),
                       radial-gradient(ellipse at 20% 70%, rgba(0, 119, 182, 0.04) 0%, transparent 50%)`,
        }}
      />
      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        @keyframes scanLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulse3d {
          0%, 100% { transform: perspective(1000px) rotateX(0deg) translateZ(0); }
          50% { transform: perspective(1000px) rotateX(2deg) translateZ(10px); }
        }
      `}</style>
      
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${100 + Math.random() * 20}%`,
            backgroundColor: i % 3 === 0 ? '#00D4FF' : '#00D4FF',
            animation: `particleFloat ${15 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: 0.4,
          }}
        />
      ))}
      
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent"
        style={{
          animation: 'scanLine 8s linear infinite',
        }}
      />
      
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: pulseIntensity > 0 
            ? 'radial-gradient(ellipse at 50% 50%, rgba(255, 68, 68, 0.05) 0%, transparent 50%)' 
            : 'transparent',
        }}
      />
    </div>
  );
}

function InfrastructureNode({ region, isSelected, onClick }: {
  region: CloudRegion;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    healthy: { bg: 'bg-green-500', glow: '#22c55e' },
    warning: { bg: 'bg-yellow-500', glow: '#eab308' },
    critical: { bg: 'bg-red-500', glow: '#ef4444' },
  };

  const { bg, glow } = statusColors[region.status];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isSelected ? 1.3 : 1, 
        opacity: 1,
      }}
      whileHover={{ scale: 1.4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
      style={{ left: `${region.x}%`, top: `${region.y}%` }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`region-node-${region.id}`}
    >
      <div className="relative">
        <div 
          className={`w-4 h-4 rounded-full ${bg}`}
          style={{
            boxShadow: `0 0 ${isHovered ? 20 : 10}px ${glow}, 0 0 ${isHovered ? 40 : 20}px ${glow}50`,
          }}
        />
        
        <div 
          className={`absolute inset-0 rounded-full ${bg} animate-ping`}
          style={{ animationDuration: region.status === 'critical' ? '0.5s' : '2s' }}
        />
        
        {region.status === 'critical' && (
          <>
            <div className="absolute -inset-2 rounded-full border-2 border-red-500/50 animate-ping" style={{ animationDuration: '1s' }} />
            <div className="absolute -inset-4 rounded-full border border-red-500/30 animate-ping" style={{ animationDuration: '1.5s' }} />
          </>
        )}

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50"
            >
              <div 
                className="bg-[#000510]/95 border border-[#00D4FF]/50 rounded-xl p-3 whitespace-nowrap font-mono backdrop-blur-xl"
                style={{ 
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
                  minWidth: '180px'
                }}
              >
                <div className="text-[#00D4FF] font-bold text-sm mb-1">{region.name}</div>
                <div className="text-white/50 text-[10px] uppercase tracking-wider mb-2">{region.provider}</div>
                <div className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Server className="w-3 h-3 text-cyan-400" />
                    <span className="text-green-400">{region.resources}</span>
                  </div>
                  {region.threats > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      <span className="text-red-400">{region.threats}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className={`text-[10px] uppercase tracking-wider ${
                    region.status === 'healthy' ? 'text-green-400' :
                    region.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    Status: {region.status}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Interactive3DCard({ children, className, onClick, isExpanded, dataTestId }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isExpanded?: boolean;
  dataTestId?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <motion.div
      ref={cardRef}
      className={`transition-all duration-200 ${className}`}
      style={{ 
        transform: transform || undefined,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      layout
      data-testid={dataTestId}
    >
      {children}
    </motion.div>
  );
}

function ThreatAlert({ event, onDismiss }: { event: SecurityEvent; onDismiss: () => void }) {
  const severityConfig = {
    critical: { bg: 'from-red-900/90', border: 'border-red-500', text: 'text-red-400', glow: 'shadow-red-500/50' },
    high: { bg: 'from-orange-900/90', border: 'border-orange-500', text: 'text-orange-400', glow: 'shadow-orange-500/50' },
    medium: { bg: 'from-yellow-900/90', border: 'border-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/50' },
    low: { bg: 'from-blue-900/90', border: 'border-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/50' },
  };

  const config = severityConfig[event.severity || 'medium'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      className={`fixed top-24 right-4 z-50 max-w-sm bg-gradient-to-r ${config.bg} to-black/95 backdrop-blur-xl border ${config.border} rounded-xl p-4 shadow-lg ${config.glow}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-black/50 ${config.text}`}>
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className={`font-mono text-xs uppercase tracking-wider ${config.text} mb-1`}>
            {event.severity?.toUpperCase()} ALERT
          </div>
          <p className="text-white text-sm font-mono">{event.message}</p>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-white/50">
            <span>{event.timestamp}</span>
            <span>•</span>
            <span>{event.source}</span>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-4 h-4 text-white/50" />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50 rounded-b-xl overflow-hidden">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className={`h-full ${config.text.replace('text-', 'bg-')}`}
        />
      </div>
    </motion.div>
  );
}

function SecurityEventItem({ event, index }: { event: SecurityEvent; index: number }) {
  const getEventStyles = () => {
    switch (event.type) {
      case 'threat':
        return { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: <AlertTriangle className="w-4 h-4 text-red-400" /> };
      case 'warning':
        return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: <Eye className="w-4 h-4 text-yellow-400" /> };
      default:
        return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: <CheckCircle className="w-4 h-4 text-cyan-400" /> };
    }
  };

  const styles = getEventStyles();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: 50, height: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 400, damping: 30 }}
      className={`p-3 rounded-xl ${styles.bg} border ${styles.border} backdrop-blur-sm relative overflow-hidden`}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-current to-transparent opacity-50" 
        style={{ color: event.type === 'threat' ? '#ef4444' : event.type === 'warning' ? '#eab308' : '#00D4FF' }} 
      />
      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {styles.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm text-white leading-tight">{event.message}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[10px] text-white/40 font-mono">{event.timestamp}</span>
            {event.source && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60 font-mono">
                {event.source}
              </span>
            )}
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              event.provider === 'aws' ? 'bg-[#FF9900]/20 text-[#FF9900]' :
              event.provider === 'azure' ? 'bg-[#0078D4]/20 text-[#0078D4]' :
              'bg-[#4285F4]/20 text-[#4285F4]'
            }`}>
              {event.provider.toUpperCase()}
            </span>
          </div>
        </div>
        {event.severity && (
          <span className={`text-[9px] px-2 py-1 rounded font-mono font-bold uppercase ${
            event.severity === 'critical' ? 'bg-red-500/20 text-red-400 animate-pulse' :
            event.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
            event.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {event.severity}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function CloudSecurityCenter() {
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | 'all'>('all');
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [configChecks, setConfigChecks] = useState(initialConfigChecks);
  const [overallRiskScore, setOverallRiskScore] = useState(0);
  const [animatedMetrics, setAnimatedMetrics] = useState({ resources: 0, threats: 0, containers: 0 });
  const [connectionPulse, setConnectionPulse] = useState(0);
  const [dataPackets, setDataPackets] = useState<DataPacket[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [activeAlert, setActiveAlert] = useState<SecurityEvent | null>(null);
  const [complianceScore, setComplianceScore] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const filteredRegions = selectedProvider === 'all' 
    ? cloudRegions 
    : cloudRegions.filter(r => r.provider === selectedProvider);

  const totalResources = filteredRegions.reduce((sum, r) => sum + r.resources, 0);
  const totalThreats = filteredRegions.reduce((sum, r) => sum + r.threats, 0);
  const activeContainers = containers.filter(c => c.status === 'running').length;
  const compliantChecks = configChecks.filter(c => c.compliant).length;

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedMetrics({
        resources: Math.round(totalResources * eased),
        threats: Math.round(totalThreats * eased),
        containers: Math.round(activeContainers * eased),
      });
      setOverallRiskScore(Math.round(42 * eased));
      setComplianceScore(Math.round((compliantChecks / configChecks.length) * 100 * eased));

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [totalResources, totalThreats, activeContainers, compliantChecks, configChecks.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      const providers: CloudProvider[] = ['aws', 'azure', 'gcp'];
      const eventTemplate = eventMessages[Math.floor(Math.random() * eventMessages.length)];
      const newEvent: SecurityEvent = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: eventTemplate.type,
        message: eventTemplate.message,
        provider: providers[Math.floor(Math.random() * providers.length)],
        severity: eventTemplate.severity,
        source: eventTemplate.source,
      };
      
      setEvents(prev => [newEvent, ...prev.slice(0, 7)]);
      
      if (eventTemplate.type === 'threat' && Math.random() > 0.5) {
        setActiveAlert(newEvent);
        setTimeout(() => setActiveAlert(null), 5000);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionPulse(prev => (prev + 1) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (filteredRegions.length < 2) return;
      
      const fromIdx = Math.floor(Math.random() * filteredRegions.length);
      let toIdx = Math.floor(Math.random() * filteredRegions.length);
      while (toIdx === fromIdx) toIdx = Math.floor(Math.random() * filteredRegions.length);
      
      const newPacket: DataPacket = {
        id: Date.now().toString(),
        fromRegion: filteredRegions[fromIdx].id,
        toRegion: filteredRegions[toIdx].id,
        progress: 0,
        color: Math.random() > 0.7 ? '#00D4FF' : '#00D4FF',
      };
      
      setDataPackets(prev => [...prev, newPacket]);
    }, 800);
    
    return () => clearInterval(interval);
  }, [filteredRegions]);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setDataPackets(prev => 
        prev
          .map(p => ({ ...p, progress: p.progress + 0.02 }))
          .filter(p => p.progress <= 1)
      );
    }, 16);
    
    return () => clearInterval(animationInterval);
  }, []);

  const toggleConfig = useCallback((id: string) => {
    setConfigChecks(prev => prev.map(check => 
      check.id === id ? { ...check, enabled: !check.enabled } : check
    ));
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
      case 'compliant':
        return 'bg-green-500';
      case 'warning':
      case 'review':
        return 'bg-yellow-500';
      case 'critical':
      case 'vulnerable':
      case 'non-compliant':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const regionMap = useMemo(() => {
    const map: Record<string, CloudRegion> = {};
    cloudRegions.forEach(r => { map[r.id] = r; });
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-[#000510] text-white relative overflow-hidden">
      <AnimatedGridBackground eventCount={events.length} />
      
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(0, 212, 255, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(153, 68, 255, 0.05) 0%, transparent 40%),
            radial-gradient(ellipse at 20% 60%, rgba(0, 212, 255, 0.03) 0%, transparent 30%)
          `,
        }}
      />

      <AnimatePresence>
        {activeAlert && (
          <ThreatAlert event={activeAlert} onDismiss={() => setActiveAlert(null)} />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#000510]/90 border-b border-[#00D4FF]/20">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <Link
              href="/experience"
              className="flex items-center gap-2 text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors font-mono text-sm"
              data-testid="link-back-experience"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Experience</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 font-mono text-xs">
                <motion.div 
                  className="flex items-center gap-2 text-[#00D4FF]"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Server className="w-3 h-3" />
                  <span className="text-white">{animatedMetrics.resources}</span>
                  <span className="text-[#00D4FF]/70">resources</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 text-yellow-400"
                  animate={totalThreats > 0 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>{animatedMetrics.threats}</span>
                  <span className="text-[#00D4FF]/70">threats</span>
                </motion.div>
              </div>
              <div className="flex items-center gap-2 bg-[#00D4FF]/10 px-3 py-1.5 rounded border border-[#00D4FF]/30">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-[#00D4FF]"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs text-[#00D4FF] font-mono font-bold">MONITORING ACTIVE</span>
              </div>
            </div>
          </div>
        </header>

        <main className="pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-6 mb-6"
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded px-4 py-2 mb-4 font-mono text-xs"
              animate={{ borderColor: ['rgba(0, 212, 255,0.3)', 'rgba(153,68,255,0.3)', 'rgba(0, 212, 255,0.3)'] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Cloud className="w-4 h-4 text-[#00D4FF]" />
              <span className="text-[#00D4FF]">CLOUD SECURITY COMMAND CENTER</span>
            </motion.div>

            <h1 className="font-mono text-3xl md:text-5xl font-bold mb-3">
              <span className="text-[#00D4FF]">Cloud </span>
              <span className="text-white">Infrastructure</span>
              <span className="text-[#00D4FF]"> Security</span>
            </h1>

            <p className="text-[#00D4FF]/60 font-mono text-sm max-w-2xl mx-auto">
              Real-time monitoring and threat detection across AWS, Azure, and GCP environments
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="container mx-auto px-6 mb-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Interactive3DCard 
                className="bg-gradient-to-br from-[#00D4FF]/20 to-[#00D4FF]/5 backdrop-blur-sm border border-[#00D4FF]/40 rounded-2xl p-4 relative overflow-hidden group hover:border-[#00D4FF] cursor-pointer" 
                dataTestId="metric-card-resources"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D4FF]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                      <Server className="w-5 h-5 text-[#00D4FF]" />
                    </motion.div>
                    <span className="font-mono text-xs text-[#00D4FF]/70 uppercase">Total Resources</span>
                  </div>
                  <div className="text-3xl font-bold font-mono text-white">{animatedMetrics.resources}</div>
                  <div className="text-xs text-[#00D4FF]/50 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% this month
                  </div>
                </div>
              </Interactive3DCard>

              <Interactive3DCard 
                className="bg-gradient-to-br from-red-500/20 to-red-500/5 backdrop-blur-sm border border-red-500/40 rounded-2xl p-4 relative overflow-hidden group hover:border-red-500 cursor-pointer" 
                dataTestId="metric-card-threats"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div 
                      animate={totalThreats > 0 ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </motion.div>
                    <span className="font-mono text-xs text-red-400/70 uppercase">Active Threats</span>
                  </div>
                  <div className="text-3xl font-bold font-mono text-red-400">{animatedMetrics.threats}</div>
                  <div className="text-xs text-red-400/50 mt-1">Requires attention</div>
                </div>
              </Interactive3DCard>

              <Interactive3DCard 
                className="bg-gradient-to-br from-green-500/20 to-green-500/5 backdrop-blur-sm border border-green-500/40 rounded-2xl p-4 relative overflow-hidden group hover:border-green-500 cursor-pointer" 
                dataTestId="metric-card-containers"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Container className="w-5 h-5 text-green-400" />
                    <span className="font-mono text-xs text-green-400/70 uppercase">Running Containers</span>
                  </div>
                  <div className="text-3xl font-bold font-mono text-green-400">{animatedMetrics.containers}</div>
                  <div className="text-xs text-green-400/50 mt-1">{containers.length} total deployed</div>
                </div>
              </Interactive3DCard>

              <Interactive3DCard 
                className="bg-gradient-to-br from-[#00D4FF]/20 to-[#00D4FF]/5 backdrop-blur-sm border border-[#00D4FF]/40 rounded-2xl p-4 relative overflow-hidden group hover:border-[#00D4FF] cursor-pointer" 
                dataTestId="metric-card-regions"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D4FF]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe2 className="w-5 h-5 text-[#00D4FF]" />
                    <span className="font-mono text-xs text-[#00D4FF]/70 uppercase">Active Regions</span>
                  </div>
                  <div className="text-3xl font-bold font-mono text-[#00D4FF]">{filteredRegions.length}</div>
                  <div className="text-xs text-[#00D4FF]/50 mt-1">Across {selectedProvider === 'all' ? '3 providers' : selectedProvider.toUpperCase()}</div>
                </div>
              </Interactive3DCard>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="container mx-auto px-6 mb-6"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              {(['all', 'aws', 'azure', 'gcp'] as const).map((provider) => {
                const isSelected = selectedProvider === provider;
                const colors = {
                  all: { active: 'bg-[#00D4FF] text-[#000510]', inactive: 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30 hover:bg-[#00D4FF]/20' },
                  aws: { active: 'bg-[#FF9900] text-black', inactive: 'bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/30 hover:bg-[#FF9900]/20' },
                  azure: { active: 'bg-[#0078D4] text-white', inactive: 'bg-[#0078D4]/10 text-[#0078D4] border-[#0078D4]/30 hover:bg-[#0078D4]/20' },
                  gcp: { active: 'bg-[#4285F4] text-white', inactive: 'bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/30 hover:bg-[#4285F4]/20' },
                };
                
                return (
                  <motion.button
                    key={provider}
                    onClick={() => setSelectedProvider(provider)}
                    className={`px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center gap-2 ${
                      isSelected ? colors[provider].active : `${colors[provider].inactive} border`
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`btn-provider-${provider}`}
                  >
                    {provider !== 'all' && <Cloud className="w-4 h-4" />}
                    {provider === 'all' ? 'All Providers' : provider.toUpperCase()}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-4 md:mx-8 mb-6"
          >
            <div 
              className="relative rounded-2xl overflow-hidden border border-[#00D4FF]/30 bg-[#000510]/80 backdrop-blur-sm"
              style={{ height: '350px' }}
              data-testid="cloud-infrastructure-map"
            >
              <div className="absolute inset-0 opacity-30">
                <svg width="100%" height="100%" viewBox="0 0 100 80">
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00D4FF" stopOpacity="0" />
                      <stop offset="50%" stopColor="#00D4FF" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M10,40 Q30,20 50,35 T90,40" fill="none" stroke="url(#lineGrad)" strokeWidth="0.3" />
                  <path d="M20,60 Q40,40 60,55 T80,45" fill="none" stroke="url(#lineGrad)" strokeWidth="0.3" />
                </svg>
              </div>

              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80">
                {filteredRegions.map((region, i) => 
                  filteredRegions.slice(i + 1).map((target, j) => {
                    const isSelected = selectedRegion === region.id || selectedRegion === target.id;
                    return (
                      <g key={`${region.id}-${target.id}`}>
                        <line
                          x1={region.x}
                          y1={region.y}
                          x2={target.x}
                          y2={target.y}
                          stroke={isSelected ? '#00D4FF' : '#00D4FF'}
                          strokeWidth={isSelected ? 0.3 : 0.15}
                          opacity={isSelected ? 0.5 : 0.2}
                        />
                      </g>
                    );
                  })
                )}
                
                {dataPackets.map((packet) => {
                  const from = regionMap[packet.fromRegion];
                  const to = regionMap[packet.toRegion];
                  if (!from || !to) return null;
                  
                  const x = from.x + (to.x - from.x) * packet.progress;
                  const y = from.y + (to.y - from.y) * packet.progress;
                  const arcHeight = Math.sin(packet.progress * Math.PI) * 8;
                  
                  return (
                    <g key={packet.id}>
                      <circle
                        cx={x}
                        cy={y - arcHeight}
                        r="0.8"
                        fill={packet.color}
                        opacity={1 - packet.progress * 0.5}
                      >
                        <animate
                          attributeName="r"
                          values="0.6;1;0.6"
                          dur="0.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx={x}
                        cy={y - arcHeight}
                        r="1.5"
                        fill={packet.color}
                        opacity={0.3 - packet.progress * 0.2}
                      />
                    </g>
                  );
                })}
              </svg>

              <div className="relative w-full h-full">
                {filteredRegions.map((region) => (
                  <InfrastructureNode
                    key={region.id}
                    region={region}
                    isSelected={selectedRegion === region.id}
                    onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                  />
                ))}
              </div>

              <div className="absolute top-3 left-3 flex items-center gap-4 font-mono text-[10px]">
                <div className="flex items-center gap-1">
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-green-400">Healthy</span>
                </div>
                <div className="flex items-center gap-1">
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-yellow-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-yellow-400">Warning</span>
                </div>
                <div className="flex items-center gap-1">
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <span className="text-red-400">Critical</span>
                </div>
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-2">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-[#00D4FF]/20">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-[#00D4FF]" />
                    <span className="text-[10px] text-white/60 font-mono">DATA FLOW</span>
                    <motion.div 
                      className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-3 right-3 font-mono text-[10px] text-[#00D4FF]/50">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-3 h-3" />
                  <span>{filteredRegions.length} active regions</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#000510]/80 backdrop-blur-sm border border-[#00D4FF]/30 rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-[#00D4FF]/10">
                    <Key className="w-5 h-5 text-[#00D4FF]" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-white">IAM Policy Assessment</h3>
                    <p className="text-xs text-[#00D4FF]/60">Risk score analysis</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {iamPolicies.map((policy) => (
                    <Interactive3DCard
                      key={policy.id}
                      onClick={() => setExpandedCard(expandedCard === policy.id ? null : policy.id)}
                      isExpanded={expandedCard === policy.id}
                      dataTestId={`iam-policy-${policy.id}`}
                      className="cursor-pointer"
                    >
                      <motion.div
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#00D4FF]/30 transition-all"
                        layout
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-white">{policy.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-sm font-bold ${getRiskColor(policy.riskScore)}`}>
                              {policy.riskScore}
                            </span>
                            <motion.div
                              animate={{ rotate: expandedCard === policy.id ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4 text-white/50" />
                            </motion.div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden mr-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${policy.riskScore}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-full rounded-full ${
                                policy.riskScore >= 70 ? 'bg-red-500' : policy.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                            />
                          </div>
                          <div className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            policy.status === 'compliant' ? 'bg-green-500/20 text-green-400' :
                            policy.status === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {policy.issues} issues
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {expandedCard === policy.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-white/10"
                            >
                              <p className="text-xs text-white/60 mb-2">{policy.description}</p>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-white/40">Last Audit: {policy.lastAudit}</span>
                                <button className="text-[#00D4FF] hover:text-[#00D4FF]/80">View Details →</button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Interactive3DCard>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#000510]/80 backdrop-blur-sm border border-[#00D4FF]/30 rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-[#00D4FF]/10">
                    <Container className="w-5 h-5 text-[#00D4FF]" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-white">Container Security</h3>
                    <p className="text-xs text-[#00D4FF]/60">{animatedMetrics.containers} running</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {containers.map((container) => (
                    <Interactive3DCard
                      key={container.id}
                      onClick={() => setExpandedCard(expandedCard === container.id ? null : container.id)}
                      dataTestId={`container-${container.id}`}
                      className="cursor-pointer"
                    >
                      <motion.div
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#00D4FF]/30 transition-all"
                        layout
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <motion.div 
                              className={`w-2 h-2 rounded-full ${getStatusColor(container.status)}`}
                              animate={container.status === 'running' ? { scale: [1, 1.3, 1] } : {}}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="font-mono text-sm text-white">{container.name}</span>
                          </div>
                          {container.vulnerabilities > 0 && (
                            <motion.span 
                              className="text-[10px] font-mono text-red-400 bg-red-500/20 px-2 py-0.5 rounded"
                              animate={{ opacity: [1, 0.6, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              {container.vulnerabilities} CVEs
                            </motion.span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#00D4FF]/50 font-mono">{container.image}</div>
                        
                        <AnimatePresence>
                          {expandedCard === container.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-white/10"
                            >
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <div className="text-[10px] text-white/40 mb-1">CPU Usage</div>
                                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${container.cpu}%` }}
                                      className="h-full bg-[#00D4FF] rounded-full"
                                    />
                                  </div>
                                  <div className="text-[10px] text-[#00D4FF] mt-0.5">{container.cpu}%</div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-white/40 mb-1">Memory</div>
                                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${container.memory}%` }}
                                      className="h-full bg-[#00D4FF] rounded-full"
                                    />
                                  </div>
                                  <div className="text-[10px] text-[#00D4FF] mt-0.5">{container.memory}%</div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Interactive3DCard>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-[#000510]/80 backdrop-blur-sm border border-[#00D4FF]/30 rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-[#00D4FF]/10">
                    <FileCheck className="w-5 h-5 text-[#00D4FF]" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-white">Configuration Checklist</h3>
                    <p className="text-xs text-[#00D4FF]/60">Cloud hardening status</p>
                  </div>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#00D4FF]/20 scrollbar-track-transparent">
                  {configChecks.map((check, index) => (
                    <motion.div
                      key={check.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#00D4FF]/30 transition-all"
                      data-testid={`config-check-${check.id}`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <motion.div
                          animate={check.compliant ? {} : { scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          {check.compliant ? (
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          )}
                        </motion.div>
                        <span className="font-mono text-xs text-white truncate">{check.name}</span>
                      </div>
                      <button
                        onClick={() => toggleConfig(check.id)}
                        className={`w-10 h-5 rounded-full transition-all flex-shrink-0 ml-2 relative ${
                          check.enabled ? 'bg-[#00D4FF]' : 'bg-white/20'
                        }`}
                        data-testid={`toggle-${check.id}`}
                      >
                        <motion.div
                          className="w-4 h-4 rounded-full bg-white absolute top-0.5"
                          animate={{ left: check.enabled ? '22px' : '2px' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-[#000510]/80 backdrop-blur-sm border border-[#00D4FF]/30 rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Activity className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-white">Live Security Events</h3>
                    <p className="text-xs text-[#00D4FF]/60">Real-time threat detection</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-red-500"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-[10px] text-red-400 font-mono">LIVE</span>
                  </div>
                </div>

                <div className="space-y-2 h-[280px] overflow-hidden relative" data-testid="security-events-feed">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#000510] to-transparent z-10 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#000510] to-transparent z-10 pointer-events-none" />
                  
                  <AnimatePresence mode="popLayout">
                    {events.map((event, index) => (
                      <SecurityEventItem key={event.id} event={event} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 gap-4"
              >
                <Interactive3DCard 
                  className="bg-[#000510]/80 backdrop-blur-sm border border-[#00D4FF]/30 rounded-2xl p-5"
                  dataTestId="metric-risk-score"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-[#00D4FF]" />
                    <span className="font-mono text-sm text-[#00D4FF]/70">Risk Score</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CircularProgress 
                      value={overallRiskScore} 
                      size={100} 
                      strokeWidth={8}
                      color={overallRiskScore >= 70 ? '#ef4444' : overallRiskScore >= 40 ? '#eab308' : '#22c55e'}
                      label="RISK"
                    />
                  </div>
                </Interactive3DCard>

                <Interactive3DCard 
                  className="bg-[#000510]/80 backdrop-blur-sm border border-green-500/30 rounded-2xl p-5"
                  dataTestId="metric-compliance"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileCheck className="w-5 h-5 text-green-400" />
                    <span className="font-mono text-sm text-green-400/70">Compliance</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CircularProgress 
                      value={complianceScore} 
                      size={100} 
                      strokeWidth={8}
                      color="#22c55e"
                      label="SCORE"
                    />
                  </div>
                </Interactive3DCard>

                <Interactive3DCard 
                  className="bg-[#000510]/80 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-5"
                  dataTestId="metric-vulnerabilities"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span className="font-mono text-sm text-yellow-400/70">Open CVEs</span>
                  </div>
                  <motion.div 
                    className="text-4xl font-bold font-mono text-yellow-400"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {containers.reduce((sum, c) => sum + c.vulnerabilities, 0)}
                  </motion.div>
                  <div className="text-xs text-yellow-400/50 mt-1">across containers</div>
                </Interactive3DCard>

                <Interactive3DCard 
                  className="bg-[#000510]/80 backdrop-blur-sm border border-[#00D4FF]/30 rounded-2xl p-5"
                  dataTestId="metric-policies"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-5 h-5 text-[#00D4FF]" />
                    <span className="font-mono text-sm text-[#00D4FF]/70">Policies</span>
                  </div>
                  <div className="text-4xl font-bold font-mono text-[#00D4FF]">
                    {iamPolicies.filter(p => p.status === 'compliant').length}/{iamPolicies.length}
                  </div>
                  <div className="text-xs text-[#00D4FF]/50 mt-1">compliant</div>
                </Interactive3DCard>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-[#00D4FF]/5 via-[#00D4FF]/10 to-[#00D4FF]/5 border border-[#00D4FF]/30 rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(153, 68, 255, 0.1) 0%, transparent 50%)',
                  }}
                />
              </div>
              
              <div className="max-w-3xl mx-auto text-center relative">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Shield className="w-8 h-8 text-[#00D4FF]" />
                  </motion.div>
                  <h2 className="font-mono text-2xl font-bold text-white">
                    Secure Your Cloud Infrastructure
                  </h2>
                </div>

                <p className="text-[#00D4FF]/70 font-mono text-sm mb-6">
                  Get a comprehensive cloud security assessment from our expert team.
                  We'll identify vulnerabilities, misconfigurations, and compliance gaps.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6 font-mono text-center">
                  <Interactive3DCard className="bg-[#000510]/60 rounded-lg p-3 border border-[#00D4FF]/20">
                    <motion.div 
                      className="text-2xl font-bold text-[#00D4FF]"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      200+
                    </motion.div>
                    <div className="text-[10px] text-[#00D4FF]/50">SECURITY CHECKS</div>
                  </Interactive3DCard>
                  <Interactive3DCard className="bg-[#000510]/60 rounded-lg p-3 border border-[#00D4FF]/20">
                    <motion.div 
                      className="text-2xl font-bold text-[#00D4FF]"
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      24/7
                    </motion.div>
                    <div className="text-[10px] text-[#00D4FF]/50">MONITORING</div>
                  </Interactive3DCard>
                  <Interactive3DCard className="bg-[#000510]/60 rounded-lg p-3 border border-[#00D4FF]/20">
                    <div className="text-2xl font-bold text-[#00D4FF]">48h</div>
                    <div className="text-[10px] text-[#00D4FF]/50">RESPONSE TIME</div>
                  </Interactive3DCard>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-[#00D4FF] text-[#000510] font-mono font-bold px-6 py-3 rounded-lg hover:bg-[#00D4FF]/90 transition-all hover:scale-105"
                    data-testid="cta-get-assessment"
                  >
                    <Shield className="w-4 h-4" />
                    Get Cloud Assessment
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#00D4FF]/50 text-[#00D4FF] font-mono px-6 py-3 rounded-lg hover:bg-[#00D4FF]/10 transition-all hover:scale-105"
                    data-testid="cta-learn-more"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
