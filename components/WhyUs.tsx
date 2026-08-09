import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import type { Dictionary } from "@/dictionaries";

type Accent = "spring" | "amber" | "brook" | "pink";

type WhyUsProps = {
  dict: Dictionary["site"]["whyUs"];
};

const accentClasses: Record<Accent, { text: string; glow: string; border: string }> = {
  spring: { text: "text-spring", glow: "var(--color-spring)", border: "hover:border-spring/60" },
  amber: { text: "text-amber", glow: "var(--color-amber)", border: "hover:border-amber/60" },
  brook: { text: "text-brook", glow: "var(--color-brook)", border: "hover:border-brook/60" },
  pink: { text: "text-pink", glow: "var(--color-pink)", border: "hover:border-pink/60" },
};

const reasonAccents: Accent[] = ["spring", "amber", "brook", "pink"];

export function WhyUs({ dict }: WhyUsProps) {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-spring">
            <span className="text-ink/30">{"// "}</span>
            {dict.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {dict.title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {dict.reasons.map((reason, index) => (
            <Reveal key={reason.title} delay={index * 90} className="h-full">
              <TiltCard className="h-full">
                <div
                  className={`glow-card group h-full rounded-2xl border border-paper-3 bg-white/60 p-6 ${accentClasses[reasonAccents[index]].border} hover:bg-white/90 sm:p-7`}
                  style={{ "--glow-color": accentClasses[reasonAccents[index]].glow } as React.CSSProperties}
                >
                  <span className={`font-mono text-2xl font-bold ${accentClasses[reasonAccents[index]].text} opacity-70`}>
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
