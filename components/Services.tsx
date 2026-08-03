import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";

type IconName = "sales" | "community" | "ai" | "system" | "ops";

function ServiceIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    sales: (
      <>
        <rect x="5" y="7" width="22" height="18" rx="2.5" />
        <path d="M5 13h22" />
        <path d="M11 19h4" />
      </>
    ),
    community: (
      <>
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="21" cy="15" r="3.5" />
        <path d="M6 25c0-4 2.7-6.5 6-6.5s6 2.5 6 6.5" />
        <path d="M17.5 25c0-3-1.6-5-4-5.8" />
      </>
    ),
    ai: (
      <>
        <path d="M7 16a9 9 0 0 1 15-6.5" />
        <path d="M22 6v4.5h-4.5" />
        <path d="M25 16a9 9 0 0 1-15 6.5" />
        <path d="M10 26v-4.5h4.5" />
      </>
    ),
    system: (
      <>
        <circle cx="16" cy="16" r="3.2" />
        <circle cx="5.5" cy="6" r="2.2" />
        <circle cx="26.5" cy="6" r="2.2" />
        <circle cx="5.5" cy="26" r="2.2" />
        <circle cx="26.5" cy="26" r="2.2" />
        <path d="M7.3 7.6 13.7 13.8" />
        <path d="M24.7 7.6 18.3 13.8" />
        <path d="M7.3 24.4 13.7 18.2" />
        <path d="M24.7 24.4 18.3 18.2" />
      </>
    ),
    ops: (
      <>
        <path d="M16 6v6" />
        <path d="M16 20v6" />
        <path d="M6 16h6" />
        <path d="M20 16h6" />
        <circle cx="16" cy="16" r="5.5" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-8 w-8 text-spring transition-transform duration-300 group-hover:scale-110"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

const cardClasses =
  "group h-full rounded-xl border border-paper-3 bg-white/50 p-6 transition-[border-color,background-color,box-shadow] duration-300 hover:border-spring/50 hover:bg-white/80 hover:shadow-2xl hover:shadow-spring/20 sm:p-7";

const pillars = [
  {
    icon: "sales" as const,
    eyebrow: "1. pillér",
    title: "Webalkalmazás-fejlesztés",
    description:
      "Modern, típusbiztos webalkalmazások React/Next.js és TypeScript alapokon, AI-asszisztált fejlesztéssel — időpontfoglalás, fizetési integráció és ügyfél-CRM, a vállalkozásod folyamataira szabva, gyorsabban és olcsóbban, mint egy hagyományos ügynökségnél.",
  },
  {
    icon: "community" as const,
    eyebrow: "2. pillér",
    title: "Közösségi & tagsági platformok",
    description:
      "Zárt, jogosultságkezelt tagi felületek azoknak, akik saját közösséget vagy tagságot építenek — biztonságos beléptetéssel, szerepkör-alapú hozzáféréssel és tagsági szintekkel.",
  },
  {
    icon: "ai" as const,
    eyebrow: "3. pillér",
    title: "Automatizáció & AI",
    description:
      "Hírlevél- és e-mail-automatizáció, admin dashboardok, intelligens riportok és AI-alapú funkciók — ugyanazok az eszközök, amikkel mi magunk is dolgozunk — veszik le rólad az ismétlődő adminisztrációt, és jelzik, mikor van szükség rád személyesen.",
  },
];

const capabilities = [
  {
    icon: "system" as const,
    title: "Teljes rendszer egy kézből",
    description:
      "A weboldal, a foglalás, a fizetés, a CRM, a beléptetés és az automatizáció nem külön projektek, hanem egymással összehangolt modulok — egy csapat tervezi és köti össze mindet, a piaci átlag töredékéért, nem több különálló szállító.",
  },
  {
    icon: "ops" as const,
    title: "Hosszú távú üzemeltetés & továbbfejlesztés",
    description:
      "Az élesítés nem a munka vége. A megépített rendszereket folyamatosan üzemeltetjük, karbantartjuk és fejlesztjük tovább — biztonságosan, megbízhatóan, hosszú távon. Ez nálunk folyamatos felelősségvállalás, nem egyszeri leszállított munka.",
  },
];

export function Services() {
  return (
    <section id="szolgaltatasok" className="scroll-mt-20 bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-spring">
            <span className="text-ink/30">{"// "}</span>Szolgáltatások
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Három pillér, egy rendszer
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 100} className="h-full">
              <TiltCard className={cardClasses}>
                <ServiceIcon name={pillar.icon} />
                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-ink/40">
                  {pillar.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                  {pillar.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink/70">{pillar.description}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {capabilities.map((capability, index) => (
            <Reveal key={capability.title} delay={index * 100} className="h-full">
              <TiltCard className={cardClasses}>
                <ServiceIcon name={capability.icon} />
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                  {capability.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink/70">{capability.description}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
