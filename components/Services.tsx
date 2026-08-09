import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import type { Dictionary } from "@/dictionaries";

type ServicesProps = {
  dict: Dictionary["site"]["services"];
};

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

const pillarMeta: { icon: IconName; accent: Accent }[] = [
  { icon: "webapp", accent: "spring" },
  { icon: "content", accent: "amber" },
  { icon: "booking", accent: "pink" },
  { icon: "community", accent: "brook" },
  { icon: "crm", accent: "spring" },
  { icon: "ai", accent: "amber" },
];

const capabilityMeta: { icon: IconName; accent: Accent }[] = [
  { icon: "system", accent: "pink" },
  { icon: "ops", accent: "brook" },
];

export function Services({ dict }: ServicesProps) {
  return (
    <section id="szolgaltatasok" className="scroll-mt-20 bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-spring">
            <span className="text-ink/30">{"// "}</span>
            {dict.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {dict.title}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink/70">{dict.description}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 80} className="h-full">
              <TiltCard className={cardClasses(pillarMeta[index].accent)}>
                <ServiceIcon name={pillarMeta[index].icon} accent={pillarMeta[index].accent} />
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
          {dict.capabilities.map((capability, index) => (
            <Reveal key={capability.title} delay={index * 100} className="h-full">
              <TiltCard className={cardClasses(capabilityMeta[index].accent)}>
                <ServiceIcon name={capabilityMeta[index].icon} accent={capabilityMeta[index].accent} />
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
