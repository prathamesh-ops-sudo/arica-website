import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowLeft, GitBranch, CheckCircle, XCircle, AlertTriangle, Play, Pause, RotateCcw, Shield, Code, Package, Server, Eye, Lock, Zap, Clock } from 'lucide-react';

interface PipelineStage {
  id: string;
  name: string;
  icon: React.ElementType;
  duration: number;
  status: 'pending' | 'running' | 'success' | 'failed' | 'warning';
  details: string[];
  securityChecks: { name: string; status: 'pass' | 'fail' | 'warn' }[];
}

const initialPipelineStages: PipelineStage[] = [
  {
    id: 'commit',
    name: 'Code Commit',
    icon: GitBranch,
    duration: 800,
    status: 'pending',
    details: ['Pre-commit hooks executed', 'Secrets scan: No secrets detected', 'Linting passed'],
    securityChecks: [
      { name: 'Secret Detection', status: 'pass' },
      { name: 'Code Formatting', status: 'pass' },
    ],
  },
  {
    id: 'build',
    name: 'Build & Compile',
    icon: Package,
    duration: 1500,
    status: 'pending',
    details: ['Dependencies resolved', 'TypeScript compiled', 'Assets bundled'],
    securityChecks: [
      { name: 'Dependency Audit', status: 'pass' },
      { name: 'License Check', status: 'warn' },
    ],
  },
  {
    id: 'sast',
    name: 'SAST Analysis',
    icon: Code,
    duration: 2000,
    status: 'pending',
    details: ['Scanning 847 files...', 'Pattern matching completed', 'Taint analysis done'],
    securityChecks: [
      { name: 'SQL Injection', status: 'pass' },
      { name: 'XSS Vulnerabilities', status: 'pass' },
      { name: 'Hardcoded Secrets', status: 'pass' },
      { name: 'Unsafe Deserialization', status: 'warn' },
    ],
  },
  {
    id: 'sca',
    name: 'Dependency Scan',
    icon: Shield,
    duration: 1200,
    status: 'pending',
    details: ['Checking 234 dependencies', 'CVE database updated', 'SBOM generated'],
    securityChecks: [
      { name: 'Known Vulnerabilities', status: 'pass' },
      { name: 'Outdated Packages', status: 'warn' },
      { name: 'License Compliance', status: 'pass' },
    ],
  },
  {
    id: 'container',
    name: 'Container Security',
    icon: Server,
    duration: 1800,
    status: 'pending',
    details: ['Image built: sha256:a3f2...', 'Layer analysis complete', 'Base image validated'],
    securityChecks: [
      { name: 'Image Vulnerabilities', status: 'pass' },
      { name: 'Dockerfile Best Practices', status: 'pass' },
      { name: 'Root User Check', status: 'pass' },
    ],
  },
  {
    id: 'dast',
    name: 'DAST Testing',
    icon: Eye,
    duration: 2500,
    status: 'pending',
    details: ['Spinning up test environment', 'Running 156 security tests', 'API fuzzing completed'],
    securityChecks: [
      { name: 'Authentication Bypass', status: 'pass' },
      { name: 'Authorization Flaws', status: 'pass' },
      { name: 'Input Validation', status: 'warn' },
    ],
  },
  {
    id: 'deploy',
    name: 'Secure Deploy',
    icon: Lock,
    duration: 1000,
    status: 'pending',
    details: ['Kubernetes manifests validated', 'Network policies applied', 'Secrets injected securely'],
    securityChecks: [
      { name: 'Runtime Protection', status: 'pass' },
      { name: 'Network Segmentation', status: 'pass' },
    ],
  },
];

export default function DevSecOpsPipeline() {
  const [stages, setStages] = useState<PipelineStage[]>(initialPipelineStages);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1);
  const [totalTime, setTotalTime] = useState(0);
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const runPipeline = () => {
    setIsRunning(true);
    setCurrentStage(0);
    setTotalTime(0);
    setStages(initialPipelineStages.map(s => ({ ...s, status: 'pending' })));

    let stageIndex = 0;
    let elapsed = 0;

    const timeCounter = setInterval(() => {
      elapsed += 100;
      setTotalTime(elapsed);
    }, 100);

    const processStage = () => {
      if (stageIndex >= initialPipelineStages.length) {
        clearInterval(timeCounter);
        setIsRunning(false);
        return;
      }

      setCurrentStage(stageIndex);
      setStages(prev => prev.map((s, i) => 
        i === stageIndex ? { ...s, status: 'running' } : s
      ));

      setTimeout(() => {
        const hasWarning = initialPipelineStages[stageIndex].securityChecks.some(c => c.status === 'warn');
        const hasFail = initialPipelineStages[stageIndex].securityChecks.some(c => c.status === 'fail');
        
        setStages(prev => prev.map((s, i) => 
          i === stageIndex ? { ...s, status: hasFail ? 'failed' : hasWarning ? 'warning' : 'success' } : s
        ));

        stageIndex++;
        processStage();
      }, initialPipelineStages[stageIndex].duration);
    };

    processStage();
  };

  const resetPipeline = () => {
    setIsRunning(false);
    setCurrentStage(-1);
    setTotalTime(0);
    setStages(initialPipelineStages.map(s => ({ ...s, status: 'pending' })));
    setSelectedStage(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-500 bg-green-500/20 text-green-400';
      case 'running': return 'border-cyan-500 bg-cyan-500/20 text-cyan-400 animate-pulse';
      case 'failed': return 'border-red-500 bg-red-500/20 text-red-400';
      case 'warning': return 'border-yellow-500 bg-yellow-500/20 text-yellow-400';
      default: return 'border-white/20 bg-white/5 text-white/50';
    }
  };

  const getCheckIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return null;
    }
  };

  const completedStages = stages.filter(s => s.status === 'success' || s.status === 'warning').length;
  const failedStages = stages.filter(s => s.status === 'failed').length;
  const warnings = stages.reduce((sum, s) => sum + s.securityChecks.filter(c => c.status === 'warn').length, 0);

  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-cyan-900/10" />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">DevSecOps Pipeline</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Security-First
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-400">
                CI/CD Pipeline
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Watch security seamlessly integrate into every stage of your development lifecycle with our automated DevSecOps pipeline.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto mb-8">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-4">
                <button
                  onClick={isRunning ? undefined : runPipeline}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-cyan-500 hover:opacity-90 transition-all disabled:opacity-50"
                  data-testid="button-run-pipeline"
                >
                  <Play className="w-4 h-4" />
                  Run Pipeline
                </button>
                <button
                  onClick={resetPipeline}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                  data-testid="button-reset-pipeline"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono">{(totalTime / 1000).toFixed(1)}s</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>{completedStages}/{stages.length}</span>
                </div>
                {warnings > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span>{warnings} warnings</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10" />
              
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = currentStage === index;
                
                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-20 pb-8"
                  >
                    <div className={`absolute left-4 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${getStatusColor(stage.status)}`}>
                      {stage.status === 'running' ? (
                        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                      ) : stage.status === 'success' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : stage.status === 'failed' ? (
                        <XCircle className="w-4 h-4" />
                      ) : stage.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>

                    <div
                      className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                        isActive ? 'border-cyan-500/50 bg-cyan-500/5' : 
                        selectedStage?.id === stage.id ? 'border-cyan-500/50 bg-cyan-500/5' : 
                        'border-white/10 bg-black/40 hover:border-white/20'
                      }`}
                      onClick={() => setSelectedStage(selectedStage?.id === stage.id ? null : stage)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${stage.status === 'running' ? 'bg-cyan-500/20' : 'bg-white/10'}`}>
                            <Icon className={`w-5 h-5 ${stage.status === 'running' ? 'text-cyan-400' : 'text-white/70'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{stage.name}</h3>
                            <span className="text-xs text-muted-foreground">~{stage.duration / 1000}s</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {stage.securityChecks.map((check, i) => (
                            <div key={i} title={check.name}>
                              {getCheckIcon(check.status)}
                            </div>
                          ))}
                        </div>
                      </div>

                      <AnimatePresence>
                        {(selectedStage?.id === stage.id || stage.status === 'running') && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 border-t border-white/10">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Activity Log</h4>
                                  <div className="space-y-1 font-mono text-xs">
                                    {stage.details.map((detail, i) => (
                                      <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="text-green-400"
                                      >
                                        → {detail}
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Security Checks</h4>
                                  <div className="space-y-2">
                                    {stage.securityChecks.map((check, i) => (
                                      <div key={i} className="flex items-center justify-between text-sm">
                                        <span>{check.name}</span>
                                        {getCheckIcon(check.status)}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-cyan-500 to-cyan-500 hover:opacity-90 transition-all"
              data-testid="link-implement-devsecops"
            >
              <Shield className="w-5 h-5" />
              Implement DevSecOps for Your Team
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Our security engineers will help you build a secure development pipeline from scratch.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
