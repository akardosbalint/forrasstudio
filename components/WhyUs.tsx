const reasons = [
  {
    title: "Egyetlen niche, nem generalista fejlesztés",
    description:
      "A segítő szakmára szakosodtunk — foglalás, ügyfél-bizalmasság, fizetés és közösségi tér együtt, adatvédelmi érzékenységgel. Nem minden projektnél tanuljuk újra ezt a domaint.",
  },
  {
    title: "Közvetlen kapcsolat a fejlesztőkkel",
    description:
      "Hárman vagyunk, nincs közvetítő réteg vagy projektmenedzser-lánc — közvetlenül azzal egyeztetsz, aki a rendszert építi.",
  },
  {
    title: "Felelősségvállalás az élesítés után is",
    description:
      "A rendszert nem szállítjuk le és felejtjük el. Folyamatosan üzemeltetjük, karbantartjuk és fejlesztjük tovább, hosszú távon.",
  },
  {
    title: "Teljes rendszer, egy kézből",
    description:
      "A foglalás, a fizetés, a CRM és a beléptetés egymással összehangolva készül — nem több különálló szállítótól összerakva.",
  },
];

export function WhyUs() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-spring">
          Miért minket
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Ami minket megkülönböztet
        </h2>

        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber"
              />
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {reason.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink/70">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
