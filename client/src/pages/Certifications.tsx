import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import * as THREE from 'three';
import { 
  ArrowLeft, Shield, Lock, Database, CreditCard, Heart, Building2,
  CheckCircle, Calendar, Award, Users, Clock, TrendingUp, X,
  Sparkles, Star
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { isWebGLAvailable } from '@/lib/webgl-utils';

interface Certification {
  id: string;
  name: string;
  fullName: string;
  icon: React.ElementType;
  description: string;
  status: 'Active' | 'Pending' | 'Renewing';
  lastAudit: string;
  nextRenewal: string;
  color: string;
  badgeShape: 'hexagon' | 'shield' | 'circle';
  details: string[];
}

const certifications: Certification[] = [
  {
    id: 'iso-27001',
    name: 'ISO 27001',
    fullName: 'Information Security Management',
    icon: Shield,
    description: 'International standard for information security management systems',
    status: 'Active',
    lastAudit: 'October 2025',
    nextRenewal: 'October 2028',
    color: '#FFB800',
    badgeShape: 'hexagon',
    details: [
      'Risk assessment and treatment',
      'Security policy development',
      'Access control management',
      'Cryptography controls',
      'Physical security measures'
    ]
  },
  {
    id: 'soc2-type2',
    name: 'SOC 2 Type II',
    fullName: 'Service Organization Control',
    icon: Lock,
    description: 'Trust service criteria for security, availability, and confidentiality',
    status: 'Active',
    lastAudit: 'August 2025',
    nextRenewal: 'August 2026',
    color: '#3D70B7',
    badgeShape: 'shield',
    details: [
      'Security principle compliance',
      'Availability monitoring',
      'Processing integrity',
      'Confidentiality controls',
      'Privacy protection measures'
    ]
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    fullName: 'Data Protection Compliance',
    icon: Database,
    description: 'European Union General Data Protection Regulation compliance',
    status: 'Active',
    lastAudit: 'July 2025',
    nextRenewal: 'July 2026',
    color: '#8B5CF6',
    badgeShape: 'circle',
    details: [
      'Data subject rights management',
      'Consent management',
      'Data processing agreements',
      'Breach notification procedures',
      'Privacy by design implementation'
    ]
  },
  {
    id: 'pci-dss',
    name: 'PCI DSS',
    fullName: 'Payment Card Industry Security',
    icon: CreditCard,
    description: 'Payment card industry data security standard compliance',
    status: 'Active',
    lastAudit: 'September 2025',
    nextRenewal: 'September 2026',
    color: '#10B981',
    badgeShape: 'hexagon',
    details: [
      'Cardholder data protection',
      'Network security controls',
      'Vulnerability management',
      'Access control measures',
      'Regular security testing'
    ]
  },
  {
    id: 'hipaa',
    name: 'HIPAA',
    fullName: 'Healthcare Data Protection',
    icon: Heart,
    description: 'Health Insurance Portability and Accountability Act compliance',
    status: 'Active',
    lastAudit: 'June 2025',
    nextRenewal: 'June 2026',
    color: '#F43F5E',
    badgeShape: 'shield',
    details: [
      'Protected health information security',
      'Administrative safeguards',
      'Physical safeguards',
      'Technical safeguards',
      'Business associate agreements'
    ]
  },
  {
    id: 'iso-22301',
    name: 'ISO 22301',
    fullName: 'Business Continuity Management',
    icon: Building2,
    description: 'Business continuity management system standard',
    status: 'Active',
    lastAudit: 'November 2025',
    nextRenewal: 'November 2028',
    color: '#F59E0B',
    badgeShape: 'circle',
    details: [
      'Business impact analysis',
      'Recovery strategy development',
      'Incident response planning',
      'Testing and exercises',
      'Continuous improvement'
    ]
  }
];

const timelineSteps = [
  { id: 'assessment', name: 'Assessment', description: 'Initial security evaluation', progress: 100 },
  { id: 'gap-analysis', name: 'Gap Analysis', description: 'Identify compliance gaps', progress: 100 },
  { id: 'implementation', name: 'Implementation', description: 'Security controls deployment', progress: 100 },
  { id: 'audit', name: 'Audit', description: 'Third-party verification', progress: 100 },
  { id: 'certification', name: 'Certification', description: 'Official certification awarded', progress: 100 },
  { id: 'maintenance', name: 'Maintenance', description: 'Ongoing compliance monitoring', progress: 85 }
];

const trustStats = [
  { label: 'Years Certified', value: 8, suffix: '+', icon: Award },
  { label: 'Audits Passed', value: 156, suffix: '', icon: CheckCircle },
  { label: 'Controls Maintained', value: 2847, suffix: '+', icon: TrendingUp },
  { label: 'Trusted Clients', value: 500, suffix: '+', icon: Users }
];

function CertificationBadges3D({ 
  onBadgeClick,
  hoveredBadge,
  setHoveredBadge
}: { 
  onBadgeClick: (id: string) => void;
  hoveredBadge: string | null;
  setHoveredBadge: (id: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    badges: THREE.Group[];
    particles: THREE.Points[];
    animationId: number | null;
    clock: THREE.Clock;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    badges: [],
    particles: [],
    animationId: null,
    clock: new THREE.Clock(),
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(-1000, -1000)
  });

  const createHexagonGeometry = useCallback((radius: number, depth: number) => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 });
  }, []);

  const createShieldGeometry = useCallback((size: number, depth: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(0, size * 1.2);
    shape.quadraticCurveTo(size * 0.8, size, size, 0);
    shape.quadraticCurveTo(size * 0.8, -size * 0.8, 0, -size * 1.2);
    shape.quadraticCurveTo(-size * 0.8, -size * 0.8, -size, 0);
    shape.quadraticCurveTo(-size * 0.8, size, 0, size * 1.2);
    return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 });
  }, []);

  const createBadgeMaterial = useCallback((color: string) => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color(color) },
        glowIntensity: { value: 0.5 },
        isHovered: { value: 0.0 }
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
        uniform vec3 baseColor;
        uniform float glowIntensity;
        uniform float isHovered;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
          float pulse = 0.8 + sin(time * 2.0) * 0.2;
          
          vec3 core = baseColor * (0.6 + pulse * 0.2);
          vec3 glow = baseColor * fresnel * glowIntensity * (1.0 + isHovered * 2.0);
          
          float metallic = smoothstep(0.3, 0.7, vNormal.z) * 0.3;
          vec3 highlight = vec3(1.0) * metallic * pulse;
          
          vec3 finalColor = core + glow + highlight;
          finalColor *= 1.0 + isHovered * 0.5;
          
          float alpha = 0.95;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, []);

  const createSparkleParticles = useCallback((color: string, count: number) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 1.2 + Math.random() * 0.8;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      sizes[i] = Math.random() * 4 + 2;
      phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color) }
      },
      vertexShader: `
        attribute float size;
        attribute float phase;
        uniform float time;
        varying float vAlpha;
        
        void main() {
          vAlpha = 0.5 + sin(time * 3.0 + phase) * 0.5;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (150.0 / -mvPosition.z) * vAlpha;
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
          vec3 sparkle = color + vec3(0.3) * (1.0 - dist * 2.0);
          gl_FragColor = vec4(sparkle, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    return new THREE.Points(geometry, material);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isMounted) return;
    
    if (!isWebGLAvailable()) {
      console.warn('WebGL not available, skipping 3D rendering');
      return;
    }

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      });
    } catch (error) {
      console.warn('WebGL not available, skipping 3D rendering');
      return;
    }

    const scene = new THREE.Scene();
    sceneRef.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 10;
    sceneRef.current.camera = camera;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    sceneRef.current.renderer = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x42BA90, 1.5, 30);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xFFB800, 1, 30);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const badges: THREE.Group[] = [];
    const particles: THREE.Points[] = [];

    certifications.forEach((cert, index) => {
      const group = new THREE.Group();
      group.userData = { id: cert.id, index };

      let geometry: THREE.BufferGeometry;
      switch (cert.badgeShape) {
        case 'hexagon':
          geometry = createHexagonGeometry(0.8, 0.15);
          break;
        case 'shield':
          geometry = createShieldGeometry(0.6, 0.15);
          break;
        case 'circle':
        default:
          geometry = new THREE.CylinderGeometry(0.8, 0.8, 0.15, 32);
          geometry.rotateX(Math.PI / 2);
          break;
      }

      const material = createBadgeMaterial(cert.color);
      const mesh = new THREE.Mesh(geometry, material);
      group.add(mesh);

      const ringGeometry = new THREE.TorusGeometry(1.0, 0.03, 16, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: cert.color, 
        transparent: true, 
        opacity: 0.6 
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      group.add(ring);

      const angle = (index / certifications.length) * Math.PI * 2;
      const radius = 4;
      group.position.x = Math.cos(angle) * radius;
      group.position.z = Math.sin(angle) * radius;
      group.position.y = Math.sin(index * 0.8) * 0.5;

      scene.add(group);
      badges.push(group);

      const sparkles = createSparkleParticles(cert.color, 30);
      sparkles.position.copy(group.position);
      scene.add(sparkles);
      particles.push(sparkles);
    });

    sceneRef.current.badges = badges;
    sceneRef.current.particles = particles;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      sceneRef.current.mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      sceneRef.current.mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;
    };

    const handleClick = () => {
      sceneRef.current.raycaster.setFromCamera(sceneRef.current.mouse, camera);
      const intersects = sceneRef.current.raycaster.intersectObjects(
        badges.flatMap(b => b.children), 
        true
      );
      
      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && !parent.userData.id) {
          parent = parent.parent;
        }
        if (parent?.userData.id) {
          onBadgeClick(parent.userData.id);
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    const animate = () => {
      const time = sceneRef.current.clock.getElapsedTime();

      sceneRef.current.raycaster.setFromCamera(sceneRef.current.mouse, camera);
      const intersects = sceneRef.current.raycaster.intersectObjects(
        badges.flatMap(b => b.children), 
        true
      );

      let hoveredId: string | null = null;
      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && !parent.userData.id) {
          parent = parent.parent;
        }
        if (parent?.userData.id) {
          hoveredId = parent.userData.id;
        }
      }

      badges.forEach((badge, index) => {
        const baseAngle = (index / certifications.length) * Math.PI * 2;
        const orbitSpeed = 0.15;
        const currentAngle = baseAngle + time * orbitSpeed;
        const radius = 4;

        badge.position.x = Math.cos(currentAngle) * radius;
        badge.position.z = Math.sin(currentAngle) * radius;
        badge.position.y = Math.sin(time * 1.5 + index * 0.8) * 0.3;

        badge.rotation.y = time * 0.5;
        badge.rotation.x = Math.sin(time * 0.3 + index) * 0.1;

        const isHovered = badge.userData.id === hoveredId;
        const targetScale = isHovered ? 1.3 : 1.0;
        badge.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        badge.children.forEach(child => {
          if ((child as THREE.Mesh).material && 'uniforms' in (child as THREE.Mesh).material) {
            const mat = (child as THREE.Mesh).material as THREE.ShaderMaterial;
            mat.uniforms.time.value = time;
            mat.uniforms.isHovered.value += ((isHovered ? 1.0 : 0.0) - mat.uniforms.isHovered.value) * 0.1;
          }
        });

        const sparkle = particles[index];
        if (sparkle) {
          sparkle.position.copy(badge.position);
          sparkle.rotation.y = time * 0.3;
          const sparkMat = sparkle.material as THREE.ShaderMaterial;
          sparkMat.uniforms.time.value = time;
        }
      });

      if (hoveredId) {
        container.style.cursor = 'pointer';
        setHoveredBadge(hoveredId);
      } else {
        container.style.cursor = 'default';
        setHoveredBadge(null);
      }

      renderer.render(scene, camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }

      badges.forEach(badge => {
        badge.children.forEach(child => {
          if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
          if ((child as THREE.Mesh).material) {
            const mat = (child as THREE.Mesh).material as THREE.Material;
            mat.dispose();
          }
        });
      });

      particles.forEach(particle => {
        particle.geometry.dispose();
        (particle.material as THREE.Material).dispose();
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isMounted, createHexagonGeometry, createShieldGeometry, createBadgeMaterial, createSparkleParticles, onBadgeClick, setHoveredBadge]);

  if (!isMounted) {
    return (
      <div 
        className="w-full h-[500px] rounded-3xl overflow-hidden bg-slate-900/50 flex items-center justify-center"
        data-testid="certification-badges-3d-loading"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#3D70B7]/30 border-t-[#3D70B7] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading 3D visualization...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[500px] rounded-3xl overflow-hidden bg-slate-900/20"
      data-testid="certification-badges-3d"
    />
  );
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = Date.now();
          
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(value * eased));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D70B7] to-[#FFB800]">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

function CertificationModal({ 
  certification, 
  onClose 
}: { 
  certification: Certification; 
  onClose: () => void; 
}) {
  const Icon = certification.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      data-testid="certification-modal"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-lg w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-700 transition-colors"
          data-testid="modal-close-button"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${certification.color}20`, border: `2px solid ${certification.color}` }}
          >
            <Icon className="w-8 h-8" style={{ color: certification.color }} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{certification.name}</h3>
            <p className="text-slate-400">{certification.fullName}</p>
          </div>
        </div>

        <p className="text-slate-300 mb-6">{certification.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Last Audit</span>
            </div>
            <p className="text-white font-medium">{certification.lastAudit}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Next Renewal</span>
            </div>
            <p className="text-white font-medium">{certification.nextRenewal}</p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-semibold text-white mb-3">Key Controls</h4>
          <ul className="space-y-2">
            {certification.details.map((detail, idx) => (
              <li key={idx} className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
          <span 
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: certification.status === 'Active' ? '#10B98120' : '#F59E0B20',
              color: certification.status === 'Active' ? '#10B981' : '#F59E0B'
            }}
          >
            {certification.status}
          </span>
          <Sparkles className="w-4 h-4 text-[#FFB800]" />
          <span className="text-sm text-slate-400">Verified & Compliant</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  const selectedCertification = certifications.find(c => c.id === selectedCert);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      
      <div className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3D70B7] rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFB800] rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Link href="/experience" className="inline-flex items-center gap-2 text-[#3D70B7] hover:text-[#3D70B7]/80 transition-colors mb-8" data-testid="link-back-experience">
              <ArrowLeft className="w-4 h-4" />
              Back to Experience
            </Link>
            
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-10 h-10 text-[#FFB800]" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3D70B7] to-[#FFB800]">Certifications</span>
              </h1>
            </div>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Industry-recognized certifications demonstrating our commitment to security excellence
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 rounded-3xl border border-slate-700/50 p-6 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#3D70B7]/5 to-[#FFB800]/5" />
              <h2 className="text-2xl font-bold text-white text-center mb-4 relative z-10">
                <Star className="w-6 h-6 inline-block mr-2 text-[#FFB800]" />
                Interactive 3D Badge Showcase
              </h2>
              <p className="text-center text-slate-400 mb-6 relative z-10">
                Click on any badge to view certification details
              </p>
              <CertificationBadges3D 
                onBadgeClick={setSelectedCert}
                hoveredBadge={hoveredBadge}
                setHoveredBadge={setHoveredBadge}
              />
              {hoveredBadge && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-600"
                >
                  <p className="text-white font-medium">
                    {certifications.find(c => c.id === hoveredBadge)?.name}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Certification Cards
            </h2>
            <p className="text-center text-slate-400 mb-8">Click any card to flip and see details</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => {
                const Icon = cert.icon;
                const [isFlipped, setIsFlipped] = useState(false);
                
                return (
                  <div key={cert.id} className="perspective-1000" style={{ perspective: '1000px' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        rotateY: isFlipped ? 180 : 0
                      }}
                      transition={{ 
                        opacity: { delay: 0.1 * index },
                        rotateY: { duration: 0.6, type: 'spring' }
                      }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="cursor-pointer relative h-[280px]"
                      style={{ transformStyle: 'preserve-3d' }}
                      data-testid={`certification-card-${cert.id}`}
                    >
                      {/* Front of card */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6 hover:border-slate-500 transition-all duration-300 group backface-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div 
                            className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${cert.color}20`, border: `2px solid ${cert.color}` }}
                          >
                            <Icon className="w-7 h-7" style={{ color: cert.color }} />
                          </div>
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: cert.status === 'Active' ? '#10B98120' : '#F59E0B20',
                              color: cert.status === 'Active' ? '#10B981' : '#F59E0B'
                            }}
                          >
                            {cert.status}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{cert.name}</h3>
                        <p className="text-sm text-slate-400 mb-4">{cert.fullName}</p>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Last Audit</span>
                            <span className="text-slate-300">{cert.lastAudit}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Next Renewal</span>
                            <span className="text-slate-300">{cert.nextRenewal}</span>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                          <span className="text-xs text-slate-500">Click to flip →</span>
                        </div>
                      </div>
                      
                      {/* Back of card */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border p-6 backface-hidden"
                        style={{ 
                          backfaceVisibility: 'hidden', 
                          transform: 'rotateY(180deg)',
                          borderColor: cert.color 
                        }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${cert.color}20` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: cert.color }} />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white">{cert.name}</h4>
                            <p className="text-xs text-slate-400">Key Controls</p>
                          </div>
                        </div>
                        
                        <ul className="space-y-2 mb-4">
                          {cert.details.slice(0, 4).map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: cert.color }} />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCert(cert.id);
                          }}
                          className="w-full py-2 rounded-lg text-sm font-medium text-white transition-all"
                          style={{ backgroundColor: cert.color }}
                        >
                          View Full Details
                        </motion.button>
                        
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                          <span className="text-xs text-slate-500">← Click to flip back</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Certification Roadmap
            </h2>
            <div className="relative">
              {/* Animated path line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 -translate-y-1/2 hidden md:block overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#3D70B7] via-[#FFB800] to-[#10B981]"
                  initial={{ width: 0 }}
                  animate={{ width: '83%' }}
                  transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                />
              </div>
              
              {/* Moving marker */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 hidden md:block z-20"
                initial={{ left: '0%' }}
                animate={{ left: ['0%', '83%', '83%'] }}
                transition={{ 
                  duration: 3, 
                  delay: 0.5,
                  times: [0, 0.7, 1],
                  ease: 'easeOut'
                }}
              >
                <motion.div
                  className="w-6 h-6 rounded-full bg-[#FFB800] shadow-[0_0_20px_rgba(255,184,0,0.6)]"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
              
              <div className="grid md:grid-cols-6 gap-4">
                {timelineSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index + 0.3 }}
                    className="relative flex flex-col items-center"
                    data-testid={`timeline-step-${step.id}`}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-full flex items-center justify-center z-10 mb-3"
                      initial={{ scale: 0 }}
                      animate={{
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          `0 0 20px ${step.progress === 100 ? '#10B98150' : '#F59E0B50'}`,
                          `0 0 30px ${step.progress === 100 ? '#10B98180' : '#F59E0B80'}`,
                          `0 0 20px ${step.progress === 100 ? '#10B98150' : '#F59E0B50'}`
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.2 * index + 0.5 }}
                      style={{
                        backgroundColor: step.progress === 100 ? '#10B981' : '#F59E0B',
                        boxShadow: `0 0 20px ${step.progress === 100 ? '#10B98150' : '#F59E0B50'}`
                      }}
                    >
                      {step.progress === 100 ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <span className="text-white font-bold text-sm">{step.progress}%</span>
                      )}
                    </motion.div>
                    <h4 className="text-white font-semibold text-center mb-1">{step.name}</h4>
                    <p className="text-slate-400 text-xs text-center">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Trust Indicators
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6 text-center"
                    data-testid={`trust-stat-${index}`}
                  >
                    <Icon className="w-10 h-10 mx-auto mb-4 text-[#3D70B7]" />
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    <p className="text-slate-400 mt-2">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Trusted By Industry Leaders</h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Our certifications are recognized by leading organizations worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              {['Fortune 500', 'Healthcare', 'Finance', 'Government', 'Tech Giants'].map((sector, i) => (
                <motion.div
                  key={sector}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * i }}
                  className="px-6 py-3 bg-slate-800/50 rounded-lg border border-slate-700 text-slate-300"
                >
                  {sector}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCertification && (
          <CertificationModal 
            certification={selectedCertification} 
            onClose={() => setSelectedCert(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
