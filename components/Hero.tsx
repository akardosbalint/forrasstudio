"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { CallbackForm } from "@/components/CallbackForm";
import { ControlledBlueprintDiagram } from "@/components/BlueprintDiagram";
import { Spotlight } from "@/components/Spotlight";

const EYEBROW_TEXT =
  "AI-alapú fejlesztés — webalkalmazások, automatizáció és biztonságos rendszerek";

const BODY_TEXT_1 =
  "A FlowCore a fejlesztés új generációja: a legmodernebb technológiákkal és AI-alapú eszközökkel építünk megbízható, biztonságos rendszereket — a hagyományos fejlesztői ügynökségek árának töredékéért.";

const BODY_TEXT_2 =
  "Egy fiatal, technológiavezérelt csapat vagyunk, amely elérhetővé teszi a kompromisszum-mentes egyedi szoftverfejlesztést mindenki számára: időpontfoglalástól a fizetésen és az ügyfél-CRM-en át a zárt közösségi felületekig és a hírlevél-automatizációig.";

/** Plays automatically on load — no scroll required. The streams draw
 * in staggered, the source node converges, the headline unmasks from
 * behind an overflow-hidden reveal, then the form settles in.
 *
 * Nothing is hidden by default in the JSX/CSS: the "hidden" starting
 * point is only ever applied imperatively via gsap.set() inside this
 * effect, and only when motion is actually going to play. That means a
 * no-JS visitor, or a Next.js hydration pass before this effect runs,
 * always sees the fully-visible, final state — never a stuck-hidden
 * hero. useLayoutEffect (not useEffect) applies the hidden state
 * before the browser paints, so motion-enabled visitors don't see a
 * flash of the fully-revealed hero followed by it snapping hidden. */
export function Hero() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const nodeRef = useRef<SVGGElement | null>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(headlineRef.current, { yPercent: 100 });
      gsap.set(eyebrowRef.current, { opacity: 0, y: 14 });
      gsap.set(bodyRef.current, { opacity: 0, y: 14 });
      gsap.set(formRef.current, { opacity: 0, scale: 0.96 });
      gsap.set(
        pathRefs.current.filter(Boolean),
        { strokeDashoffset: 1 },
      );
      gsap.set(nodeRef.current, { opacity: 0, scale: 0.55 });

      const tl = gsap.timeline({ delay: 0.15 });

      pathRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.to(el, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" }, i * 0.12);
      });

      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.1)
        .to(headlineRef.current, { yPercent: 0, duration: 0.7, ease: "expo.out" }, 0.35)
        .to(nodeRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, 0.75)
        .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.95)
        .to(formRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" }, 1.2);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="top" className="grid-pattern relative scroll-mt-20 overflow-hidden bg-ink text-paper">
      <Spotlight className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <p
            ref={eyebrowRef}
            className="font-mono text-xs uppercase tracking-[0.18em] text-spring"
          >
            <span className="text-paper/30">{"// "}</span>
            {EYEBROW_TEXT}
          </p>

          <div className="mt-5 overflow-hidden">
            <h1
              ref={headlineRef}
              className="font-display text-4xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.85rem]"
            >
              Egyedi szoftver mindenkinek —{" "}
              <span className="bg-gradient-to-r from-amber via-amber to-spring bg-clip-text italic text-transparent">
                a{" "}legújabb technológiával, gyorsabban, biztonságosabban, kedvezőbb áron.
              </span>
            </h1>
          </div>

          <div ref={bodyRef} className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-paper/75">
            <p>{BODY_TEXT_1}</p>
            <p>{BODY_TEXT_2}</p>
          </div>

          <div
            ref={formRef}
            className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:border-spring/40 sm:p-6"
          >
            <p className="mb-4 font-sans text-sm font-medium text-paper/90">
              Kérj visszahívást — 2 mező, egy munkanapon belül jelentkezünk.
            </p>
            <CallbackForm variant="mini" source="hero-mini" />
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <ControlledBlueprintDiagram
            registerPath={(el, index) => {
              pathRefs.current[index] = el;
            }}
            registerNode={(el) => {
              nodeRef.current = el;
            }}
          />
        </div>
      </Spotlight>
    </section>
  );
}
