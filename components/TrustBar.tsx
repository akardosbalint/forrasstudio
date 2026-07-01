const references = [
  { name: "ECO Portal", domain: "portal.ecokozosseg.hu", href: "https://portal.ecokozosseg.hu" },
  { name: "ECO Weboldal", domain: "ecokozosseg.hu", href: "https://ecokozosseg.hu" },
  { name: "Osveny App", domain: "osveny.app", href: "https://osveny.app" },
  { name: "Purnima Vision", domain: "purnima.vision", href: "https://purnima.vision" },
];

export function TrustBar() {
  return (
    <section className="border-y border-paper-3 bg-paper-2">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <p className="mb-5 text-center font-mono text-xs uppercase tracking-[0.14em] text-ink/50">
          Ezeket a rendszereket mi építettük és üzemeltetjük
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {references.map((ref) => (
            <li key={ref.domain}>
              <a
                href={ref.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm font-medium text-ink/70 underline decoration-ink/20 decoration-1 underline-offset-4 transition-colors hover:text-ink hover:decoration-spring"
              >
                {ref.domain}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
