import { motion } from "framer-motion";
import { Users, Activity } from "lucide-react";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { SplineScene } from "@/components/ui/splite";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 z-0">
        <SplineScene 
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent pointer-events-none z-[1]" />
      
      <div className="absolute inset-0 opacity-20 pointer-events-none z-[2]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <AnimatedHero centered={false} />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-8 mt-8 pt-8 border-t border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Real-Time Threats</p>
                  <p className="font-display text-2xl font-bold text-primary">1,204<span className="text-sm text-muted-foreground ml-1">blocked</span></p>
                </div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10 backdrop-blur-sm">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Enterprise</p>
                  <p className="font-display text-2xl font-bold">50+<span className="text-sm text-muted-foreground ml-1">clients</span></p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>

      <div className="absolute bottom-4 right-6 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 z-10">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs font-mono text-green-400">SYSTEM ACTIVE</span>
      </div>
    </section>
  );
}
