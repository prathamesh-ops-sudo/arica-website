"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ChevronRight, Shield, FileCheck, Code, X } from 'lucide-react';

interface ModalContent {
  title: string;
  type: 'scanner' | 'tester' | 'checker' | 'checklist' | 'pipeline';
}

interface PlanetConfig {
  id: string;
  name: string;
  description: string;
  features: string[];
  link: string;
  size: number;
  distance: number;
  orbitSpeed: number;
  rotationSpeed: number;
  color: {
    primary: number;
    secondary: number;
    atmosphere?: number;
  };
  scrollPosition: number;
  type: 'service' | 'sun';
  actionType: 'route' | 'attack-globe' | 'modal';
  modalContent?: ModalContent;
}

interface GalaxyConfig {
  id: string;
  name: string;
  description: string;
  scrollStart: number;
  scrollEnd: number;
  colorTheme: { primary: string; secondary: string; accent: string };
  nebulaColors: { color1: number[]; color2: number[]; color3: number[] };
  planets: PlanetConfig[];
}

const galaxies: GalaxyConfig[] = [
  {
    id: 'vapt',
    name: 'VAPT Services',
    description: 'Vulnerability Assessment & Penetration Testing',
    scrollStart: 0.0,
    scrollEnd: 0.33,
    colorTheme: { primary: '#ff4444', secondary: '#ff8800', accent: '#00ffff' },
    nebulaColors: {
      color1: [0.8, 0.2, 0.1],
      color2: [1.0, 0.4, 0.0],
      color3: [0.0, 0.8, 1.0],
    },
    planets: [
      {
        id: 'network-security',
        name: 'Network Security',
        description: 'Comprehensive network penetration testing to identify vulnerabilities in your infrastructure before attackers do.',
        features: [
          'External & Internal Network Testing',
          'Firewall & Router Assessment',
          'Wireless Network Security',
          'Network Segmentation Analysis',
        ],
        link: '/attack-globe',
        size: 1.4,
        distance: 14,
        orbitSpeed: 0.0006,
        rotationSpeed: 0.002,
        color: { primary: 0xff4422, secondary: 0xff6600, atmosphere: 0xff8844 },
        scrollPosition: 0.05,
        type: 'service',
        actionType: 'attack-globe',
      },
      {
        id: 'web-application',
        name: 'Web Application',
        description: 'In-depth security testing of web applications to uncover critical vulnerabilities and protect your users.',
        features: [
          'OWASP Top 10 Testing',
          'SQL Injection & XSS Detection',
          'Authentication Bypass Testing',
          'Session Management Analysis',
        ],
        link: '/vulnerability-scanner',
        size: 1.2,
        distance: 22,
        orbitSpeed: 0.0005,
        rotationSpeed: 0.0025,
        color: { primary: 0x00aaff, secondary: 0x0066cc, atmosphere: 0x44ccff },
        scrollPosition: 0.11,
        type: 'service',
        actionType: 'route',
      },
      {
        id: 'api-security',
        name: 'API Security',
        description: 'Thorough API penetration testing to secure your application interfaces and data exchanges.',
        features: [
          'REST & GraphQL API Testing',
          'Authentication & Authorization',
          'Rate Limiting Analysis',
          'Data Exposure Testing',
        ],
        link: '/api-security-lab',
        size: 1.0,
        distance: 30,
        orbitSpeed: 0.0004,
        rotationSpeed: 0.003,
        color: { primary: 0x22cc66, secondary: 0x118844, atmosphere: 0x44ff88 },
        scrollPosition: 0.17,
        type: 'service',
        actionType: 'route',
      },
      {
        id: 'mobile-security',
        name: 'Mobile Security',
        description: 'Comprehensive mobile application security testing for iOS and Android platforms.',
        features: [
          'Static & Dynamic Analysis',
          'Reverse Engineering Protection',
          'Secure Storage Testing',
          'Network Traffic Analysis',
        ],
        link: '/contact',
        size: 1.1,
        distance: 38,
        orbitSpeed: 0.00035,
        rotationSpeed: 0.0028,
        color: { primary: 0x9944ff, secondary: 0x6622cc, atmosphere: 0xaa66ff },
        scrollPosition: 0.23,
        type: 'service',
        actionType: 'route',
      },
      {
        id: 'cloud-security',
        name: 'Cloud Security',
        description: 'Cloud infrastructure penetration testing to secure your AWS, Azure, or GCP environments.',
        features: [
          'Cloud Configuration Review',
          'IAM Policy Assessment',
          'Container Security Testing',
          'Serverless Security Analysis',
        ],
        link: '/cloud-security-center',
        size: 1.3,
        distance: 46,
        orbitSpeed: 0.0003,
        rotationSpeed: 0.002,
        color: { primary: 0xcccccc, secondary: 0x888888, atmosphere: 0xffffff },
        scrollPosition: 0.29,
        type: 'service',
        actionType: 'route',
      },
    ],
  },
  {
    id: 'iso',
    name: 'ISO 27001 Audit',
    description: 'Comprehensive Audit & Compliance Services',
    scrollStart: 0.33,
    scrollEnd: 0.66,
    colorTheme: { primary: '#ffc107', secondary: '#ff9800', accent: '#1976d2' },
    nebulaColors: {
      color1: [1.0, 0.8, 0.2],
      color2: [0.9, 0.6, 0.1],
      color3: [0.1, 0.4, 0.8],
    },
    planets: [
      {
        id: 'gap-analysis',
        name: 'Gap Analysis',
        description: 'Comprehensive assessment of your current security posture against ISO 27001 requirements.',
        features: [
          'Current State Assessment',
          'Compliance Gap Identification',
          'Remediation Roadmap',
          'Priority Action Items',
        ],
        link: '/compliance-dashboard',
        size: 1.2,
        distance: 14,
        orbitSpeed: 0.0006,
        rotationSpeed: 0.002,
        color: { primary: 0xffcc00, secondary: 0xcc9900, atmosphere: 0xffdd44 },
        scrollPosition: 0.38,
        type: 'service',
        actionType: 'route',
      },
      {
        id: 'risk-assessment',
        name: 'Risk Assessment',
        description: 'Systematic identification and evaluation of information security risks to your organization.',
        features: [
          'Threat Identification',
          'Vulnerability Analysis',
          'Risk Quantification',
          'Treatment Planning',
        ],
        link: '/contact',
        size: 1.3,
        distance: 22,
        orbitSpeed: 0.0005,
        rotationSpeed: 0.0025,
        color: { primary: 0x991111, secondary: 0x660000, atmosphere: 0xcc2222 },
        scrollPosition: 0.44,
        type: 'service',
        actionType: 'route',
      },
      {
        id: 'policy-development',
        name: 'Policy Development',
        description: 'Creation of comprehensive information security policies and documentation.',
        features: [
          'Policy Framework Design',
          'Procedure Documentation',
          'Control Implementation Guides',
          'Employee Awareness Materials',
        ],
        link: '/contact',
        size: 1.1,
        distance: 30,
        orbitSpeed: 0.0004,
        rotationSpeed: 0.003,
        color: { primary: 0x4488ff, secondary: 0x2266cc, atmosphere: 0x88bbff },
        scrollPosition: 0.50,
        type: 'service',
        actionType: 'route',
      },
      {
        id: 'implementation',
        name: 'Implementation',
        description: 'Hands-on implementation of security controls and management systems.',
        features: [
          'Control Implementation',
          'Process Integration',
          'Staff Training',
          'System Configuration',
        ],
        link: '/contact',
        size: 1.0,
        distance: 38,
        orbitSpeed: 0.00035,
        rotationSpeed: 0.0028,
        color: { primary: 0x22aa88, secondary: 0x117766, atmosphere: 0x44ccaa },
        scrollPosition: 0.56,
        type: 'service',
        actionType: 'route',
      },
      {
        id: 'certification',
        name: 'Certification',
        description: 'Support through the ISO 27001 certification audit process to achieve compliance.',
        features: [
          'Pre-Audit Preparation',
          'Audit Support',
          'Non-Conformity Resolution',
          'Certification Maintenance',
        ],
        link: '/contact',
        size: 1.5,
        distance: 46,
        orbitSpeed: 0.0003,
        rotationSpeed: 0.002,
        color: { primary: 0xffdd00, secondary: 0xddaa00, atmosphere: 0xffee66 },
        scrollPosition: 0.62,
        type: 'service',
        actionType: 'route',
      },
    ],
  },
  {
    id: 'software',
    name: 'Secure Software',
    description: 'Custom Software Development & Security',
    scrollStart: 0.66,
    scrollEnd: 1.0,
    colorTheme: { primary: '#9c27b0', secondary: '#607d8b', accent: '#00bcd4' },
    nebulaColors: {
      color1: [0.6, 0.2, 0.7],
      color2: [0.4, 0.5, 0.6],
      color3: [0.0, 0.7, 0.8],
    },
    planets: [
      {
        id: 'secure-architecture',
        name: 'Secure Architecture',
        description: 'Security-first software architecture design for robust and resilient applications.',
        features: [
          'Threat Modeling',
          'Security Design Patterns',
          'Zero Trust Architecture',
          'Defense in Depth',
        ],
        link: '/contact',
        size: 1.3,
        distance: 14,
        orbitSpeed: 0.0006,
        rotationSpeed: 0.002,
        color: { primary: 0xaaaaaa, secondary: 0x666666, atmosphere: 0xcccccc },
        scrollPosition: 0.71,
        type: 'service',
        actionType: 'route',
      },
      {
        id: 'devsecops',
        name: 'DevSecOps',
        description: 'Integration of security into your CI/CD pipeline for continuous security validation.',
        features: [
          'Pipeline Security Integration',
          'Automated Security Testing',
          'Container Security',
          'Infrastructure as Code Security',
        ],
        link: '/devsecops-pipeline',
        size: 1.2,
        distance: 22,
        orbitSpeed: 0.0005,
        rotationSpeed: 0.0025,
        color: { primary: 0xff6622, secondary: 0xcc4400, atmosphere: 0xff8844 },
        scrollPosition: 0.77,
        type: 'service',
        actionType: 'route',
      },
      {
        id: 'code-review',
        name: 'Code Review',
        description: 'Expert source code analysis to identify security vulnerabilities and code quality issues.',
        features: [
          'Static Code Analysis',
          'Manual Code Review',
          'Security Bug Detection',
          'Best Practice Enforcement',
        ],
        link: '/contact',
        size: 1.1,
        distance: 30,
        orbitSpeed: 0.0004,
        rotationSpeed: 0.003,
        color: { primary: 0x00ddff, secondary: 0x00aacc, atmosphere: 0x44eeff },
        scrollPosition: 0.83,
        type: 'service',
        actionType: 'route',
      },
      {
        id: 'security-training',
        name: 'Security Training',
        description: 'Comprehensive developer security training to build security-aware development teams.',
        features: [
          'Secure Coding Practices',
          'OWASP Training',
          'Hands-on Workshops',
          'Security Champion Program',
        ],
        link: '/contact',
        size: 1.0,
        distance: 38,
        orbitSpeed: 0.00035,
        rotationSpeed: 0.0028,
        color: { primary: 0xcc44cc, secondary: 0x992299, atmosphere: 0xee66ee },
        scrollPosition: 0.89,
        type: 'service',
        actionType: 'route',
      },
      {
        id: 'ongoing-support',
        name: 'Ongoing Support',
        description: 'Continuous security monitoring and maintenance for your applications.',
        features: [
          '24/7 Security Monitoring',
          'Incident Response',
          'Patch Management',
          'Security Updates',
        ],
        link: '/contact',
        size: 1.2,
        distance: 46,
        orbitSpeed: 0.0003,
        rotationSpeed: 0.002,
        color: { primary: 0x22ddaa, secondary: 0x11aa77, atmosphere: 0x44ffcc },
        scrollPosition: 0.95,
        type: 'service',
        actionType: 'route',
      },
    ],
  },
];

const baseVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const servicePlanetShader = {
  vertexShader: baseVertexShader,
  fragmentShader: `
    uniform float time;
    uniform vec3 lightPosition;
    uniform vec3 primaryColor;
    uniform vec3 secondaryColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float hash3(vec3 p) {
      return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    
    float noise3D(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x),
            mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x),
            mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z);
    }
    
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for(int i = 0; i < 3; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }
    
    float fbm3D(vec3 p) {
      float v = 0.0;
      float a = 0.5;
      for(int i = 0; i < 2; i++) {
        v += a * noise3D(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }
    
    void main() {
      vec3 lightDir = normalize(lightPosition - vWorldPosition);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float NdotL = dot(vNormal, lightDir);
      float diffuse = max(NdotL, 0.0);
      
      vec2 uv = vec2(atan(vPosition.x, vPosition.z) / 6.28318 + 0.5, asin(vPosition.y / length(vPosition)) / 3.14159 + 0.5);
      
      float pattern1 = fbm(uv * 10.0 + time * 0.015);
      float pattern2 = fbm(uv * 6.0 - time * 0.01);
      float pattern3 = fbm3D(vPosition * 2.0 + time * 0.02);
      float bands = sin(uv.y * 16.0 + pattern1 * 3.0) * 0.5 + 0.5;
      float craters = smoothstep(0.6, 0.7, fbm(uv * 30.0)) * 0.3;
      
      vec3 baseColor = mix(primaryColor, secondaryColor, pattern1 * 0.5 + bands * 0.3);
      baseColor = mix(baseColor, primaryColor * 1.3, pattern2 * 0.25);
      baseColor = mix(baseColor, secondaryColor * 0.7, pattern3 * 0.2);
      baseColor -= vec3(craters) * secondaryColor;
      
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
      vec3 rimColor = mix(primaryColor, vec3(1.0), 0.6);
      
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(vNormal, halfDir), 0.0), 60.0) * 0.5;
      float specWide = pow(max(dot(vNormal, halfDir), 0.0), 20.0) * 0.2;
      
      float terminator = smoothstep(-0.2, 0.4, diffuse);
      vec3 ambient = baseColor * 0.08 + primaryColor * 0.02;
      vec3 nightGlow = primaryColor * 0.03 * (1.0 - terminator);
      vec3 nightSide = ambient + nightGlow;
      vec3 daySide = baseColor * (diffuse * 0.8 + 0.2) + vec3(spec + specWide) * mix(primaryColor, vec3(1.0), 0.5);
      
      float rimLight = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 5.0) * 0.4;
      float backLight = pow(max(-NdotL, 0.0), 2.0) * 0.15;
      
      vec3 finalColor = mix(nightSide, daySide, terminator);
      finalColor += rimLight * rimColor * terminator;
      finalColor += backLight * primaryColor;
      finalColor = mix(finalColor, rimColor * 1.2, fresnel * 0.3);
      
      finalColor = pow(finalColor, vec3(0.95));
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

const sunShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    
    float hash(vec3 p) {
      return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
    }
    
    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
    }
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      vPosition = position;
      
      float displacement = 0.0;
      displacement += sin(position.x * 8.0 + time * 2.0) * sin(position.y * 8.0 + time * 1.5) * sin(position.z * 8.0 + time * 1.8) * 0.04;
      displacement += noise(position * 5.0 + time * 0.5) * 0.06;
      
      vec3 newPosition = position + normal * displacement;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 sunColor1;
    uniform vec3 sunColor2;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for(int i = 0; i < 3; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }
    
    void main() {
      vec2 uv = vec2(atan(vPosition.x, vPosition.z) / 6.28318 + 0.5, asin(vPosition.y / length(vPosition)) / 3.14159 + 0.5);
      
      float granulation = fbm(uv * 40.0 + time * 0.3);
      float convection = fbm(uv * 20.0 + time * 0.15);
      float largeStructure = fbm(uv * 8.0 + time * 0.05);
      
      vec3 core = vec3(1.0, 1.0, 0.95);
      vec3 color = core;
      color = mix(color, sunColor1, granulation * 0.4);
      color = mix(color, sunColor2, convection * 0.3);
      color = mix(color, sunColor2 * 0.8, (1.0 - largeStructure) * 0.2);
      
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5);
      color = mix(color, sunColor2, fresnel * 0.3);
      
      float flare = fbm(uv * 15.0 + time * 2.0) * fbm(uv * 25.0 - time * 1.5);
      float flarePulse = sin(time * 3.0) * 0.5 + 0.5;
      color += vec3(1.0, 0.9, 0.7) * flare * flarePulse * 0.3;
      
      color *= 1.3;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

const sunCoronaShader = {
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
    uniform float time;
    uniform float intensity;
    uniform float layerOffset;
    uniform vec3 coronaColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for(int i = 0; i < 3; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }
    
    void main() {
      vec2 uv = vec2(atan(vPosition.x, vPosition.z) / 6.28318 + 0.5, vPosition.y * 0.5 + 0.5);
      
      float fresnel = pow(0.75 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
      float coronaNoise = fbm(uv * 8.0 + time * 0.2 + layerOffset);
      float pulse = sin(time * 2.0 + layerOffset) * 0.15 + 0.85;
      
      vec3 color = coronaColor;
      float alpha = fresnel * intensity * pulse;
      alpha *= (coronaNoise * 0.5 + 0.5);
      
      gl_FragColor = vec4(color, alpha * 0.8);
    }
  `,
};

const nebulaShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform float parallax;
    uniform vec3 nebulaColor1;
    uniform vec3 nebulaColor2;
    uniform vec3 nebulaColor3;
    varying vec2 vUv;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for(int i = 0; i < 3; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }
    
    void main() {
      vec2 uv = vUv + vec2(parallax * 0.1, 0.0);
      
      float nebula1 = fbm(uv * 2.0 + time * 0.01);
      float nebula2 = fbm(uv * 3.0 - time * 0.008 + 1.0);
      float nebula3 = fbm(uv * 4.0 + time * 0.005 + 2.0);
      
      vec3 color = nebulaColor1 * nebula1 * 0.4;
      color += nebulaColor2 * nebula2 * 0.3;
      color += nebulaColor3 * nebula3 * 0.2;
      
      float alpha = (nebula1 * 0.4 + nebula2 * 0.3 + nebula3 * 0.3) * 0.15;
      
      gl_FragColor = vec4(color, alpha);
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
    uniform vec3 shockwaveColor;
    uniform float ringWidth;
    varying vec2 vUv;
    
    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center) * 2.0;
      float ring = smoothstep(progress - ringWidth, progress, dist) * 
                   smoothstep(progress + ringWidth, progress, dist);
      float fade = 1.0 - progress;
      float alpha = ring * fade * 2.0;
      gl_FragColor = vec4(shockwaveColor * 1.5, alpha);
    }
  `,
};

const particleBurstShader = {
  vertexShader: `
    attribute float size;
    attribute float life;
    attribute vec3 velocity;
    uniform float time;
    varying float vLife;
    varying vec3 vColor;
    
    void main() {
      vLife = life;
      vec3 pos = position + velocity * time * 2.0;
      pos += velocity * sin(time * 3.0) * 0.2;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (1.0 - time * 0.5) * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
      vColor = vec3(1.0, 0.8, 0.4);
    }
  `,
  fragmentShader: `
    varying float vLife;
    varying vec3 vColor;
    uniform float time;
    
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = (1.0 - dist * 2.0) * (1.0 - time);
      gl_FragColor = vec4(vColor, alpha * vLife);
    }
  `,
};

const trailParticleShader = {
  vertexShader: `
    attribute float size;
    attribute float alpha;
    varying float vAlpha;
    
    void main() {
      vAlpha = alpha;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (200.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 trailColor;
    varying float vAlpha;
    
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float intensity = 1.0 - dist * 2.0;
      gl_FragColor = vec4(trailColor * intensity, vAlpha * intensity);
    }
  `,
};

interface PlanetMesh extends THREE.Mesh {
  userData: {
    planet: PlanetConfig;
    galaxyId: string;
    angle: number;
    bobOffset: number;
    atmosphere?: THREE.Mesh;
    outerGlow?: THREE.Mesh;
    hoverIntensity?: number;
    wobblePhase?: number;
    scatterOffset?: THREE.Vector3;
    particleBurst?: THREE.Points;
  };
}

interface PhysicsState {
  scrollVelocity: number;
  scrollMomentum: number;
  cameraShake: { x: number; y: number; z: number; intensity: number };
  hoveredPlanetId: string | null;
  transitionShockwave: { active: boolean; progress: number; center: THREE.Vector3 };
  planetScatter: { active: boolean; progress: number };
  warpTrails: THREE.Points[];
}

interface GalaxyGroup {
  id: string;
  sun: THREE.Mesh;
  sunLight: THREE.PointLight;
  corona: THREE.Mesh[];
  planets: PlanetMesh[];
  centerOffset: THREE.Vector3;
}

export function RealisticSolarSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePlanet, setActivePlanet] = useState<PlanetConfig | null>(null);
  const [activeGalaxy, setActiveGalaxy] = useState<GalaxyConfig>(galaxies[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [warpEffect, setWarpEffect] = useState(0);
  const [transitionText, setTransitionText] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlanet, setModalPlanet] = useState<PlanetConfig | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevScrollRef = useRef(0);
  const lastGalaxyRef = useRef<string>(galaxies[0].id);
  const transitionCooldownRef = useRef(false);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const lockedGalaxyIndexRef = useRef(0);
  const scrollRafRef = useRef<number | null>(null);
  const targetScrollProgressRef = useRef(0);
  const spacerRef = useRef<HTMLDivElement>(null);
  const initialScrollRestoredRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  
  const physicsStateRef = useRef<PhysicsState>({
    scrollVelocity: 0,
    scrollMomentum: 0,
    cameraShake: { x: 0, y: 0, z: 0, intensity: 0 },
    hoveredPlanetId: null,
    transitionShockwave: { active: false, progress: 0, center: new THREE.Vector3() },
    planetScatter: { active: false, progress: 0 },
    warpTrails: [],
  });
  
  const shockwaveRef = useRef<THREE.Mesh | null>(null);
  const trailParticlesRef = useRef<THREE.Points | null>(null);
  
  const HYSTERESIS_BUFFER = 0.025;
  const SCROLL_MULTIPLIER = 5;
  
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    galaxyGroups: GalaxyGroup[];
    starLayers: THREE.Points[];
    nebula: THREE.Mesh | null;
    animationId: number | null;
    clock: THREE.Clock;
    disposables: THREE.BufferGeometry[];
    materials: THREE.Material[];
  }>({
    scene: null,
    camera: null,
    renderer: null,
    galaxyGroups: [],
    starLayers: [],
    nebula: null,
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

  const getGalaxyForProgress = useCallback((progress: number): GalaxyConfig => {
    // Simple direct mapping: 0-0.33 = VAPT, 0.33-0.66 = ISO, 0.66-1.0 = Secure Software
    if (progress >= 0.66) {
      return galaxies[2]; // Secure Software
    } else if (progress >= 0.33) {
      return galaxies[1]; // ISO 27001
    }
    return galaxies[0]; // VAPT Services
  }, []);

  const getGalaxyLocalProgress = useCallback((progress: number, galaxy: GalaxyConfig): number => {
    const range = galaxy.scrollEnd - galaxy.scrollStart;
    return (progress - galaxy.scrollStart) / range;
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const refs = sceneRef.current;

    try {
      refs.scene = new THREE.Scene();
      refs.scene.background = new THREE.Color(0x000005);

      refs.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1500
      );
      refs.camera.position.set(0, 10, 80);

      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 1.4;

      const ambientLight = new THREE.AmbientLight(0x111122, 0.2);
      refs.scene.add(ambientLight);

      raycasterRef.current = new THREE.Raycaster();

      createNebula();
      createParallaxStarfield();
      createGalaxies();

      animate();
    } catch (error) {
      console.warn('WebGL initialization failed, showing fallback UI');
    }

    setIsLoaded(true);

    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const scrollTop = scrollRef.current.scrollTop;
      const scrollHeight = scrollRef.current.scrollHeight;
      const clientHeight = scrollRef.current.clientHeight;
      
      const scrollableDistance = scrollHeight - clientHeight;
      let progress = scrollableDistance > 0 ? scrollTop / scrollableDistance : 0;
      
      if (progress >= 0.98 && scrollRef.current && !transitionCooldownRef.current) {
        transitionCooldownRef.current = true;
        setWarpEffect(1);
        setTransitionText('Warping to VAPT Services...');
        
        physicsStateRef.current.cameraShake.intensity = 1.2;
        physicsStateRef.current.planetScatter = { active: true, progress: 0 };
        
        if (sceneRef.current.scene) {
          if (shockwaveRef.current) {
            sceneRef.current.scene.remove(shockwaveRef.current);
            shockwaveRef.current.geometry.dispose();
            (shockwaveRef.current.material as THREE.Material).dispose();
          }
          
          const warpColor = new THREE.Color('#00ffff');
          const ringGeom = new THREE.RingGeometry(0.1, 100, 64);
          const ringMat = new THREE.ShaderMaterial({
            uniforms: {
              progress: { value: 0 },
              shockwaveColor: { value: new THREE.Vector3(warpColor.r, warpColor.g, warpColor.b) },
              ringWidth: { value: 0.2 },
            },
            vertexShader: shockwaveShader.vertexShader,
            fragmentShader: shockwaveShader.fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          });
          
          const ringMesh = new THREE.Mesh(ringGeom, ringMat);
          ringMesh.rotation.x = -Math.PI / 2;
          ringMesh.position.y = 0;
          sceneRef.current.scene.add(ringMesh);
          shockwaveRef.current = ringMesh;
          
          physicsStateRef.current.transitionShockwave = {
            active: true,
            progress: 0,
            center: new THREE.Vector3(0, 0, 0),
          };
          
          if (!trailParticlesRef.current) {
            const particleCount = 100;
            const positions = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);
            const alphas = new Float32Array(particleCount);
            
            for (let i = 0; i < particleCount; i++) {
              positions[i * 3] = (Math.random() - 0.5) * 20;
              positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
              positions[i * 3 + 2] = -10 - Math.random() * 80;
              sizes[i] = 1 + Math.random() * 2;
              alphas[i] = 0;
            }
            
            const trailGeom = new THREE.BufferGeometry();
            trailGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            trailGeom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            trailGeom.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
            
            const trailMat = new THREE.ShaderMaterial({
              uniforms: {
                trailColor: { value: new THREE.Vector3(warpColor.r, warpColor.g, warpColor.b) },
              },
              vertexShader: trailParticleShader.vertexShader,
              fragmentShader: trailParticleShader.fragmentShader,
              transparent: true,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            });
            
            const trailParticles = new THREE.Points(trailGeom, trailMat);
            sceneRef.current.scene.add(trailParticles);
            trailParticlesRef.current = trailParticles;
          }
        }
        
        sceneRef.current.galaxyGroups.forEach((group) => {
          group.planets.forEach((mesh) => {
            const randomDir = new THREE.Vector3(
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 0.5,
              (Math.random() - 0.5) * 2
            ).normalize();
            mesh.userData.scatterOffset = randomDir.multiplyScalar(5 + Math.random() * 8);
          });
        });
        
        const animateToStart = () => {
          if (!scrollRef.current) return;
          const currentScroll = scrollRef.current.scrollTop;
          const targetScroll = 0;
          const diff = currentScroll - targetScroll;
          
          if (diff > 10) {
            scrollRef.current.scrollTop = currentScroll - diff * 0.15;
            requestAnimationFrame(animateToStart);
          } else {
            scrollRef.current.scrollTop = 0;
            progress = 0;
            lastGalaxyRef.current = 'vapt';
            sessionStorage.setItem('galaxyScrollProgress', '0');
            setTimeout(() => {
              transitionCooldownRef.current = false;
              setTransitionText(null);
            }, 1500);
          }
        };
        
        requestAnimationFrame(animateToStart);
        return;
      }
      
      progress = Math.max(0, Math.min(1, progress));
      targetScrollProgressRef.current = progress;
      
      if (scrollRafRef.current === null) {
        scrollRafRef.current = requestAnimationFrame(() => {
          scrollRafRef.current = null;
          
          const currentProgress = targetScrollProgressRef.current;
          const scrollDelta = Math.abs(currentProgress - prevScrollRef.current);
          
          const now = performance.now();
          const timeDelta = now - lastScrollTimeRef.current;
          lastScrollTimeRef.current = now;
          
          if (timeDelta > 0 && timeDelta < 100) {
            scrollVelocityRef.current = scrollDelta / timeDelta * 1000;
            physicsStateRef.current.scrollMomentum = Math.min(scrollVelocityRef.current * 2, 3);
          }
          
          const currentGalaxy = getGalaxyForProgress(currentProgress);
          
          if (currentGalaxy.id !== lastGalaxyRef.current && !transitionCooldownRef.current) {
            transitionCooldownRef.current = true;
            setWarpEffect(1);
            setTransitionText(`Entering ${currentGalaxy.name}`);
            
            physicsStateRef.current.cameraShake.intensity = 0.8;
            physicsStateRef.current.planetScatter = { active: true, progress: 0 };
            
            if (sceneRef.current.scene) {
              if (shockwaveRef.current) {
                sceneRef.current.scene.remove(shockwaveRef.current);
                shockwaveRef.current.geometry.dispose();
                (shockwaveRef.current.material as THREE.Material).dispose();
              }
              
              const shockColor = new THREE.Color(currentGalaxy.colorTheme.accent);
              const ringGeom = new THREE.RingGeometry(0.1, 80, 64);
              const ringMat = new THREE.ShaderMaterial({
                uniforms: {
                  progress: { value: 0 },
                  shockwaveColor: { value: new THREE.Vector3(shockColor.r, shockColor.g, shockColor.b) },
                  ringWidth: { value: 0.15 },
                },
                vertexShader: shockwaveShader.vertexShader,
                fragmentShader: shockwaveShader.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
              });
              
              const ringMesh = new THREE.Mesh(ringGeom, ringMat);
              ringMesh.rotation.x = -Math.PI / 2;
              ringMesh.position.y = 0;
              sceneRef.current.scene.add(ringMesh);
              shockwaveRef.current = ringMesh;
              
              physicsStateRef.current.transitionShockwave = {
                active: true,
                progress: 0,
                center: new THREE.Vector3(0, 0, 0),
              };
            }
            
            sceneRef.current.galaxyGroups.forEach((group) => {
              group.planets.forEach((mesh) => {
                const randomDir = new THREE.Vector3(
                  (Math.random() - 0.5) * 2,
                  (Math.random() - 0.5) * 0.5,
                  (Math.random() - 0.5) * 2
                ).normalize();
                mesh.userData.scatterOffset = randomDir.multiplyScalar(3 + Math.random() * 5);
              });
            });
            
            setTimeout(() => setTransitionText(null), 2000);
            lastGalaxyRef.current = currentGalaxy.id;
            setTimeout(() => {
              transitionCooldownRef.current = false;
            }, 500);
          } else if (scrollDelta > 0.02 && !transitionCooldownRef.current) {
            setWarpEffect(Math.min(0.5, scrollDelta * 5));
          }
          
          prevScrollRef.current = currentProgress;
          setScrollProgress(currentProgress);
          setActiveGalaxy(currentGalaxy);
          
          sessionStorage.setItem('galaxyScrollProgress', currentProgress.toString());

          let newActive: PlanetConfig | null = null;
          currentGalaxy.planets.forEach((planet) => {
            const dist = Math.abs(currentProgress - planet.scrollPosition);
            if (dist < 0.04) {
              newActive = planet;
            }
          });
          setActivePlanet(newActive);

          updateCameraForScroll(currentProgress, currentGalaxy);
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!refs.camera || !raycasterRef.current) return;
      
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      
      raycasterRef.current.setFromCamera(mouse, refs.camera);
      
      const allVisiblePlanets: THREE.Object3D[] = [];
      refs.galaxyGroups.forEach((group) => {
        group.planets.forEach((mesh) => {
          if (mesh.visible) {
            allVisiblePlanets.push(mesh);
          }
        });
      });
      
      const intersects = raycasterRef.current.intersectObjects(allVisiblePlanets, false);
      
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as PlanetMesh;
        if (hitMesh.userData?.planet) {
          setActivePlanet(hitMesh.userData.planet);
        }
      }
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

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    canvasRef.current.addEventListener('click', handleClick);
    handleScroll();

    const currentCanvas = canvasRef.current;
    return () => {
      // Remove all event listeners
      scrollElement?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      currentCanvas?.removeEventListener('click', handleClick);
      
      // Cancel all animation frames
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      
      // Dispose shockwave mesh if exists
      if (shockwaveRef.current) {
        shockwaveRef.current.geometry?.dispose();
        if (shockwaveRef.current.material) {
          if (Array.isArray(shockwaveRef.current.material)) {
            shockwaveRef.current.material.forEach(m => m.dispose());
          } else {
            (shockwaveRef.current.material as THREE.Material).dispose();
          }
        }
        shockwaveRef.current = null;
      }
      
      // Dispose trail particles if exists
      if (trailParticlesRef.current) {
        trailParticlesRef.current.geometry?.dispose();
        if (trailParticlesRef.current.material) {
          if (Array.isArray(trailParticlesRef.current.material)) {
            trailParticlesRef.current.material.forEach(m => m.dispose());
          } else {
            (trailParticlesRef.current.material as THREE.Material).dispose();
          }
        }
        trailParticlesRef.current = null;
      }
      
      // Comprehensively dispose all scene objects by traversing the scene
      if (refs.scene) {
        refs.scene.traverse((object) => {
          if ((object as THREE.Mesh).geometry) {
            (object as THREE.Mesh).geometry.dispose();
          }
          if ((object as THREE.Mesh).material) {
            const material = (object as THREE.Mesh).material;
            if (Array.isArray(material)) {
              material.forEach(m => {
                if (m.map) m.map.dispose();
                if (m.lightMap) m.lightMap.dispose();
                if (m.bumpMap) m.bumpMap.dispose();
                if (m.normalMap) m.normalMap.dispose();
                if (m.specularMap) m.specularMap.dispose();
                if (m.envMap) m.envMap.dispose();
                m.dispose();
              });
            } else if (material) {
              const mat = material as THREE.MeshStandardMaterial;
              if (mat.map) mat.map.dispose();
              if (mat.lightMap) mat.lightMap.dispose();
              if (mat.bumpMap) mat.bumpMap.dispose();
              if (mat.normalMap) mat.normalMap.dispose();
              if (mat.specularMap) mat.specularMap.dispose();
              if (mat.envMap) mat.envMap.dispose();
              material.dispose();
            }
          }
        });
        
        // Clear all children from the scene
        while (refs.scene.children.length > 0) {
          refs.scene.remove(refs.scene.children[0]);
        }
      }
      
      // Also dispose tracked items in arrays (fallback for any missed items)
      refs.disposables.forEach(g => g.dispose());
      refs.materials.forEach(m => m.dispose());
      refs.disposables.length = 0;
      refs.materials.length = 0;
      
      // Clear galaxy groups references
      refs.galaxyGroups.length = 0;
      refs.starLayers.length = 0;
      refs.nebula = null;
      
      // Dispose renderer
      refs.renderer?.dispose();
      refs.renderer = null;
      refs.scene = null;
      refs.camera = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (warpEffect > 0) {
      const timer = setTimeout(() => {
        setWarpEffect(prev => Math.max(0, prev - 0.1));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [warpEffect]);

  const updateCameraForScroll = (progress: number, currentGalaxy: GalaxyConfig) => {
    const cam = cameraState.current;
    const galaxyIndex = galaxies.findIndex(g => g.id === currentGalaxy.id);
    const localProgress = getGalaxyLocalProgress(progress, currentGalaxy);
    
    const orbitAngle = localProgress * Math.PI * 2;
    const baseRadius = 75 - localProgress * 40;
    const heightWave = Math.sin(localProgress * Math.PI * 3) * 10;
    
    cam.targetX = Math.sin(orbitAngle) * baseRadius * 0.35;
    cam.targetZ = Math.cos(orbitAngle) * baseRadius;
    cam.targetY = 8 + heightWave;
    
    const planetIndex = Math.floor(localProgress * currentGalaxy.planets.length);
    const currentPlanet = currentGalaxy.planets[Math.min(planetIndex, currentGalaxy.planets.length - 1)];
    
    const planetAngle = (planetIndex / currentGalaxy.planets.length) * Math.PI * 2;
    cam.lookAtX = Math.cos(planetAngle) * currentPlanet.distance * 0.5;
    cam.lookAtZ = Math.sin(planetAngle) * currentPlanet.distance * 0.5;
    cam.lookAtY = 0;
  };

  const createNebula = () => {
    const refs = sceneRef.current;
    if (!refs.scene) return;

    const nebulaGeom = new THREE.PlaneGeometry(600, 400, 1, 1);
    const nebulaMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        parallax: { value: 0 },
        nebulaColor1: { value: new THREE.Vector3(0.4, 0.1, 0.5) },
        nebulaColor2: { value: new THREE.Vector3(0.1, 0.3, 0.6) },
        nebulaColor3: { value: new THREE.Vector3(0.6, 0.2, 0.3) },
      },
      vertexShader: nebulaShader.vertexShader,
      fragmentShader: nebulaShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    refs.nebula = new THREE.Mesh(nebulaGeom, nebulaMat);
    refs.nebula.position.z = -200;
    refs.scene.add(refs.nebula);
    refs.disposables.push(nebulaGeom);
    refs.materials.push(nebulaMat);
  };

  const createParallaxStarfield = () => {
    const refs = sceneRef.current;
    if (!refs.scene) return;

    const layers = [
      { count: 1200, size: 0.6, depth: 350, speed: 0.00003 },
      { count: 1000, size: 0.9, depth: 250, speed: 0.00006 },
      { count: 800, size: 1.2, depth: 150, speed: 0.00012 },
    ];

    layers.forEach((layer) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(layer.count * 3);
      const colors = new Float32Array(layer.count * 3);
      const twinkle = new Float32Array(layer.count);

      for (let i = 0; i < layer.count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = layer.depth + Math.random() * 100;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const starType = Math.random();
        if (starType < 0.7) {
          colors[i * 3] = 0.9 + Math.random() * 0.1;
          colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
          colors[i * 3 + 2] = 1.0;
        } else if (starType < 0.85) {
          colors[i * 3] = 1.0;
          colors[i * 3 + 1] = 0.85 + Math.random() * 0.1;
          colors[i * 3 + 2] = 0.7 + Math.random() * 0.1;
        } else {
          colors[i * 3] = 0.7 + Math.random() * 0.1;
          colors[i * 3 + 1] = 0.8 + Math.random() * 0.1;
          colors[i * 3 + 2] = 1.0;
        }

        twinkle[i] = Math.random() * Math.PI * 2;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('twinkle', new THREE.BufferAttribute(twinkle, 1));

      const material = new THREE.PointsMaterial({
        size: layer.size,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
      });

      const stars = new THREE.Points(geometry, material);
      (stars as any).userData = { speed: layer.speed };
      refs.scene!.add(stars);
      refs.starLayers.push(stars);
      refs.disposables.push(geometry);
      refs.materials.push(material);
    });
  };

  const createGalaxies = () => {
    const refs = sceneRef.current;
    if (!refs.scene) return;

    galaxies.forEach((galaxy) => {
      const galaxyGroup: GalaxyGroup = {
        id: galaxy.id,
        sun: null!,
        sunLight: null!,
        corona: [],
        planets: [],
        centerOffset: new THREE.Vector3(0, 0, 0),
      };

      const sunGeometry = new THREE.SphereGeometry(4, 64, 64);
      const sunColor1 = new THREE.Color(galaxy.colorTheme.primary);
      const sunColor2 = new THREE.Color(galaxy.colorTheme.secondary);
      
      const sunMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          sunColor1: { value: new THREE.Vector3(sunColor1.r, sunColor1.g, sunColor1.b) },
          sunColor2: { value: new THREE.Vector3(sunColor2.r, sunColor2.g, sunColor2.b) },
        },
        vertexShader: sunShader.vertexShader,
        fragmentShader: sunShader.fragmentShader,
      });

      galaxyGroup.sun = new THREE.Mesh(sunGeometry, sunMaterial);
      refs.scene!.add(galaxyGroup.sun);
      refs.disposables.push(sunGeometry);
      refs.materials.push(sunMaterial);

      galaxyGroup.sunLight = new THREE.PointLight(
        new THREE.Color(galaxy.colorTheme.primary).getHex(),
        4,
        300
      );
      galaxyGroup.sunLight.position.set(0, 0, 0);
      refs.scene!.add(galaxyGroup.sunLight);

      const coronaLayers = [
        { size: 5.5, intensity: 0.25, offset: 0 },
        { size: 7, intensity: 0.18, offset: 1.5 },
        { size: 9, intensity: 0.12, offset: 3.0 },
      ];

      const coronaColor = new THREE.Color(galaxy.colorTheme.accent);
      coronaLayers.forEach((layer) => {
        const coronaGeom = new THREE.SphereGeometry(layer.size, 32, 32);
        const coronaMat = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            intensity: { value: layer.intensity },
            layerOffset: { value: layer.offset },
            coronaColor: { value: new THREE.Vector3(coronaColor.r, coronaColor.g, coronaColor.b) },
          },
          vertexShader: sunCoronaShader.vertexShader,
          fragmentShader: sunCoronaShader.fragmentShader,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });
        const coronaMesh = new THREE.Mesh(coronaGeom, coronaMat);
        galaxyGroup.corona.push(coronaMesh);
        refs.scene!.add(coronaMesh);
        refs.disposables.push(coronaGeom);
        refs.materials.push(coronaMat);
      });

      galaxy.planets.forEach((planet, index) => {
        const geometry = new THREE.SphereGeometry(planet.size, 48, 48);
        const primaryColor = new THREE.Color(planet.color.primary);
        const secondaryColor = new THREE.Color(planet.color.secondary);

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            lightPosition: { value: new THREE.Vector3(0, 0, 0) },
            primaryColor: { value: new THREE.Vector3(primaryColor.r, primaryColor.g, primaryColor.b) },
            secondaryColor: { value: new THREE.Vector3(secondaryColor.r, secondaryColor.g, secondaryColor.b) },
          },
          vertexShader: servicePlanetShader.vertexShader,
          fragmentShader: servicePlanetShader.fragmentShader,
        });

        const mesh = new THREE.Mesh(geometry, material) as unknown as PlanetMesh;
        const angle = (index / galaxy.planets.length) * Math.PI * 2;
        mesh.position.x = Math.cos(angle) * planet.distance;
        mesh.position.z = Math.sin(angle) * planet.distance;
        mesh.userData = {
          planet,
          galaxyId: galaxy.id,
          angle,
          bobOffset: Math.random() * Math.PI * 2,
        };

        refs.scene!.add(mesh);
        galaxyGroup.planets.push(mesh);
        refs.disposables.push(geometry);
        refs.materials.push(material);

        if (planet.color.atmosphere) {
          const atmosGeom = new THREE.SphereGeometry(planet.size * 1.15, 48, 48);
          const atmosColor = new THREE.Color(planet.color.atmosphere);
          const atmosMat = new THREE.ShaderMaterial({
            uniforms: {
              atmosphereColor: { value: new THREE.Vector3(atmosColor.r, atmosColor.g, atmosColor.b) },
              lightPosition: { value: new THREE.Vector3(0, 0, 0) },
              time: { value: 0 },
            },
            vertexShader: `
              varying vec3 vNormal;
              varying vec3 vWorldPosition;
              varying vec3 vViewPosition;
              void main() {
                vNormal = normalize(normalMatrix * normal);
                vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vViewPosition = -mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
              }
            `,
            fragmentShader: `
              uniform vec3 atmosphereColor;
              uniform vec3 lightPosition;
              uniform float time;
              varying vec3 vNormal;
              varying vec3 vWorldPosition;
              varying vec3 vViewPosition;
              
              float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
              }
              
              float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                           mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
              }
              
              void main() {
                vec3 viewDir = normalize(vViewPosition);
                vec3 lightDir = normalize(lightPosition - vWorldPosition);
                float NdotL = dot(vNormal, lightDir);
                float NdotV = dot(vNormal, viewDir);
                
                float lightSide = smoothstep(-0.4, 0.6, NdotL);
                
                float fresnel = pow(1.0 - abs(NdotV), 4.0);
                float rim = pow(1.0 - abs(NdotV), 2.5);
                
                vec2 uv = vec2(atan(vWorldPosition.x, vWorldPosition.z), vWorldPosition.y);
                float shimmer = noise(uv * 3.0 + time * 0.5) * 0.15 + 0.85;
                
                vec3 glowColor = atmosphereColor * 1.3;
                vec3 coreColor = atmosphereColor * 0.8 + vec3(0.2);
                
                float innerGlow = fresnel * 0.6 * shimmer;
                float outerGlow = rim * 0.4;
                float totalGlow = innerGlow + outerGlow;
                
                totalGlow *= 0.4 + lightSide * 0.6;
                
                vec3 finalColor = mix(coreColor, glowColor, fresnel);
                
                float alpha = totalGlow * 0.8;
                alpha = clamp(alpha, 0.0, 0.9);
                
                gl_FragColor = vec4(finalColor, alpha);
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
          
          const outerGlowGeom = new THREE.SphereGeometry(planet.size * 1.3, 32, 32);
          const outerGlowMat = new THREE.ShaderMaterial({
            uniforms: {
              glowColor: { value: new THREE.Vector3(atmosColor.r, atmosColor.g, atmosColor.b) },
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
                float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 5.0);
                gl_FragColor = vec4(glowColor * 0.5, intensity * 0.3);
              }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
          });
          const outerGlow = new THREE.Mesh(outerGlowGeom, outerGlowMat);
          outerGlow.position.copy(mesh.position);
          mesh.userData.outerGlow = outerGlow;
          refs.scene!.add(outerGlow);
          refs.disposables.push(outerGlowGeom);
          refs.materials.push(outerGlowMat);
        }
      });

      refs.galaxyGroups.push(galaxyGroup);
    });
  };

  const createShockwave = useCallback(() => {
    const refs = sceneRef.current;
    if (!refs.scene) return;
    
    if (shockwaveRef.current) {
      refs.scene.remove(shockwaveRef.current);
      shockwaveRef.current.geometry.dispose();
      (shockwaveRef.current.material as THREE.Material).dispose();
    }
    
    const currentGalaxy = getGalaxyForProgress(scrollProgress);
    const shockwaveColor = new THREE.Color(currentGalaxy.colorTheme.accent);
    
    const geometry = new THREE.RingGeometry(0.1, 80, 64);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        progress: { value: 0 },
        shockwaveColor: { value: new THREE.Vector3(shockwaveColor.r, shockwaveColor.g, shockwaveColor.b) },
        ringWidth: { value: 0.15 },
      },
      vertexShader: shockwaveShader.vertexShader,
      fragmentShader: shockwaveShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0;
    refs.scene.add(mesh);
    shockwaveRef.current = mesh;
    
    physicsStateRef.current.transitionShockwave = {
      active: true,
      progress: 0,
      center: new THREE.Vector3(0, 0, 0),
    };
  }, [scrollProgress, getGalaxyForProgress]);

  const createParticleBurst = useCallback((position: THREE.Vector3, color: THREE.Color) => {
    const refs = sceneRef.current;
    if (!refs.scene) return null;
    
    const particleCount = 30;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 0.5 + Math.random() * 1.5;
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;
      
      sizes[i] = 2 + Math.random() * 4;
      lifes[i] = 0.5 + Math.random() * 0.5;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('life', new THREE.BufferAttribute(lifes, 1));
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        burstColor: { value: new THREE.Vector3(color.r, color.g, color.b) },
      },
      vertexShader: particleBurstShader.vertexShader,
      fragmentShader: particleBurstShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(geometry, material);
    (particles as any).userData = { startTime: sceneRef.current.clock.getElapsedTime(), duration: 1.5 };
    refs.scene.add(particles);
    refs.disposables.push(geometry);
    refs.materials.push(material);
    
    return particles;
  }, []);

  const createTrailParticles = useCallback(() => {
    const refs = sceneRef.current;
    if (!refs.scene) return;
    
    if (trailParticlesRef.current) {
      refs.scene.remove(trailParticlesRef.current);
    }
    
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = -10 - Math.random() * 80;
      sizes[i] = 1 + Math.random() * 2;
      alphas[i] = 0;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    
    const currentGalaxy = getGalaxyForProgress(scrollProgress);
    const trailColor = new THREE.Color(currentGalaxy.colorTheme.accent);
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        trailColor: { value: new THREE.Vector3(trailColor.r, trailColor.g, trailColor.b) },
      },
      vertexShader: trailParticleShader.vertexShader,
      fragmentShader: trailParticleShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(geometry, material);
    refs.scene.add(particles);
    trailParticlesRef.current = particles;
    refs.disposables.push(geometry);
    refs.materials.push(material);
  }, [scrollProgress, getGalaxyForProgress]);

  const triggerGalaxyTransition = useCallback(() => {
    const physics = physicsStateRef.current;
    
    physics.cameraShake.intensity = 0.8;
    physics.planetScatter = { active: true, progress: 0 };
    
    createShockwave();
    createTrailParticles();
    
    sceneRef.current.galaxyGroups.forEach((group) => {
      group.planets.forEach((mesh) => {
        const randomDir = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 2
        ).normalize();
        mesh.userData.scatterOffset = randomDir.multiplyScalar(3 + Math.random() * 5);
      });
    });
  }, [createShockwave, createTrailParticles]);

  const checkPlanetHover = useCallback(() => {
    const refs = sceneRef.current;
    if (!refs.camera || !raycasterRef.current) return;
    
    const mouse = new THREE.Vector2(mouseRef.current.x, mouseRef.current.y);
    raycasterRef.current.setFromCamera(mouse, refs.camera);
    
    const allVisiblePlanets: THREE.Object3D[] = [];
    refs.galaxyGroups.forEach((group) => {
      group.planets.forEach((mesh) => {
        if (mesh.visible) {
          allVisiblePlanets.push(mesh);
        }
      });
    });
    
    const intersects = raycasterRef.current.intersectObjects(allVisiblePlanets, false);
    
    let hoveredId: string | null = null;
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as PlanetMesh;
      if (hitMesh.userData?.planet) {
        hoveredId = hitMesh.userData.planet.id;
        
        if (physicsStateRef.current.hoveredPlanetId !== hoveredId) {
          const burstColor = new THREE.Color(hitMesh.userData.planet.color.primary);
          const burst = createParticleBurst(hitMesh.position.clone(), burstColor);
          if (burst) {
            hitMesh.userData.particleBurst = burst;
          }
        }
      }
    }
    
    physicsStateRef.current.hoveredPlanetId = hoveredId;
  }, [createParticleBurst]);

  const animate = useCallback(() => {
    const refs = sceneRef.current;
    refs.animationId = requestAnimationFrame(animate);

    const time = refs.clock.getElapsedTime();
    const cam = cameraState.current;
    const physics = physicsStateRef.current;
    
    checkPlanetHover();
    
    physics.scrollMomentum *= 0.95;
    const momentumBoost = physics.scrollMomentum * 0.5;
    
    const smoothing = 0.025;
    cam.x += (cam.targetX - cam.x) * smoothing;
    cam.y += (cam.targetY - cam.y) * smoothing;
    cam.z += (cam.targetZ - cam.z) * smoothing;

    const mouseX = mouseRef.current.x * 4;
    const mouseY = mouseRef.current.y * 2.5;
    
    if (physics.cameraShake.intensity > 0) {
      physics.cameraShake.x = (Math.random() - 0.5) * physics.cameraShake.intensity * 2;
      physics.cameraShake.y = (Math.random() - 0.5) * physics.cameraShake.intensity * 1.5;
      physics.cameraShake.z = (Math.random() - 0.5) * physics.cameraShake.intensity * 0.5;
      physics.cameraShake.intensity *= 0.92;
      if (physics.cameraShake.intensity < 0.01) physics.cameraShake.intensity = 0;
    }

    if (refs.camera) {
      refs.camera.position.x = cam.x + mouseX + physics.cameraShake.x;
      refs.camera.position.y = cam.y + mouseY + physics.cameraShake.y;
      refs.camera.position.z = cam.z + physics.cameraShake.z;
      refs.camera.lookAt(cam.lookAtX, cam.lookAtY, cam.lookAtZ);
    }
    
    if (physics.transitionShockwave.active && shockwaveRef.current) {
      physics.transitionShockwave.progress += 0.015;
      const mat = shockwaveRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.progress.value = physics.transitionShockwave.progress;
      
      if (physics.transitionShockwave.progress >= 1) {
        physics.transitionShockwave.active = false;
        refs.scene?.remove(shockwaveRef.current);
        shockwaveRef.current.geometry.dispose();
        (shockwaveRef.current.material as THREE.Material).dispose();
        shockwaveRef.current = null;
      }
    }
    
    if (physics.planetScatter.active) {
      physics.planetScatter.progress += 0.02;
      if (physics.planetScatter.progress >= 1) {
        physics.planetScatter.active = false;
        physics.planetScatter.progress = 0;
      }
    }
    
    if (trailParticlesRef.current && warpEffect > 0.3) {
      const positions = trailParticlesRef.current.geometry.attributes.position.array as Float32Array;
      const alphas = trailParticlesRef.current.geometry.attributes.alpha.array as Float32Array;
      
      for (let i = 0; i < alphas.length; i++) {
        positions[i * 3 + 2] += 2 * warpEffect;
        if (positions[i * 3 + 2] > 50) {
          positions[i * 3 + 2] = -80;
          positions[i * 3] = (Math.random() - 0.5) * 20;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        }
        alphas[i] = warpEffect * 0.8;
      }
      
      trailParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      trailParticlesRef.current.geometry.attributes.alpha.needsUpdate = true;
    }

    refs.starLayers.forEach((layer) => {
      const speed = (layer as any).userData.speed;
      layer.rotation.y += speed * (1 + warpEffect * 5) + momentumBoost * 0.001;
      layer.rotation.x += speed * 0.3;
    });

    if (refs.nebula) {
      const nebulaMat = refs.nebula.material as THREE.ShaderMaterial;
      nebulaMat.uniforms.time.value = time;
      nebulaMat.uniforms.parallax.value = mouseRef.current.x * 2;
      
      const currentGalaxy = getGalaxyForProgress(scrollProgress);
      nebulaMat.uniforms.nebulaColor1.value.set(
        currentGalaxy.nebulaColors.color1[0],
        currentGalaxy.nebulaColors.color1[1],
        currentGalaxy.nebulaColors.color1[2]
      );
      nebulaMat.uniforms.nebulaColor2.value.set(
        currentGalaxy.nebulaColors.color2[0],
        currentGalaxy.nebulaColors.color2[1],
        currentGalaxy.nebulaColors.color2[2]
      );
      nebulaMat.uniforms.nebulaColor3.value.set(
        currentGalaxy.nebulaColors.color3[0],
        currentGalaxy.nebulaColors.color3[1],
        currentGalaxy.nebulaColors.color3[2]
      );
    }

    const currentGalaxy = getGalaxyForProgress(scrollProgress);
    
    refs.galaxyGroups.forEach((group) => {
      const isCurrentGalaxy = group.id === currentGalaxy.id;
      const galaxyIndex = galaxies.findIndex(g => g.id === group.id);
      const currentIndex = galaxies.findIndex(g => g.id === currentGalaxy.id);
      const isAdjacent = Math.abs(galaxyIndex - currentIndex) <= 1;
      
      const visibility = isCurrentGalaxy ? 1 : (isAdjacent ? 0.3 : 0);
      
      group.sun.visible = visibility > 0;
      group.sunLight.visible = visibility > 0;
      group.corona.forEach(c => { c.visible = visibility > 0; });
      
      if (group.sun.visible) {
        const sunMat = group.sun.material as THREE.ShaderMaterial;
        sunMat.uniforms.time.value = time;
        group.sun.rotation.y += 0.0005;
        
        group.corona.forEach((corona) => {
          const coronaMat = corona.material as THREE.ShaderMaterial;
          coronaMat.uniforms.time.value = time;
        });
      }
      
      group.planets.forEach((mesh) => {
        mesh.visible = visibility > 0;
        if (mesh.userData.atmosphere) {
          mesh.userData.atmosphere.visible = visibility > 0;
        }
        if (mesh.userData.outerGlow) {
          mesh.userData.outerGlow.visible = visibility > 0;
        }
        
        if (mesh.visible) {
          const planet = mesh.userData.planet;
          const bobOffset = mesh.userData.bobOffset;
          const isHovered = physics.hoveredPlanetId === planet.id;
          
          if (mesh.userData.hoverIntensity === undefined) mesh.userData.hoverIntensity = 0;
          if (mesh.userData.wobblePhase === undefined) mesh.userData.wobblePhase = Math.random() * Math.PI * 2;
          
          const targetHover = isHovered ? 1 : 0;
          mesh.userData.hoverIntensity += (targetHover - mesh.userData.hoverIntensity) * 0.1;
          const hoverIntensity = mesh.userData.hoverIntensity;
          
          const orbitSpeedWithMomentum = planet.orbitSpeed * (1 + momentumBoost * 0.5);
          mesh.userData.angle += orbitSpeedWithMomentum;
          
          let baseX = Math.cos(mesh.userData.angle) * planet.distance;
          let baseZ = Math.sin(mesh.userData.angle) * planet.distance;
          let baseY = Math.sin(time * 0.5 + bobOffset) * 0.15;
          
          if (physics.planetScatter.active && mesh.userData.scatterOffset) {
            const scatterProgress = physics.planetScatter.progress;
            const scatterCurve = Math.sin(scatterProgress * Math.PI);
            baseX += mesh.userData.scatterOffset.x * scatterCurve;
            baseY += mesh.userData.scatterOffset.y * scatterCurve;
            baseZ += mesh.userData.scatterOffset.z * scatterCurve;
          }
          
          if (hoverIntensity > 0.01) {
            const wobbleSpeed = 8;
            const wobbleAmount = 0.3 * hoverIntensity;
            mesh.userData.wobblePhase += 0.1;
            baseX += Math.sin(time * wobbleSpeed + mesh.userData.wobblePhase) * wobbleAmount;
            baseY += Math.cos(time * wobbleSpeed * 1.3) * wobbleAmount * 0.5;
            baseZ += Math.sin(time * wobbleSpeed * 0.8) * wobbleAmount;
          }
          
          mesh.position.set(baseX, baseY, baseZ);
          
          const baseScale = 1 + hoverIntensity * 0.15 * (1 + Math.sin(time * 4) * 0.3);
          mesh.scale.setScalar(baseScale);
          
          mesh.rotation.y += planet.rotationSpeed * (1 + hoverIntensity * 0.5);

          const mat = mesh.material as THREE.ShaderMaterial;
          if (mat.uniforms?.time) mat.uniforms.time.value = time;
          if (mat.uniforms?.lightPosition) mat.uniforms.lightPosition.value.set(0, 0, 0);

          if (mesh.userData.atmosphere) {
            mesh.userData.atmosphere.position.copy(mesh.position);
            mesh.userData.atmosphere.scale.setScalar(baseScale * (1 + hoverIntensity * 0.1));
            const atmosMat = mesh.userData.atmosphere.material as THREE.ShaderMaterial;
            if (atmosMat.uniforms?.lightPosition) atmosMat.uniforms.lightPosition.value.set(0, 0, 0);
            if (atmosMat.uniforms?.time) atmosMat.uniforms.time.value = time;
          }
          
          if (mesh.userData.outerGlow) {
            mesh.userData.outerGlow.position.copy(mesh.position);
            const glowScale = baseScale * (1 + hoverIntensity * 0.3);
            mesh.userData.outerGlow.scale.setScalar(glowScale);
            mesh.userData.outerGlow.visible = mesh.visible;
            
            const glowMat = mesh.userData.outerGlow.material as THREE.ShaderMaterial;
            if (glowMat.uniforms?.glowColor && hoverIntensity > 0.01) {
              const intensityBoost = 1 + hoverIntensity * 0.5;
              const baseColor = glowMat.uniforms.glowColor.value;
              glowMat.uniforms.glowColor.value.set(
                Math.min(baseColor.x * intensityBoost, 1),
                Math.min(baseColor.y * intensityBoost, 1),
                Math.min(baseColor.z * intensityBoost, 1)
              );
            }
          }
          
          if (mesh.userData.particleBurst) {
            const burst = mesh.userData.particleBurst as THREE.Points;
            const burstData = (burst as any).userData;
            const elapsed = time - burstData.startTime;
            
            if (elapsed < burstData.duration) {
              const burstMat = burst.material as THREE.ShaderMaterial;
              if (burstMat.uniforms?.time) burstMat.uniforms.time.value = elapsed / burstData.duration;
            } else {
              refs.scene?.remove(burst);
              mesh.userData.particleBurst = undefined;
            }
          }
        }
      });
    });

    if (refs.renderer && refs.scene && refs.camera) {
      refs.renderer.render(refs.scene, refs.camera);
    }
  }, [scrollProgress, warpEffect, getGalaxyForProgress, checkPlanetHover]);

  const getColorHex = (planet: PlanetConfig) => `#${planet.color.primary.toString(16).padStart(6, '0')}`;
  const getGalaxyIcon = (galaxyId: string) => {
    switch (galaxyId) {
      case 'vapt': return <Shield className="w-5 h-5" />;
      case 'iso': return <FileCheck className="w-5 h-5" />;
      case 'software': return <Code className="w-5 h-5" />;
      default: return null;
    }
  };

  const updateSpacerHeight = useCallback(() => {
    if (spacerRef.current) {
      const height = window.innerHeight * galaxies.length * SCROLL_MULTIPLIER;
      spacerRef.current.style.height = `${height}px`;
    }
  }, []);

  useEffect(() => {
    updateSpacerHeight();
    window.addEventListener('resize', updateSpacerHeight);
    
    const waitForLayoutAndRestore = () => {
      if (initialScrollRestoredRef.current) return;
      
      const checkAndRestore = () => {
        if (!scrollRef.current || !spacerRef.current) {
          requestAnimationFrame(checkAndRestore);
          return;
        }
        
        const scrollHeight = scrollRef.current.scrollHeight;
        const clientHeight = scrollRef.current.clientHeight;
        const scrollableDistance = scrollHeight - clientHeight;
        
        if (scrollableDistance < 100) {
          requestAnimationFrame(checkAndRestore);
          return;
        }
        
        const savedProgress = sessionStorage.getItem('galaxyScrollProgress');
        if (savedProgress && !initialScrollRestoredRef.current) {
          const progress = parseFloat(savedProgress);
          scrollRef.current.scrollTop = progress * scrollableDistance;
          setScrollProgress(progress);
          
          const galaxy = getGalaxyForProgress(progress);
          setActiveGalaxy(galaxy);
          lastGalaxyRef.current = galaxy.id;
          initialScrollRestoredRef.current = true;
        }
      };
      
      requestAnimationFrame(checkAndRestore);
    };
    
    waitForLayoutAndRestore();
    
    return () => window.removeEventListener('resize', updateSpacerHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      
      <div 
        ref={scrollRef} 
        className="fixed inset-0 z-10 overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div 
          ref={spacerRef} 
          className="w-full"
          style={{ height: '1500vh' }}
        />
      </div>
      
      <div className="fixed inset-0 z-20 pointer-events-none">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-50 pointer-events-auto">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Initializing Galaxy Experience...</p>
            </div>
          </div>
        )}
        
        {warpEffect > 0.3 && (
          <div 
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: `radial-gradient(circle at center, transparent 0%, ${activeGalaxy.colorTheme.accent}${Math.floor(warpEffect * 30).toString(16).padStart(2, '0')} 100%)`,
            }}
          />
        )}
        
        <AnimatePresence>
          {transitionText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            >
              <div className="text-center">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-4xl md:text-6xl font-bold"
                  style={{ 
                    color: activeGalaxy.colorTheme.accent,
                    textShadow: `0 0 40px ${activeGalaxy.colorTheme.accent}`,
                  }}
                >
                  {transitionText}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <div className="flex items-center gap-4 backdrop-blur-xl bg-black/40 rounded-full px-6 py-3 border border-white/10">
            {galaxies.map((galaxy, index) => (
              <div
                key={galaxy.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500 ${
                  activeGalaxy.id === galaxy.id 
                    ? 'bg-white/10' 
                    : 'opacity-40 hover:opacity-70'
                }`}
                style={{ 
                  color: activeGalaxy.id === galaxy.id ? galaxy.colorTheme.accent : 'white',
                  boxShadow: activeGalaxy.id === galaxy.id 
                    ? `0 0 20px ${galaxy.colorTheme.accent}40` 
                    : 'none'
                }}
              >
                {getGalaxyIcon(galaxy.id)}
                <span className="text-sm font-medium hidden md:inline">{galaxy.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <div className="flex items-center gap-2 backdrop-blur-xl bg-black/40 rounded-full px-4 py-2 border border-white/10">
            {activeGalaxy.planets.map((planet) => (
              <div
                key={planet.id}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                  activePlanet?.id === planet.id ? 'scale-150' : 'opacity-40 hover:opacity-70'
                }`}
                style={{ 
                  backgroundColor: getColorHex(planet),
                  boxShadow: activePlanet?.id === planet.id 
                    ? `0 0 12px ${getColorHex(planet)}` 
                    : 'none'
                }}
                title={planet.name}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activePlanet && (
            <motion.div
              key={activePlanet.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.9 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 max-w-sm md:max-w-md z-20 pointer-events-auto"
            >
              <motion.div 
                className="backdrop-blur-2xl bg-black/60 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
                animate={{
                  boxShadow: [
                    `0 0 20px ${getColorHex(activePlanet)}20`,
                    `0 0 40px ${getColorHex(activePlanet)}30`,
                    `0 0 20px ${getColorHex(activePlanet)}20`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div 
                  className="w-16 h-1.5 rounded-full mb-5"
                  style={{ backgroundColor: getColorHex(activePlanet) }}
                  initial={{ width: 0 }}
                  animate={{ width: 64 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: `${activeGalaxy.colorTheme.primary}20`,
                      color: activeGalaxy.colorTheme.accent,
                    }}
                  >
                    {activeGalaxy.name}
                  </span>
                </div>
                <h2 
                  className="font-display text-2xl md:text-3xl font-bold mb-3"
                  style={{ 
                    color: getColorHex(activePlanet),
                    textShadow: `0 0 40px ${getColorHex(activePlanet)}60`
                  }}
                >
                  {activePlanet.name}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-4">
                  {activePlanet.description}
                </p>
                <ul className="space-y-2 mb-5">
                  {activePlanet.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-white/80">
                      <div 
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: getColorHex(activePlanet) }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                {activePlanet.actionType === 'modal' ? (
                  <button
                    onClick={() => { setModalPlanet(activePlanet); setModalOpen(true); }}
                    className="flex items-center gap-2 font-semibold px-5 py-3 rounded-full hover:opacity-90 transition-all group"
                    style={{
                      background: `linear-gradient(135deg, ${activeGalaxy.colorTheme.primary}, ${activeGalaxy.colorTheme.secondary})`,
                    }}
                    data-testid={`button-learn-more-${activePlanet.id}`}
                  >
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <Link
                    href={activePlanet.actionType === 'attack-globe' ? '/attack-globe' : activePlanet.link}
                    className="flex items-center gap-2 font-semibold px-5 py-3 rounded-full hover:opacity-90 transition-all group"
                    style={{
                      background: `linear-gradient(135deg, ${activeGalaxy.colorTheme.primary}, ${activeGalaxy.colorTheme.secondary})`,
                    }}
                    data-testid={`link-learn-more-${activePlanet.id}`}
                  >
                    <span>{activePlanet.actionType === 'attack-globe' ? 'View Cyber Attacks' : 'Learn More'}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {scrollProgress < 0.03 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            >
              <div className="text-center px-6">
                <motion.h1 
                  className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
                  style={{ textShadow: '0 0 100px rgba(255, 100, 100, 0.4)' }}
                >
                  ARICA TECH
                </motion.h1>
                <motion.p 
                  className="text-lg md:text-2xl text-muted-foreground max-w-lg mx-auto mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Explore our security universe
                </motion.p>
                <motion.p 
                  className="text-sm text-muted-foreground/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Scroll to navigate through three galaxies of services
                </motion.p>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-8"
                >
                  <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto flex justify-center pt-2">
                    <div className="w-1.5 h-3 bg-white/50 rounded-full" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modalOpen && modalPlanet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-2xl w-full mx-4 p-8 rounded-3xl border border-white/10"
              style={{
                background: `linear-gradient(135deg, ${activeGalaxy.colorTheme.primary}20, ${activeGalaxy.colorTheme.secondary}10)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                data-testid="button-modal-close"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: getColorHex(modalPlanet) }}
              >
                {modalPlanet.modalContent?.title || modalPlanet.name}
              </h2>

              <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-sm overflow-hidden">
                {modalPlanet.modalContent?.type === 'scanner' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-400">
                      <span className="animate-pulse">●</span> Scanning target...
                    </div>
                    {['SQL Injection', 'XSS Vulnerabilities', 'CSRF Tokens', 'Auth Bypass'].map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="flex justify-between text-white/70"
                      >
                        <span>Checking {item}...</span>
                        <span className="text-yellow-400">⬤</span>
                      </motion.div>
                    ))}
                  </div>
                )}
                {modalPlanet.modalContent?.type === 'tester' && (
                  <div className="space-y-2">
                    <div className="text-cyan-400">GET /api/v1/users</div>
                    <div className="text-green-400">→ 200 OK (42ms)</div>
                    <div className="text-cyan-400 mt-2">POST /api/v1/auth</div>
                    <div className="text-green-400">→ 200 OK (128ms)</div>
                    <div className="text-cyan-400 mt-2">GET /api/v1/admin</div>
                    <div className="text-red-400">→ 401 Unauthorized (15ms)</div>
                  </div>
                )}
                {modalPlanet.modalContent?.type === 'checker' && (
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>S3 Bucket Encryption</span><span className="text-green-400">✓</span></div>
                    <div className="flex justify-between"><span>IAM MFA Enabled</span><span className="text-green-400">✓</span></div>
                    <div className="flex justify-between"><span>Public Access Blocked</span><span className="text-red-400">✗</span></div>
                    <div className="flex justify-between"><span>CloudTrail Logging</span><span className="text-yellow-400">⚠</span></div>
                  </div>
                )}
                {modalPlanet.modalContent?.type === 'checklist' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2"><span className="text-green-400">☑</span> Information Security Policy</div>
                    <div className="flex items-center gap-2"><span className="text-green-400">☑</span> Risk Assessment Framework</div>
                    <div className="flex items-center gap-2"><span className="text-yellow-400">☐</span> Access Control Policy</div>
                    <div className="flex items-center gap-2"><span className="text-yellow-400">☐</span> Incident Response Plan</div>
                  </div>
                )}
                {modalPlanet.modalContent?.type === 'pipeline' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2"><span className="text-green-400">✓</span> Build → <span className="text-white/50">2.3s</span></div>
                    <div className="flex items-center gap-2"><span className="text-green-400">✓</span> SAST Scan → <span className="text-white/50">12.1s</span></div>
                    <div className="flex items-center gap-2"><span className="text-cyan-400 animate-pulse">●</span> Container Scan → <span className="text-white/50">running...</span></div>
                    <div className="flex items-center gap-2 text-white/30">○ Deploy to Staging</div>
                  </div>
                )}
              </div>

              <p className="text-muted-foreground mb-6">{modalPlanet.description}</p>

              <div className="flex gap-3">
                <Link
                  href="/contact"
                  className="flex-1 text-center py-3 rounded-full font-semibold transition-all hover:opacity-90"
                  style={{
                    background: `linear-gradient(135deg, ${activeGalaxy.colorTheme.primary}, ${activeGalaxy.colorTheme.secondary})`,
                  }}
                  onClick={() => setModalOpen(false)}
                  data-testid="link-modal-contact"
                >
                  Get Started
                </Link>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 rounded-full font-semibold bg-white/10 hover:bg-white/20 transition-colors"
                  data-testid="button-modal-close-secondary"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
