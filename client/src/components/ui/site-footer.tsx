export function SiteFooter() {
  const socialLinks = [
    {
      icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
      href: "https://www.linkedin.com/company/aricatech",
      label: "LinkedIn",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/732/732200.png",
      href: "mailto:contact@aricatech.com",
      label: "Email",
    },
  ];

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

        {/* Social icons above ARICA text */}
        <div className="relative z-10 flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300"
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              aria-label={link.label}
            >
              <img
                src={link.icon}
                alt={link.label}
                className="w-5 h-5 object-contain invert opacity-70"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Copyright bar */}
      <div className="px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Arica Tech. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
