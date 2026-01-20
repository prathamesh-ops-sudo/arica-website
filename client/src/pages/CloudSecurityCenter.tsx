import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowLeft, Cloud, Shield, AlertTriangle, CheckCircle, XCircle, 
  Server, Lock, Eye, Settings, Activity, Zap, Globe2, 
  Container, Key, FileCheck, RefreshCw, TrendingUp, Users,
  Database, Network, Terminal, Cpu, HardDrive, Wifi
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
}

interface IAMPolicy {
  id: string;
  name: string;
  riskScore: number;
  issues: number;
  status: 'compliant' | 'non-compliant' | 'review';
}

interface ContainerStatus {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'vulnerable';
  vulnerabilities: number;
  image: string;
}

interface ConfigCheck {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  compliant: boolean;
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
  { id: 'iam-1', name: 'AdminAccess', riskScore: 85, issues: 3, status: 'non-compliant' },
  { id: 'iam-2', name: 'DeveloperAccess', riskScore: 45, issues: 1, status: 'review' },
  { id: 'iam-3', name: 'ReadOnlyAccess', riskScore: 15, issues: 0, status: 'compliant' },
  { id: 'iam-4', name: 'S3FullAccess', riskScore: 72, issues: 2, status: 'non-compliant' },
  { id: 'iam-5', name: 'LambdaExecute', riskScore: 28, issues: 0, status: 'compliant' },
];

const containers: ContainerStatus[] = [
  { id: 'c-1', name: 'api-gateway', status: 'running', vulnerabilities: 0, image: 'nginx:1.25' },
  { id: 'c-2', name: 'auth-service', status: 'running', vulnerabilities: 2, image: 'node:18-alpine' },
  { id: 'c-3', name: 'data-processor', status: 'vulnerable', vulnerabilities: 8, image: 'python:3.9' },
  { id: 'c-4', name: 'cache-layer', status: 'running', vulnerabilities: 0, image: 'redis:7-alpine' },
  { id: 'c-5', name: 'message-queue', status: 'stopped', vulnerabilities: 1, image: 'rabbitmq:3.12' },
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
  { type: 'threat' as const, message: 'Unauthorized API call detected from unknown IP' },
  { type: 'warning' as const, message: 'IAM policy exceeds privilege threshold' },
  { type: 'info' as const, message: 'Security group rule updated successfully' },
  { type: 'threat' as const, message: 'Suspicious login attempt blocked' },
  { type: 'warning' as const, message: 'Container image vulnerability detected' },
  { type: 'info' as const, message: 'Encryption key rotated automatically' },
  { type: 'threat' as const, message: 'Data exfiltration attempt prevented' },
  { type: 'warning' as const, message: 'Unused credentials detected (90+ days)' },
];

const providerColors = {
  aws: { primary: '#FF9900', secondary: '#232F3E' },
  azure: { primary: '#0078D4', secondary: '#00BCF2' },
  gcp: { primary: '#4285F4', secondary: '#34A853' },
};

export default function CloudSecurityCenter() {
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | 'all'>('all');
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [configChecks, setConfigChecks] = useState(initialConfigChecks);
  const [overallRiskScore, setOverallRiskScore] = useState(0);
  const [animatedMetrics, setAnimatedMetrics] = useState({ resources: 0, threats: 0, containers: 0 });
  const [connectionPulse, setConnectionPulse] = useState(0);

  const filteredRegions = selectedProvider === 'all' 
    ? cloudRegions 
    : cloudRegions.filter(r => r.provider === selectedProvider);

  const totalResources = filteredRegions.reduce((sum, r) => sum + r.resources, 0);
  const totalThreats = filteredRegions.reduce((sum, r) => sum + r.threats, 0);
  const activeContainers = containers.filter(c => c.status === 'running').length;

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

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [totalResources, totalThreats, activeContainers]);

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
      };
      setEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionPulse(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
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

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'threat':
        return <AlertTriangle className="w-3 h-3 text-red-400" />;
      case 'warning':
        return <Eye className="w-3 h-3 text-yellow-400" />;
      default:
        return <CheckCircle className="w-3 h-3 text-cyan-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#000510] text-white relative overflow-hidden">
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 212, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0, 212, 255, 0.05) 0%, transparent 40%)',
        }}
      />
      
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

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
                <div className="flex items-center gap-2 text-[#00D4FF]">
                  <Server className="w-3 h-3" />
                  <span className="text-white">{animatedMetrics.resources}</span>
                  <span className="text-[#00D4FF]/70">resources</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{animatedMetrics.threats}</span>
                  <span className="text-[#00D4FF]/70">threats</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#00D4FF]/10 px-3 py-1.5 rounded border border-[#00D4FF]/30">
                <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
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
            <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded px-4 py-2 mb-4 font-mono text-xs">
              <Cloud className="w-4 h-4 text-[#00D4FF]" />
              <span className="text-[#00D4FF]">CLOUD SECURITY COMMAND CENTER</span>
            </div>

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="container mx-auto px-6 mb-6"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setSelectedProvider('all')}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                  selectedProvider === 'all'
                    ? 'bg-[#00D4FF] text-[#000510]'
                    : 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 hover:bg-[#00D4FF]/20'
                }`}
                data-testid="btn-provider-all"
              >
                All Providers
              </button>
              <button
                onClick={() => setSelectedProvider('aws')}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center gap-2 ${
                  selectedProvider === 'aws'
                    ? 'bg-[#FF9900] text-black'
                    : 'bg-[#FF9900]/10 text-[#FF9900] border border-[#FF9900]/30 hover:bg-[#FF9900]/20'
                }`}
                data-testid="btn-provider-aws"
              >
                <Cloud className="w-4 h-4" />
                AWS
              </button>
              <button
                onClick={() => setSelectedProvider('azure')}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center gap-2 ${
                  selectedProvider === 'azure'
                    ? 'bg-[#0078D4] text-white'
                    : 'bg-[#0078D4]/10 text-[#0078D4] border border-[#0078D4]/30 hover:bg-[#0078D4]/20'
                }`}
                data-testid="btn-provider-azure"
              >
                <Cloud className="w-4 h-4" />
                Azure
              </button>
              <button
                onClick={() => setSelectedProvider('gcp')}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center gap-2 ${
                  selectedProvider === 'gcp'
                    ? 'bg-[#4285F4] text-white'
                    : 'bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/30 hover:bg-[#4285F4]/20'
                }`}
                data-testid="btn-provider-gcp"
              >
                <Cloud className="w-4 h-4" />
                GCP
              </button>
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
              style={{ height: '300px' }}
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
                  </defs>
                  <path
                    d="M10,40 Q30,20 50,35 T90,40"
                    fill="none"
                    stroke="#00D4FF"
                    strokeWidth="0.2"
                    opacity="0.3"
                  />
                  <path
                    d="M20,60 Q40,40 60,55 T80,45"
                    fill="none"
                    stroke="#00D4FF"
                    strokeWidth="0.2"
                    opacity="0.3"
                  />
                </svg>
              </div>

              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80">
                {filteredRegions.map((region, i) => 
                  filteredRegions.slice(i + 1).map((target, j) => {
                    const pulseOffset = ((connectionPulse + i * 20 + j * 10) % 100) / 100;
                    return (
                      <g key={`${region.id}-${target.id}`}>
                        <line
                          x1={region.x}
                          y1={region.y}
                          x2={target.x}
                          y2={target.y}
                          stroke="#00D4FF"
                          strokeWidth="0.15"
                          opacity="0.2"
                        />
                        <circle
                          cx={region.x + (target.x - region.x) * pulseOffset}
                          cy={region.y + (target.y - region.y) * pulseOffset}
                          r="0.5"
                          fill="#00D4FF"
                          opacity={0.8 - pulseOffset * 0.6}
                        />
                      </g>
                    );
                  })
                )}
              </svg>

              <div className="relative w-full h-full">
                {filteredRegions.map((region) => (
                  <motion.div
                    key={region.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * cloudRegions.indexOf(region) }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    style={{ left: `${region.x}%`, top: `${region.y}%` }}
                    data-testid={`region-node-${region.id}`}
                  >
                    <div className={`relative w-4 h-4 rounded-full ${getStatusColor(region.status)} animate-pulse`}>
                      <div className={`absolute inset-0 rounded-full ${getStatusColor(region.status)} animate-ping opacity-30`} />
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-[#000510] border border-[#00D4FF]/50 rounded-lg p-2 whitespace-nowrap font-mono text-xs">
                        <div className="text-[#00D4FF] font-bold">{region.name}</div>
                        <div className="text-white/70">{region.provider.toUpperCase()}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-green-400">{region.resources} resources</span>
                          {region.threats > 0 && (
                            <span className="text-red-400">{region.threats} threats</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="absolute top-3 left-3 flex items-center gap-4 font-mono text-[10px]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-green-400">Healthy</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-yellow-400">Warning</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-red-400">Critical</span>
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
                    <div
                      key={policy.id}
                      className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#00D4FF]/30 transition-all"
                      data-testid={`iam-policy-${policy.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm text-white">{policy.name}</span>
                        <span className={`font-mono text-sm font-bold ${getRiskColor(policy.riskScore)}`}>
                          {policy.riskScore}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden mr-3">
                          <div
                            className={`h-full rounded-full ${
                              policy.riskScore >= 70 ? 'bg-red-500' : policy.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${policy.riskScore}%` }}
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
                    </div>
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
                    <div
                      key={container.id}
                      className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#00D4FF]/30 transition-all"
                      data-testid={`container-${container.id}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(container.status)}`} />
                          <span className="font-mono text-sm text-white">{container.name}</span>
                        </div>
                        {container.vulnerabilities > 0 && (
                          <span className="text-[10px] font-mono text-red-400 bg-red-500/20 px-2 py-0.5 rounded">
                            {container.vulnerabilities} CVEs
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#00D4FF]/50 font-mono">{container.image}</div>
                    </div>
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

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {configChecks.map((check) => (
                    <div
                      key={check.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10"
                      data-testid={`config-check-${check.id}`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {check.compliant ? (
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        )}
                        <span className="font-mono text-xs text-white truncate">{check.name}</span>
                      </div>
                      <button
                        onClick={() => toggleConfig(check.id)}
                        className={`w-10 h-5 rounded-full transition-all flex-shrink-0 ml-2 ${
                          check.enabled ? 'bg-[#00D4FF]' : 'bg-white/20'
                        }`}
                        data-testid={`toggle-${check.id}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                            check.enabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
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
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] text-red-400 font-mono">LIVE</span>
                  </div>
                </div>

                <div className="space-y-2 h-[200px] overflow-hidden" data-testid="security-events-feed">
                  <AnimatePresence mode="popLayout">
                    {events.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-3 rounded-lg border ${
                          event.type === 'threat' ? 'bg-red-500/10 border-red-500/30' :
                          event.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                          'bg-[#00D4FF]/10 border-[#00D4FF]/30'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {getEventIcon(event.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-xs text-white truncate">{event.message}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-white/50">{event.timestamp}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                                event.provider === 'aws' ? 'bg-[#FF9900]/20 text-[#FF9900]' :
                                event.provider === 'azure' ? 'bg-[#0078D4]/20 text-[#0078D4]' :
                                'bg-[#4285F4]/20 text-[#4285F4]'
                              }`}>
                                {event.provider.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
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
                <div className="bg-[#000510]/80 backdrop-blur-sm border border-[#00D4FF]/30 rounded-2xl p-5" data-testid="metric-risk-score">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-[#00D4FF]" />
                    <span className="font-mono text-sm text-[#00D4FF]/70">Risk Score</span>
                  </div>
                  <div className={`text-4xl font-bold font-mono ${getRiskColor(overallRiskScore)}`}>
                    {overallRiskScore}
                  </div>
                  <div className="text-xs text-[#00D4FF]/50 mt-1">/ 100</div>
                </div>

                <div className="bg-[#000510]/80 backdrop-blur-sm border border-green-500/30 rounded-2xl p-5" data-testid="metric-uptime">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="font-mono text-sm text-green-400/70">Uptime</span>
                  </div>
                  <div className="text-4xl font-bold font-mono text-green-400">99.9%</div>
                  <div className="text-xs text-green-400/50 mt-1">30 day avg</div>
                </div>

                <div className="bg-[#000510]/80 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-5" data-testid="metric-vulnerabilities">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span className="font-mono text-sm text-yellow-400/70">Open CVEs</span>
                  </div>
                  <div className="text-4xl font-bold font-mono text-yellow-400">
                    {containers.reduce((sum, c) => sum + c.vulnerabilities, 0)}
                  </div>
                  <div className="text-xs text-yellow-400/50 mt-1">across containers</div>
                </div>

                <div className="bg-[#000510]/80 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-5" data-testid="metric-policies">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-5 h-5 text-purple-400" />
                    <span className="font-mono text-sm text-purple-400/70">Policies</span>
                  </div>
                  <div className="text-4xl font-bold font-mono text-purple-400">
                    {iamPolicies.filter(p => p.status === 'compliant').length}/{iamPolicies.length}
                  </div>
                  <div className="text-xs text-purple-400/50 mt-1">compliant</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-[#00D4FF]/5 via-[#00D4FF]/10 to-[#00D4FF]/5 border border-[#00D4FF]/30 rounded-2xl p-8"
            >
              <div className="max-w-3xl mx-auto text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-[#00D4FF]" />
                  <h2 className="font-mono text-2xl font-bold text-white">
                    Secure Your Cloud Infrastructure
                  </h2>
                </div>

                <p className="text-[#00D4FF]/70 font-mono text-sm mb-6">
                  Get a comprehensive cloud security assessment from our expert team.
                  We'll identify vulnerabilities, misconfigurations, and compliance gaps.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6 font-mono text-center">
                  <div className="bg-[#000510]/60 rounded-lg p-3 border border-[#00D4FF]/20">
                    <div className="text-2xl font-bold text-[#00D4FF]">200+</div>
                    <div className="text-[10px] text-[#00D4FF]/50">SECURITY CHECKS</div>
                  </div>
                  <div className="bg-[#000510]/60 rounded-lg p-3 border border-[#00D4FF]/20">
                    <div className="text-2xl font-bold text-[#00D4FF]">24/7</div>
                    <div className="text-[10px] text-[#00D4FF]/50">MONITORING</div>
                  </div>
                  <div className="bg-[#000510]/60 rounded-lg p-3 border border-[#00D4FF]/20">
                    <div className="text-2xl font-bold text-[#00D4FF]">48h</div>
                    <div className="text-[10px] text-[#00D4FF]/50">RESPONSE TIME</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-[#00D4FF] text-[#000510] font-mono font-bold px-6 py-3 rounded-lg hover:bg-[#00D4FF]/90 transition-all"
                    data-testid="cta-get-assessment"
                  >
                    <Shield className="w-4 h-4" />
                    Get Cloud Assessment
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#00D4FF]/50 text-[#00D4FF] font-mono px-6 py-3 rounded-lg hover:bg-[#00D4FF]/10 transition-all"
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
