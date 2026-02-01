import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { WebGLFallback } from '@/components/ui/webgl-fallback';

const PURPLE = '#9944ff';
const CYAN = '#9D4EDD';
const PARTICLE_COUNT_DESKTOP = 2500;
const PARTICLE_COUNT_MOBILE = 800;
const MOBILE_BREAKPOINT = 768;

function GalaxyParticles({ particleCount }: { particleCount: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { size, viewport } = useThree();
  
  const [positions, colors, originalPositions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const origPos = new Float32Array(particleCount * 3);
    
    const purpleColor = new THREE.Color(PURPLE);
    const cyanColor = new THREE.Color(CYAN);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      const armAngle = (i % 3) * ((2 * Math.PI) / 3);
      const distance = Math.pow(Math.random(), 0.5) * 8;
      const spinAngle = distance * 0.8;
      const angle = armAngle + spinAngle + (Math.random() - 0.5) * 0.5;
      
      const x = Math.cos(angle) * distance + (Math.random() - 0.5) * 0.3;
      const z = Math.sin(angle) * distance + (Math.random() - 0.5) * 0.3;
      const y = (Math.random() - 0.5) * 0.8 * (1 - distance / 10);
      
      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
      
      origPos[i3] = x;
      origPos[i3 + 1] = y;
      origPos[i3 + 2] = z;
      
      const colorMix = Math.random();
      const particleColor = purpleColor.clone().lerp(cyanColor, colorMix);
      
      col[i3] = particleColor.r;
      col[i3 + 1] = particleColor.g;
      col[i3 + 2] = particleColor.b;
    }
    
    return [pos, col, origPos];
  }, [particleCount]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / size.width) * 2 - 1;
      mouseRef.current.y = -(e.clientY / size.height) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const positions = positionAttr.array as Float32Array;
    
    const mouseX = mouseRef.current.x * viewport.width * 0.5;
    const mouseY = mouseRef.current.y * viewport.height * 0.5;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];
      
      const dx = positions[i3] - mouseX;
      const dy = positions[i3 + 1] - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 3) {
        const force = (3 - dist) / 3;
        const angle = Math.atan2(dy, dx);
        positions[i3] += Math.cos(angle) * force * 0.03;
        positions[i3 + 1] += Math.sin(angle) * force * 0.03;
      }
      
      positions[i3] += (origX - positions[i3]) * 0.02;
      positions[i3 + 1] += (origY - positions[i3 + 1]) * 0.02;
      positions[i3 + 2] += (origZ - positions[i3 + 2]) * 0.02;
    }
    
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.035}
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

function GalaxyCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshBasicMaterial
        color={PURPLE}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function GalaxyScene({ particleCount }: { particleCount: number }) {
  return (
    <>
      <color attach="background" args={['#0a0a1e']} />
      <ambientLight intensity={0.1} />
      <GalaxyParticles particleCount={particleCount} />
      <GalaxyCore />
    </>
  );
}

interface PurpleGalaxyBackgroundProps {
  enabled?: boolean;
}

export function PurpleGalaxyBackground({ enabled = true }: PurpleGalaxyBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!enabled) return null;

  const particleCount = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-background"
    >
      <WebGLFallback>
        <Canvas
          camera={{ position: [0, 0, 12], fov: 60 }}
          dpr={isMobile ? [1, 1] : [1, 2]}
          gl={{ 
            antialias: !isMobile, 
            alpha: true,
            powerPreference: 'high-performance'
          }}
          style={{ background: '#0a0a1e' }}
        >
          <GalaxyScene particleCount={particleCount} />
        </Canvas>
      </WebGLFallback>
    </div>
  );
}

export default PurpleGalaxyBackground;
