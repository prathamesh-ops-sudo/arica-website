export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-background">
      {/* Large ARICA background text with gradient */}
      <div className="relative flex flex-col items-center justify-center" style={{ minHeight: "clamp(14rem, 25vw, 22rem)" }}>
        {/* Full-width ARICA text using SVG with gradient fade */}
        <div className="absolute inset-0 flex items-end pointer-events-none select-none" aria-hidden="true">
          <svg
            viewBox="0 -100 500 200"
            className="w-full h-auto block"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="arica-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.1" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <text
              x="250"
              y="85"
              textAnchor="middle"
              fill="url(#arica-gradient)"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 900,
                fontSize: "120px",
                letterSpacing: "-0.05em",
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
