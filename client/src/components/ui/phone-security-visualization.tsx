"use client";

import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, RoundedBox, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { WebGLFallback } from '@/components/ui/webgl-fallback';

const CYAN = '#00D4FF';
const PURPLE = '#00D4FF';
const THREAT_RED = '#ff3344';

interface DeviceType {
  id: string;
  name: string;
  color: string;
  screenRatio: number;
}

const devices: DeviceType[] = [
  { id: 'iphone', name: 'iPhone 15 Pro', color: '#1a1a2e', screenRatio: 0.92 },
  { id: 'pixel', name: 'Pixel 8 Pro', color: '#2d2d3a', screenRatio: 0.90 },
  { id: 'samsung', name: 'Galaxy S24', color: '#1e1e2a', screenRatio: 0.91 },
];

interface PhoneProps {
  isScanning: boolean;
  mousePosition: { x: number; y: number };
  selectedDevice: DeviceType;
  onHotspotClick: (zone: string) => void;
  isDragging: boolean;
  dragRotation: { x: number; y: number };
}

function RealisticPhone({ isScanning, mousePosition, selectedDevice, onHotspotClick, isDragging, dragRotation }: PhoneProps) {
  const phoneRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const screenMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  
  const screenShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      isScanning: { value: isScanning ? 1.0 : 0.0 },
      color1: { value: new THREE.Color(CYAN) },
      color2: { value: new THREE.Color(PURPLE) },
      hoveredZone: { value: 0 },
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
      uniform float hoveredZone;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      float sdRoundedBox(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + r;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
      }
      
      void main() {
        vec2 uv = vUv;
        vec2 centered = uv - 0.5;
        
        // App icons grid
        float iconSize = 0.08;
        float iconSpacing = 0.18;
        vec2 iconGrid = mod(uv * 5.0, 1.0);
        float icon = step(0.3, iconGrid.x) * step(iconGrid.x, 0.7) * 
                     step(0.3, iconGrid.y) * step(iconGrid.y, 0.7);
        
        // Scan effects
        float scanLine = step(0.98, sin(uv.y * 100.0 - time * 10.0));
        float scanWave = sin(uv.y * 20.0 - time * 5.0) * 0.5 + 0.5;
        
        // Hexagonal grid pattern
        float hexScale = 15.0;
        vec2 hexUv = uv * hexScale;
        float hex = sin(hexUv.x + sin(hexUv.y * 1.73205)) * 
                    sin(hexUv.y * 1.73205 + sin(hexUv.x));
        hex = smoothstep(0.8, 1.0, hex) * 0.3;
        
        // Data flow lines
        float dataLines = 0.0;
        for (int i = 0; i < 5; i++) {
          float fi = float(i);
          float lineY = fract(time * 0.3 + fi * 0.2);
          dataLines += smoothstep(0.02, 0.0, abs(uv.y - lineY)) * 0.3;
        }
        
        // Vulnerability hotspot zones
        float zone1 = 1.0 - smoothstep(0.15, 0.2, length(uv - vec2(0.2, 0.8)));
        float zone2 = 1.0 - smoothstep(0.15, 0.2, length(uv - vec2(0.8, 0.8)));
        float zone3 = 1.0 - smoothstep(0.15, 0.2, length(uv - vec2(0.5, 0.5)));
        float zone4 = 1.0 - smoothstep(0.15, 0.2, length(uv - vec2(0.2, 0.2)));
        float zone5 = 1.0 - smoothstep(0.15, 0.2, length(uv - vec2(0.8, 0.2)));
        
        float zoneHighlight = (zone1 + zone2 + zone3 + zone4 + zone5) * isScanning * 0.5;
        
        // Pulse and noise
        float pulse = sin(time * 3.0) * 0.3 + 0.7;
        float noise = random(uv + time * 0.1) * 0.05;
        
        // Scan bar
        float scanProgress = fract(time * 0.4);
        float scanBar = smoothstep(scanProgress - 0.15, scanProgress, uv.y) - 
                        smoothstep(scanProgress, scanProgress + 0.03, uv.y);
        scanBar *= isScanning;
        
        // Base gradient
        vec3 baseColor = mix(color1 * 0.6, color2 * 0.6, uv.y);
        
        // Compose final color
        vec3 finalColor = baseColor * 0.2;
        finalColor += baseColor * hex;
        finalColor += baseColor * dataLines * isScanning;
        finalColor += baseColor * scanLine * 0.4 * isScanning;
        finalColor += vec3(1.0, 1.0, 1.0) * scanBar * 0.9;
        finalColor += vec3(1.0, 0.3, 0.1) * zoneHighlight * sin(time * 5.0) * 0.5;
        finalColor += baseColor * noise;
        finalColor *= pulse * isScanning + (1.0 - isScanning) * 0.4;
        
        // Glass reflection
        float reflection = pow(1.0 - abs(centered.x * 2.0), 8.0) * 0.15;
        finalColor += vec3(1.0) * reflection;
        
        float alpha = 0.95;
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  }), []);

  useFrame((state) => {
    if (phoneRef.current) {
      if (isDragging) {
        phoneRef.current.rotation.y = dragRotation.y;
        phoneRef.current.rotation.x = dragRotation.x;
      } else {
        const targetRotY = mousePosition.x * 0.15 + state.clock.elapsedTime * 0.1;
        const targetRotX = -mousePosition.y * 0.1;
        phoneRef.current.rotation.y += (targetRotY - phoneRef.current.rotation.y) * 0.02;
        phoneRef.current.rotation.x += (targetRotX - phoneRef.current.rotation.x) * 0.02;
      }
    }
    
    if (screenMaterialRef.current) {
      screenMaterialRef.current.uniforms.time.value = state.clock.elapsedTime;
      screenMaterialRef.current.uniforms.isScanning.value = isScanning ? 1.0 : 0.0;
    }
  });

  const handleZoneClick = (zone: string) => {
    onHotspotClick(zone);
  };

  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.3} enabled={!isDragging}>
      <group ref={phoneRef} position={[0, 0, 0]}>
        {/* Main phone body with rounded edges */}
        <RoundedBox args={[1.4, 2.8, 0.12]} radius={0.08} smoothness={4} castShadow>
          <meshPhysicalMaterial 
            color={selectedDevice.color}
            metalness={0.9}
            roughness={0.15}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
            envMapIntensity={1.5}
          />
        </RoundedBox>
        
        {/* Screen bezel */}
        <RoundedBox args={[1.25, 2.55, 0.01]} radius={0.06} smoothness={4} position={[0, 0, 0.06]}>
          <meshBasicMaterial color="#000000" />
        </RoundedBox>
        
        {/* Animated screen */}
        <mesh position={[0, 0.05, 0.065]} ref={screenRef}>
          <planeGeometry args={[1.15, 2.35]} />
          <shaderMaterial
            ref={screenMaterialRef}
            {...screenShader}
            transparent
          />
        </mesh>
        
        {/* Dynamic Island / Notch */}
        <RoundedBox args={[0.35, 0.1, 0.01]} radius={0.04} smoothness={4} position={[0, 1.15, 0.07]}>
          <meshBasicMaterial color="#000000" />
        </RoundedBox>
        
        {/* Front camera lens */}
        <mesh position={[-0.08, 1.15, 0.075]}>
          <circleGeometry args={[0.025, 32]} />
          <meshPhysicalMaterial color="#1a1a2e" metalness={0.5} roughness={0.2} />
        </mesh>
        
        {/* Camera bump on back */}
        <group position={[-0.35, 0.9, -0.07]}>
          <RoundedBox args={[0.45, 0.5, 0.08]} radius={0.05} smoothness={4}>
            <meshPhysicalMaterial 
              color={selectedDevice.color}
              metalness={0.85}
              roughness={0.2}
              clearcoat={0.5}
            />
          </RoundedBox>
          
          {/* Camera lenses */}
          <mesh position={[-0.1, 0.1, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
            <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.1, 0.1, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
            <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[-0.1, -0.12, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 32]} />
            <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.1} />
          </mesh>
          
          {/* Camera lens rings (glowing when scanning) */}
          {isScanning && (
            <>
              <mesh position={[-0.1, 0.1, 0.055]}>
                <ringGeometry args={[0.075, 0.085, 32]} />
                <meshBasicMaterial color={CYAN} transparent opacity={0.8} />
              </mesh>
              <mesh position={[0.1, 0.1, 0.055]}>
                <ringGeometry args={[0.075, 0.085, 32]} />
                <meshBasicMaterial color={CYAN} transparent opacity={0.8} />
              </mesh>
            </>
          )}
          
          {/* Flash */}
          <mesh position={[0.1, -0.12, 0.045]}>
            <circleGeometry args={[0.03, 32]} />
            <meshBasicMaterial color={isScanning ? "#ffff00" : "#888"} />
          </mesh>
        </group>
        
        {/* Side buttons */}
        <RoundedBox args={[0.03, 0.2, 0.04]} radius={0.01} smoothness={2} position={[0.72, 0.3, 0]}>
          <meshPhysicalMaterial color="#333" metalness={0.8} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.03, 0.12, 0.04]} radius={0.01} smoothness={2} position={[0.72, 0.55, 0]}>
          <meshPhysicalMaterial color="#333" metalness={0.8} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.03, 0.08, 0.04]} radius={0.01} smoothness={2} position={[-0.72, 0.4, 0]}>
          <meshPhysicalMaterial color="#333" metalness={0.8} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.03, 0.15, 0.04]} radius={0.01} smoothness={2} position={[-0.72, 0.15, 0]}>
          <meshPhysicalMaterial color="#333" metalness={0.8} roughness={0.3} />
        </RoundedBox>
        
        {/* Charging port */}
        <mesh position={[0, -1.4, 0.02]}>
          <boxGeometry args={[0.15, 0.03, 0.02]} />
          <meshBasicMaterial color="#222" />
        </mesh>
        
        {/* Speaker grilles */}
        {[-0.25, -0.15, -0.05, 0.05, 0.15, 0.25].map((x, i) => (
          <mesh key={i} position={[x, -1.38, 0.06]}>
            <circleGeometry args={[0.015, 8]} />
            <meshBasicMaterial color="#333" />
          </mesh>
        ))}
        
        {/* Interactive hotspot zones (invisible, for clicking) */}
        <mesh 
          position={[0, 0, 0.08]} 
          visible={false}
          onClick={() => handleZoneClick('screen')}
          onPointerEnter={() => setHoveredZone('screen')}
          onPointerLeave={() => setHoveredZone(null)}
        >
          <planeGeometry args={[1.2, 2.4]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        
        {/* Notification LED */}
        {isScanning && (
          <mesh position={[0.5, 1.3, 0.065]}>
            <circleGeometry args={[0.02, 16]} />
            <meshBasicMaterial color={CYAN} />
          </mesh>
        )}
      </group>
    </Float>
  );
}

interface ShieldEffectProps {
  active: boolean;
  flash: boolean;
  intensity?: number;
}

function ShieldEffect({ active, flash, intensity = 1 }: ShieldEffectProps) {
  const shieldRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const shieldShader = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
      shieldActive: { value: 0 },
      flash: { value: 0 },
      color: { value: new THREE.Color(CYAN) },
      intensity: { value: intensity },
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
      uniform float shieldActive;
      uniform float flash;
      uniform vec3 color;
      uniform float intensity;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
        
        // Hexagonal shield pattern
        vec2 hexUv = vPosition.xy * 8.0;
        float hex = sin(hexUv.x * 1.73205 + hexUv.y) * sin(hexUv.y * 2.0 - hexUv.x * 0.5);
        hex = smoothstep(0.3, 0.5, hex) * 0.4;
        
        // Energy flow
        float flow = sin(vPosition.y * 10.0 + time * 3.0) * 0.5 + 0.5;
        flow *= sin(vPosition.x * 8.0 - time * 2.0) * 0.5 + 0.5;
        
        float pulse = sin(time * 4.0) * 0.15 + 0.85;
        
        vec3 finalColor = color * (fresnel * 0.9 + hex * 0.3 + flow * 0.2);
        finalColor += vec3(1.0, 1.0, 1.0) * flash * 3.0;
        finalColor *= intensity;
        
        float alpha = (fresnel * 0.7 + hex * 0.2 + 0.05) * shieldActive * pulse;
        alpha = max(alpha, flash * 0.9);
        alpha *= intensity;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  }), [intensity]);

  useFrame((state) => {
    if (shieldRef.current) {
      shieldRef.current.rotation.y += 0.008;
      shieldRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    }
    
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.shieldActive.value += (active ? 1 : 0 - materialRef.current.uniforms.shieldActive.value) * 0.08;
      materialRef.current.uniforms.flash.value += (flash ? 1 : 0 - materialRef.current.uniforms.flash.value) * 0.15;
    }
  });

  return (
    <mesh ref={shieldRef} scale={[2.2, 2.8, 2.2]}>
      <icosahedronGeometry args={[1, 2]} />
      <shaderMaterial
        ref={materialRef}
        {...shieldShader}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

interface ThreatParticlesProps {
  active: boolean;
  onThreatBlocked: () => void;
  userTriggered?: boolean;
}

function ThreatParticles({ active, onThreatBlocked, userTriggered = false }: ThreatParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const [threats, setThreats] = useState<Array<{ position: THREE.Vector3; velocity: THREE.Vector3; life: number }>>([]);
  
  useFrame((state, delta) => {
    if (!active && !userTriggered) return;
    
    // Spawn threats more frequently when user triggered
    const spawnRate = userTriggered ? 0.15 : 0.03;
    if (Math.random() < spawnRate) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 5 + Math.random() * 2;
      const position = new THREE.Vector3(
        Math.cos(angle) * distance,
        (Math.random() - 0.5) * 4,
        Math.sin(angle) * distance
      );
      
      const targetOffset = new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        0
      );
      const velocity = targetOffset.sub(position).normalize().multiplyScalar(0.08 + Math.random() * 0.04);
      
      setThreats(prev => [...prev.slice(-30), { position, velocity, life: 1 }]);
    }
    
    // Update threats
    setThreats(prev => prev.map(threat => {
      threat.position.add(threat.velocity);
      
      // Check collision with shield
      if (threat.position.length() < 2.2) {
        onThreatBlocked();
        return { ...threat, life: 0 };
      }
      
      return { ...threat, life: threat.life - delta * 0.3 };
    }).filter(t => t.life > 0));
  });
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(100 * 3);
    const colors = new Float32Array(100 * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);
  
  useEffect(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
      
      threats.forEach((threat, i) => {
        if (i < 100) {
          positions[i * 3] = threat.position.x;
          positions[i * 3 + 1] = threat.position.y;
          positions[i * 3 + 2] = threat.position.z;
          
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.2;
          colors[i * 3 + 2] = 0.1;
        }
      });
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
    }
  }, [threats]);
  
  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function OrbitingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 100;
  
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.5 + Math.random() * 1.5;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      size[i] = 0.02 + Math.random() * 0.04;
    }
    
    return [pos, size];
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={CYAN}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

interface SceneProps {
  isScanning: boolean;
  onThreatBlocked: () => void;
  selectedDevice: DeviceType;
  onHotspotClick: (zone: string) => void;
  attackMode: boolean;
}

function Scene({ isScanning, onThreatBlocked, selectedDevice, onHotspotClick, attackMode }: SceneProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragRotation, setDragRotation] = useState({ x: 0, y: 0 });
  const [shieldFlash, setShieldFlash] = useState(false);
  const { gl } = useThree();
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePos({ x, y });
      
      if (isDragging) {
        const deltaX = (e.clientX - dragStart.x) * 0.008;
        const deltaY = (e.clientY - dragStart.y) * 0.008;
        const clampedX = Math.max(-0.8, Math.min(0.8, deltaY));
        const targetRotation = { x: clampedX, y: deltaX };
        setDragRotation(prev => ({
          x: prev.x + (targetRotation.x - prev.x) * 0.15,
          y: prev.y + (targetRotation.y - prev.y) * 0.15
        }));
      }
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - dragRotation.y * 125, y: e.clientY - dragRotation.x * 125 });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        setDragStart({ 
          x: e.touches[0].clientX - dragRotation.y * 125, 
          y: e.touches[0].clientY - dragRotation.x * 125 
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        e.preventDefault();
        const deltaX = (e.touches[0].clientX - dragStart.x) * 0.008;
        const deltaY = (e.touches[0].clientY - dragStart.y) * 0.008;
        const clampedX = Math.max(-0.8, Math.min(0.8, deltaY));
        const targetRotation = { x: clampedX, y: deltaX };
        setDragRotation(prev => ({
          x: prev.x + (targetRotation.x - prev.x) * 0.15,
          y: prev.y + (targetRotation.y - prev.y) * 0.15
        }));
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };
    
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    gl.domElement.addEventListener('mouseup', handleMouseUp);
    gl.domElement.addEventListener('mouseleave', handleMouseUp);
    gl.domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    gl.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    gl.domElement.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      gl.domElement.removeEventListener('mouseup', handleMouseUp);
      gl.domElement.removeEventListener('mouseleave', handleMouseUp);
      gl.domElement.removeEventListener('touchstart', handleTouchStart);
      gl.domElement.removeEventListener('touchmove', handleTouchMove);
      gl.domElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gl, isDragging, dragStart, dragRotation]);
  
  const handleThreatBlocked = () => {
    setShieldFlash(true);
    setTimeout(() => setShieldFlash(false), 150);
    onThreatBlocked();
  };
  
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color={CYAN} />
      <pointLight position={[5, -5, 5]} intensity={0.3} color={PURPLE} />
      
      <RealisticPhone 
        isScanning={isScanning} 
        mousePosition={mousePos}
        selectedDevice={selectedDevice}
        onHotspotClick={onHotspotClick}
        isDragging={isDragging}
        dragRotation={dragRotation}
      />
      <ShieldEffect active={isScanning || attackMode} flash={shieldFlash} intensity={attackMode ? 1.3 : 1} />
      <ThreatParticles active={isScanning} onThreatBlocked={handleThreatBlocked} userTriggered={attackMode} />
      <OrbitingParticles />
      
      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.4} 
        scale={8} 
        blur={2} 
        far={4}
        color="#000022"
      />
      
      <Environment preset="night" />
    </>
  );
}

interface PhoneSecurityVisualizationProps {
  isScanning: boolean;
  onThreatBlocked: () => void;
}

export function PhoneSecurityVisualization({ isScanning, onThreatBlocked }: PhoneSecurityVisualizationProps) {
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);
  const [hotspotInfo, setHotspotInfo] = useState<string | null>(null);
  const [attackMode, setAttackMode] = useState(false);
  const [localThreatsBlocked, setLocalThreatsBlocked] = useState(0);
  
  const selectedDevice = devices[selectedDeviceIndex];
  
  const handleHotspotClick = (zone: string) => {
    setHotspotInfo(zone === 'screen' ? 'Tap detected on screen - Analyzing touch patterns...' : null);
    setTimeout(() => setHotspotInfo(null), 2000);
  };
  
  const handleThreatBlocked = () => {
    setLocalThreatsBlocked(prev => prev + 1);
    onThreatBlocked();
  };
  
  const cycleDevice = (direction: number) => {
    setSelectedDeviceIndex(prev => (prev + direction + devices.length) % devices.length);
  };
  
  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-[#00B4D8]/20">
      <WebGLFallback>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          dpr={[1, 2]}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
          }}
          style={{ cursor: 'grab' }}
        >
          <Scene 
            isScanning={isScanning} 
            onThreatBlocked={handleThreatBlocked}
            selectedDevice={selectedDevice}
            onHotspotClick={handleHotspotClick}
            attackMode={attackMode}
          />
        </Canvas>
      </WebGLFallback>
      
      {/* Device selector carousel */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-xl rounded-full px-4 py-2 border border-[#00B4D8]/30">
        <button 
          onClick={() => cycleDevice(-1)}
          className="p-2 hover:bg-[#00B4D8]/20 rounded-full transition-colors"
          data-testid="btn-prev-device"
        >
          <svg className="w-5 h-5 text-[#00D4FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center min-w-[140px]">
          <div className="text-[#00D4FF] font-medium text-sm">{selectedDevice.name}</div>
          <div className="text-gray-500 text-xs">Drag to rotate</div>
        </div>
        
        <button 
          onClick={() => cycleDevice(1)}
          className="p-2 hover:bg-[#00B4D8]/20 rounded-full transition-colors"
          data-testid="btn-next-device"
        >
          <svg className="w-5 h-5 text-[#00D4FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Status overlay */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          isScanning ? 'bg-[#00B4D8]/20 text-[#00D4FF] border border-[#00B4D8]/50' : 
          attackMode ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
          'bg-gray-800/60 text-gray-400 border border-gray-600/30'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-[#00D4FF] animate-pulse' : attackMode ? 'bg-red-400 animate-pulse' : 'bg-gray-500'}`} />
          {isScanning ? 'Scanning Active' : attackMode ? 'Attack Simulation' : 'Shield Standby'}
        </div>
        
        {localThreatsBlocked > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/50">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {localThreatsBlocked} Threats Blocked
          </div>
        )}
      </div>
      
      {/* Attack mode toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setAttackMode(!attackMode)}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            attackMode 
              ? 'bg-red-500/30 text-red-400 border border-red-500/50 hover:bg-red-500/40' 
              : 'bg-gray-800/60 text-gray-300 border border-gray-600/30 hover:bg-gray-700/60'
          }`}
          data-testid="btn-attack-mode"
        >
          {attackMode ? '🛑 Stop Attack' : '⚔️ Simulate Attack'}
        </button>
      </div>
      
      {/* Hotspot info toast */}
      {hotspotInfo && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl px-4 py-2 rounded-lg border border-[#00B4D8]/50 text-[#00D4FF] text-sm">
          {hotspotInfo}
        </div>
      )}
    </div>
  );
}

export default PhoneSecurityVisualization;
