"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { EXPO_OUT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const MotionLink = motion.create(Link);

type CaseStudyCardProps = {
  href: string;
  /** Internal case-study detail pages (e.g. /esettanulmanyok/eco-portal) use
   * client-side routing and no target=_blank; external project sites still
   * open in a new tab. */
  internal?: boolean;
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
export function CaseStudyCard({ href, internal = false, index, children }: CaseStudyCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const innerY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [22, -22]);

  const cardClassName =
    "glow-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-paper-3 bg-white/60 p-6 [--glow-color:var(--color-spring)] hover:-translate-y-1.5 hover:border-spring/60 hover:bg-white/90 sm:p-7";

  const wipe = (
    <motion.div
      aria-hidden="true"
      initial={{ scaleX: 1 }}
      whileInView={{ scaleX: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EXPO_OUT, delay: index * 0.08 }}
      style={{ originX: 1 }}
      className="pointer-events-none absolute inset-0 z-10 bg-paper"
    />
  );

  if (internal) {
    return (
      <MotionLink ref={cardRef} href={href} className={cardClassName}>
        <motion.div style={{ y: innerY }} className="flex h-full flex-col">
          {children}
        </motion.div>
        {wipe}
      </MotionLink>
    );
  }

  return (
    <motion.a
      ref={cardRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClassName}
    >
      <motion.div style={{ y: innerY }} className="flex h-full flex-col">
        {children}
      </motion.div>
      {wipe}
    </motion.a>
  );
}
