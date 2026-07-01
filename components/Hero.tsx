"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CallbackForm } from "@/components/CallbackForm";
import { BlueprintDiagram, ControlledBlueprintDiagram } from "@/components/BlueprintDiagram";
import { Spotlight } from "@/components/Spotlight";
import { Reveal } from "@/components/Reveal";
import { useScrollJackingEnabled } from "@/lib/useScrollJacking";

gsap.registerPlugin(ScrollTrigger);

const EYEBROW_TEXT =
  "Sales System Engineering, Community Platform Building, and AI Automation Design";

const BODY_TEXT =
  "A Forrás Stúdió egyetlen niche-re szakosodott: coachok, pszichológusok, terapeuták, tanácsadók és wellness-vállalkozások számára építjük meg és üzemeltetjük a teljes online működést — az időpontfoglalástól a fizetésen és az ügyfél-CRM-en át a zárt, tagi közösségi felületekig, kiegészítve AI-alapú automatizációval (pl. lead-scoring, intelligens emlékeztetők). Egy kézből, egymással összehangolva.";

/** Pinned GSAP scroll-sequence: streams draw in, converge, the headline
 * unmasks, the form settles in — all scrubbed directly against scroll
 * position instead of a fixed-duration timer. Desktop pointer + motion
 * allowed only (see useScrollJackingEnabled). */
function HeroPinned() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const diagramWrapRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const nodeRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current || !pinRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(headlineRef.current, { yPercent: 100 });
      gsap.set(eyebrowRef.current, { opacity: 0, y: 14 });
      gsap.set(bodyRef.current, { opacity: 0, y: 14 });
      gsap.set(formRef.current, { opacity: 0, scale: 0.96 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          pin: pinRef.current,
          anticipatePin: 1,
        },
      });

      pathRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.to(el, { strokeDashoffset: 0, duration: 0.16, ease: "power2.out" }, i * 0.075);
      });

      tl.to(nodeRef.current, { opacity: 1, scale: 1, duration: 0.14, ease: "expo.out" }, 0.42)
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.46)
        .to(headlineRef.current, { yPercent: 0, duration: 0.2, ease: "expo.out" }, 0.5)
        .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.66)
        .to(formRef.current, { opacity: 1, scale: 1, duration: 0.14, ease: "expo.out" }, 0.78)
        .to(
          diagramWrapRef.current,
          { opacity: 0, scale: 0.45, x: -80, y: -140, duration: 0.16, ease: "power2.in" },
          0.85,
        );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[200vh]">
      <div
        ref={pinRef}
        className="flex h-screen items-center overflow-hidden bg-ink text-paper"
      >
        <Spotlight className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p
              ref={eyebrowRef}
              className="font-mono text-xs uppercase tracking-[0.18em] text-spring"
            >
              {EYEBROW_TEXT}
            </p>

            <div className="mt-5 overflow-hidden">
              <h1
                ref={headlineRef}
                className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.2rem]"
              >
                A segítő szakma teljes digitális rendszere —{" "}
                <span className="italic text-amber">
                  megtervezve, megépítve, üzemeltetve.
                </span>
              </h1>
            </div>

            <p ref={bodyRef} className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75">
              {BODY_TEXT}
            </p>

            <div
              ref={formRef}
              className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:border-white/20 sm:p-6"
            >
              <p className="mb-4 font-sans text-sm font-medium text-paper/90">
                Kérj visszahívást — 2 mező, egy munkanapon belül jelentkezünk.
              </p>
              <CallbackForm variant="mini" source="hero-mini" />
            </div>
          </div>

          <div ref={diagramWrapRef} className="flex justify-center lg:justify-end">
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
      </div>
    </div>
  );
}

/** Fallback for touch devices / reduced motion: a normal in-flow section
 * with the original scroll-into-view fade/slide reveal — same content,
 * no pinning, no scrubbing. */
function HeroSimple() {
  return (
    <div className="bg-ink text-paper">
      <Spotlight className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-spring">
              {EYEBROW_TEXT}
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.2rem]">
              A segítő szakma teljes digitális rendszere —{" "}
              <span className="italic text-amber">megtervezve, megépítve, üzemeltetve.</span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75">{BODY_TEXT}</p>
          </Reveal>

          <Reveal delay={270}>
            <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:border-white/20 sm:p-6">
              <p className="mb-4 font-sans text-sm font-medium text-paper/90">
                Kérj visszahívást — 2 mező, egy munkanapon belül jelentkezünk.
              </p>
              <CallbackForm variant="mini" source="hero-mini" />
            </div>
          </Reveal>
        </div>

        <Reveal delay={220} className="flex justify-center lg:justify-end">
          <BlueprintDiagram />
        </Reveal>
      </Spotlight>
    </div>
  );
}

export function Hero() {
  const jackingEnabled = useScrollJackingEnabled();

  return (
    <section id="top" className="relative scroll-mt-20 overflow-hidden">
      {jackingEnabled ? <HeroPinned /> : <HeroSimple />}
    </section>
  );
}
