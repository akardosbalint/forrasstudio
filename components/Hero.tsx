"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { CallbackForm } from "@/components/CallbackForm";
import { ControlledBlueprintDiagram } from "@/components/BlueprintDiagram";
import { Spotlight } from "@/components/Spotlight";

const EYEBROW_TEXT =
  "Weboldalak, webalkalmazások, közösségi platformok és AI-alapú automatizáció";

const BODY_TEXT_1 =
  "Ugyanazt a magas minőséget kapod, mint egy hagyományos fejlesztőcégnél — csak gyorsabban leszállítva és a piaci árak töredékéért. A legmodernebb AI-eszközöket emberi szakértelemmel párosítva építünk megbízható, biztonságos rendszereket.";

const USP_BADGES: { accent: "spring" | "amber" | "brook"; label: string }[] = [
  { accent: "spring", label: "Ugyanaz a minőség" },
  { accent: "amber", label: "Rövidebb határidő" },
  { accent: "brook", label: "Töredék ár" },
];

const badgeDotClasses: Record<(typeof USP_BADGES)[number]["accent"], string> = {
  spring: "bg-spring",
  amber: "bg-amber",
  brook: "bg-brook",
};

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
    <section id="top" className="mesh-dark grid-pattern relative scroll-mt-20 overflow-hidden text-paper">
      <Spotlight className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <p
            ref={eyebrowRef}
            className="font-mono text-xs uppercase tracking-[0.18em] text-spring"
          >
            <span className="text-paper/30">{"// "}</span>
            {EYEBROW_TEXT}
          </p>

          <div className="-mx-2 mt-5 overflow-hidden px-2">
            <h1
              ref={headlineRef}
              className="font-display text-4xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.85rem]"
            >
              Amit el tudsz képzelni,{" "}
              <span className="text-gradient-brand">MI megépítjük.</span>
            </h1>
          </div>

          <div ref={bodyRef} className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-paper/75">
            <p>{BODY_TEXT_1}</p>
            <ul className="flex flex-wrap gap-2.5">
              {USP_BADGES.map((badge) => (
                <li
                  key={badge.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-xs text-paper/80"
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${badgeDotClasses[badge.accent]}`}
                  />
                  {badge.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center lg:-mt-6 lg:justify-end lg:self-start">
          <ControlledBlueprintDiagram
            registerPath={(el, index) => {
              pathRefs.current[index] = el;
            }}
            registerNode={(el) => {
              nodeRef.current = el;
            }}
          />
        </div>

        <div
          ref={formRef}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:border-spring/40 sm:p-6 lg:col-span-2"
        >
          <p className="mb-4 font-sans text-sm font-medium text-paper/90">
            Kérj visszahívást — 2 mező, egy munkanapon belül jelentkezünk.
          </p>
          <CallbackForm variant="mini" source="hero-mini" />
        </div>
      </Spotlight>
    </section>
  );
}
