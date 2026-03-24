import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { isWebGLAvailable } from '@/lib/webgl-utils';

const randomColors = (count: number) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

export function TubesBackground({ 
  children, 
  className,
  enableClickInteraction = true 
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const tubesRef = useRef<any>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasFailed(true);
      return;
    }
    
    mountedRef.current = true;
    let cleanup: (() => void) | undefined;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        const module = await import(
          /* @vite-ignore */
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        );
        const TubesCursor = module.default;

        if (!mountedRef.current) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#42BA90", "#1C2C5A", "#3D70B7"],
            lights: {
              intensity: 150,
              colors: ["#3D70B7", "#42BA90", "#1C2C5A", "#3D70B7"]
            }
          }
        });

        tubesRef.current = app;
        setIsLoaded(true);

        const handleResize = () => {
          if (canvasRef.current && app?.resize) {
            app.resize();
          }
        };

        window.addEventListener('resize', handleResize);
        
        cleanup = () => {
          window.removeEventListener('resize', handleResize);
          if (app?.destroy) {
            app.destroy();
          }
        };

      } catch (error) {
        console.warn("Failed to load TubesCursor:", error);
        setHasFailed(true);
      }
    };

    initTubes();

    return () => {
      mountedRef.current = false;
      if (cleanup) cleanup();
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    
    const colors = randomColors(3);
    const lightsColors = randomColors(4);
    
    if (tubesRef.current.tubes?.setColors) {
      tubesRef.current.tubes.setColors(colors);
    }
    if (tubesRef.current.tubes?.setLightsColors) {
      tubesRef.current.tubes.setLightsColors(lightsColors);
    }
  };

  if (hasFailed) {
    return (
      <div 
        className={cn("relative w-full h-full overflow-hidden", className)}
        data-testid="container-neon-flow-fallback"
      >
        {children && (
          <div className="relative z-10 w-full h-full pointer-events-none">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={cn("relative w-full h-full overflow-hidden", className)}
      onClick={handleClick}
      data-testid="container-neon-flow"
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none' }}
      />
      
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
}

export default TubesBackground;
