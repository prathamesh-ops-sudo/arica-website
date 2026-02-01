"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { isWebGLAvailable } from "@/lib/webgl-utils"

interface WebGLShaderProps {
  colorScheme?: 'wine' | 'cyan' | 'purple' | 'neutral';
  intensity?: number;
}

function CSSFallback() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#121212] via-[#1c1c1e] to-[#121212] animate-gradient-shift" style={{ backgroundSize: '400% 400%' }}>
      <div className="absolute inset-0 opacity-20" style={{
        background: `radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 40%),
                     radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%)`
      }} />
    </div>
  )
}

export function WebGLShader({ colorScheme = 'wine', intensity = 1.0 }: WebGLShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: any
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    setWebglSupported(isWebGLAvailable())
  }, [])

  useEffect(() => {
    if (!canvasRef.current || webglSupported !== true) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;
      uniform float intensity;
      uniform int colorMode;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        
        float d = length(p) * distortion;
        
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.04 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.04 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.04 / abs(p.y + sin((bx + time) * xScale) * yScale);
        
        vec3 color;
        if (colorMode == 0) {
          color = vec3(r * 0.85, g * 0.15, b * 0.25) * intensity;
        } else if (colorMode == 1) {
          color = vec3(r * 0.0, g * 0.83, b * 1.0) * intensity;
        } else if (colorMode == 2) {
          color = vec3(r * 0.6, g * 0.27, b * 1.0) * intensity;
        } else {
          color = vec3(r * 0.4, g * 0.4, b * 0.42) * intensity;
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `

    const initScene = () => {
      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      refs.renderer.setClearColor(new THREE.Color(0x000000))

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      const colorMode = colorScheme === 'wine' ? 0 : colorScheme === 'cyan' ? 1 : colorScheme === 'purple' ? 2 : 3;

      refs.uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
        xScale: { value: 1.0 },
        yScale: { value: 0.5 },
        distortion: { value: 0.05 },
        intensity: { value: intensity },
        colorMode: { value: colorMode },
      }

      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.008
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const width = window.innerWidth
      const height = window.innerHeight
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    initScene()
    animate()
    window.addEventListener("resize", handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [colorScheme, intensity, webglSupported])

  if (webglSupported === null) {
    return <CSSFallback />
  }

  if (!webglSupported) {
    return <CSSFallback />
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full block -z-10"
    />
  )
}
