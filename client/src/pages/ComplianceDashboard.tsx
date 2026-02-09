import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, FileText, Users, Lock, Server, Database, Eye, Settings, Clock, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedProgress, CircularProgress } from '@/components/ui/animated-progress';
import { useIsMobile } from '@/hooks/use-mobile';

interface ControlCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
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

const certificationStages = [
  { name: 'Gap Analysis', progress: 100 },
  { name: 'Risk Assessment', progress: 100 },
  { name: 'Implementation', progress: 85 },
  { name: 'Internal Audit', progress: 60 },
  { name: 'Stage 1', progress: 30 },
  { name: 'Stage 2', progress: 0 },
];

export default function ComplianceDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<ControlCategory | null>(null);
  const [expandedOnMobile, setExpandedOnMobile] = useState(true);
  const [animatedStages, setAnimatedStages] = useState<number[]>([]);
  const isMobile = useIsMobile();

  const totalControls = isoCategories.reduce((sum, cat) => sum + cat.controls, 0);
  const totalCompliant = isoCategories.reduce((sum, cat) => sum + cat.compliant, 0);
  const totalInProgress = isoCategories.reduce((sum, cat) => sum + cat.inProgress, 0);
  const compliancePercentage = Math.round((totalCompliant / totalControls) * 100);

  useEffect(() => {
    const animateStages = async () => {
      for (let i = 0; i < certificationStages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        setAnimatedStages(prev => [...prev, i]);
      }
    };
    animateStages();
  }, []);

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return 'green';
    if (percentage >= 50) return 'amber';
    return 'red';
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
              Track your organization's path to ISO 27001 certification with our comprehensive compliance monitoring system.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <GlassCard
              glowColor="amber"
              className="lg:col-span-1 p-8 flex flex-col items-center justify-center"
              data-testid="overall-compliance-card"
            >
              <CircularProgress
                value={compliancePercentage}
                size={192}
                strokeWidth={12}
                color="amber"
                label="Compliant"
                className="mb-6"
                data-testid="compliance-circular-progress"
              />
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Overall Compliance Score</h3>
                <p className="text-sm text-muted-foreground">Based on 114 Annex A controls</p>
              </div>
            </GlassCard>

            <div className="lg:col-span-2 grid grid-cols-3 gap-4">
              <GlassCard glowColor="green" className="p-6">
                <CheckCircle className="w-8 h-8 text-green-400 mb-4" />
                <div className="text-4xl font-bold text-green-400 mb-1">{totalCompliant}</div>
                <div className="text-sm text-green-400/70">Controls Implemented</div>
                <AnimatedProgress
                  value={(totalCompliant / totalControls) * 100}
                  color="green"
                  showLabel={false}
                  size="sm"
                  className="mt-3"
                />
              </GlassCard>
              <GlassCard glowColor="amber" className="p-6">
                <Clock className="w-8 h-8 text-yellow-400 mb-4" />
                <div className="text-4xl font-bold text-yellow-400 mb-1">{totalInProgress}</div>
                <div className="text-sm text-yellow-400/70">In Progress</div>
                <AnimatedProgress
                  value={(totalInProgress / totalControls) * 100}
                  color="amber"
                  showLabel={false}
                  size="sm"
                  className="mt-3"
                />
              </GlassCard>
              <GlassCard glowColor="red" className="p-6">
                <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
                <div className="text-4xl font-bold text-red-400 mb-1">{totalControls - totalCompliant - totalInProgress}</div>
                <div className="text-sm text-red-400/70">Gaps Identified</div>
                <AnimatedProgress
                  value={((totalControls - totalCompliant - totalInProgress) / totalControls) * 100}
                  color="red"
                  showLabel={false}
                  size="sm"
                  className="mt-3"
                />
              </GlassCard>

              <GlassCard glowColor="cyan" className="col-span-3 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Certification Timeline</h4>
                  <span className="text-sm text-amber-400">Stage 2 Audit</span>
                </div>
                <div className="space-y-3">
                  {certificationStages.map((stage, index) => {
                    const isAnimated = animatedStages.includes(index);
                    const isComplete = stage.progress === 100;
                    const isActive = stage.progress > 0 && stage.progress < 100;
                    
                    return (
                      <motion.div 
                        key={stage.name} 
                        className="flex items-center gap-4"
                        initial={{ opacity: 0.3 }}
                        animate={{ 
                          opacity: isAnimated ? 1 : 0.3,
                          scale: isAnimated ? 1 : 0.98
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-2 w-32 flex-shrink-0">
                          <motion.div
                            className={`w-2 h-2 rounded-full ${
                              isComplete ? 'bg-green-500' : isActive ? 'bg-amber-500' : 'bg-gray-500'
                            }`}
                            animate={isAnimated && isActive ? {
                              boxShadow: ['0 0 0 0 rgba(245,158,11,0.4)', '0 0 0 8px rgba(245,158,11,0)', '0 0 0 0 rgba(245,158,11,0.4)']
                            } : isComplete ? {
                              boxShadow: '0 0 8px rgba(34,197,94,0.6)'
                            } : {}}
                            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                          />
                          <span className={`text-xs ${isAnimated ? 'text-white' : 'text-muted-foreground'} transition-colors`}>
                            {stage.name}
                          </span>
                        </div>
                        <div className="flex-1 relative">
                          <AnimatedProgress
                            value={isAnimated ? stage.progress : 0}
                            color={isComplete ? 'green' : isActive ? 'gradient' : 'cyan'}
                            size="sm"
                            className="flex-1"
                          />
                          {isAnimated && isComplete && (
                            <motion.div
                              className="absolute right-0 top-1/2 -translate-y-1/2"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: 'spring' }}
                            >
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
          </div>

          <GlassCard glowColor="cyan" className="p-6 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Annex A Control Categories</h3>
              <div className="flex items-center gap-2">
                {isMobile && (
                  <button
                    onClick={() => setExpandedOnMobile(!expandedOnMobile)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm mr-2"
                    data-testid="button-toggle-categories"
                  >
                    {expandedOnMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {expandedOnMobile ? 'Collapse' : 'Expand'}
                  </button>
                )}
                <div className="hidden md:flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> Compliant</span>
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500" /> In Progress</span>
                  <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500" /> Gap</span>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {(expandedOnMobile || !isMobile) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {isoCategories.map((category, index) => {
                const Icon = category.icon;
                const percentage = getCategoryPercentage(category);
                const gaps = category.controls - category.compliant - category.inProgress;
                const glowColor = percentage >= 80 ? 'green' : percentage >= 60 ? 'amber' : 'red';

                return (
                  <GlassCard
                    key={category.id}
                    glowColor={glowColor as 'green' | 'amber' | 'red'}
                    className="p-4"
                    onClick={() => setSelectedCategory(selectedCategory?.id === category.id ? null : category)}
                    data-testid={`category-${category.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-all">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium hover:text-amber-400 transition-colors">{category.name}</h4>
                          <span className={`text-sm font-bold ${getComplianceColor(percentage)}`}>{percentage}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{category.description}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden flex">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(category.compliant / category.controls) * 100}%` }}
                              transition={{ duration: 1, delay: 0.1 * index }}
                              className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                            />
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(category.inProgress / category.controls) * 100}%` }}
                              transition={{ duration: 1, delay: 0.1 * index + 0.1 }}
                              className="h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                            />
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(gaps / category.controls) * 100}%` }}
                              transition={{ duration: 1, delay: 0.1 * index + 0.2 }}
                              className="h-full bg-red-500/50"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="text-green-400">{category.compliant} done</span>
                          <span className="text-yellow-400">{category.inProgress} in progress</span>
                          <span className="text-red-400">{gaps} gaps</span>
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {selectedCategory?.id === category.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-center p-2 rounded-lg bg-green-500/10">
                              <div className="text-lg font-bold text-green-400">{category.compliant}</div>
                              <div className="text-xs text-muted-foreground">Compliant</div>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-yellow-500/10">
                              <div className="text-lg font-bold text-yellow-400">{category.inProgress}</div>
                              <div className="text-xs text-muted-foreground">In Progress</div>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-red-500/10">
                              <div className="text-lg font-bold text-red-400">{gaps}</div>
                              <div className="text-xs text-muted-foreground">Gaps</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                );
              })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 transition-all"
              data-testid="link-get-certified"
            >
              <TrendingUp className="w-5 h-5" />
              Start Your Certification Process
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
