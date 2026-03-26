export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-background">
      {/* Large ARICA background text with gradient */}
      <div className="relative flex items-end justify-center overflow-hidden" style={{ height: "clamp(10rem, 22vw, 20rem)" }}>
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none select-none" aria-hidden="true">
          <span
            className="block text-center leading-none w-full"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "21vw",
              letterSpacing: "-0.04em",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              whiteSpace: "nowrap",
              lineHeight: "0.85",
              transform: "translateY(15%)",
            }}
          >
            ARICA
          </span>
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
