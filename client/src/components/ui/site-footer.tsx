import { useEffect, useRef, useCallback } from "react";

// World map outline encoded as a 1-bit bitmap string (80x40 grid)
// Each row is 80 chars: '1' = land, '0' = ocean
const MAP_DATA = [
  "00000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "00000000000000001111100000000000000000000000000000000000000001111000000000000000",
  "00000001111111111111111100000000000000001111111000000011111111111111100000000000",
  "00000111111111111111111111000000000000011111111100001111111111111111111000000000",
  "00001111111111111111111111100000000001111111111100011111111111111111111100000000",
  "00011111111111111111111111100000000011111111111110111111111111111111111111000000",
  "00111111111111111111111111110000000111111111111111111111111111111111111111100000",
  "01111111111111111111111111110000001111111111111111111111111111111111111111110000",
  "01111111111111111111111111111000011111111111111111111111111111111111111111110000",
  "01111111111111111111111111111000111111111111111111111111111111111111111111111000",
  "00111111111111111111111111111001111111111111111111111111111111111111111111111100",
  "00011111111111111111111111111011111111111111111111111111111111111111111111111100",
  "00001111111111111111111111110011111111111111111111111111111111111111111111111000",
  "00000111111111111111111111100011111111111111111111111111111111111111111111110000",
  "00000011111111111111111111000001111111111111111111111111111111111111111111100000",
  "00000001111111111111111110000001111111111111111111111111111111111111111111000000",
  "00000000011111111111111100000000111111111111111111111111111111111111111110000000",
  "00000000001111111111111000000000011111111111111101111111111111111111111000000000",
  "00000000000111111111110000000000001111111111111000111111111111111100000000000000",
  "00000000000011111111100000000000000111111111110000011111111111110000000000000000",
  "00000000000001111111100000000000000011111111100000001111111111000000000000000000",
  "00000000000001111111000000000000000001111111000000000111111100000000000000000000",
  "00000000000001111111000000000000000001111110000000000011111000000000000000000000",
  "00000000000011111110000000000000000001111100000000000001110000000000000000000000",
  "00000000000011111100000000000000000000111000000000000000000000000000000000000000",
  "00000000000111111000000000000000000000110000000000000000000000000000000000000000",
  "00000000000111110000000000000000000000000000000000000000000000000000000000000000",
  "00000000001111100000000000000000000000000000000000000000000000001111100000000000",
  "00000000001111100000000000000000000000000000000000000000000000111111111000000000",
  "00000000001111000000000000000000000000000000000000000000000001111111111100000000",
  "00000000000111000000000000000000000000000000000000000000000011111111111100000000",
  "00000000000110000000000000000000000000000000000000000000000011111111111000000000",
  "00000000000100000000000000000000000000000000000000000000000001111111110000000000",
  "00000000000000000000000000000000000000000000000000000000000000111111100000000000",
  "00000000000000000000000000000000000000000000000000000000000000011110000000000000",
  "00000000000000000000000000000000000000000000000000000000000000001100000000000000",
  "00000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "00000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "00000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "00000000000000000000000000000000000000000000000000000000000000000000000000000000",
];

const MAP_ROWS = MAP_DATA.length;
const MAP_COLS = MAP_DATA[0].length;

const ASCII_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>/\\|!@#$%^&*-+=~`';:,.?";

function isLand(nx: number, ny: number): boolean {
  const col = Math.floor(nx * MAP_COLS);
  const row = Math.floor(ny * MAP_ROWS);
  if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return false;
  return MAP_DATA[row][col] === "1";
}

// Simple hash for deterministic pseudo-random
function hash(a: number, b: number): number {
  const h = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return h - Math.floor(h);
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

    // Smaller font = denser characters
    const fontSize = Math.max(8, Math.min(11, width / 120));
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.textBaseline = "top";

    const charWidth = fontSize * 0.62;
    const charHeight = fontSize * 1.1;
    const cols = Math.floor(width / charWidth);
    const rows = Math.floor(height / charHeight);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const nx = col / cols;
        const ny = row / rows;

        if (isLand(nx, ny)) {
          // Only skip ~15% of cells for slight variation
          const h = hash(col, row);
          if (h > 0.85) continue;

          const charIndex = Math.floor(hash(col * 3.1, row * 7.3) * ASCII_CHARS.length);
          const char = ASCII_CHARS[charIndex % ASCII_CHARS.length];

          // Coral/salmon reddish color
          const r = 175 + Math.floor(h * 50);
          const g = 75 + Math.floor(h * 25);
          const b = 65 + Math.floor(h * 20);
          const alpha = 0.55 + h * 0.4;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fillText(char, col * charWidth, row * charHeight);
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
      <div className="absolute inset-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Copyright text centered */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center pt-28 sm:pt-36 md:pt-40 px-4">
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
        className="relative z-10 select-none pointer-events-none overflow-hidden mt-8"
        aria-hidden="true"
      >
        <div className="flex justify-center items-end" style={{ height: "200px", overflow: "hidden" }}>
          <span
            className="font-black leading-none whitespace-nowrap"
            style={{
              fontSize: "clamp(8rem, 18vw, 22rem)",
              color: "#2e2e32",
              letterSpacing: "-0.02em",
              transform: "translateY(28%)",
            }}
          >
            GoodFella
          </span>
        </div>
      </div>
    </footer>
  );
}
