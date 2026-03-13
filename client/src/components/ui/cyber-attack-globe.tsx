"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { isWebGLAvailable } from '@/lib/webgl-utils';

interface AttackData {
  id: string;
  from: { lat: number; lng: number; city: string; country: string };
  to: { lat: number; lng: number; city: string; country: string };
  type: 'attack' | 'defense';
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocked: boolean;
  timestamp: number;
}

interface AttackArc {
  mesh: THREE.Line;
  glowMesh: THREE.Line;
  progress: number;
  speed: number;
  data: AttackData;
  pulseMarker: THREE.Mesh;
  endPos: THREE.Vector3;
  curve: THREE.QuadraticBezierCurve3;
}

const COLORS = {
  attack: 0xff3344,
  defense: 0x9D4EDD,
  wireframe: 0x9D4EDD,
  background: 0x0a0a1e,
};

const globalLocations = [
  { lat: 40.7128, lng: -74.006, city: 'New York', country: 'USA' },
  { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' },
  { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan' },
  { lat: 55.7558, lng: 37.6173, city: 'Moscow', country: 'Russia' },
  { lat: -33.8688, lng: 151.2093, city: 'Sydney', country: 'Australia' },
  { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' },
  { lat: 52.52, lng: 13.405, city: 'Berlin', country: 'Germany' },
  { lat: 19.076, lng: 72.8777, city: 'Mumbai', country: 'India' },
  { lat: -23.5505, lng: -46.6333, city: 'São Paulo', country: 'Brazil' },
  { lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore' },
  { lat: 37.5665, lng: 126.978, city: 'Seoul', country: 'South Korea' },
  { lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE' },
  { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', country: 'USA' },
  { lat: 39.9042, lng: 116.4074, city: 'Beijing', country: 'China' },
  { lat: 31.2304, lng: 121.4737, city: 'Shanghai', country: 'China' },
  { lat: 22.3193, lng: 114.1694, city: 'Hong Kong', country: 'China' },
  { lat: 43.6532, lng: -79.3832, city: 'Toronto', country: 'Canada' },
  { lat: 59.3293, lng: 18.0686, city: 'Stockholm', country: 'Sweden' },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function createArcCurve(
  start: THREE.Vector3,
  end: THREE.Vector3,
  arcHeight: number
): THREE.QuadraticBezierCurve3 {
  const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const distance = start.distanceTo(end);
  midPoint.normalize().multiplyScalar(start.length() + distance * arcHeight);
  return new THREE.QuadraticBezierCurve3(start, midPoint, end);
}

function generateRandomAttack(): AttackData {
  const fromIdx = Math.floor(Math.random() * globalLocations.length);
  let toIdx = Math.floor(Math.random() * globalLocations.length);
  while (toIdx === fromIdx) {
    toIdx = Math.floor(Math.random() * globalLocations.length);
  }

  const severities: AttackData['severity'][] = ['low', 'medium', 'high', 'critical'];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const blocked = Math.random() > 0.3;
  
  return {
    id: Math.random().toString(36).slice(2),
    from: globalLocations[fromIdx],
    to: globalLocations[toIdx],
    type: blocked ? 'defense' : 'attack',
    severity,
    blocked,
    timestamp: Date.now(),
  };
}

interface CyberAttackGlobeProps {
  className?: string;
  showStats?: boolean;
  autoRotate?: boolean;
  attackFrequency?: number;
}

export function CyberAttackGlobe({ 
  className = '', 
  showStats = true, 
  autoRotate = true,
  attackFrequency = 600
}: CyberAttackGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    totalAttacks: 0,
    attacksBlocked: 0,
    activeThreats: 0,
    threatLevel: 'HIGH' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  });

  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    globeGroup: THREE.Group | null;
    wireframeGlobe: THREE.LineSegments | null;
    arcs: AttackArc[];
    cityMarkers: THREE.Mesh[];
    animationId: number | null;
    clock: THREE.Clock;
    isDragging: boolean;
    lastMouseX: number;
    lastMouseY: number;
    rotationVelocityX: number;
    rotationVelocityY: number;
    autoRotationSpeed: number;
    lastInteractionTime: number;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    globeGroup: null,
    wireframeGlobe: null,
    arcs: [],
    cityMarkers: [],
    animationId: null,
    clock: new THREE.Clock(),
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    rotationVelocityX: 0,
    rotationVelocityY: 0,
    autoRotationSpeed: 0.003,
    lastInteractionTime: 0,
  });

  const statsRef = useRef({
    attackCount: 0,
    blockedCount: 0,
    activeThreats: 0,
  });

  const addAttack = useCallback((attack: AttackData) => {
    const refs = sceneRef.current;
    if (!refs.scene || !refs.globeGroup) return;

    const GLOBE_RADIUS = 5;
    const startPos = latLngToVector3(attack.from.lat, attack.from.lng, GLOBE_RADIUS);
    const endPos = latLngToVector3(attack.to.lat, attack.to.lng, GLOBE_RADIUS);

    const curve = createArcCurve(startPos, endPos, 0.35);
    const points = curve.getPoints(80);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const color = attack.blocked ? COLORS.defense : COLORS.attack;
    
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      linewidth: 2,
    });

    const line = new THREE.Line(geometry, material);
    refs.globeGroup.add(line);

    const glowMaterial = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      linewidth: 4,
    });
    const glowLine = new THREE.Line(geometry.clone(), glowMaterial);
    refs.globeGroup.add(glowLine);

    const pulseGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 1,
    });
    const pulseMarker = new THREE.Mesh(pulseGeom, pulseMat);
    pulseMarker.position.copy(startPos);
    refs.globeGroup.add(pulseMarker);

    refs.arcs.push({
      mesh: line,
      glowMesh: glowLine,
      progress: 0,
      speed: 0.012 + Math.random() * 0.008,
      data: attack,
      pulseMarker,
      endPos: endPos.clone(),
      curve,
    });

    statsRef.current.attackCount++;
    if (attack.blocked) {
      statsRef.current.blockedCount++;
    } else {
      statsRef.current.activeThreats++;
    }

    const threatRatio = statsRef.current.activeThreats / Math.max(statsRef.current.attackCount, 1);
    let threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'HIGH';
    if (threatRatio > 0.5) threatLevel = 'CRITICAL';
    else if (threatRatio > 0.3) threatLevel = 'HIGH';
    else if (threatRatio > 0.15) threatLevel = 'MEDIUM';
    else threatLevel = 'LOW';

    setStats({
      totalAttacks: statsRef.current.attackCount,
      attacksBlocked: statsRef.current.blockedCount,
      activeThreats: statsRef.current.activeThreats,
      threatLevel,
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    if (!isWebGLAvailable()) {
      setIsLoaded(true);
      return;
    }

    const refs = sceneRef.current;
    const GLOBE_RADIUS = 5;

    refs.scene = new THREE.Scene();
    refs.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    refs.camera.position.set(0, 0, 14);

    const isMobileView = window.innerWidth < 1024;
    refs.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: !isMobileView,
      alpha: true,
      powerPreference: isMobileView ? 'low-power' : 'default',
    });
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobileView ? 1 : 2));
    refs.renderer.setClearColor(COLORS.background, 0);

    refs.globeGroup = new THREE.Group();
    refs.scene.add(refs.globeGroup);

    const icoGeometry = new THREE.IcosahedronGeometry(GLOBE_RADIUS, 3);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: COLORS.wireframe,
      transparent: true,
      opacity: 0.15,
    });
    const wireframeGeometry = new THREE.WireframeGeometry(icoGeometry);
    refs.wireframeGlobe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    refs.globeGroup.add(refs.wireframeGlobe);

    const innerGlowGeom = new THREE.IcosahedronGeometry(GLOBE_RADIUS * 0.98, 2);
    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: COLORS.wireframe,
      transparent: true,
      opacity: 0.02,
      side: THREE.BackSide,
    });
    const innerGlow = new THREE.Mesh(innerGlowGeom, innerGlowMat);
    refs.globeGroup.add(innerGlow);

    const atmosphereGeom = new THREE.SphereGeometry(GLOBE_RADIUS * 1.08, 32, 32);
    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(COLORS.wireframe) },
        viewVector: { value: new THREE.Vector3(0, 0, 1) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
          gl_FragColor = vec4(glowColor, intensity * 0.4);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeom, atmosphereMat);
    refs.scene.add(atmosphere);

    globalLocations.forEach(loc => {
      const pos = latLngToVector3(loc.lat, loc.lng, GLOBE_RADIUS);
      
      const markerGeom = new THREE.SphereGeometry(0.05, 8, 8);
      const markerMat = new THREE.MeshBasicMaterial({
        color: COLORS.defense,
        transparent: true,
        opacity: 0.8,
      });
      const marker = new THREE.Mesh(markerGeom, markerMat);
      marker.position.copy(pos);
      refs.globeGroup!.add(marker);
      refs.cityMarkers.push(marker);

      const ringGeom = new THREE.RingGeometry(0.08, 0.12, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: COLORS.defense,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      refs.globeGroup!.add(ring);
    });

    const particleCount = 400;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 7 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: COLORS.defense,
      size: 0.03,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    refs.scene.add(particles);

    const updateSize = () => {
      if (!containerRef.current || !refs.renderer || !refs.camera) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      refs.camera.aspect = width / height;
      refs.camera.updateProjectionMatrix();
      refs.renderer.setSize(width, height);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const handleMouseDown = (e: MouseEvent) => {
      refs.isDragging = true;
      refs.lastMouseX = e.clientX;
      refs.lastMouseY = e.clientY;
      refs.lastInteractionTime = Date.now();
    };

    const handleMouseUp = () => {
      refs.isDragging = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (refs.isDragging && refs.globeGroup) {
        const deltaX = e.clientX - refs.lastMouseX;
        const deltaY = e.clientY - refs.lastMouseY;
        refs.rotationVelocityY = deltaX * 0.005;
        refs.rotationVelocityX = deltaY * 0.003;
        refs.lastMouseX = e.clientX;
        refs.lastMouseY = e.clientY;
        refs.lastInteractionTime = Date.now();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        refs.isDragging = true;
        refs.lastMouseX = e.touches[0].clientX;
        refs.lastMouseY = e.touches[0].clientY;
        refs.lastInteractionTime = Date.now();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (refs.isDragging && refs.globeGroup && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - refs.lastMouseX;
        const deltaY = e.touches[0].clientY - refs.lastMouseY;
        refs.rotationVelocityY = deltaX * 0.005;
        refs.rotationVelocityX = deltaY * 0.003;
        refs.lastMouseX = e.touches[0].clientX;
        refs.lastMouseY = e.touches[0].clientY;
        refs.lastInteractionTime = Date.now();
      }
    };

    const handleTouchEnd = () => {
      refs.isDragging = false;
    };

    containerRef.current?.addEventListener('mousedown', handleMouseDown);
    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    containerRef.current?.addEventListener('touchstart', handleTouchStart);
    containerRef.current?.addEventListener('touchmove', handleTouchMove);
    containerRef.current?.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mouseup', handleMouseUp);

    setIsLoaded(true);

    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);
      const time = refs.clock.getElapsedTime();

      if (refs.globeGroup) {
        if (!refs.isDragging) {
          refs.rotationVelocityX *= 0.95;
          refs.rotationVelocityY *= 0.95;
        }

        refs.globeGroup.rotation.y += refs.rotationVelocityY;
        refs.globeGroup.rotation.x += refs.rotationVelocityX;
        refs.globeGroup.rotation.x = Math.max(-0.5, Math.min(0.5, refs.globeGroup.rotation.x));

        const timeSinceInteraction = Date.now() - refs.lastInteractionTime;
        if (autoRotate && timeSinceInteraction > 2000 && Math.abs(refs.rotationVelocityY) < 0.001) {
          refs.globeGroup.rotation.y += refs.autoRotationSpeed;
        }
      }

      if (refs.wireframeGlobe) {
        const mat = refs.wireframeGlobe.material as THREE.LineBasicMaterial;
        mat.opacity = 0.12 + Math.sin(time * 0.5) * 0.03;
      }

      refs.cityMarkers.forEach((marker, i) => {
        const pulse = Math.sin(time * 2 + i * 0.5) * 0.3 + 0.7;
        (marker.material as THREE.MeshBasicMaterial).opacity = pulse;
        marker.scale.setScalar(0.8 + Math.sin(time * 3 + i) * 0.2);
      });

      refs.arcs = refs.arcs.filter(arc => {
        arc.progress += arc.speed;

        const fadeIn = Math.min(arc.progress * 4, 1);
        const fadeOut = 1 - Math.max((arc.progress - 0.75) * 4, 0);
        const baseOpacity = fadeIn * fadeOut;
        
        const pulse = Math.sin(time * 15 + arc.progress * 30) * 0.2 + 0.8;
        
        (arc.mesh.material as THREE.LineBasicMaterial).opacity = baseOpacity * 0.9;
        (arc.glowMesh.material as THREE.LineBasicMaterial).opacity = baseOpacity * pulse * 0.4;

        const currentPoint = arc.curve.getPoint(Math.min(arc.progress, 1));
        arc.pulseMarker.position.copy(currentPoint);
        
        const pulseScale = 0.8 + Math.sin(time * 20) * 0.4;
        arc.pulseMarker.scale.setScalar(pulseScale);
        (arc.pulseMarker.material as THREE.MeshBasicMaterial).opacity = baseOpacity;

        if (arc.progress >= 1) {
          if (!arc.data.blocked) {
            statsRef.current.activeThreats = Math.max(0, statsRef.current.activeThreats - 1);
            setStats(prev => ({
              ...prev,
              activeThreats: statsRef.current.activeThreats,
            }));
          }

          refs.globeGroup?.remove(arc.mesh);
          refs.globeGroup?.remove(arc.glowMesh);
          refs.globeGroup?.remove(arc.pulseMarker);
          arc.mesh.geometry.dispose();
          (arc.mesh.material as THREE.Material).dispose();
          arc.glowMesh.geometry.dispose();
          (arc.glowMesh.material as THREE.Material).dispose();
          arc.pulseMarker.geometry.dispose();
          (arc.pulseMarker.material as THREE.Material).dispose();
          return false;
        }

        return true;
      });

      particles.rotation.y += 0.0003;
      particles.rotation.x += 0.0001;

      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
    };
    animate();

    const attackInterval = setInterval(() => {
      const attack = generateRandomAttack();
      addAttack(attack);
    }, attackFrequency);

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      clearInterval(attackInterval);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mouseup', handleMouseUp);
      containerRef.current?.removeEventListener('mousedown', handleMouseDown);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('touchstart', handleTouchStart);
      containerRef.current?.removeEventListener('touchmove', handleTouchMove);
      containerRef.current?.removeEventListener('touchend', handleTouchEnd);
      
      refs.arcs.forEach(arc => {
        arc.mesh.geometry.dispose();
        (arc.mesh.material as THREE.Material).dispose();
        arc.glowMesh.geometry.dispose();
        (arc.glowMesh.material as THREE.Material).dispose();
        arc.pulseMarker.geometry.dispose();
        (arc.pulseMarker.material as THREE.Material).dispose();
      });
      refs.arcs = [];
      
      refs.cityMarkers.forEach(marker => {
        marker.geometry.dispose();
        (marker.material as THREE.Material).dispose();
      });
      refs.cityMarkers = [];
      
      if (refs.scene) {
        refs.scene.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(m => m.dispose());
            } else {
              (mesh.material as THREE.Material).dispose();
            }
          }
        });
      }
      
      refs.renderer?.dispose();
    };
  }, [addAttack, autoRotate, attackFrequency]);

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-500 bg-red-500';
      case 'HIGH': return 'text-orange-500 bg-orange-500';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500';
      default: return 'text-green-500 bg-green-500';
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full min-h-[400px] ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" 
        data-testid="globe-canvas"
      />

      {showStats && isLoaded && (
        <>
          <motion.div 
            className="absolute top-4 left-4 z-10"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="backdrop-blur-xl bg-black/50 border border-[#00D4FF]/30 rounded-xl p-4 min-w-[180px] shadow-[0_0_30px_rgba(0,212,255,0.15)]">
              <div className="flex items-center gap-2 mb-3">
                <motion.div 
                  className={`w-3 h-3 rounded-full ${getThreatLevelColor(stats.threatLevel).split(' ')[1]}`}
                  animate={{ 
                    scale: [1, 1.4, 1],
                    opacity: [1, 0.6, 1]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <span className="text-xs text-white/60 uppercase tracking-wider font-medium">Threat Level</span>
              </div>
              <div className={`text-2xl font-bold ${getThreatLevelColor(stats.threatLevel).split(' ')[0]}`}>
                {stats.threatLevel}
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="absolute top-4 right-4 z-10"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="backdrop-blur-xl bg-black/50 border border-[#00D4FF]/30 rounded-xl p-4 min-w-[160px] shadow-[0_0_30px_rgba(0,212,255,0.15)]">
              <div className="text-xs text-white/60 uppercase tracking-wider font-medium mb-2">Attacks Blocked</div>
              <motion.div 
                className="text-3xl font-bold text-[#00D4FF]"
                key={stats.attacksBlocked}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {stats.attacksBlocked.toLocaleString()}
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="absolute bottom-4 left-4 z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="backdrop-blur-xl bg-black/50 border border-[#ff3344]/30 rounded-xl p-4 min-w-[160px] shadow-[0_0_30px_rgba(255,51,68,0.15)]">
              <div className="flex items-center gap-2 mb-2">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-[#ff3344]"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
                <span className="text-xs text-white/60 uppercase tracking-wider font-medium">Active Threats</span>
              </div>
              <motion.div 
                className="text-3xl font-bold text-[#ff3344]"
                key={stats.activeThreats}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {stats.activeThreats}
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="absolute bottom-4 right-4 z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
              <div className="text-xs text-white/60 uppercase tracking-wider font-medium mb-2">Total Detected</div>
              <div className="text-2xl font-bold text-white">
                {stats.totalAttacks.toLocaleString()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-4 -translate-y-1/2 z-10 hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-[#ff3344]" />
                <span className="text-[10px] text-white/50 uppercase">Attack</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-[#00D4FF]" />
                <span className="text-[10px] text-white/50 uppercase">Blocked</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
