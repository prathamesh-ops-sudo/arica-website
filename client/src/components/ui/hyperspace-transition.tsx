"use client";

import React, { useRef, useMemo, useEffect, useState, useCallback, createContext, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CYAN = '#00D4FF';
const PURPLE = '#9944ff';
const STAR_COUNT = 800;
const TRANSITION_DURATION = 800;

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
    
    const cyanColor = new THREE.Color(CYAN);
    const purpleColor = new THREE.Color(PURPLE);
    
    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 50 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = Math.random() * 100 - 150;
      
      const colorMix = Math.random();
      const mixedColor = cyanColor.clone().lerp(purpleColor, colorMix);
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
        uniform float uProgress;
        uniform float uTime;
        
        void main() {
          vColor = customColor;
          vProgress = uProgress;
          
          vec3 pos = position;
          float stretchFactor = 1.0 + uProgress * 50.0;
          pos.z += uProgress * 200.0 * (1.0 + sin(uTime + position.x) * 0.2);
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + uProgress * 3.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vProgress;
        uniform float uOpacity;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          
          float stretchY = abs(gl_PointCoord.y - 0.5);
          float stretchX = abs(gl_PointCoord.x - 0.5);
          float streak = smoothstep(0.5, 0.0, stretchX) * smoothstep(0.5 * (1.0 - vProgress * 0.8), 0.0, stretchY);
          
          float circle = 1.0 - smoothstep(0.0, 0.5, dist);
          float shape = mix(circle, streak, vProgress);
          
          vec3 glowColor = vColor * (1.0 + vProgress * 2.0);
          float alpha = shape * uOpacity;
          
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(glowColor, alpha);
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
  const callbackRef = useRef<(() => void) | undefined>(undefined);
  const animationRef = useRef<number | undefined>(undefined);

  const triggerTransition = useCallback((callback?: () => void) => {
    if (isTransitioning) return;
    
    callbackRef.current = callback;
    setIsTransitioning(true);
    
    const startTime = performance.now();
    const halfDuration = TRANSITION_DURATION / 2;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const normalizedTime = Math.min(elapsed / TRANSITION_DURATION, 1);
      
      const easedProgress = normalizedTime < 0.5
        ? 4 * normalizedTime * normalizedTime * normalizedTime
        : 1 - Math.pow(-2 * normalizedTime + 2, 3) / 2;
      
      setProgress(easedProgress);
      
      if (elapsed < halfDuration) {
        setOpacity(Math.min(elapsed / (halfDuration * 0.3), 1));
      } else {
        const fadeOutProgress = (elapsed - halfDuration) / halfDuration;
        setOpacity(1 - fadeOutProgress);
      }
      
      if (elapsed >= halfDuration && elapsed < halfDuration + 50 && callbackRef.current) {
        callbackRef.current();
        callbackRef.current = undefined;
      }
      
      if (elapsed < TRANSITION_DURATION) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsTransitioning(false);
        setProgress(0);
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
      )}
    </HyperspaceContext.Provider>
  );
}

export { HyperspaceContext };
