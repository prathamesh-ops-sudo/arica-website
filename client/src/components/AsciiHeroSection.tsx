'use client';

import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function AsciiHeroSection() {
  const [barHeights] = useState(() => 
    Array.from({ length: 8 }).map(() => Math.random() * 12 + 4)
  );

  useEffect(() => {
    const embedScript = document.createElement('script');
    embedScript.type = 'text/javascript';
    embedScript.textContent = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head || document.body).appendChild(i)
        }
      }();
    `;
    document.head.appendChild(embedScript);

    const style = document.createElement('style');
    style.id = 'unicorn-hide-branding';
    style.textContent = `
      [data-us-project] {
        position: relative !important;
        overflow: hidden !important;
      }
      [data-us-project] canvas {
        clip-path: inset(0 0 10% 0) !important;
      }
      [data-us-project] * {
        pointer-events: none !important;
      }
      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] .unicorn-brand,
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `;
    document.head.appendChild(style);

    const hideBranding = () => {
      const containers = document.querySelectorAll('[data-us-project]');
      containers.forEach(container => {
        const allElements = container.querySelectorAll('*');
        allElements.forEach(el => {
          const text = ((el as HTMLElement).textContent || '').toLowerCase();
          const title = (el.getAttribute('title') || '').toLowerCase();
          const href = (el.getAttribute('href') || '').toLowerCase();
          
          if (
            text.includes('made with') || 
            text.includes('unicorn') ||
            title.includes('made with') ||
            title.includes('unicorn') ||
            href.includes('unicorn.studio')
          ) {
            (el as HTMLElement).style.display = 'none';
            (el as HTMLElement).style.visibility = 'hidden';
            try { el.remove(); } catch(e) {}
          }
        });
      });
    };

    hideBranding();
    const interval = setInterval(hideBranding, 100);
    
    setTimeout(hideBranding, 500);
    setTimeout(hideBranding, 1000);
    setTimeout(hideBranding, 2000);

    return () => {
      clearInterval(interval);
      try {
        document.head.removeChild(embedScript);
        const styleEl = document.getElementById('unicorn-hide-branding');
        if (styleEl) document.head.removeChild(styleEl);
      } catch(e) {}
    };
  }, []);

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] overflow-hidden bg-black">
      {/* Desktop: UnicornStudio animation */}
      <div className="absolute inset-0 w-full h-full hidden lg:block">
        <div 
          data-us-project="OMzqyUv6M3kSnv0JeAtC" 
          style={{ width: '100%', height: '100%', minHeight: '80vh' }}
        />
      </div>

      {/* Mobile/Tablet: Enhanced animated stars background */}
      <div className="absolute inset-0 w-full h-full lg:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 opacity-60" style={{
          backgroundImage: `
            radial-gradient(2px 2px at 10% 20%, hsl(185, 85%, 50%), transparent),
            radial-gradient(2px 2px at 25% 45%, white, transparent),
            radial-gradient(1px 1px at 40% 15%, white, transparent),
            radial-gradient(2px 2px at 55% 75%, hsl(185, 85%, 50%), transparent),
            radial-gradient(1px 1px at 70% 35%, white, transparent),
            radial-gradient(2px 2px at 85% 55%, white, transparent),
            radial-gradient(1px 1px at 15% 80%, hsl(185, 85%, 50%), transparent),
            radial-gradient(1px 1px at 95% 10%, white, transparent),
            radial-gradient(2px 2px at 50% 50%, hsl(185, 85%, 50%), transparent),
            radial-gradient(1px 1px at 30% 65%, white, transparent),
            radial-gradient(1px 1px at 75% 85%, white, transparent),
            radial-gradient(2px 2px at 5% 55%, white, transparent)
          `
        }} />
        {/* Mobile animated glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 border-t-2 border-l-2 border-primary/50 z-20" />
      <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 border-t-2 border-r-2 border-primary/50 z-20" />
      <div className="absolute bottom-12 sm:bottom-10 left-0 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 border-b-2 border-l-2 border-primary/50 z-20" />
      <div className="absolute bottom-12 sm:bottom-10 right-0 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 border-b-2 border-r-2 border-primary/50 z-20" />

      {/* Main content */}
      <div className="relative z-10 flex min-h-[70vh] md:min-h-[80vh] items-center py-16 pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-16 lg:w-1/2 lg:ml-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-lg mx-auto lg:mx-0"
          >
            {/* Top decorative line */}
            <div className="flex items-center gap-2 mb-4 opacity-60">
              <div className="w-6 sm:w-8 h-px bg-primary" />
              <span className="text-primary text-[10px] font-mono tracking-wider">∞</span>
              <div className="flex-1 h-px bg-primary" />
            </div>

            {/* Mobile badge */}
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono text-primary/80 tracking-wider">SECURITY PROTOCOL</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight font-display tracking-wide">
              ENDLESS <span className="text-primary">VIGILANCE</span>
            </h2>

            {/* Decorative dots - hidden on very small screens */}
            <div className="hidden sm:flex lg:flex gap-1 mb-3 sm:mb-4 opacity-40">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 bg-primary rounded-full" />
              ))}
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-5 sm:mb-6 leading-relaxed">
              In the realm of cybersecurity, there is no finish line. Every threat neutralized 
              reveals another. Every vulnerability patched exposes new attack vectors. 
              We embrace this eternal pursuit.
            </p>

            {/* Buttons - stack on mobile, row on larger */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/services" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-mono text-xs sm:text-sm group"
                >
                  BEGIN ASSESSMENT
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link href="/about" className="w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  className="w-full sm:w-auto border border-white/20 text-white hover:bg-white/10 font-mono text-xs sm:text-sm"
                >
                  OUR METHODOLOGY
                </Button>
              </Link>
            </div>

            {/* Bottom technical notation */}
            <div className="flex items-center gap-2 mt-6 sm:mt-8 opacity-40">
              <span className="text-primary text-[8px] sm:text-[9px] font-mono">∞</span>
              <div className="flex-1 h-px bg-primary/50" />
              <span className="text-primary text-[8px] sm:text-[9px] font-mono">ARICA.PROTOCOL</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom footer bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/20 bg-black/60 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 text-[7px] sm:text-[8px] lg:text-[9px] font-mono text-white/50">
            <span>SYS.ACTIVE</span>
            <div className="hidden sm:flex gap-0.5 sm:gap-1">
              {barHeights.map((height, i) => (
                <div 
                  key={i} 
                  className="w-0.5 sm:w-1 bg-primary/50" 
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
            <span>V2.4.7</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 text-[7px] sm:text-[8px] lg:text-[9px] font-mono text-white/50">
            <span className="hidden sm:inline animate-monitoring-pulse">∞ MONITORING</span>
            <div className="flex gap-0.5 sm:gap-1">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-1 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="hidden sm:inline">FRAME: <span className="inline-block animate-infinity-spin">∞</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}
