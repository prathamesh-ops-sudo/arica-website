import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowLeft, Smartphone, Tablet, Shield, AlertTriangle, CheckCircle, 
  XCircle, Lock, Eye, Wifi, Camera, MapPin, Mic, Phone, MessageSquare,
  Database, Key, FileWarning, Bug, ChevronDown, ChevronRight, Send,
  Zap, Activity, Radio, ShieldAlert, ShieldCheck, Target
} from 'lucide-react';
import { AmbientParticles } from '@/components/ui/ambient-particles';
import { PhoneSecurityVisualization } from '@/components/ui/phone-security-visualization';

interface MobileDevice {
  id: string;
  name: string;
  type: 'phone' | 'tablet';
  os: 'ios' | 'android';
  version: string;
  specs: {
    screen: string;
    processor: string;
    ram: string;
    storage: string;
  };
}

interface Vulnerability {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'storage' | 'crypto' | 'auth' | 'tampering';
  description: string;
  recommendation: string;
  cveId?: string;
  affectedComponent?: string;
  expanded?: boolean;
}

interface OWASPItem {
  id: string;
  name: string;
  description: string;
  passed: boolean | null;
}

interface Permission {
  id: string;
  name: string;
  icon: typeof Camera;
  risk: 'dangerous' | 'normal' | 'safe';
  description: string;
  granted: boolean;
}

interface ThreatCount {
  critical: number;
  high: number;
  medium: number;
  low: number;
  blocked: number;
}

const devices: MobileDevice[] = [
  {
    id: 'iphone-15',
    name: 'iPhone 15 Pro',
    type: 'phone',
    os: 'ios',
    version: 'iOS 17.2',
    specs: { screen: '6.1" OLED', processor: 'A17 Pro', ram: '8GB', storage: '256GB' }
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE',
    type: 'phone',
    os: 'ios',
    version: 'iOS 17.1',
    specs: { screen: '4.7" LCD', processor: 'A15 Bionic', ram: '4GB', storage: '128GB' }
  },
  {
    id: 'ipad-pro',
    name: 'iPad Pro',
    type: 'tablet',
    os: 'ios',
    version: 'iPadOS 17.2',
    specs: { screen: '12.9" LCD', processor: 'M2', ram: '8GB', storage: '512GB' }
  },
  {
    id: 'pixel-8',
    name: 'Pixel 8 Pro',
    type: 'phone',
    os: 'android',
    version: 'Android 14',
    specs: { screen: '6.7" OLED', processor: 'Tensor G3', ram: '12GB', storage: '256GB' }
  },
  {
    id: 'samsung-s24',
    name: 'Samsung S24 Ultra',
    type: 'phone',
    os: 'android',
    version: 'Android 14',
    specs: { screen: '6.8" AMOLED', processor: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '512GB' }
  },
  {
    id: 'galaxy-tab',
    name: 'Galaxy Tab S9',
    type: 'tablet',
    os: 'android',
    version: 'Android 13',
    specs: { screen: '11" AMOLED', processor: 'Snapdragon 8 Gen 2', ram: '8GB', storage: '256GB' }
  },
];

const scanPhases = [
  { id: 'binary', name: 'Binary Analysis', duration: 2000, icon: Target },
  { id: 'network', name: 'Network Traffic', duration: 2500, icon: Wifi },
  { id: 'storage', name: 'Data Storage', duration: 2000, icon: Database },
  { id: 'auth', name: 'Authentication', duration: 1800, icon: Key },
  { id: 'permissions', name: 'Permissions', duration: 1500, icon: Shield },
];

const initialOWASPItems: OWASPItem[] = [
  { id: 'm1', name: 'M1: Improper Platform Usage', description: 'Misuse of platform features or security controls', passed: null },
  { id: 'm2', name: 'M2: Insecure Data Storage', description: 'Sensitive data stored insecurely on device', passed: null },
  { id: 'm3', name: 'M3: Insecure Communication', description: 'Poor handshaking, incorrect SSL versions', passed: null },
  { id: 'm4', name: 'M4: Insecure Authentication', description: 'Weak authentication mechanisms', passed: null },
  { id: 'm5', name: 'M5: Insufficient Cryptography', description: 'Weak or broken cryptographic algorithms', passed: null },
  { id: 'm6', name: 'M6: Insecure Authorization', description: 'Weak authorization checks on backend', passed: null },
  { id: 'm7', name: 'M7: Client Code Quality', description: 'Poor code quality leading to vulnerabilities', passed: null },
  { id: 'm8', name: 'M8: Code Tampering', description: 'Binary patching, method hooking', passed: null },
  { id: 'm9', name: 'M9: Reverse Engineering', description: 'Lack of binary protections', passed: null },
  { id: 'm10', name: 'M10: Extraneous Functionality', description: 'Hidden backdoors, test code in production', passed: null },
];

const initialPermissions: Permission[] = [
  { id: 'camera', name: 'Camera', icon: Camera, risk: 'dangerous', description: 'Access device camera for photos and video', granted: true },
  { id: 'location', name: 'Location', icon: MapPin, risk: 'dangerous', description: 'Access precise GPS location data', granted: true },
  { id: 'microphone', name: 'Microphone', icon: Mic, risk: 'dangerous', description: 'Record audio through device microphone', granted: true },
  { id: 'contacts', name: 'Contacts', icon: Phone, risk: 'dangerous', description: 'Read and modify user contacts', granted: false },
  { id: 'sms', name: 'SMS', icon: MessageSquare, risk: 'dangerous', description: 'Read and send SMS messages', granted: false },
  { id: 'storage', name: 'Storage', icon: Database, risk: 'normal', description: 'Read and write to device storage', granted: true },
  { id: 'network', name: 'Network', icon: Wifi, risk: 'normal', description: 'Access network and internet', granted: true },
  { id: 'biometric', name: 'Biometric', icon: Key, risk: 'normal', description: 'Use fingerprint or face authentication', granted: true },
  { id: 'notifications', name: 'Notifications', icon: MessageSquare, risk: 'safe', description: 'Show push notifications', granted: true },
  { id: 'vibration', name: 'Vibration', icon: Smartphone, risk: 'safe', description: 'Control device vibration', granted: true },
];

function AnimatedSecurityGauge({ score, isAnimating }: { score: number; isAnimating: boolean }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (s: number) => {
    if (s >= 80) return '#42BA90';
    if (s >= 60) return '#3D70B7';
    if (s >= 40) return '#eab308';
    return '#ef4444';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    return 'Critical';
  };

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${getScoreColor(score)})`,
          }}
        />
        {isAnimating && (
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth="2"
            strokeDasharray="4 8"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: 'center' }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={score}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-bold"
          style={{ color: getScoreColor(score) }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-gray-400 uppercase tracking-wider">{getScoreLabel(score)}</span>
      </div>
      {isAnimating && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 20px ${getScoreColor(score)}40`,
              `0 0 40px ${getScoreColor(score)}60`,
              `0 0 20px ${getScoreColor(score)}40`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </div>
  );
}

function LiveThreatCounter({ threats, isScanning }: { threats: ThreatCount; isScanning: boolean }) {
  const totalThreats = threats.critical + threats.high + threats.medium + threats.low;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <motion.div
        className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 relative overflow-hidden"
        animate={isScanning && threats.critical > 0 ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span className="text-xs text-red-400 uppercase">Critical</span>
        </div>
        <motion.span
          key={threats.critical}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold text-red-400"
        >
          {threats.critical}
        </motion.span>
        {isScanning && (
          <motion.div
            className="absolute inset-0 bg-red-500/10"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>
      
      <motion.div
        className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 relative overflow-hidden"
        animate={isScanning && threats.high > 0 ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-orange-400 uppercase">High</span>
        </div>
        <motion.span
          key={threats.high}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold text-orange-400"
        >
          {threats.high}
        </motion.span>
      </motion.div>
      
      <motion.div
        className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 relative overflow-hidden"
      >
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-yellow-400 uppercase">Medium</span>
        </div>
        <motion.span
          key={threats.medium}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold text-yellow-400"
        >
          {threats.medium}
        </motion.span>
      </motion.div>
      
      <motion.div
        className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 relative overflow-hidden"
      >
        <div className="flex items-center gap-2 mb-1">
          <Radio className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-blue-400 uppercase">Low</span>
        </div>
        <motion.span
          key={threats.low}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold text-blue-400"
        >
          {threats.low}
        </motion.span>
      </motion.div>
      
      <motion.div
        className="p-3 rounded-xl bg-[#42BA90]/10 border border-[#42BA90]/30 relative overflow-hidden"
        animate={threats.blocked > 0 ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-[#42BA90]" />
          <span className="text-xs text-[#42BA90] uppercase">Blocked</span>
        </div>
        <motion.span
          key={threats.blocked}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold text-[#42BA90]"
        >
          {threats.blocked}
        </motion.span>
        {threats.blocked > 0 && (
          <motion.div
            className="absolute inset-0 bg-[#42BA90]/20"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.div>
    </div>
  );
}

function ScanRippleEffect({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border-2 border-[#3D70B7] rounded-2xl"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{
            scale: [0.8, 1.2],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function ScanningWave({ progress }: { progress: number }) {
  return (
    <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{
          background: 'linear-gradient(90deg, #3D70B7, #3D70B7, #3D70B7)',
          backgroundSize: '200% 100%',
        }}
        initial={{ width: 0 }}
        animate={{ 
          width: `${progress}%`,
          backgroundPosition: ['0% 0%', '100% 0%'],
        }}
        transition={{
          width: { duration: 0.1 },
          backgroundPosition: { duration: 1.5, repeat: Infinity, ease: "linear" },
        }}
      />
      <motion.div
        className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{ left: ['-20%', '120%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function MobileSecurity() {
  const [selectedDevice, setSelectedDevice] = useState<MobileDevice | null>(null);
  const [previousDevice, setPreviousDevice] = useState<MobileDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [owaspItems, setOwaspItems] = useState(initialOWASPItems);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [phaseFindings, setPhaseFindings] = useState<string[]>([]);
  const [threatsBlocked, setThreatsBlocked] = useState(0);
  const [securityScore, setSecurityScore] = useState(0);
  const [threatCounts, setThreatCounts] = useState<ThreatCount>({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    blocked: 0,
  });
  const [isDeviceTransitioning, setIsDeviceTransitioning] = useState(false);

  const handleThreatBlocked = useCallback(() => {
    setThreatsBlocked(prev => prev + 1);
    setThreatCounts(prev => ({ ...prev, blocked: prev.blocked + 1 }));
  }, []);

  const handleDeviceSelect = (device: MobileDevice) => {
    if (device.id === selectedDevice?.id) return;
    setIsDeviceTransitioning(true);
    setPreviousDevice(selectedDevice);
    
    setTimeout(() => {
      setSelectedDevice(device);
      setScanComplete(false);
      setVulnerabilities([]);
      setSecurityScore(0);
      setThreatCounts({ critical: 0, high: 0, medium: 0, low: 0, blocked: 0 });
      setTimeout(() => setIsDeviceTransitioning(false), 300);
    }, 150);
  };

  const startScan = () => {
    if (!selectedDevice) return;
    
    setIsScanning(true);
    setScanProgress(0);
    setCurrentPhase(0);
    setScanComplete(false);
    setVulnerabilities([]);
    setPhaseFindings([]);
    setOwaspItems(initialOWASPItems);
    setThreatsBlocked(0);
    setSecurityScore(0);
    setThreatCounts({ critical: 0, high: 0, medium: 0, low: 0, blocked: 0 });

    let progress = 0;
    let phase = 0;
    const totalDuration = scanPhases.reduce((sum, p) => sum + p.duration, 0);
    const findings: string[] = [];

    const progressInterval = setInterval(() => {
      progress += 1;
      setScanProgress(Math.min(progress, 100));

      if (Math.random() < 0.08) {
        const severities = ['critical', 'high', 'medium', 'low'] as const;
        const severity = severities[Math.floor(Math.random() * severities.length)];
        setThreatCounts(prev => ({
          ...prev,
          [severity]: prev[severity] + 1,
        }));
      }

      const elapsed = (progress / 100) * totalDuration;
      let accumulated = 0;
      for (let i = 0; i < scanPhases.length; i++) {
        accumulated += scanPhases[i].duration;
        if (elapsed < accumulated) {
          if (i !== phase) {
            phase = i;
            setCurrentPhase(i);
            const finding = generateFinding(scanPhases[i].id);
            if (finding) {
              findings.push(finding);
              setPhaseFindings([...findings]);
            }
          }
          break;
        }
      }

      if (progress >= 100) {
        clearInterval(progressInterval);
        setIsScanning(false);
        setScanComplete(true);
        generateResults();
      }
    }, totalDuration / 100);
  };

  const generateFinding = (phaseId: string): string => {
    const findingsMap: Record<string, string[]> = {
      binary: ['Detected unobfuscated code segments', 'Found hardcoded API keys in binary', 'Missing code signing validation'],
      network: ['Unencrypted HTTP traffic detected', 'SSL pinning not implemented', 'API endpoints exposed'],
      storage: ['Sensitive data in SharedPreferences', 'Unencrypted SQLite database', 'Credentials in plain text'],
      auth: ['Weak password policy', 'Missing session timeout', 'Biometric bypass possible'],
      permissions: ['Excessive permissions requested', 'Runtime permission checks missing', 'Background location access'],
    };
    const options = findingsMap[phaseId] || [];
    return options[Math.floor(Math.random() * options.length)];
  };

  const generateResults = () => {
    const vulnTemplates: Omit<Vulnerability, 'id' | 'expanded'>[] = [
      { title: 'Insecure Local Data Storage', severity: 'critical', category: 'storage', description: 'Sensitive user data stored in unencrypted SharedPreferences/UserDefaults accessible to rooted/jailbroken devices.', recommendation: 'Use encrypted storage solutions like EncryptedSharedPreferences or iOS Keychain.', cveId: 'CVE-2024-1234', affectedComponent: 'UserDataManager.java' },
      { title: 'Weak Cryptographic Algorithm', severity: 'high', category: 'crypto', description: 'Application uses MD5 for password hashing which is cryptographically broken.', recommendation: 'Replace MD5 with bcrypt, scrypt, or Argon2 for password hashing.', cveId: 'CVE-2024-5678', affectedComponent: 'CryptoUtils.kt' },
      { title: 'Missing Certificate Pinning', severity: 'high', category: 'auth', description: 'SSL/TLS certificate pinning not implemented, allowing MITM attacks.', recommendation: 'Implement certificate pinning using OkHttp CertificatePinner or TrustKit.', affectedComponent: 'NetworkClient.swift' },
      { title: 'Hardcoded API Keys', severity: 'medium', category: 'tampering', description: 'API keys and secrets found hardcoded in application binary.', recommendation: 'Store secrets in secure storage and retrieve at runtime from secure backend.', affectedComponent: 'Constants.java' },
      { title: 'Insufficient Session Management', severity: 'medium', category: 'auth', description: 'Sessions do not expire and tokens persist indefinitely.', recommendation: 'Implement proper session timeout and token refresh mechanisms.', affectedComponent: 'AuthManager.kt' },
      { title: 'Debug Mode Enabled', severity: 'low', category: 'tampering', description: 'Application compiled with debug flags enabled in production build.', recommendation: 'Ensure release builds have debugging disabled and ProGuard/R8 enabled.', affectedComponent: 'BuildConfig.java' },
    ];

    const selectedVulns = vulnTemplates
      .filter(() => Math.random() > 0.3)
      .map((v, i) => ({ ...v, id: `vuln-${i}`, expanded: false }));
    
    setVulnerabilities(selectedVulns);

    const updatedOwasp = owaspItems.map(item => ({
      ...item,
      passed: Math.random() > 0.4,
    }));
    setOwaspItems(updatedOwasp);

    const passedCount = updatedOwasp.filter(i => i.passed).length;
    const vulnPenalty = selectedVulns.reduce((acc, v) => {
      if (v.severity === 'critical') return acc + 15;
      if (v.severity === 'high') return acc + 10;
      if (v.severity === 'medium') return acc + 5;
      return acc + 2;
    }, 0);
    const calculatedScore = Math.max(0, Math.min(100, Math.round((passedCount / 10) * 100 - vulnPenalty)));
    setSecurityScore(calculatedScore);
  };

  const toggleVulnerability = (id: string) => {
    setVulnerabilities(prev => prev.map(v => 
      v.id === id ? { ...v, expanded: !v.expanded } : v
    ));
  };

  const toggleOWASPItem = (id: string) => {
    setOwaspItems(prev => prev.map(item =>
      item.id === id ? { ...item, passed: item.passed === null ? true : !item.passed } : item
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'low': return 'bg-blue-400/20 border-blue-400/50 text-blue-400';
      default: return 'bg-gray-400/20 border-gray-400/50 text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ShieldAlert className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      case 'medium': return <Activity className="w-5 h-5" />;
      default: return <Bug className="w-5 h-5" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'dangerous': return 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30';
      case 'normal': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30';
      case 'safe': return 'bg-[#42BA90]/20 border-[#42BA90]/50 text-[#42BA90] hover:bg-[#42BA90]/30';
      default: return 'bg-gray-400/20 border-gray-400/50 text-gray-400';
    }
  };

  const complianceScore = owaspItems.filter(i => i.passed === true).length;
  const totalChecks = owaspItems.filter(i => i.passed !== null).length;
  const compliancePercentage = totalChecks > 0 ? Math.round((complianceScore / totalChecks) * 100) : 0;

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: '#000510' }}>
      <AmbientParticles variant="network" count={30} color="#3D70B7" opacity={0.15} />
      
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(61, 112, 183, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 40%)',
        }}
      />

      <div className="relative z-10">
        <div className="fixed top-6 left-6 z-50">
          <Link
            href="/services"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all"
            data-testid="link-back-services"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Services</span>
          </Link>
        </div>

        <div className="container mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style={{ backgroundColor: 'rgba(61, 112, 183, 0.1)', borderColor: 'rgba(61, 112, 183, 0.3)' }}>
              <Smartphone className="w-4 h-4" style={{ color: '#3D70B7' }} />
              <span className="text-sm font-medium" style={{ color: '#3D70B7' }}>Mobile Security Testing</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Mobile App
              <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #3D70B7, #42BA90)' }}>
                Security Assessment
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive security testing for iOS and Android applications. Identify vulnerabilities, test against OWASP Mobile Top 10, and analyze app permissions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <PhoneSecurityVisualization 
              isScanning={isScanning}
              onThreatBlocked={handleThreatBlocked}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5" style={{ color: '#3D70B7' }} />
              Select Target Device
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {devices.map((device) => (
                <motion.button
                  key={device.id}
                  layoutId={`device-card-${device.id}`}
                  onClick={() => handleDeviceSelect(device)}
                  className={`p-4 rounded-xl border backdrop-blur-xl transition-all text-left relative overflow-hidden ${
                    selectedDevice?.id === device.id
                      ? 'bg-[#3D70B7]/20 border-[#3D70B7]/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`device-${device.id}`}
                >
                  <AnimatePresence>
                    {selectedDevice?.id === device.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-[#3D70B7]/20 to-[#42BA90]/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layoutId="device-highlight"
                      />
                    )}
                  </AnimatePresence>
                  <div className="relative z-10">
                    <motion.div 
                      className="flex justify-center mb-3"
                      animate={selectedDevice?.id === device.id ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {device.type === 'phone' ? (
                        <Smartphone className={`w-10 h-10 ${device.os === 'ios' ? 'text-gray-300' : 'text-[#42BA90]'}`} />
                      ) : (
                        <Tablet className={`w-10 h-10 ${device.os === 'ios' ? 'text-gray-300' : 'text-[#42BA90]'}`} />
                      )}
                    </motion.div>
                    <p className="text-sm font-medium text-center truncate">{device.name}</p>
                    <p className="text-xs text-gray-400 text-center">{device.version}</p>
                  </div>
                  {selectedDevice?.id === device.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3D70B7] to-[#42BA90]"
                      layoutId="device-indicator"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {selectedDevice && (
                <motion.div
                  key={selectedDevice.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="mt-4 space-y-4"
                >
                  <motion.div 
                    className="p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-[#3D70B7]/30 relative overflow-hidden"
                    layoutId="device-details-panel"
                  >
                    <ScanRippleEffect isActive={isScanning} />
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="p-3 rounded-lg bg-[#3D70B7]/10"
                          animate={isScanning ? { 
                            boxShadow: ['0 0 0 rgba(61, 112, 183,0)', '0 0 20px rgba(61, 112, 183,0.5)', '0 0 0 rgba(61, 112, 183,0)']
                          } : {}}
                          transition={{ duration: 1.5, repeat: isScanning ? Infinity : 0 }}
                        >
                          {selectedDevice.type === 'phone' ? (
                            <Smartphone className="w-6 h-6 text-[#3D70B7]" />
                          ) : (
                            <Tablet className="w-6 h-6 text-[#3D70B7]" />
                          )}
                        </motion.div>
                        <div>
                          <h3 className="font-semibold">{selectedDevice.name}</h3>
                          <p className="text-sm text-gray-400">{selectedDevice.version}</p>
                        </div>
                      </div>
                      <motion.div 
                        className="flex flex-wrap gap-4 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div><span className="text-gray-400">Screen:</span> {selectedDevice.specs.screen}</div>
                        <div><span className="text-gray-400">CPU:</span> {selectedDevice.specs.processor}</div>
                        <div><span className="text-gray-400">RAM:</span> {selectedDevice.specs.ram}</div>
                        <div><span className="text-gray-400">Storage:</span> {selectedDevice.specs.storage}</div>
                      </motion.div>
                      <motion.button
                        onClick={startScan}
                        disabled={isScanning}
                        className="px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 relative overflow-hidden"
                        style={{ backgroundImage: 'linear-gradient(to right, #3D70B7, #42BA90)' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        data-testid="button-start-scan"
                      >
                        {isScanning ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Activity className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                        {isScanning ? 'Scanning...' : 'Start Security Scan'}
                        {isScanning && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-xl bg-black/30 backdrop-blur-xl border border-[#3D70B7]/30"
                  >
                    <h4 className="text-sm font-semibold text-[#3D70B7] mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      OWASP Mobile Top 10 Security Checks
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {initialOWASPItems.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                          className="group relative p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#3D70B7]/50 transition-all cursor-help"
                          data-testid={`owasp-preview-${item.id}`}
                        >
                          <div className="text-[10px] font-mono text-[#3D70B7] mb-1">{item.id.toUpperCase()}</div>
                          <div className="text-[10px] text-white/70 line-clamp-2">{item.name.replace(`${item.id.toUpperCase()}: `, '')}</div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 w-48">
                            <div className="bg-[#000510] border border-[#3D70B7]/50 rounded-lg p-2 text-xs">
                              <div className="text-[#3D70B7] font-semibold mb-1">{item.name}</div>
                              <div className="text-white/60">{item.description}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Hover over items for details • Full analysis after scan completion
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-12 space-y-6"
              >
                <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-[#3D70B7]/30 relative overflow-hidden">
                  <ScanRippleEffect isActive={true} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <motion.div 
                          className="w-3 h-3 rounded-full bg-[#3D70B7]"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            boxShadow: ['0 0 0 0 rgba(61, 112, 183,0.5)', '0 0 0 10px rgba(61, 112, 183,0)', '0 0 0 0 rgba(61, 112, 183,0)']
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        {scanPhases[currentPhase]?.name || 'Scanning...'}
                      </h3>
                      <div className="flex items-center gap-3">
                        <motion.span
                          key={Math.round(scanProgress)}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="text-sm font-mono text-[#3D70B7]"
                        >
                          {Math.round(scanProgress)}%
                        </motion.span>
                      </div>
                    </div>
                    
                    <ScanningWave progress={scanProgress} />

                    <div className="grid grid-cols-5 gap-2 mt-6 mb-6">
                      {scanPhases.map((phase, i) => {
                        const PhaseIcon = phase.icon;
                        return (
                          <motion.div
                            key={phase.id}
                            className={`p-3 rounded-lg text-center transition-all relative overflow-hidden ${
                              i === currentPhase
                                ? 'bg-[#3D70B7]/20 border border-[#3D70B7]/50 text-[#3D70B7]'
                                : i < currentPhase
                                ? 'bg-[#42BA90]/20 border border-[#42BA90]/50 text-[#42BA90]'
                                : 'bg-white/5 border border-white/10 text-gray-500'
                            }`}
                            animate={i === currentPhase ? {
                              boxShadow: ['0 0 0 rgba(61, 112, 183,0)', '0 0 15px rgba(61, 112, 183,0.3)', '0 0 0 rgba(61, 112, 183,0)']
                            } : {}}
                            transition={{ duration: 1, repeat: i === currentPhase ? Infinity : 0 }}
                          >
                            <PhaseIcon className="w-4 h-4 mx-auto mb-1" />
                            <span className="text-xs">{phase.name}</span>
                            {i === currentPhase && (
                              <motion.div
                                className="absolute bottom-0 left-0 h-0.5 bg-[#3D70B7]"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: phase.duration / 1000 }}
                              />
                            )}
                            {i < currentPhase && (
                              <motion.div
                                className="absolute top-1 right-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <CheckCircle className="w-3 h-3 text-[#42BA90]" />
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {phaseFindings.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400 uppercase tracking-wide flex items-center gap-2">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          Simulated Findings
                        </p>
                        {phaseFindings.map((finding, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20, height: 0 }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            className="text-sm text-yellow-400 flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                          >
                            <motion.div
                              animate={{ rotate: [0, 15, -15, 0] }}
                              transition={{ duration: 0.5 }}
                            >
                              <AlertTriangle className="w-3 h-3" />
                            </motion.div>
                            {finding}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#3D70B7]" />
                    Simulated Threat Detection
                  </h3>
                  <LiveThreatCounter threats={threatCounts} isScanning={isScanning} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {scanComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col md:flex-row items-center gap-8 p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-[#3D70B7]/30"
                >
                  <AnimatedSecurityGauge score={securityScore} isAnimating={false} />
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-semibold">Security Assessment Complete</h3>
                    <p className="text-gray-400">
                      Scan completed for {selectedDevice?.name}. {vulnerabilities.length} vulnerabilities detected across {scanPhases.length} security domains.
                    </p>
                    <LiveThreatCounter threats={threatCounts} isScanning={false} />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileWarning className="w-5 h-5" style={{ color: '#3D70B7' }} />
                    Discovered Vulnerabilities
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                      {vulnerabilities.length} found
                    </span>
                  </h2>
                  <div className="grid gap-4">
                    {vulnerabilities.map((vuln, index) => (
                      <motion.div
                        key={vuln.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`rounded-xl border backdrop-blur-xl overflow-hidden ${getSeverityColor(vuln.severity)} group`}
                        whileHover={{ scale: 1.005 }}
                      >
                        <motion.button
                          onClick={() => toggleVulnerability(vuln.id)}
                          className="w-full p-4 flex items-center justify-between text-left"
                          data-testid={`vuln-${vuln.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={vuln.expanded ? { rotate: 360 } : { rotate: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {getSeverityIcon(vuln.severity)}
                            </motion.div>
                            <div>
                              <p className="font-medium">{vuln.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs opacity-70 capitalize">{vuln.category}</span>
                                <span className="text-xs opacity-50">•</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-semibold ${
                                  vuln.severity === 'critical' ? 'bg-red-500/30' :
                                  vuln.severity === 'high' ? 'bg-orange-500/30' :
                                  vuln.severity === 'medium' ? 'bg-yellow-500/30' : 'bg-blue-500/30'
                                }`}>{vuln.severity}</span>
                                {vuln.cveId && (
                                  <>
                                    <span className="text-xs opacity-50">•</span>
                                    <span className="text-xs font-mono opacity-70">{vuln.cveId}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: vuln.expanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </motion.div>
                        </motion.button>
                        <AnimatePresence>
                          {vuln.expanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-4 pb-4 overflow-hidden"
                            >
                              <div className="pt-2 border-t border-current/20 space-y-4">
                                {vuln.affectedComponent && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    <p className="text-xs uppercase tracking-wide opacity-70 mb-1">Affected Component</p>
                                    <p className="text-sm font-mono bg-black/30 px-3 py-1.5 rounded inline-block">{vuln.affectedComponent}</p>
                                  </motion.div>
                                )}
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.15 }}
                                >
                                  <p className="text-xs uppercase tracking-wide opacity-70 mb-1">Description</p>
                                  <p className="text-sm">{vuln.description}</p>
                                </motion.div>
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="p-3 rounded-lg bg-[#42BA90]/10 border border-[#42BA90]/30"
                                >
                                  <p className="text-xs uppercase tracking-wide text-[#42BA90] mb-1 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Recommendation
                                  </p>
                                  <p className="text-sm text-[#42BA90]">{vuln.recommendation}</p>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                    {vulnerabilities.length === 0 && (
                      <motion.div 
                        className="p-8 rounded-xl bg-[#42BA90]/10 border border-[#42BA90]/30 text-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.2 }}
                        >
                          <CheckCircle className="w-12 h-12 text-[#42BA90] mx-auto mb-2" />
                        </motion.div>
                        <p className="text-[#42BA90]">No critical vulnerabilities detected</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Shield className="w-5 h-5" style={{ color: '#3D70B7' }} />
                      OWASP Mobile Top 10 Checklist
                    </h2>
                    <motion.div 
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-[#3D70B7]/30"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                    >
                      <span className="text-sm text-gray-400">Compliance Score:</span>
                      <motion.span 
                        key={compliancePercentage}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`font-bold ${compliancePercentage >= 70 ? 'text-[#42BA90]' : compliancePercentage >= 40 ? 'text-yellow-400' : 'text-red-400'}`}
                      >
                        {compliancePercentage}%
                      </motion.span>
                    </motion.div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {owaspItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        onClick={() => toggleOWASPItem(item.id)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className={`p-4 rounded-xl border backdrop-blur-xl text-left transition-all ${
                          item.passed === null
                            ? 'bg-white/5 border-white/10'
                            : item.passed
                            ? 'bg-[#42BA90]/10 border-[#42BA90]/30'
                            : 'bg-red-500/10 border-red-500/30'
                        }`}
                        whileHover={{ scale: 1.01, y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        data-testid={`owasp-${item.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <motion.div 
                            className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              item.passed === null
                                ? 'bg-white/10'
                                : item.passed
                                ? 'bg-[#42BA90]'
                                : 'bg-red-500'
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 * index, type: "spring" }}
                          >
                            {item.passed === null ? null : item.passed ? (
                              <CheckCircle className="w-3 h-3 text-white" />
                            ) : (
                              <XCircle className="w-3 h-3 text-white" />
                            )}
                          </motion.div>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5" style={{ color: '#3D70B7' }} />
                    App Permissions Analyzer
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {permissions.map((perm, index) => {
                      const Icon = perm.icon;
                      return (
                        <motion.button
                          key={perm.id}
                          onClick={() => setSelectedPermission(selectedPermission?.id === perm.id ? null : perm)}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 * index }}
                          className={`p-4 rounded-xl border backdrop-blur-xl text-center transition-all relative overflow-hidden ${getRiskColor(perm.risk)} ${
                            selectedPermission?.id === perm.id ? 'ring-2 ring-[#3D70B7]' : ''
                          }`}
                          whileHover={{ scale: 1.05, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          data-testid={`perm-${perm.id}`}
                        >
                          <motion.div
                            animate={selectedPermission?.id === perm.id ? { rotate: 360 } : { rotate: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className="w-6 h-6 mx-auto mb-2" />
                          </motion.div>
                          <p className="text-xs font-medium">{perm.name}</p>
                          <p className="text-[10px] opacity-70 capitalize mt-1">{perm.risk}</p>
                          {perm.granted && (
                            <motion.div
                              className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#42BA90]"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {selectedPermission && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 overflow-hidden"
                      >
                        <motion.div 
                          className={`p-4 rounded-xl border backdrop-blur-xl ${getRiskColor(selectedPermission.risk)}`}
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            {(() => {
                              const Icon = selectedPermission.icon;
                              return <Icon className="w-5 h-5" />;
                            })()}
                            <span className="font-semibold">{selectedPermission.name} Permission</span>
                            <motion.span 
                              className={`text-xs px-2 py-0.5 rounded capitalize ${
                                selectedPermission.granted ? 'bg-[#42BA90]/20 text-[#42BA90]' : 'bg-red-500/20 text-red-400'
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring" }}
                            >
                              {selectedPermission.granted ? 'Granted' : 'Denied'}
                            </motion.span>
                          </div>
                          <p className="text-sm opacity-80">{selectedPermission.description}</p>
                          <p className="text-xs mt-2 opacity-60">
                            Risk Level: <span className="capitalize font-medium">{selectedPermission.risk}</span>
                            {selectedPermission.risk === 'dangerous' && ' - This permission can access sensitive user data'}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[#3D70B7]/10 to-[#42BA90]/10 border border-[#3D70B7]/30 text-center relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      background: [
                        'radial-gradient(circle at 20% 50%, rgba(61, 112, 183,0.1) 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 50%, rgba(66,186,144,0.1) 0%, transparent 50%)',
                        'radial-gradient(circle at 20% 50%, rgba(61, 112, 183,0.1) 0%, transparent 50%)',
                      ],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">Need a Professional Assessment?</h3>
                    <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                      Our security experts can perform comprehensive mobile app penetration testing with detailed remediation guidance.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
                      style={{ backgroundImage: 'linear-gradient(to right, #3D70B7, #42BA90)' }}
                      data-testid="link-contact-cta"
                    >
                      <Send className="w-4 h-4" />
                      Request Assessment
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedDevice && !isScanning && !scanComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#3D70B7]/10 border border-[#3D70B7]/30 mb-4"
                animate={{ 
                  boxShadow: ['0 0 0 0 rgba(61, 112, 183,0.3)', '0 0 0 20px rgba(61, 112, 183,0)', '0 0 0 0 rgba(61, 112, 183,0)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Smartphone className="w-10 h-10 text-[#3D70B7]" />
              </motion.div>
              <p className="text-gray-400">Select a device above to begin security testing</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
