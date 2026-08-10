import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { MagneticCard } from "@/components/MagneticCard";

export function Team() {
  return (
    <section id="bemutatkozas" className="scroll-mt-20 bg-paper-3">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/50">
            <span className="text-ink/30">{"// "}</span>Bemutatkozás
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
                <p className="font-display text-lg leading-relaxed text-ink sm:text-xl">
                  „Szia, engem Bálintnak hívnak. A pályám 8 éve, webfejlesztéssel és
                  keresőoptimalizálással indult a Hong Kong University of Technology-n, aztán
                  évekig a marketing felé vitt az élet. Ez idő alatt is sok weboldalt építettem,
                  de a fejlesztéshez 2025-ben tértem vissza valójában. Először baráti
                  megbízásokból kezdtem webalkalmazásokat építeni, aztán hamar rájöttem, hogy ez
                  a típusú alkotás tölt fel a legjobban — így lett ez a fő projektem.
                </p>
                <p className="mt-3 leading-relaxed text-ink/80">
                  Múltamból adódóan értem az üzlet, a marketing és a konverzió oldalát is, nem
                  csak a kódot — és a legújabb AI-eszközökkel gyorsabban, megbízhatóbban építem
                  meg neked, amire szükséged van, a piaci árak töredékéért. Nincs közvetítő
                  réteg: az első egyeztetéstől az üzemeltetésig végig én vagyok az embered.”
                </p>
                <p className="mt-4 font-display text-base font-semibold text-ink">Kardos Bálint</p>
                <p className="text-sm text-ink/60">Vezető fejlesztő</p>
              </div>
            </div>
          </MagneticCard>
        </Reveal>
      </div>
    </section>
  );
}
