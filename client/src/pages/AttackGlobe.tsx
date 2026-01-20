import { CyberAttackGlobe } from "@/components/ui/cyber-attack-globe";
import { FluidSimulation } from "@/components/ui/fluid-simulation";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, Shield, AlertTriangle, TrendingUp, Clock, Zap, Target, Globe2, Terminal, Skull, Lock, Eye } from "lucide-react";
import { useState, useEffect } from "react";

const hackerMessages = [
  "Scanning network vulnerabilities...",
  "Brute force attempt detected from 192.168.x.x",
  "SQL injection blocked on /api/users",
  "Malware signature identified: TROJAN.WIN32",
  "Port 443 breach attempt intercepted",
  "Ransomware payload neutralized",
  "DDoS attack mitigated from botnet",
  "Phishing domain blacklisted",
  "Zero-day exploit attempt logged",
  "Unauthorized SSH access denied",
];

export default function AttackGlobe() {
  const [liveCounter, setLiveCounter] = useState(0);
  const [liveAmount, setLiveAmount] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [glitchText, setGlitchText] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter(prev => prev + Math.floor(Math.random() * 5) + 1);
      setLiveAmount(prev => prev + Math.floor(Math.random() * 50000) + 10000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      const message = hackerMessages[Math.floor(Math.random() * hackerMessages.length)];
      setTerminalLines(prev => [...prev.slice(-4), `[${timestamp}] ${message}`]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]" 
        style={{ 
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)' 
        }} 
      />
      
      {/* Fluid simulation background */}
      <div className="absolute inset-0 opacity-15">
        <FluidSimulation colorScheme="mixed" intensity={0.2} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/90 via-transparent to-[#0a0a0f]" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b border-green-500/20">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-mono text-sm"
              data-testid="link-back-home"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>~/home</span>
            </Link>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6 font-mono text-xs">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Zap className="w-3 h-3" />
                  <span className="text-white">{liveCounter.toLocaleString()}</span>
                  <span className="text-green-500/70">intrusions</span>
                </div>
                <div className="flex items-center gap-2 text-red-400">
                  <Skull className="w-3 h-3" />
                  <span>${(liveAmount / 1000000).toFixed(2)}M</span>
                  <span className="text-green-500/70">dmg</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded border border-red-500/40">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-red-400 font-mono font-bold">THREAT.ACTIVE</span>
              </div>
            </div>
          </div>
        </header>

        <main className="pt-20">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-6 mb-4"
          >
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded px-3 py-1.5 mb-4 font-mono text-xs">
              <Terminal className="w-3 h-3 text-green-400" />
              <span className="text-green-400">root@arica-sec:~#</span>
              <span className="text-red-400">./threat_monitor --live</span>
            </div>
            
            <h1 className={`font-mono text-3xl md:text-5xl lg:text-6xl font-bold mb-3 transition-all ${glitchText ? 'translate-x-1 text-red-500' : ''}`}>
              <span className="text-green-400">&gt; </span>
              <span className="text-white">GLOBAL_THREAT</span>
              <span className="text-red-400">.</span>
              <span className="text-cyan-400">MONITOR</span>
            </h1>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent flex-1 max-w-32" />
              <p className="text-green-500/70 font-mono text-sm">
                {"// Every 39 seconds, a new attack vector emerges"}
              </p>
              <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent flex-1 max-w-32" />
            </div>
          </motion.div>

          {/* Terminal-style live feed */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-4 md:mx-8 mb-4"
          >
            <div className="bg-black/80 border border-green-500/30 rounded-lg p-3 font-mono text-xs">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-green-500/50 ml-2">threat_feed.log</span>
              </div>
              <div className="space-y-1 h-20 overflow-hidden">
                {terminalLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-green-400"
                  >
                    {line}
                  </motion.div>
                ))}
                <div className="text-green-500 animate-pulse">█</div>
              </div>
            </div>
          </motion.div>

          {/* Globe visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative mx-4 md:mx-8 rounded-lg overflow-hidden border border-cyan-500/30 bg-black/60"
            style={{ height: '55vh', minHeight: '400px' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-950/10 via-transparent to-red-950/10" />
            
            {/* Corner decorations */}
            <div className="absolute top-2 left-2 text-green-500/50 font-mono text-[10px]">
              <div>[SYS.INIT]</div>
              <div>NODES: ACTIVE</div>
            </div>
            <div className="absolute top-2 right-2 text-red-500/50 font-mono text-[10px] text-right">
              <div>THREAT.LVL: HIGH</div>
              <div>DEFCON: 2</div>
            </div>
            
            <CyberAttackGlobe 
              showStats={true} 
              autoRotate={true}
              attackFrequency={350}
            />
            
            {/* Status overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between font-mono text-[10px]">
              <div className="flex items-center gap-2 text-cyan-500/70">
                <Eye className="w-3 h-3" />
                <span>MONITORING: 195 COUNTRIES</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-500/70">
                <Lock className="w-3 h-3" />
                <span>ENCRYPTION: AES-256</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="container mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
            >
              <div className="bg-black/60 border border-red-500/30 rounded-lg p-4 font-mono">
                <Clock className="w-5 h-5 text-red-400 mb-2" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-0.5">39s</h3>
                <p className="text-[10px] text-red-500/70 uppercase">ATTACK_INTERVAL</p>
              </div>
              <div className="bg-black/60 border border-orange-500/30 rounded-lg p-4 font-mono">
                <Target className="w-5 h-5 text-orange-400 mb-2" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-0.5">2,200+</h3>
                <p className="text-[10px] text-orange-500/70 uppercase">DAILY_VECTORS</p>
              </div>
              <div className="bg-black/60 border border-yellow-500/30 rounded-lg p-4 font-mono">
                <TrendingUp className="w-5 h-5 text-yellow-400 mb-2" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-0.5">$4.45M</h3>
                <p className="text-[10px] text-yellow-500/70 uppercase">AVG_BREACH_COST</p>
              </div>
              <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-4 font-mono">
                <Globe2 className="w-5 h-5 text-cyan-400 mb-2" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-0.5">$10.5T</h3>
                <p className="text-[10px] text-cyan-500/70 uppercase">GLOBAL_DAMAGE_2025</p>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-r from-cyan-500/5 via-green-500/5 to-cyan-500/5 border border-cyan-500/30 rounded-lg p-6 md:p-8"
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-cyan-400" />
                  <h2 className="font-mono text-xl md:text-2xl font-bold text-white">
                    <span className="text-green-400">sudo</span> PROTECT --business
                  </h2>
                </div>
                
                <p className="text-center text-green-500/70 font-mono text-sm mb-6">
                  {"// VAPT: Vulnerability Assessment & Penetration Testing"}
                  <br />
                  {"// Identify weaknesses before threat actors exploit them"}
                </p>
                
                <div className="grid grid-cols-3 gap-3 mb-6 font-mono text-center">
                  <div className="bg-black/40 rounded p-3 border border-green-500/20">
                    <div className="text-lg font-bold text-cyan-400">95%</div>
                    <p className="text-[10px] text-green-500/50">PREVENTABLE</p>
                  </div>
                  <div className="bg-black/40 rounded p-3 border border-green-500/20">
                    <div className="text-lg font-bold text-cyan-400">287d</div>
                    <p className="text-[10px] text-green-500/50">DETECTION_TIME</p>
                  </div>
                  <div className="bg-black/40 rounded p-3 border border-green-500/20">
                    <div className="text-lg font-bold text-red-400">60%</div>
                    <p className="text-[10px] text-green-500/50">SMB_CLOSURE</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-mono font-bold px-6 py-3 rounded hover:opacity-90 transition-opacity"
                    data-testid="link-get-vapt"
                  >
                    <Terminal className="w-4 h-4" />
                    ./request_assessment
                  </Link>
                  <Link 
                    href="/services"
                    className="inline-flex items-center justify-center gap-2 bg-transparent border border-green-500/50 text-green-400 font-mono px-6 py-3 rounded hover:bg-green-500/10 transition-colors"
                    data-testid="link-learn-more"
                  >
                    cat services.md
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-center font-mono text-[10px] text-green-500/30"
            >
              {"/* Sources: IBM Security, UMD Research, Cybersecurity Ventures */"}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
