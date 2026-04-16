import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, Shield, AlertTriangle, Clock, Zap, Target, Globe2, Activity, ShieldCheck, ShieldAlert, ArrowRight, Search, Filter, X } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import * as THREE from "three";

const attackTypes = [
  { id: 'ddos', name: 'DDoS Attack', color: '#ff3344' },
  { id: 'sql', name: 'SQL Injection', color: '#ff9900' },
  { id: 'xss', name: 'XSS Attack', color: '#ffcc00' },
  { id: 'bruteforce', name: 'Brute Force', color: '#3D70B7' },
  { id: 'malware', name: 'Malware', color: '#42BA90' },
  { id: 'phishing', name: 'Phishing', color: '#ff6666' },
  { id: 'ransomware', name: 'Ransomware', color: '#5A8FD4' },
];

const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  // North America
  'New York, USA': { lat: 40.7128, lng: -74.006 },
  'Los Angeles, USA': { lat: 34.0522, lng: -118.2437 },
  'Chicago, USA': { lat: 41.8781, lng: -87.6298 },
  'Houston, USA': { lat: 29.7604, lng: -95.3698 },
  'Phoenix, USA': { lat: 33.4484, lng: -112.074 },
  'San Francisco, USA': { lat: 37.7749, lng: -122.4194 },
  'Seattle, USA': { lat: 47.6062, lng: -122.3321 },
  'Miami, USA': { lat: 25.7617, lng: -80.1918 },
  'Denver, USA': { lat: 39.7392, lng: -104.9903 },
  'Atlanta, USA': { lat: 33.749, lng: -84.388 },
  'Boston, USA': { lat: 42.3601, lng: -71.0589 },
  'Dallas, USA': { lat: 32.7767, lng: -96.797 },
  'Toronto, Canada': { lat: 43.6532, lng: -79.3832 },
  'Vancouver, Canada': { lat: 49.2827, lng: -123.1207 },
  'Montreal, Canada': { lat: 45.5017, lng: -73.5673 },
  'Mexico City, Mexico': { lat: 19.4326, lng: -99.1332 },
  'Guadalajara, Mexico': { lat: 20.6597, lng: -103.3496 },
  
  // South America
  'São Paulo, Brazil': { lat: -23.5505, lng: -46.6333 },
  'Rio de Janeiro, Brazil': { lat: -22.9068, lng: -43.1729 },
  'Buenos Aires, Argentina': { lat: -34.6037, lng: -58.3816 },
  'Lima, Peru': { lat: -12.0464, lng: -77.0428 },
  'Bogota, Colombia': { lat: 4.711, lng: -74.0721 },
  'Santiago, Chile': { lat: -33.4489, lng: -70.6693 },
  'Caracas, Venezuela': { lat: 10.4806, lng: -66.9036 },
  'Quito, Ecuador': { lat: -0.1807, lng: -78.4678 },
  
  // Europe
  'London, UK': { lat: 51.5074, lng: -0.1278 },
  'Paris, France': { lat: 48.8566, lng: 2.3522 },
  'Berlin, Germany': { lat: 52.52, lng: 13.405 },
  'Munich, Germany': { lat: 48.1351, lng: 11.582 },
  'Frankfurt, Germany': { lat: 50.1109, lng: 8.6821 },
  'Amsterdam, Netherlands': { lat: 52.3676, lng: 4.9041 },
  'Brussels, Belgium': { lat: 50.8503, lng: 4.3517 },
  'Madrid, Spain': { lat: 40.4168, lng: -3.7038 },
  'Barcelona, Spain': { lat: 41.3851, lng: 2.1734 },
  'Rome, Italy': { lat: 41.9028, lng: 12.4964 },
  'Milan, Italy': { lat: 45.4642, lng: 9.19 },
  'Vienna, Austria': { lat: 48.2082, lng: 16.3738 },
  'Zurich, Switzerland': { lat: 47.3769, lng: 8.5417 },
  'Stockholm, Sweden': { lat: 59.3293, lng: 18.0686 },
  'Oslo, Norway': { lat: 59.9139, lng: 10.7522 },
  'Copenhagen, Denmark': { lat: 55.6761, lng: 12.5683 },
  'Helsinki, Finland': { lat: 60.1699, lng: 24.9384 },
  'Dublin, Ireland': { lat: 53.3498, lng: -6.2603 },
  'Lisbon, Portugal': { lat: 38.7223, lng: -9.1393 },
  'Warsaw, Poland': { lat: 52.2297, lng: 21.0122 },
  'Prague, Czechia': { lat: 50.0755, lng: 14.4378 },
  'Budapest, Hungary': { lat: 47.4979, lng: 19.0402 },
  'Athens, Greece': { lat: 37.9838, lng: 23.7275 },
  'Moscow, Russia': { lat: 55.7558, lng: 37.6173 },
  'St Petersburg, Russia': { lat: 59.9311, lng: 30.3609 },
  'Kyiv, Ukraine': { lat: 50.4501, lng: 30.5234 },
  'Bucharest, Romania': { lat: 44.4268, lng: 26.1025 },
  
  // Asia
  'Beijing, China': { lat: 39.9042, lng: 116.4074 },
  'Shanghai, China': { lat: 31.2304, lng: 121.4737 },
  'Shenzhen, China': { lat: 22.5431, lng: 114.0579 },
  'Guangzhou, China': { lat: 23.1291, lng: 113.2644 },
  'Hong Kong': { lat: 22.3193, lng: 114.1694 },
  'Tokyo, Japan': { lat: 35.6762, lng: 139.6503 },
  'Osaka, Japan': { lat: 34.6937, lng: 135.5023 },
  'Seoul, South Korea': { lat: 37.5665, lng: 126.978 },
  'Busan, South Korea': { lat: 35.1796, lng: 129.0756 },
  'Taipei, Taiwan': { lat: 25.033, lng: 121.5654 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Bangkok, Thailand': { lat: 13.7563, lng: 100.5018 },
  'Ho Chi Minh, Vietnam': { lat: 10.8231, lng: 106.6297 },
  'Hanoi, Vietnam': { lat: 21.0285, lng: 105.8542 },
  'Jakarta, Indonesia': { lat: -6.2088, lng: 106.8456 },
  'Kuala Lumpur, Malaysia': { lat: 3.139, lng: 101.6869 },
  'Manila, Philippines': { lat: 14.5995, lng: 120.9842 },
  'Mumbai, India': { lat: 19.076, lng: 72.8777 },
  'Delhi, India': { lat: 28.7041, lng: 77.1025 },
  'Bangalore, India': { lat: 12.9716, lng: 77.5946 },
  'Chennai, India': { lat: 13.0827, lng: 80.2707 },
  'Hyderabad, India': { lat: 17.385, lng: 78.4867 },
  'Karachi, Pakistan': { lat: 24.8607, lng: 67.0011 },
  'Lahore, Pakistan': { lat: 31.5204, lng: 74.3587 },
  'Dhaka, Bangladesh': { lat: 23.8103, lng: 90.4125 },
  
  // Middle East
  'Dubai, UAE': { lat: 25.2048, lng: 55.2708 },
  'Abu Dhabi, UAE': { lat: 24.4539, lng: 54.3773 },
  'Tel Aviv, Israel': { lat: 32.0853, lng: 34.7818 },
  'Riyadh, Saudi Arabia': { lat: 24.7136, lng: 46.6753 },
  'Jeddah, Saudi Arabia': { lat: 21.4858, lng: 39.1925 },
  'Tehran, Iran': { lat: 35.6892, lng: 51.389 },
  'Istanbul, Turkey': { lat: 41.0082, lng: 28.9784 },
  'Ankara, Turkey': { lat: 39.9334, lng: 32.8597 },
  'Doha, Qatar': { lat: 25.2854, lng: 51.531 },
  'Kuwait City, Kuwait': { lat: 29.3759, lng: 47.9774 },
  'Beirut, Lebanon': { lat: 33.8938, lng: 35.5018 },
  
  // Africa
  'Cairo, Egypt': { lat: 30.0444, lng: 31.2357 },
  'Lagos, Nigeria': { lat: 6.5244, lng: 3.3792 },
  'Johannesburg, South Africa': { lat: -26.2041, lng: 28.0473 },
  'Cape Town, South Africa': { lat: -33.9249, lng: 18.4241 },
  'Nairobi, Kenya': { lat: -1.2921, lng: 36.8219 },
  'Casablanca, Morocco': { lat: 33.5731, lng: -7.5898 },
  'Accra, Ghana': { lat: 5.6037, lng: -0.187 },
  'Addis Ababa, Ethiopia': { lat: 9.0054, lng: 38.7636 },
  'Tunis, Tunisia': { lat: 36.8065, lng: 10.1815 },
  'Algiers, Algeria': { lat: 36.7538, lng: 3.0588 },
  'Dar es Salaam, Tanzania': { lat: -6.7924, lng: 39.2083 },
  
  // Oceania
  'Sydney, Australia': { lat: -33.8688, lng: 151.2093 },
  'Melbourne, Australia': { lat: -37.8136, lng: 144.9631 },
  'Brisbane, Australia': { lat: -27.4698, lng: 153.0251 },
  'Perth, Australia': { lat: -31.9505, lng: 115.8605 },
  'Auckland, New Zealand': { lat: -36.8509, lng: 174.7645 },
  'Wellington, New Zealand': { lat: -41.2866, lng: 174.7756 },
};

const cities = Object.keys(cityCoordinates);

interface Attack {
  id: number;
  from: string;
  to: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  time: string;
  isNew?: boolean;
}

interface AttackArc {
  mesh: THREE.Line;
  glowMesh: THREE.Line;
  progress: number;
  speed: number;
  curve: THREE.QuadraticBezierCurve3;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  severity: string;
  pulseMarker: THREE.Mesh;
  impactMarker: THREE.Mesh;
}

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

function getSeverityHexColor(severity: string): number {
  switch (severity) {
    case 'critical': return 0xff3344;
    case 'high': return 0xff9900;
    case 'medium': return 0xffcc00;
    case 'low': return 0x00ff88;
    default: return 0x00d4ff;
  }
}

export default function AttackGlobe() {
  const [liveCounter, setLiveCounter] = useState(2847);
  const [seconds, setSeconds] = useState(39);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [attackIdCounter, setAttackIdCounter] = useState(0);
  const [webglFailed, setWebglFailed] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    globeGroup: THREE.Group | null;
    arcs: AttackArc[];
    cityMarkers: Map<string, THREE.Mesh>;
    animationId: number | null;
    clock: THREE.Clock;
    isDragging: boolean;
    lastMouseX: number;
    lastMouseY: number;
    rotationVelocityY: number;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    globeGroup: null,
    arcs: [],
    cityMarkers: new Map(),
    animationId: null,
    clock: new THREE.Clock(),
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    rotationVelocityY: 0.002,
  });

  const addAttackArc = useCallback((from: string, to: string, severity: string) => {
    const refs = sceneRef.current;
    if (!refs.scene || !refs.globeGroup) return;

    const fromCoords = cityCoordinates[from];
    const toCoords = cityCoordinates[to];
    if (!fromCoords || !toCoords) return;

    const GLOBE_RADIUS = 5;
    const startPos = latLngToVector3(fromCoords.lat, fromCoords.lng, GLOBE_RADIUS);
    const endPos = latLngToVector3(toCoords.lat, toCoords.lng, GLOBE_RADIUS);

    const curve = createArcCurve(startPos, endPos, 0.4);
    const points = curve.getPoints(60);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const color = getSeverityHexColor(severity);
    
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

    const pulseGeom = new THREE.SphereGeometry(0.1, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 1,
    });
    const pulseMarker = new THREE.Mesh(pulseGeom, pulseMat);
    pulseMarker.position.copy(startPos);
    refs.globeGroup.add(pulseMarker);

    const impactGeom = new THREE.SphereGeometry(0.15, 12, 12);
    const impactMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
    });
    const impactMarker = new THREE.Mesh(impactGeom, impactMat);
    impactMarker.position.copy(endPos);
    refs.globeGroup.add(impactMarker);

    refs.arcs.push({
      mesh: line,
      glowMesh: glowLine,
      progress: 0,
      speed: 0.012 + Math.random() * 0.008,
      curve,
      startPos: startPos.clone(),
      endPos: endPos.clone(),
      severity,
      pulseMarker,
      impactMarker,
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const refs = sceneRef.current;
    const GLOBE_RADIUS = 5;

    refs.scene = new THREE.Scene();
    refs.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    refs.camera.position.set(0, 0, 14);

    try {
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        failIfMajorPerformanceCaveat: false,
      });
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.setClearColor(0x0a0a1e, 0);
    } catch (e) {
      console.warn('WebGL not available:', e);
      setWebglFailed(true);
      return;
    }
    
    if (!refs.renderer.getContext()) {
      console.warn('WebGL context unavailable');
      setWebglFailed(true);
      return;
    }

    refs.globeGroup = new THREE.Group();
    refs.scene.add(refs.globeGroup);

    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    
    const earthTexture = textureLoader.load(
      'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        earthMaterial.needsUpdate = true;
      }
    );
    
    const bumpTexture = textureLoader.load(
      'https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png'
    );
    
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.05,
      shininess: 5,
      specular: new THREE.Color(0x333333),
    });
    
    const sphere = new THREE.Mesh(sphereGeometry, earthMaterial);
    refs.globeGroup.add(sphere);
    
    const cloudsGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.01, 48, 48);
    const cloudsTexture = textureLoader.load(
      'https://unpkg.com/three-globe@2.31.0/example/img/earth-clouds.png'
    );
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    refs.globeGroup.add(clouds);
    (refs as any).clouds = clouds;
    
    const ambientLight = new THREE.AmbientLight(0x555555);
    refs.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 3, 5);
    refs.scene.add(directionalLight);

    const atmosphereGeom = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 32, 32);
    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x00d4ff) },
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
          float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          gl_FragColor = vec4(glowColor, intensity * 0.6);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeom, atmosphereMat);
    refs.scene.add(atmosphere);

    Object.entries(cityCoordinates).forEach(([city, coords]) => {
      const pos = latLngToVector3(coords.lat, coords.lng, GLOBE_RADIUS);
      
      const markerGeom = new THREE.SphereGeometry(0.06, 8, 8);
      const markerMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.9,
      });
      const marker = new THREE.Mesh(markerGeom, markerMat);
      marker.position.copy(pos);
      refs.globeGroup!.add(marker);
      refs.cityMarkers.set(city, marker);

      const ringGeom = new THREE.RingGeometry(0.1, 0.14, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      refs.globeGroup!.add(ring);
    });

    const particleCount = 300;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 7 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00d4ff,
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
    };

    const handleMouseUp = () => {
      refs.isDragging = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (refs.isDragging && refs.globeGroup) {
        const deltaX = e.clientX - refs.lastMouseX;
        refs.rotationVelocityY = deltaX * 0.005;
        refs.lastMouseX = e.clientX;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        refs.isDragging = true;
        refs.lastMouseX = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (refs.isDragging && refs.globeGroup && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - refs.lastMouseX;
        refs.rotationVelocityY = deltaX * 0.005;
        refs.lastMouseX = e.touches[0].clientX;
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

    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);
      const time = refs.clock.getElapsedTime();

      if (refs.globeGroup) {
        if (!refs.isDragging) {
          refs.rotationVelocityY *= 0.98;
          if (Math.abs(refs.rotationVelocityY) < 0.002) {
            refs.rotationVelocityY = 0.002;
          }
        }
        refs.globeGroup.rotation.y += refs.rotationVelocityY;
        
        if ((refs as any).clouds) {
          (refs as any).clouds.rotation.y += 0.0001;
        }
      }

      refs.cityMarkers.forEach((marker, i) => {
        const pulse = Math.sin(time * 2 + i.charCodeAt(0) * 0.1) * 0.3 + 0.7;
        (marker.material as THREE.MeshBasicMaterial).opacity = pulse;
      });

      refs.arcs = refs.arcs.filter(arc => {
        arc.progress += arc.speed;

        const fadeIn = Math.min(arc.progress * 4, 1);
        const fadeOut = 1 - Math.max((arc.progress - 0.75) * 4, 0);
        const baseOpacity = fadeIn * fadeOut;
        
        const pulse = Math.sin(time * 15 + arc.progress * 30) * 0.2 + 0.8;
        
        (arc.mesh.material as THREE.LineBasicMaterial).opacity = baseOpacity * 0.9;
        (arc.glowMesh.material as THREE.LineBasicMaterial).opacity = baseOpacity * pulse * 0.5;

        const currentPoint = arc.curve.getPoint(Math.min(arc.progress, 1));
        arc.pulseMarker.position.copy(currentPoint);
        
        const pulseScale = 0.8 + Math.sin(time * 20) * 0.4;
        arc.pulseMarker.scale.setScalar(pulseScale);
        (arc.pulseMarker.material as THREE.MeshBasicMaterial).opacity = baseOpacity;

        if (arc.progress > 0.9) {
          const impactOpacity = (arc.progress - 0.9) * 10;
          const impactScale = 1 + impactOpacity * 2;
          arc.impactMarker.scale.setScalar(impactScale);
          (arc.impactMarker.material as THREE.MeshBasicMaterial).opacity = (1 - impactOpacity) * 0.8;
        }

        if (arc.progress >= 1.2) {
          refs.globeGroup?.remove(arc.mesh);
          refs.globeGroup?.remove(arc.glowMesh);
          refs.globeGroup?.remove(arc.pulseMarker);
          refs.globeGroup?.remove(arc.impactMarker);
          arc.mesh.geometry.dispose();
          (arc.mesh.material as THREE.Material).dispose();
          arc.glowMesh.geometry.dispose();
          (arc.glowMesh.material as THREE.Material).dispose();
          arc.pulseMarker.geometry.dispose();
          (arc.pulseMarker.material as THREE.Material).dispose();
          arc.impactMarker.geometry.dispose();
          (arc.impactMarker.material as THREE.Material).dispose();
          return false;
        }

        return true;
      });

      particles.rotation.y += 0.0003;

      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
    };
    animate();

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
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
        arc.impactMarker.geometry.dispose();
        (arc.impactMarker.material as THREE.Material).dispose();
      });
      refs.arcs = [];
      
      refs.cityMarkers.forEach(marker => {
        marker.geometry.dispose();
        (marker.material as THREE.Material).dispose();
      });
      refs.cityMarkers.clear();
      
      if (refs.globeGroup) {
        refs.globeGroup.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
            object.geometry?.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(m => m.dispose());
              } else {
                (object.material as THREE.Material).dispose();
              }
            }
          }
        });
        refs.scene?.remove(refs.globeGroup);
      }
      
      if (refs.scene) {
        refs.scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
            object.geometry?.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(m => m.dispose());
              } else {
                (object.material as THREE.Material).dispose();
              }
            }
          }
        });
      }
      
      if (refs.renderer) {
        refs.renderer.dispose();
        refs.renderer.forceContextLoss();
      }
      
      refs.scene = null;
      refs.camera = null;
      refs.renderer = null;
      refs.globeGroup = null;
    };
  }, []);

  const generateRandomAttack = useCallback((): Attack => {
    const fromCity = cities[Math.floor(Math.random() * cities.length)];
    let toCity = cities[Math.floor(Math.random() * cities.length)];
    while (toCity === fromCity) {
      toCity = cities[Math.floor(Math.random() * cities.length)];
    }
    const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    const severities: Attack['severity'][] = ['critical', 'high', 'medium', 'low'];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    return {
      id: Date.now() + Math.random(),
      from: fromCity,
      to: toCity,
      type: type.name,
      severity,
      time: 'just now',
      isNew: true,
    };
  }, []);

  useEffect(() => {
    const initialAttacks: Attack[] = [];
    for (let i = 0; i < 8; i++) {
      const attack = generateRandomAttack();
      attack.id = i;
      attack.time = `${(i + 1) * 2}s ago`;
      attack.isNew = false;
      initialAttacks.push(attack);
    }
    setAttacks(initialAttacks);
    setAttackIdCounter(8);
  }, [generateRandomAttack]);

  useEffect(() => {
    const addAttack = () => {
      const attackCount = Math.random() > 0.7 ? 2 : 1;
      
      for (let i = 0; i < attackCount; i++) {
        const newAttack = generateRandomAttack();
        newAttack.id = attackIdCounter + i;
        
        addAttackArc(newAttack.from, newAttack.to, newAttack.severity);
        
        setAttacks(prev => {
          const updated = prev.map(a => ({ ...a, isNew: false }));
          const newList = [newAttack, ...updated].slice(0, 15);
          return newList;
        });
      }
      
      setAttackIdCounter(prev => prev + attackCount);
      setLiveCounter(prev => prev + attackCount);
    };

    const randomInterval = () => Math.floor(Math.random() * 800) + 400;
    
    let timeoutId: NodeJS.Timeout;
    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        addAttack();
        scheduleNext();
      }, randomInterval());
    };
    
    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [attackIdCounter, generateRandomAttack, addAttackArc]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAttacks(prev => prev.map(attack => {
        const timeMatch = attack.time.match(/(\d+)s ago/);
        if (attack.time === 'just now') {
          return { ...attack, time: '1s ago' };
        } else if (timeMatch) {
          const secs = parseInt(timeMatch[1]) + 1;
          return { ...attack, time: `${secs}s ago` };
        }
        return attack;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) return 39;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredAttacks = attacks.filter(attack => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!attack.from.toLowerCase().includes(query) &&
          !attack.to.toLowerCase().includes(query) &&
          !attack.type.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (selectedTypes.length > 0) {
      if (!selectedTypes.some(type => attack.type.toLowerCase().includes(type.toLowerCase()))) {
        return false;
      }
    }
    return true;
  });
  
  const toggleTypeFilter = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-500 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/50';
      case 'low': return 'text-[#42BA90] bg-[#42BA90]/20 border-[#42BA90]/50';
      default: return 'text-white/50 bg-white/10 border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1e] relative overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a1e]/80 border-b border-[#3D70B7]/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/experience"
            className="flex items-center gap-2 text-[#3D70B7] hover:text-white transition-colors text-sm font-medium"
            data-testid="link-back-experience"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Experience</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-white/60 text-sm">
              <Activity className="w-4 h-4 text-[#3D70B7]" />
              <span>Live Monitoring</span>
            </div>
            <motion.div 
              className="flex items-center gap-2 bg-[#ff3344]/10 px-4 py-2 rounded-full border border-[#ff3344]/30"
              animate={{ 
                boxShadow: ['0 0 10px rgba(255,51,68,0.2)', '0 0 25px rgba(255,51,68,0.4)', '0 0 10px rgba(255,51,68,0.2)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-2 h-2 rounded-full bg-[#ff3344]"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs text-[#ff3344] font-bold uppercase tracking-wider">Live</span>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6"
          >
            <motion.div 
              className="inline-flex items-center gap-3 bg-[#ff3344]/10 border border-[#ff3344]/30 rounded-full px-6 py-2 mb-4 backdrop-blur-xl"
              animate={{ 
                boxShadow: ['0 0 15px rgba(255,51,68,0.1)', '0 0 30px rgba(255,51,68,0.2)', '0 0 15px rgba(255,51,68,0.1)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <AlertTriangle className="w-4 h-4 text-[#ff3344]" />
              <span className="text-[#ff3344] font-medium text-sm">Global Threat Intelligence Active</span>
            </motion.div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight">
              <span className="text-white drop-shadow-lg">Real-Time </span>
              <span style={{ color: '#3D70B7' }}>Cyber Attack</span>
              <span className="text-white drop-shadow-lg"> Monitoring</span>
            </h1>
            
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto drop-shadow-lg">
              Witness the invisible war. Every second, thousands of attacks target businesses worldwide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"
          >
            <div className="backdrop-blur-xl bg-[#0a0a1e]/70 border border-white/10 rounded-2xl p-4 group hover:border-[#ff3344]/30 transition-all duration-500">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-4 h-4 text-[#ff3344]" />
                <motion.span 
                  className="text-[#ff3344] text-xl font-bold font-mono"
                  key={seconds}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {seconds}s
                </motion.span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Every 39</h3>
              <p className="text-white/40 text-xs">Seconds a Hack Occurs</p>
            </div>
            
            <div className="backdrop-blur-xl bg-[#0a0a1e]/70 border border-white/10 rounded-2xl p-4 group hover:border-[#3D70B7]/30 transition-all duration-500">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-4 h-4 text-[#3D70B7]" />
                <Zap className="w-3 h-3 text-[#3D70B7] animate-pulse" />
              </div>
              <motion.h3 
                className="text-xl md:text-2xl font-bold text-white mb-1"
                key={liveCounter}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
              >
                {liveCounter.toLocaleString()}
              </motion.h3>
              <p className="text-white/40 text-xs">Attacks Detected Today</p>
            </div>
            
            <div className="backdrop-blur-xl bg-[#0a0a1e]/70 border border-white/10 rounded-2xl p-4 group hover:border-yellow-500/30 transition-all duration-500">
              <div className="flex items-center justify-between mb-2">
                <ShieldAlert className="w-4 h-4 text-yellow-500" />
                <span className="text-[10px] text-yellow-500/70 uppercase font-medium">2025</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">$4.45M</h3>
              <p className="text-white/40 text-xs">Avg. Breach Cost</p>
            </div>
            
            <div className="backdrop-blur-xl bg-[#0a0a1e]/70 border border-white/10 rounded-2xl p-4 group hover:border-[#3D70B7]/30 transition-all duration-500">
              <div className="flex items-center justify-between mb-2">
                <Globe2 className="w-4 h-4 text-[#3D70B7]" />
                <span className="text-[10px] text-[#3D70B7]/70 uppercase font-medium">Global</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">$10.5T</h3>
              <p className="text-white/40 text-xs">Annual Cybercrime Cost</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          >
            <div className="lg:col-span-2">
              <div 
                ref={containerRef}
                className="relative w-full aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden border border-[#3D70B7]/20 bg-[#050510]"
                style={{ boxShadow: '0 0 60px rgba(61, 112, 183,0.15), inset 0 0 60px rgba(61, 112, 183,0.05)' }}
              >
                {webglFailed ? (
                  <div className="w-full h-full flex items-center justify-center" data-testid="webgl-fallback">
                    <div className="text-center p-8">
                      <Globe2 className="w-24 h-24 mx-auto mb-4 text-[#3D70B7]/50" />
                      <h3 className="text-xl font-semibold text-white/80 mb-2">3D Globe Unavailable</h3>
                      <p className="text-white/50">WebGL is required for the interactive globe visualization.</p>
                    </div>
                  </div>
                ) : (
                  <canvas 
                    ref={canvasRef}
                    className="w-full h-full"
                    data-testid="globe-canvas"
                  />
                )}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="backdrop-blur-md bg-black/50 rounded-full px-4 py-2 border border-white/10">
                    <span className="text-xs text-white/60">Drag to rotate</span>
                  </div>
                  <motion.div 
                    className="backdrop-blur-md bg-[#ff3344]/20 rounded-full px-4 py-2 border border-[#ff3344]/30"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-xs text-[#ff3344] font-medium">{attacks.length} Active Threats</span>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="backdrop-blur-xl bg-[#0a0a1e]/70 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-[#3D70B7]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search attacks..."
                      className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/30"
                      data-testid="input-search-attacks"
                    />
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-1.5 rounded-lg transition-all ${showFilters ? 'bg-[#3D70B7]/20 text-[#3D70B7]' : 'text-white/50 hover:text-white'}`}
                      data-testid="btn-toggle-filters"
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                          {attackTypes.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => toggleTypeFilter(type.id)}
                              className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                                selectedTypes.includes(type.id)
                                  ? 'text-white'
                                  : 'text-white/50 hover:text-white'
                              }`}
                              style={{
                                backgroundColor: selectedTypes.includes(type.id) ? `${type.color}30` : 'transparent',
                                borderWidth: 1,
                                borderColor: selectedTypes.includes(type.id) ? type.color : 'rgba(255,255,255,0.1)'
                              }}
                              data-testid={`filter-${type.id}`}
                            >
                              {type.name}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="backdrop-blur-xl bg-[#0a0a1e]/70 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#ff3344]" />
                      Live Attack Feed
                    </h3>
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-[#ff3344]"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    <AnimatePresence mode="popLayout">
                      {filteredAttacks.length > 0 ? (
                        filteredAttacks.map((attack) => (
                          <motion.div
                            key={attack.id}
                            initial={{ opacity: 0, x: -20, scale: 0.95 }}
                            animate={{ 
                              opacity: 1, 
                              x: 0, 
                              scale: 1,
                              boxShadow: attack.isNew ? ['0 0 0 rgba(255,51,68,0)', '0 0 20px rgba(255,51,68,0.5)', '0 0 0 rgba(255,51,68,0)'] : 'none'
                            }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            transition={{ 
                              duration: 0.3,
                              boxShadow: attack.isNew ? { duration: 0.5, times: [0, 0.5, 1] } : undefined
                            }}
                            layout
                            className={`p-3 rounded-xl bg-black/40 border transition-all ${
                              attack.isNew ? 'border-[#ff3344]/50' : 'border-white/5 hover:border-[#ff3344]/30'
                            }`}
                            data-testid={`attack-${attack.id}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${getSeverityColor(attack.severity)}`}>
                                {attack.severity}
                              </span>
                              <span className="text-[10px] text-white/40">{attack.time}</span>
                            </div>
                            <p className="text-xs text-white/70">{attack.type}</p>
                            <p className="text-[10px] text-white/40 mt-1">
                              {attack.from} → {attack.to}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-white/40 text-sm">
                          No attacks match your filters
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 text-center"
          >
              <div className="backdrop-blur-xl bg-gradient-to-r from-[#3D70B7]/10 via-[#3D70B7]/20 to-[#3D70B7]/10 border border-[#3D70B7]/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3D70B7]/5 via-transparent to-transparent" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Shield className="w-10 h-10 text-[#3D70B7]" />
                    </motion.div>
                    <div className="text-left">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">Don't Be a Statistic</h2>
                      <p className="text-[#3D70B7]/70 text-sm">95% of breaches are preventable with proper security</p>
                    </div>
                  </div>
                  
                  <p className="text-white/60 max-w-2xl mx-auto mb-8 text-lg">
                    Our <span className="text-[#3D70B7] font-semibold">Vulnerability Assessment & Penetration Testing (VAPT)</span> identifies 
                    your security gaps before attackers do. Get a comprehensive security audit from certified experts.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link 
                      href="/contact"
                      className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#42BA90] to-[#3D70B7] text-white font-bold px-8 py-4 rounded-full hover:shadow-[0_0_40px_rgba(61,112,183,0.4)] transition-all duration-300"
                      data-testid="link-get-vapt"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span>Get Free Security Assessment</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <Link 
                      href="/services"
                      className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-6 py-4 rounded-full transition-all duration-300"
                      data-testid="link-learn-more"
                    >
                      Explore Our Services
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 mt-10 max-w-2xl mx-auto">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#3D70B7]">500+</div>
                      <p className="text-white/40 text-sm mt-1">Audits Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#3D70B7]">99.9%</div>
                      <p className="text-white/40 text-sm mt-1">Client Satisfaction</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#3D70B7]">24/7</div>
                      <p className="text-white/40 text-sm mt-1">Monitoring Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-center"
            >
              <p className="text-white/30 text-xs">
                Data sources: IBM Security, University of Maryland, Cybersecurity Ventures (2025)
              </p>
            </motion.div>
          </div>
        </main>
    </div>
  );
}
