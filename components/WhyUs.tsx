import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";

type Accent = "spring" | "amber" | "brook" | "pink";

const accentClasses: Record<Accent, { text: string; glow: string; border: string }> = {
  spring: { text: "text-spring", glow: "var(--color-spring)", border: "hover:border-spring/60" },
  amber: { text: "text-amber", glow: "var(--color-amber)", border: "hover:border-amber/60" },
  brook: { text: "text-brook", glow: "var(--color-brook)", border: "hover:border-brook/60" },
  pink: { text: "text-pink", glow: "var(--color-pink)", border: "hover:border-pink/60" },
};

const reasons: { number: string; accent: Accent; title: string; description: string }[] = [
  {
    number: "01",
    accent: "spring",
    title: "AI-gyorsított fejlesztés, éles gyakorlatban bevizsgálva",
    description:
      "React, Next.js, Astro, Supabase és a legújabb AI-fejlesztői eszközök — olyan stacket használunk, amit több iparágban, valós forgalmú, biztonságos rendszerekben teszteltünk, nem csak elméletben.",
  },
  {
    number: "02",
    accent: "amber",
    title: "A piaci árak töredékéért, ugyanolyan megbízhatósággal",
    description:
      "Az AI-val felgyorsított munkafolyamatunk miatt nem fizetsz rá a régi ügynökségek rezsijére — költséghatékony, mégis megbízható és biztonságos rendszert kapsz.",
  },
  {
    number: "03",
    accent: "brook",
    title: "Az új generáció, közvetítők nélkül",
    description:
      "Hárman vagyunk, nincs közvetítő réteg vagy projektmenedzser-lánc — közvetlenül azzal egyeztetsz, aki modern eszközökkel és AI-val építi a rendszeredet.",
  },
  {
    number: "04",
    accent: "pink",
    title: "Felelősségvállalás az élesítés után is",
    description:
      "A rendszert nem felejtjük el a leszállítás után sem. Folyamatosan üzemeltetjük, karbantartjuk és fejlesztjük tovább, hosszú távon.",
  },
];

export function WhyUs() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-spring">
            <span className="text-ink/30">{"// "}</span>Miért minket
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Ami minket megkülönböztet
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {reasons.map((reason, index) => (
            <Reveal key={reason.title} delay={index * 90} className="h-full">
              <TiltCard className="h-full">
                <div
                  className={`glow-card group h-full rounded-2xl border border-paper-3 bg-white/60 p-6 ${accentClasses[reason.accent].border} hover:bg-white/90 sm:p-7`}
                  style={{ "--glow-color": accentClasses[reason.accent].glow } as React.CSSProperties}
                >
                  <span className={`font-mono text-2xl font-bold ${accentClasses[reason.accent].text} opacity-70`}>
                    {reason.number}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                    {reason.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink/70">{reason.description}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
