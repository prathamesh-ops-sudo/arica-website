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
    <footer className="border-t border-border bg-background mt-20">
      <div className="max-w-7xl mx-auto flex items-center justify-center py-10">
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300"
              target="_blank"
              rel="noopener noreferrer"
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
      <div className="border-t border-border px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Arica Tech. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
