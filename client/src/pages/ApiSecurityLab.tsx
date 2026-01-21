import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, Key, Lock, Server, Zap, Eye, Clock, Send, FileJson } from 'lucide-react';

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

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setVulnerabilities([]);
    setScanComplete(false);
    setAuthTestResults(authTests.map(t => ({ ...t, status: 'pending' as const })));
    setRequestResponse(null);
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

  const generateResults = () => {
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
    if (value > 0.2) return 'bg-slate-500';
    return 'bg-slate-700';
  };

  const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
  const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
  const mediumCount = vulnerabilities.filter(v => v.severity === 'medium').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/experience"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700/50 hover:bg-slate-700/80 transition-colors"
          data-testid="link-back-experience"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Experience</span>
        </Link>
      </div>

      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 mb-6">
            <Server className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300 text-sm font-medium">API Security Lab</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-slate-100">
            API Security
            <span className="block text-slate-400 mt-1">
              Testing Laboratory
            </span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm">
            Simulate comprehensive API security testing. Analyze authentication flows, rate limiting, data exposure, and common API vulnerabilities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="space-y-4">
            <div className="flex gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-700/50">
              <div className="flex items-center gap-2 px-3 border-r border-slate-700/50">
                <select
                  value={customMethod}
                  onChange={(e) => setCustomMethod(e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE')}
                  className="bg-transparent text-emerald-400 font-mono text-sm outline-none cursor-pointer"
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
                <Server className="w-5 h-5 text-slate-500" />
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
              <button
                onClick={startScan}
                disabled={isScanning}
                className="px-6 py-2.5 rounded-lg font-medium text-sm bg-slate-700 hover:bg-slate-600 border border-slate-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                data-testid="button-test-endpoint"
              >
                <Send className="w-4 h-4" />
                {isScanning ? 'Testing...' : 'Test Endpoint'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50">
                <label className="text-xs text-slate-500 font-medium mb-2 block">Headers</label>
                <textarea
                  value={customHeaders}
                  onChange={(e) => setCustomHeaders(e.target.value)}
                  className="w-full h-20 bg-transparent text-slate-300 font-mono text-xs outline-none resize-none placeholder:text-slate-600"
                  placeholder="Authorization: Bearer <token>"
                  disabled={isScanning}
                  data-testid="input-headers"
                />
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50">
                <label className="text-xs text-slate-500 font-medium mb-2 block">Request Body (JSON)</label>
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
        </motion.div>

        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-400 font-mono">
                    {scanPhase}
                  </span>
                  <span className="text-sm text-slate-300 font-mono">{Math.round(scanProgress)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-slate-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {authTestResults.map((test, i) => {
                    const Icon = test.icon;
                    const isActive = scanProgress > (i + 1) * 20;
                    return (
                      <div
                        key={test.name}
                        className={`p-3 rounded-lg border transition-colors ${
                          isActive ? 'border-slate-600/50 bg-slate-800/40' : 'border-slate-800/50 bg-slate-900/40'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-slate-300' : 'text-slate-600'}`} />
                        <span className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
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
                <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                  <div className="text-3xl font-semibold text-slate-100 mb-1">{vulnerabilities.length}</div>
                  <div className="text-sm text-slate-500">Total Found</div>
                </div>
                <div className="p-5 rounded-xl bg-red-950/30 border border-red-900/30">
                  <div className="text-3xl font-semibold text-red-400 mb-1">{criticalCount}</div>
                  <div className="text-sm text-red-500/70">Critical</div>
                </div>
                <div className="p-5 rounded-xl bg-orange-950/30 border border-orange-900/30">
                  <div className="text-3xl font-semibold text-orange-400 mb-1">{highCount}</div>
                  <div className="text-sm text-orange-500/70">High</div>
                </div>
                <div className="p-5 rounded-xl bg-amber-950/30 border border-amber-900/30">
                  <div className="text-3xl font-semibold text-amber-400 mb-1">{mediumCount}</div>
                  <div className="text-sm text-amber-500/70">Medium</div>
                </div>
              </div>

              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-slate-700 text-slate-100 border border-slate-600/50'
                          : 'bg-slate-900/60 text-slate-400 border border-slate-800/50 hover:bg-slate-800/60'
                      }`}
                      data-testid={`tab-${tab.id}`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-700/50 mb-8">
                {activeTab === 'request' && requestResponse && (
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-slate-200">
                      <FileJson className="w-5 h-5 text-slate-400" />
                      Request/Response Visualization
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 rounded text-xs font-mono bg-emerald-950/50 text-emerald-400 border border-emerald-900/50">
                            {requestResponse.method}
                          </span>
                          <span className="text-sm font-mono text-slate-300">{requestResponse.endpoint}</span>
                        </div>
                        <div className="text-xs font-mono text-slate-500 mb-2">// Headers:</div>
                        <pre className="text-xs font-mono text-slate-400 overflow-x-auto" data-testid="request-headers">
                          {JSON.stringify(requestResponse.headers, null, 2)}
                        </pre>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 rounded text-xs font-mono ${requestResponse.status === 200 ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50' : 'bg-red-950/50 text-red-400 border border-red-900/50'}`}>
                            {requestResponse.status}
                          </span>
                          <span className="text-xs text-slate-500">{requestResponse.responseTime}ms</span>
                        </div>
                        <div className="text-xs font-mono text-slate-500 mb-2">// Response Body:</div>
                        <pre className="text-xs font-mono text-slate-400 overflow-x-auto" data-testid="response-body">
                          {JSON.stringify(requestResponse.body, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'auth' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-slate-200">
                      <Key className="w-5 h-5 text-slate-400" />
                      Authentication Security Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {authTestResults.map((test) => {
                        const Icon = test.icon;
                        return (
                          <div
                            key={test.name}
                            className={`p-4 rounded-lg border ${
                              test.status === 'pass' ? 'bg-emerald-950/20 border-emerald-900/30' :
                              test.status === 'fail' ? 'bg-red-950/20 border-red-900/30' :
                              'bg-slate-900/40 border-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${
                                  test.status === 'pass' ? 'text-emerald-400' :
                                  test.status === 'fail' ? 'text-red-400' :
                                  'text-slate-500'
                                }`} />
                                <span className="text-sm font-medium text-slate-200">{test.name}</span>
                              </div>
                              {test.status === 'pass' ? (
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                              ) : test.status === 'fail' ? (
                                <XCircle className="w-5 h-5 text-red-400" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-600 border-t-transparent animate-spin" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
                      <h4 className="text-sm font-medium text-slate-300 mb-4">Authentication Flow</h4>
                      <div className="flex items-center justify-between">
                        {flowSteps.map((step, i) => (
                          <div key={step.id} className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium ${
                              step.status === 'success' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50' :
                              step.status === 'warning' ? 'bg-amber-950/50 text-amber-400 border border-amber-900/50' :
                              step.status === 'error' ? 'bg-red-950/50 text-red-400 border border-red-900/50' :
                              step.status === 'active' ? 'bg-slate-700 text-slate-200 border border-slate-600/50' :
                              'bg-slate-900 text-slate-600 border border-slate-800/50'
                            }`}>
                              {i + 1}
                            </div>
                            {i < flowSteps.length - 1 && (
                              <div className={`w-8 h-0.5 ${
                                step.status === 'success' || step.status === 'warning' ? 'bg-slate-600' : 'bg-slate-800'
                              }`} />
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
                      <Zap className="w-5 h-5 text-slate-400" />
                      Rate Limiting Analysis
                    </h3>
                    <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800/50 mb-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-3">Request Rate Heatmap</h4>
                      <div className="grid gap-1">
                        {rateLimitData.map((row, i) => (
                          <div key={i} className="flex gap-1">
                            {row.map((value, j) => (
                              <div
                                key={j}
                                className={`w-8 h-6 rounded ${getHeatmapColor(value)}`}
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
                      <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/50 text-center">
                        <div className="text-2xl font-semibold text-slate-100">100</div>
                        <div className="text-xs text-slate-500">Requests/min</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/50 text-center">
                        <div className="text-2xl font-semibold text-slate-100">87</div>
                        <div className="text-xs text-slate-500">Remaining</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/50 text-center">
                        <div className="text-2xl font-semibold text-slate-100">45s</div>
                        <div className="text-xs text-slate-500">Reset</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'data' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-slate-200">
                      <Eye className="w-5 h-5 text-slate-400" />
                      Data Exposure Analysis
                    </h3>
                    <div className="space-y-3">
                      {vulnerabilities.filter(v => v.category === 'data-exposure').map((vuln) => (
                        <div
                          key={vuln.id}
                          className="p-4 rounded-lg bg-slate-950/50 border border-slate-800/50"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase border ${getSeverityColor(vuln.severity)}`}>
                              {vuln.severity}
                            </span>
                            <span className="font-medium text-slate-200">{vuln.type}</span>
                          </div>
                          <p className="text-sm text-slate-500 mb-2">{vuln.description}</p>
                          <code className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded font-mono">{vuln.endpoint}</code>
                        </div>
                      ))}
                      {vulnerabilities.filter(v => v.category === 'data-exposure').length === 0 && (
                        <div className="text-center py-8">
                          <CheckCircle className="w-10 h-10 text-emerald-500/70 mx-auto mb-3" />
                          <p className="text-slate-400 text-sm">No data exposure vulnerabilities detected</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <h3 className="text-lg font-medium mb-6 text-slate-200 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-slate-400" />
                  All Vulnerabilities
                </h3>
                <div className="space-y-3">
                  {vulnerabilities.map((vuln, index) => (
                    <motion.div
                      key={vuln.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg bg-slate-950/50 border border-slate-800/50 hover:border-slate-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase border ${getSeverityColor(vuln.severity)}`}>
                              {vuln.severity}
                            </span>
                            <span className="font-medium text-slate-200">{vuln.type}</span>
                          </div>
                          <p className="text-sm text-slate-500 mb-2">{vuln.description}</p>
                          <code className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded font-mono">{vuln.endpoint}</code>
                        </div>
                        <XCircle className="w-5 h-5 text-red-500/70 flex-shrink-0" />
                      </div>
                    </motion.div>
                  ))}
                  {vulnerabilities.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-emerald-500/70 mx-auto mb-4" />
                      <p className="text-slate-400">No vulnerabilities detected</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 border border-slate-600/50 transition-colors"
                  data-testid="link-get-assessment"
                >
                  <Shield className="w-5 h-5" />
                  Get Professional API Security Assessment
                </Link>
                <p className="text-sm text-slate-600 mt-4">
                  This is a simulation. Real API security assessments are performed by our certified experts.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
