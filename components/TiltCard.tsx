"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const MAX_TILT_DEG = 6;
const SPRING = { stiffness: 300, damping: 28, mass: 0.6 };

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

/** Pointer-driven 3D tilt (max ±6deg), spring-eased back to flat on
 * leave. Skips entirely under prefers-reduced-motion. */
export function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, SPRING);
  const rotateY = useSpring(rawRotateY, SPRING);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rawRotateY.set(px * MAX_TILT_DEG * 2);
    rawRotateX.set(-py * MAX_TILT_DEG * 2);
  }

  function handleMouseLeave() {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={SPRING}
      className={className}
    >
      {children}
    </motion.div>
  );
}
