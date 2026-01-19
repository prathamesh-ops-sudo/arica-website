import { CyberAttackGlobe } from "@/components/ui/cyber-attack-globe";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, Shield, AlertTriangle, TrendingUp } from "lucide-react";

export default function AttackGlobe() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-cyan-950/20" />
      
      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-white/5">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/experience">
              <a className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors" data-testid="link-back">
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Experience</span>
              </a>
            </Link>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm text-red-400 font-medium">LIVE THREAT FEED</span>
            </div>
          </div>
        </header>

        <main className="pt-20">
          <div className="container mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="font-display text-4xl md:text-6xl font-bold text-halo-white mb-4">
                Global Cyber Attack Monitor
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Real-time visualization of cyber attacks happening worldwide. Every second, thousands of attacks 
                target businesses globally, causing billions in losses.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="backdrop-blur-xl bg-black/40 border border-cyan-500/20 rounded-2xl p-6 text-center"
              >
                <Shield className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">$10.5 Trillion</h3>
                <p className="text-sm text-muted-foreground">Projected cybercrime cost by 2025</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="backdrop-blur-xl bg-black/40 border border-orange-500/20 rounded-2xl p-6 text-center"
              >
                <AlertTriangle className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">2,200+</h3>
                <p className="text-sm text-muted-foreground">Attacks per day on businesses</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="backdrop-blur-xl bg-black/40 border border-red-500/20 rounded-2xl p-6 text-center"
              >
                <TrendingUp className="w-10 h-10 text-red-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">$4.45 Million</h3>
                <p className="text-sm text-muted-foreground">Average cost of a data breach</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative rounded-3xl overflow-hidden border border-cyan-500/20 bg-black/40"
              style={{ height: '70vh', minHeight: '600px' }}
            >
              <CyberAttackGlobe 
                showStats={true} 
                autoRotate={true}
                attackFrequency={600}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                Protect Your Business with VAPT
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Our Vulnerability Assessment and Penetration Testing services identify weaknesses 
                before attackers do. Stay ahead of threats with proactive security testing.
              </p>
              <Link href="/contact">
                <a 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
                  data-testid="link-contact-vapt"
                >
                  <Shield className="w-5 h-5" />
                  Get VAPT Assessment
                </a>
              </Link>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
