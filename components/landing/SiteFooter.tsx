const FOOTER_LINKS = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Support", href: "#" },
  { label: "Base Network", href: "https://base.org", external: true },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-surface-high">
      <div className="px-5 md:px-16 py-10 flex flex-col items-center gap-6">
        {/* Nav links */}
        <nav className="flex items-center flex-wrap justify-center gap-x-7 gap-y-3">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="
                font-mono text-[10px] uppercase tracking-[0.14em]
                text-outline/60 hover:text-on-surface
                transition-colors duration-200
              "
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-outline/35">
          © {new Date().getFullYear()} Zora Wrapped
        </p>
      </div>
    </footer>
  );
}
