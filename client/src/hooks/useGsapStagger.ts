import { useEffect, useRef, RefObject } from 'react';
import gsap from 'gsap';

export function useGsapStagger(containerRef: RefObject<HTMLElement | null>) {
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!containerRef.current || hasAnimated.current) return;

    const container = containerRef.current;
    const elements = container.querySelectorAll('.gsap-fade-in');
    
    if (elements.length === 0) return;

    gsap.set(elements, { opacity: 0, y: 30 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            
            gsap.to(elements, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
            });

            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);
}
