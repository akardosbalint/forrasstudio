type Pillar = "sales" | "community" | "both" | "none";

const pillarLabels: Record<Pillar, string> = {
  sales: "Sales System Engineering",
  community: "Community Platform Building",
  both: "Sales System Engineering + Community Platform Building",
  none: "Bemutatkozó weboldal",
};

const pillarColors: Record<Pillar, string> = {
  sales: "border-spring/40 text-spring",
  community: "border-brook/40 text-brook",
  both: "border-amber/50 text-amber-dark",
  none: "border-ink/20 text-ink/50",
};

const caseStudies = [
  {
    name: "ECO Portal",
    domain: "portal.ecokozosseg.hu",
    href: "https://portal.ecokozosseg.hu",
    description: "Zárt, belsős közösségi felület a közösség tagjainak.",
    pillar: "community" as Pillar,
    modules: ["Jogosultságkezelés", "Tagi felület"],
  },
  {
    name: "ECO Weboldal",
    domain: "ecokozosseg.hu",
    href: "https://ecokozosseg.hu",
    description: "Egyszerű, letisztult frontend weboldal.",
    pillar: "none" as Pillar,
    modules: ["Frontend / megjelenés"],
  },
  {
    name: "Ösvény App by eptestben.hu",
    domain: "eptestben.hu",
    href: "https://eptestben.hu",
    description: "Egészség-coaching alkalmazás.",
    pillar: "sales" as Pillar,
    modules: ["Fizetési kapu integráció", "Felhasználókezelés"],
  },
  {
    name: "Purnima Vision",
    domain: "purnima.vision",
    href: "https://purnima.vision",
    description: "Vedikus asztrológiai weboldal.",
    pillar: "both" as Pillar,
    modules: ["Időpontfoglalás", "Belsős CRM rendszer"],
  },
];

export function CaseStudies() {
  return (
    <section id="referenciak" className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-spring">
          Referenciák
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Rendszerek, amiket megépítettünk és üzemeltetünk
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {caseStudies.map((project) => (
            <a
              key={project.domain}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-paper-3 bg-white/50 p-6 transition-colors hover:border-spring/50 sm:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {project.name}
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-1 text-ink/30 transition-colors group-hover:text-spring"
                >
                  ↗
                </span>
              </div>
              <span className="mt-1 font-mono text-xs text-ink/50">
                {project.domain}
              </span>

              <p className="mt-3 leading-relaxed text-ink/70">{project.description}</p>

              <span
                className={`mt-4 inline-block w-fit rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide ${pillarColors[project.pillar]}`}
              >
                {pillarLabels[project.pillar]}
              </span>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.modules.map((module) => (
                  <span
                    key={module}
                    className="rounded-full bg-paper-2 px-3 py-1 font-mono text-[11px] text-ink/60"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
