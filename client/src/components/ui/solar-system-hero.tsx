"use client";

import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

interface Planet {
  name: string;
  title: string;
  description: string;
  color: number;
  emissive: number;
  size: number;
  distance: number;
  orbitSpeed: number;
  rotationSpeed: number;
  scrollPosition: number;
}

const planets: Planet[] = [
  {
    name: 'vapt',
    title: 'VAPT',
    description: 'Vulnerability Assessment & Penetration Testing - Uncover security weaknesses before attackers do.',
    color: 0x00d4ff,
    emissive: 0x003344,
    size: 1.4,
    distance: 10,
    orbitSpeed: 0.0002,
    rotationSpeed: 0.002,
    scrollPosition: 0.25,
  },
  {
    name: 'iso',
    title: 'ISO 27001',
    description: 'Audit & Certification - Navigate compliance with expert guidance from gap analysis to certification.',
    color: 0x9333ea,
    emissive: 0x220044,
    size: 1.2,
    distance: 18,
    orbitSpeed: 0.00015,
    rotationSpeed: 0.0015,
    scrollPosition: 0.5,
  },
  {
    name: 'software',
    title: 'Secure Software',
    description: 'Custom Development - Build applications with security embedded from the ground up.',
    color: 0x22c55e,
    emissive: 0x003311,
    size: 1.0,
    distance: 26,
    orbitSpeed: 0.0001,
    rotationSpeed: 0.001,
    scrollPosition: 0.75,
  },
];

interface PlanetUserData {
  planet: Planet;
  angle: number;
  hovered: boolean;
  baseScale: number;
  glow?: THREE.Mesh;
  atmosphere?: THREE.Mesh;
}

class PlanetMeshClass extends THREE.Mesh {
  declare userData: PlanetUserData;
}

function createPlanetMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  userData: PlanetUserData
): PlanetMeshClass {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = userData;
  return mesh as PlanetMeshClass;
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading Experience...</p>
      </div>
    </div>
  );
}

export function SolarSystemHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePlanet, setActivePlanet] = useState<Planet | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    sun: THREE.Mesh | null;
    sunGlow: THREE.Mesh | null;
    planets: PlanetMeshClass[];
    stars: THREE.Points | null;
    nebula: THREE.Mesh | null;
    dustParticles: THREE.Points | null;
    animationId: number | null;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    disposables: THREE.BufferGeometry[];
    materials: THREE.Material[];
  }>({
    scene: null,
    camera: null,
    renderer: null,
    sun: null,
    sunGlow: null,
    planets: [],
    stars: null,
    nebula: null,
    dustParticles: null,
    animationId: null,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    disposables: [],
    materials: [],
  });

  const cameraPath = useRef({
    progress: 0,
    targetX: 0,
    targetY: 8,
    targetZ: 45,
    currentX: 0,
    currentY: 8,
    currentZ: 45,
    lookAtY: 0,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const refs = sceneRef.current;

    refs.scene = new THREE.Scene();
    refs.scene.background = new THREE.Color(0x020408);

    refs.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    refs.camera.position.set(0, 8, 45);

    refs.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: window.devicePixelRatio < 2,
      alpha: false,
      powerPreference: 'high-performance',
    });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    refs.renderer.toneMappingExposure = 1.0;

    const ambientLight = new THREE.AmbientLight(0x0a0a20, 0.4);
    refs.scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffbb66, 3, 200);
    sunLight.position.set(0, 0, 0);
    refs.scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x00aaff, 0.3);
    rimLight.position.set(20, 10, -30);
    refs.scene.add(rimLight);

    createNebula();
    createSun();
    createStars();
    createDustParticles();
    createPlanets();

    setIsLoaded(true);
    animate();
    setupScrollTrigger();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      refs.mouse.x = mouseRef.current.x;
      refs.mouse.y = mouseRef.current.y;
    };

    const handleResize = () => {
      if (refs.camera && refs.renderer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }

      refs.disposables.forEach(g => g.dispose());
      refs.materials.forEach(m => m.dispose());
      refs.renderer?.dispose();
    };
  }, []);

  const createNebula = () => {
    const refs = sceneRef.current;
    if (!refs.scene) return;

    const nebulaGeometry = new THREE.PlaneGeometry(300, 200, 1, 1);
    const nebulaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x001133) },
        color2: { value: new THREE.Color(0x110022) },
        color3: { value: new THREE.Color(0x002211) },
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
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec2 vUv;
        
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          vec2 uv = vUv;
          float n1 = noise(uv * 3.0 + time * 0.02);
          float n2 = noise(uv * 5.0 - time * 0.01);
          float n3 = noise(uv * 7.0 + time * 0.015);
          
          vec3 col = mix(color1, color2, n1 * 0.5 + 0.5);
          col = mix(col, color3, n2 * 0.3);
          
          float alpha = smoothstep(0.3, 0.7, n3) * 0.15;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    refs.nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    refs.nebula.position.z = -80;
    refs.scene.add(refs.nebula);
    refs.disposables.push(nebulaGeometry);
    refs.materials.push(nebulaMaterial);
  };

  const createSun = () => {
    const refs = sceneRef.current;
    if (!refs.scene) return;

    const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
    const sunMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          vec2 uv = vUv;
          float n = noise(uv * 10.0 + time);
          vec3 core = vec3(1.0, 0.9, 0.6);
          vec3 outer = vec3(1.0, 0.4, 0.1);
          vec3 col = mix(core, outer, n * 0.3);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    refs.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    refs.scene.add(refs.sun);
    refs.disposables.push(sunGeometry);
    refs.materials.push(sunMaterial);

    const glowLayers = [
      { size: 5.5, opacity: 0.15, color: new THREE.Color(0xffcc66) },
      { size: 7, opacity: 0.08, color: new THREE.Color(0xff8833) },
      { size: 9, opacity: 0.04, color: new THREE.Color(0xff4400) },
    ];

    glowLayers.forEach(layer => {
      const glowGeometry = new THREE.SphereGeometry(layer.size, 32, 32);
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: layer.color },
          opacity: { value: layer.opacity },
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
          uniform float opacity;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(glowColor, intensity * opacity);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });

      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      refs.scene!.add(glow);
      refs.disposables.push(glowGeometry);
      refs.materials.push(glowMaterial);
    });
  };

  const createStars = () => {
    const refs = sceneRef.current;
    if (!refs.scene) return;

    const layers = [
      { count: 1500, size: 0.3, spread: 200, speed: 0.00005 },
      { count: 1000, size: 0.5, spread: 150, speed: 0.0001 },
      { count: 500, size: 0.8, spread: 100, speed: 0.00015 },
    ];

    layers.forEach((layer, i) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(layer.count * 3);
      const colors = new Float32Array(layer.count * 3);
      const sizes = new Float32Array(layer.count);

      for (let j = 0; j < layer.count; j++) {
        const radius = 30 + Math.random() * layer.spread;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[j * 3 + 2] = radius * Math.cos(phi);

        const brightness = 0.4 + Math.random() * 0.6;
        const tint = Math.random();
        colors[j * 3] = brightness * (0.8 + tint * 0.2);
        colors[j * 3 + 1] = brightness;
        colors[j * 3 + 2] = brightness * (0.9 + (1 - tint) * 0.1);

        sizes[j] = layer.size * (0.5 + Math.random() * 0.5);
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: layer.size,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
      });

      const stars = new THREE.Points(geometry, material);
      (stars as any).rotationSpeed = layer.speed;
      refs.scene!.add(stars);
      refs.disposables.push(geometry);
      refs.materials.push(material);

      if (i === 0) refs.stars = stars;
    });
  };

  const createDustParticles = () => {
    const refs = sceneRef.current;
    if (!refs.scene) return;

    const count = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      color: 0x88aacc,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
    });

    refs.dustParticles = new THREE.Points(geometry, material);
    refs.scene.add(refs.dustParticles);
    refs.disposables.push(geometry);
    refs.materials.push(material);
  };

  const createPlanets = () => {
    const refs = sceneRef.current;
    if (!refs.scene) return;

    planets.forEach((planet, index) => {
      const geometry = new THREE.SphereGeometry(planet.size, 48, 48);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          baseColor: { value: new THREE.Color(planet.color) },
          emissiveColor: { value: new THREE.Color(planet.emissive) },
          time: { value: 0 },
          sunPosition: { value: new THREE.Vector3(0, 0, 0) },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 baseColor;
          uniform vec3 emissiveColor;
          uniform float time;
          uniform vec3 sunPosition;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;
          
          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          void main() {
            vec3 lightDir = normalize(sunPosition - vPosition);
            float diffuse = max(dot(vNormal, lightDir), 0.0);
            
            float n = noise(vUv * 20.0 + time * 0.1);
            vec3 surfaceColor = mix(baseColor, baseColor * 1.2, n * 0.3);
            
            float rimLight = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
            rimLight = pow(rimLight, 3.0);
            
            vec3 finalColor = surfaceColor * (diffuse * 0.8 + 0.2);
            finalColor += emissiveColor * 0.3;
            finalColor += baseColor * rimLight * 0.5;
            
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
      });

      const angle = (index / planets.length) * Math.PI * 2 + Math.PI * 0.5;
      const userData: PlanetUserData = {
        planet,
        angle,
        hovered: false,
        baseScale: 1,
      };

      const mesh = createPlanetMesh(geometry, material, userData);
      mesh.position.x = Math.cos(angle) * planet.distance;
      mesh.position.z = Math.sin(angle) * planet.distance;
      mesh.position.y = Math.sin(angle * 0.5) * 2;

      refs.scene!.add(mesh);
      refs.planets.push(mesh);
      refs.disposables.push(geometry);
      refs.materials.push(material);

      const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.03, planet.distance + 0.03, 128);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x334455,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15,
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      refs.scene!.add(orbit);
      refs.disposables.push(orbitGeometry);
      refs.materials.push(orbitMaterial);

      const atmosphereGeometry = new THREE.SphereGeometry(planet.size * 1.25, 32, 32);
      const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color(planet.color) },
          intensity: { value: 0.5 },
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
            float glow = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(glowColor, glow * intensity);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });

      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      atmosphere.position.copy(mesh.position);
      mesh.userData.atmosphere = atmosphere;
      refs.scene!.add(atmosphere);
      refs.disposables.push(atmosphereGeometry);
      refs.materials.push(atmosphereMaterial);
    });
  };

  const setupScrollTrigger = () => {
    if (!containerRef.current) return;

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress;
        setScrollProgress(progress);
        cameraPath.current.progress = progress;

        const totalAngle = Math.PI * 1.2;
        const angle = progress * totalAngle - Math.PI * 0.1;
        const baseRadius = 45 - progress * 35;
        const heightCurve = Math.sin(progress * Math.PI) * 12;

        cameraPath.current.targetZ = Math.cos(angle) * baseRadius;
        cameraPath.current.targetX = Math.sin(angle) * baseRadius * 0.6;
        cameraPath.current.targetY = 8 + heightCurve;
        cameraPath.current.lookAtY = progress * 3;

        let newActivePlanet: Planet | null = null;
        planets.forEach(planet => {
          const distance = Math.abs(progress - planet.scrollPosition);
          if (distance < 0.12) {
            newActivePlanet = planet;
          }
        });
        setActivePlanet(newActivePlanet);
      },
    });
  };

  const animate = useCallback(() => {
    const refs = sceneRef.current;
    refs.animationId = requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    const cam = cameraPath.current;
    cam.currentX += (cam.targetX - cam.currentX) * 0.04;
    cam.currentY += (cam.targetY - cam.currentY) * 0.04;
    cam.currentZ += (cam.targetZ - cam.currentZ) * 0.04;

    const mouseX = mouseRef.current.x * 3;
    const mouseY = mouseRef.current.y * 2;

    if (refs.camera) {
      refs.camera.position.x = cam.currentX + mouseX;
      refs.camera.position.y = cam.currentY + mouseY;
      refs.camera.position.z = cam.currentZ;
      refs.camera.lookAt(0, cam.lookAtY, 0);
    }

    if (refs.sun) {
      refs.sun.rotation.y += 0.0005;
      const sunMat = refs.sun.material as THREE.ShaderMaterial;
      if (sunMat.uniforms?.time) {
        sunMat.uniforms.time.value = time;
      }
    }

    if (refs.nebula) {
      const nebulaMat = refs.nebula.material as THREE.ShaderMaterial;
      if (nebulaMat.uniforms?.time) {
        nebulaMat.uniforms.time.value = time;
      }
    }

    refs.planets.forEach((mesh) => {
      const planet = mesh.userData.planet;
      mesh.userData.angle += planet.orbitSpeed;
      
      mesh.position.x = Math.cos(mesh.userData.angle) * planet.distance;
      mesh.position.z = Math.sin(mesh.userData.angle) * planet.distance;
      mesh.position.y = Math.sin(mesh.userData.angle * 0.5) * 2;
      mesh.rotation.y += planet.rotationSpeed;

      const mat = mesh.material as THREE.ShaderMaterial;
      if (mat.uniforms?.time) {
        mat.uniforms.time.value = time;
      }

      if (mesh.userData.atmosphere) {
        mesh.userData.atmosphere.position.copy(mesh.position);
        
        const isActive = activePlanet?.name === planet.name;
        const targetIntensity = isActive ? 0.8 : mesh.userData.hovered ? 0.7 : 0.5;
        const atmosMat = mesh.userData.atmosphere.material as THREE.ShaderMaterial;
        if (atmosMat.uniforms?.intensity) {
          atmosMat.uniforms.intensity.value += (targetIntensity - atmosMat.uniforms.intensity.value) * 0.1;
        }
      }
    });

    refs.scene?.children.forEach(child => {
      if (child instanceof THREE.Points && (child as any).rotationSpeed) {
        child.rotation.y += (child as any).rotationSpeed;
      }
    });

    if (refs.dustParticles) {
      refs.dustParticles.rotation.y += 0.0002;
      const positions = refs.dustParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * 0.001;
      }
      refs.dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    if (refs.camera) {
      refs.raycaster.setFromCamera(refs.mouse, refs.camera);
      const intersects = refs.raycaster.intersectObjects(refs.planets);
      
      refs.planets.forEach((mesh) => {
        const wasHovered = mesh.userData.hovered;
        mesh.userData.hovered = intersects.some(i => i.object === mesh);
        
        if (mesh.userData.hovered && !wasHovered) {
          gsap.to(mesh.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.4, ease: 'power2.out' });
        } else if (!mesh.userData.hovered && wasHovered) {
          gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.4, ease: 'power2.out' });
        }
      });
    }

    if (refs.renderer && refs.scene && refs.camera) {
      refs.renderer.render(refs.scene, refs.camera);
    }
  }, [activePlanet]);

  return (
    <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {!isLoaded && <LoadingFallback />}
        <canvas ref={canvasRef} className="absolute inset-0" />
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          <div className="flex items-center gap-3">
            {planets.map((planet, i) => (
              <div
                key={planet.name}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activePlanet?.name === planet.name 
                    ? 'scale-150' 
                    : 'opacity-40'
                }`}
                style={{ 
                  backgroundColor: `#${planet.color.toString(16).padStart(6, '0')}`,
                  boxShadow: activePlanet?.name === planet.name 
                    ? `0 0 10px #${planet.color.toString(16).padStart(6, '0')}` 
                    : 'none'
                }}
              />
            ))}
          </div>
          <div className="w-px h-4 bg-white/20" />
          <span className="text-xs text-muted-foreground tracking-widest uppercase">
            {scrollProgress < 0.1 ? 'Scroll to Explore' : activePlanet?.title || 'Deep Space'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {activePlanet && (
            <motion.div
              key={activePlanet.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 max-w-sm md:max-w-md z-20"
            >
              <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                <div 
                  className="w-12 h-1 rounded-full mb-4"
                  style={{ backgroundColor: `#${activePlanet.color.toString(16).padStart(6, '0')}` }}
                />
                <h2 
                  className="font-display text-3xl md:text-4xl font-bold mb-3"
                  style={{ 
                    color: `#${activePlanet.color.toString(16).padStart(6, '0')}`,
                    textShadow: `0 0 30px #${activePlanet.color.toString(16).padStart(6, '0')}40`
                  }}
                >
                  {activePlanet.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {activePlanet.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {scrollProgress < 0.08 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            >
              <div className="text-center px-6">
                <motion.h1 
                  className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-halo-white mb-4"
                  style={{ textShadow: '0 0 60px rgba(0, 212, 255, 0.3)' }}
                >
                  ARICA TECH
                </motion.h1>
                <motion.p 
                  className="text-lg md:text-xl text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Navigate the Universe of Security
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
