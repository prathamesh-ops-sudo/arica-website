import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowLeft, Shield, CheckCircle, XCircle, AlertTriangle, FileText, Users, Lock, Server, Database, Eye, Settings, Clock, TrendingUp } from 'lucide-react';

interface ControlCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  controls: number;
  compliant: number;
  inProgress: number;
  description: string;
}

const isoCategories: ControlCategory[] = [
  { id: 'a5', name: 'Information Security Policies', icon: FileText, controls: 2, compliant: 2, inProgress: 0, description: 'Management direction for information security' },
  { id: 'a6', name: 'Organization of Information Security', icon: Users, controls: 7, compliant: 5, inProgress: 2, description: 'Internal organization and mobile devices' },
  { id: 'a7', name: 'Human Resource Security', icon: Users, controls: 6, compliant: 4, inProgress: 1, description: 'Prior to, during and termination of employment' },
  { id: 'a8', name: 'Asset Management', icon: Database, controls: 10, compliant: 7, inProgress: 2, description: 'Responsibility and classification of assets' },
  { id: 'a9', name: 'Access Control', icon: Lock, controls: 14, compliant: 10, inProgress: 3, description: 'Business requirements and user access management' },
  { id: 'a10', name: 'Cryptography', icon: Shield, controls: 2, compliant: 2, inProgress: 0, description: 'Cryptographic controls and key management' },
  { id: 'a11', name: 'Physical Security', icon: Server, controls: 15, compliant: 12, inProgress: 2, description: 'Secure areas and equipment protection' },
  { id: 'a12', name: 'Operations Security', icon: Settings, controls: 14, compliant: 11, inProgress: 2, description: 'Operational procedures and malware protection' },
  { id: 'a13', name: 'Communications Security', icon: Eye, controls: 7, compliant: 5, inProgress: 1, description: 'Network security and information transfer' },
  { id: 'a14', name: 'System Acquisition', icon: Database, controls: 13, compliant: 8, inProgress: 3, description: 'Security requirements and development' },
];

export default function ComplianceDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<ControlCategory | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({ compliant: 0, inProgress: 0, total: 0 });

  const totalControls = isoCategories.reduce((sum, cat) => sum + cat.controls, 0);
  const totalCompliant = isoCategories.reduce((sum, cat) => sum + cat.compliant, 0);
  const totalInProgress = isoCategories.reduce((sum, cat) => sum + cat.inProgress, 0);
  const compliancePercentage = Math.round((totalCompliant / totalControls) * 100);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);

      setOverallProgress(Math.round(compliancePercentage * eased));
      setAnimatedStats({
        compliant: Math.round(totalCompliant * eased),
        inProgress: Math.round(totalInProgress * eased),
        total: Math.round(totalControls * eased),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCategoryPercentage = (cat: ControlCategory) => Math.round((cat.compliant / cat.controls) * 100);

  return (
    <div className="min-h-screen bg-[hsl(222,47%,5%)] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-blue-900/10" />

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">ISO 27001 Compliance</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Compliance
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Dashboard
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track your organization's journey to ISO 27001 certification with our comprehensive compliance monitoring system.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-amber-500/30 flex flex-col items-center justify-center"
            >
              <div className="relative w-48 h-48 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${overallProgress * 5.02} 502`}
                    className="transition-all duration-300"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${getComplianceColor(overallProgress)}`}>
                    {overallProgress}%
                  </span>
                  <span className="text-sm text-muted-foreground">Compliant</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Overall Compliance Score</h3>
                <p className="text-sm text-muted-foreground">Based on 114 Annex A controls</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 grid grid-cols-3 gap-4"
            >
              <div className="p-6 rounded-2xl bg-green-500/10 backdrop-blur-xl border border-green-500/30">
                <CheckCircle className="w-8 h-8 text-green-400 mb-4" />
                <div className="text-4xl font-bold text-green-400 mb-1">{animatedStats.compliant}</div>
                <div className="text-sm text-green-400/70">Controls Implemented</div>
              </div>
              <div className="p-6 rounded-2xl bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/30">
                <Clock className="w-8 h-8 text-yellow-400 mb-4" />
                <div className="text-4xl font-bold text-yellow-400 mb-1">{animatedStats.inProgress}</div>
                <div className="text-sm text-yellow-400/70">In Progress</div>
              </div>
              <div className="p-6 rounded-2xl bg-red-500/10 backdrop-blur-xl border border-red-500/30">
                <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
                <div className="text-4xl font-bold text-red-400 mb-1">{animatedStats.total - animatedStats.compliant - animatedStats.inProgress}</div>
                <div className="text-sm text-red-400/70">Gaps Identified</div>
              </div>

              <div className="col-span-3 p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Certification Timeline</h4>
                  <span className="text-sm text-amber-400">Stage 2 Audit</span>
                </div>
                <div className="flex items-center gap-2">
                  {['Gap Analysis', 'Risk Assessment', 'Implementation', 'Internal Audit', 'Stage 1', 'Stage 2'].map((stage, i) => (
                    <div key={stage} className="flex-1">
                      <div className={`h-2 rounded-full ${i < 4 ? 'bg-green-500' : i === 4 ? 'bg-amber-500' : 'bg-white/20'}`} />
                      <span className="text-xs text-muted-foreground mt-1 block text-center">{stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Annex A Control Categories</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> Compliant</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500" /> In Progress</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500" /> Gap</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isoCategories.map((category, index) => {
                const Icon = category.icon;
                const percentage = getCategoryPercentage(category);
                const gaps = category.controls - category.compliant - category.inProgress;

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all cursor-pointer group"
                    onClick={() => setSelectedCategory(selectedCategory?.id === category.id ? null : category)}
                    data-testid={`category-${category.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-all">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium group-hover:text-amber-400 transition-colors">{category.name}</h4>
                          <span className={`text-sm font-bold ${getComplianceColor(percentage)}`}>{percentage}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{category.description}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden flex">
                            <div className="h-full bg-green-500" style={{ width: `${(category.compliant / category.controls) * 100}%` }} />
                            <div className="h-full bg-yellow-500" style={{ width: `${(category.inProgress / category.controls) * 100}%` }} />
                            <div className="h-full bg-red-500/50" style={{ width: `${(gaps / category.controls) * 100}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="text-green-400">{category.compliant} done</span>
                          <span className="text-yellow-400">{category.inProgress} in progress</span>
                          <span className="text-red-400">{gaps} gaps</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 transition-all"
              data-testid="link-get-certified"
            >
              <TrendingUp className="w-5 h-5" />
              Start Your Certification Journey
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Our ISO 27001 experts will guide you through every step of the certification process.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
