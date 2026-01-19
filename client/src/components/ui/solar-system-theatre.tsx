"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

interface Planet {
  name: string;
  title: string;
  description: string;
  color: number;
  emissive: number;
  size: number;
  distance: number;
  blobFrequency: number;
  blobAmplitude: number;
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
    blobFrequency: 3.0,
    blobAmplitude: 0.15,
  },
  {
    name: 'iso',
    title: 'ISO 27001',
    description: 'Audit & Certification - Navigate compliance with expert guidance from gap analysis to certification.',
    color: 0x9333ea,
    emissive: 0x220044,
    size: 1.2,
    distance: 18,
    blobFrequency: 4.0,
    blobAmplitude: 0.12,
  },
  {
    name: 'software',
    title: 'Secure Software',
    description: 'Custom Development - Build applications with security embedded from the ground up.',
    color: 0x22c55e,
    emissive: 0x003311,
    size: 1.0,
    distance: 26,
    blobFrequency: 5.0,
    blobAmplitude: 0.1,
  },
];

const blobVertexShader = `
  uniform float time;
  uniform float frequency;
  uniform float amplitude;
  uniform float hover;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Blob morphing effect
    float noise = snoise(position * frequency + time * 0.5);
    float displacement = noise * amplitude * (1.0 + hover * 0.5);
    vec3 newPosition = position + normal * displacement;
    
    vPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const blobFragmentShader = `
  uniform vec3 baseColor;
  uniform vec3 emissiveColor;
  uniform float time;
  uniform float hover;
  uniform float focus;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vec3 lightDir = normalize(vec3(0.0, 0.0, 0.0) - vPosition);
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    
    // Fresnel/rim lighting
    float rimLight = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    rimLight = pow(rimLight, 2.5);
    
    // Iridescent color shift
    float colorShift = sin(vUv.x * 10.0 + time) * 0.5 + 0.5;
    vec3 shiftedColor = mix(baseColor, baseColor * 1.3, colorShift * 0.3);
    
    // Combine lighting
    vec3 finalColor = shiftedColor * (diffuse * 0.7 + 0.3);
    finalColor += emissiveColor * (0.3 + focus * 0.4);
    finalColor += baseColor * rimLight * (0.6 + hover * 0.4);
    
    // Add glow on focus
    float glowIntensity = focus * 0.3;
    finalColor += baseColor * glowIntensity;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface PlanetMesh extends THREE.Mesh {
  userData: {
    planet: Planet;
    angle: number;
    hovered: boolean;
    atmosphere?: THREE.Mesh;
  };
}

export function SolarSystemTheatre() {
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
    sun: THREE.Mesh | null;
    planets: PlanetMesh[];
    stars: THREE.Points | null;
    nebula: THREE.Mesh | null;
    animationId: number | null;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    disposables: THREE.BufferGeometry[];
    materials: THREE.Material[];
    clock: THREE.Clock;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    sun: null,
    planets: [],
    stars: null,
    nebula: null,
    animationId: null,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    disposables: [],
    materials: [],
    clock: new THREE.Clock(),
  });

  const cameraState = useRef({
    x: 0,
    y: 8,
    z: 45,
    targetX: 0,
    targetY: 8,
    targetZ: 45,
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

    createNebula();
    createSun();
    createStars();
    createBlobPlanets();

    setIsLoaded(true);
    animate();

    // Handle scroll
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollHeight = containerRef.current.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollHeight));
      setScrollProgress(progress);

      // Determine active planet
      const planetPositions = [0.2, 0.5, 0.8];
      let newActive: Planet | null = null;
      planetPositions.forEach((pos, i) => {
        if (Math.abs(progress - pos) < 0.1) {
          newActive = planets[i];
        }
      });
      setActivePlanet(newActive);

      // Update camera target based on progress
      const angle = progress * Math.PI * 1.2;
      const radius = 45 - progress * 35;
      cameraState.current.targetZ = Math.cos(angle) * radius;
      cameraState.current.targetX = Math.sin(angle) * radius * 0.6;
      cameraState.current.targetY = 8 + Math.sin(progress * Math.PI) * 10;
      cameraState.current.lookAtY = progress * 3;
    };

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
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

    const geometry = new THREE.PlaneGeometry(400, 300, 1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x001133) },
        color2: { value: new THREE.Color(0x110033) },
        color3: { value: new THREE.Color(0x002222) },
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
          
          vec3 col = mix(color1, color2, n1);
          col = mix(col, color3, n2 * 0.4);
          
          float alpha = smoothstep(0.2, 0.8, n1) * 0.2;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    refs.nebula = new THREE.Mesh(geometry, material);
    refs.nebula.position.z = -100;
    refs.scene.add(refs.nebula);
    refs.disposables.push(geometry);
    refs.materials.push(material);
  };

  const createSun = () => {
    const refs = sceneRef.current;
    if (!refs.scene) return;

    const geometry = new THREE.IcosahedronGeometry(4, 4);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vNormal = normal;
          
          // Subtle sun pulsing
          float pulse = sin(time * 2.0) * 0.02 + 1.0;
          vec3 pos = position * pulse;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vec3 core = vec3(1.0, 0.95, 0.8);
          vec3 outer = vec3(1.0, 0.5, 0.2);
          
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          vec3 col = mix(core, outer, fresnel);
          
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    refs.sun = new THREE.Mesh(geometry, material);
    refs.scene.add(refs.sun);
    refs.disposables.push(geometry);
    refs.materials.push(material);

    // Sun glow layers
    [6, 8, 11].forEach((size, i) => {
      const glowGeom = new THREE.SphereGeometry(size, 32, 32);
      const glowMat = new THREE.ShaderMaterial({
        uniforms: {
          opacity: { value: 0.15 - i * 0.04 },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float opacity;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(1.0, 0.6, 0.2, intensity * opacity);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      refs.scene!.add(new THREE.Mesh(glowGeom, glowMat));
      refs.disposables.push(glowGeom);
      refs.materials.push(glowMat);
    });
  };

  const createStars = () => {
    const refs = sceneRef.current;
    if (!refs.scene) return;

    const count = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 40 + Math.random() * 160;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const brightness = 0.5 + Math.random() * 0.5;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });

    refs.stars = new THREE.Points(geometry, material);
    refs.scene.add(refs.stars);
    refs.disposables.push(geometry);
    refs.materials.push(material);
  };

  const createBlobPlanets = () => {
    const refs = sceneRef.current;
    if (!refs.scene) return;

    planets.forEach((planet, index) => {
      const geometry = new THREE.IcosahedronGeometry(planet.size, 4);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          frequency: { value: planet.blobFrequency },
          amplitude: { value: planet.blobAmplitude },
          baseColor: { value: new THREE.Color(planet.color) },
          emissiveColor: { value: new THREE.Color(planet.emissive) },
          hover: { value: 0 },
          focus: { value: 0 },
        },
        vertexShader: blobVertexShader,
        fragmentShader: blobFragmentShader,
      });

      const angle = (index / planets.length) * Math.PI * 2 + Math.PI * 0.3;
      const mesh = new THREE.Mesh(geometry, material) as unknown as PlanetMesh;
      mesh.position.x = Math.cos(angle) * planet.distance;
      mesh.position.z = Math.sin(angle) * planet.distance;
      mesh.position.y = Math.sin(angle * 0.5) * 2;
      mesh.userData = { planet, angle, hovered: false };

      refs.scene!.add(mesh);
      refs.planets.push(mesh);
      refs.disposables.push(geometry);
      refs.materials.push(material);

      // Orbit ring
      const orbitGeom = new THREE.RingGeometry(planet.distance - 0.02, planet.distance + 0.02, 128);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0x334455,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.12,
      });
      const orbit = new THREE.Mesh(orbitGeom, orbitMat);
      orbit.rotation.x = Math.PI / 2;
      refs.scene!.add(orbit);
      refs.disposables.push(orbitGeom);
      refs.materials.push(orbitMat);

      // Atmosphere
      const atmosGeom = new THREE.SphereGeometry(planet.size * 1.35, 32, 32);
      const atmosMat = new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color(planet.color) },
          intensity: { value: 0.4 },
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
            float glow = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            gl_FragColor = vec4(glowColor, glow * intensity);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      const atmos = new THREE.Mesh(atmosGeom, atmosMat);
      atmos.position.copy(mesh.position);
      mesh.userData.atmosphere = atmos;
      refs.scene!.add(atmos);
      refs.disposables.push(atmosGeom);
      refs.materials.push(atmosMat);
    });
  };

  const animate = useCallback(() => {
    const refs = sceneRef.current;
    refs.animationId = requestAnimationFrame(animate);

    const time = refs.clock.getElapsedTime();

    // Smooth camera movement
    const cam = cameraState.current;
    cam.x += (cam.targetX - cam.x) * 0.04;
    cam.y += (cam.targetY - cam.y) * 0.04;
    cam.z += (cam.targetZ - cam.z) * 0.04;

    const mouseX = mouseRef.current.x * 3;
    const mouseY = mouseRef.current.y * 2;

    if (refs.camera) {
      refs.camera.position.x = cam.x + mouseX;
      refs.camera.position.y = cam.y + mouseY;
      refs.camera.position.z = cam.z;
      refs.camera.lookAt(0, cam.lookAtY, 0);
    }

    // Update sun
    if (refs.sun) {
      refs.sun.rotation.y += 0.001;
      const mat = refs.sun.material as THREE.ShaderMaterial;
      if (mat.uniforms?.time) mat.uniforms.time.value = time;
    }

    // Update nebula animation
    if (refs.nebula) {
      const nebulaMat = refs.nebula.material as THREE.ShaderMaterial;
      if (nebulaMat.uniforms?.time) nebulaMat.uniforms.time.value = time;
    }

    // Update planets with blob morphing
    refs.planets.forEach((mesh) => {
      const planet = mesh.userData.planet;
      mesh.userData.angle += planet.distance * 0.00001;
      
      mesh.position.x = Math.cos(mesh.userData.angle) * planet.distance;
      mesh.position.z = Math.sin(mesh.userData.angle) * planet.distance;
      mesh.position.y = Math.sin(mesh.userData.angle * 0.5) * 2;
      mesh.rotation.y += 0.002;

      const mat = mesh.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.time.value = time;
        
        const isActive = activePlanet?.name === planet.name;
        const targetFocus = isActive ? 1 : 0;
        mat.uniforms.focus.value += (targetFocus - mat.uniforms.focus.value) * 0.05;
        
        const targetHover = mesh.userData.hovered ? 1 : 0;
        mat.uniforms.hover.value += (targetHover - mat.uniforms.hover.value) * 0.1;
      }

      if (mesh.userData.atmosphere) {
        mesh.userData.atmosphere.position.copy(mesh.position);
        const atmosMat = mesh.userData.atmosphere.material as THREE.ShaderMaterial;
        const isActive = activePlanet?.name === planet.name;
        const targetIntensity = isActive ? 0.8 : mesh.userData.hovered ? 0.6 : 0.4;
        if (atmosMat.uniforms?.intensity) {
          atmosMat.uniforms.intensity.value += (targetIntensity - atmosMat.uniforms.intensity.value) * 0.1;
        }
      }
    });

    // Rotate stars
    if (refs.stars) {
      refs.stars.rotation.y += 0.00008;
    }

    // Raycaster for hover
    if (refs.camera) {
      refs.raycaster.setFromCamera(refs.mouse, refs.camera);
      const intersects = refs.raycaster.intersectObjects(refs.planets);
      
      refs.planets.forEach((mesh) => {
        mesh.userData.hovered = intersects.some(i => i.object === mesh);
      });
    }

    if (refs.renderer && refs.scene && refs.camera) {
      refs.renderer.render(refs.scene, refs.camera);
    }
  }, [activePlanet]);

  return (
    <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <canvas ref={canvasRef} className="absolute inset-0" />
        
        {/* Progress and navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          <div className="flex items-center gap-3">
            {planets.map((planet) => (
              <div
                key={planet.name}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  activePlanet?.name === planet.name 
                    ? 'scale-150' 
                    : 'opacity-40 hover:opacity-70'
                }`}
                style={{ 
                  backgroundColor: `#${planet.color.toString(16).padStart(6, '0')}`,
                  boxShadow: activePlanet?.name === planet.name 
                    ? `0 0 15px #${planet.color.toString(16).padStart(6, '0')}` 
                    : 'none'
                }}
              />
            ))}
          </div>
          <div className="w-px h-4 bg-white/20" />
          <span className="text-xs text-muted-foreground tracking-widest uppercase font-medium">
            {scrollProgress < 0.1 ? 'Scroll to Explore' : activePlanet?.title || 'Deep Space'}
          </span>
        </div>

        {/* Planet info overlay */}
        <AnimatePresence mode="wait">
          {activePlanet && (
            <motion.div
              key={activePlanet.name}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 max-w-sm md:max-w-md z-20"
            >
              <div className="backdrop-blur-2xl bg-black/50 border border-white/10 rounded-3xl p-8 shadow-2xl">
                <motion.div 
                  className="w-14 h-1.5 rounded-full mb-5"
                  style={{ backgroundColor: `#${activePlanet.color.toString(16).padStart(6, '0')}` }}
                  initial={{ width: 0 }}
                  animate={{ width: 56 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                />
                <h2 
                  className="font-display text-3xl md:text-5xl font-bold mb-4"
                  style={{ 
                    color: `#${activePlanet.color.toString(16).padStart(6, '0')}`,
                    textShadow: `0 0 40px #${activePlanet.color.toString(16).padStart(6, '0')}50`
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

        {/* Hero title */}
        <AnimatePresence>
          {scrollProgress < 0.08 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            >
              <div className="text-center px-6">
                <motion.h1 
                  className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-halo-white mb-6"
                  style={{ textShadow: '0 0 80px rgba(0, 212, 255, 0.4)' }}
                >
                  ARICA TECH
                </motion.h1>
                <motion.p 
                  className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto"
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
