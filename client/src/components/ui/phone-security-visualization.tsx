"use client";

import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const CYAN = '#00D4FF';
const PURPLE = '#9944ff';
const THREAT_RED = '#ff3344';

interface PhoneProps {
  isScanning: boolean;
  mousePosition: { x: number; y: number };
}

function PhoneModel({ isScanning, mousePosition }: PhoneProps) {
  const phoneRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const screenMaterialRef = useRef<THREE.ShaderMaterial>(null);
  
  const screenShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      isScanning: { value: isScanning ? 1.0 : 0.0 },
      color1: { value: new THREE.Color(CYAN) },
      color2: { value: new THREE.Color(PURPLE) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float isScanning;
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      void main() {
        vec2 uv = vUv;
        
        float scanLine = step(0.98, sin(uv.y * 100.0 - time * 10.0));
        float scanWave = sin(uv.y * 20.0 - time * 5.0) * 0.5 + 0.5;
        
        float grid = step(0.95, sin(uv.x * 30.0)) + step(0.95, sin(uv.y * 50.0));
        grid *= 0.3;
        
        float noise = random(uv + time * 0.1) * 0.1;
        
        float pulse = sin(time * 3.0) * 0.3 + 0.7;
        
        vec3 baseColor = mix(color1, color2, uv.y);
        
        float scanProgress = fract(time * 0.5);
        float scanBar = smoothstep(scanProgress - 0.1, scanProgress, uv.y) - 
                        smoothstep(scanProgress, scanProgress + 0.02, uv.y);
        scanBar *= isScanning;
        
        vec3 finalColor = baseColor * 0.3;
        finalColor += baseColor * grid;
        finalColor += baseColor * scanLine * 0.5 * isScanning;
        finalColor += vec3(1.0) * scanBar * 0.8;
        finalColor += baseColor * noise;
        finalColor *= pulse * isScanning + (1.0 - isScanning) * 0.5;
        
        float alpha = 0.9;
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  }), []);

  useFrame((state) => {
    if (phoneRef.current) {
      const targetRotY = mousePosition.x * 0.3;
      const targetRotX = -mousePosition.y * 0.2;
      
      phoneRef.current.rotation.y += (targetRotY - phoneRef.current.rotation.y) * 0.05;
      phoneRef.current.rotation.x += (targetRotX - phoneRef.current.rotation.x) * 0.05;
      phoneRef.current.rotation.y += 0.003;
    }
    
    if (screenMaterialRef.current) {
      screenMaterialRef.current.uniforms.time.value = state.clock.elapsedTime;
      screenMaterialRef.current.uniforms.isScanning.value = isScanning ? 1.0 : 0.0;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <group ref={phoneRef} position={[0, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 2.4, 0.1]} />
          <meshStandardMaterial 
            color="#1a1a2e"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        <mesh position={[0, 0.1, 0.051]} ref={screenRef}>
          <planeGeometry args={[1.05, 2.0]} />
          <shaderMaterial
            ref={screenMaterialRef}
            {...screenShader}
            transparent
          />
        </mesh>
        
        <mesh position={[0, 1.05, 0.051]}>
          <circleGeometry args={[0.05, 32]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        
        <mesh position={[0, -1.0, 0.051]}>
          <ringGeometry args={[0.08, 0.12, 32]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.5} />
        </mesh>
        
        <mesh position={[0.45, 0, 0.051]}>
          <boxGeometry args={[0.02, 0.15, 0.01]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        <mesh position={[0.45, 0.25, 0.051]}>
          <boxGeometry args={[0.02, 0.08, 0.01]} />
          <meshBasicMaterial color="#333" />
        </mesh>
      </group>
    </Float>
  );
}

interface ShieldEffectProps {
  active: boolean;
  flash: boolean;
}

function ShieldEffect({ active, flash }: ShieldEffectProps) {
  const shieldRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const shieldShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      active: { value: 0 },
      flash: { value: 0 },
      color: { value: new THREE.Color(CYAN) },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float active;
      uniform float flash;
      uniform vec3 color;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
        
        float hex = sin(vPosition.x * 10.0 + vPosition.y * 10.0 + time * 2.0) * 0.5 + 0.5;
        
        float pulse = sin(time * 4.0) * 0.2 + 0.8;
        
        vec3 finalColor = color * (fresnel * 0.8 + hex * 0.2);
        finalColor += vec3(1.0) * flash * 2.0;
        
        float alpha = (fresnel * 0.6 + 0.1) * active * pulse;
        alpha = max(alpha, flash * 0.8);
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  }), []);

  useFrame((state) => {
    if (shieldRef.current) {
      shieldRef.current.rotation.y += 0.01;
      shieldRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.active.value += (active ? 1 : 0 - materialRef.current.uniforms.active.value) * 0.1;
      materialRef.current.uniforms.flash.value += (flash ? 1 : 0 - materialRef.current.uniforms.flash.value) * 0.2;
    }
  });

  return (
    <mesh ref={shieldRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        {...shieldShader}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

interface OrbitingParticlesProps {
  count?: number;
}

function OrbitingParticles({ count = 100 }: OrbitingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, angles, radii, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ang = new Float32Array(count);
    const rad = new Float32Array(count);
    const spd = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      ang[i] = Math.random() * Math.PI * 2;
      rad[i] = 2.5 + Math.random() * 2;
      spd[i] = (0.5 + Math.random()) * (Math.random() > 0.5 ? 1 : -1);
      
      const height = (Math.random() - 0.5) * 3;
      pos[i * 3] = Math.cos(ang[i]) * rad[i];
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(ang[i]) * rad[i];
    }
    
    return [pos, ang, rad, spd];
  }, [count]);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const cyan = new THREE.Color(CYAN);
    const purple = new THREE.Color(PURPLE);
    
    for (let i = 0; i < count; i++) {
      const mix = Math.random();
      const color = cyan.clone().lerp(purple, mix);
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return cols;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < count; i++) {
        const currentAngle = angles[i] + time * speeds[i] * 0.3;
        const wobble = Math.sin(time * 2 + i) * 0.2;
        
        pos[i * 3] = Math.cos(currentAngle) * (radii[i] + wobble);
        pos[i * 3 + 2] = Math.sin(currentAngle) * (radii[i] + wobble);
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

interface ThreatParticle {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  active: boolean;
}

interface ThreatParticlesProps {
  onThreatBlocked: () => void;
  shieldActive: boolean;
}

function ThreatParticles({ onThreatBlocked, shieldActive }: ThreatParticlesProps) {
  const [threats, setThreats] = useState<ThreatParticle[]>([]);
  const threatIdRef = useRef(0);
  
  useEffect(() => {
    if (!shieldActive) return;
    
    const spawnThreat = () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 8;
      const startPos = new THREE.Vector3(
        Math.cos(angle) * distance,
        (Math.random() - 0.5) * 4,
        Math.sin(angle) * distance
      );
      
      const direction = startPos.clone().negate().normalize();
      const speed = 0.08 + Math.random() * 0.04;
      
      const newThreat: ThreatParticle = {
        id: threatIdRef.current++,
        position: startPos,
        velocity: direction.multiplyScalar(speed),
        active: true,
      };
      
      setThreats(prev => [...prev, newThreat]);
    };
    
    const interval = setInterval(spawnThreat, 800 + Math.random() * 1200);
    return () => clearInterval(interval);
  }, [shieldActive]);

  useFrame(() => {
    setThreats(prev => {
      const updated = prev.map(threat => {
        if (!threat.active) return threat;
        
        const newPos = threat.position.clone().add(threat.velocity);
        
        if (newPos.length() < 2.2 && shieldActive) {
          onThreatBlocked();
          return { ...threat, active: false };
        }
        
        if (newPos.length() > 10 || newPos.length() < 0.5) {
          return { ...threat, active: false };
        }
        
        return { ...threat, position: newPos };
      });
      
      return updated.filter(t => t.active || Date.now() % 1000 < 500);
    });
  });

  return (
    <>
      {threats.filter(t => t.active).map(threat => (
        <mesh key={threat.id} position={threat.position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial 
            color={THREAT_RED}
            transparent
            opacity={0.9}
          />
          <pointLight color={THREAT_RED} intensity={0.5} distance={2} />
        </mesh>
      ))}
    </>
  );
}

interface SceneProps {
  isScanning: boolean;
  mousePosition: { x: number; y: number };
  onThreatBlocked: () => void;
  shieldFlash: boolean;
}

function Scene({ isScanning, mousePosition, onThreatBlocked, shieldFlash }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color={CYAN} />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color={PURPLE} />
      <spotLight
        position={[0, 5, 5]}
        angle={0.5}
        penumbra={1}
        intensity={0.5}
        color={CYAN}
      />
      
      <PhoneModel isScanning={isScanning} mousePosition={mousePosition} />
      <ShieldEffect active={isScanning} flash={shieldFlash} />
      <OrbitingParticles count={80} />
      
      {isScanning && (
        <ThreatParticles 
          onThreatBlocked={onThreatBlocked} 
          shieldActive={isScanning}
        />
      )}
    </>
  );
}

interface PhoneSecurityVisualizationProps {
  isScanning: boolean;
  threatsBlocked: number;
  onThreatBlocked: () => void;
}

export function PhoneSecurityVisualization({ 
  isScanning, 
  threatsBlocked,
  onThreatBlocked 
}: PhoneSecurityVisualizationProps) {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shieldFlash, setShieldFlash] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePosition({ x, y });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleThreatBlocked = useCallback(() => {
    setShieldFlash(true);
    onThreatBlocked();
    setTimeout(() => setShieldFlash(false), 150);
  }, [onThreatBlocked]);

  if (!mounted) {
    return (
      <div 
        className="relative w-full h-[400px] rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'rgba(0, 5, 16, 0.8)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] rounded-2xl overflow-hidden border"
      style={{ 
        backgroundColor: 'rgba(0, 5, 16, 0.9)',
        borderColor: 'rgba(0, 212, 255, 0.2)'
      }}
      data-testid="phone-security-visualization"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Scene 
          isScanning={isScanning} 
          mousePosition={mousePosition}
          onThreatBlocked={handleThreatBlocked}
          shieldFlash={shieldFlash}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div 
          className="px-4 py-2 rounded-lg backdrop-blur-xl border"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderColor: 'rgba(0, 212, 255, 0.3)'
          }}
        >
          <div className="flex items-center gap-2">
            <div 
              className={`w-2 h-2 rounded-full ${isScanning ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: isScanning ? CYAN : '#666' }}
            />
            <span className="text-sm text-white/80">
              {isScanning ? 'Shield Active' : 'Shield Standby'}
            </span>
          </div>
        </div>
        
        <div 
          className="px-4 py-2 rounded-lg backdrop-blur-xl border"
          style={{ 
            backgroundColor: shieldFlash ? 'rgba(0, 212, 255, 0.2)' : 'rgba(0, 0, 0, 0.6)',
            borderColor: threatsBlocked > 0 ? 'rgba(255, 51, 68, 0.5)' : 'rgba(0, 212, 255, 0.3)',
            transition: 'all 0.15s ease'
          }}
        >
          <div className="flex items-center gap-2">
            <svg 
              className="w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke={THREAT_RED}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <span className="text-sm font-medium" style={{ color: THREAT_RED }}>
              {threatsBlocked} Threats Blocked
            </span>
          </div>
        </div>
      </div>
      
      <div 
        className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-xl border"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderColor: 'rgba(0, 212, 255, 0.3)'
        }}
      >
        <span className="text-sm font-medium" style={{ color: CYAN }}>
          3D Security Visualization
        </span>
      </div>
    </div>
  );
}

export default PhoneSecurityVisualization;
