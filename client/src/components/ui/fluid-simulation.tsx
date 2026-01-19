"use client";

import React, { useEffect, useRef, useCallback } from 'react';

interface FluidSimulationProps {
  className?: string;
  colorScheme?: 'cyan' | 'purple' | 'mixed';
  intensity?: number;
}

export function FluidSimulation({ 
  className = '', 
  colorScheme = 'cyan',
  intensity = 0.3
}: FluidSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, dx: 0, dy: 0, down: false });
  const lastTimeRef = useRef(0);

  const getColorConfig = useCallback(() => {
    switch (colorScheme) {
      case 'cyan':
        return { r: 0, g: 0.8, b: 1 };
      case 'purple':
        return { r: 0.6, g: 0.2, b: 1 };
      case 'mixed':
      default:
        return { r: 0, g: 0.6, b: 0.9 };
    }
  }, [colorScheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      console.warn('WebGL not supported for fluid simulation');
      return;
    }

    const ext = {
      formatRGBA: { internalFormat: gl.RGBA, format: gl.RGBA },
      formatRG: { internalFormat: gl.RGBA, format: gl.RGBA },
      formatR: { internalFormat: gl.RGBA, format: gl.RGBA },
      halfFloatTexType: gl.UNSIGNED_BYTE,
      supportLinearFiltering: true,
    };

    gl.getExtension('OES_texture_half_float');
    gl.getExtension('OES_texture_half_float_linear');

    function compileShader(type: number, source: string): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    function createProgram(vertexSource: string, fragmentSource: string): WebGLProgram | null {
      const vertexShader = compileShader(gl!.VERTEX_SHADER, vertexSource);
      const fragmentShader = compileShader(gl!.FRAGMENT_SHADER, fragmentSource);
      if (!vertexShader || !fragmentShader) return null;

      const program = gl!.createProgram();
      if (!program) return null;
      gl!.attachShader(program, vertexShader);
      gl!.attachShader(program, fragmentShader);
      gl!.linkProgram(program);

      if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
        console.error(gl!.getProgramInfoLog(program));
        return null;
      }
      return program;
    }

    const baseVertexShader = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const displayShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float uIntensity;

      void main () {
        vec3 color = texture2D(uTexture, vUv).rgb;
        color = pow(color * uIntensity, vec3(1.0 / 2.2));
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const splatShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;

      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
      }
    `;

    const divergenceShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const pressureShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradientSubtractShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    const displayProgram = createProgram(baseVertexShader, displayShader);
    const splatProgram = createProgram(baseVertexShader, splatShader);
    const advectionProgram = createProgram(baseVertexShader, advectionShader);
    const divergenceProgram = createProgram(baseVertexShader, divergenceShader);
    const pressureProgram = createProgram(baseVertexShader, pressureShader);
    const gradientSubtractProgram = createProgram(baseVertexShader, gradientSubtractShader);

    if (!displayProgram || !splatProgram || !advectionProgram || 
        !divergenceProgram || !pressureProgram || !gradientSubtractProgram) {
      console.error('Failed to create shader programs');
      return;
    }

    const blit = (() => {
      const vertices = new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      return (program: WebGLProgram, target: WebGLFramebuffer | null) => {
        gl.useProgram(program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target);
        const positionLocation = gl.getAttribLocation(program, 'aPosition');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      };
    })();

    function createFBO(w: number, h: number) {
      const texture = gl!.createTexture();
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, w, h, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null);

      const fbo = gl!.createFramebuffer();
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        attach: (id: number) => {
          gl!.activeTexture(gl!.TEXTURE0 + id);
          gl!.bindTexture(gl!.TEXTURE_2D, texture);
          return id;
        }
      };
    }

    function createDoubleFBO(w: number, h: number) {
      let fbo1 = createFBO(w, h);
      let fbo2 = createFBO(w, h);

      return {
        get read() { return fbo1; },
        get write() { return fbo2; },
        swap() { const temp = fbo1; fbo1 = fbo2; fbo2 = temp; }
      };
    }

    let simWidth = 128;
    let simHeight = 128;
    let dyeWidth = 512;
    let dyeHeight = 512;

    function resizeCanvas() {
      const displayWidth = canvas!.clientWidth;
      const displayHeight = canvas!.clientHeight;
      
      if (canvas!.width !== displayWidth || canvas!.height !== displayHeight) {
        canvas!.width = displayWidth;
        canvas!.height = displayHeight;
      }

      const aspectRatio = displayWidth / displayHeight;
      simHeight = 128;
      simWidth = Math.round(simHeight * aspectRatio);
      dyeHeight = 512;
      dyeWidth = Math.round(dyeHeight * aspectRatio);
    }

    resizeCanvas();

    let velocity = createDoubleFBO(simWidth, simHeight);
    let dye = createDoubleFBO(dyeWidth, dyeHeight);
    let divergenceFBO = createFBO(simWidth, simHeight);
    let pressure = createDoubleFBO(simWidth, simHeight);

    function splat(x: number, y: number, dx: number, dy: number, color: { r: number, g: number, b: number }) {
      gl!.useProgram(splatProgram!);
      gl!.uniform1i(gl!.getUniformLocation(splatProgram!, 'uTarget'), velocity.read.attach(0));
      gl!.uniform1f(gl!.getUniformLocation(splatProgram!, 'aspectRatio'), canvas!.width / canvas!.height);
      gl!.uniform2f(gl!.getUniformLocation(splatProgram!, 'point'), x / canvas!.width, 1.0 - y / canvas!.height);
      gl!.uniform3f(gl!.getUniformLocation(splatProgram!, 'color'), dx, -dy, 0);
      gl!.uniform1f(gl!.getUniformLocation(splatProgram!, 'radius'), 0.0001);
      blit(splatProgram!, velocity.write.fbo);
      velocity.swap();

      gl!.uniform1i(gl!.getUniformLocation(splatProgram!, 'uTarget'), dye.read.attach(0));
      gl!.uniform3f(gl!.getUniformLocation(splatProgram!, 'color'), color.r * 0.3, color.g * 0.3, color.b * 0.3);
      blit(splatProgram!, dye.write.fbo);
      dye.swap();
    }

    function step(dt: number) {
      const texelSize = [1.0 / simWidth, 1.0 / simHeight];

      gl!.useProgram(advectionProgram!);
      gl!.uniform2f(gl!.getUniformLocation(advectionProgram!, 'texelSize'), texelSize[0], texelSize[1]);
      gl!.uniform1i(gl!.getUniformLocation(advectionProgram!, 'uVelocity'), velocity.read.attach(0));
      gl!.uniform1i(gl!.getUniformLocation(advectionProgram!, 'uSource'), velocity.read.attach(0));
      gl!.uniform1f(gl!.getUniformLocation(advectionProgram!, 'dt'), dt);
      gl!.uniform1f(gl!.getUniformLocation(advectionProgram!, 'dissipation'), 0.99);
      blit(advectionProgram!, velocity.write.fbo);
      velocity.swap();

      gl!.uniform2f(gl!.getUniformLocation(advectionProgram!, 'texelSize'), 1.0 / dyeWidth, 1.0 / dyeHeight);
      gl!.uniform1i(gl!.getUniformLocation(advectionProgram!, 'uVelocity'), velocity.read.attach(0));
      gl!.uniform1i(gl!.getUniformLocation(advectionProgram!, 'uSource'), dye.read.attach(1));
      gl!.uniform1f(gl!.getUniformLocation(advectionProgram!, 'dissipation'), 0.98);
      blit(advectionProgram!, dye.write.fbo);
      dye.swap();

      gl!.useProgram(divergenceProgram!);
      gl!.uniform2f(gl!.getUniformLocation(divergenceProgram!, 'texelSize'), texelSize[0], texelSize[1]);
      gl!.uniform1i(gl!.getUniformLocation(divergenceProgram!, 'uVelocity'), velocity.read.attach(0));
      blit(divergenceProgram!, divergenceFBO.fbo);

      gl!.useProgram(pressureProgram!);
      gl!.uniform2f(gl!.getUniformLocation(pressureProgram!, 'texelSize'), texelSize[0], texelSize[1]);
      gl!.uniform1i(gl!.getUniformLocation(pressureProgram!, 'uDivergence'), divergenceFBO.attach(0));
      for (let i = 0; i < 20; i++) {
        gl!.uniform1i(gl!.getUniformLocation(pressureProgram!, 'uPressure'), pressure.read.attach(1));
        blit(pressureProgram!, pressure.write.fbo);
        pressure.swap();
      }

      gl!.useProgram(gradientSubtractProgram!);
      gl!.uniform2f(gl!.getUniformLocation(gradientSubtractProgram!, 'texelSize'), texelSize[0], texelSize[1]);
      gl!.uniform1i(gl!.getUniformLocation(gradientSubtractProgram!, 'uPressure'), pressure.read.attach(0));
      gl!.uniform1i(gl!.getUniformLocation(gradientSubtractProgram!, 'uVelocity'), velocity.read.attach(1));
      blit(gradientSubtractProgram!, velocity.write.fbo);
      velocity.swap();
    }

    function render() {
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.useProgram(displayProgram!);
      gl!.uniform1i(gl!.getUniformLocation(displayProgram!, 'uTexture'), dye.read.attach(0));
      gl!.uniform1f(gl!.getUniformLocation(displayProgram!, 'uIntensity'), intensity * 3);
      blit(displayProgram!, null);
    }

    let animationId: number;
    const colorConfig = getColorConfig();
    let lastSplatTime = 0;

    function update(time: number) {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.016);
      lastTimeRef.current = time;

      resizeCanvas();

      if (pointerRef.current.down || (pointerRef.current.dx !== 0 || pointerRef.current.dy !== 0)) {
        splat(
          pointerRef.current.x, 
          pointerRef.current.y, 
          pointerRef.current.dx * 10, 
          pointerRef.current.dy * 10, 
          colorConfig
        );
        pointerRef.current.dx = 0;
        pointerRef.current.dy = 0;
      }

      if (time - lastSplatTime > 100) {
        const x = Math.random() * canvas!.width;
        const y = Math.random() * canvas!.height;
        const dx = (Math.random() - 0.5) * 50;
        const dy = (Math.random() - 0.5) * 50;
        const randomColor = {
          r: colorConfig.r + (Math.random() - 0.5) * 0.2,
          g: colorConfig.g + (Math.random() - 0.5) * 0.2,
          b: colorConfig.b + (Math.random() - 0.5) * 0.2,
        };
        splat(x, y, dx, dy, randomColor);
        lastSplatTime = time;
      }

      step(dt);
      render();

      animationId = requestAnimationFrame(update);
    }

    animationId = requestAnimationFrame(update);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointerRef.current.dx = x - pointerRef.current.x;
      pointerRef.current.dy = y - pointerRef.current.y;
      pointerRef.current.x = x;
      pointerRef.current.y = y;
    };

    const handlePointerDown = () => { pointerRef.current.down = true; };
    const handlePointerUp = () => { pointerRef.current.down = false; };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [colorScheme, intensity, getColorConfig]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-full ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
}
