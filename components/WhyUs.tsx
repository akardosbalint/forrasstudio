import { Reveal } from "@/components/Reveal";
import type { Dictionary } from "@/dictionaries";

type WhyUsProps = {
  dict: Dictionary["site"]["whyUs"];
};

export function WhyUs({ dict }: WhyUsProps) {
  const { reasons } = dict;
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-spring">
            <span className="text-ink/30">{"// "}</span>{dict.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {dict.title}
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
