const links = [
  { href: "#szolgaltatasok", label: "Szolgáltatások" },
  { href: "#referenciak", label: "Referenciák" },
  { href: "#csapat", label: "Csapat" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
      <nav
        aria-label="Fő navigáció"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8"
      >
        <a
          href="#top"
          className="font-display text-lg font-semibold tracking-tight text-paper"
        >
          Forrás Stúdió
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-sans text-sm text-paper/70 transition-colors hover:text-paper"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#cta"
          className="whitespace-nowrap rounded-md bg-amber px-4 py-2 font-sans text-sm font-semibold text-ink transition-colors hover:bg-amber-dark"
        >
          Visszahívást kérek
        </a>
      </nav>
    </header>
  );
}
