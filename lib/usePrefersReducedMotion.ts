"use client";

import { useEffect, useState } from "react";

/**
 * Framer Motion's own `useReducedMotion()` reads `matchMedia` synchronously
 * during the first client render, which can differ from the server's
 * render (no `window` at all) and trigger a real hydration mismatch on
 * any prop whose *value* — not just its transition — depends on it.
 *
 * This defers the check to a post-mount effect instead: both the server
 * and the client's first paint render as if motion is fully allowed, and
 * only after mount (a normal state update, not a hydration pass) does it
 * flip for a user with the OS preference set. Use this for anything that
 * changes rendered values (parallax ranges, tilt angles) rather than
 * Framer Motion's own hook. Transition *timing* is handled globally by
 * `<MotionConfig reducedMotion="user">` in the root layout instead.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReduced(true);
    }
  }, []);

  return reduced;
}
