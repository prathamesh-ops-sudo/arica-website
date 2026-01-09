'use client';

import { useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function AsciiHeroSection() {
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
    <section className="relative min-h-[80vh] overflow-hidden bg-black">
      <div className="absolute inset-0 w-full h-full hidden lg:block">
        <div 
          data-us-project="OMzqyUv6M3kSnv0JeAtC" 
          style={{ width: '100%', height: '100%', minHeight: '80vh' }}
        />
      </div>

      <div className="absolute inset-0 w-full h-full lg:hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20% 30%, white, transparent),
            radial-gradient(1px 1px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(1px 1px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent),
            radial-gradient(1px 1px at 15% 60%, white, transparent),
            radial-gradient(1px 1px at 70% 40%, white, transparent)
          `,
          opacity: 0.6
        }} />
      </div>

      <div className="absolute top-0 left-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-l-2 border-primary/50 z-20" />
      <div className="absolute top-0 right-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-r-2 border-primary/50 z-20" />
      <div className="absolute bottom-0 left-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-l-2 border-primary/50 z-20" />
      <div className="absolute bottom-0 right-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-r-2 border-primary/50 z-20" />

      <div className="relative z-10 flex min-h-[80vh] items-center">
        <div className="w-full lg:w-1/2 px-6 lg:px-16 lg:ml-auto">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-4 opacity-60">
              <div className="w-8 h-px bg-primary" />
              <span className="text-primary text-[10px] font-mono tracking-wider">∞</span>
              <div className="flex-1 h-px bg-primary" />
            </div>

            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight font-display tracking-wider">
              ENDLESS <span className="text-primary">VIGILANCE</span>
            </h2>

            <div className="hidden lg:flex gap-1 mb-4 opacity-40">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 bg-primary rounded-full" />
              ))}
            </div>

            <p className="text-base lg:text-lg text-muted-foreground mb-6 leading-relaxed">
              In the realm of cybersecurity, there is no finish line. Every threat neutralized 
              reveals another. Every vulnerability patched exposes new attack vectors. 
              We embrace this eternal pursuit.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Link href="/services">
                <Button 
                  variant="outline" 
                  className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-mono text-sm group"
                >
                  BEGIN THE ASSESSMENT
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link href="/about">
                <Button 
                  variant="ghost" 
                  className="border border-white/20 text-white hover:bg-white/10 font-mono text-sm"
                >
                  OUR METHODOLOGY
                </Button>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-2 mt-8 opacity-40">
              <span className="text-primary text-[9px] font-mono">∞</span>
              <div className="flex-1 h-px bg-primary/50" />
              <span className="text-primary text-[9px] font-mono">ARICA.PROTOCOL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/20 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8 py-2 lg:py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-6 text-[8px] lg:text-[9px] font-mono text-white/50">
            <span className="hidden lg:inline">SYSTEM.ACTIVE</span>
            <span className="lg:hidden">SYS.ACT</span>
            <div className="hidden lg:flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-primary/50" 
                  style={{ height: `${Math.random() * 12 + 4}px` }}
                />
              ))}
            </div>
            <span>V2.4.7</span>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4 text-[8px] lg:text-[9px] font-mono text-white/50">
            <span className="hidden lg:inline">◐ MONITORING</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-1 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="hidden lg:inline">FRAME: ∞</span>
          </div>
        </div>
      </div>
    </section>
  );
}
