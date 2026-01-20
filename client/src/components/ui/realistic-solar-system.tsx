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

const mercuryShader = {
  vertexShader: `
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
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 lightPosition;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
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
      for(int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }
    
    float crater(vec2 p, vec2 center, float radius) {
      float d = length(p - center);
      float rim = smoothstep(radius * 0.8, radius, d) * (1.0 - smoothstep(radius, radius * 1.2, d));
      float floor = 1.0 - smoothstep(0.0, radius * 0.7, d);
      return rim * 0.3 - floor * 0.15;
    }
    
    void main() {
      vec3 lightDir = normalize(lightPosition - vWorldPosition);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float NdotL = dot(vNormal, lightDir);
      float diffuse = max(NdotL, 0.0);
      
      vec2 uv = vec2(atan(vPosition.x, vPosition.z) / 6.28318 + 0.5, asin(vPosition.y / length(vPosition)) / 3.14159 + 0.5);
      
      vec3 baseColor = vec3(0.45, 0.42, 0.38);
      float terrain = fbm(uv * 15.0);
      baseColor = mix(baseColor, vec3(0.55, 0.52, 0.48), terrain);
      
      float craters = 0.0;
      craters += crater(uv, vec2(0.3, 0.5), 0.08);
      craters += crater(uv, vec2(0.7, 0.4), 0.06);
      craters += crater(uv, vec2(0.5, 0.7), 0.05);
      craters += crater(uv, vec2(0.2, 0.3), 0.04);
      craters += crater(uv, vec2(0.8, 0.6), 0.07);
      craters += crater(uv, vec2(0.4, 0.2), 0.03);
      craters += crater(uv, vec2(0.6, 0.8), 0.05);
      
      baseColor += vec3(craters) * 0.5;
      
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(vNormal, halfDir), 0.0), 20.0) * 0.15;
      
      float terminator = smoothstep(-0.15, 0.25, diffuse);
      vec3 nightSide = baseColor * 0.03;
      vec3 daySide = baseColor * (diffuse * 0.85 + 0.15) + vec3(spec);
      
      float rimLight = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0) * 0.1;
      
      vec3 finalColor = mix(nightSide, daySide, terminator);
      finalColor += rimLight * vec3(0.6, 0.5, 0.4);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

const venusShader = {
  vertexShader: mercuryShader.vertexShader,
  fragmentShader: `
    uniform float time;
    uniform vec3 lightPosition;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(noise(i), noise(i + vec2(1.0, 0.0)), f.x),
                 mix(noise(i + vec2(0.0, 1.0)), noise(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for(int i = 0; i < 6; i++) {
        v += a * smoothNoise(p);
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
      
      float cloudPattern = fbm(uv * 4.0 + time * 0.02);
      float cloudPattern2 = fbm(uv * 8.0 - time * 0.015);
      float swirl = fbm(vec2(uv.x * 6.0 + sin(uv.y * 10.0) * 0.3, uv.y * 4.0) + time * 0.01);
      
      vec3 baseColor = vec3(0.9, 0.75, 0.4);
      vec3 cloudColor = vec3(1.0, 0.95, 0.7);
      vec3 darkCloud = vec3(0.7, 0.55, 0.3);
      
      vec3 surfaceColor = mix(baseColor, cloudColor, cloudPattern * 0.6);
      surfaceColor = mix(surfaceColor, darkCloud, cloudPattern2 * swirl * 0.4);
      
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);
      vec3 atmosphereColor = vec3(1.0, 0.9, 0.5);
      surfaceColor = mix(surfaceColor, atmosphereColor, fresnel * 0.5);
      
      float terminator = smoothstep(-0.2, 0.4, diffuse);
      vec3 nightSide = surfaceColor * 0.08;
      vec3 daySide = surfaceColor * (diffuse * 0.6 + 0.4);
      
      float rimLight = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 4.0) * 0.4;
      
      vec3 finalColor = mix(nightSide, daySide, terminator);
      finalColor += rimLight * atmosphereColor;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

const earthShader = {
  vertexShader: `
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
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 lightPosition;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
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
      for(int i = 0; i < 6; i++) {
        v += a * noise(p);
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
      
      float continentNoise = fbm(uv * 6.0);
      float continentDetail = fbm(uv * 12.0);
      float continent = smoothstep(0.35, 0.5, continentNoise + continentDetail * 0.3);
      
      float africaEurope = smoothstep(0.4, 0.5, fbm(uv * 5.0 + vec2(0.2, 0.0)));
      float americas = smoothstep(0.42, 0.52, fbm(uv * 5.0 + vec2(1.5, 0.1)));
      float asia = smoothstep(0.38, 0.48, fbm(uv * 5.0 + vec2(-0.5, 0.2)));
      continent = max(continent, max(africaEurope, max(americas, asia)));
      
      vec3 deepOcean = vec3(0.02, 0.08, 0.22);
      vec3 shallowOcean = vec3(0.05, 0.2, 0.45);
      vec3 coastOcean = vec3(0.1, 0.35, 0.55);
      float oceanDepth = fbm(uv * 8.0);
      vec3 oceanColor = mix(deepOcean, shallowOcean, oceanDepth);
      oceanColor = mix(oceanColor, coastOcean, smoothstep(0.3, 0.4, continent) * (1.0 - continent));
      
      vec3 forestGreen = vec3(0.1, 0.35, 0.12);
      vec3 grassGreen = vec3(0.2, 0.45, 0.15);
      vec3 desertYellow = vec3(0.75, 0.65, 0.35);
      vec3 mountainBrown = vec3(0.4, 0.32, 0.22);
      vec3 snowWhite = vec3(0.95, 0.97, 1.0);
      
      float elevation = fbm(uv * 10.0);
      float moisture = fbm(uv * 7.0 + vec2(100.0, 0.0));
      float latitude = abs(vPosition.y / length(vPosition));
      
      vec3 landColor = mix(forestGreen, grassGreen, moisture);
      landColor = mix(landColor, desertYellow, smoothstep(0.3, 0.6, 1.0 - moisture) * (1.0 - latitude * 0.5));
      landColor = mix(landColor, mountainBrown, smoothstep(0.6, 0.8, elevation));
      landColor = mix(landColor, snowWhite, smoothstep(0.75, 0.95, latitude));
      landColor = mix(landColor, snowWhite, smoothstep(0.85, 0.95, elevation) * 0.7);
      
      vec3 surfaceColor = mix(oceanColor, landColor, continent);
      
      vec3 halfDir = normalize(lightDir + viewDir);
      float oceanSpec = pow(max(dot(vNormal, halfDir), 0.0), 80.0) * (1.0 - continent) * 0.8;
      float iceSpec = pow(max(dot(vNormal, halfDir), 0.0), 40.0) * smoothstep(0.7, 0.9, latitude) * 0.4;
      
      float terminator = smoothstep(-0.12, 0.25, diffuse);
      vec3 nightSide = vec3(0.005, 0.005, 0.015);
      float cityLights = step(0.72, fbm(uv * 25.0)) * continent * (1.0 - latitude * 0.5);
      nightSide += vec3(1.0, 0.85, 0.4) * cityLights * 0.6;
      
      vec3 daySide = surfaceColor * (diffuse * 0.75 + 0.25);
      daySide += vec3(1.0, 0.95, 0.9) * (oceanSpec + iceSpec);
      
      vec3 finalColor = mix(nightSide, daySide, terminator);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

const earthCloudShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 lightPosition;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    
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
      for(int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }
    
    void main() {
      vec3 lightDir = normalize(lightPosition - vWorldPosition);
      float diffuse = max(dot(vNormal, lightDir), 0.0);
      
      vec2 uv = vec2(atan(vPosition.x, vPosition.z) / 6.28318 + 0.5, asin(vPosition.y / length(vPosition)) / 3.14159 + 0.5);
      
      float clouds = fbm(uv * 5.0 + time * 0.008);
      float clouds2 = fbm(uv * 8.0 - time * 0.005);
      float cloudCoverage = smoothstep(0.4, 0.7, clouds * clouds2 + clouds * 0.3);
      
      float latitude = abs(vPosition.y / length(vPosition));
      cloudCoverage *= smoothstep(0.0, 0.2, latitude) * smoothstep(1.0, 0.7, latitude);
      cloudCoverage += smoothstep(0.6, 0.8, latitude) * 0.3;
      
      float terminator = smoothstep(-0.1, 0.3, diffuse);
      vec3 cloudColor = vec3(1.0) * (diffuse * 0.6 + 0.4);
      cloudColor = mix(vec3(0.02), cloudColor, terminator);
      
      float alpha = cloudCoverage * 0.85;
      
      gl_FragColor = vec4(cloudColor, alpha);
    }
  `,
};

const earthAtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 lightPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vec3 lightDir = normalize(lightPosition - vWorldPosition);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      
      float NdotL = dot(vNormal, lightDir);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
      
      float scatter = pow(max(0.0, dot(lightDir, -viewDir)), 2.0) * 0.3;
      float lightSide = smoothstep(-0.2, 0.5, NdotL);
      
      vec3 dayAtmosphere = vec3(0.4, 0.7, 1.0);
      vec3 sunsetAtmosphere = vec3(1.0, 0.5, 0.2);
      vec3 nightAtmosphere = vec3(0.1, 0.15, 0.3);
      
      float sunsetFactor = smoothstep(-0.1, 0.1, NdotL) * (1.0 - smoothstep(0.1, 0.4, NdotL));
      vec3 atmosphereColor = mix(nightAtmosphere, dayAtmosphere, lightSide);
      atmosphereColor = mix(atmosphereColor, sunsetAtmosphere, sunsetFactor * 0.5);
      
      float intensity = fresnel * (0.6 + scatter + lightSide * 0.4);
      
      gl_FragColor = vec4(atmosphereColor, intensity * 0.7);
    }
  `,
};

const marsShader = {
  vertexShader: mercuryShader.vertexShader,
  fragmentShader: `
    uniform float time;
    uniform vec3 lightPosition;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
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
      for(int i = 0; i < 5; i++) {
        v += a * noise(p);
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
      
      vec3 rustRed = vec3(0.75, 0.3, 0.15);
      vec3 orangeRed = vec3(0.85, 0.45, 0.2);
      vec3 darkRed = vec3(0.4, 0.15, 0.08);
      vec3 polarIce = vec3(0.95, 0.92, 0.88);
      
      float terrain = fbm(uv * 8.0);
      float elevation = fbm(uv * 12.0);
      
      vec3 surfaceColor = mix(rustRed, orangeRed, terrain);
      surfaceColor = mix(surfaceColor, darkRed, smoothstep(0.5, 0.8, elevation) * 0.6);
      
      float valles = smoothstep(0.48, 0.52, uv.y) * smoothstep(0.3, 0.5, uv.x) * smoothstep(0.7, 0.5, uv.x);
      surfaceColor = mix(surfaceColor, darkRed * 0.7, valles * 0.4);
      
      float olympus = 1.0 - smoothstep(0.0, 0.08, length(uv - vec2(0.35, 0.55)));
      surfaceColor = mix(surfaceColor, orangeRed * 1.2, olympus * 0.5);
      
      float latitude = abs(vPosition.y / length(vPosition));
      float polarCap = smoothstep(0.75, 0.9, latitude);
      surfaceColor = mix(surfaceColor, polarIce, polarCap);
      
      float terminator = smoothstep(-0.12, 0.22, diffuse);
      vec3 nightSide = surfaceColor * 0.03;
      vec3 daySide = surfaceColor * (diffuse * 0.8 + 0.2);
      
      float rimLight = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.5) * 0.15;
      
      vec3 finalColor = mix(nightSide, daySide, terminator);
      finalColor += rimLight * vec3(0.8, 0.4, 0.2);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

const jupiterShader = {
  vertexShader: `
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
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 lightPosition;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
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
      for(int i = 0; i < 5; i++) {
        v += a * noise(p);
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
      
      vec3 cream = vec3(0.95, 0.9, 0.8);
      vec3 tan = vec3(0.85, 0.7, 0.5);
      vec3 brown = vec3(0.6, 0.4, 0.25);
      vec3 darkBrown = vec3(0.35, 0.22, 0.12);
      vec3 orange = vec3(0.9, 0.55, 0.3);
      vec3 redSpot = vec3(0.85, 0.35, 0.25);
      
      float latitude = vPosition.y / length(vPosition);
      float bandPattern = sin(latitude * 25.0) * 0.5 + 0.5;
      float bandNoise = fbm(vec2(uv.x * 8.0 + time * 0.02, latitude * 15.0));
      float turbulence = fbm(vec2(uv.x * 15.0 + latitude * 3.0 + time * 0.03, latitude * 20.0));
      
      bandPattern = bandPattern * 0.7 + bandNoise * 0.3;
      bandPattern += turbulence * 0.15;
      
      vec3 bandColor = mix(cream, tan, bandPattern);
      bandColor = mix(bandColor, brown, smoothstep(0.6, 0.8, bandPattern));
      bandColor = mix(bandColor, orange, smoothstep(0.3, 0.5, bandPattern) * (1.0 - smoothstep(0.5, 0.7, bandPattern)));
      bandColor = mix(bandColor, darkBrown, smoothstep(0.85, 1.0, bandPattern) * 0.5);
      
      vec2 spotCenter = vec2(0.65, 0.38);
      float spotDist = length((uv - spotCenter) * vec2(1.0, 1.8));
      float spot = 1.0 - smoothstep(0.0, 0.12, spotDist);
      float spotSwirl = fbm(vec2(atan(uv.y - spotCenter.y, uv.x - spotCenter.x) * 3.0 + time * 0.1, spotDist * 10.0));
      spot *= 0.5 + spotSwirl * 0.5;
      bandColor = mix(bandColor, redSpot, spot * 0.9);
      
      float innerSpot = 1.0 - smoothstep(0.0, 0.04, spotDist);
      bandColor = mix(bandColor, redSpot * 0.7, innerSpot * 0.6);
      
      float terminator = smoothstep(-0.1, 0.3, diffuse);
      vec3 nightSide = bandColor * 0.08;
      vec3 daySide = bandColor * (diffuse * 0.7 + 0.3);
      
      float rimLight = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 4.0) * 0.2;
      
      vec3 finalColor = mix(nightSide, daySide, terminator);
      finalColor += rimLight * vec3(0.9, 0.8, 0.6);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

const saturnShader = {
  vertexShader: jupiterShader.vertexShader,
  fragmentShader: `
    uniform float time;
    uniform vec3 lightPosition;
    uniform float ringInnerRadius;
    uniform float ringOuterRadius;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
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
      for(int i = 0; i < 4; i++) {
        v += a * noise(p);
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
      
      vec3 paleYellow = vec3(0.95, 0.92, 0.78);
      vec3 gold = vec3(0.88, 0.8, 0.6);
      vec3 tan = vec3(0.82, 0.72, 0.55);
      
      float latitude = vPosition.y / length(vPosition);
      float bandPattern = sin(latitude * 18.0) * 0.5 + 0.5;
      float bandNoise = fbm(vec2(uv.x * 6.0 + time * 0.015, latitude * 12.0));
      bandPattern = bandPattern * 0.8 + bandNoise * 0.2;
      
      vec3 bandColor = mix(paleYellow, gold, bandPattern);
      bandColor = mix(bandColor, tan, smoothstep(0.6, 0.9, bandPattern) * 0.5);
      
      float polarDark = smoothstep(0.6, 0.9, abs(latitude));
      bandColor = mix(bandColor, tan * 0.8, polarDark * 0.4);
      
      vec3 ringPlanePoint = vWorldPosition - vec3(0.0, vWorldPosition.y, 0.0);
      float distFromAxis = length(ringPlanePoint.xz);
      float ringLightBlock = 0.0;
      if (vWorldPosition.y > 0.0 && lightPosition.y < vWorldPosition.y) {
        float shadowDist = length(vec2(vPosition.x, vPosition.z));
        if (shadowDist > ringInnerRadius * 0.15 && shadowDist < ringOuterRadius * 0.25) {
          ringLightBlock = 0.3;
        }
      }
      
      float terminator = smoothstep(-0.1, 0.3, diffuse);
      vec3 nightSide = bandColor * 0.06;
      vec3 daySide = bandColor * (diffuse * 0.7 + 0.3) * (1.0 - ringLightBlock);
      
      float rimLight = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.5) * 0.15;
      
      vec3 finalColor = mix(nightSide, daySide, terminator);
      finalColor += rimLight * vec3(0.95, 0.9, 0.7);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

const saturnRingShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    uniform float time;
    uniform vec3 lightPosition;
    uniform vec3 planetPosition;
    uniform float planetRadius;
    
    float hash(float p) {
      return fract(sin(p * 127.1) * 43758.5453);
    }
    
    void main() {
      vec3 lightDir = normalize(lightPosition - vWorldPosition);
      
      float r = length(vUv - 0.5) * 2.0;
      
      float rings = 0.0;
      rings += sin(r * 80.0) * 0.5 + 0.5;
      rings *= sin(r * 45.0 + 0.5) * 0.5 + 0.5;
      rings *= sin(r * 120.0 + 1.2) * 0.3 + 0.7;
      rings *= hash(floor(r * 200.0)) * 0.4 + 0.6;
      
      float cassiniGap = 1.0 - smoothstep(0.54, 0.56, r) * (1.0 - smoothstep(0.58, 0.60, r));
      float enckeGap = 1.0 - smoothstep(0.78, 0.79, r) * (1.0 - smoothstep(0.80, 0.81, r));
      rings *= cassiniGap * enckeGap;
      
      vec3 iceWhite = vec3(0.95, 0.93, 0.88);
      vec3 dustyTan = vec3(0.8, 0.7, 0.55);
      vec3 darkMaterial = vec3(0.4, 0.35, 0.3);
      
      vec3 ringColor = mix(dustyTan, iceWhite, rings);
      ringColor = mix(ringColor, darkMaterial, (1.0 - rings) * 0.3);
      
      float lightAngle = max(dot(vec3(0.0, 1.0, 0.0), lightDir), 0.0);
      lightAngle = max(lightAngle, max(dot(vec3(0.0, -1.0, 0.0), lightDir), 0.0));
      ringColor *= 0.4 + lightAngle * 0.6;
      
      vec3 toPlanet = planetPosition - vWorldPosition;
      float distToPlanet = length(toPlanet);
      float shadow = 1.0;
      if (distToPlanet < planetRadius * 2.0) {
        vec3 toLightNorm = normalize(lightPosition - vWorldPosition);
        float planetBlock = dot(normalize(toPlanet), toLightNorm);
        if (planetBlock > 0.8) {
          shadow = 0.3;
        }
      }
      ringColor *= shadow;
      
      float alpha = smoothstep(0.32, 0.38, r) * smoothstep(1.0, 0.92, r);
      alpha *= rings * 0.85 + 0.15;
      alpha *= cassiniGap * 0.3 + 0.7;
      
      gl_FragColor = vec4(ringColor, alpha * 0.9);
    }
  `,
};

const neptuneShader = {
  vertexShader: jupiterShader.vertexShader,
  fragmentShader: `
    uniform float time;
    uniform vec3 lightPosition;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
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
      for(int i = 0; i < 5; i++) {
        v += a * noise(p);
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
      
      vec3 deepBlue = vec3(0.05, 0.12, 0.45);
      vec3 brightBlue = vec3(0.15, 0.35, 0.85);
      vec3 cyan = vec3(0.2, 0.6, 0.9);
      vec3 white = vec3(0.9, 0.95, 1.0);
      
      float latitude = vPosition.y / length(vPosition);
      float bandPattern = sin(latitude * 12.0 + time * 0.1) * 0.5 + 0.5;
      float cloudNoise = fbm(vec2(uv.x * 10.0 + time * 0.05, latitude * 8.0));
      float stormNoise = fbm(vec2(uv.x * 20.0 - time * 0.08, latitude * 15.0));
      
      vec3 baseColor = mix(deepBlue, brightBlue, bandPattern * 0.6 + cloudNoise * 0.4);
      baseColor = mix(baseColor, cyan, stormNoise * 0.3);
      
      float darkSpot = 1.0 - smoothstep(0.0, 0.1, length((uv - vec2(0.4, 0.45)) * vec2(1.0, 1.5)));
      baseColor = mix(baseColor, deepBlue * 0.5, darkSpot * 0.6);
      
      float highClouds = smoothstep(0.65, 0.8, fbm(uv * 12.0 + time * 0.03));
      baseColor = mix(baseColor, white, highClouds * 0.25);
      
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
      vec3 atmosphereGlow = vec3(0.3, 0.6, 1.0);
      baseColor = mix(baseColor, atmosphereGlow, fresnel * 0.4);
      
      float terminator = smoothstep(-0.15, 0.25, diffuse);
      vec3 nightSide = baseColor * 0.05;
      vec3 daySide = baseColor * (diffuse * 0.7 + 0.3);
      
      float rimLight = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 4.0) * 0.35;
      
      vec3 finalColor = mix(nightSide, daySide, terminator);
      finalColor += rimLight * atmosphereGlow;
      
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
      displacement += noise(position * 10.0 + time * 1.0) * 0.03;
      
      vec3 newPosition = position + normal * displacement;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
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
      for(int i = 0; i < 6; i++) {
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
      vec3 midYellow = vec3(1.0, 0.9, 0.4);
      vec3 orange = vec3(1.0, 0.6, 0.1);
      vec3 deepOrange = vec3(0.95, 0.4, 0.05);
      
      vec3 color = core;
      color = mix(color, midYellow, granulation * 0.4);
      color = mix(color, orange, convection * 0.3);
      color = mix(color, deepOrange, (1.0 - largeStructure) * 0.2);
      
      float sunspot = 1.0 - smoothstep(0.0, 0.05, length(uv - vec2(0.3, 0.55)));
      sunspot += 1.0 - smoothstep(0.0, 0.03, length(uv - vec2(0.7, 0.48)));
      sunspot += 1.0 - smoothstep(0.0, 0.04, length(uv - vec2(0.5, 0.4)));
      color = mix(color, vec3(0.3, 0.15, 0.05), sunspot * 0.6);
      
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5);
      color = mix(color, orange, fresnel * 0.3);
      
      float flare = fbm(uv * 15.0 + time * 2.0) * fbm(uv * 25.0 - time * 1.5);
      float flarePulse = sin(time * 3.0) * 0.5 + 0.5;
      color += vec3(1.0, 0.7, 0.2) * flare * flarePulse * 0.3;
      
      color *= 1.3;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

const sunCoronaShader = {
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
    uniform float intensity;
    uniform float layerOffset;
    varying vec3 vNormal;
    varying vec3 vPosition;
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
      for(int i = 0; i < 5; i++) {
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
      float coronaStreaks = fbm(vec2(uv.x * 20.0 + time * 0.1, uv.y * 3.0 + layerOffset));
      float cme = fbm(uv * 4.0 + time * 0.5) * fbm(uv * 12.0 - time * 0.3);
      
      float pulse = sin(time * 2.0 + layerOffset) * 0.15 + 0.85;
      
      vec3 innerCorona = vec3(1.0, 0.95, 0.7);
      vec3 outerCorona = vec3(1.0, 0.5, 0.1);
      vec3 cmeColor = vec3(1.0, 0.3, 0.05);
      
      vec3 color = mix(innerCorona, outerCorona, fresnel);
      color += cmeColor * cme * 0.4;
      color += coronaStreaks * 0.2;
      
      float alpha = fresnel * intensity * pulse;
      alpha *= (coronaNoise * 0.5 + 0.5);
      alpha += cme * 0.15;
      
      gl_FragColor = vec4(color, alpha * 0.8);
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
    refs.renderer.toneMappingExposure = 1.4;

    const ambientLight = new THREE.AmbientLight(0x111122, 0.2);
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

    const starCount = 6000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

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

      const baseUniforms = {
        time: { value: 0 },
        primaryColor: { value: new THREE.Color(planet.colors.primary) },
        secondaryColor: { value: new THREE.Color(planet.colors.secondary) },
        lightPosition: { value: new THREE.Vector3(0, 0, 0) },
      };

      if (planet.type === 'sun') {
        material = new THREE.ShaderMaterial({
          uniforms: baseUniforms,
          vertexShader: sunShader.vertexShader,
          fragmentShader: sunShader.fragmentShader,
        });
      } else if (planet.name === 'mercury') {
        material = new THREE.ShaderMaterial({
          uniforms: baseUniforms,
          vertexShader: mercuryShader.vertexShader,
          fragmentShader: mercuryShader.fragmentShader,
        });
      } else if (planet.name === 'venus') {
        material = new THREE.ShaderMaterial({
          uniforms: baseUniforms,
          vertexShader: venusShader.vertexShader,
          fragmentShader: venusShader.fragmentShader,
        });
      } else if (planet.name === 'earth') {
        material = new THREE.ShaderMaterial({
          uniforms: baseUniforms,
          vertexShader: earthShader.vertexShader,
          fragmentShader: earthShader.fragmentShader,
        });
      } else if (planet.name === 'mars') {
        material = new THREE.ShaderMaterial({
          uniforms: baseUniforms,
          vertexShader: marsShader.vertexShader,
          fragmentShader: marsShader.fragmentShader,
        });
      } else if (planet.name === 'jupiter') {
        material = new THREE.ShaderMaterial({
          uniforms: baseUniforms,
          vertexShader: jupiterShader.vertexShader,
          fragmentShader: jupiterShader.fragmentShader,
        });
      } else if (planet.name === 'saturn') {
        material = new THREE.ShaderMaterial({
          uniforms: {
            ...baseUniforms,
            ringInnerRadius: { value: planet.size * 1.4 },
            ringOuterRadius: { value: planet.size * 2.4 },
          },
          vertexShader: saturnShader.vertexShader,
          fragmentShader: saturnShader.fragmentShader,
        });
      } else if (planet.name === 'neptune') {
        material = new THREE.ShaderMaterial({
          uniforms: baseUniforms,
          vertexShader: neptuneShader.vertexShader,
          fragmentShader: neptuneShader.fragmentShader,
        });
      } else {
        material = new THREE.ShaderMaterial({
          uniforms: baseUniforms,
          vertexShader: mercuryShader.vertexShader,
          fragmentShader: mercuryShader.fragmentShader,
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
        const sunLight = new THREE.PointLight(0xffdd66, 4, 250);
        sunLight.position.set(0, 0, 0);
        refs.scene!.add(sunLight);

        const coronaLayers = [
          { size: 6.5, intensity: 0.25, offset: 0 },
          { size: 8, intensity: 0.18, offset: 1.5 },
          { size: 10, intensity: 0.12, offset: 3.0 },
          { size: 13, intensity: 0.08, offset: 4.5 },
          { size: 17, intensity: 0.05, offset: 6.0 },
        ];

        coronaLayers.forEach((layer) => {
          const coronaGeom = new THREE.SphereGeometry(layer.size, 48, 48);
          const coronaMat = new THREE.ShaderMaterial({
            uniforms: {
              time: { value: 0 },
              intensity: { value: layer.intensity },
              layerOffset: { value: layer.offset },
            },
            vertexShader: sunCoronaShader.vertexShader,
            fragmentShader: sunCoronaShader.fragmentShader,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
          });
          const coronaMesh = new THREE.Mesh(coronaGeom, coronaMat);
          refs.scene!.add(coronaMesh);
          refs.disposables.push(coronaGeom);
          refs.materials.push(coronaMat);
        });
      }

      if (planet.name === 'earth') {
        const cloudGeom = new THREE.SphereGeometry(planet.size * 1.02, 48, 48);
        const cloudMat = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            lightPosition: { value: new THREE.Vector3(0, 0, 0) },
          },
          vertexShader: earthCloudShader.vertexShader,
          fragmentShader: earthCloudShader.fragmentShader,
          transparent: true,
          depthWrite: false,
        });
        const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
        cloudMesh.position.copy(mesh.position);
        mesh.userData.clouds = cloudMesh;
        refs.scene!.add(cloudMesh);
        refs.disposables.push(cloudGeom);
        refs.materials.push(cloudMat);

        const atmosGeom = new THREE.SphereGeometry(planet.size * 1.12, 48, 48);
        const atmosMat = new THREE.ShaderMaterial({
          uniforms: {
            lightPosition: { value: new THREE.Vector3(0, 0, 0) },
          },
          vertexShader: earthAtmosphereShader.vertexShader,
          fragmentShader: earthAtmosphereShader.fragmentShader,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });
        const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
        atmosMesh.position.copy(mesh.position);
        mesh.userData.atmosphere = atmosMesh;
        refs.scene!.add(atmosMesh);
        refs.disposables.push(atmosGeom);
        refs.materials.push(atmosMat);
      }

      if (planet.type === 'ringed') {
        const ringGeom = new THREE.RingGeometry(planet.size * 1.4, planet.size * 2.4, 128);
        const ringMat = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            lightPosition: { value: new THREE.Vector3(0, 0, 0) },
            planetPosition: { value: mesh.position.clone() },
            planetRadius: { value: planet.size },
          },
          vertexShader: saturnRingShader.vertexShader,
          fragmentShader: saturnRingShader.fragmentShader,
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

      if (planet.colors.atmosphere && planet.name !== 'earth') {
        const atmosGeom = new THREE.SphereGeometry(planet.size * 1.12, 32, 32);
        const atmosMat = new THREE.ShaderMaterial({
          uniforms: {
            atmosphereColor: { value: new THREE.Color(planet.colors.atmosphere) },
            lightPosition: { value: new THREE.Vector3(0, 0, 0) },
          },
          vertexShader: `
            varying vec3 vNormal;
            varying vec3 vWorldPosition;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 atmosphereColor;
            uniform vec3 lightPosition;
            varying vec3 vNormal;
            varying vec3 vWorldPosition;
            void main() {
              vec3 lightDir = normalize(lightPosition - vWorldPosition);
              float NdotL = dot(vNormal, lightDir);
              float lightSide = smoothstep(-0.3, 0.5, NdotL);
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
              intensity *= 0.3 + lightSide * 0.7;
              gl_FragColor = vec4(atmosphereColor, intensity * 0.6);
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

      if (planet.distance > 0) {
        const orbitGeom = new THREE.RingGeometry(planet.distance - 0.02, planet.distance + 0.02, 128);
        const orbitMat = new THREE.MeshBasicMaterial({
          color: 0x333344,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.12,
        });
        const orbit = new THREE.Mesh(orbitGeom, orbitMat);
        orbit.rotation.x = Math.PI / 2;
        refs.scene!.add(orbit);
        refs.disposables.push(orbitGeom);
        refs.materials.push(orbitMat);
      }
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
        if (ringMat.uniforms?.planetPosition) ringMat.uniforms.planetPosition.value.copy(mesh.position);
      }

      if (mesh.userData.atmosphere) {
        mesh.userData.atmosphere.position.copy(mesh.position);
        const atmosMat = mesh.userData.atmosphere.material as THREE.ShaderMaterial;
        if (atmosMat.uniforms?.lightPosition) atmosMat.uniforms.lightPosition.value.set(0, 0, 0);
      }

      if (mesh.userData.clouds) {
        mesh.userData.clouds.position.copy(mesh.position);
        mesh.userData.clouds.rotation.y += planet.rotationSpeed * 0.3;
        const cloudMat = mesh.userData.clouds.material as THREE.ShaderMaterial;
        if (cloudMat.uniforms?.time) cloudMat.uniforms.time.value = time;
        if (cloudMat.uniforms?.lightPosition) cloudMat.uniforms.lightPosition.value.set(0, 0, 0);
      }
    });

    refs.materials.forEach((mat) => {
      if (mat instanceof THREE.ShaderMaterial) {
        if (mat.uniforms?.time) mat.uniforms.time.value = time;
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
