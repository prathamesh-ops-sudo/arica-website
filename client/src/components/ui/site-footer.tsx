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
    <footer className="border-t border-border bg-background mt-20 relative overflow-hidden">
      {/* Large ARICA TECH background text */}
      <div className="min-h-[30rem] sm:min-h-[35rem] md:min-h-[40rem] relative flex flex-col items-center justify-center">
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="bg-gradient-to-b from-foreground/20 via-foreground/10 to-transparent bg-clip-text text-transparent font-extrabold tracking-tighter text-center leading-none"
            style={{
              fontFamily: "'Alfa Slab One', serif",
              fontSize: "clamp(3rem, 14vw, 12rem)",
            }}
          >
            ARICA TECH
          </span>
        </div>

        {/* Social icons centered on top */}
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
      <div className="border-t border-border px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Arica Tech. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
