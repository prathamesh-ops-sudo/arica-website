'use client';

import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Eye, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingCyberThreats } from '@/components/FloatingCyberThreats';
import { COMPANY_STATS } from '@/content/company-stats';

export function AsciiHeroSection() {
  const stats = [
    { value: "LAB", label: "Security Demonstrations" },
    ...COMPANY_STATS.map(({ value, suffix, label }) => ({
      value: `${value}${suffix}`,
      label,
    })),
  ];

  const features = [
    { icon: Eye, title: "Security Monitoring", desc: "Continuous oversight of your digital assets" },
    { icon: Lock, title: "Zero Trust Security", desc: "Never trust, always verify approach" },
    { icon: Zap, title: "Response Planning", desc: "Practical workflows for handling threats" },
  ];

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden bg-background">
      {/* Subtle gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1C2C5A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3D70B7]/10 rounded-full blur-3xl" />
      </div>
      <FloatingCyberThreats variant="red" density="medium" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        {/* Side-by-side: heading left, description right */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
          {/* Heading on the left */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#42BA90]/10 border border-[#42BA90]/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#42BA90]" />
              </div>
              <span className="text-[#ACACAC] text-sm tracking-widest uppercase">Security Excellence</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Endless
              <span className="block" style={{ color: '#3D70B7' }}>
                Vigilance
              </span>
            </h2>
          </motion.div>

          {/* Description and CTAs on the right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-[#ACACAC] mb-8 leading-relaxed">
              In cybersecurity, there is no finish line. Every threat neutralized reveals another. 
              Every vulnerability patched exposes new attack vectors. We embrace this eternal pursuit.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/services">
                <Button className="bg-[#42BA90] hover:bg-[#42BA90]/90 text-white px-8 py-6 rounded-xl text-base group">
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
          </motion.div>
        </div>

        {/* Stats row - centered */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-[#ACACAC]">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Feature cards - centered grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#42BA90]/30 hover:bg-white/10 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#42BA90]/20 to-[#3D70B7]/20 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-[#42BA90]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#42BA90] transition-colors">
                {feature.title}
              </h3>
              <p className="text-[#ACACAC] text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
