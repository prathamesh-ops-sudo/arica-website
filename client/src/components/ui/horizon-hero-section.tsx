"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'wouter';
import { useHyperspaceTransition } from './hyperspace-transition';
import { isWebGLAvailable } from '@/lib/webgl-utils';
import EnergyBeam from './energy-beam';
import { TubesBackground } from './neon-flow';
import { CinematicHeroOverlay } from '@/components/CinematicHeroOverlay';
import { useIsMobileOrTablet } from '@/hooks/use-mobile';
import { ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ThreeRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  stars: THREE.Points[];
  nebula: THREE.Mesh | null;
  distantBodies: THREE.Mesh[];
  animationId: number | null;
  targetCameraX?: number;
  targetCameraY?: number;
  targetCameraZ?: number;
}

export function HorizonHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });
  const lastProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [scrollStarted, setScrollStarted] = useState(false);
  const totalSections = 3;
  const isMobileOrTablet = useIsMobileOrTablet();
  
  const [, setLocation] = useLocation();
  const { triggerTransition } = useHyperspaceTransition();
  
  const threeRefs = useRef<ThreeRefs>({
    scene: null,
    camera: null,
    renderer: null,
    stars: [],
    nebula: null,
    distantBodies: [],
    animationId: null
  });

  useEffect(() => {
    if (!canvasRef.current || isMobileOrTablet) return;
    
    if (!isWebGLAvailable()) {
      setWebglFailed(true);
      return;
    }

    const initThree = () => {
      try {
        const refs = threeRefs.current;
        
        refs.scene = new THREE.Scene();
        refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

        refs.camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          2000
        );
        refs.camera.position.z = 100;
        refs.camera.position.y = 20;

        try {
          refs.renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current!,
            antialias: false,
            alpha: true,
            powerPreference: 'low-power',
            failIfMajorPerformanceCaveat: false
          });
        } catch (rendererError) {
          console.warn('WebGL renderer creation failed:', rendererError);
          setWebglFailed(true);
          return;
        }

        if (!refs.renderer.getContext()) {
          console.warn('WebGL context not available');
          setWebglFailed(true);
          return;
        }

        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
        refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        refs.renderer.toneMappingExposure = 0.6;

        createStarField();
        createNebula();
        createDistantBodies();
        createAtmosphere();

        animate();
        setIsReady(true);
      } catch (error) {
        console.warn('Three.js initialization failed:', error);
        setWebglFailed(true);
      }
    };

    const createStarField = () => {
      const refs = threeRefs.current;
      if (!refs.scene) return;
      
      const starCount = 400;
      
      for (let i = 0; i < 2; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          let x, y, z;
          
          const side = Math.floor(Math.random() * 4);
          const margin = 150;
          
          if (side === 0) {
            x = -800 + Math.random() * (800 - margin);
            y = (Math.random() - 0.5) * 1600;
          } else if (side === 1) {
            x = margin + Math.random() * (800 - margin);
            y = (Math.random() - 0.5) * 1600;
          } else if (side === 2) {
            x = (Math.random() - 0.5) * 1600;
            y = -800 + Math.random() * (800 - margin);
          } else {
            x = (Math.random() - 0.5) * 1600;
            y = margin + Math.random() * (800 - margin);
          }
          
          z = -200 - Math.random() * 800;

          positions[j * 3] = x;
          positions[j * 3 + 1] = y;
          positions[j * 3 + 2] = z;

          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.4) {
            color.setHSL(0.54, 1.0, 0.5 + Math.random() * 0.3); // cyan
          } else if (colorChoice < 0.7) {
            color.setHSL(0.52, 0.8, 0.4 + Math.random() * 0.3); // deep teal
          } else if (colorChoice < 0.9) {
            color.setHSL(0.58, 0.7, 0.5 + Math.random() * 0.3); // light blue
          } else {
            color.setHSL(0, 0, 0.7 + Math.random() * 0.3); // white accent
          }
          
          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 3 + 1.0;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              // Gentle drift with cyber pulse
              pos.y = mod(pos.y - time * (8.0 + depth * 5.0), 1600.0) - 800.0;
              pos.x += sin(pos.y * 0.01 + time * 0.5) * 15.0;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (250.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              vec2 center = gl_PointCoord - vec2(0.5);
              float dist = length(center);
              if (dist > 0.5) discard;
              
              // Glowing core with soft edge
              float core = 1.0 - smoothstep(0.0, 0.15, dist);
              float glow = 1.0 - smoothstep(0.0, 0.5, dist);
              float opacity = core * 0.9 + glow * 0.4;
              
              // Vertical trail effect
              float trail = smoothstep(0.5, 0.0, center.y + 0.3) * 0.3;
              opacity += trail * glow;
              
              gl_FragColor = vec4(vColor * (1.0 + core * 0.5), opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const refs = threeRefs.current;
      if (!refs.scene) return;
      
      const geometry = new THREE.PlaneGeometry(4000, 2000, 8, 8);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x1C2C5A) },  // deep cyan
          color2: { value: new THREE.Color(0x3D70B7) },  // vivid cyan
          color3: { value: new THREE.Color(0x42BA90) },  // light cyan glow
          opacity: { value: 0.30 },
          scrollProgress: { value: 0 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          uniform float scrollProgress;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.008 + time) * cos(pos.y * 0.008 + time) * 15.0;
            pos.z += elevation;
            pos.z += scrollProgress * 200.0;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          void main() {
            float n = noise(vUv * 5.0 + time * 0.1);
            float n2 = noise(vUv * 8.0 - time * 0.15);
            float n3 = noise(vUv * 3.0 + time * 0.05);
            
            float wave1 = sin(vUv.x * 6.0 + vUv.y * 4.0 + time * 0.8) * 0.5 + 0.5;
            float wave2 = sin(vUv.x * 4.0 - vUv.y * 7.0 + time * 0.6) * 0.5 + 0.5;
            float wave3 = cos(vUv.x * 3.0 + time * 0.4) * sin(vUv.y * 5.0 - time * 0.3) * 0.5 + 0.5;
            
            float nebula1 = smoothstep(0.3, 0.7, n * wave1 + n2 * 0.3);
            float nebula2 = smoothstep(0.4, 0.8, n2 * wave2 + n3 * 0.2);
            
            float glow1 = exp(-3.0 * length(vUv - vec2(0.3 + sin(time * 0.2) * 0.1, 0.4 + cos(time * 0.15) * 0.1)));
            float glow2 = exp(-4.0 * length(vUv - vec2(0.7 + cos(time * 0.25) * 0.08, 0.6 + sin(time * 0.18) * 0.08)));
            
            vec3 baseColor = mix(color1, color2, wave1 * n);
            vec3 color = baseColor * (nebula1 * 0.2 + 0.03);
            color += color2 * nebula2 * 0.15;
            color += color3 * glow1 * 0.25;
            color += color2 * glow2 * 0.2;
            color += color3 * wave3 * n2 * 0.06;
            
            float alpha = opacity * (nebula1 * 0.4 + nebula2 * 0.3 + glow1 * 0.8 + glow2 * 0.6 + 0.02);
            alpha *= 1.0 - length(vUv - 0.5) * 0.8;
            alpha = clamp(alpha, 0.0, 0.45);
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      nebula.rotation.x = 0;
      refs.scene.add(nebula);
      refs.nebula = nebula;
    };

    const createDistantBodies = () => {
      const refs = threeRefs.current;
      if (!refs.scene) return;
      
      const bodies = [
        { x: -400, y: 100, z: -800, radius: 30, color: 0x0a0520, glowColor: 0x42BA90 },
        { x: 350, y: -50, z: -900, radius: 20, color: 0x0a0520, glowColor: 0x3D9E78 },
        { x: -200, y: -80, z: -700, radius: 15, color: 0x0a0520, glowColor: 0x2D8B6A },
        { x: 500, y: 150, z: -1000, radius: 40, color: 0x0a0520, glowColor: 0x42BA90 }
      ];

      bodies.forEach((body) => {
        const geometry = new THREE.CircleGeometry(body.radius, 16);
        const material = new THREE.ShaderMaterial({
          uniforms: {
            baseColor: { value: new THREE.Color(body.color) },
            glowColor: { value: new THREE.Color(body.glowColor) },
            time: { value: 0 }
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 baseColor;
            uniform vec3 glowColor;
            uniform float time;
            varying vec2 vUv;
            
            void main() {
              float dist = length(vUv - vec2(0.5)) * 2.0;
              float ring = smoothstep(0.6, 0.65, dist) * (1.0 - smoothstep(0.75, 0.8, dist));
              float innerGlow = 1.0 - smoothstep(0.0, 0.6, dist);
              float outerGlow = 1.0 - smoothstep(0.0, 1.0, dist);
              
              vec3 color = baseColor * innerGlow * 0.3;
              color += glowColor * ring * 1.5;
              color += glowColor * outerGlow * 0.2;
              
              float pulse = sin(time * 2.0 + dist * 10.0) * 0.15 + 0.85;
              color *= pulse;
              
              float alpha = max(ring * 1.2, outerGlow * 0.4);
              gl_FragColor = vec4(color, alpha);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(body.x, body.y, body.z);
        mesh.userData = { baseX: body.x, baseY: body.y, parallaxSpeed: 0.1 + Math.random() * 0.2 };
        refs.scene!.add(mesh);
        refs.distantBodies.push(mesh);
      });
    };

    const createAtmosphere = () => {
      const refs = threeRefs.current;
      if (!refs.scene) return;
      
      const geometry = new THREE.SphereGeometry(600, 16, 16);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
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
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.24, 0.44, 0.72) * intensity; // cyan glow
            
            float pulse = sin(time * 2.0) * 0.05 + 0.95;
            atmosphere *= pulse;
            
            gl_FragColor = vec4(atmosphere, intensity * 0.15);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

      const atmosphere = new THREE.Mesh(geometry, material);
      refs.scene.add(atmosphere);
    };

    let lastFrameTime = 0;
    const frameInterval = 1000 / 30;
    const animate = (timestamp: number) => {
      const refs = threeRefs.current;
      refs.animationId = requestAnimationFrame(animate);
      
      const delta = timestamp - lastFrameTime;
      if (delta < frameInterval) return;
      lastFrameTime = timestamp - (delta % frameInterval);
      
      const time = Date.now() * 0.001;

      refs.stars.forEach((starField) => {
        if ((starField.material as THREE.ShaderMaterial).uniforms) {
          (starField.material as THREE.ShaderMaterial).uniforms.time.value = time;
        }
      });

      if (refs.nebula && (refs.nebula.material as THREE.ShaderMaterial).uniforms) {
        (refs.nebula.material as THREE.ShaderMaterial).uniforms.time.value = time * 0.3;
      }

      refs.distantBodies.forEach((body) => {
        if ((body.material as THREE.ShaderMaterial).uniforms) {
          (body.material as THREE.ShaderMaterial).uniforms.time.value = time;
        }
        const userData = body.userData;
        body.position.x = userData.baseX + Math.sin(time * 0.1) * 5 * userData.parallaxSpeed;
        body.position.y = userData.baseY + Math.cos(time * 0.15) * 3 * userData.parallaxSpeed;
      });

      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.05;
        
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += ((refs.targetCameraY || 30) - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += ((refs.targetCameraZ || 100) - smoothCameraPos.current.z) * smoothingFactor;
        
        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;
        
        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
    };

    initThree();

    const handleResize = () => {
      const refs = threeRefs.current;
      if (refs.camera && refs.renderer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      const refs = threeRefs.current;
      
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }

      window.removeEventListener('resize', handleResize);

      refs.stars.forEach(starField => {
        starField.geometry.dispose();
        (starField.material as THREE.Material).dispose();
      });

      refs.distantBodies.forEach(body => {
        body.geometry.dispose();
        (body.material as THREE.Material).dispose();
      });

      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        (refs.nebula.material as THREE.Material).dispose();
      }

      if (refs.renderer) {
        refs.renderer.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    
    gsap.set([scrollProgressRef.current], {
      visibility: 'visible'
    });

    const tl = gsap.timeline();

    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
      });
    }

    return () => {
      tl.kill();
    };
  }, [isReady]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafIdRef.current) return;
      
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const heroHeight = containerRef.current?.offsetHeight || windowHeight * 3;
        const heroEnd = heroHeight - windowHeight;
        const progress = Math.min(scrollY / heroEnd, 1);
        
        if (scrollY > 20 && !scrollStarted) {
          setScrollStarted(true);
        }
        
        const pastHero = scrollY > heroEnd;
        setIsPastHero(pastHero);
        
        if (Math.abs(progress - lastProgressRef.current) > 0.01) {
          lastProgressRef.current = progress;
          setScrollProgress(progress);
        }
        
        const newSection = Math.min(Math.floor(progress * totalSections), totalSections - 1);
        setCurrentSection(newSection);

        const refs = threeRefs.current;
        
        const totalProgress = progress * totalSections;
        const sectionProgress = totalProgress % 1;
        
        const cameraPositions = [
          { x: 0, y: 30, z: 300 },
          { x: 0, y: 40, z: -50 },
          { x: 0, y: 50, z: -700 }
        ];
        
        const currentPos = cameraPositions[newSection] || cameraPositions[0];
        const nextPos = cameraPositions[newSection + 1] || currentPos;
        
        refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
        refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
        refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

        if (refs.nebula && (refs.nebula.material as THREE.ShaderMaterial).uniforms) {
          (refs.nebula.material as THREE.ShaderMaterial).uniforms.scrollProgress.value = progress;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [totalSections]);

  const handleEnterExperience = useCallback(() => {
    triggerTransition(() => {
      setLocation('/experience');
    });
  }, [triggerTransition, setLocation]);

  return (
    <div ref={containerRef} className={isMobileOrTablet ? "horizon-hero-container horizon-hero-mobile" : "horizon-hero-container"}>
      {false && !isMobileOrTablet && (
        <>
          <div 
            className="absolute inset-0 z-[1]" 
            style={{ 
              opacity: isPastHero ? 0 : 0.4,
              mixBlendMode: 'screen',
              transition: 'opacity 0.5s ease'
            }}
            data-testid="hero-energy-beam-layer"
          >
            <EnergyBeam className="w-full h-full" />
          </div>
          
          <div 
            className="absolute inset-0 z-[2]" 
            style={{ 
              opacity: isPastHero ? 0 : 0.35,
              mixBlendMode: 'screen',
              transition: 'opacity 0.5s ease'
            }}
            data-testid="hero-neon-flow-layer"
          >
            <TubesBackground className="w-full h-full" enableClickInteraction={true} />
          </div>
        </>
      )}
      
      {webglFailed || isMobileOrTablet ? (
        <div className="absolute inset-0 z-[3] bg-gradient-to-b from-background via-background to-background">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(28, 44, 90, 0.2), transparent 50%), radial-gradient(circle at 80% 30%, rgba(61, 112, 183, 0.2), transparent 50%)'
          }} />
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          className="horizon-hero-canvas z-[3]" 
          style={{ opacity: isPastHero ? 0 : 1, transition: 'opacity 0.5s ease' }}
        />
      )}
      
      <CinematicHeroOverlay onEnterExperience={handleEnterExperience} isPastHero={isPastHero} />

      {/* Parallax scroll-driven title */}
      <div className="horizon-hero-content z-[10]" style={{ opacity: isPastHero ? 0 : 1, transition: 'opacity 0.3s ease' }}>
        {currentSection === 0 ? (
          <h1 className="horizon-hero-title text-halo-white">
            ARICA TECH SECURITY
          </h1>
        ) : currentSection === 1 ? (
          <h2 className="horizon-hero-title text-halo-white" style={{ fontSize: isMobileOrTablet ? 'clamp(1.2rem, 5vw, 2rem)' : 'clamp(1.8rem, 5.5vw, 5.5rem)' }}>
            Security That Goes Beyond Prevention
          </h2>
        ) : (
          <div className="flex flex-col items-center gap-4 md:gap-6 px-4">
            <h1 className="horizon-hero-title text-halo-white">
              EXPLORE OUR SERVICES
            </h1>
            <button
              onClick={handleEnterExperience}
              className="bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/15 transition-all hover:scale-105 flex items-center gap-3"
              style={{ pointerEvents: 'auto' }}
            >
              <ShieldCheck className="w-5 h-5" />
              Enter Experience
            </button>
          </div>
        )}
      </div>

      <div ref={scrollProgressRef} className="horizon-scroll-progress" style={{ visibility: 'hidden', opacity: isPastHero ? 0 : 1, pointerEvents: isPastHero ? 'none' : 'auto', transition: 'opacity 0.5s ease' }}>
        <div className="horizon-scroll-text" style={{ opacity: scrollStarted ? 0 : 1, transition: 'opacity 0.5s ease-out' }}>SCROLL</div>
        <div className="horizon-progress-track">
          <div 
            className="horizon-progress-fill" 
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="horizon-section-counter">
          {String(currentSection).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
        </div>
      </div>

      <div className="horizon-scroll-sections">
        {[...Array(2)].map((_, i) => (
          <section key={i} className="horizon-content-section" aria-hidden="true">
          </section>
        ))}
      </div>
    </div>
  );
}

export { HorizonHeroSection as Component };
