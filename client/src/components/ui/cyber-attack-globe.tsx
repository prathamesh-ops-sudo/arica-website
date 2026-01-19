"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

interface AttackData {
  id: string;
  from: { lat: number; lng: number; city: string; country: string };
  to: { lat: number; lng: number; city: string; country: string };
  type: 'ransomware' | 'ddos' | 'phishing' | 'malware' | 'intrusion' | 'dataBreach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  estimatedLoss: number;
  timestamp: number;
}

interface AttackArc {
  mesh: THREE.Line;
  progress: number;
  speed: number;
  data: AttackData;
  marker: THREE.Mesh;
}

const attackTypes = {
  ransomware: { color: 0xff3366, label: 'Ransomware' },
  ddos: { color: 0xffaa00, label: 'DDoS Attack' },
  phishing: { color: 0x00ccff, label: 'Phishing' },
  malware: { color: 0x9933ff, label: 'Malware' },
  intrusion: { color: 0xff6600, label: 'Intrusion' },
  dataBreach: { color: 0xff0066, label: 'Data Breach' },
};

const globalLocations = [
  { lat: 40.7128, lng: -74.006, city: 'New York', country: 'USA' },
  { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' },
  { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan' },
  { lat: 39.9042, lng: 116.4074, city: 'Beijing', country: 'China' },
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
  { lat: 41.8781, lng: -87.6298, city: 'Chicago', country: 'USA' },
  { lat: 31.2304, lng: 121.4737, city: 'Shanghai', country: 'China' },
  { lat: 22.3193, lng: 114.1694, city: 'Hong Kong', country: 'China' },
  { lat: 59.3293, lng: 18.0686, city: 'Stockholm', country: 'Sweden' },
  { lat: 45.4642, lng: 9.19, city: 'Milan', country: 'Italy' },
  { lat: 43.6532, lng: -79.3832, city: 'Toronto', country: 'Canada' },
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
  const types = Object.keys(attackTypes) as AttackData['type'][];
  const severities: AttackData['severity'][] = ['low', 'medium', 'high', 'critical'];
  const fromIdx = Math.floor(Math.random() * globalLocations.length);
  let toIdx = Math.floor(Math.random() * globalLocations.length);
  while (toIdx === fromIdx) {
    toIdx = Math.floor(Math.random() * globalLocations.length);
  }

  const severity = severities[Math.floor(Math.random() * severities.length)];
  const baseLoss = { low: 5000, medium: 50000, high: 500000, critical: 5000000 };
  
  return {
    id: Math.random().toString(36).slice(2),
    from: globalLocations[fromIdx],
    to: globalLocations[toIdx],
    type: types[Math.floor(Math.random() * types.length)],
    severity,
    estimatedLoss: baseLoss[severity] + Math.random() * baseLoss[severity],
    timestamp: Date.now(),
  };
}

const earthShader = {
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
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = noise(i);
      float b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0));
      float d = noise(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for(int i = 0; i < 5; i++) {
        value += amplitude * smoothNoise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
      float diffuse = max(dot(vNormal, lightDir), 0.0);
      
      vec2 uv = vec2(
        atan(vPosition.x, vPosition.z) / 6.28318 + 0.5,
        asin(vPosition.y / length(vPosition)) / 3.14159 + 0.5
      );
      
      float continent = fbm(uv * 8.0);
      continent = smoothstep(0.35, 0.45, continent);
      
      vec3 oceanColor = vec3(0.02, 0.05, 0.15);
      vec3 oceanHighlight = vec3(0.05, 0.12, 0.25);
      vec3 landColor = vec3(0.02, 0.08, 0.04);
      vec3 landHighlight = vec3(0.04, 0.15, 0.06);
      
      vec3 ocean = mix(oceanColor, oceanHighlight, diffuse * 0.5);
      vec3 land = mix(landColor, landHighlight, diffuse * 0.5);
      vec3 surfaceColor = mix(ocean, land, continent);
      
      float gridLat = step(0.98, fract(uv.y * 18.0));
      float gridLng = step(0.98, fract(uv.x * 36.0));
      float grid = max(gridLat, gridLng) * 0.15;
      surfaceColor += vec3(0.0, 0.8, 1.0) * grid;
      
      float cityNoise = step(0.85, fbm(uv * 40.0)) * continent;
      vec3 cityLights = vec3(0.0, 0.8, 1.0) * cityNoise * (1.0 - diffuse);
      surfaceColor += cityLights * 0.5;
      
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
      surfaceColor += vec3(0.0, 0.5, 0.8) * fresnel * 0.3;
      
      gl_FragColor = vec4(surfaceColor * (diffuse * 0.6 + 0.4), 1.0);
    }
  `,
};

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
  attackFrequency = 800
}: CyberAttackGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    totalAttacks: 0,
    attacksPerSecond: 0,
    totalLoss: 0,
    criticalCount: 0,
  });
  const [recentAttacks, setRecentAttacks] = useState<AttackData[]>([]);
  const [latestAttack, setLatestAttack] = useState<AttackData | null>(null);

  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    globe: THREE.Mesh | null;
    arcs: AttackArc[];
    markers: THREE.Mesh[];
    animationId: number | null;
    clock: THREE.Clock;
    mouseX: number;
    mouseY: number;
    targetRotationX: number;
    targetRotationY: number;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    globe: null,
    arcs: [],
    markers: [],
    animationId: null,
    clock: new THREE.Clock(),
    mouseX: 0,
    mouseY: 0,
    targetRotationX: 0,
    targetRotationY: 0,
  });

  const statsRef = useRef({
    attackCount: 0,
    startTime: Date.now(),
    totalLoss: 0,
    criticalCount: 0,
  });

  const addAttack = useCallback((attack: AttackData) => {
    const refs = sceneRef.current;
    if (!refs.scene || !refs.globe) return;

    const GLOBE_RADIUS = 5;
    const startPos = latLngToVector3(attack.from.lat, attack.from.lng, GLOBE_RADIUS);
    const endPos = latLngToVector3(attack.to.lat, attack.to.lng, GLOBE_RADIUS);

    const curve = createArcCurve(startPos, endPos, 0.3);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const color = new THREE.Color(attackTypes[attack.type].color);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.8,
      linewidth: 2,
    });

    const line = new THREE.Line(geometry, material);
    refs.globe.add(line);

    const markerGeom = new THREE.SphereGeometry(0.08, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 1,
    });
    const marker = new THREE.Mesh(markerGeom, markerMat);
    marker.position.copy(startPos);
    refs.globe.add(marker);

    const originMarkerGeom = new THREE.SphereGeometry(0.06, 12, 12);
    const originMarkerMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.8,
    });
    const originMarker = new THREE.Mesh(originMarkerGeom, originMarkerMat);
    originMarker.position.copy(startPos);
    refs.globe.add(originMarker);
    refs.markers.push(originMarker);

    const targetMarkerGeom = new THREE.RingGeometry(0.08, 0.12, 16);
    const targetMarkerMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    const targetMarker = new THREE.Mesh(targetMarkerGeom, targetMarkerMat);
    targetMarker.position.copy(endPos);
    targetMarker.lookAt(new THREE.Vector3(0, 0, 0));
    refs.globe.add(targetMarker);
    refs.markers.push(targetMarker);

    refs.arcs.push({
      mesh: line,
      progress: 0,
      speed: 0.015 + Math.random() * 0.01,
      data: attack,
      marker,
    });

    statsRef.current.attackCount++;
    statsRef.current.totalLoss += attack.estimatedLoss;
    if (attack.severity === 'critical') {
      statsRef.current.criticalCount++;
    }

    const elapsed = (Date.now() - statsRef.current.startTime) / 1000;
    setStats({
      totalAttacks: statsRef.current.attackCount,
      attacksPerSecond: elapsed > 0 ? statsRef.current.attackCount / elapsed : 0,
      totalLoss: statsRef.current.totalLoss,
      criticalCount: statsRef.current.criticalCount,
    });

    setLatestAttack(attack);
    setRecentAttacks(prev => [attack, ...prev.slice(0, 4)]);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const refs = sceneRef.current;
    const GLOBE_RADIUS = 5;

    refs.scene = new THREE.Scene();
    refs.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    refs.camera.position.z = 15;

    refs.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    refs.renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0x333366, 0.5);
    refs.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    refs.scene.add(directionalLight);

    const globeGeom = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const globeMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: earthShader.vertexShader,
      fragmentShader: earthShader.fragmentShader,
    });
    refs.globe = new THREE.Mesh(globeGeom, globeMat);
    refs.scene.add(refs.globe);

    const atmosGeom = new THREE.SphereGeometry(GLOBE_RADIUS * 1.02, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.0, 0.5, 1.0, intensity * 0.5);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(atmosGeom, atmosMat);
    refs.scene.add(atmosphere);

    const outerGlowGeom = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 32, 32);
    const outerGlowMat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          gl_FragColor = vec4(0.0, 0.8, 1.0, intensity * 0.2);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const outerGlow = new THREE.Mesh(outerGlowGeom, outerGlowMat);
    refs.scene.add(outerGlow);

    const updateSize = () => {
      if (!containerRef.current || !refs.renderer || !refs.camera) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      refs.camera.aspect = width / height;
      refs.camera.updateProjectionMatrix();
      refs.renderer.setSize(width, height);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      refs.mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      refs.mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    containerRef.current?.addEventListener('mousemove', handleMouseMove);

    setIsLoaded(true);

    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);
      const time = refs.clock.getElapsedTime();

      if (refs.globe) {
        const mat = refs.globe.material as THREE.ShaderMaterial;
        if (mat.uniforms?.time) mat.uniforms.time.value = time;

        if (autoRotate) {
          refs.globe.rotation.y += 0.001;
        }

        refs.targetRotationX = refs.mouseY * 0.3;
        refs.targetRotationY = refs.mouseX * 0.3;
        refs.globe.rotation.x += (refs.targetRotationX - refs.globe.rotation.x) * 0.05;
      }

      refs.arcs = refs.arcs.filter(arc => {
        arc.progress += arc.speed;

        if (arc.progress >= 1) {
          refs.globe?.remove(arc.mesh);
          refs.globe?.remove(arc.marker);
          arc.mesh.geometry.dispose();
          (arc.mesh.material as THREE.Material).dispose();
          (arc.marker.material as THREE.Material).dispose();
          arc.marker.geometry.dispose();
          return false;
        }

        const curve = arc.mesh.geometry.getAttribute('position');
        if (curve) {
          const idx = Math.floor(arc.progress * 49);
          const x = curve.getX(idx);
          const y = curve.getY(idx);
          const z = curve.getZ(idx);
          arc.marker.position.set(x, y, z);

          const scale = 1 + Math.sin(arc.progress * Math.PI) * 0.5;
          arc.marker.scale.setScalar(scale);
        }

        (arc.mesh.material as THREE.LineBasicMaterial).opacity = 1 - arc.progress * 0.5;

        return true;
      });

      refs.markers.forEach((marker, i) => {
        const pulse = Math.sin(time * 3 + i) * 0.3 + 0.7;
        (marker.material as THREE.MeshBasicMaterial).opacity = pulse;
      });

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
      window.removeEventListener('resize', updateSize);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      clearInterval(attackInterval);
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      refs.renderer?.dispose();
    };
  }, [addAttack, autoRotate, attackFrequency]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const getSeverityColor = (severity: AttackData['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-blue-400';
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full min-h-[500px] ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {showStats && (
        <>
          <div className="absolute top-4 left-4 z-10">
            <div className="backdrop-blur-xl bg-black/60 border border-cyan-500/30 rounded-xl p-4 min-w-[200px]">
              <h3 className="text-cyan-400 text-xs uppercase tracking-wider mb-3 font-semibold">
                Live Threat Monitor
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground">Attacks Detected</div>
                  <div className="text-2xl font-bold text-white">{stats.totalAttacks.toLocaleString()}</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Attacks/Second</div>
                  <div className="text-xl font-bold text-cyan-400">{stats.attacksPerSecond.toFixed(1)}</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Est. Financial Loss</div>
                  <div className="text-xl font-bold text-red-400">{formatCurrency(stats.totalLoss)}</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Critical Threats</div>
                  <div className="text-xl font-bold text-orange-400">{stats.criticalCount}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="backdrop-blur-xl bg-black/60 border border-cyan-500/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-cyan-400 uppercase tracking-wider font-semibold">Recent Attacks</span>
              </div>
              
              <div className="space-y-1 max-h-[120px] overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {recentAttacks.map((attack) => (
                    <motion.div
                      key={attack.id}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between text-xs py-1 border-b border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: `#${attackTypes[attack.type].color.toString(16).padStart(6, '0')}` }}
                        />
                        <span className="text-white/80">
                          {attack.from.city} → {attack.to.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white/50">{attackTypes[attack.type].label}</span>
                        <span className={getSeverityColor(attack.severity)}>{attack.severity.toUpperCase()}</span>
                        <span className="text-red-400">{formatCurrency(attack.estimatedLoss)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <div className="backdrop-blur-xl bg-black/60 border border-cyan-500/30 rounded-xl p-3">
              <div className="text-xs text-muted-foreground mb-2">Attack Types</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {Object.entries(attackTypes).map(([key, { color, label }]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: `#${color.toString(16).padStart(6, '0')}` }}
                    />
                    <span className="text-xs text-white/70">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
