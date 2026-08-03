import { Reveal } from "@/components/Reveal";

const reasons = [
  {
    title: "AI-gyorsított fejlesztés, éles gyakorlatban bevizsgálva",
    description:
      "React, Next.js, Astro, Supabase és a legújabb AI-fejlesztői eszközök — olyan stacket használunk, amit több iparágban, valós forgalmú, biztonságos rendszerekben teszteltünk, nem csak elméletben.",
  },
  {
    title: "A piaci árak töredékéért, ugyanolyan megbízhatósággal",
    description:
      "Az AI-val felgyorsított munkafolyamatunk miatt nem fizetsz rá a régi ügynökségek rezsijére — költséghatékony, mégis megbízható és biztonságos rendszert kapsz.",
  },
  {
    title: "Az új generáció, közvetítők nélkül",
    description:
      "Hárman vagyunk, nincs közvetítő réteg vagy projektmenedzser-lánc — közvetlenül azzal egyeztetsz, aki modern eszközökkel és AI-val építi a rendszeredet.",
  },
  {
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
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Ami minket megkülönböztet
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {reasons.map((reason, index) => (
            <Reveal key={reason.title} delay={index * 90}>
              <div className="group flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber transition-transform duration-300 group-hover:scale-150"
                />
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink transition-colors duration-300 group-hover:text-amber-dark">
                    {reason.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink/70">{reason.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
