import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, Key, Lock, Server, Database, Zap, Eye, Clock, Send, Code, FileJson } from 'lucide-react';
import { CRTScreen, BlinkingCursor } from '@/components/ui/crt-screen';

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

const authTests: AuthTest[] = [
  { name: 'JWT Token Validation', icon: Key, status: 'pending' },
  { name: 'OAuth 2.0 Flow Security', icon: Lock, status: 'pending' },
  { name: 'API Key Exposure', icon: Shield, status: 'pending' },
  { name: 'Session Management', icon: Clock, status: 'pending' },
];

const rateLimitData = [
  [0.2, 0.3, 0.5, 0.4, 0.6, 0.8, 0.9, 1.0],
  [0.1, 0.2, 0.4, 0.5, 0.7, 0.6, 0.8, 0.7],
  [0.3, 0.4, 0.6, 0.8, 0.9, 0.7, 0.5, 0.4],
  [0.4, 0.5, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2],
  [0.2, 0.3, 0.4, 0.5, 0.4, 0.3, 0.2, 0.1],
];

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 5, 16, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setVulnerabilities([]);
    setScanComplete(false);
    setAuthTestResults(authTests.map(t => ({ ...t, status: 'pending' as const })));
    setRequestResponse(null);

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

  const generateResults = () => {
    const severities: ('critical' | 'high' | 'medium' | 'low' | 'info')[] = ['critical', 'high', 'medium', 'low', 'info'];
    const categories: ('auth' | 'rate-limit' | 'data-exposure' | 'injection')[] = ['auth', 'rate-limit', 'data-exposure', 'injection'];
    
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

    setRequestResponse({
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
    });

    setAuthTestResults(prev => prev.map(t => ({
      ...t,
      status: (Math.random() > 0.4 ? 'pass' : 'fail') as AuthTestStatus,
    })));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-500 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/50';
      case 'low': return 'text-blue-400 bg-blue-400/20 border-blue-400/50';
      case 'info': return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
      default: return 'text-white bg-white/20 border-white/50';
    }
  };

  const getHeatmapColor = (value: number) => {
    if (value > 0.8) return 'bg-red-500';
    if (value > 0.6) return 'bg-orange-500';
    if (value > 0.4) return 'bg-yellow-500';
    if (value > 0.2) return 'bg-cyan-500';
    return 'bg-cyan-900';
  };

  const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
  const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
  const mediumCount = vulnerabilities.filter(v => v.severity === 'medium').length;

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: '#000510' }}>
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

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
          <CRTScreen className="rounded-2xl" scanlineIntensity="subtle">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 p-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full crt-panel mb-6">
              <Server className="w-4 h-4 text-terminal-cyan" />
              <span className="text-sm font-mono crt-terminal-text text-terminal-cyan">API Security Lab</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-mono crt-terminal-text">
              <span className="text-terminal-cyan">API Security</span>
              <span className="block text-terminal-green crt-phosphor-text">
                Testing Laboratory
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm">
              Simulate comprehensive API security testing. Analyze authentication flows, rate limiting, data exposure, and common API vulnerabilities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="flex gap-4 p-2 rounded-2xl crt-panel backdrop-blur-xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <span className="text-terminal-green font-mono">$</span>
                <Server className="w-5 h-5 text-terminal-cyan" />
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="Enter API endpoint URL..."
                  className="flex-1 bg-transparent border-none outline-none crt-input font-mono text-terminal-cyan placeholder:text-cyan-400/30"
                  disabled={isScanning}
                  data-testid="input-api-endpoint"
                />
                {!isScanning && <BlinkingCursor />}
              </div>
              <button
                onClick={startScan}
                disabled={isScanning}
                className="px-8 py-3 rounded-xl font-semibold font-mono hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                style={{ backgroundImage: 'linear-gradient(to right, #00D4FF, #a855f7)' }}
                data-testid="button-test-endpoint"
              >
                <Send className="w-4 h-4" />
                {isScanning ? '> Testing...' : '> Test Endpoint'}
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-3xl mx-auto mb-12"
              >
                <div className="p-8 rounded-3xl crt-panel backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-mono crt-terminal-text flex items-center gap-2 text-terminal-cyan">
                      <span className="text-terminal-green">$</span>
                      {scanPhase}
                      <BlinkingCursor />
                    </span>
                    <span className="text-sm text-terminal-green font-mono">{Math.round(scanProgress)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ backgroundImage: 'linear-gradient(to right, #00D4FF, #a855f7)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${scanProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {authTestResults.map((test, i) => {
                      const Icon = test.icon;
                      const isActive = scanProgress > (i + 1) * 20;
                      return (
                        <div
                          key={test.name}
                          className={`p-3 rounded-xl border transition-all ${
                            isActive ? 'border-opacity-50 bg-opacity-10' : 'border-white/10 bg-white/5'
                          }`}
                          style={isActive ? { borderColor: 'rgba(0, 212, 255, 0.5)', backgroundColor: 'rgba(0, 212, 255, 0.1)' } : {}}
                        >
                          <Icon className={`w-5 h-5 mb-2 ${isActive ? '' : 'text-white/30'}`} style={isActive ? { color: '#00D4FF' } : {}} />
                          <span className={`text-xs ${isActive ? 'text-white' : 'text-white/30'}`}>
                            {test.name.split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {scanComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
                    <div className="text-3xl font-bold text-white mb-1">{vulnerabilities.length}</div>
                    <div className="text-sm text-gray-400">Total Found</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-red-500/10 backdrop-blur-xl border border-red-500/30">
                    <div className="text-3xl font-bold text-red-500 mb-1">{criticalCount}</div>
                    <div className="text-sm text-red-400/70">Critical</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-orange-500/10 backdrop-blur-xl border border-orange-500/30">
                    <div className="text-3xl font-bold text-orange-500 mb-1">{highCount}</div>
                    <div className="text-sm text-orange-400/70">High</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/30">
                    <div className="text-3xl font-bold text-yellow-500 mb-1">{mediumCount}</div>
                    <div className="text-sm text-yellow-400/70">Medium</div>
                  </div>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto">
                  {[
                    { id: 'request', label: 'Request/Response', icon: FileJson },
                    { id: 'auth', label: 'Authentication', icon: Key },
                    { id: 'rate-limit', label: 'Rate Limiting', icon: Zap },
                    { id: 'data', label: 'Data Exposure', icon: Eye },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                        style={activeTab === tab.id ? { backgroundColor: 'rgba(0, 212, 255, 0.2)', borderColor: 'rgba(0, 212, 255, 0.5)' } : {}}
                        data-testid={`tab-${tab.id}`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="p-6 rounded-3xl crt-panel backdrop-blur-xl mb-8">
                  {activeTab === 'request' && requestResponse && (
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 font-mono text-terminal-cyan">
                        <FileJson className="w-5 h-5 text-terminal-cyan" />
                        <span className="text-terminal-green">[REQ]</span> Request/Response Visualization
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/20">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 rounded text-xs font-mono bg-terminal-green/20 text-terminal-green">
                              {requestResponse.method}
                            </span>
                            <span className="text-sm font-mono text-terminal-cyan crt-terminal-text">{requestResponse.endpoint}</span>
                          </div>
                          <div className="text-xs font-mono text-terminal-green mb-2">// Headers:</div>
                          <pre className="text-xs font-mono text-terminal-cyan overflow-x-auto crt-terminal-text" data-testid="request-headers">
                            {JSON.stringify(requestResponse.headers, null, 2)}
                          </pre>
                        </div>
                        <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/20">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded text-xs font-mono ${requestResponse.status === 200 ? 'bg-terminal-green/20 text-terminal-green' : 'bg-red-500/20 text-red-400'}`}>
                              {requestResponse.status}
                            </span>
                            <span className="text-sm text-terminal-cyan font-mono">{requestResponse.responseTime}ms</span>
                          </div>
                          <div className="text-xs font-mono text-terminal-green mb-2">// Response Body:</div>
                          <pre className="text-xs font-mono text-terminal-cyan overflow-x-auto crt-terminal-text" data-testid="response-body">
                            {JSON.stringify(requestResponse.body, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'auth' && (
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 font-mono text-terminal-cyan">
                        <Key className="w-5 h-5 text-terminal-cyan" />
                        <span className="text-terminal-green">[AUTH]</span> Authentication Testing Results
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {authTestResults.map((test, index) => {
                          const Icon = test.icon;
                          return (
                            <motion.div
                              key={test.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between"
                              data-testid={`auth-test-${index}`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5" style={{ color: '#00D4FF' }} />
                                <span className="font-medium">{test.name}</span>
                              </div>
                              {test.status === 'pass' ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : test.status === 'fail' ? (
                                <XCircle className="w-5 h-5 text-red-500" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-transparent animate-spin" />
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === 'rate-limit' && (
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 font-mono text-terminal-cyan">
                        <Zap className="w-5 h-5 text-terminal-cyan" />
                        <span className="text-terminal-green">[RATE]</span> Rate Limiting Analysis Heatmap
                      </h3>
                      <div className="p-4 rounded-xl bg-black/60 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-white/50">Request Density Over Time</span>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-white/50">Low</span>
                            <div className="flex gap-1">
                              <div className="w-4 h-4 rounded bg-cyan-900" />
                              <div className="w-4 h-4 rounded bg-cyan-500" />
                              <div className="w-4 h-4 rounded bg-yellow-500" />
                              <div className="w-4 h-4 rounded bg-orange-500" />
                              <div className="w-4 h-4 rounded bg-red-500" />
                            </div>
                            <span className="text-white/50">High</span>
                          </div>
                        </div>
                        <div className="grid gap-1" data-testid="rate-limit-heatmap">
                          {rateLimitData.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-1">
                              {row.map((value, colIndex) => (
                                <motion.div
                                  key={colIndex}
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: (rowIndex * 8 + colIndex) * 0.02 }}
                                  className={`flex-1 h-8 rounded ${getHeatmapColor(value)}`}
                                  style={{ opacity: 0.7 + value * 0.3 }}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-white/30">
                          <span>00:00</span>
                          <span>06:00</span>
                          <span>12:00</span>
                          <span>18:00</span>
                          <span>24:00</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'data' && (
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 font-mono text-terminal-cyan">
                        <Eye className="w-5 h-5 text-terminal-cyan" />
                        <span className="text-terminal-green">[DATA]</span> Data Exposure Testing Results
                      </h3>
                      <div className="space-y-3">
                        {vulnerabilities.filter(v => v.category === 'data-exposure').length > 0 ? (
                          vulnerabilities.filter(v => v.category === 'data-exposure').map((vuln, index) => (
                            <motion.div
                              key={vuln.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 rounded-xl bg-white/5 border border-white/10"
                              data-testid={`data-exposure-${index}`}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase border ${getSeverityColor(vuln.severity)}`}>
                                  {vuln.severity}
                                </span>
                                <span className="font-medium">{vuln.type}</span>
                              </div>
                              <p className="text-sm text-gray-400 mb-2">{vuln.description}</p>
                              <code className="text-xs px-2 py-1 rounded" style={{ color: '#00D4FF', backgroundColor: 'rgba(0, 212, 255, 0.1)' }}>
                                {vuln.endpoint}
                              </code>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <p className="text-green-400">No data exposure vulnerabilities detected!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 rounded-3xl crt-panel backdrop-blur-xl">
                  <h3 className="text-xl font-bold mb-6 font-mono text-terminal-cyan flex items-center gap-2">
                    <span className="text-terminal-green">[SYS]</span> All Vulnerabilities Report
                  </h3>
                  <div className="space-y-3">
                    {vulnerabilities.map((vuln, index) => (
                      <motion.div
                        key={vuln.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-black/60 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
                        data-testid={`vulnerability-${index}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-mono uppercase border ${getSeverityColor(vuln.severity)}`}>
                                {vuln.severity}
                              </span>
                              <span className="font-mono text-terminal-cyan">{vuln.type}</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-1 font-mono">{vuln.description}</p>
                            <code className="text-xs px-2 py-1 rounded font-mono text-terminal-green bg-green-500/10">
                              {vuln.endpoint}
                            </code>
                          </div>
                          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        </div>
                      </motion.div>
                    ))}
                    {vulnerabilities.length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-terminal-green mx-auto mb-4" />
                        <p className="text-terminal-green font-mono">[OK] No vulnerabilities detected!</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundImage: 'linear-gradient(to right, #00D4FF, #a855f7)' }}
                    data-testid="link-get-assessment"
                  >
                    <Shield className="w-5 h-5" />
                    Get Professional API Security Assessment
                  </Link>
                  <p className="text-sm text-gray-400 mt-4 font-mono">
                    This is a simulation. Real API security assessments are performed by our certified security experts.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </CRTScreen>
        </div>
      </div>
    </div>
  );
}
