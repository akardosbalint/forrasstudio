import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { MagneticCard } from "@/components/MagneticCard";

const team = [
  {
    name: "Kardos Bálint",
    role: "Alapító & vezető fejlesztő",
    photo: "/team/kardos-balint.jpg",
  },
  {
    name: "Kányási Soma",
    role: "Technológiai tanácsadó",
    photo: "/team/kanyasi-soma.jpg",
  },
  {
    name: "Csábi Eszter",
    role: "Minőségbiztosítási tanácsadó",
    photo: "/team/csabi-eszter.jpg",
  },
];

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
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Mi vagyunk a FlowCore
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink/70">
            Hárman vagyunk: az új generáció fejlesztői, AI-alapú eszközökkel a hátunk
            mögött. Nincs közvetítő réteg — a projekt teljes ideje alatt közvetlenül
            velünk egyeztetsz.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {team.map((member, index) => (
            <Reveal key={member.name} delay={index * 100} className="h-full">
              <MagneticCard className="h-full">
                <div
                  className="glow-card group h-full rounded-2xl border border-paper-2 bg-white/60 p-6 text-center [--glow-color:var(--color-brook)] hover:border-brook/50 hover:bg-white/90"
                >
                  <Image
                    src={member.photo}
                    alt={`${member.name} portréja`}
                    width={480}
                    height={480}
                    unoptimized
                    className="mx-auto h-44 w-44 rounded-full border-2 border-paper-2 object-cover transition-all duration-300 group-hover:scale-105 group-hover:border-spring/50 sm:h-48 sm:w-48"
                  />
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm text-ink/60">{member.role}</p>
                </div>
              </MagneticCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
