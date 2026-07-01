import Image from "next/image";

const team = [
  {
    name: "Kardos Bálint",
    role: "Alapító, ügyvezető (CEO)",
    photo: "/team/kardos-balint.jpg",
  },
  {
    name: "Kányási Soma",
    role: "Technológiai vezető (Tech Lead)",
    photo: "/team/kanyasi-soma.jpg",
  },
  {
    name: "Csábi Eszter",
    role: "Minőségbiztosítási vezető (QA Lead)",
    photo: "/team/csabi-eszter.jpg",
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
              <Image
                src={member.photo}
                alt={`${member.name} portréja`}
                width={480}
                height={480}
                unoptimized
                className="mx-auto h-44 w-44 rounded-full border-2 border-paper-2 object-cover sm:h-48 sm:w-48"
              />
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
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
