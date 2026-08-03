import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { MagneticCard } from "@/components/MagneticCard";

export function Team() {
  return (
    <section id="csapat" className="scroll-mt-20 bg-paper-3">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/50">
            <span className="text-ink/30">{"// "}</span>Csapat
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-gradient-brand mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Mi építettük
          </h2>
        </Reveal>

        <Reveal delay={160} className="mt-12">
          <MagneticCard>
            <div className="glow-card group grid gap-8 rounded-2xl border border-paper-2 bg-white/60 p-8 [--glow-color:var(--color-brook)] hover:border-brook/50 hover:bg-white/90 sm:grid-cols-[auto_1fr] sm:items-center sm:p-10">
              <Image
                src="/team/kardos-balint.jpg"
                alt="Kardos Bálint portréja"
                width={480}
                height={480}
                unoptimized
                className="mx-auto h-32 w-32 flex-shrink-0 rounded-full border-2 border-paper-2 object-cover transition-all duration-300 group-hover:scale-105 group-hover:border-spring/50 sm:h-40 sm:w-40"
              />
              <div>
                <p className="font-display text-xl leading-relaxed text-ink sm:text-2xl">
                  „Szia, Kardos Bálint vagyok — a MI Építettük alapítója és vezető fejlesztője.
                  Nincs közvetítő réteg, nincs projektmenedzser-lánc: az első egyeztetéstől az
                  üzemeltetésig velem beszélsz. A legújabb AI-eszközökkel dolgozom, hogy
                  gyorsabban, megbízhatóbban és a piaci árak töredékéért építsem meg, amire
                  szükséged van.”
                </p>
                <p className="mt-4 font-display text-base font-semibold text-ink">Kardos Bálint</p>
                <p className="text-sm text-ink/60">Alapító & vezető fejlesztő</p>
              </div>
            </div>
          </MagneticCard>
        </Reveal>
      </div>
    </section>
  );
}
