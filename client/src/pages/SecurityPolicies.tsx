import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import * as THREE from 'three';
import { 
  ArrowLeft, Shield, FileText, Lock, Database, AlertTriangle, 
  Users, Briefcase, CheckCircle, XCircle, Plus, Link as LinkIcon,
  Sparkles, Zap
} from 'lucide-react';
import { AmbientParticles } from '@/components/ui/ambient-particles';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useIsMobile } from '@/hooks/use-mobile';

interface PolicyCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  description: string;
  compliance: number;
  requirements: string[];
  color: string;
}

interface PolicyBlock {
  id: string;
  name: string;
  category: string;
  connected: string[];
}

const policyCategories: PolicyCategory[] = [
  {
    id: 'information-security',
    name: 'Information Security Policy',
    icon: Shield,
    description: 'Comprehensive framework for protecting organizational information assets',
    compliance: 92,
    requirements: ['Data encryption standards', 'Access controls', 'Security monitoring', 'Incident response'],
    color: '#00D4FF'
  },
  {
    id: 'access-control',
    name: 'Access Control Policy',
    icon: Lock,
    description: 'Rules governing user access to systems and data',
    compliance: 87,
    requirements: ['Authentication protocols', 'Authorization levels', 'Privileged access management', 'Session management'],
    color: '#8B5CF6'
  },
  {
    id: 'data-classification',
    name: 'Data Classification Policy',
    icon: Database,
    description: 'Standards for categorizing and handling sensitive data',
    compliance: 78,
    requirements: ['Classification levels', 'Handling procedures', 'Labeling requirements', 'Storage guidelines'],
    color: '#00D4FF'
  },
  {
    id: 'incident-response',
    name: 'Incident Response Policy',
    icon: AlertTriangle,
    description: 'Procedures for detecting, responding to, and recovering from security incidents',
    compliance: 85,
    requirements: ['Detection mechanisms', 'Response procedures', 'Communication protocols', 'Recovery plans'],
    color: '#F59E0B'
  },
  {
    id: 'business-continuity',
    name: 'Business Continuity Policy',
    icon: Briefcase,
    description: 'Ensuring business operations during and after disruptions',
    compliance: 90,
    requirements: ['Risk assessment', 'Recovery objectives', 'Backup procedures', 'Testing schedules'],
    color: '#10B981'
  },
  {
    id: 'acceptable-use',
    name: 'Acceptable Use Policy',
    icon: Users,
    description: 'Guidelines for appropriate use of organizational resources',
    compliance: 95,
    requirements: ['User responsibilities', 'Prohibited activities', 'Monitoring notice', 'Compliance enforcement'],
    color: '#8B5CF6'
  }
];

const initialPolicyBlocks: PolicyBlock[] = [
  { id: 'risk-assessment', name: 'Risk Assessment', category: 'foundation', connected: [] },
  { id: 'security-controls', name: 'Security Controls', category: 'protection', connected: [] },
  { id: 'monitoring', name: 'Continuous Monitoring', category: 'detection', connected: [] },
  { id: 'incident-handling', name: 'Incident Handling', category: 'response', connected: [] },
  { id: 'recovery', name: 'Recovery Planning', category: 'recovery', connected: [] },
  { id: 'training', name: 'Security Training', category: 'awareness', connected: [] },
];

const glowingEdgeShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 glowColor;
    uniform float glowIntensity;
    uniform float isHovered;
    uniform float isFlipped;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center);
      
      float edgeGlow = smoothstep(0.4, 0.5, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
      edgeGlow *= 1.0 + sin(time * 3.0 + vUv.x * 10.0) * 0.2;
      
      vec3 baseColor = vec3(0.05, 0.08, 0.15);
      vec3 frontColor = mix(baseColor, glowColor * 0.3, 0.5);
      vec3 backColor = glowColor * 0.8;
      
      vec3 surfaceColor = mix(frontColor, backColor, isFlipped);
      
      float pulse = 0.8 + sin(time * 2.0) * 0.2;
      vec3 glowEffect = glowColor * edgeGlow * glowIntensity * pulse;
      
      float hoverBoost = isHovered * 0.3;
      glowEffect += glowColor * hoverBoost;
      
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      glowEffect += glowColor * fresnel * 0.4;
      
      vec3 finalColor = surfaceColor + glowEffect;
      float alpha = 0.9 + edgeGlow * 0.1;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

const shieldShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 primaryColor;
    uniform vec3 secondaryColor;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    float hexagon(vec2 p) {
      p = abs(p);
      return max(p.x * 0.866 + p.y * 0.5, p.y) - 1.0;
    }
    
    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      
      float shieldShape = 1.0 - smoothstep(0.6, 0.65, length(uv * vec2(1.0, 0.8)));
      shieldShape *= smoothstep(-0.8, 0.0, uv.y + uv.x * uv.x * 0.5);
      
      vec2 hexUv = uv * 4.0;
      float hexPattern = 0.0;
      for(float i = 0.0; i < 6.0; i++) {
        vec2 offset = vec2(cos(i * 1.047), sin(i * 1.047)) * 0.8;
        hexPattern += smoothstep(0.1, 0.0, abs(hexagon((hexUv + offset) * 0.5)));
      }
      
      float pulse = 0.7 + sin(time * 2.0 + length(uv) * 3.0) * 0.3;
      
      vec3 coreColor = primaryColor * pulse;
      vec3 edgeColor = secondaryColor * (1.0 + sin(time * 3.0) * 0.2);
      
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
      
      vec3 finalColor = mix(coreColor, edgeColor, fresnel + hexPattern * 0.3);
      finalColor += primaryColor * shieldShape * 0.3;
      
      float scanLine = sin(uv.y * 20.0 + time * 5.0) * 0.1;
      finalColor += vec3(scanLine) * primaryColor;
      
      float alpha = shieldShape * (0.8 + fresnel * 0.2);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

const particleShader = {
  vertexShader: `
    attribute float size;
    attribute float alpha;
    attribute float speed;
    uniform float time;
    varying float vAlpha;
    
    void main() {
      vAlpha = alpha;
      
      vec3 pos = position;
      float angle = time * speed;
      float radius = length(pos.xz);
      pos.x = cos(angle + atan(pos.z, pos.x)) * radius;
      pos.z = sin(angle + atan(pos.z, pos.x)) * radius;
      pos.y += sin(time * 2.0 + position.x) * 0.1;
      
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
  `
};

function ThreeJSScene({ 
  selectedPolicy, 
  onPolicyClick,
  isMobile = false
}: { 
  selectedPolicy: string | null;
  onPolicyClick: (id: string) => void;
  isMobile?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    shield: THREE.Mesh | null;
    documents: THREE.Mesh[];
    particles: THREE.Points | null;
    animationId: number | null;
    clock: THREE.Clock;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    hoveredDoc: THREE.Mesh | null;
    documentRotations: Map<string, number>;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    shield: null,
    documents: [],
    particles: null,
    animationId: null,
    clock: new THREE.Clock(),
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    hoveredDoc: null,
    documentRotations: new Map()
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 8;
    sceneRef.current.camera = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    sceneRef.current.renderer = renderer;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00D4FF, 2, 20);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    const shieldGeometry = new THREE.IcosahedronGeometry(1.5, 2);
    const shieldMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        primaryColor: { value: new THREE.Color(0x00D4FF) },
        secondaryColor: { value: new THREE.Color(0x8B5CF6) }
      },
      vertexShader: shieldShader.vertexShader,
      fragmentShader: shieldShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    });
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    scene.add(shield);
    sceneRef.current.shield = shield;

    const documents: THREE.Mesh[] = [];
    policyCategories.forEach((policy, index) => {
      const docGeometry = new THREE.BoxGeometry(1.2, 1.6, 0.05);
      const docMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          glowColor: { value: new THREE.Color(policy.color) },
          glowIntensity: { value: 1.0 },
          isHovered: { value: 0.0 },
          isFlipped: { value: 0.0 }
        },
        vertexShader: glowingEdgeShader.vertexShader,
        fragmentShader: glowingEdgeShader.fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
      });

      const doc = new THREE.Mesh(docGeometry, docMaterial);
      doc.userData = { id: policy.id, index, baseAngle: (index / policyCategories.length) * Math.PI * 2 };
      
      const angle = doc.userData.baseAngle;
      const radius = 3.5;
      doc.position.x = Math.cos(angle) * radius;
      doc.position.z = Math.sin(angle) * radius;
      doc.position.y = Math.sin(index * 0.5) * 0.3;
      
      scene.add(doc);
      documents.push(doc);
      sceneRef.current.documentRotations.set(policy.id, 0);
    });
    sceneRef.current.documents = documents;

    const particleCount = isMobile ? 50 : 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      sizes[i] = Math.random() * 3 + 1;
      alphas[i] = Math.random() * 0.5 + 0.3;
      speeds[i] = Math.random() * 0.5 + 0.2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    particleGeometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x00D4FF) }
      },
      vertexShader: particleShader.vertexShader,
      fragmentShader: particleShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    sceneRef.current.particles = particles;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      sceneRef.current.mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      sceneRef.current.mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;
    };

    const handleClick = () => {
      if (sceneRef.current.hoveredDoc) {
        const id = sceneRef.current.hoveredDoc.userData.id;
        const currentRotation = sceneRef.current.documentRotations.get(id) || 0;
        sceneRef.current.documentRotations.set(id, currentRotation + Math.PI);
        onPolicyClick(id);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    const animate = () => {
      const time = sceneRef.current.clock.getElapsedTime();

      if (sceneRef.current.shield) {
        const shieldMat = sceneRef.current.shield.material as THREE.ShaderMaterial;
        shieldMat.uniforms.time.value = time;
        sceneRef.current.shield.rotation.y = time * 0.3;
        sceneRef.current.shield.rotation.x = Math.sin(time * 0.5) * 0.1;
      }

      if (sceneRef.current.particles) {
        const particleMat = sceneRef.current.particles.material as THREE.ShaderMaterial;
        particleMat.uniforms.time.value = time;
      }

      sceneRef.current.raycaster.setFromCamera(sceneRef.current.mouse, camera);
      const intersects = sceneRef.current.raycaster.intersectObjects(sceneRef.current.documents);

      sceneRef.current.documents.forEach((doc, index) => {
        const mat = doc.material as THREE.ShaderMaterial;
        mat.uniforms.time.value = time;
        
        const isHovered = intersects.length > 0 && intersects[0].object === doc;
        const targetHover = isHovered ? 1.0 : 0.0;
        mat.uniforms.isHovered.value += (targetHover - mat.uniforms.isHovered.value) * 0.1;

        if (isHovered) {
          sceneRef.current.hoveredDoc = doc;
          container.style.cursor = 'pointer';
        }

        const baseAngle = doc.userData.baseAngle;
        const orbitSpeed = 0.2;
        const currentAngle = baseAngle + time * orbitSpeed;
        const radius = 3.5;
        
        doc.position.x = Math.cos(currentAngle) * radius;
        doc.position.z = Math.sin(currentAngle) * radius;
        doc.position.y = Math.sin(time * 1.5 + index * 0.5) * 0.2;

        doc.lookAt(0, 0, 0);

        const targetRotation = sceneRef.current.documentRotations.get(doc.userData.id) || 0;
        const currentRotY = doc.rotation.y;
        const rotationDiff = targetRotation - (currentRotY % (Math.PI * 2));
        doc.rotation.y += rotationDiff * 0.05;

        mat.uniforms.isFlipped.value = (Math.abs(doc.rotation.y % (Math.PI * 2)) > Math.PI / 2 && 
                                         Math.abs(doc.rotation.y % (Math.PI * 2)) < Math.PI * 1.5) ? 1.0 : 0.0;
      });

      if (intersects.length === 0) {
        sceneRef.current.hoveredDoc = null;
        container.style.cursor = 'default';
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

      sceneRef.current.documents.forEach(doc => {
        doc.geometry.dispose();
        (doc.material as THREE.Material).dispose();
      });

      if (sceneRef.current.shield) {
        sceneRef.current.shield.geometry.dispose();
        (sceneRef.current.shield.material as THREE.Material).dispose();
      }

      if (sceneRef.current.particles) {
        sceneRef.current.particles.geometry.dispose();
        (sceneRef.current.particles.material as THREE.Material).dispose();
      }

      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [onPolicyClick]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[500px] rounded-3xl overflow-hidden"
      data-testid="threejs-scene-container"
    />
  );
}

function ComplianceMeter({ value }: { value: number }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(value * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [value]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    const particles: { x: number; y: number; angle: number; speed: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: 0,
        y: 0,
        angle: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1,
        size: 1 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.7
      });
    }

    let time = 0;
    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 12;
      ctx.stroke();

      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (animatedValue / 100) * Math.PI * 2;
      
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#00D4FF');
      gradient.addColorStop(0.5, '#8B5CF6');
      gradient.addColorStop(1, '#00D4FF');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.stroke();

      particles.forEach(particle => {
        particle.angle += particle.speed * 0.02;
        const particleRadius = radius + 15 + Math.sin(time * 2 + particle.angle * 3) * 5;
        particle.x = centerX + Math.cos(particle.angle) * particleRadius;
        particle.y = centerY + Math.sin(particle.angle) * particleRadius;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${particle.alpha * (0.5 + Math.sin(time * 3 + particle.angle) * 0.5)})`;
        ctx.fill();
      });

      for (let i = 0; i < 3; i++) {
        const glowRadius = radius + Math.sin(time * 2 + i) * 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, glowRadius, startAngle, endAngle);
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 - i * 0.03})`;
        ctx.lineWidth = 20 + i * 5;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animatedValue]);

  return (
    <div className="relative" data-testid="compliance-meter">
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={200}
        className="mx-auto"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-[#00D4FF]" data-testid="text-compliance-value">
          {animatedValue}%
        </span>
        <span className="text-sm text-muted-foreground">Compliance</span>
      </div>
    </div>
  );
}

function PolicyBuilder() {
  const [blocks, setBlocks] = useState(initialPolicyBlocks);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [connections, setConnections] = useState<{from: string; to: string}[]>([]);

  const handleBlockClick = (id: string) => {
    if (!selectedBlock) {
      setSelectedBlock(id);
    } else if (selectedBlock !== id) {
      const alreadyConnected = connections.some(
        c => (c.from === selectedBlock && c.to === id) || (c.from === id && c.to === selectedBlock)
      );
      
      if (!alreadyConnected) {
        setConnections([...connections, { from: selectedBlock, to: id }]);
        setBlocks(prev => prev.map(block => {
          if (block.id === selectedBlock) {
            return { ...block, connected: [...block.connected, id] };
          }
          if (block.id === id) {
            return { ...block, connected: [...block.connected, selectedBlock] };
          }
          return block;
        }));
      }
      setSelectedBlock(null);
    } else {
      setSelectedBlock(null);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      foundation: '#00D4FF',
      protection: '#8B5CF6',
      detection: '#F59E0B',
      response: '#EF4444',
      recovery: '#10B981',
      awareness: '#EC4899'
    };
    return colors[category] || '#00D4FF';
  };

  const isConnected = (id: string) => {
    return connections.some(c => c.from === id || c.to === id);
  };

  return (
    <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10" data-testid="policy-builder">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[#00D4FF]/20">
          <Sparkles className="w-5 h-5 text-[#00D4FF]" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Policy Framework Builder</h3>
          <p className="text-sm text-muted-foreground">Click blocks to connect and build your framework</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative">
        {blocks.map((block) => (
          <motion.div
            key={block.id}
            onClick={() => handleBlockClick(block.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative p-4 rounded-xl cursor-pointer transition-all duration-300
              ${selectedBlock === block.id 
                ? 'ring-2 ring-[#00D4FF] bg-[#00D4FF]/20' 
                : 'bg-white/5 hover:bg-white/10'}
              ${isConnected(block.id) ? 'border-2' : 'border border-white/10'}
            `}
            style={{
              borderColor: isConnected(block.id) ? getCategoryColor(block.category) : undefined,
              boxShadow: isConnected(block.id) ? `0 0 20px ${getCategoryColor(block.category)}40` : undefined
            }}
            data-testid={`policy-block-${block.id}`}
          >
            <div 
              className="w-3 h-3 rounded-full mb-2"
              style={{ backgroundColor: getCategoryColor(block.category) }}
            />
            <h4 className="font-medium text-sm">{block.name}</h4>
            <p className="text-xs text-muted-foreground capitalize">{block.category}</p>
            
            {block.connected.length > 0 && (
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#00D4FF] flex items-center justify-center">
                <LinkIcon className="w-3 h-3 text-black" />
              </div>
            )}

            <AnimatePresence>
              {selectedBlock === block.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-[#00D4FF]"
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {connections.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-sm font-medium">Framework Connections</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {connections.map((conn, index) => (
              <span 
                key={index}
                className="px-2 py-1 rounded-full bg-white/10 text-xs"
              >
                {blocks.find(b => b.id === conn.from)?.name} → {blocks.find(b => b.id === conn.to)?.name}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function SecurityPolicies() {
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const { progress, scrollY } = useScrollProgress();
  const isMobile = useIsMobile();
  
  const overallCompliance = Math.round(
    policyCategories.reduce((sum, cat) => sum + cat.compliance, 0) / policyCategories.length
  );

  const handlePolicyClick = useCallback((id: string) => {
    setSelectedPolicy(prev => prev === id ? null : id);
  }, []);

  const parallaxY = isMobile ? 0 : scrollY * 0.15;
  const parallaxScale = isMobile ? 1 : 1 + progress * 0.05;

  return (
    <div className="min-h-screen aurora-bg text-white relative overflow-hidden">
      <div 
        className="fixed inset-0 z-background pointer-events-none"
        style={{
          transform: `translateY(${parallaxY}px) scale(${parallaxScale})`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/5 via-transparent to-purple-500/5" />
      </div>
      <AmbientParticles variant="network" count={isMobile ? 12 : 30} color="#00D4FF" opacity={0.15} />

      <div className="relative z-content">
        <div className="fixed top-6 left-6 z-50">
          <Link
            href="/experience"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all"
            data-testid="link-back-experience"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Experience</span>
          </Link>
        </div>

        <div className="container mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-6">
              <Shield className="w-4 h-4 text-[#00D4FF]" />
              <span className="text-[#00D4FF] text-sm font-medium">Security Framework</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Security
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-purple-500">
                Policies
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive security policies protecting your organization with robust frameworks and compliance standards.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-[#00D4FF]/30"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Interactive Policy Viewer</h2>
              <span className="text-sm text-muted-foreground">Click documents to view details</span>
            </div>
            <ThreeJSScene 
              selectedPolicy={selectedPolicy}
              onPolicyClick={handlePolicyClick}
              isMobile={isMobile}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1 p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center"
            >
              <h3 className="text-xl font-bold mb-4">Overall Compliance</h3>
              <ComplianceMeter value={overallCompliance} />
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-[#00D4FF]" />
                <span className="text-muted-foreground">Continuously monitored</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <PolicyBuilder />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#8B5CF6]/20">
                <FileText className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <h2 className="text-2xl font-bold">Policy Categories</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {policyCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => handlePolicyClick(category.id)}
                  className={`
                    relative p-6 rounded-2xl cursor-pointer transition-all duration-500
                    bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl
                    border overflow-hidden group
                    ${selectedPolicy === category.id 
                      ? 'border-[#00D4FF] ring-2 ring-[#00D4FF]/50' 
                      : 'border-white/10 hover:border-white/30'}
                  `}
                  style={{
                    boxShadow: hoveredCategory === category.id 
                      ? `0 0 40px ${category.color}30, inset 0 0 40px ${category.color}10`
                      : undefined
                  }}
                  data-testid={`policy-card-${category.id}`}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${category.color}15 0%, transparent 70%)`
                    }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                        style={{ 
                          backgroundColor: `${category.color}20`,
                          boxShadow: hoveredCategory === category.id ? `0 0 20px ${category.color}50` : undefined
                        }}
                      >
                        {(() => {
                          const IconComponent = category.icon;
                          return <IconComponent className="w-6 h-6 transition-all duration-300" style={{ color: category.color }} />;
                        })()}
                      </div>
                      <div className="flex items-center gap-1">
                        <span 
                          className="text-sm font-bold"
                          style={{ color: category.color }}
                        >
                          {category.compliance}%
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 group-hover:text-white transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${category.compliance}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: category.color,
                          boxShadow: `0 0 10px ${category.color}`
                        }}
                      />
                    </div>

                    <AnimatePresence>
                      {selectedPolicy === category.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <h4 className="text-sm font-medium mb-2">Key Requirements:</h4>
                          <ul className="space-y-1">
                            {category.requirements.map((req, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="w-3 h-3 text-[#00D4FF]" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: category.color }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredCategory === category.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 rounded-3xl bg-gradient-to-r from-[#00D4FF]/10 to-purple-500/10 border border-[#00D4FF]/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Need Custom Policies?</h3>
                <p className="text-muted-foreground">
                  Our security experts can help develop tailored policies for your organization.
                </p>
              </div>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full bg-[#00D4FF] text-black font-medium hover:bg-[#00D4FF]/90 transition-colors flex items-center gap-2"
                data-testid="link-contact-policies"
              >
                <span>Get Started</span>
                <Plus className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}