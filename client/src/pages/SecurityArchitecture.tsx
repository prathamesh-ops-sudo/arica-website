import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import * as THREE from 'three';
import {
  ArrowLeft, Shield, Server, Database, Users, Cloud, Flame,
  Lock, Eye, AlertTriangle, CheckCircle, Activity, Zap,
  Layers, Network, Globe2, Key, FileCheck, X
} from 'lucide-react';

interface NetworkNode {
  id: string;
  type: 'firewall' | 'server' | 'database' | 'user' | 'cloud';
  label: string;
  position: THREE.Vector3;
  mesh?: THREE.Mesh;
  connections: string[];
  securityLevel: number;
  status: 'secure' | 'warning' | 'critical';
  details: {
    ip?: string;
    lastScan?: string;
    vulnerabilities?: number;
    uptime?: string;
  };
}

interface DataPacket {
  mesh: THREE.Mesh;
  startNode: string;
  endNode: string;
  progress: number;
  speed: number;
  curve: THREE.QuadraticBezierCurve3;
}

interface SecurityLayer {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  status: 'active' | 'warning' | 'inactive';
  nodeTypes: string[];
  color: string;
}

const nodeColors = {
  firewall: 0xff4444,
  server: 0x4488ff,
  database: 0x44ff88,
  user: 0x00D4FF,
  cloud: 0xaa44ff,
};

const nodeLabels = {
  firewall: 'Firewall',
  server: 'Server',
  database: 'Database',
  user: 'User',
  cloud: 'Cloud',
};

const securityLayers: SecurityLayer[] = [
  {
    id: 'perimeter',
    name: 'Perimeter Security',
    icon: <Globe2 className="w-5 h-5" />,
    description: 'External network boundaries and edge protection',
    status: 'active',
    nodeTypes: ['firewall'],
    color: '#ff4444',
  },
  {
    id: 'network',
    name: 'Network Security',
    icon: <Network className="w-5 h-5" />,
    description: 'Internal network segmentation and monitoring',
    status: 'active',
    nodeTypes: ['firewall', 'server'],
    color: '#ff8844',
  },
  {
    id: 'endpoint',
    name: 'Endpoint Security',
    icon: <Server className="w-5 h-5" />,
    description: 'Device protection and endpoint detection',
    status: 'warning',
    nodeTypes: ['server', 'user'],
    color: '#ffaa44',
  },
  {
    id: 'application',
    name: 'Application Security',
    icon: <Layers className="w-5 h-5" />,
    description: 'Application layer security and WAF',
    status: 'active',
    nodeTypes: ['server', 'cloud'],
    color: '#44ff88',
  },
  {
    id: 'data',
    name: 'Data Security',
    icon: <Database className="w-5 h-5" />,
    description: 'Encryption and data loss prevention',
    status: 'active',
    nodeTypes: ['database'],
    color: '#4488ff',
  },
  {
    id: 'identity',
    name: 'Identity & Access',
    icon: <Key className="w-5 h-5" />,
    description: 'Authentication and authorization controls',
    status: 'active',
    nodeTypes: ['user', 'cloud'],
    color: '#aa44ff',
  },
];

const initialNodes: Omit<NetworkNode, 'mesh'>[] = [
  { id: 'fw1', type: 'firewall', label: 'Edge Firewall', position: new THREE.Vector3(-6, 3, 0), connections: ['srv1', 'srv2'], securityLevel: 95, status: 'secure', details: { ip: '10.0.0.1', lastScan: '2 min ago', vulnerabilities: 0, uptime: '99.99%' } },
  { id: 'fw2', type: 'firewall', label: 'Internal Firewall', position: new THREE.Vector3(-6, -3, 0), connections: ['srv3', 'db1'], securityLevel: 92, status: 'secure', details: { ip: '10.0.0.2', lastScan: '5 min ago', vulnerabilities: 1, uptime: '99.95%' } },
  { id: 'srv1', type: 'server', label: 'Web Server 1', position: new THREE.Vector3(-2, 4, 2), connections: ['db1', 'cloud1'], securityLevel: 88, status: 'secure', details: { ip: '10.0.1.10', lastScan: '1 min ago', vulnerabilities: 2, uptime: '99.9%' } },
  { id: 'srv2', type: 'server', label: 'Web Server 2', position: new THREE.Vector3(-2, 2, -2), connections: ['db1', 'cloud1'], securityLevel: 85, status: 'warning', details: { ip: '10.0.1.11', lastScan: '3 min ago', vulnerabilities: 4, uptime: '99.8%' } },
  { id: 'srv3', type: 'server', label: 'App Server', position: new THREE.Vector3(-2, -2, 1), connections: ['db2', 'cloud1'], securityLevel: 90, status: 'secure', details: { ip: '10.0.1.20', lastScan: '2 min ago', vulnerabilities: 1, uptime: '99.95%' } },
  { id: 'db1', type: 'database', label: 'Primary DB', position: new THREE.Vector3(2, 2, 0), connections: ['db2'], securityLevel: 98, status: 'secure', details: { ip: '10.0.2.10', lastScan: '30 sec ago', vulnerabilities: 0, uptime: '99.999%' } },
  { id: 'db2', type: 'database', label: 'Replica DB', position: new THREE.Vector3(2, -2, 0), connections: [], securityLevel: 97, status: 'secure', details: { ip: '10.0.2.11', lastScan: '1 min ago', vulnerabilities: 0, uptime: '99.99%' } },
  { id: 'cloud1', type: 'cloud', label: 'Cloud Services', position: new THREE.Vector3(6, 1, 0), connections: ['user1', 'user2'], securityLevel: 94, status: 'secure', details: { ip: 'cloud.api', lastScan: '10 sec ago', vulnerabilities: 1, uptime: '99.95%' } },
  { id: 'user1', type: 'user', label: 'Admin Users', position: new THREE.Vector3(6, 4, 2), connections: [], securityLevel: 82, status: 'warning', details: { ip: 'dynamic', lastScan: '5 min ago', vulnerabilities: 3, uptime: 'N/A' } },
  { id: 'user2', type: 'user', label: 'End Users', position: new THREE.Vector3(6, -3, -1), connections: [], securityLevel: 75, status: 'warning', details: { ip: 'dynamic', lastScan: '10 min ago', vulnerabilities: 5, uptime: 'N/A' } },
];

export default function SecurityArchitecture() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [webglError, setWebglError] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState(0);
  const [attackSimulation, setAttackSimulation] = useState(false);
  const [blockedAttacks, setBlockedAttacks] = useState(0);

  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    nodes: Map<string, NetworkNode>;
    packets: DataPacket[];
    connections: THREE.Line[];
    defenseRings: THREE.Mesh[];
    animationId: number | null;
    clock: THREE.Clock;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    targetRotation: { x: number; y: number };
    currentRotation: { x: number; y: number };
    attackParticles: THREE.Points | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    nodes: new Map(),
    packets: [],
    connections: [],
    defenseRings: [],
    animationId: null,
    clock: new THREE.Clock(),
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    targetRotation: { x: 0, y: 0 },
    currentRotation: { x: 0, y: 0 },
    attackParticles: null,
  });

  useEffect(() => {
    const duration = 2000;
    const targetScore = 89;
    const startTime = Date.now();

    const animateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setHealthScore(Math.round(targetScore * eased));
      if (progress < 1) requestAnimationFrame(animateScore);
    };

    animateScore();
  }, []);

  const initScene = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;

    try {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000510);
      scene.fog = new THREE.Fog(0x000510, 15, 35);

      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.set(0, 0, 18);

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        failIfMajorPerformanceCaveat: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const ambientLight = new THREE.AmbientLight(0x00D4FF, 0.3);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x00D4FF, 1, 30);
      pointLight1.position.set(10, 10, 10);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xaa44ff, 0.8, 25);
      pointLight2.position.set(-10, -5, 5);
      scene.add(pointLight2);

      sceneRef.current.scene = scene;
      sceneRef.current.camera = camera;
      sceneRef.current.renderer = renderer;

      createNodes(scene);
      createConnections(scene);
      createDefenseRings(scene);
      createAmbientParticles(scene);

      setIsLoaded(true);
    } catch (error) {
      console.error('WebGL initialization failed:', error);
      setWebglError(true);
      setIsLoaded(true);
    }
  }, []);

  const createNodes = (scene: THREE.Scene) => {
    initialNodes.forEach((nodeData) => {
      const geometry = new THREE.IcosahedronGeometry(0.5, 1);
      const material = new THREE.MeshPhongMaterial({
        color: nodeColors[nodeData.type],
        emissive: nodeColors[nodeData.type],
        emissiveIntensity: 0.3,
        shininess: 100,
        transparent: true,
        opacity: 0.9,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(nodeData.position);
      mesh.userData = { nodeId: nodeData.id };
      scene.add(mesh);

      const glowGeometry = new THREE.IcosahedronGeometry(0.7, 1);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: nodeColors[nodeData.type],
        transparent: true,
        opacity: 0.15,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      mesh.add(glow);

      const node: NetworkNode = {
        ...nodeData,
        mesh,
      };
      sceneRef.current.nodes.set(nodeData.id, node);
    });
  };

  const createConnections = (scene: THREE.Scene) => {
    sceneRef.current.nodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        const targetNode = sceneRef.current.nodes.get(targetId);
        if (!targetNode) return;

        const points = [node.position, targetNode.position];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: 0x00D4FF,
          transparent: true,
          opacity: 0.3,
        });

        const line = new THREE.Line(geometry, material);
        scene.add(line);
        sceneRef.current.connections.push(line);

        createDataPacket(scene, node.id, targetId);
      });
    });
  };

  const createDataPacket = (scene: THREE.Scene, startId: string, endId: string) => {
    const startNode = sceneRef.current.nodes.get(startId);
    const endNode = sceneRef.current.nodes.get(endId);
    if (!startNode || !endNode) return;

    const geometry = new THREE.SphereGeometry(0.08, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00D4FF,
      transparent: true,
      opacity: 0.9,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const midPoint = new THREE.Vector3()
      .addVectors(startNode.position, endNode.position)
      .multiplyScalar(0.5);
    midPoint.y += 1;

    const curve = new THREE.QuadraticBezierCurve3(
      startNode.position.clone(),
      midPoint,
      endNode.position.clone()
    );

    sceneRef.current.packets.push({
      mesh,
      startNode: startId,
      endNode: endId,
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.002,
      curve,
    });
  };

  const createDefenseRings = (scene: THREE.Scene) => {
    const ringColors = [0xff4444, 0xff8844, 0xffaa44, 0x44ff88, 0x4488ff, 0xaa44ff];
    
    for (let i = 0; i < 6; i++) {
      const radius = 10 + i * 1.5;
      const geometry = new THREE.RingGeometry(radius - 0.1, radius, 64);
      const material = new THREE.MeshBasicMaterial({
        color: ringColors[i],
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
      });

      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -5;
      scene.add(ring);
      sceneRef.current.defenseRings.push(ring);
    }
  };

  const createAmbientParticles = (scene: THREE.Scene) => {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const color = new THREE.Color(0x00D4FF);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
  };

  const animate = useCallback(() => {
    const { scene, camera, renderer, nodes, packets, defenseRings, clock } = sceneRef.current;
    if (!scene || !camera || !renderer) return;

    const time = clock.getElapsedTime();

    sceneRef.current.currentRotation.x += (sceneRef.current.targetRotation.x - sceneRef.current.currentRotation.x) * 0.05;
    sceneRef.current.currentRotation.y += (sceneRef.current.targetRotation.y - sceneRef.current.currentRotation.y) * 0.05;

    scene.rotation.y = sceneRef.current.currentRotation.y * 0.3 + time * 0.05;
    scene.rotation.x = sceneRef.current.currentRotation.x * 0.2;

    nodes.forEach((node) => {
      if (node.mesh) {
        node.mesh.rotation.x = time * 0.5;
        node.mesh.rotation.y = time * 0.3;

        const isHovered = hoveredNode === node.id;
        const isLayerActive = activeLayer && securityLayers.find(l => l.id === activeLayer)?.nodeTypes.includes(node.type);
        const scale = isHovered ? 1.3 : isLayerActive ? 1.2 : 1;
        node.mesh.scale.setScalar(scale + Math.sin(time * 2) * 0.05);

        const material = node.mesh.material as THREE.MeshPhongMaterial;
        material.emissiveIntensity = isHovered || isLayerActive ? 0.8 : 0.3 + Math.sin(time * 2) * 0.1;
      }
    });

    packets.forEach((packet) => {
      packet.progress += packet.speed;
      if (packet.progress > 1) packet.progress = 0;

      const point = packet.curve.getPoint(packet.progress);
      packet.mesh.position.copy(point);

      const scale = 1 + Math.sin(packet.progress * Math.PI) * 0.5;
      packet.mesh.scale.setScalar(scale);
    });

    defenseRings.forEach((ring, i) => {
      ring.rotation.z = time * 0.1 * (i % 2 === 0 ? 1 : -1);
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(time * 2 + i) * 0.05;
    });

    renderer.render(scene, camera);
    sceneRef.current.animationId = requestAnimationFrame(animate);
  }, [hoveredNode, activeLayer]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!containerRef.current || !sceneRef.current.camera) return;

    const rect = containerRef.current.getBoundingClientRect();
    sceneRef.current.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    sceneRef.current.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    sceneRef.current.targetRotation.x = sceneRef.current.mouse.y * 0.5;
    sceneRef.current.targetRotation.y = sceneRef.current.mouse.x * 0.5;

    sceneRef.current.raycaster.setFromCamera(sceneRef.current.mouse, sceneRef.current.camera);
    const intersects = sceneRef.current.raycaster.intersectObjects(
      Array.from(sceneRef.current.nodes.values()).map((n) => n.mesh!).filter(Boolean)
    );

    if (intersects.length > 0) {
      const nodeId = intersects[0].object.userData.nodeId;
      setHoveredNode(nodeId);
      if (containerRef.current) containerRef.current.style.cursor = 'pointer';
    } else {
      setHoveredNode(null);
      if (containerRef.current) containerRef.current.style.cursor = 'default';
    }
  }, []);

  const handleClick = useCallback((event: MouseEvent) => {
    if (!sceneRef.current.camera) return;

    sceneRef.current.raycaster.setFromCamera(sceneRef.current.mouse, sceneRef.current.camera);
    const intersects = sceneRef.current.raycaster.intersectObjects(
      Array.from(sceneRef.current.nodes.values()).map((n) => n.mesh!).filter(Boolean)
    );

    if (intersects.length > 0) {
      const nodeId = intersects[0].object.userData.nodeId;
      const node = sceneRef.current.nodes.get(nodeId);
      if (node) setSelectedNode(node);
    }
  }, []);

  const handleResize = useCallback(() => {
    if (!containerRef.current || !sceneRef.current.camera || !sceneRef.current.renderer) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    sceneRef.current.camera.aspect = width / height;
    sceneRef.current.camera.updateProjectionMatrix();
    sceneRef.current.renderer.setSize(width, height);
  }, []);

  useEffect(() => {
    initScene();
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('click', handleClick);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('click', handleClick);
      }
      window.removeEventListener('resize', handleResize);

      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }

      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose();
      }

      if (sceneRef.current.scene) {
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            }
          }
        });
      }

      sceneRef.current.nodes.clear();
      sceneRef.current.packets = [];
      sceneRef.current.connections = [];
      sceneRef.current.defenseRings = [];
    };
  }, [initScene, handleMouseMove, handleClick, handleResize]);

  useEffect(() => {
    if (isLoaded) {
      animate();
    }
  }, [isLoaded, animate]);

  const startAttackSimulation = useCallback(() => {
    setAttackSimulation(true);
    setBlockedAttacks(0);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setBlockedAttacks(count);
      if (count >= 12) {
        clearInterval(interval);
        setTimeout(() => setAttackSimulation(false), 2000);
      }
    }, 300);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure':
      case 'active':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'critical':
      case 'inactive':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'secure':
      case 'active':
        return 'bg-green-500/20 border-green-500/50';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/50';
      case 'critical':
      case 'inactive':
        return 'bg-red-500/20 border-red-500/50';
      default:
        return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-[#000510] text-white relative overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(0, 212, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(170, 68, 255, 0.05) 0%, transparent 40%)',
        }}
      />

      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10">
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#000510]/90 border-b border-[#00D4FF]/20">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between">
            <Link
              href="/experience"
              className="flex items-center gap-2 text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors font-mono text-sm"
              data-testid="link-back-experience"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Experience</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 font-mono text-xs">
                <div className="flex items-center gap-2 text-green-400">
                  <Shield className="w-3 h-3" />
                  <span>{sceneRef.current.nodes.size}</span>
                  <span className="text-[#00D4FF]/70">nodes</span>
                </div>
                <div className="flex items-center gap-2 text-[#00D4FF]">
                  <Activity className="w-3 h-3" />
                  <span>{sceneRef.current.packets.length}</span>
                  <span className="text-[#00D4FF]/70">packets</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#00D4FF]/10 px-3 py-1.5 rounded border border-[#00D4FF]/30">
                <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
                <span className="text-xs text-[#00D4FF] font-mono font-bold">LIVE TOPOLOGY</span>
              </div>
            </div>
          </div>
        </header>

        <main className="pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-6 mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded px-4 py-2 mb-4 font-mono text-xs">
              <Network className="w-4 h-4 text-[#00D4FF]" />
              <span className="text-[#00D4FF]">SECURITY ARCHITECTURE VISUALIZATION</span>
            </div>

            <h1 className="font-mono text-3xl md:text-5xl font-bold mb-3">
              <span className="text-[#00D4FF]">Network </span>
              <span className="text-white">Security</span>
              <span className="text-[#aa44ff]"> Architecture</span>
            </h1>

            <p className="text-[#00D4FF]/60 font-mono text-sm max-w-2xl mx-auto">
              Interactive 3D visualization of defense-in-depth security layers and network topology
            </p>
          </motion.div>

          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1 space-y-4"
              >
                <div className="bg-[#000510]/80 backdrop-blur-sm border border-[#00D4FF]/30 rounded-xl p-4">
                  <h3 className="font-mono text-sm text-[#00D4FF] mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Architecture Health
                  </h3>

                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="rgba(0, 212, 255, 0.1)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke={healthScore >= 80 ? '#44ff88' : healthScore >= 60 ? '#ffaa44' : '#ff4444'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(healthScore / 100) * 352} 352`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">{healthScore}</span>
                      <span className="text-xs text-[#00D4FF]/60">Score</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#00D4FF]/60">Secure Nodes</span>
                      <span className="text-green-400">8/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#00D4FF]/60">Warnings</span>
                      <span className="text-yellow-400">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#00D4FF]/60">Critical</span>
                      <span className="text-red-400">0</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#000510]/80 backdrop-blur-sm border border-[#00D4FF]/30 rounded-xl p-4">
                  <h3 className="font-mono text-sm text-[#00D4FF] mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Defense Simulation
                  </h3>

                  <button
                    onClick={startAttackSimulation}
                    disabled={attackSimulation}
                    className={`w-full py-2 px-4 rounded font-mono text-sm transition-all ${
                      attackSimulation
                        ? 'bg-red-500/20 border border-red-500/50 text-red-400 cursor-not-allowed'
                        : 'bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] hover:bg-[#00D4FF]/20'
                    }`}
                    data-testid="btn-attack-simulation"
                  >
                    {attackSimulation ? (
                      <span className="flex items-center justify-center gap-2">
                        <Flame className="w-4 h-4 animate-pulse" />
                        Simulating Attack...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4" />
                        Start Attack Simulation
                      </span>
                    )}
                  </button>

                  {attackSimulation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded"
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{blockedAttacks}</div>
                        <div className="text-xs text-green-400/70">Attacks Blocked</div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="bg-[#000510]/80 backdrop-blur-sm border border-[#00D4FF]/30 rounded-xl p-4">
                  <h3 className="font-mono text-sm text-[#00D4FF] mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Node Types
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(nodeColors).map(([type, color]) => (
                      <div key={type} className="flex items-center gap-2 text-xs font-mono">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: `#${color.toString(16).padStart(6, '0')}` }}
                        />
                        <span className="text-white capitalize">{nodeLabels[type as keyof typeof nodeLabels]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div
                  ref={containerRef}
                  className="relative rounded-2xl overflow-hidden border border-[#00D4FF]/30 bg-[#000510]/80 backdrop-blur-sm"
                  style={{ height: '500px' }}
                  data-testid="network-topology-canvas"
                >
                  {!webglError && <canvas ref={canvasRef} className="w-full h-full" />}

                  {!isLoaded && !webglError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#000510]">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-2 border-[#00D4FF]/30 border-t-[#00D4FF] rounded-full animate-spin" />
                        <span className="text-[#00D4FF] font-mono text-sm">Loading 3D Scene...</span>
                      </div>
                    </div>
                  )}

                  {webglError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#000510]">
                      <div className="flex flex-col items-center gap-6 text-center p-8">
                        <div className="relative">
                          <Network className="w-20 h-20 text-[#00D4FF]/30" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Shield className="w-10 h-10 text-[#00D4FF] animate-pulse" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-mono text-[#00D4FF]">3D Visualization Unavailable</h3>
                          <p className="text-sm text-[#00D4FF]/60 font-mono max-w-md">
                            WebGL is not available in this browser. The network topology visualization requires hardware-accelerated graphics.
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {initialNodes.slice(0, 6).map((node) => (
                            <div
                              key={node.id}
                              className="p-3 bg-[#00D4FF]/5 border border-[#00D4FF]/20 rounded-lg text-center cursor-pointer hover:bg-[#00D4FF]/10 transition-all"
                              onClick={() => {
                                const fullNode: NetworkNode = { ...node, mesh: undefined };
                                setSelectedNode(fullNode);
                              }}
                            >
                              <div
                                className="w-6 h-6 rounded-full mx-auto mb-2"
                                style={{ backgroundColor: `#${nodeColors[node.type].toString(16).padStart(6, '0')}` }}
                              />
                              <span className="text-xs font-mono text-white">{node.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {hoveredNode && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-4 bg-[#000510]/90 backdrop-blur-sm border border-[#00D4FF]/30 rounded-lg px-3 py-2"
                    >
                      <span className="text-xs font-mono text-[#00D4FF]">
                        Click to view: {sceneRef.current.nodes.get(hoveredNode)?.label}
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-1 space-y-3"
              >
                <h3 className="font-mono text-sm text-[#00D4FF] flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Security Layers
                </h3>

                {securityLayers.map((layer, index) => (
                  <motion.div
                    key={layer.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      activeLayer === layer.id
                        ? 'bg-[#00D4FF]/20 border-[#00D4FF]'
                        : 'bg-[#000510]/80 border-[#00D4FF]/20 hover:border-[#00D4FF]/50'
                    }`}
                    data-testid={`layer-card-${layer.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${layer.color}20`, color: layer.color }}
                      >
                        {layer.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-mono text-xs text-white font-medium truncate">
                            {layer.name}
                          </h4>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${getStatusBg(layer.status)} ${getStatusColor(layer.status)}`}
                          >
                            {layer.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#00D4FF]/50 mt-1 line-clamp-2">
                          {layer.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <div className="bg-[#000510]/80 backdrop-blur-sm border border-[#00D4FF]/30 rounded-xl p-6">
                <h3 className="font-mono text-sm text-[#00D4FF] mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Defense-in-Depth Visualization
                </h3>

                <div className="relative h-48 flex items-center justify-center">
                  {securityLayers.map((layer, index) => {
                    const size = 180 - index * 25;
                    return (
                      <motion.div
                        key={layer.id}
                        className="absolute rounded-full border-2 flex items-center justify-center"
                        style={{
                          width: size,
                          height: size,
                          borderColor: layer.color,
                          backgroundColor: `${layer.color}10`,
                        }}
                        animate={{
                          scale: activeLayer === layer.id ? [1, 1.05, 1] : 1,
                          opacity: activeLayer && activeLayer !== layer.id ? 0.3 : 1,
                        }}
                        transition={{ duration: 0.5, repeat: activeLayer === layer.id ? Infinity : 0 }}
                      >
                        {index === securityLayers.length - 1 && (
                          <div className="text-center">
                            <Lock className="w-6 h-6 text-[#aa44ff] mx-auto" />
                            <span className="text-[10px] text-[#aa44ff] font-mono">CORE</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}

                  <AnimatePresence>
                    {attackSimulation && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-red-500 rounded-full"
                            initial={{
                              x: Math.cos((i * Math.PI) / 3) * 120,
                              y: Math.sin((i * Math.PI) / 3) * 120,
                              opacity: 1,
                            }}
                            animate={{
                              x: 0,
                              y: 0,
                              opacity: [1, 1, 0],
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.3,
                              ease: 'easeIn',
                            }}
                            onAnimationComplete={() => {
                              if (i === 5) {
                              }
                            }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {securityLayers.map((layer) => (
                    <div
                      key={layer.id}
                      className="flex items-center gap-2 text-xs font-mono"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      />
                      <span className="text-[#00D4FF]/70">{layer.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#000510] border border-[#00D4FF]/30 rounded-2xl p-6 max-w-md w-full"
              data-testid="node-details-modal"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `#${nodeColors[selectedNode.type].toString(16).padStart(6, '0')}20`,
                    }}
                  >
                    {selectedNode.type === 'firewall' && <Flame className="w-5 h-5 text-red-400" />}
                    {selectedNode.type === 'server' && <Server className="w-5 h-5 text-blue-400" />}
                    {selectedNode.type === 'database' && <Database className="w-5 h-5 text-green-400" />}
                    {selectedNode.type === 'user' && <Users className="w-5 h-5 text-cyan-400" />}
                    {selectedNode.type === 'cloud' && <Cloud className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div>
                    <h3 className="font-mono text-lg text-white font-bold">{selectedNode.label}</h3>
                    <span className="text-xs text-[#00D4FF]/60 font-mono capitalize">{selectedNode.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 text-[#00D4FF]/50 hover:text-[#00D4FF] transition-colors"
                  data-testid="btn-close-modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#00D4FF]/5 rounded-lg border border-[#00D4FF]/20">
                  <span className="text-sm text-[#00D4FF]/70 font-mono">Security Level</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-[#00D4FF]/20 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          selectedNode.securityLevel >= 90
                            ? 'bg-green-400'
                            : selectedNode.securityLevel >= 70
                            ? 'bg-yellow-400'
                            : 'bg-red-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.securityLevel}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-sm font-mono text-white">{selectedNode.securityLevel}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#00D4FF]/5 rounded-lg border border-[#00D4FF]/20">
                    <span className="text-xs text-[#00D4FF]/50 font-mono">IP Address</span>
                    <p className="text-sm text-white font-mono mt-1">{selectedNode.details.ip}</p>
                  </div>
                  <div className="p-3 bg-[#00D4FF]/5 rounded-lg border border-[#00D4FF]/20">
                    <span className="text-xs text-[#00D4FF]/50 font-mono">Last Scan</span>
                    <p className="text-sm text-white font-mono mt-1">{selectedNode.details.lastScan}</p>
                  </div>
                  <div className="p-3 bg-[#00D4FF]/5 rounded-lg border border-[#00D4FF]/20">
                    <span className="text-xs text-[#00D4FF]/50 font-mono">Vulnerabilities</span>
                    <p className={`text-sm font-mono mt-1 ${
                      selectedNode.details.vulnerabilities === 0
                        ? 'text-green-400'
                        : selectedNode.details.vulnerabilities! <= 2
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}>
                      {selectedNode.details.vulnerabilities}
                    </p>
                  </div>
                  <div className="p-3 bg-[#00D4FF]/5 rounded-lg border border-[#00D4FF]/20">
                    <span className="text-xs text-[#00D4FF]/50 font-mono">Uptime</span>
                    <p className="text-sm text-white font-mono mt-1">{selectedNode.details.uptime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg border" style={{
                  backgroundColor: selectedNode.status === 'secure' ? 'rgba(68, 255, 136, 0.1)' : 'rgba(255, 170, 68, 0.1)',
                  borderColor: selectedNode.status === 'secure' ? 'rgba(68, 255, 136, 0.3)' : 'rgba(255, 170, 68, 0.3)',
                }}>
                  {selectedNode.status === 'secure' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  )}
                  <span className={`text-sm font-mono ${
                    selectedNode.status === 'secure' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    Status: {selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
