import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowLeft, Smartphone, Tablet, Shield, AlertTriangle, CheckCircle, 
  XCircle, Lock, Eye, Wifi, Camera, MapPin, Mic, Phone, MessageSquare,
  Database, Key, FileWarning, Bug, ChevronDown, ChevronRight, Send
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
  { id: 'binary', name: 'Binary Analysis', duration: 2000 },
  { id: 'network', name: 'Network Traffic', duration: 2500 },
  { id: 'storage', name: 'Data Storage', duration: 2000 },
  { id: 'auth', name: 'Authentication', duration: 1800 },
  { id: 'permissions', name: 'Permissions', duration: 1500 },
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

export default function MobileSecurity() {
  const [selectedDevice, setSelectedDevice] = useState<MobileDevice | null>(null);
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

  const handleThreatBlocked = useCallback(() => {
    setThreatsBlocked(prev => prev + 1);
  }, []);

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

    let progress = 0;
    let phase = 0;
    const totalDuration = scanPhases.reduce((sum, p) => sum + p.duration, 0);
    const findings: string[] = [];

    const progressInterval = setInterval(() => {
      progress += 1;
      setScanProgress(Math.min(progress, 100));

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
      { title: 'Insecure Local Data Storage', severity: 'critical', category: 'storage', description: 'Sensitive user data stored in unencrypted SharedPreferences/UserDefaults accessible to rooted/jailbroken devices.', recommendation: 'Use encrypted storage solutions like EncryptedSharedPreferences or iOS Keychain.' },
      { title: 'Weak Cryptographic Algorithm', severity: 'high', category: 'crypto', description: 'Application uses MD5 for password hashing which is cryptographically broken.', recommendation: 'Replace MD5 with bcrypt, scrypt, or Argon2 for password hashing.' },
      { title: 'Missing Certificate Pinning', severity: 'high', category: 'auth', description: 'SSL/TLS certificate pinning not implemented, allowing MITM attacks.', recommendation: 'Implement certificate pinning using OkHttp CertificatePinner or TrustKit.' },
      { title: 'Hardcoded API Keys', severity: 'medium', category: 'tampering', description: 'API keys and secrets found hardcoded in application binary.', recommendation: 'Store secrets in secure storage and retrieve at runtime from secure backend.' },
      { title: 'Insufficient Session Management', severity: 'medium', category: 'auth', description: 'Sessions do not expire and tokens persist indefinitely.', recommendation: 'Implement proper session timeout and token refresh mechanisms.' },
      { title: 'Debug Mode Enabled', severity: 'low', category: 'tampering', description: 'Application compiled with debug flags enabled in production build.', recommendation: 'Ensure release builds have debugging disabled and ProGuard/R8 enabled.' },
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'dangerous': return 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30';
      case 'normal': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30';
      case 'safe': return 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30';
      default: return 'bg-gray-400/20 border-gray-400/50 text-gray-400';
    }
  };

  const complianceScore = owaspItems.filter(i => i.passed === true).length;
  const totalChecks = owaspItems.filter(i => i.passed !== null).length;
  const compliancePercentage = totalChecks > 0 ? Math.round((complianceScore / totalChecks) * 100) : 0;

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: '#000510' }}>
      <AmbientParticles variant="network" count={30} color="#00D4FF" opacity={0.15} />
      
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 40%)',
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style={{ backgroundColor: 'rgba(0, 212, 255, 0.1)', borderColor: 'rgba(0, 212, 255, 0.3)' }}>
              <Smartphone className="w-4 h-4" style={{ color: '#00D4FF' }} />
              <span className="text-sm font-medium" style={{ color: '#00D4FF' }}>Mobile Security Testing</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Mobile App
              <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #00D4FF, #a855f7)' }}>
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
              threatsBlocked={threatsBlocked}
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
              <Smartphone className="w-5 h-5" style={{ color: '#00D4FF' }} />
              Select Target Device
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {devices.map((device) => (
                <motion.button
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className={`p-4 rounded-xl border backdrop-blur-xl transition-all text-left ${
                    selectedDevice?.id === device.id
                      ? 'bg-[#00D4FF]/20 border-[#00D4FF]/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`device-${device.id}`}
                >
                  <div className="flex justify-center mb-3">
                    {device.type === 'phone' ? (
                      <Smartphone className={`w-10 h-10 ${device.os === 'ios' ? 'text-gray-300' : 'text-green-400'}`} />
                    ) : (
                      <Tablet className={`w-10 h-10 ${device.os === 'ios' ? 'text-gray-300' : 'text-green-400'}`} />
                    )}
                  </div>
                  <p className="text-sm font-medium text-center truncate">{device.name}</p>
                  <p className="text-xs text-gray-400 text-center">{device.version}</p>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {selectedDevice && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <div className="p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-[#00D4FF]/30">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-[#00D4FF]/10">
                          {selectedDevice.type === 'phone' ? (
                            <Smartphone className="w-6 h-6 text-[#00D4FF]" />
                          ) : (
                            <Tablet className="w-6 h-6 text-[#00D4FF]" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{selectedDevice.name}</h3>
                          <p className="text-sm text-gray-400">{selectedDevice.version}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div><span className="text-gray-400">Screen:</span> {selectedDevice.specs.screen}</div>
                        <div><span className="text-gray-400">CPU:</span> {selectedDevice.specs.processor}</div>
                        <div><span className="text-gray-400">RAM:</span> {selectedDevice.specs.ram}</div>
                        <div><span className="text-gray-400">Storage:</span> {selectedDevice.specs.storage}</div>
                      </div>
                      <button
                        onClick={startScan}
                        disabled={isScanning}
                        className="px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                        style={{ backgroundImage: 'linear-gradient(to right, #00D4FF, #a855f7)' }}
                        data-testid="button-start-scan"
                      >
                        <Shield className="w-4 h-4" />
                        {isScanning ? 'Scanning...' : 'Start Security Scan'}
                      </button>
                    </div>
                  </div>
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
                className="mb-12"
              >
                <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-[#00D4FF]/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
                      {scanPhases[currentPhase]?.name || 'Scanning...'}
                    </h3>
                    <span className="text-sm text-gray-400">{Math.round(scanProgress)}%</span>
                  </div>
                  
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                    <motion.div
                      className="h-full"
                      style={{ backgroundImage: 'linear-gradient(to right, #00D4FF, #a855f7)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${scanProgress}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {scanPhases.map((phase, i) => (
                      <div
                        key={phase.id}
                        className={`p-2 rounded-lg text-center text-xs transition-all ${
                          i === currentPhase
                            ? 'bg-[#00D4FF]/20 border border-[#00D4FF]/50 text-[#00D4FF]'
                            : i < currentPhase
                            ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                            : 'bg-white/5 border border-white/10 text-gray-500'
                        }`}
                      >
                        {phase.name}
                      </div>
                    ))}
                  </div>

                  {phaseFindings.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Live Findings</p>
                      {phaseFindings.map((finding, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-sm text-yellow-400"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {finding}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
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
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileWarning className="w-5 h-5" style={{ color: '#00D4FF' }} />
                    Discovered Vulnerabilities
                  </h2>
                  <div className="grid gap-4">
                    {vulnerabilities.map((vuln) => (
                      <motion.div
                        key={vuln.id}
                        layout
                        className={`rounded-xl border backdrop-blur-xl overflow-hidden ${getSeverityColor(vuln.severity)}`}
                      >
                        <button
                          onClick={() => toggleVulnerability(vuln.id)}
                          className="w-full p-4 flex items-center justify-between text-left"
                          data-testid={`vuln-${vuln.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <Bug className="w-5 h-5" />
                            <div>
                              <p className="font-medium">{vuln.title}</p>
                              <p className="text-xs opacity-70 capitalize">{vuln.category} • {vuln.severity}</p>
                            </div>
                          </div>
                          {vuln.expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                        <AnimatePresence>
                          {vuln.expanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4"
                            >
                              <div className="pt-2 border-t border-current/20 space-y-3">
                                <div>
                                  <p className="text-xs uppercase tracking-wide opacity-70 mb-1">Description</p>
                                  <p className="text-sm">{vuln.description}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase tracking-wide opacity-70 mb-1">Recommendation</p>
                                  <p className="text-sm text-green-400">{vuln.recommendation}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                    {vulnerabilities.length === 0 && (
                      <div className="p-8 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                        <p className="text-green-400">No critical vulnerabilities detected</p>
                      </div>
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
                      <Shield className="w-5 h-5" style={{ color: '#00D4FF' }} />
                      OWASP Mobile Top 10 Checklist
                    </h2>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-[#00D4FF]/30">
                      <span className="text-sm text-gray-400">Compliance Score:</span>
                      <span className={`font-bold ${compliancePercentage >= 70 ? 'text-green-400' : compliancePercentage >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {compliancePercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {owaspItems.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => toggleOWASPItem(item.id)}
                        className={`p-4 rounded-xl border backdrop-blur-xl text-left transition-all ${
                          item.passed === null
                            ? 'bg-white/5 border-white/10'
                            : item.passed
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        data-testid={`owasp-${item.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            item.passed === null
                              ? 'bg-white/10'
                              : item.passed
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}>
                            {item.passed === null ? null : item.passed ? (
                              <CheckCircle className="w-3 h-3 text-white" />
                            ) : (
                              <XCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
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
                    <Eye className="w-5 h-5" style={{ color: '#00D4FF' }} />
                    App Permissions Analyzer
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {permissions.map((perm) => {
                      const Icon = perm.icon;
                      return (
                        <motion.button
                          key={perm.id}
                          onClick={() => setSelectedPermission(selectedPermission?.id === perm.id ? null : perm)}
                          className={`p-4 rounded-xl border backdrop-blur-xl text-center transition-all ${getRiskColor(perm.risk)} ${
                            selectedPermission?.id === perm.id ? 'ring-2 ring-[#00D4FF]' : ''
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          data-testid={`perm-${perm.id}`}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-2" />
                          <p className="text-xs font-medium">{perm.name}</p>
                          <p className="text-[10px] opacity-70 capitalize mt-1">{perm.risk}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {selectedPermission && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <div className={`p-4 rounded-xl border backdrop-blur-xl ${getRiskColor(selectedPermission.risk)}`}>
                          <div className="flex items-center gap-3 mb-2">
                            {(() => {
                              const Icon = selectedPermission.icon;
                              return <Icon className="w-5 h-5" />;
                            })()}
                            <span className="font-semibold">{selectedPermission.name} Permission</span>
                            <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                              selectedPermission.granted ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {selectedPermission.granted ? 'Granted' : 'Denied'}
                            </span>
                          </div>
                          <p className="text-sm opacity-80">{selectedPermission.description}</p>
                          <p className="text-xs mt-2 opacity-60">
                            Risk Level: <span className="capitalize font-medium">{selectedPermission.risk}</span>
                            {selectedPermission.risk === 'dangerous' && ' - This permission can access sensitive user data'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[#00D4FF]/10 to-purple-500/10 border border-[#00D4FF]/30 text-center"
                >
                  <h3 className="text-2xl font-bold mb-2">Need a Professional Assessment?</h3>
                  <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                    Our security experts can perform comprehensive mobile app penetration testing with detailed remediation guidance.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundImage: 'linear-gradient(to right, #00D4FF, #a855f7)' }}
                    data-testid="link-contact-cta"
                  >
                    <Send className="w-4 h-4" />
                    Request Assessment
                  </Link>
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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-4">
                <Smartphone className="w-10 h-10 text-[#00D4FF]" />
              </div>
              <p className="text-gray-400">Select a device above to begin security testing</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
