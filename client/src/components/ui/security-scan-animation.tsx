"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ScanLine {
  id: number;
  y: number;
  opacity: number;
}

interface DataPoint {
  x: number;
  y: number;
  type: "safe" | "warning" | "critical";
  pulseDelay: number;
}

export function SecurityScanAnimation() {
  const [scanLines, setScanLines] = useState<ScanLine[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [vulnerabilities, setVulnerabilities] = useState({ critical: 0, warning: 0, safe: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const points: DataPoint[] = [];
    for (let i = 0; i < 25; i++) {
      const rand = Math.random();
      points.push({
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        type: rand > 0.85 ? "critical" : rand > 0.6 ? "warning" : "safe",
        pulseDelay: Math.random() * 2,
      });
    }
    setDataPoints(points);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 0.5;
        return next > 100 ? 0 : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const visiblePoints = dataPoints.filter((p) => p.y <= scanProgress);
    setVulnerabilities({
      critical: visiblePoints.filter((p) => p.type === "critical").length,
      warning: visiblePoints.filter((p) => p.type === "warning").length,
      safe: visiblePoints.filter((p) => p.type === "safe").length,
    });
  }, [scanProgress, dataPoints]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square rounded-2xl border border-white/10 bg-black/80 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 212, 255, 0)" />
            <stop offset="50%" stopColor="rgba(0, 212, 255, 0.5)" />
            <stop offset="100%" stopColor="rgba(0, 212, 255, 0)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x="0"
          y={scanProgress - 5}
          width="100"
          height="10"
          fill="url(#scanGradient)"
          className="transition-all"
        />

        <line
          x1="0"
          y1={scanProgress}
          x2="100"
          y2={scanProgress}
          stroke="rgba(0, 212, 255, 0.8)"
          strokeWidth="0.3"
          filter="url(#glow)"
        />

        {dataPoints.map((point, i) => {
          const isVisible = point.y <= scanProgress;
          const color =
            point.type === "critical"
              ? "#7a1214"
              : point.type === "warning"
              ? "#f59e0b"
              : "#22c55e";

          return (
            <g key={i}>
              {isVisible && (
                <>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="1.5"
                    fill={color}
                    opacity="0.8"
                  >
                    <animate
                      attributeName="r"
                      values="1.5;2.5;1.5"
                      dur="2s"
                      begin={`${point.pulseDelay}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.8;0.4;0.8"
                      dur="2s"
                      begin={`${point.pulseDelay}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill="none"
                    stroke={color}
                    strokeWidth="0.2"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="r"
                      values="3;5;3"
                      dur="2s"
                      begin={`${point.pulseDelay}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.4;0;0.4"
                      dur="2s"
                      begin={`${point.pulseDelay}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}
            </g>
          );
        })}

        {dataPoints.map((point, i) => {
          const isVisible = point.y <= scanProgress;
          if (!isVisible) return null;
          
          const connections = dataPoints
            .filter((p, j) => j !== i && p.y <= scanProgress)
            .filter((p) => {
              const dist = Math.sqrt(Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2));
              return dist < 25;
            })
            .slice(0, 2);

          return connections.map((conn, j) => (
            <line
              key={`${i}-${j}`}
              x1={point.x}
              y1={point.y}
              x2={conn.x}
              y2={conn.y}
              stroke="rgba(0, 212, 255, 0.2)"
              strokeWidth="0.2"
            />
          ));
        })}
      </svg>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-red-400">{vulnerabilities.critical} Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-yellow-400">{vulnerabilities.warning} Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-green-400">{vulnerabilities.safe} Safe</span>
            </div>
          </div>
          <div className="text-primary">
            {Math.round(scanProgress)}%
          </div>
        </div>

        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            style={{ width: `${scanProgress}%` }}
          />
        </div>
      </div>

      <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 border border-white/10">
        <div className="flex items-center gap-2 text-[10px] font-mono text-primary">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          SCANNING
        </div>
      </div>
    </div>
  );
}
