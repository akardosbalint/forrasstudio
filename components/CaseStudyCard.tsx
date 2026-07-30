"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EXPO_OUT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type CaseStudyCardProps = {
  href: string;
  index: number;
  children: ReactNode;
};

/** Card unveils via a left-to-right wipe (a paper-colored cover
 * shrinking away, not a plain fade) as it enters view, and its inner
 * content drifts at a slightly different rate than the card frame while
 * the section scrolls past — a subtle parallax rather than the frame
 * and content moving as one rigid block.
 *
 * The wipe is built from a `scaleX` cover rather than an animated
 * `clip-path`: Framer Motion's `whileInView` reliably drives transform
 * properties, but silently fails to animate `clip-path` values in this
 * version — confirmed by isolated testing (opacity/scale/x all animate
 * correctly via whileInView, clip-path never progresses past its
 * initial value). Same visual result, no upstream bug in the path. */
export function CaseStudyCard({ href, index, children }: CaseStudyCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const innerY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [22, -22]);

  return (
    <motion.a
      ref={cardRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-paper-3 bg-white/50 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-spring/60 hover:bg-white/80 hover:shadow-2xl hover:shadow-spring/25 sm:p-7"
    >
      <motion.div style={{ y: innerY }} className="flex h-full flex-col">
        {children}
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EXPO_OUT, delay: index * 0.08 }}
        style={{ originX: 1 }}
        className="pointer-events-none absolute inset-0 z-10 bg-paper"
      />
    </motion.a>
  );
}
