'use client';

import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Eye, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function AsciiHeroSection() {
  const stats = [
    { value: "99.9%", label: "Uptime Monitoring" },
    { value: "24/7", label: "Threat Detection" },
    { value: "<1min", label: "Response Time" },
    { value: "500+", label: "Enterprises Protected" },
  ];

  const features = [
    { icon: Eye, title: "Real-time Monitoring", desc: "Continuous surveillance of your digital assets" },
    { icon: Lock, title: "Zero Trust Security", desc: "Never trust, always verify approach" },
    { icon: Zap, title: "Instant Response", desc: "Automated threat neutralization" },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[#121212]">
      {/* Subtle gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#1c1c1e] to-[#121212]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3A0CA3]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9D4EDD]/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Main content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#7B2FE0]/10 border border-[#7B2FE0]/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#7B2FE0]" />
              </div>
              <span className="text-[#8e8e93] text-sm tracking-widest uppercase">Security Excellence</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Endless
              <span className="block bg-gradient-to-r from-[#7B2FE0] to-[#9D4EDD] bg-clip-text text-transparent">
                Vigilance
              </span>
            </h2>

            <p className="text-lg text-[#8e8e93] mb-8 leading-relaxed max-w-lg">
              In cybersecurity, there is no finish line. Every threat neutralized reveals another. 
              Every vulnerability patched exposes new attack vectors. We embrace this eternal pursuit.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/services">
                <Button className="bg-[#7B2FE0] hover:bg-[#7B2FE0]/90 text-white px-8 py-6 rounded-xl text-base group">
                  Begin Assessment
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link href="/about">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-xl text-base">
                  Our Methodology
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center sm:text-left"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-[#8e8e93]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Feature cards */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#7B2FE0]/30 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7B2FE0]/20 to-[#9D4EDD]/20 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-[#7B2FE0]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#7B2FE0] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[#8e8e93] text-sm">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Decorative element */}
            <div className="relative h-32 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3A0CA3]/20 via-[#9D4EDD]/20 to-[#3A0CA3]/20 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#7B2FE0] to-[#9D4EDD] bg-clip-text text-transparent">
                    ∞
                  </div>
                  <div className="text-xs text-[#8e8e93] mt-1 tracking-widest">CONTINUOUS PROTECTION</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
