export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-background">
      {/* Large ARICA background text with gradient */}
      <div className="relative flex items-end justify-center overflow-hidden" style={{ height: "clamp(10rem, 22vw, 20rem)" }}>
        {/* Full-width ARICA text using SVG to guarantee edge-to-edge coverage on all screens */}
        <div className="absolute inset-0 flex items-end pointer-events-none select-none" aria-hidden="true">
          <svg
            viewBox="0 0 500 120"
            className="w-full h-auto block"
            preserveAspectRatio="xMidYMax meet"
          >
            <defs>
              <linearGradient id="footer-arica-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0.15" />
                <stop offset="50%" stopColor="white" stopOpacity="0.05" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            <text
              x="250"
              y="110"
              textAnchor="middle"
              fill="url(#footer-arica-grad)"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 900,
                fontSize: "160px",
                letterSpacing: "-0.04em",
              }}
            >
              ARICA
            </text>
          </svg>
        </div>
      </div>

      {/* Tagline + Copyright bar */}
      <div className="px-6 py-4 space-y-1">
        <p className="text-center text-xs text-muted-foreground/60 italic">
          Built to protect, investigate, and comply.
        </p>
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Arica Tech Security LLP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
