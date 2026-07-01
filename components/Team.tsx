const team = [
  {
    name: "Kardos Bálint",
    role: "Alapító, ügyvezető (CEO)",
    initials: "KB",
  },
  {
    name: "Kányási Soma",
    role: "Technológiai vezető (Tech Lead)",
    initials: "KS",
  },
  {
    name: "Csábi Eszter",
    role: "Minőségbiztosítási vezető (QA Lead)",
    initials: "CE",
  },
];

export function Team() {
  return (
    <section id="csapat" className="bg-paper-3">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/50">
          Csapat
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Mi vagyunk a Forrás Stúdió
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink/70">
          Hárman vagyunk. Nincs közvetítő réteg — a projekt teljes ideje alatt
          közvetlenül velünk egyeztetsz.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-xl border border-paper-2 bg-white/50 p-6 text-center"
            >
              <div
                role="img"
                aria-label={`${member.name} portréja — [TODO: csapattag fotó]`}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-spring to-brook font-display text-xl font-semibold text-ink"
              >
                {member.initials}
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-ink/35">
                [TODO: csapattag fotó]
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                {member.name}
              </h3>
              <p className="mt-1 text-sm text-ink/60">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
