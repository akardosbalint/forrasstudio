import { CallbackForm } from "@/components/CallbackForm";
import { BlueprintDiagram } from "@/components/BlueprintDiagram";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-ink text-paper"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-spring">
            Sales System Engineering, Community Platform Building, and AI Automation Design
          </p>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.2rem]">
            A segítő szakma teljes digitális rendszere —{" "}
            <span className="italic text-amber">megtervezve, megépítve, üzemeltetve.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75">
            A Forrás Stúdió egyetlen niche-re szakosodott: coachok, pszichológusok,
            terapeuták, tanácsadók és wellness-vállalkozások számára építjük meg és
            üzemeltetjük a teljes online működést — az időpontfoglalástól a fizetésen
            és az ügyfél-CRM-en át a zárt, tagi közösségi felületekig, kiegészítve
            AI-alapú automatizációval (pl. lead-scoring, intelligens emlékeztetők).
            Egy kézből, egymással összehangolva.
          </p>

          <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <p className="mb-4 font-sans text-sm font-medium text-paper/90">
              Kérj visszahívást — 2 mező, egy munkanapon belül jelentkezünk.
            </p>
            <CallbackForm variant="mini" source="hero-mini" />
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <BlueprintDiagram />
        </div>
      </div>
    </section>
  );
}
