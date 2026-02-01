"use client";

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { WebGLFallback } from '@/components/ui/webgl-fallback';

const NEUTRAL_LIGHT = '#e5e5e5';
const NEUTRAL_MID = '#8e8e93';
const NEUTRAL_DARK = '#3a3a3c';
const ACCENT_BLUE = '#7B2FE0';

function CyberGrid() {
  const gridRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const gridShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(NEUTRAL_MID) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Offset grid by 1.0 to avoid center line at X=0/Z=0
        vec2 offsetPos = vPosition.xz + vec2(1.0, 1.0);
        vec2 grid = abs(fract(offsetPos * 0.5) - 0.5) / fwidth(offsetPos * 0.5);
        float line = min(grid.x, grid.y);
        float gridLine = 1.0 - min(line, 1.0);
        
        float pulse = sin(time * 2.0 - length(vPosition.xz) * 0.3) * 0.5 + 0.5;
        float fadeOut = 1.0 - smoothstep(0.0, 50.0, length(vPosition.xz));
        
        float alpha = gridLine * fadeOut * (0.3 + pulse * 0.4);
        vec3 finalColor = color * (1.0 + pulse * 0.5);
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <mesh>
        <planeGeometry args={[200, 200, 100, 100]} />
        <shaderMaterial
          ref={materialRef}
          {...gridShader}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function SecurityShield({ position, rotation, scale = 1 }: { position: [number, number, number]; rotation?: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const shieldShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color(NEUTRAL_LIGHT) },
      color2: { value: new THREE.Color(NEUTRAL_DARK) },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
        float pulse = sin(time * 3.0 + vPosition.y * 2.0) * 0.5 + 0.5;
        
        vec3 color = mix(color1, color2, vUv.y + pulse * 0.3);
        float alpha = fresnel * 0.8 + 0.2;
        
        float hexPattern = step(0.5, fract(vUv.x * 10.0 + vUv.y * 5.0 + time * 0.5));
        color += vec3(hexPattern * 0.2);
        
        gl_FragColor = vec4(color, alpha * 0.7);
      }
    `,
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <shaderMaterial
          ref={materialRef}
          {...shieldShader}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Float>
  );
}

function DataParticles({ count = 500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return [pos, vel];
  }, [count]);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const neutralLight = new THREE.Color(NEUTRAL_LIGHT);
    const accentBlue = new THREE.Color(ACCENT_BLUE);
    
    for (let i = 0; i < count; i++) {
      const mix = Math.random();
      const color = neutralLight.clone().lerp(accentBlue, mix);
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return cols;
  }, [count]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * 0.5 + 0.1;
    }
    return s;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        pos[i * 3] += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        pos[i * 3 + 2] += velocities[i * 3 + 2];
        
        if (Math.abs(pos[i * 3]) > 30) velocities[i * 3] *= -1;
        if (Math.abs(pos[i * 3 + 1]) > 20) velocities[i * 3 + 1] *= -1;
        if (Math.abs(pos[i * 3 + 2]) > 30) velocities[i * 3 + 2] *= -1;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SecurityRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const ringShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color(NEUTRAL_LIGHT) },
      color2: { value: new THREE.Color(NEUTRAL_DARK) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        float angle = atan(vPosition.y, vPosition.x);
        float pulse = sin(angle * 8.0 - time * 4.0) * 0.5 + 0.5;
        float glow = sin(time * 2.0) * 0.3 + 0.7;
        
        vec3 color = mix(color1, color2, pulse);
        float alpha = (0.5 + pulse * 0.5) * glow;
        
        float scanLine = step(0.98, sin(angle * 20.0 + time * 10.0));
        color += vec3(scanLine * 0.5);
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
  }), []);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.003;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -10]}>
      <torusGeometry args={[12, 0.3, 16, 100]} />
      <shaderMaterial
        ref={materialRef}
        {...ringShader}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function InnerRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z -= 0.005;
      ringRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -10]}>
      <torusGeometry args={[8, 0.15, 16, 80]} />
      <meshBasicMaterial 
        color={NEUTRAL_DARK}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function ScrollCamera() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 5, z: 30, rotY: 0 });
  
  useEffect(() => {
    const handleScroll = () => {
      const t = document.body.getBoundingClientRect().top;
      targetRef.current.z = 30 + t * -0.01;
      targetRef.current.x = t * -0.002;
      targetRef.current.rotY = t * -0.0002;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame(() => {
    const target = targetRef.current;
    const mouse = mouseRef.current;
    
    camera.position.x += (target.x + mouse.x * 3 - camera.position.x) * 0.05;
    camera.position.y += (target.y + mouse.y * 2 - camera.position.y) * 0.05;
    camera.position.z += (target.z - camera.position.z) * 0.05;
    camera.rotation.y += (target.rotY - camera.rotation.y) * 0.05;
    
    camera.lookAt(0, 0, -10);
  });

  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color={NEUTRAL_LIGHT} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color={NEUTRAL_DARK} />
      
      <ScrollCamera />
      <CyberGrid />
      
      <SecurityShield position={[-8, 3, -5]} scale={1.5} />
      <SecurityShield position={[10, -2, -8]} scale={1.2} />
      <SecurityShield position={[5, 5, -15]} scale={1.8} />
      <SecurityShield position={[-6, -3, -12]} scale={1.0} />
      <SecurityShield position={[0, 8, -20]} scale={2.0} />
      
      <DataParticles count={600} />
      
      <SecurityRing />
      <InnerRing />
      
      <Stars 
        radius={100}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
    </>
  );
}

export function R3FCyberHero() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 bg-transparent">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0" data-testid="r3f-cyber-hero">
      <WebGLFallback>
        <Canvas
          camera={{ position: [0, 5, 30], fov: 60 }}
          gl={{ 
            alpha: true, 
            antialias: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
          dpr={[1, 2]}
        >
          <Scene />
        </Canvas>
      </WebGLFallback>
    </div>
  );
}

export default R3FCyberHero;
