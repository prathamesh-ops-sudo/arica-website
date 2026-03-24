import { useEffect, useRef, useCallback } from "react";

const ASCII_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>/\\|!@#$%^&*-+=~`';:,.?";

// Simplified world map SVG path (Mercator-ish projection, viewBox 0 0 1000 500)
const WORLD_MAP_PATH = `
M 150,60 L 160,55 170,50 180,48 195,45 210,42 220,40 230,42 240,48 245,55 250,52 255,48 260,45 270,42 275,45 280,50 275,55 270,58 265,62 260,68 255,72 250,78 248,85 245,90 240,95 235,100 230,105 228,110 225,115 222,120 218,125 215,130 210,135 208,140 205,145 200,148 195,152 190,155 185,158 180,160 175,162 172,158 170,155 168,150 165,145 162,140 158,135 155,130 150,128 145,125 140,122 135,118 130,112 128,108 125,102 122,98 120,92 118,88 115,82 112,78 110,72 108,68 106,65 110,62 115,60 120,58 125,56 130,55 135,56 140,58 145,60 150,60 Z
M 165,170 L 170,175 175,180 178,190 180,200 182,210 185,220 188,230 192,240 195,248 198,255 200,262 202,268 205,275 208,282 210,290 212,298 215,305 216,312 218,318 220,325 218,332 215,338 212,342 208,348 205,352 200,358 195,362 190,365 185,368 180,372 178,378 175,382 172,388 168,392 165,395 162,390 160,385 158,378 155,370 153,362 152,355 150,348 148,340 147,332 146,325 145,318 144,310 143,302 142,295 140,288 138,280 137,272 136,265 135,258 134,250 135,242 136,235 138,228 140,220 142,212 145,205 148,198 150,192 152,185 155,180 158,175 162,172 165,170 Z
M 440,65 L 445,60 450,58 455,55 460,52 465,50 470,48 475,50 480,52 485,55 490,58 495,62 498,65 500,68 502,72 505,75 508,78 510,82 508,85 505,88 502,90 498,92 495,95 490,98 485,100 480,102 475,100 470,98 465,95 462,92 458,88 455,85 452,82 450,78 448,75 445,72 442,68 440,65 Z
M 455,108 L 460,105 468,102 475,100 482,98 490,100 495,105 498,110 500,115 502,120 505,128 508,135 510,142 512,150 514,158 515,165 516,172 518,180 518,188 516,195 514,202 512,208 510,215 508,220 505,225 502,230 498,235 494,240 490,244 486,248 482,252 478,255 475,258 470,260 465,262 460,260 458,255 456,250 454,245 452,238 450,230 448,222 446,215 444,208 442,200 440,192 438,185 438,178 440,170 442,162 444,155 446,148 448,140 450,132 452,125 453,118 454,112 455,108 Z
M 510,42 L 520,38 530,35 545,32 560,30 575,28 590,25 605,23 620,22 640,22 660,23 680,25 700,28 715,30 730,32 745,35 755,38 765,42 775,45 780,48 785,52 790,55 795,58 798,62 800,65 802,68 805,72 808,78 810,85 808,90 805,95 802,98 798,102 795,105 790,108 785,112 780,115 775,118 770,120 765,122 760,125 755,128 750,130 745,132 740,134 735,136 730,138 725,140 720,142 715,140 710,138 705,135 700,132 695,130 690,128 685,125 680,122 675,120 670,118 665,115 660,112 655,110 650,108 645,106 640,105 635,106 630,108 625,110 620,112 615,115 610,118 605,120 600,118 595,115 590,112 585,110 580,108 575,105 570,102 565,98 560,95 555,92 550,88 545,85 540,82 535,78 530,72 525,68 520,62 515,55 512,48 510,42 Z
M 608,130 L 615,135 620,140 625,145 628,150 630,155 628,160 625,165 620,168 615,170 610,168 605,165 600,160 598,155 596,150 598,145 600,140 604,135 608,130 Z
M 700,150 L 710,148 720,145 730,148 735,152 738,158 736,165 730,170 722,172 715,170 708,168 702,165 698,160 696,155 698,150 700,150 Z
M 740,300 L 750,295 760,292 775,290 790,288 805,290 815,295 822,302 828,310 832,318 835,328 832,338 828,345 822,352 815,358 808,362 800,365 790,368 780,370 770,368 760,365 752,360 746,355 742,348 738,340 736,332 735,322 736,315 738,308 740,300 Z
`;

function createMapSampler(width: number, height: number): ImageData | null {
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  // Scale path to fill canvas
  const pathScaleX = width / 1000;
  const pathScaleY = height / 500;

  ctx.fillStyle = "#fff";
  ctx.setTransform(pathScaleX, 0, 0, pathScaleY, 0, 0);

  const path = new Path2D(WORLD_MAP_PATH);
  ctx.fill(path);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return ctx.getImageData(0, 0, width, height);
}

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

    // Generate map sampler at a reasonable resolution
    const sampleW = 400;
    const sampleH = 200;
    const mapData = createMapSampler(sampleW, sampleH);
    if (!mapData) return;

    const fontSize = Math.max(8, Math.min(11, width / 120));
    ctx.font = `${fontSize}px "Courier New", monospace`;
    ctx.textBaseline = "top";

    const charWidth = fontSize * 0.6;
    const charHeight = fontSize * 1.05;
    const cols = Math.floor(width / charWidth);
    const rows = Math.floor(height / charHeight);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const nx = col / cols;
        const ny = row / rows;

        // Sample the map
        const sx = Math.floor(nx * sampleW);
        const sy = Math.floor(ny * sampleH);
        const idx = (sy * sampleW + sx) * 4;
        const isLand = mapData.data[idx] > 128;

        if (isLand) {
          const h = hash(col, row);
          if (h > 0.88) continue; // skip ~12% for slight variation

          const charIndex = Math.floor(hash(col * 3.1, row * 7.3) * ASCII_CHARS.length);
          const char = ASCII_CHARS[charIndex % ASCII_CHARS.length];

          const r = 170 + Math.floor(h * 55);
          const g = 72 + Math.floor(h * 28);
          const b = 62 + Math.floor(h * 22);
          const alpha = 0.5 + h * 0.45;

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
