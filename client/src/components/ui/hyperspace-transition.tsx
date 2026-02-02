"use client";

import React, { useRef, useMemo, useEffect, useState, useCallback, createContext, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isWebGLAvailable } from '@/lib/webgl-utils';

const BLUE_ACCENT = '#3A0CA3';
const PURPLE_ACCENT = '#9D4EDD';
const STAR_COUNT = 1200;
const TRANSITION_DURATION = 1200;

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

interface StarFieldProps {
  progress: number;
  opacity: number;
}

function StarField({ progress, opacity }: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const velocities = new Float32Array(STAR_COUNT);
    
    const blueColor = new THREE.Color(BLUE_ACCENT);
    const purpleColor = new THREE.Color(PURPLE_ACCENT);
    
    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 50 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = Math.random() * 100 - 150;
      
      const colorMix = Math.random();
      const mixedColor = blueColor.clone().lerp(purpleColor, colorMix);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      
      sizes[i] = Math.random() * 3 + 1;
      velocities[i] = Math.random() * 0.5 + 0.5;
    }
    
    velocitiesRef.current = velocities;
    return { positions, colors, sizes };
  }, []);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0 },
        uOpacity: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        varying float vProgress;
        varying float vDepth;
        uniform float uProgress;
        uniform float uTime;
        
        void main() {
          vColor = customColor;
          vProgress = uProgress;
          
          vec3 pos = position;
          
          // More dramatic warp effect - stars stretch toward center
          float warpIntensity = uProgress * uProgress * 300.0;
          pos.z += warpIntensity * (1.0 + sin(uTime * 2.0 + position.x * 0.1) * 0.3);
          
          // Pull stars toward center as they warp
          float pullFactor = uProgress * uProgress * 0.3;
          pos.x *= (1.0 - pullFactor);
          pos.y *= (1.0 - pullFactor);
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vDepth = -mvPosition.z;
          
          // Stars get larger as they pass by
          float sizeMult = 1.0 + uProgress * 5.0;
          gl_PointSize = size * (400.0 / -mvPosition.z) * sizeMult;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vProgress;
        varying float vDepth;
        uniform float uOpacity;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          // Create dramatic streak effect
          float stretchAmount = vProgress * vProgress;
          float streakLength = 0.5 - stretchAmount * 0.4;
          float stretchY = abs(center.y);
          float stretchX = abs(center.x);
          
          // Elongated star streak toward center of screen
          float streak = smoothstep(0.5, 0.0, stretchX * (1.0 - stretchAmount * 0.7)) * 
                         smoothstep(streakLength, 0.0, stretchY);
          
          float circle = 1.0 - smoothstep(0.0, 0.5, dist);
          float shape = mix(circle, streak, stretchAmount);
          
          // Intensify glow during warp
          vec3 glowColor = vColor * (1.0 + vProgress * 4.0);
          
          // Add white core during peak
          vec3 coreColor = mix(glowColor, vec3(1.0), vProgress * vProgress * 0.5);
          
          float alpha = shape * uOpacity * (1.0 + vProgress);
          
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(coreColor, min(alpha, 1.0));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (pointsRef.current && shaderMaterial) {
      shaderMaterial.uniforms.uProgress.value = progress;
      shaderMaterial.uniforms.uOpacity.value = opacity;
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
      
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = velocitiesRef.current!;
      
      for (let i = 0; i < STAR_COUNT; i++) {
        const i3 = i * 3;
        positions[i3 + 2] += (5 + progress * 50) * velocities[i];
        
        if (positions[i3 + 2] > 50) {
          positions[i3 + 2] = -150;
          const radius = Math.random() * 50 + 5;
          const theta = Math.random() * Math.PI * 2;
          positions[i3] = radius * Math.cos(theta);
          positions[i3 + 1] = radius * Math.sin(theta);
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-customColor"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
    </points>
  );
}

function HyperspaceScene({ progress, opacity }: { progress: number; opacity: number }) {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <StarField progress={progress} opacity={opacity} />
    </>
  );
}

interface HyperspaceTransitionProps {
  children: React.ReactNode;
}

export function HyperspaceTransitionProvider({ children }: HyperspaceTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const callbackRef = useRef<(() => void) | undefined>(undefined);
  const animationRef = useRef<number | undefined>(undefined);

  const triggerTransition = useCallback((callback?: () => void) => {
    if (isTransitioning) return;
    
    callbackRef.current = callback;
    setIsTransitioning(true);
    
    const startTime = performance.now();
    const rampUp = TRANSITION_DURATION * 0.4;
    const peak = TRANSITION_DURATION * 0.2;
    const rampDown = TRANSITION_DURATION * 0.4;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const normalizedTime = Math.min(elapsed / TRANSITION_DURATION, 1);
      
      // Smoother easing with more dramatic acceleration
      const easedProgress = normalizedTime < 0.5
        ? 8 * normalizedTime * normalizedTime * normalizedTime * normalizedTime
        : 1 - Math.pow(-2 * normalizedTime + 2, 4) / 2;
      
      setProgress(easedProgress);
      
      // Opacity ramp up, hold, then fade out
      if (elapsed < rampUp) {
        setOpacity(Math.min(elapsed / (rampUp * 0.5), 1));
        setFlashOpacity(0);
      } else if (elapsed < rampUp + peak) {
        setOpacity(1);
        // Flash at peak
        const peakProgress = (elapsed - rampUp) / peak;
        setFlashOpacity(Math.sin(peakProgress * Math.PI) * 0.7);
      } else {
        const fadeOutProgress = (elapsed - rampUp - peak) / rampDown;
        setOpacity(1 - fadeOutProgress);
        setFlashOpacity(Math.max(0, 0.7 - fadeOutProgress * 2));
      }
      
      // Trigger callback at peak
      if (elapsed >= rampUp + peak * 0.5 && elapsed < rampUp + peak * 0.5 + 50 && callbackRef.current) {
        callbackRef.current();
        callbackRef.current = undefined;
      }
      
      if (elapsed < TRANSITION_DURATION) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsTransitioning(false);
        setProgress(0);
        setOpacity(0);
        setFlashOpacity(0);
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
      {isTransitioning && isWebGLAvailable() && (
        <>
          <div
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 9999 }}
            data-testid="hyperspace-overlay"
          >
            <Canvas
              camera={{ position: [0, 0, 30], fov: 75 }}
              style={{ background: 'transparent' }}
              gl={{ alpha: true, antialias: true }}
            >
              <HyperspaceScene progress={progress} opacity={opacity} />
            </Canvas>
          </div>
          {/* Flash overlay at peak */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 10000,
              background: `radial-gradient(ellipse at center, rgba(157, 78, 221, ${flashOpacity}) 0%, rgba(58, 12, 163, ${flashOpacity * 0.5}) 50%, transparent 100%)`,
              mixBlendMode: 'screen',
            }}
          />
        </>
      )}
    </HyperspaceContext.Provider>
  );
}

export { HyperspaceContext };
