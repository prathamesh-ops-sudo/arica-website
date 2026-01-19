"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { Globe, ChevronRight } from 'lucide-react';

interface Planet {
  name: string;
  title: string;
  description: string;
  size: number;
  distance: number;
  orbitSpeed: number;
  rotationSpeed: number;
  type: 'sun' | 'rocky' | 'gas' | 'ice' | 'ringed';
  colors: {
    primary: number;
    secondary: number;
    atmosphere?: number;
  };
  scrollPosition: number;
  hasAttackGlobe?: boolean;
}

const solarSystem: Planet[] = [
  {
    name: 'sun',
    title: 'Our Vision',
    description: 'At the core of Arica Tech Security - protecting digital assets with cutting-edge innovation.',
    size: 5,
    distance: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.0005,
    type: 'sun',
    colors: { primary: 0xffcc00, secondary: 0xff6600 },
    scrollPosition: 0,
  },
  {
    name: 'mercury',
    title: 'Quick Response',
    description: 'Rapid incident response and threat mitigation - speed is our first defense.',
    size: 0.6,
    distance: 12,
    orbitSpeed: 0.0008,
    rotationSpeed: 0.002,
    type: 'rocky',
    colors: { primary: 0x8c7853, secondary: 0x6b5b47 },
    scrollPosition: 0.1,
  },
  {
    name: 'venus',
    title: 'VAPT Services',
    description: 'Vulnerability Assessment & Penetration Testing - uncovering threats in your digital atmosphere.',
    size: 0.9,
    distance: 18,
    orbitSpeed: 0.0006,
    rotationSpeed: 0.001,
    type: 'rocky',
    colors: { primary: 0xe6c87a, secondary: 0xd4a853, atmosphere: 0xffdd99 },
    scrollPosition: 0.2,
  },
  {
    name: 'earth',
    title: 'Global Threat Monitor',
    description: 'Watch cyber attacks happening in real-time across the globe. Thousands of threats are detected every second - see why VAPT services are essential.',
    size: 1.0,
    distance: 24,
    orbitSpeed: 0.0005,
    rotationSpeed: 0.003,
    type: 'rocky',
    colors: { primary: 0x1a5fb4, secondary: 0x2e8b57, atmosphere: 0x87ceeb },
    scrollPosition: 0.35,
    hasAttackGlobe: true,
  },
  {
    name: 'mars',
    title: 'Red Team Operations',
    description: 'Adversarial simulation and offensive security testing - think like the attacker.',
    size: 0.7,
    distance: 32,
    orbitSpeed: 0.0004,
    rotationSpeed: 0.003,
    type: 'rocky',
    colors: { primary: 0xcd5c5c, secondary: 0x8b4513 },
    scrollPosition: 0.45,
  },
  {
    name: 'jupiter',
    title: 'Enterprise Security',
    description: 'Massive-scale security solutions for enterprise environments - the giant protector.',
    size: 2.2,
    distance: 45,
    orbitSpeed: 0.0002,
    rotationSpeed: 0.006,
    type: 'gas',
    colors: { primary: 0xd4a574, secondary: 0x8b6914 },
    scrollPosition: 0.6,
  },
  {
    name: 'saturn',
    title: 'ISO 27001 Audit',
    description: 'Comprehensive compliance frameworks and certification support - structured protection.',
    size: 1.8,
    distance: 58,
    orbitSpeed: 0.00015,
    rotationSpeed: 0.005,
    type: 'ringed',
    colors: { primary: 0xead6b8, secondary: 0xc9a86c },
    scrollPosition: 0.75,
  },
  {
    name: 'neptune',
    title: 'Cloud Security',
    description: 'Deep cloud infrastructure protection - securing the furthest reaches of your digital universe.',
    size: 1.2,
    distance: 72,
    orbitSpeed: 0.0001,
    rotationSpeed: 0.004,
    type: 'ice',
    colors: { primary: 0x4169e1, secondary: 0x1e90ff, atmosphere: 0x00bfff },
    scrollPosition: 0.9,
  },
];

const rockyPlanetShader = {
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
    uniform vec3 primaryColor;
    uniform vec3 secondaryColor;
    uniform float time;
    uniform vec3 lightPosition;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    
    float noise(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 45.543))) * 43758.5453);
    }
    
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for(int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec3 lightDir = normalize(lightPosition - vPosition);
      float diffuse = max(dot(vNormal, lightDir), 0.0);
      
      float n = fbm(vPosition * 3.0);
      vec3 surfaceColor = mix(primaryColor, secondaryColor, n);
      
      float terminator = smoothstep(-0.1, 0.3, diffuse);
      vec3 nightSide = surfaceColor * 0.05;
      vec3 daySide = surfaceColor * (diffuse * 0.8 + 0.2);
      
      vec3 finalColor = mix(nightSide, daySide, terminator);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

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
    uniform vec3 lightPosition;
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
      vec3 lightDir = normalize(lightPosition - vPosition);
      float diffuse = max(dot(vNormal, lightDir), 0.0);
      
      vec2 uv = vec2(atan(vPosition.x, vPosition.z) / 6.28318 + 0.5, asin(vPosition.y / length(vPosition)) / 3.14159 + 0.5);
      
      float continent = fbm(uv * 8.0 + time * 0.01);
      continent = smoothstep(0.4, 0.5, continent);
      
      vec3 oceanColor = vec3(0.1, 0.3, 0.6);
      vec3 landColor = vec3(0.2, 0.5, 0.2);
      vec3 desertColor = vec3(0.8, 0.7, 0.4);
      vec3 iceColor = vec3(0.95, 0.95, 1.0);
      
      float latitude = abs(vPosition.y / length(vPosition));
      vec3 surfaceColor = mix(oceanColor, landColor, continent);
      surfaceColor = mix(surfaceColor, desertColor, continent * smoothstep(0.2, 0.5, fbm(uv * 12.0)));
      surfaceColor = mix(surfaceColor, iceColor, smoothstep(0.7, 0.9, latitude));
      
      float clouds = fbm(uv * 6.0 + time * 0.05);
      clouds = smoothstep(0.5, 0.7, clouds);
      surfaceColor = mix(surfaceColor, vec3(1.0), clouds * 0.4);
      
      float terminator = smoothstep(-0.1, 0.3, diffuse);
      vec3 nightSide = vec3(0.02, 0.02, 0.05);
      float cityLights = step(0.7, fbm(uv * 20.0)) * continent * (1.0 - terminator);
      nightSide += vec3(1.0, 0.9, 0.5) * cityLights * 0.5;
      
      vec3 daySide = surfaceColor * (diffuse * 0.8 + 0.2);
      vec3 finalColor = mix(nightSide, daySide, terminator);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

const gasGiantShader = {
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
    uniform vec3 primaryColor;
    uniform vec3 secondaryColor;
    uniform float time;
    uniform vec3 lightPosition;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      vec3 lightDir = normalize(lightPosition - vPosition);
      float diffuse = max(dot(vNormal, lightDir), 0.0);
      
      float latitude = vPosition.y / length(vPosition);
      float bands = sin(latitude * 30.0 + time * 0.5) * 0.5 + 0.5;
      bands += sin(latitude * 15.0 - time * 0.3) * 0.3;
      bands = clamp(bands, 0.0, 1.0);
      
      float storm = smoothstep(0.7, 0.8, noise(vec2(latitude * 5.0, time * 0.1)));
      
      vec3 surfaceColor = mix(primaryColor, secondaryColor, bands);
      surfaceColor = mix(surfaceColor, vec3(0.9, 0.5, 0.3), storm * 0.5);
      
      float terminator = smoothstep(-0.1, 0.3, diffuse);
      vec3 nightSide = surfaceColor * 0.1;
      vec3 daySide = surfaceColor * (diffuse * 0.7 + 0.3);
      
      vec3 finalColor = mix(nightSide, daySide, terminator);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

const sunShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec2 vUv;
    uniform float time;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      
      float displacement = sin(position.x * 10.0 + time) * sin(position.y * 10.0 + time) * sin(position.z * 10.0 + time) * 0.05;
      vec3 newPosition = position + normal * displacement;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 primaryColor;
    uniform vec3 secondaryColor;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      float n = noise(vUv * 20.0 + time * 0.5);
      float flare = noise(vUv * 5.0 + time * 2.0);
      
      vec3 core = vec3(1.0, 1.0, 0.9);
      vec3 mid = primaryColor;
      vec3 outer = secondaryColor;
      
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      vec3 color = mix(core, mid, fresnel * 0.5 + n * 0.3);
      color = mix(color, outer, fresnel);
      color += vec3(1.0, 0.5, 0.0) * flare * 0.3;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

const iceGiantShader = {
  vertexShader: rockyPlanetShader.vertexShader,
  fragmentShader: `
    uniform vec3 primaryColor;
    uniform vec3 secondaryColor;
    uniform float time;
    uniform vec3 lightPosition;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vec3 lightDir = normalize(lightPosition - vPosition);
      float diffuse = max(dot(vNormal, lightDir), 0.0);
      
      float latitude = vPosition.y / length(vPosition);
      float bands = sin(latitude * 20.0 + time * 0.2) * 0.5 + 0.5;
      
      vec3 surfaceColor = mix(primaryColor, secondaryColor, bands * 0.4);
      
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
      surfaceColor += vec3(0.3, 0.5, 0.8) * fresnel * 0.4;
      
      float terminator = smoothstep(-0.1, 0.3, diffuse);
      vec3 nightSide = surfaceColor * 0.1;
      vec3 daySide = surfaceColor * (diffuse * 0.7 + 0.3);
      
      vec3 finalColor = mix(nightSide, daySide, terminator);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

interface PlanetMesh extends THREE.Mesh {
  userData: {
    planet: Planet;
    angle: number;
    ring?: THREE.Mesh;
    atmosphere?: THREE.Mesh;
    clouds?: THREE.Mesh;
  };
}

export function RealisticSolarSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePlanet, setActivePlanet] = useState<Planet | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    planets: PlanetMesh[];
    stars: THREE.Points | null;
    animationId: number | null;
    clock: THREE.Clock;
    disposables: THREE.BufferGeometry[];
    materials: THREE.Material[];
  }>({
    scene: null,
    camera: null,
    renderer: null,
    planets: [],
    stars: null,
    animationId: null,
    clock: new THREE.Clock(),
    disposables: [],
    materials: [],
  });

  const cameraState = useRef({
    x: 0,
    y: 10,
    z: 80,
    targetX: 0,
    targetY: 10,
    targetZ: 80,
    lookAtX: 0,
    lookAtY: 0,
    lookAtZ: 0,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const refs = sceneRef.current;

    refs.scene = new THREE.Scene();
    refs.scene.background = new THREE.Color(0x000005);

    refs.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    refs.camera.position.set(0, 10, 80);

    refs.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    refs.renderer.toneMappingExposure = 1.2;

    const ambientLight = new THREE.AmbientLight(0x111122, 0.3);
    refs.scene.add(ambientLight);

    createStarfield();
    createPlanets();

    setIsLoaded(true);
    animate();

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollHeight = containerRef.current.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollHeight));
      setScrollProgress(progress);

      let newActive: Planet | null = null;
      solarSystem.forEach((planet) => {
        const dist = Math.abs(progress - planet.scrollPosition);
        if (dist < 0.06 && planet.name !== 'sun') {
          newActive = planet;
        }
      });
      setActivePlanet(newActive);

      updateCameraForScroll(progress);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      if (refs.camera && refs.renderer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      refs.disposables.forEach(g => g.dispose());
      refs.materials.forEach(m => m.dispose());
      refs.renderer?.dispose();
    };
  }, []);

  const updateCameraForScroll = (progress: number) => {
    const cam = cameraState.current;
    
    const orbitAngle = progress * Math.PI * 2;
    const baseRadius = 80 - progress * 60;
    const heightWave = Math.sin(progress * Math.PI * 3) * 15;
    
    cam.targetX = Math.sin(orbitAngle) * baseRadius * 0.4;
    cam.targetZ = Math.cos(orbitAngle) * baseRadius;
    cam.targetY = 10 + heightWave;
    
    const lookAtProgress = progress * (solarSystem.length - 1);
    const planetIndex = Math.min(Math.floor(lookAtProgress), solarSystem.length - 2);
    const planetLerp = lookAtProgress - planetIndex;
    
    const currentPlanet = solarSystem[planetIndex + 1];
    const nextPlanet = solarSystem[Math.min(planetIndex + 2, solarSystem.length - 1)];
    
    const currentAngle = (planetIndex / solarSystem.length) * Math.PI * 2;
    const nextAngle = ((planetIndex + 1) / solarSystem.length) * Math.PI * 2;
    
    cam.lookAtX = THREE.MathUtils.lerp(
      Math.cos(currentAngle) * currentPlanet.distance,
      Math.cos(nextAngle) * nextPlanet.distance,
      planetLerp
    ) * 0.3;
    cam.lookAtZ = THREE.MathUtils.lerp(
      Math.sin(currentAngle) * currentPlanet.distance,
      Math.sin(nextAngle) * nextPlanet.distance,
      planetLerp
    ) * 0.3;
  };

  const createStarfield = () => {
    const refs = sceneRef.current;
    if (!refs.scene) return;

    const starCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const radius = 200 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const colorChoice = Math.random();
      if (colorChoice > 0.95) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 0.6;
      } else if (colorChoice > 0.9) {
        colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1.0;
      } else {
        const brightness = 0.5 + Math.random() * 0.5;
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness;
        colors[i * 3 + 2] = brightness;
      }

      sizes[i] = 0.3 + Math.random() * 0.7;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    refs.stars = new THREE.Points(geometry, material);
    refs.scene.add(refs.stars);
    refs.disposables.push(geometry);
    refs.materials.push(material);
  };

  const createPlanets = () => {
    const refs = sceneRef.current;
    if (!refs.scene) return;

    solarSystem.forEach((planet, index) => {
      let material: THREE.ShaderMaterial;
      const geometry = new THREE.SphereGeometry(planet.size, 64, 64);
      refs.disposables.push(geometry);

      const uniforms = {
        time: { value: 0 },
        primaryColor: { value: new THREE.Color(planet.colors.primary) },
        secondaryColor: { value: new THREE.Color(planet.colors.secondary) },
        lightPosition: { value: new THREE.Vector3(0, 0, 0) },
      };

      switch (planet.type) {
        case 'sun':
          material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: sunShader.vertexShader,
            fragmentShader: sunShader.fragmentShader,
          });
          break;
        case 'gas':
          material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: gasGiantShader.vertexShader,
            fragmentShader: gasGiantShader.fragmentShader,
          });
          break;
        case 'ice':
          material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: iceGiantShader.vertexShader,
            fragmentShader: iceGiantShader.fragmentShader,
          });
          break;
        case 'rocky':
          if (planet.name === 'earth') {
            material = new THREE.ShaderMaterial({
              uniforms,
              vertexShader: earthShader.vertexShader,
              fragmentShader: earthShader.fragmentShader,
            });
          } else {
            material = new THREE.ShaderMaterial({
              uniforms,
              vertexShader: rockyPlanetShader.vertexShader,
              fragmentShader: rockyPlanetShader.fragmentShader,
            });
          }
          break;
        case 'ringed':
          material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: gasGiantShader.vertexShader,
            fragmentShader: gasGiantShader.fragmentShader,
          });
          break;
        default:
          material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: rockyPlanetShader.vertexShader,
            fragmentShader: rockyPlanetShader.fragmentShader,
          });
      }

      refs.materials.push(material);

      const mesh = new THREE.Mesh(geometry, material) as unknown as PlanetMesh;
      const angle = (index / solarSystem.length) * Math.PI * 2;
      mesh.position.x = Math.cos(angle) * planet.distance;
      mesh.position.z = Math.sin(angle) * planet.distance;
      mesh.userData = { planet, angle };

      refs.scene!.add(mesh);
      refs.planets.push(mesh);

      if (planet.type === 'sun') {
        const sunLight = new THREE.PointLight(0xffcc66, 3, 200);
        sunLight.position.set(0, 0, 0);
        refs.scene!.add(sunLight);

        [6, 8, 10, 12].forEach((size, i) => {
          const glowGeom = new THREE.SphereGeometry(size, 32, 32);
          const glowMat = new THREE.ShaderMaterial({
            uniforms: {
              glowColor: { value: new THREE.Color(0xffaa33) },
              intensity: { value: 0.12 - i * 0.025 },
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
              uniform float intensity;
              varying vec3 vNormal;
              void main() {
                float glow = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                gl_FragColor = vec4(glowColor, glow * intensity);
              }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
          });
          const glowMesh = new THREE.Mesh(glowGeom, glowMat);
          refs.scene!.add(glowMesh);
          refs.disposables.push(glowGeom);
          refs.materials.push(glowMat);
        });
      }

      if (planet.type === 'ringed') {
        const ringGeom = new THREE.RingGeometry(planet.size * 1.4, planet.size * 2.2, 64);
        const ringMat = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec2 vUv;
            uniform float time;
            
            float noise(float p) {
              return fract(sin(p * 12.9898) * 43758.5453);
            }
            
            void main() {
              float r = length(vUv - 0.5) * 2.0;
              
              float rings = 0.0;
              rings += sin(r * 50.0) * 0.5 + 0.5;
              rings *= sin(r * 30.0 + 1.0) * 0.5 + 0.5;
              rings *= noise(r * 100.0) * 0.3 + 0.7;
              
              vec3 ringColor = mix(vec3(0.8, 0.7, 0.5), vec3(0.6, 0.5, 0.4), rings);
              
              float alpha = smoothstep(0.3, 0.35, r) * smoothstep(1.0, 0.9, r);
              alpha *= rings * 0.7 + 0.3;
              
              gl_FragColor = vec4(ringColor, alpha * 0.8);
            }
          `,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false,
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2.2;
        ring.position.copy(mesh.position);
        mesh.userData.ring = ring;
        refs.scene!.add(ring);
        refs.disposables.push(ringGeom);
        refs.materials.push(ringMat);
      }

      if (planet.colors.atmosphere) {
        const atmosGeom = new THREE.SphereGeometry(planet.size * 1.15, 32, 32);
        const atmosMat = new THREE.ShaderMaterial({
          uniforms: {
            atmosphereColor: { value: new THREE.Color(planet.colors.atmosphere) },
          },
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 atmosphereColor;
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
              gl_FragColor = vec4(atmosphereColor, intensity * 0.5);
            }
          `,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });
        const atmosphere = new THREE.Mesh(atmosGeom, atmosMat);
        atmosphere.position.copy(mesh.position);
        mesh.userData.atmosphere = atmosphere;
        refs.scene!.add(atmosphere);
        refs.disposables.push(atmosGeom);
        refs.materials.push(atmosMat);
      }

      const orbitGeom = new THREE.RingGeometry(planet.distance - 0.02, planet.distance + 0.02, 128);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0x333344,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15,
      });
      const orbit = new THREE.Mesh(orbitGeom, orbitMat);
      orbit.rotation.x = Math.PI / 2;
      if (planet.distance > 0) {
        refs.scene!.add(orbit);
      }
      refs.disposables.push(orbitGeom);
      refs.materials.push(orbitMat);
    });
  };

  const animate = useCallback(() => {
    const refs = sceneRef.current;
    refs.animationId = requestAnimationFrame(animate);

    const time = refs.clock.getElapsedTime();
    const cam = cameraState.current;
    
    cam.x += (cam.targetX - cam.x) * 0.03;
    cam.y += (cam.targetY - cam.y) * 0.03;
    cam.z += (cam.targetZ - cam.z) * 0.03;

    const mouseX = mouseRef.current.x * 5;
    const mouseY = mouseRef.current.y * 3;

    if (refs.camera) {
      refs.camera.position.x = cam.x + mouseX;
      refs.camera.position.y = cam.y + mouseY;
      refs.camera.position.z = cam.z;
      refs.camera.lookAt(cam.lookAtX, cam.lookAtY, cam.lookAtZ);
    }

    refs.planets.forEach((mesh) => {
      const planet = mesh.userData.planet;
      
      if (planet.distance > 0) {
        mesh.userData.angle += planet.orbitSpeed;
        mesh.position.x = Math.cos(mesh.userData.angle) * planet.distance;
        mesh.position.z = Math.sin(mesh.userData.angle) * planet.distance;
      }
      
      mesh.rotation.y += planet.rotationSpeed;

      const mat = mesh.material as THREE.ShaderMaterial;
      if (mat.uniforms?.time) mat.uniforms.time.value = time;

      if (mesh.userData.ring) {
        mesh.userData.ring.position.copy(mesh.position);
        const ringMat = mesh.userData.ring.material as THREE.ShaderMaterial;
        if (ringMat.uniforms?.time) ringMat.uniforms.time.value = time;
      }

      if (mesh.userData.atmosphere) {
        mesh.userData.atmosphere.position.copy(mesh.position);
      }
    });

    if (refs.stars) {
      refs.stars.rotation.y += 0.00002;
    }

    if (refs.renderer && refs.scene && refs.camera) {
      refs.renderer.render(refs.scene, refs.camera);
    }
  }, []);

  const getColorHex = (planet: Planet) => `#${planet.colors.primary.toString(16).padStart(6, '0')}`;

  return (
    <div ref={containerRef} className="relative" style={{ height: '800vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Initializing Solar System...</p>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="absolute inset-0" />
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-2 backdrop-blur-xl bg-black/40 rounded-full px-4 py-2 border border-white/10">
            {solarSystem.slice(1).map((planet) => (
              <div
                key={planet.name}
                className={`w-2 h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  activePlanet?.name === planet.name ? 'scale-150' : 'opacity-40 hover:opacity-70'
                }`}
                style={{ 
                  backgroundColor: getColorHex(planet),
                  boxShadow: activePlanet?.name === planet.name 
                    ? `0 0 12px ${getColorHex(planet)}` 
                    : 'none'
                }}
                title={planet.title}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activePlanet && (
            <motion.div
              key={activePlanet.name}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.9 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 max-w-sm md:max-w-md z-20"
            >
              <div className="backdrop-blur-2xl bg-black/60 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                <motion.div 
                  className="w-16 h-1.5 rounded-full mb-5"
                  style={{ backgroundColor: getColorHex(activePlanet) }}
                  initial={{ width: 0 }}
                  animate={{ width: 64 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <h2 
                  className="font-display text-2xl md:text-4xl font-bold mb-3 capitalize"
                  style={{ 
                    color: getColorHex(activePlanet),
                    textShadow: `0 0 40px ${getColorHex(activePlanet)}60`
                  }}
                >
                  {activePlanet.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {activePlanet.description}
                </p>
                {activePlanet.hasAttackGlobe && (
                  <Link href="/attack-globe">
                    <a 
                      className="mt-5 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-5 py-3 rounded-full hover:opacity-90 transition-all group"
                      data-testid="link-view-attack-globe"
                    >
                      <Globe className="w-4 h-4" />
                      <span>View Live Attack Globe</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Link>
                )}
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground/60">
                  <span className="uppercase tracking-wider">{activePlanet.name}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="capitalize">{activePlanet.type}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {scrollProgress < 0.05 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            >
              <div className="text-center px-6">
                <motion.h1 
                  className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-halo-white mb-6"
                  style={{ textShadow: '0 0 100px rgba(255, 200, 100, 0.4)' }}
                >
                  ARICA TECH
                </motion.h1>
                <motion.p 
                  className="text-lg md:text-2xl text-muted-foreground max-w-lg mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Journey Through Our Security Universe
                </motion.p>
                <motion.div
                  className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span>Scroll to explore</span>
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    ↓
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
