"use client";

import React, { useRef, useEffect, useState, useCallback, createContext, useContext, useMemo } from 'react';
import { ThreeDEffectLoader } from '@/components/ui/3d-effect-loader';

const TRANSITION_DURATION = 1800;

interface HyperspaceContextType {
  triggerTransition: (callback?: () => void) => void;
  isTransitioning: boolean;
}

const HyperspaceContext = createContext<HyperspaceContextType>({
  triggerTransition: () => {},
  isTransitioning: false,
});

export function useHyperspaceTransition() {
  return useContext(HyperspaceContext);
}

interface HyperspaceTransitionProps {
  children: React.ReactNode;
}

export function HyperspaceTransitionProvider({ children }: HyperspaceTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const callbackRef = useRef<(() => void) | undefined>(undefined);
  const animationRef = useRef<number | undefined>(undefined);

  const triggerTransition = useCallback((callback?: () => void) => {
    if (isTransitioning) return;
    
    callbackRef.current = callback;
    setIsTransitioning(true);
    
    const startTime = performance.now();
    const rampUp = TRANSITION_DURATION * 0.3;
    const peak = TRANSITION_DURATION * 0.4;
    const rampDown = TRANSITION_DURATION * 0.3;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      
      if (elapsed < rampUp) {
        setOpacity(Math.min(elapsed / (rampUp * 0.5), 1));
      } else if (elapsed < rampUp + peak) {
        setOpacity(1);
      } else {
        const fadeOutProgress = (elapsed - rampUp - peak) / rampDown;
        setOpacity(1 - fadeOutProgress);
      }
      
      if (elapsed >= rampUp + peak * 0.5 && elapsed < rampUp + peak * 0.5 + 50 && callbackRef.current) {
        callbackRef.current();
        callbackRef.current = undefined;
      }
      
      if (elapsed < TRANSITION_DURATION) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsTransitioning(false);
        setOpacity(0);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [isTransitioning]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const contextValue = useMemo(() => ({
    triggerTransition,
    isTransitioning,
  }), [triggerTransition, isTransitioning]);

  return (
    <HyperspaceContext.Provider value={contextValue}>
      {children}
      {isTransitioning && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm pointer-events-none"
          style={{ 
            zIndex: 9999,
            opacity: opacity,
            transition: 'opacity 0.2s ease-out',
          }}
          data-testid="hyperspace-overlay"
        >
          <ThreeDEffectLoader text="Loading…" />
        </div>
      )}
    </HyperspaceContext.Provider>
  );
}

export { HyperspaceContext };
