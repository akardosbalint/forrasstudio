import { Reveal } from "@/components/Reveal";

type Accent = "spring" | "amber" | "brook" | "pink";

const accentText: Record<Accent, string> = {
  spring: "text-spring",
  amber: "text-amber",
  brook: "text-brook",
  pink: "text-pink",
};

const principles: { accent: Accent; win: string; lose: string; description: string }[] = [
  {
    accent: "spring",
    win: "Üzleti érték",
    lose: "öncélú animáció",
    description:
      "Minden interakciónak konverziót, bizalmat vagy időt kell nyernie — nem csak lenyűgöznie. Ha egy animáció csak szép, de lassítja az oldalt, kimarad.",
  },
  {
    accent: "amber",
    win: "Betöltési sebesség",
    lose: "dagadt, felesleges könyvtárak",
    description:
      "Minden feladathoz a legkarcsúbb megoldást választjuk, nem a legimpozánsabbat — a látogatóid türelme véges.",
  },
  {
    accent: "brook",
    win: "Átlátható, karbantartható kód",
    lose: "mesterkélt architektúra",
    description:
      "Olyan rendszert építünk, amit hónapok múlva is gyorsan tudunk bővíteni — nem egy túltervezett keretrendszert, amit csak mi értünk.",
  },
  {
    accent: "pink",
    win: "Valós felhasználói út",
    lose: "pillanatnyi dizájn-trend",
    description:
      "Azt csiszoljuk, amin az ügyfeleid ténylegesen végigmennek — foglalás, fizetés, kapcsolatfelvétel — nem azt, ami épp népszerű egy portfólió-oldalon.",
  },
  {
    accent: "spring",
    win: "Biztonság és megbízhatóság",
    lose: "„majd megcsinálom rendesen” trükkök",
    description:
      "Minden rendszerünk éles forgalmat, fizetést vagy személyes adatot kezel — ez nem terep a rövid távú kompromisszumoknak.",
  },
];

export function DesignPrinciples() {
  return (
    <section id="elveink" className="scroll-mt-20 bg-paper-3">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-spring">
            <span className="text-ink/30">{"// "}</span>Tervezési elveink
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Ezek alapján hozzuk meg a döntéseket
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink/70">
            Minden funkciónál és design-döntésnél ugyanazt a sorrendet követjük —
            hogy a büdzséd oda menjen, ahol ténylegesen számít.
          </p>
        </Reveal>

        <div className="mt-12 divide-y divide-ink/10 border-t border-ink/10">
          {principles.map((principle, index) => (
            <Reveal key={principle.win} delay={index * 80}>
              <div className="grid gap-3 py-6 sm:grid-cols-[1fr_1.4fr] sm:gap-8 sm:py-7">
                <p className="font-display text-lg font-semibold leading-snug sm:text-xl">
                  <span className={accentText[principle.accent]}>{principle.win}</span>
                  <span className="mx-2 text-ink/30">&gt;</span>
                  <span className="text-ink/40 line-through decoration-ink/25">
                    {principle.lose}
                  </span>
                </p>
                <p className="leading-relaxed text-ink/70">{principle.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
