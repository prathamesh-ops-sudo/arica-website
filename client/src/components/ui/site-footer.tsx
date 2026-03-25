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
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[30rem] sm:min-h-[35rem] md:min-h-[40rem] py-20">
        <div className="flex gap-8">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
            >
              <img
                src={link.icon}
                alt={link.label}
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain invert opacity-70"
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
