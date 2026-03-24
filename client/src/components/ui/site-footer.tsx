import { useEffect, useRef, useCallback } from "react";

// Simplified world map coordinates (longitude, latitude) → canvas positions
// Each continent is a set of rectangular regions that approximate its shape
const CONTINENT_REGIONS = [
  // North America
  { x: 0.05, y: 0.05, w: 0.22, h: 0.35 },
  { x: 0.10, y: 0.10, w: 0.15, h: 0.25 },
  { x: 0.12, y: 0.30, w: 0.10, h: 0.15 },
  // Central America
  { x: 0.13, y: 0.40, w: 0.05, h: 0.12 },
  // South America
  { x: 0.17, y: 0.50, w: 0.12, h: 0.35 },
  { x: 0.19, y: 0.55, w: 0.10, h: 0.30 },
  { x: 0.20, y: 0.70, w: 0.06, h: 0.15 },
  // Europe
  { x: 0.42, y: 0.05, w: 0.12, h: 0.22 },
  { x: 0.44, y: 0.10, w: 0.10, h: 0.18 },
  // Africa
  { x: 0.42, y: 0.28, w: 0.14, h: 0.38 },
  { x: 0.44, y: 0.32, w: 0.12, h: 0.30 },
  { x: 0.46, y: 0.50, w: 0.08, h: 0.15 },
  // Asia
  { x: 0.50, y: 0.02, w: 0.30, h: 0.35 },
  { x: 0.55, y: 0.08, w: 0.25, h: 0.28 },
  { x: 0.60, y: 0.15, w: 0.20, h: 0.20 },
  { x: 0.52, y: 0.25, w: 0.15, h: 0.15 },
  // India
  { x: 0.60, y: 0.30, w: 0.08, h: 0.15 },
  // Southeast Asia
  { x: 0.70, y: 0.35, w: 0.10, h: 0.15 },
  // Australia
  { x: 0.75, y: 0.60, w: 0.14, h: 0.18 },
  { x: 0.77, y: 0.62, w: 0.12, h: 0.14 },
  // Japan/Korea
  { x: 0.78, y: 0.15, w: 0.05, h: 0.12 },
  // Indonesia
  { x: 0.72, y: 0.48, w: 0.15, h: 0.06 },
  // Greenland
  { x: 0.28, y: 0.0, w: 0.08, h: 0.10 },
  // UK/Iceland
  { x: 0.38, y: 0.05, w: 0.05, h: 0.08 },
  // Russia far east
  { x: 0.75, y: 0.02, w: 0.12, h: 0.12 },
  // Middle East
  { x: 0.52, y: 0.22, w: 0.10, h: 0.10 },
];

const ASCII_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>/\\|!@#$%^&*-+=~`';:,.?";

function isInContinent(nx: number, ny: number): boolean {
  for (const r of CONTINENT_REGIONS) {
    if (nx >= r.x && nx <= r.x + r.w && ny >= r.y && ny <= r.y + r.h) {
      // Add some organic noise-like edges by using coordinate-based variation
      const edgeX = (nx - r.x) / r.w;
      const edgeY = (ny - r.y) / r.h;
      const edgeDist = Math.min(edgeX, 1 - edgeX, edgeY, 1 - edgeY);
      // Use pseudo-random based on position for consistent organic edges
      const hash = Math.sin(nx * 127.1 + ny * 311.7) * 43758.5453;
      const noise = hash - Math.floor(hash);
      if (edgeDist > 0.05 || noise > 0.4) {
        return true;
      }
    }
  }
  return false;
}

export function SiteFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawAsciiMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const fontSize = Math.max(10, Math.min(14, width / 80));
    ctx.font = `${fontSize}px monospace`;

    const charWidth = fontSize * 0.6;
    const charHeight = fontSize * 1.2;
    const cols = Math.floor(width / charWidth);
    const rows = Math.floor(height / charHeight);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const nx = col / cols;
        const ny = row / rows;

        if (isInContinent(nx, ny)) {
          // Skip some cells for spacing/density variation
          const hash2 = Math.sin(col * 73.2 + row * 197.3) * 43758.5453;
          const density = hash2 - Math.floor(hash2);
          if (density > 0.35) continue;

          const charIndex = Math.floor(
            ((Math.sin(col * 12.9898 + row * 78.233) * 43758.5453) % 1 + 1) % 1 * ASCII_CHARS.length
          );
          const char = ASCII_CHARS[charIndex];

          // Coral/salmon reddish color with slight variation
          const r = 180 + Math.floor(density * 40);
          const g = 80 + Math.floor(density * 30);
          const b = 70 + Math.floor(density * 25);
          const alpha = 0.5 + density * 0.35;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fillText(char, col * charWidth, row * charHeight + fontSize);
        }
      }
    }
  }, []);

  useEffect(() => {
    drawAsciiMap();
    const handleResize = () => drawAsciiMap();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawAsciiMap]);

  return (
    <footer className="relative bg-[#1a1a1e] overflow-hidden" style={{ minHeight: "420px" }}>
      {/* ASCII world map canvas */}
      <div className="absolute inset-0" style={{ top: 0, bottom: "30%" }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.9 }}
        />
      </div>

      {/* Copyright text centered */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center pt-24 sm:pt-32 md:pt-36 px-4">
        <p className="text-sm text-[#9a9a9a] tracking-wide">© 2026</p>
        <p className="text-sm text-[#9a9a9a] tracking-wide mt-1">
          Good Fella Studio GmbH.
        </p>
        <p className="text-sm text-[#9a9a9a] tracking-wide mt-1">
          Let the Fellas handle it.
        </p>
      </div>

      {/* Large "GoodFella" text at bottom */}
      <div
        className="relative z-10 select-none pointer-events-none overflow-hidden"
        aria-hidden="true"
        style={{ marginTop: "auto" }}
      >
        <div className="flex justify-center items-end" style={{ height: "180px", overflow: "hidden" }}>
          <span
            className="font-black leading-none whitespace-nowrap"
            style={{
              fontSize: "clamp(8rem, 18vw, 22rem)",
              color: "#2a2a2e",
              letterSpacing: "-0.02em",
              transform: "translateY(25%)",
            }}
          >
            GoodFella
          </span>
        </div>
      </div>
    </footer>
  );
}
