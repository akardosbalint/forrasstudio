import { Reveal } from "@/components/Reveal";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/dictionaries";

type Pillar = "sales" | "community" | "content" | "both" | "none";

const pillarColors: Record<Pillar, string> = {
  sales: "border-spring/40 text-spring",
  community: "border-brook/40 text-brook",
  content: "border-amber/30 text-amber",
  both: "border-amber/50 text-amber-dark",
  none: "border-ink/20 text-ink/50",
};

type CaseStudiesProps = {
  lang: Locale;
  dict: Dictionary["site"]["caseStudies"];
};

export function CaseStudies({ lang, dict }: CaseStudiesProps) {
  const { items, pillarLabels, readCaseStudy } = dict;
  return (
    <section id="referenciak" className="scroll-mt-20 bg-paper">
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {items.map((project, index) => {
            const internal = Boolean(project.caseStudyHref);
            const href = project.caseStudyHref ? `/${lang}${project.caseStudyHref}` : project.href;
            return (
              <CaseStudyCard key={project.domain} href={href} internal={internal} index={index}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {project.name}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-1 text-ink/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-spring"
                  >
                    {internal ? "→" : "↗"}
                  </span>
                </div>
                <span className="mt-1 font-mono text-xs text-ink/50">{project.domain}</span>

                <p className="mt-3 leading-relaxed text-ink/70">{project.description}</p>

                <span
                  className={`mt-4 inline-block w-fit rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide ${pillarColors[project.pillar]}`}
                >
                  {pillarLabels[project.pillar]}
                </span>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.modules.map((module) => (
                    <span
                      key={module}
                      className="rounded-full bg-paper-2 px-3 py-1 font-mono text-[11px] text-ink/60"
                    >
                      {module}
                    </span>
                  ))}
                </div>

                {internal && (
                  <span className="mt-5 inline-flex w-fit items-center gap-1.5 font-sans text-sm font-semibold text-spring">
                    {readCaseStudy}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                )}
              </CaseStudyCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
