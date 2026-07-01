// Shared motion tokens so every hand-built animation (Framer Motion,
// GSAP, or plain CSS) reads as one consistent "voice" instead of a grab
// bag of easings.

/** Expo-out cubic-bezier — fast start, long confident settle. */
export const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
export const EXPO_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const SPRING_MEDIUM = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export const SPRING_SOFT = {
  type: "spring" as const,
  stiffness: 150,
  damping: 18,
  mass: 1,
};

export const REVEAL_DURATION = 0.8;
export const MICRO_DURATION = 0.3;

/**
 * Reduced-motion handling for Framer Motion components lives in two
 * places, deliberately not here:
 * - Transition *timing* (whileInView/animate durations collapsing to
 *   instant) is handled globally by `<MotionConfig reducedMotion="user">`
 *   in the root layout — components don't need to branch their
 *   `transition` props at all.
 * - Anything that changes a *rendered value* (parallax ranges, tilt
 *   angles) must use `usePrefersReducedMotion()` from
 *   lib/usePrefersReducedMotion.ts, which defers the check to a
 *   post-mount effect. Framer Motion's own `useReducedMotion()` reads
 *   matchMedia synchronously on the client's first render, which can
 *   differ from the server's render and trigger a real hydration
 *   mismatch — don't use it for anything that affects initial markup.
 */
