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
  trailParticles: THREE.Points;
  endPos: THREE.Vector3;
  curve: THREE.QuadraticBezierCurve3;
}

interface ImpactEffect {
  explosion: THREE.Mesh;
  shockwave: THREE.Mesh;
  flash: THREE.Mesh;
  particles: THREE.Points;
  startTime: number;
  position: THREE.Vector3;
}

interface RippleEffect {
  position: THREE.Vector3;
  startTime: number;
  intensity: number;
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
    uniform float time;
    uniform vec3 ripplePositions[8];
    uniform float rippleTimes[8];
    uniform int rippleCount;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying float vRipple;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vUv = uv;
      
      vec3 pos = position;
      vRipple = 0.0;
      
      for(int i = 0; i < 8; i++) {
        if(i >= rippleCount) break;
        float dist = distance(normalize(position), normalize(ripplePositions[i]));
        float rippleAge = time - rippleTimes[i];
        float rippleRadius = rippleAge * 0.8;
        float rippleWidth = 0.15;
        float ripple = smoothstep(rippleRadius - rippleWidth, rippleRadius, dist) - 
                       smoothstep(rippleRadius, rippleRadius + rippleWidth, dist);
        ripple *= max(0.0, 1.0 - rippleAge * 0.5);
        vRipple += ripple;
        pos += normal * ripple * 0.05;
      }
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying float vRipple;
    
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
      
      surfaceColor += vec3(0.0, 1.0, 0.8) * vRipple * 0.5;
      
      gl_FragColor = vec4(surfaceColor * (diffuse * 0.6 + 0.4), 1.0);
    }
  `,
};

const explosionShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    uniform float progress;
    varying vec2 vUv;
    
    void main() {
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center);
      
      float ring = smoothstep(0.3 + progress * 0.2, 0.35 + progress * 0.2, dist) -
                   smoothstep(0.35 + progress * 0.2, 0.5 + progress * 0.2, dist);
      
      float burst = 1.0 - smoothstep(0.0, 0.5 - progress * 0.3, dist);
      burst *= (1.0 - progress);
      
      float alpha = (ring + burst) * (1.0 - progress);
      vec3 finalColor = mix(color, vec3(1.0), burst * 0.5);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

const shockwaveShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float progress;
    uniform vec3 color;
    varying vec2 vUv;
    
    void main() {
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center);
      
      float ringRadius = progress * 0.5;
      float ringWidth = 0.05 * (1.0 - progress * 0.5);
      
      float ring = smoothstep(ringRadius - ringWidth, ringRadius, dist) -
                   smoothstep(ringRadius, ringRadius + ringWidth, dist);
      
      float alpha = ring * (1.0 - progress) * 0.8;
      
      gl_FragColor = vec4(color, alpha);
    }
  `,
};

const trailParticleShader = {
  vertexShader: `
    attribute float size;
    attribute float opacity;
    varying float vOpacity;
    
    void main() {
      vOpacity = opacity;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    varying float vOpacity;
    
    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
      gl_FragColor = vec4(color, alpha);
    }
  `,
};

const flashShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float progress;
    uniform vec3 color;
    varying vec2 vUv;
    
    void main() {
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center);
      
      float flash = 1.0 - smoothstep(0.0, 0.3 + progress * 0.2, dist);
      float alpha = flash * pow(1.0 - progress, 2.0);
      vec3 finalColor = mix(vec3(1.0), color, progress);
      
      gl_FragColor = vec4(finalColor, alpha * 0.9);
    }
  `,
};

const impactParticleShader = {
  vertexShader: `
    attribute float size;
    attribute float alpha;
    attribute vec3 velocity;
    uniform float time;
    varying float vAlpha;
    
    void main() {
      vAlpha = alpha;
      vec3 pos = position + velocity * time;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (200.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    varying float vAlpha;
    
    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
      gl_FragColor = vec4(color, alpha);
    }
  `,
};

const arcGlowShader = {
  vertexShader: `
    attribute float alpha;
    varying float vAlpha;
    
    void main() {
      vAlpha = alpha;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float glowIntensity;
    varying float vAlpha;
    
    void main() {
      gl_FragColor = vec4(color, vAlpha * glowIntensity * 0.6);
    }
  `,
};

function AnimatedCounter({ value, className = "" }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(0);
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    const startValue = prevValueRef.current;
    const diff = value - startValue;
    if (diff === 0) return;
    
    setIsPulsing(true);
    const duration = 500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(Math.floor(startValue + diff * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValueRef.current = value;
        setTimeout(() => setIsPulsing(false), 200);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  return (
    <span className={`transition-all duration-200 ${isPulsing ? 'scale-110 text-white' : ''} ${className}`}>
      {displayValue.toLocaleString()}
    </span>
  );
}

function AnimatedCurrency({ value, className = "" }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(0);
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    const startValue = prevValueRef.current;
    const diff = value - startValue;
    if (diff === 0) return;
    
    setIsPulsing(true);
    const duration = 500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(startValue + diff * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValueRef.current = value;
        setTimeout(() => setIsPulsing(false), 200);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val.toFixed(0)}`;
  };
  
  return (
    <span className={`transition-all duration-200 ${isPulsing ? 'scale-110' : ''} ${className}`}>
      {formatCurrency(displayValue)}
    </span>
  );
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
    impactEffects: ImpactEffect[];
    rippleEffects: RippleEffect[];
    ambientParticles: THREE.Points | null;
    animationId: number | null;
    clock: THREE.Clock;
    mouseX: number;
    mouseY: number;
    targetRotationX: number;
    targetRotationY: number;
    rotationVelocityX: number;
    rotationVelocityY: number;
    isDragging: boolean;
    lastMouseX: number;
    lastMouseY: number;
    cameraShake: { intensity: number; decay: number };
    globeWobble: { x: number; y: number; decay: number };
    basePosition: THREE.Vector3;
    cameraBreathing: { phase: number; speed: number; amplitude: number };
    autoRotationSpeed: number;
    dataStreamParticles: THREE.Points | null;
    atmosphereGlow: THREE.Mesh | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    globe: null,
    arcs: [],
    markers: [],
    impactEffects: [],
    rippleEffects: [],
    ambientParticles: null,
    animationId: null,
    clock: new THREE.Clock(),
    mouseX: 0,
    mouseY: 0,
    targetRotationX: 0,
    targetRotationY: 0,
    rotationVelocityX: 0,
    rotationVelocityY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    cameraShake: { intensity: 0, decay: 0.92 },
    globeWobble: { x: 0, y: 0, decay: 0.95 },
    basePosition: new THREE.Vector3(0, 0, 15),
    cameraBreathing: { phase: 0, speed: 0.3, amplitude: 0.15 },
    autoRotationSpeed: 0.002,
    dataStreamParticles: null,
    atmosphereGlow: null,
  });

  const statsRef = useRef({
    attackCount: 0,
    startTime: Date.now(),
    totalLoss: 0,
    criticalCount: 0,
  });

  const createExplosion = useCallback((position: THREE.Vector3, color: THREE.Color) => {
    const refs = sceneRef.current;
    if (!refs.scene || !refs.globe) return;

    const explosionGeom = new THREE.PlaneGeometry(0.8, 0.8);
    const explosionMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: color },
        progress: { value: 0 },
      },
      vertexShader: explosionShader.vertexShader,
      fragmentShader: explosionShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const explosion = new THREE.Mesh(explosionGeom, explosionMat);
    explosion.position.copy(position);
    explosion.lookAt(new THREE.Vector3(0, 0, 0));
    refs.globe.add(explosion);

    const shockwaveGeom = new THREE.PlaneGeometry(1.5, 1.5);
    const shockwaveMat = new THREE.ShaderMaterial({
      uniforms: {
        progress: { value: 0 },
        color: { value: color },
      },
      vertexShader: shockwaveShader.vertexShader,
      fragmentShader: shockwaveShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const shockwave = new THREE.Mesh(shockwaveGeom, shockwaveMat);
    shockwave.position.copy(position);
    shockwave.lookAt(new THREE.Vector3(0, 0, 0));
    refs.globe.add(shockwave);

    const flashGeom = new THREE.PlaneGeometry(1.2, 1.2);
    const flashMat = new THREE.ShaderMaterial({
      uniforms: {
        progress: { value: 0 },
        color: { value: color },
      },
      vertexShader: flashShader.vertexShader,
      fragmentShader: flashShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const flash = new THREE.Mesh(flashGeom, flashMat);
    flash.position.copy(position);
    flash.lookAt(new THREE.Vector3(0, 0, 0));
    refs.globe.add(flash);

    const particleCount = 24;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleAlphas = new Float32Array(particleCount);
    const particleVelocities = new Float32Array(particleCount * 3);
    
    const normal = position.clone().normalize();
    
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = position.x;
      particlePositions[i * 3 + 1] = position.y;
      particlePositions[i * 3 + 2] = position.z;
      particleSizes[i] = 0.08 + Math.random() * 0.12;
      particleAlphas[i] = 0.8 + Math.random() * 0.2;
      
      const tangent1 = new THREE.Vector3(1, 0, 0).cross(normal).normalize();
      const tangent2 = normal.clone().cross(tangent1).normalize();
      const angle = Math.random() * Math.PI * 2;
      const spreadAngle = Math.random() * 0.6;
      const speed = 0.3 + Math.random() * 0.5;
      
      const dir = normal.clone()
        .add(tangent1.clone().multiplyScalar(Math.cos(angle) * spreadAngle))
        .add(tangent2.clone().multiplyScalar(Math.sin(angle) * spreadAngle))
        .normalize()
        .multiplyScalar(speed);
      
      particleVelocities[i * 3] = dir.x;
      particleVelocities[i * 3 + 1] = dir.y;
      particleVelocities[i * 3 + 2] = dir.z;
    }
    
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeom.setAttribute('alpha', new THREE.BufferAttribute(particleAlphas, 1));
    particleGeom.setAttribute('velocity', new THREE.BufferAttribute(particleVelocities, 3));
    
    const particleMat = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: color },
        time: { value: 0 },
      },
      vertexShader: impactParticleShader.vertexShader,
      fragmentShader: impactParticleShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const particles = new THREE.Points(particleGeom, particleMat);
    refs.globe.add(particles);

    refs.impactEffects.push({
      explosion,
      shockwave,
      flash,
      particles,
      startTime: refs.clock.getElapsedTime(),
      position: position.clone(),
    });

    refs.cameraShake.intensity = Math.min(refs.cameraShake.intensity + 0.15, 0.5);

    refs.globeWobble.x += (Math.random() - 0.5) * 0.02;
    refs.globeWobble.y += (Math.random() - 0.5) * 0.02;

    refs.rippleEffects.push({
      position: position.clone(),
      startTime: refs.clock.getElapsedTime(),
      intensity: 1.0,
    });

    if (refs.rippleEffects.length > 8) {
      refs.rippleEffects.shift();
    }
  }, []);

  const createTrailParticles = useCallback((color: THREE.Color): THREE.Points => {
    const particleCount = 30;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      sizes[i] = 0.1 + Math.random() * 0.1;
      opacities[i] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: color },
      },
      vertexShader: trailParticleShader.vertexShader,
      fragmentShader: trailParticleShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return new THREE.Points(geometry, material);
  }, []);

  const createAmbientParticles = useCallback((): THREE.Points => {
    const particleCount = 600;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 6 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      sizes[i] = 0.02 + Math.random() * 0.04;
      opacities[i] = 0.15 + Math.random() * 0.35;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x00ffff) },
      },
      vertexShader: trailParticleShader.vertexShader,
      fragmentShader: trailParticleShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return new THREE.Points(geometry, material);
  }, []);

  const createDataStreamParticles = useCallback((): THREE.Points => {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);

    const GLOBE_RADIUS = 5;
    for (let i = 0; i < particleCount; i++) {
      const radius = GLOBE_RADIUS + 0.1 + Math.random() * 0.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      sizes[i] = 0.03 + Math.random() * 0.05;
      opacities[i] = 0.3 + Math.random() * 0.4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x00ccff) },
      },
      vertexShader: trailParticleShader.vertexShader,
      fragmentShader: trailParticleShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return new THREE.Points(geometry, material);
  }, []);

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

    const trailParticles = createTrailParticles(color);
    refs.globe.add(trailParticles);

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
      trailParticles,
      endPos: endPos.clone(),
      curve,
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
  }, [createTrailParticles]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const refs = sceneRef.current;
    const GLOBE_RADIUS = 5;

    refs.scene = new THREE.Scene();
    refs.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    refs.camera.position.copy(refs.basePosition);

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
      uniforms: { 
        time: { value: 0 },
        ripplePositions: { value: new Array(8).fill(new THREE.Vector3()) },
        rippleTimes: { value: new Array(8).fill(0) },
        rippleCount: { value: 0 },
      },
      vertexShader: earthShader.vertexShader,
      fragmentShader: earthShader.fragmentShader,
    });
    refs.globe = new THREE.Mesh(globeGeom, globeMat);
    refs.scene.add(refs.globe);

    const atmosGeom = new THREE.SphereGeometry(GLOBE_RADIUS * 1.02, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pulseIntensity: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float pulseIntensity;
        varying vec3 vNormal;
        void main() {
          float baseIntensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          float pulse = sin(time * 2.0) * 0.15 + 0.85;
          float finalIntensity = baseIntensity * (0.5 + pulseIntensity * 0.3 * pulse);
          gl_FragColor = vec4(0.0, 0.5, 1.0, finalIntensity);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(atmosGeom, atmosMat);
    refs.scene.add(atmosphere);
    refs.atmosphereGlow = atmosphere;

    const outerGlowGeom = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 32, 32);
    const outerGlowMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vNormal;
        void main() {
          float baseIntensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          float shimmer = sin(time * 1.5 + vNormal.x * 3.0) * 0.1 + 0.9;
          gl_FragColor = vec4(0.0, 0.8, 1.0, baseIntensity * 0.25 * shimmer);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const outerGlow = new THREE.Mesh(outerGlowGeom, outerGlowMat);
    refs.scene.add(outerGlow);

    refs.ambientParticles = createAmbientParticles();
    refs.scene.add(refs.ambientParticles);

    refs.dataStreamParticles = createDataStreamParticles();
    refs.globe.add(refs.dataStreamParticles);

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
    };

    const handleMouseUp = () => {
      refs.isDragging = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      refs.mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      refs.mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (refs.isDragging && refs.globe) {
        const deltaX = e.clientX - refs.lastMouseX;
        const deltaY = e.clientY - refs.lastMouseY;
        
        refs.rotationVelocityY = deltaX * 0.005;
        refs.rotationVelocityX = deltaY * 0.003;
        
        refs.lastMouseX = e.clientX;
        refs.lastMouseY = e.clientY;
      }
    };

    containerRef.current?.addEventListener('mousedown', handleMouseDown);
    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    setIsLoaded(true);

    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);
      const time = refs.clock.getElapsedTime();

      if (refs.globe) {
        const mat = refs.globe.material as THREE.ShaderMaterial;
        if (mat.uniforms?.time) mat.uniforms.time.value = time;

        if (mat.uniforms?.ripplePositions && mat.uniforms?.rippleTimes && mat.uniforms?.rippleCount) {
          const positions = refs.rippleEffects.map(r => r.position);
          const times = refs.rippleEffects.map(r => r.startTime);
          while (positions.length < 8) positions.push(new THREE.Vector3());
          while (times.length < 8) times.push(0);
          mat.uniforms.ripplePositions.value = positions;
          mat.uniforms.rippleTimes.value = times;
          mat.uniforms.rippleCount.value = refs.rippleEffects.length;
        }

        if (!refs.isDragging) {
          refs.rotationVelocityX *= 0.95;
          refs.rotationVelocityY *= 0.95;
        }

        refs.globe.rotation.y += refs.rotationVelocityY;
        refs.globe.rotation.x += refs.rotationVelocityX;

        if (autoRotate && !refs.isDragging && Math.abs(refs.rotationVelocityY) < 0.001) {
          refs.globe.rotation.y += refs.autoRotationSpeed;
        }

        if (!refs.isDragging) {
          refs.targetRotationX = refs.mouseY * 0.1;
          refs.globe.rotation.x += (refs.targetRotationX - refs.globe.rotation.x) * 0.02;
        }

        refs.globeWobble.x *= refs.globeWobble.decay;
        refs.globeWobble.y *= refs.globeWobble.decay;
        refs.globe.rotation.x += Math.sin(time * 8) * refs.globeWobble.x;
        refs.globe.rotation.y += Math.sin(time * 10) * refs.globeWobble.y;
      }

      if (refs.camera) {
        refs.cameraShake.intensity *= refs.cameraShake.decay;
        const shakeX = (Math.random() - 0.5) * refs.cameraShake.intensity;
        const shakeY = (Math.random() - 0.5) * refs.cameraShake.intensity;
        
        refs.cameraBreathing.phase += refs.cameraBreathing.speed * 0.016;
        const breathingOffset = Math.sin(refs.cameraBreathing.phase) * refs.cameraBreathing.amplitude;
        
        refs.camera.position.x = refs.basePosition.x + shakeX;
        refs.camera.position.y = refs.basePosition.y + shakeY;
        refs.camera.position.z = refs.basePosition.z + breathingOffset;
      }

      if (refs.atmosphereGlow) {
        const atmosMat = refs.atmosphereGlow.material as THREE.ShaderMaterial;
        if (atmosMat.uniforms?.time) atmosMat.uniforms.time.value = time;
        if (atmosMat.uniforms?.pulseIntensity) {
          const attackIntensity = Math.min(refs.arcs.length / 5, 1);
          atmosMat.uniforms.pulseIntensity.value = attackIntensity;
        }
      }

      if (refs.dataStreamParticles) {
        refs.dataStreamParticles.rotation.y += 0.003;
        refs.dataStreamParticles.rotation.x += 0.001;
        
        const streamPositions = refs.dataStreamParticles.geometry.getAttribute('position');
        const streamOpacities = refs.dataStreamParticles.geometry.getAttribute('opacity');
        
        for (let i = 0; i < streamPositions.count; i++) {
          const offset = i * 0.5;
          const opacity = 0.25 + Math.sin(time * 3 + offset) * 0.2;
          streamOpacities.setX(i, opacity);
        }
        streamOpacities.needsUpdate = true;
      }

      if (refs.ambientParticles) {
        refs.ambientParticles.rotation.y += 0.0002;
        refs.ambientParticles.rotation.x += 0.0001;
        
        const positions = refs.ambientParticles.geometry.getAttribute('position');
        const opacities = refs.ambientParticles.geometry.getAttribute('opacity');
        
        for (let i = 0; i < positions.count; i++) {
          const opacity = 0.2 + Math.sin(time * 2 + i * 0.1) * 0.15;
          opacities.setX(i, opacity);
        }
        opacities.needsUpdate = true;
      }

      refs.arcs = refs.arcs.filter(arc => {
        arc.progress += arc.speed;

        const fadeIn = Math.min(arc.progress * 5, 1);
        const fadeOut = 1 - Math.max((arc.progress - 0.8) * 5, 0);
        const baseOpacity = fadeIn * fadeOut;
        
        const glowIntensity = Math.sin(arc.progress * Math.PI) * 0.3 + 0.7;
        const pulseGlow = Math.sin(time * 10 + arc.progress * 20) * 0.15 + 0.85;
        
        (arc.mesh.material as THREE.LineBasicMaterial).opacity = baseOpacity * glowIntensity * pulseGlow;
        arc.marker.scale.setScalar((0.8 + glowIntensity * 0.8) * pulseGlow);

        const trailPositions = arc.trailParticles.geometry.getAttribute('position');
        const trailOpacities = arc.trailParticles.geometry.getAttribute('opacity');
        
        for (let i = trailPositions.count - 1; i > 0; i--) {
          trailPositions.setXYZ(
            i,
            trailPositions.getX(i - 1),
            trailPositions.getY(i - 1),
            trailPositions.getZ(i - 1)
          );
          trailOpacities.setX(i, trailOpacities.getX(i - 1) * 0.9);
        }
        
        const currentPoint = arc.curve.getPoint(arc.progress);
        trailPositions.setXYZ(0, currentPoint.x, currentPoint.y, currentPoint.z);
        trailOpacities.setX(0, 0.8);
        
        trailPositions.needsUpdate = true;
        trailOpacities.needsUpdate = true;

        if (arc.progress >= 1) {
          const color = new THREE.Color(attackTypes[arc.data.type].color);
          createExplosion(arc.endPos, color);

          refs.globe?.remove(arc.mesh);
          refs.globe?.remove(arc.marker);
          refs.globe?.remove(arc.trailParticles);
          arc.mesh.geometry.dispose();
          (arc.mesh.material as THREE.Material).dispose();
          (arc.marker.material as THREE.Material).dispose();
          arc.marker.geometry.dispose();
          arc.trailParticles.geometry.dispose();
          (arc.trailParticles.material as THREE.Material).dispose();
          return false;
        }

        const curve = arc.mesh.geometry.getAttribute('position');
        if (curve) {
          const idx = Math.floor(arc.progress * 49);
          const x = curve.getX(idx);
          const y = curve.getY(idx);
          const z = curve.getZ(idx);
          arc.marker.position.set(x, y, z);
        }

        return true;
      });

      refs.impactEffects = refs.impactEffects.filter(effect => {
        const age = time - effect.startTime;
        const progress = Math.min(age / 0.8, 1);

        const explosionMat = effect.explosion.material as THREE.ShaderMaterial;
        explosionMat.uniforms.progress.value = progress;
        explosionMat.uniforms.time.value = time;

        const shockwaveMat = effect.shockwave.material as THREE.ShaderMaterial;
        shockwaveMat.uniforms.progress.value = progress;

        const flashMat = effect.flash.material as THREE.ShaderMaterial;
        flashMat.uniforms.progress.value = Math.min(age / 0.3, 1);

        const particleMat = effect.particles.material as THREE.ShaderMaterial;
        particleMat.uniforms.time.value = age;
        
        const particleAlphas = effect.particles.geometry.getAttribute('alpha');
        for (let i = 0; i < particleAlphas.count; i++) {
          const baseAlpha = particleAlphas.array[i];
          particleAlphas.setX(i, Math.max(0, baseAlpha * (1 - progress * 1.2)));
        }
        particleAlphas.needsUpdate = true;

        effect.shockwave.scale.setScalar(1 + progress * 2);
        effect.flash.scale.setScalar(1 + progress * 0.5);

        if (progress >= 1) {
          refs.globe?.remove(effect.explosion);
          refs.globe?.remove(effect.shockwave);
          refs.globe?.remove(effect.flash);
          refs.globe?.remove(effect.particles);
          effect.explosion.geometry.dispose();
          (effect.explosion.material as THREE.Material).dispose();
          effect.shockwave.geometry.dispose();
          (effect.shockwave.material as THREE.Material).dispose();
          effect.flash.geometry.dispose();
          (effect.flash.material as THREE.Material).dispose();
          effect.particles.geometry.dispose();
          (effect.particles.material as THREE.Material).dispose();
          return false;
        }

        return true;
      });

      refs.rippleEffects = refs.rippleEffects.filter(ripple => {
        const age = time - ripple.startTime;
        return age < 3;
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
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      
      clearInterval(attackInterval);
      
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mouseup', handleMouseUp);
      containerRef.current?.removeEventListener('mousedown', handleMouseDown);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      
      refs.arcs.forEach(arc => {
        arc.mesh.geometry.dispose();
        (arc.mesh.material as THREE.Material).dispose();
        arc.marker.geometry.dispose();
        (arc.marker.material as THREE.Material).dispose();
        arc.trailParticles.geometry.dispose();
        (arc.trailParticles.material as THREE.Material).dispose();
      });
      refs.arcs = [];
      
      refs.markers.forEach(marker => {
        marker.geometry.dispose();
        (marker.material as THREE.Material).dispose();
      });
      refs.markers = [];
      
      refs.impactEffects.forEach(effect => {
        effect.explosion.geometry.dispose();
        (effect.explosion.material as THREE.Material).dispose();
        effect.shockwave.geometry.dispose();
        (effect.shockwave.material as THREE.Material).dispose();
        effect.flash.geometry.dispose();
        (effect.flash.material as THREE.Material).dispose();
        effect.particles.geometry.dispose();
        (effect.particles.material as THREE.Material).dispose();
      });
      refs.impactEffects = [];
      
      if (refs.ambientParticles) {
        refs.ambientParticles.geometry.dispose();
        (refs.ambientParticles.material as THREE.Material).dispose();
      }
      
      if (refs.dataStreamParticles) {
        refs.dataStreamParticles.geometry.dispose();
        (refs.dataStreamParticles.material as THREE.Material).dispose();
      }
      
      if (refs.atmosphereGlow) {
        refs.atmosphereGlow.geometry.dispose();
        (refs.atmosphereGlow.material as THREE.Material).dispose();
      }
      
      if (refs.scene) {
        refs.scene.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) {
            mesh.geometry.dispose();
          }
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
      
      refs.rippleEffects = [];
    };
  }, [addAttack, autoRotate, attackFrequency, createAmbientParticles, createDataStreamParticles, createExplosion]);

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
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {showStats && (
        <>
          <div className="absolute top-4 left-4 z-10">
            <motion.div 
              className="backdrop-blur-xl bg-black/60 border border-cyan-500/30 rounded-xl p-4 min-w-[200px]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-cyan-400 text-xs uppercase tracking-wider mb-3 font-semibold">
                Live Threat Monitor
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground">Attacks Detected</div>
                  <div className="text-2xl font-bold text-white">
                    <AnimatedCounter value={stats.totalAttacks} />
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Attacks/Second</div>
                  <motion.div 
                    className="text-xl font-bold text-cyan-400"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
                  >
                    {stats.attacksPerSecond.toFixed(1)}
                  </motion.div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Est. Financial Loss</div>
                  <div className="text-xl font-bold text-red-400">
                    <AnimatedCurrency value={stats.totalLoss} />
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Critical Threats</div>
                  <div className="text-xl font-bold text-orange-400">
                    <AnimatedCounter value={stats.criticalCount} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10">
            <motion.div 
              className="backdrop-blur-xl bg-black/60 border border-cyan-500/30 rounded-xl p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-red-500"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-xs text-cyan-400 uppercase tracking-wider font-semibold">Recent Attacks</span>
              </div>
              
              <div className="space-y-1 max-h-[120px] overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {recentAttacks.map((attack) => (
                    <motion.div
                      key={attack.id}
                      initial={{ opacity: 0, x: -20, height: 0, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, x: 20, height: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between text-xs py-1 border-b border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <motion.span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: `#${attackTypes[attack.type].color.toString(16).padStart(6, '0')}` }}
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.5 }}
                        />
                        <span className="text-white/80">
                          {attack.from.city} → {attack.to.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white/50">{attackTypes[attack.type].label}</span>
                        <motion.span 
                          className={getSeverityColor(attack.severity)}
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 0.5, repeat: 3 }}
                        >
                          {attack.severity.toUpperCase()}
                        </motion.span>
                        <span className="text-red-400">{formatCurrency(attack.estimatedLoss)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <motion.div 
              className="backdrop-blur-xl bg-black/60 border border-cyan-500/30 rounded-xl p-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-xs text-muted-foreground mb-2">Attack Types</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {Object.entries(attackTypes).map(([key, { color, label }]) => (
                  <div key={key} className="flex items-center gap-2">
                    <motion.div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: `#${color.toString(16).padStart(6, '0')}` }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                    />
                    <span className="text-xs text-white/70">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
