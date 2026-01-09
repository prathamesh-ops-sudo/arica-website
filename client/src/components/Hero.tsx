import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Shield, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackground from "@assets/generated_images/cybersecurity_hero_background.png";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground font-medium">
                Trusted by 500+ enterprises worldwide
              </span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Protecting Your{" "}
              <span className="text-gradient glow-text">Digital Future</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
              Comprehensive cybersecurity solutions for businesses of all sizes.
              From prevention to forensics, we've got you covered.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button
                  data-testid="button-hero-cta"
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan font-semibold text-base px-8 py-6 group"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  data-testid="button-hero-services"
                  size="lg"
                  variant="outline"
                  className="border-border hover:bg-secondary font-semibold text-base px-8 py-6"
                >
                  Explore Services
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-border">
              <div>
                <p className="font-display text-3xl font-bold text-primary">99.9%</p>
                <p className="text-sm text-muted-foreground">Threat Detection</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="font-display text-3xl font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">Monitoring</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="font-display text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Clients Protected</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-80 h-80 rounded-full border border-primary/30"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 rounded-full border border-accent/30"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-8 rounded-full border border-primary/20"
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="glass-strong p-8 rounded-2xl glow-cyan">
                      <Shield className="w-20 h-20 text-primary" />
                    </div>
                  </div>

                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 glass p-4 rounded-xl"
                  >
                    <Lock className="w-6 h-6 text-primary" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-4 right-0 translate-x-4 glass p-4 rounded-xl"
                  >
                    <Eye className="w-6 h-6 text-accent" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
