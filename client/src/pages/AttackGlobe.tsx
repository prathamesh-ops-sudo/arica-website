import { CyberAttackGlobe } from "@/components/ui/cyber-attack-globe";
import { FluidSimulation } from "@/components/ui/fluid-simulation";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, Shield, AlertTriangle, TrendingUp, Clock, Zap, Target, Globe2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function AttackGlobe() {
  const [liveCounter, setLiveCounter] = useState(0);
  const [liveAmount, setLiveAmount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter(prev => prev + Math.floor(Math.random() * 5) + 1);
      setLiveAmount(prev => prev + Math.floor(Math.random() * 50000) + 10000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <FluidSimulation colorScheme="cyan" intensity={0.15} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />
      
      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-red-500/20">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors" data-testid="link-back-home">
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </a>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-mono">{liveCounter.toLocaleString()}</span>
                  <span className="text-muted-foreground">attacks</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-mono">${(liveAmount / 1000000).toFixed(2)}M</span>
                  <span className="text-muted-foreground">losses</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm text-red-400 font-medium">LIVE</span>
              </div>
            </div>
          </div>
        </header>

        <main className="pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-6 mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2 mb-6">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">The World Is Under Attack</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className="text-halo-white">Every </span>
              <span className="text-red-400">39 Seconds</span>
              <span className="text-halo-white">,</span>
              <br />
              <span className="text-halo-white">A Cyber Attack Occurs</span>
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
              Watch real-time cyber attacks traversing the globe. This is happening right now, 
              and without proper security measures, your business could be next.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative mx-4 md:mx-8 rounded-3xl overflow-hidden border border-red-500/20"
            style={{ height: '65vh', minHeight: '500px' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-cyan-950/20" />
            <CyberAttackGlobe 
              showStats={true} 
              autoRotate={true}
              attackFrequency={400}
            />
            
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-2 bg-red-500/20 backdrop-blur-xl border border-red-500/40 rounded-full px-4 py-2"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-sm text-red-300 font-medium">Attacks Happening Now</span>
              </motion.div>
            </div>
          </motion.div>

          <div className="container mx-auto px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              <div className="backdrop-blur-xl bg-black/40 border border-red-500/20 rounded-2xl p-5 text-center">
                <Clock className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">39s</h3>
                <p className="text-xs text-muted-foreground">Between Attacks</p>
              </div>

              <div className="backdrop-blur-xl bg-black/40 border border-orange-500/20 rounded-2xl p-5 text-center">
                <Target className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">2,200+</h3>
                <p className="text-xs text-muted-foreground">Daily Attacks</p>
              </div>

              <div className="backdrop-blur-xl bg-black/40 border border-yellow-500/20 rounded-2xl p-5 text-center">
                <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">$4.45M</h3>
                <p className="text-xs text-muted-foreground">Avg Breach Cost</p>
              </div>

              <div className="backdrop-blur-xl bg-black/40 border border-cyan-500/20 rounded-2xl p-5 text-center">
                <Globe2 className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">$10.5T</h3>
                <p className="text-xs text-muted-foreground">2025 Cybercrime</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="backdrop-blur-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 rounded-3xl p-8 md:p-12"
            >
              <div className="max-w-3xl mx-auto text-center">
                <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  Don't Become A Statistic
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  <strong className="text-white">VAPT (Vulnerability Assessment & Penetration Testing)</strong> identifies 
                  security weaknesses before attackers exploit them. Our certified security experts simulate 
                  real-world attacks to protect your business.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">95%</div>
                    <p className="text-sm text-muted-foreground">of breaches are preventable</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">287 days</div>
                    <p className="text-sm text-muted-foreground">avg time to identify a breach</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">60%</div>
                    <p className="text-sm text-muted-foreground">of SMBs close after an attack</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <a 
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
                      data-testid="link-get-vapt"
                    >
                      <Shield className="w-5 h-5" />
                      Get VAPT Assessment
                    </a>
                  </Link>
                  <Link href="/services">
                    <a 
                      className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-colors"
                      data-testid="link-learn-more"
                    >
                      Learn More About Our Services
                    </a>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-12 text-center"
            >
              <p className="text-sm text-muted-foreground">
                Data sources: IBM Security, University of Maryland, Cybersecurity Ventures
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
