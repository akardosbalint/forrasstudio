import { Reveal } from "@/components/Reveal";

const steps = [
  {
    number: "01",
    title: "Egyeztetés",
    description:
      "Megismerjük a praxisod vagy vállalkozásod működését: hogyan foglalnak időpontot, fizetnek, és hol van most súrlódás.",
  },
  {
    number: "02",
    title: "Terv & ajánlat",
    description:
      "Összeállítjuk, mely modulok kellenek (foglalás, fizetés, CRM, beléptetés), és pontos, átlátható ajánlatot adunk.",
  },
  {
    number: "03",
    title: "Fejlesztés",
    description:
      "Megépítjük a rendszert — a modulok egymással összehangolva, a saját folyamataidra szabva.",
  },
  {
    number: "04",
    title: "Élesítés & support",
    description:
      "Élesítjük a rendszert, majd folyamatosan üzemeltetjük, karbantartjuk és fejlesztjük — hosszú távon.",
  },
];

export function Process() {
  return (
    <section className="bg-paper-3">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/50">
            Hogyan dolgozunk
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Négy lépés az egyeztetéstől az üzemeltetésig
          </h2>
        </Reveal>

        <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <li key={step.number} className="relative">
              <Reveal delay={index * 100}>
                <div className="group transition-transform duration-300 hover:-translate-y-1">
                  {index < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-6 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-spring/60 to-transparent lg:block"
                    />
                  )}
                  <span className="font-mono text-sm text-amber-dark transition-colors duration-300 group-hover:text-amber">
                    {step.number}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink/70">{step.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
