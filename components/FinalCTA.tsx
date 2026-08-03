import { CallbackForm } from "@/components/CallbackForm";
import { Spotlight } from "@/components/Spotlight";
import { Reveal } from "@/components/Reveal";
import { AmbientFlow } from "@/components/AmbientFlow";

export function FinalCTA() {
  return (
    <section id="cta" className="grid-pattern relative scroll-mt-20 overflow-hidden bg-ink text-paper">
      <AmbientFlow />
      <Spotlight className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-spring">
            <span className="text-paper/30">{"// "}</span>Kezdjük el
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Kérj visszahívást, és beszéljük át a rendszered
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-4 max-w-xl leading-relaxed text-paper/70">
            Írd meg az elérhetőségeidet, mi visszahívunk, és átbeszéljük, milyen
            modulokra van szükséged — foglalás, fizetés, ügyfél-CRM vagy zárt közösségi
            felület. AI-val gyorsított fejlesztéssel, a piaci árak töredékéért.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-white/20 sm:p-8">
            <CallbackForm variant="full" source="final-cta" />
          </div>
        </Reveal>
      </Spotlight>
    </section>
  );
}
