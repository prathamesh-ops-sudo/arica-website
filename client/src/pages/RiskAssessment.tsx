import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ArrowLeft, Shield, AlertTriangle, CheckCircle, TrendingUp, TrendingDown,
  Network, Code, Database, Lock, AlertCircle, FileCheck, ChevronDown, ChevronUp,
  Target, Zap, Clock, ArrowRight, Info, HelpCircle
} from 'lucide-react';
import { AmbientParticles } from '@/components/ui/ambient-particles';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedProgress, CircularProgress } from '@/components/ui/animated-progress';
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

export default function RiskAssessment() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [hoveredThreat, setHoveredThreat] = useState<Threat | null>(null);
  const [actionItems, setActionItems] = useState(initialActionItems);
  const [expandedFramework, setExpandedFramework] = useState<string | null>(null);
  const [animatedTrend, setAnimatedTrend] = useState<number[]>([]);
  const [expandedPriorities, setExpandedPriorities] = useState<string[]>(['urgent', 'high']);

  const targetScore = 35;
  const previousScore = 42;
  const improvement = previousScore - targetScore;

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

  const getScoreColor = (score: number) => {
    if (score <= 33) return { text: 'text-green-400', bg: 'bg-green-500', gradient: 'from-green-500 to-emerald-400' };
    if (score <= 66) return { text: 'text-yellow-400', bg: 'bg-yellow-500', gradient: 'from-yellow-500 to-amber-400' };
    return { text: 'text-red-400', bg: 'bg-red-500', gradient: 'from-red-500 to-rose-400' };
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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
    <div className="min-h-screen aurora-bg text-white relative overflow-hidden">
      <AmbientParticles variant="network" count={30} color="#00D4FF" opacity={0.15} />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
              <Target className="w-4 h-4 text-[#00D4FF]" />
              <span className="text-[#00D4FF] text-sm font-medium">Risk Assessment</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Cybersecurity
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-purple-500">
                Risk Assessment
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive analysis of your organization's security posture with actionable insights and remediation priorities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <GlassCard
              glowColor="cyan"
              className="lg:col-span-1 p-8 flex flex-col items-center justify-center"
              data-testid="risk-score-dashboard"
            >
              <CircularProgress
                value={targetScore}
                size={192}
                strokeWidth={12}
                color="green"
                label="Risk Score"
                className="mb-6"
                data-testid="risk-circular-progress"
              />
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Overall Risk Level</h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-green-400 bg-white/10">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Low Risk</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                  <TrendingDown className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">-{improvement} pts</span>
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
                <h3 className="text-xl font-bold">Risk Score Trend</h3>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <TrendingDown className="w-4 h-4" />
                  <span>Improving</span>
                </div>
              </div>
              <div className="relative h-48">
                <div className="absolute inset-0 flex items-end justify-between gap-1">
                  {animatedTrend.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${(value / 100) * 100}%` }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex-1 rounded-t-lg ${
                        value <= 33 ? 'bg-green-500/60 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : value <= 66 ? 'bg-yellow-500/60 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                      }`}
                    />
                  ))}
                </div>
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <filter id="glow-line" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <filter id="glow-point" x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00D4FF" />
                      <stop offset="50%" stopColor="#00D4FF" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="none"
                    stroke="url(#trendGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow-line)"
                    opacity="0.4"
                    points={animatedTrend.map((value, index) => 
                      `${(index / (trendData.length - 1)) * 100}%,${100 - value}%`
                    ).join(' ')}
                  />
                  <polyline
                    fill="none"
                    stroke="url(#trendGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow-line)"
                    points={animatedTrend.map((value, index) => 
                      `${(index / (trendData.length - 1)) * 100}%,${100 - value}%`
                    ).join(' ')}
                  />
                  {animatedTrend.map((value, index) => (
                    <g key={index}>
                      <circle
                        cx={`${(index / (trendData.length - 1)) * 100}%`}
                        cy={`${100 - value}%`}
                        r="8"
                        fill={value <= 40 ? '#22c55e' : '#00D4FF'}
                        opacity="0.3"
                        filter="url(#glow-point)"
                      />
                      <circle
                        cx={`${(index / (trendData.length - 1)) * 100}%`}
                        cy={`${100 - value}%`}
                        r="5"
                        fill={value <= 40 ? '#22c55e' : '#00D4FF'}
                        filter="url(#glow-point)"
                      />
                    </g>
                  ))}
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground pt-2">
                  <span>12 months ago</span>
                  <span>Today</span>
                </div>
              </div>
            </GlassCard>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
            data-testid="risk-categories-grid"
          >
            <h3 className="text-2xl font-bold mb-6">Risk Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {riskCategories.map((category, index) => {
                const Icon = category.icon;
                const isExpanded = expandedCategory === category.id;
                return (
                  <GlassCard
                    key={category.id}
                    glowColor={getStatusGlowColor(category.status)}
                    className="p-6"
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    data-testid={`card-category-${category.id}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-white/10">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="p-1 rounded-full hover:bg-white/10 transition-colors" data-testid={`tooltip-trigger-${category.id}`}>
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-[rgba(10,10,30,0.95)] border-[#00D4FF]/30">
                            <p className="text-sm">{riskCategoryTooltips[category.id]}</p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="text-right">
                          <div className="text-3xl font-bold">{category.score}</div>
                          <div className="text-xs uppercase tracking-wide opacity-70">{category.status}</div>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-semibold mb-2">{category.name}</h4>
                    <AnimatedProgress
                      value={100 - category.score}
                      color={category.status === 'low' ? 'green' : category.status === 'critical' ? 'red' : 'amber'}
                      size="md"
                      showLabel={false}
                      className="mb-3"
                    />
                    <div className="flex items-center justify-between text-sm opacity-70">
                      <span>{category.findings.length} findings</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <ul className="space-y-2">
                            {category.findings.map((finding, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{finding}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                );
              })}
            </div>
          </motion.div>

          <GlassCard
            glowColor="purple"
            className="mb-12 p-6"
            data-testid="threat-matrix"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Threat Matrix</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-white/10 transition-colors" data-testid="threat-matrix-help">
                    <HelpCircle className="w-5 h-5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-[rgba(10,10,30,0.95)] border-[#00D4FF]/30">
                  <p className="text-sm">Hover over threat dots to see details. Position indicates likelihood (x-axis) and impact (y-axis). Color indicates severity.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-12 w-12 flex flex-col justify-between items-center text-xs text-muted-foreground">
                <span className="bg-red-500/20 px-1 rounded">5</span>
                <span className="bg-orange-500/20 px-1 rounded">4</span>
                <span className="bg-yellow-500/20 px-1 rounded">3</span>
                <span className="bg-green-500/20 px-1 rounded">2</span>
                <span className="bg-green-500/10 px-1 rounded">1</span>
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
                      let bgColor = 'bg-green-500/20';
                      if (riskLevel >= 15) bgColor = 'bg-red-500/30';
                      else if (riskLevel >= 8) bgColor = 'bg-orange-500/25';
                      else if (riskLevel >= 4) bgColor = 'bg-yellow-500/20';
                      
                      return (
                        <div
                          key={`${likelihood}-${impact}`}
                          className={`${bgColor} rounded-lg p-2 relative flex items-center justify-center min-h-[60px] border border-white/5`}
                        >
                          {cellThreats.map((threat, i) => (
                            <div
                              key={threat.id}
                              className={`w-4 h-4 rounded-full ${getSeverityColor(threat.severity)} cursor-pointer hover:scale-150 transition-transform absolute shadow-[0_0_10px_currentColor]`}
                              style={{ 
                                left: `${20 + (i * 20)}%`,
                                top: '50%',
                                transform: 'translateY(-50%)'
                              }}
                              onMouseEnter={() => setHoveredThreat(threat)}
                              onMouseLeave={() => setHoveredThreat(null)}
                              data-testid={`threat-dot-${threat.id}`}
                            />
                          ))}
                        </div>
                      );
                    })
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground max-w-lg mx-auto px-1">
                  <span className="bg-green-500/10 px-1 rounded">1</span>
                  <span className="bg-green-500/20 px-1 rounded">2</span>
                  <span className="bg-yellow-500/20 px-1 rounded">3</span>
                  <span className="bg-orange-500/20 px-1 rounded">4</span>
                  <span className="bg-red-500/20 px-1 rounded">5</span>
                </div>
                <div className="text-center text-xs text-muted-foreground mt-2 font-medium tracking-wider">
                  LIKELIHOOD →
                </div>
              </div>
              <AnimatePresence>
                {hoveredThreat && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-4 right-4 p-4 rounded-xl bg-[rgba(10,10,30,0.9)] backdrop-blur-xl border border-[#00D4FF]/30 max-w-xs shadow-[0_0_30px_rgba(0,212,255,0.2)]"
                    data-testid="threat-tooltip"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(hoveredThreat.severity)}`} />
                      <span className="font-semibold">{hoveredThreat.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{hoveredThreat.description}</p>
                    <div className="flex gap-4 text-xs">
                      <span>Likelihood: {hoveredThreat.likelihood}/5</span>
                      <span>Impact: {hoveredThreat.impact}/5</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span>Low</span>
              </div>
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
                <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    <span>Projected score after addressing: <strong>{projectedScore}</strong> (-{addressedImpact} pts)</span>
                  </div>
                </div>
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
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
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
                                      ? 'bg-green-500/10 border-green-500/30 opacity-60' 
                                      : 'bg-white/5 border-white/10 hover:border-[#00D4FF]/50'
                                  }`}
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
                                          ? 'bg-green-500 border-green-500' 
                                          : 'border-white/30 hover:border-[#00D4FF]'
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
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
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
                                <li key={i} className="flex items-center gap-2 text-sm">
                                  <div className={`w-2 h-2 rounded-full ${
                                    i < Math.ceil(framework.requirements.length * (framework.progress / 100))
                                      ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]'
                                      : 'bg-white/20'
                                  }`} />
                                  <span>{req}</span>
                                </li>
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
            <Zap className="w-12 h-12 text-[#00D4FF] mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ready for a Complete Assessment?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Our cybersecurity experts can provide a comprehensive risk assessment tailored to your organization's specific needs.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-[#00D4FF] to-purple-500 hover:opacity-90 transition-all shadow-[0_0_30px_rgba(0,212,255,0.3)]"
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
