import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Users, Activity, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import terrainImage from "@assets/generated_images/3d_wireframe_terrain_visualization.png";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6"
            >
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span className="text-xs text-primary font-medium tracking-wider uppercase">
                Enterprise Grade Security
              </span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
              Advanced{" "}
              <span className="text-gradient">Cybersecurity</span>
              <br />
              Infrastructure.
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Securing government and enterprise assets with high-trust
              forensics, real-time threat detection, and rigorous legal
              compliance solutions.
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-10">
              <Link href="/services">
                <Button
                  data-testid="button-hero-cta"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold group"
                >
                  Explore Services
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['AK', 'JW', 'ER'].map((initials, i) => (
                    <div
                      key={initials}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center text-xs font-semibold"
                      style={{ zIndex: 3 - i }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-medium">24/7 Monitoring</p>
                  <p className="text-muted-foreground text-xs">Expert SOC Analysts</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Real-Time Threats</p>
                  <p className="font-display text-2xl font-bold text-primary">1,204<span className="text-sm text-muted-foreground ml-1">blocked</span></p>
                </div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Protected</p>
                  <p className="font-display text-2xl font-bold">500+<span className="text-sm text-muted-foreground ml-1">clients</span></p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl opacity-30" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={terrainImage}
                  alt="3D terrain visualization"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-green-400">REAL-TIME THREATS</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
