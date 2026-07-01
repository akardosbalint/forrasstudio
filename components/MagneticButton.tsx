"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const MAX_PULL_PX = 8;
const SPRING = { stiffness: 250, damping: 18, mass: 0.4 };

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

/** Button drifts a few px toward the cursor while hovered, spring-easing
 * back to rest on leave. Skips entirely under prefers-reduced-motion. */
export function MagneticButton({ children, className, type = "button", disabled }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  function handleMouseMove(event: React.MouseEvent<HTMLButtonElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rawX.set(px * MAX_PULL_PX * 2);
    rawY.set(py * MAX_PULL_PX * 2);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
