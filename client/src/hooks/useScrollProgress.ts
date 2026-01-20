import { useState, useEffect, useCallback, useRef } from 'react';

interface ScrollProgressOptions {
  elementRef?: React.RefObject<HTMLElement>;
}

export function useScrollProgress(options: ScrollProgressOptions = {}) {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const element = options.elementRef?.current;
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementHeight = element.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY - elementTop;
        const newProgress = Math.max(0, Math.min(1, scrolled / elementHeight));
        setProgress(newProgress);
        setScrollY(window.scrollY);
      } else {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const newProgress = docHeight > 0 ? Math.max(0, Math.min(1, scrolled / docHeight)) : 0;
        setProgress(newProgress);
        setScrollY(scrolled);
      }
    });
  }, [options.elementRef]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  return { progress, scrollY };
}

export default useScrollProgress;
