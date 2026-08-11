import { Reveal } from "@/components/Reveal";
import { CaseStudyCard } from "@/components/CaseStudyCard";

type Pillar = "sales" | "community" | "content" | "both" | "none";

const pillarLabels: Record<Pillar, string> = {
  sales: "Webalkalmazás-fejlesztés",
  community: "Közösségi & tagsági platform",
  content: "Tartalmi platform & automatizáció",
  both: "Webalkalmazás-fejlesztés + Közösségi platform",
  none: "Bemutatkozó weboldal",
};

const pillarColors: Record<Pillar, string> = {
  sales: "border-spring/40 text-spring",
  community: "border-brook/40 text-brook",
  content: "border-amber/30 text-amber",
  both: "border-amber/50 text-amber-dark",
  none: "border-ink/20 text-ink/50",
};

const caseStudies = [
  {
    name: "ECO Portal",
    domain: "portal.ecokozosseg.hu",
    href: "/esettanulmanyok/eco-portal",
    internal: true,
    description:
      "Zárt közösségi platform: tagság, csoportok, receptek, képzések, szakértői értékelések és jelvényrendszer egy helyen.",
    pillar: "community" as Pillar,
    modules: ["Jogosultságkezelés", "Tagi felület"],
  },
  {
    name: "Forge Gym",
    domain: "Demo projekt",
    href: "/esettanulmanyok/forge-gym",
    internal: true,
    demo: true,
    description:
      "Teremedző stúdió tagsági és bérletkezelő platformja: QR-kódos beléptetés, valós Stripe bankkártyás fizetés és staff beléptető felület.",
    pillar: "sales" as Pillar,
    modules: ["Stripe fizetési integráció", "QR-kódos beléptetés"],
  },
  {
    name: "ECO Weboldal",
    domain: "ecokozosseg.hu",
    href: "https://ecokozosseg.hu",
    description:
      "Statikus, gyors betöltésű bemutató oldal egy önismereti rendszer moduljainak és partnerközpontjainak bemutatására.",
    pillar: "none" as Pillar,
    modules: ["Frontend / megjelenés"],
  },
  {
    name: "Ösvény App by eptestben.hu",
    domain: "eptestben.hu",
    href: "https://eptestben.hu",
    description:
      "Egészség-coaching alkalmazás időpontfoglalással, fizetési integrációval és kvíz-alapú felhasználói úttal.",
    pillar: "sales" as Pillar,
    modules: ["Fizetési kapu integráció", "Felhasználókezelés"],
  },
  {
    name: "Kardos Bálint Okoskonyhája",
    domain: "akardosbalint.hu",
    href: "https://akardosbalint.hu",
    description:
      "Statikusan generált tartalmi oldal blog rovattal, hírlevél-automatizációval és tagsági közösséggel.",
    pillar: "content" as Pillar,
    modules: ["Blog / MDX tartalomkezelés", "Hírlevél-automatizáció"],
  },
];

export function CaseStudies() {
  return (
    <section id="referenciak" className="scroll-mt-20 bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-spring">
            <span className="text-ink/30">{"// "}</span>Referenciák
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Rendszerek, amiket megépítettünk és üzemeltetünk
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {caseStudies.map((project, index) => (
            <CaseStudyCard
              key={project.domain}
              href={project.href}
              internal={project.internal}
              index={index}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {project.name}
                  </h3>
                  {project.demo && (
                    <span className="rounded-full border border-pink/50 bg-pink/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-pink">
                      Demo
                    </span>
                  )}
                </div>
                <span
                  aria-hidden="true"
                  className="mt-1 flex-shrink-0 text-ink/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-spring"
                >
                  {project.internal ? "→" : "↗"}
                </span>
              </div>
              <span className="mt-1 font-mono text-xs text-ink/50">{project.domain}</span>

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

              {project.internal && (
                <span className="mt-4 inline-flex w-fit items-center gap-1.5 font-sans text-sm font-semibold text-amber-dark">
                  Teljes esettanulmány
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              )}
            </CaseStudyCard>
          ))}
        </div>
      </div>
    </section>
  );
}
