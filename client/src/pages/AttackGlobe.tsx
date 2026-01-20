import { CyberAttackGlobe } from "@/components/ui/cyber-attack-globe";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, Shield, AlertTriangle, Clock, Zap, Target, Globe2, Activity, ShieldCheck, ShieldAlert, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function AttackGlobe() {
  const [liveCounter, setLiveCounter] = useState(2847);
  const [seconds, setSeconds] = useState(39);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) return 39;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a1e] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a0a1e] via-[#0a0a1e] to-black" />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 50%)`,
        }} />
      </div>
      
      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a1e]/80 border-b border-[#00D4FF]/10">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-2 text-[#00D4FF] hover:text-white transition-colors text-sm font-medium"
              data-testid="link-back-home"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-white/60 text-sm">
                <Activity className="w-4 h-4 text-[#00D4FF]" />
                <span>Live Monitoring</span>
              </div>
              <motion.div 
                className="flex items-center gap-2 bg-[#ff3344]/10 px-4 py-2 rounded-full border border-[#ff3344]/30"
                animate={{ 
                  boxShadow: ['0 0 10px rgba(255,51,68,0.2)', '0 0 25px rgba(255,51,68,0.4)', '0 0 10px rgba(255,51,68,0.2)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div 
                  className="w-2 h-2 rounded-full bg-[#ff3344]"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-xs text-[#ff3344] font-bold uppercase tracking-wider">Live</span>
              </motion.div>
            </div>
          </div>
        </header>

        <main className="pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <motion.div 
                className="inline-flex items-center gap-3 bg-[#ff3344]/10 border border-[#ff3344]/30 rounded-full px-6 py-2 mb-6"
                animate={{ 
                  boxShadow: ['0 0 15px rgba(255,51,68,0.1)', '0 0 30px rgba(255,51,68,0.2)', '0 0 15px rgba(255,51,68,0.1)']
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <AlertTriangle className="w-4 h-4 text-[#ff3344]" />
                <span className="text-[#ff3344] font-medium text-sm">Global Threat Intelligence Active</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
                <span className="text-white">Real-Time </span>
                <span className="bg-gradient-to-r from-[#00D4FF] to-[#00ff88] bg-clip-text text-transparent">Cyber Attack</span>
                <br />
                <span className="text-white">Monitoring</span>
              </h1>
              
              <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                Witness the invisible war. Every second, thousands of attacks target businesses worldwide.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8"
            >
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-5 group hover:border-[#ff3344]/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="w-5 h-5 text-[#ff3344]" />
                  <motion.span 
                    className="text-[#ff3344] text-2xl font-bold font-mono"
                    key={seconds}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {seconds}s
                  </motion.span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">Every 39</h3>
                <p className="text-white/40 text-sm">Seconds a Hack Occurs</p>
              </div>
              
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-5 group hover:border-[#00D4FF]/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-3">
                  <Target className="w-5 h-5 text-[#00D4FF]" />
                  <Zap className="w-4 h-4 text-[#00D4FF] animate-pulse" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">2,200+</h3>
                <p className="text-white/40 text-sm">Daily Attack Vectors</p>
              </div>
              
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-5 group hover:border-yellow-500/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-3">
                  <ShieldAlert className="w-5 h-5 text-yellow-500" />
                  <span className="text-[10px] text-yellow-500/70 uppercase font-medium">2025</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">$4.45M</h3>
                <p className="text-white/40 text-sm">Avg. Breach Cost</p>
              </div>
              
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-5 group hover:border-purple-500/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-3">
                  <Globe2 className="w-5 h-5 text-purple-400" />
                  <span className="text-[10px] text-purple-400/70 uppercase font-medium">Global</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">$10.5T</h3>
                <p className="text-white/40 text-sm">Annual Cybercrime Cost</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative rounded-3xl overflow-hidden border border-[#00D4FF]/20 bg-[#0a0a1e]/80 backdrop-blur-sm"
              style={{ 
                height: 'min(65vh, 600px)',
                boxShadow: '0 0 60px rgba(0, 212, 255, 0.1), inset 0 0 60px rgba(0, 212, 255, 0.02)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a1e]/50 pointer-events-none z-10" />
              
              <CyberAttackGlobe 
                showStats={true} 
                autoRotate={true}
                attackFrequency={500}
              />
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute top-1/2 left-0 -translate-y-1/2 bg-[#0a0a1e]/90 backdrop-blur-xl border-r border-t border-b border-[#00D4FF]/20 rounded-r-xl py-4 px-3 z-20 hidden xl:block"
              >
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3 text-center">Major<br/>Targets</div>
                <div className="flex flex-col gap-2">
                  {['NYC', 'LON', 'TYO', 'MOS', 'SYD'].map((city, i) => (
                    <motion.div
                      key={city}
                      className="text-[10px] font-mono text-[#00D4FF]/70 text-center"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                      {city}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 text-center"
            >
              <div className="backdrop-blur-xl bg-gradient-to-r from-[#00D4FF]/5 via-[#00D4FF]/10 to-[#00D4FF]/5 border border-[#00D4FF]/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00D4FF]/5 via-transparent to-transparent" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Shield className="w-10 h-10 text-[#00D4FF]" />
                    </motion.div>
                    <div className="text-left">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">Don't Be a Statistic</h2>
                      <p className="text-[#00D4FF]/70 text-sm">95% of breaches are preventable with proper security</p>
                    </div>
                  </div>
                  
                  <p className="text-white/60 max-w-2xl mx-auto mb-8 text-lg">
                    Our <span className="text-[#00D4FF] font-semibold">Vulnerability Assessment & Penetration Testing (VAPT)</span> identifies 
                    your security gaps before attackers do. Get a comprehensive security audit from certified experts.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link 
                      href="/contact"
                      className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#00D4FF] to-[#00ff88] text-[#0a0a1e] font-bold px-8 py-4 rounded-full hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] transition-all duration-300"
                      data-testid="link-get-vapt"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span>Get Free Security Assessment</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <Link 
                      href="/services"
                      className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-6 py-4 rounded-full transition-all duration-300"
                      data-testid="link-learn-more"
                    >
                      Explore Our Services
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 mt-10 max-w-2xl mx-auto">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#00D4FF]">500+</div>
                      <p className="text-white/40 text-sm mt-1">Audits Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#00D4FF]">99.9%</div>
                      <p className="text-white/40 text-sm mt-1">Client Satisfaction</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#00D4FF]">24/7</div>
                      <p className="text-white/40 text-sm mt-1">Monitoring Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-center"
            >
              <p className="text-white/30 text-xs">
                Data sources: IBM Security, University of Maryland, Cybersecurity Ventures (2025)
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
