'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface ScrollExpansionHeroProps {
  title?: string;
  subtitle?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

export const ScrollExpansionHero = ({
  title = "ARICA SECURITY",
  subtitle = "Enterprise Cybersecurity Solutions",
  scrollToExpand = "Scroll to explore",
  children,
}: ScrollExpansionHeroProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0012;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 100 : 80);

  const firstWord = title.split(' ')[0];
  const restOfTitle = title.split(' ').slice(1).join(' ');

  return (
    <div
      ref={sectionRef}
      className='transition-colors duration-700 ease-in-out overflow-x-hidden bg-background'
    >
      <section className='relative flex flex-col items-center justify-start min-h-[100dvh]'>
        <div className='relative w-full flex flex-col items-center min-h-[100dvh]'>
          <motion.div
            className='absolute inset-0 z-0 h-full'
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 - scrollProgress * 1.2 }}
            transition={{ duration: 0.1 }}
          >
            <div className="w-full h-full relative">
              <Suspense fallback={
                <div className="w-full h-full bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              }>
                <Spline
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </Suspense>
              <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80' />
            </div>
          </motion.div>

          <div className='container mx-auto flex flex-col items-center justify-start relative z-10'>
            <div className='flex flex-col items-center justify-center w-full h-[100dvh] relative'>
              <motion.div
                className='absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none rounded-2xl overflow-hidden'
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: scrollProgress > 0.1 ? scrollProgress : 0 }}
              >
                <div className='relative w-full h-full bg-gradient-to-br from-card via-card/95 to-primary/10 border border-white/10 rounded-2xl p-8 flex flex-col justify-center items-center'>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 212, 255, 0.15) 1px, transparent 0)`,
                      backgroundSize: '30px 30px'
                    }} />
                  </div>
                  
                  <motion.div
                    className="relative z-10 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: scrollProgress > 0.5 ? 1 : 0, y: scrollProgress > 0.5 ? 0 : 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                      <span className="text-xs text-primary font-medium tracking-wider uppercase">
                        Cybersecurity Excellence
                      </span>
                    </span>
                    
                    <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold mb-4 text-halo-white">
                      Protecting Your
                      <span className="text-gradient block">Digital Future</span>
                    </h2>
                    
                    <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                      Enterprise-grade security assessments, compliance audits, and secure software development.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 justify-center">
                      <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
                        VAPT
                      </span>
                      <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm">
                        ISO 27001
                      </span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
                        Secure Dev
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <div className='flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col mix-blend-difference'>
                <motion.h2
                  className='text-5xl md:text-6xl lg:text-8xl font-bold text-halo-white font-display transition-none'
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className='text-5xl md:text-6xl lg:text-8xl font-bold text-center text-halo-white font-display transition-none'
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>

              <motion.div 
                className="absolute bottom-10 flex flex-col items-center gap-2"
                animate={{ opacity: scrollProgress < 0.3 ? 1 : 0 }}
              >
                <p className="text-primary text-sm font-medium">{scrollToExpand}</p>
                <motion.div
                  className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                </motion.div>
              </motion.div>
            </div>

            <motion.section
              className='flex flex-col w-full'
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpansionHero;
