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
      {/* Social icons above ARICA text */}
      <div className="flex justify-center gap-6 pt-10 pb-4 relative z-10">
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

      {/* Full-width ARICA text using SVG for edge-to-edge scaling */}
      <div className="w-full pointer-events-none select-none" aria-hidden="true">
        <svg
          viewBox="0 -10 500 120"
          className="w-full h-auto block"
          preserveAspectRatio="xMidYMid meet"
        >
          <text
            x="250"
            y="85"
            textAnchor="middle"
            fill="currentColor"
            className="text-foreground/10"
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

      {/* Copyright bar */}
      <div className="px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Arica Tech. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
