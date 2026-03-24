import { useMemo, useState, useEffect } from "react";

type ParticleVariant = "dots" | "network" | "data";

interface AmbientParticlesProps {
  variant?: ParticleVariant;
  count?: number;
  color?: string;
  opacity?: number;
}

const MOBILE_BREAKPOINT = 768;

export function AmbientParticles({
  variant = "dots",
  count = 20,
  color = "#3D70B7",
  opacity = 0.12,
}: AmbientParticlesProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const effectiveCount = isMobile ? Math.floor(count * 0.4) : count;

  const particles = useMemo(() => {
    return Array.from({ length: effectiveCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: variant === "data" ? 2 + Math.random() * 3 : 3 + Math.random() * 4,
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 8,
    }));
  }, [effectiveCount, variant]);

  const networkLines = useMemo(() => {
    if (variant !== "network") return [];
    return Array.from({ length: Math.floor(effectiveCount / 2) }, (_, i) => ({
      id: i,
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 15 + Math.random() * 10,
    }));
  }, [effectiveCount, variant]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
        
        @keyframes floatAround {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translate(30px, -50px);
            opacity: 0;
          }
        }
        
        @keyframes networkPulse {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes dataDrift {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-60vh) scale(0.5);
            opacity: 0;
          }
        }
        
        .particle-dot {
          position: absolute;
          border-radius: 50%;
          animation: floatUp linear infinite;
        }
        
        .particle-network-dot {
          position: absolute;
          border-radius: 50%;
          animation: floatAround ease-in-out infinite alternate;
        }
        
        .particle-network-line {
          position: absolute;
          height: 1px;
          transform-origin: left center;
          animation: networkPulse ease-in-out infinite;
        }
        
        .particle-data {
          position: absolute;
          border-radius: 50%;
          animation: dataDrift linear infinite;
        }
      `}</style>

      {variant === "dots" &&
        particles.map((p) => (
          <div
            key={p.id}
            className="particle-dot"
            style={{
              left: `${p.left}%`,
              top: `${100 + p.top * 0.2}%`,
              width: p.size,
              height: p.size,
              backgroundColor: color,
              opacity: opacity,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}

      {variant === "network" && (
        <>
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle-network-dot"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                backgroundColor: color,
                opacity: opacity,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
          {networkLines.map((line) => {
            const dx = line.x2 - line.x1;
            const dy = line.y2 - line.y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            return (
              <div
                key={`line-${line.id}`}
                className="particle-network-line"
                style={{
                  left: `${line.x1}%`,
                  top: `${line.y1}%`,
                  width: `${length}%`,
                  backgroundColor: color,
                  opacity: opacity * 0.5,
                  transform: `rotate(${angle}deg)`,
                  animationDelay: `${line.delay}s`,
                  animationDuration: `${line.duration}s`,
                }}
              />
            );
          })}
        </>
      )}

      {variant === "data" &&
        particles.map((p) => (
          <div
            key={p.id}
            className="particle-data"
            style={{
              left: `${p.left}%`,
              top: `${80 + p.top * 0.3}%`,
              width: p.size,
              height: p.size,
              backgroundColor: color,
              opacity: opacity,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
    </div>
  );
}
