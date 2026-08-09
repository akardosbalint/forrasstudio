"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/Reveal";
import { useScrollJackingEnabled } from "@/lib/useScrollJacking";
import type { Dictionary } from "@/dictionaries";

gsap.registerPlugin(ScrollTrigger);

type StepIcon = "talk" | "plan" | "build" | "launch";
type ProcessDict = Dictionary["site"]["process"];

const stepIcons: StepIcon[] = ["talk", "plan", "build", "launch"];

function StepIconGraphic({ name }: { name: StepIcon }) {
  const paths: Record<StepIcon, ReactNode> = {
    talk: (
      <>
        <rect x="5" y="7" width="22" height="15" rx="4" />
        <path d="M11 22v5l4-5" />
      </>
    ),
    plan: (
      <>
        <rect x="8" y="5" width="16" height="22" rx="2" />
        <path d="M12 12h8M12 17h8M12 22h5" />
      </>
    ),
    build: (
      <>
        <path d="M12 9l-7 7 7 7" />
        <path d="M20 9l7 7-7 7" />
      </>
    ),
    launch: (
      <>
        <path d="M16 6v16" />
        <path d="M10 12l6-6 6 6" />
        <path d="M8 26h16" />
      </>
    ),
  };

  return (
    <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-spring/10 text-spring">
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[name]}
      </svg>
    </span>
  );
}

/** Horizontal scroll-jacking track: the 4 steps slide left as the user
 * scrolls vertically through the pinned section, each icon popping in
 * as its panel nears the center. Desktop pointer + motion allowed only. */
function ProcessPinned({ dict }: { dict: ProcessDict }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ctx: gsap.Context | undefined;

    function setup() {
      ctx = gsap.context(() => {
        const track = trackRef.current;
        const pin = pinRef.current;
        const wrapper = wrapperRef.current;
        if (!track || !pin || !wrapper) return;

        const distance = Math.max(track.scrollWidth - window.innerWidth, 0);

        gsap.set(
          iconRefs.current.filter(Boolean),
          { scale: 0.5, opacity: 0 },
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: () => `+=${distance}`,
            scrub: 0.6,
            pin,
            invalidateOnRefresh: true,
          },
        });

        tl.to(track, { x: -distance, ease: "none", duration: 1 }, 0);

        iconRefs.current.forEach((el, i) => {
          if (!el) return;
          const center = (i + 0.5) / dict.steps.length;
          tl.to(
            el,
            { scale: 1, opacity: 1, duration: 0.1, ease: "back.out(2)" },
            Math.max(0, center - 0.05),
          );
        });
      }, wrapperRef);
    }

    setup();

    function handleResize() {
      ctx?.revert();
      setup();
      ScrollTrigger.refresh();
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div ref={pinRef} className="h-screen overflow-hidden bg-paper-3">
        <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-8">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/50">
              <span className="text-ink/30">{"// "}</span>
              {dict.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {dict.title}
            </h2>
          </Reveal>

          <div className="mt-14 overflow-hidden">
            <div ref={trackRef} className="flex gap-16 will-change-transform lg:gap-24">
              {dict.steps.map((step, index) => (
                <div
                  key={step.number}
                  className="w-[80vw] flex-shrink-0 sm:w-[55vw] lg:w-[32vw]"
                >
                  <div
                    ref={(el) => {
                      iconRefs.current[index] = el;
                    }}
                  >
                    <StepIconGraphic name={stepIcons[index]} />
                  </div>
                  <span className="mt-4 block font-mono text-sm text-amber-dark">
                    {step.number}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-ink/70">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Fallback: simple vertical staggered reveal, no horizontal scroll-jacking. */
function ProcessSimple({ dict }: { dict: ProcessDict }) {
  return (
    <div className="bg-paper-3">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/50">
            <span className="text-ink/30">{"// "}</span>
            {dict.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {dict.title}
          </h2>
        </Reveal>

        <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {dict.steps.map((step, index) => (
            <li key={step.number} className="relative">
              <Reveal delay={index * 100}>
                <div className="group transition-transform duration-300 hover:-translate-y-1">
                  {index < dict.steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-6 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-amber/50 via-pink/40 to-transparent lg:block"
                    />
                  )}
                  <StepIconGraphic name={stepIcons[index]} />
                  <span className="mt-3 block font-mono text-sm text-amber-dark transition-colors duration-300 group-hover:text-amber">
                    {step.number}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink/70">{step.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function Process({ dict }: { dict: ProcessDict }) {
  const jackingEnabled = useScrollJackingEnabled();
  return (
    <section>
      {jackingEnabled ? <ProcessPinned dict={dict} /> : <ProcessSimple dict={dict} />}
    </section>
  );
}
