import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";

type IconName = "webapp" | "content" | "booking" | "community" | "crm" | "ai" | "system" | "ops";
type Accent = "spring" | "amber" | "pink" | "brook";

const accentIconClasses: Record<Accent, string> = {
  spring: "bg-spring/10 text-spring group-hover:bg-spring/15",
  amber: "bg-amber/10 text-amber group-hover:bg-amber/15",
  pink: "bg-pink/10 text-pink group-hover:bg-pink/15",
  brook: "bg-brook/10 text-brook group-hover:bg-brook/15",
};

function ServiceIcon({ name, accent = "spring" }: { name: IconName; accent?: Accent }) {
  const paths: Record<IconName, ReactNode> = {
    webapp: (
      <>
        <rect x="5" y="7" width="22" height="18" rx="2.5" />
        <path d="M5 13h22" />
        <path d="M11 19h4" />
      </>
    ),
    content: (
      <>
        <rect x="7" y="4" width="18" height="24" rx="2.5" />
        <path d="M11 11h10M11 16h10M11 21h6" />
      </>
    ),
    booking: (
      <>
        <rect x="4" y="6" width="24" height="22" rx="3" />
        <path d="M4 13h24" />
        <path d="M10 3v6M22 3v6" />
        <path d="M11 19l3 3 7-7" />
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
    crm: (
      <>
        <rect x="4" y="6" width="24" height="20" rx="3" />
        <circle cx="11.5" cy="14.5" r="3" />
        <path d="M7 23c0-2.8 2-4.8 4.5-4.8s4.5 2 4.5 4.8" />
        <path d="M18.5 12.5h7.5M18.5 17h7.5" />
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
    <span
      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${accentIconClasses[accent]}`}
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[name]}
      </svg>
    </span>
  );
}

const cardAccentClasses: Record<Accent, string> = {
  spring: "[--glow-color:var(--color-spring)] hover:border-spring/60",
  amber: "[--glow-color:var(--color-amber)] hover:border-amber/60",
  pink: "[--glow-color:var(--color-pink)] hover:border-pink/60",
  brook: "[--glow-color:var(--color-brook)] hover:border-brook/60",
};

function cardClasses(accent: Accent) {
  return `glow-card group h-full rounded-2xl border border-paper-3 bg-white/60 p-6 ${cardAccentClasses[accent]} hover:bg-white/90 sm:p-7`;
}

const pillars = [
  {
    icon: "webapp" as const,
    accent: "spring" as const,
    eyebrow: "1. pillér",
    title: "Weboldal- és webalkalmazás-fejlesztés",
    description:
      "Egyedi, típusbiztos weboldalak és webalkalmazások React, Next.js és TypeScript alapokon, AI-asszisztált fejlesztéssel — kvíz-alapú felhasználói utakkal és a vállalkozásod folyamataira szabva, gyorsabban és a piaci átlag töredékéért, mint egy hagyományos ügynökségnél.",
  },
  {
    icon: "content" as const,
    accent: "amber" as const,
    eyebrow: "2. pillér",
    title: "Tartalmi platformok és blogrendszerek",
    description:
      "Gyors, statikusan generált bemutatkozó weboldalak és blog / MDX-alapú tartalomkezelő rendszerek, hírlevél-automatizációval összekötve — a megjelenésedtől a közönségépítésig egy rendszerben.",
  },
  {
    icon: "booking" as const,
    accent: "pink" as const,
    eyebrow: "3. pillér",
    title: "Időpontfoglalás és online fizetés",
    description:
      "Időpontfoglaló rendszerek és online fizetési integrációk — bankkártyás fizetés, előlegkezelés, automatikus számlázás és emlékeztetők, hogy a foglalástól a kifizetésig semmi ne akadjon el.",
  },
  {
    icon: "community" as const,
    accent: "brook" as const,
    eyebrow: "4. pillér",
    title: "Közösségi és tagsági platformok",
    description:
      "Zárt, jogosultságkezelt tagi felületek közösségeknek és online képzéseknek — biztonságos beléptetéssel, tagsági szintekkel, jelvényrendszerrel és szakértői értékelésekkel.",
  },
  {
    icon: "crm" as const,
    accent: "spring" as const,
    eyebrow: "5. pillér",
    title: "Ügyfélkezelés és CRM rendszerek",
    description:
      "Egyedi CRM rendszerek és admin dashboardok, amik átláthatóvá teszik az ügyfeleidet, a megkereséseidet és a folyamataidat — a te munkafolyamatodra szabva, nem egy általános sablon-CRM.",
  },
  {
    icon: "ai" as const,
    accent: "amber" as const,
    eyebrow: "6. pillér",
    title: "Automatizáció és AI-integráció",
    description:
      "Hírlevél- és e-mail-automatizáció, intelligens riportok és AI-alapú funkciók — ugyanazok az eszközök, amikkel MI magunk is dolgozunk — veszik le rólad az ismétlődő adminisztrációt.",
  },
];

const capabilities = [
  {
    icon: "system" as const,
    accent: "pink" as const,
    title: "Teljes rendszer egy kézből",
    description:
      "A weboldal, a foglalás, a fizetés, a CRM, a beléptetés és az automatizáció nem külön projektek, hanem egymással összehangolt modulok — egy csapat tervezi és köti össze mindet, a piaci átlag töredékéért, nem több különálló szállító.",
  },
  {
    icon: "ops" as const,
    accent: "brook" as const,
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
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Hat pillér, egy rendszer
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink/70">
            Weboldaltól és időpontfoglalástól az ügyfél-CRM-en és a zárt közösségi
            felületeken át az AI-alapú automatizációig — mindent egy csapat tervez,
            épít és üzemeltet, összehangolt rendszerként.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 80} className="h-full">
              <TiltCard className={cardClasses(pillar.accent)}>
                <ServiceIcon name={pillar.icon} accent={pillar.accent} />
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
              <TiltCard className={cardClasses(capability.accent)}>
                <ServiceIcon name={capability.icon} accent={capability.accent} />
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
