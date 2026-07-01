"use client";

import { useEffect, useState } from "react";

/**
 * Pinned / horizontal scroll-jacking sequences only run on capable
 * desktop pointers with no reduced-motion preference. Touch devices tend
 * to fight pinned scroll (janky, unpredictable), and reduced-motion users
 * should get the content without any scroll-linked choreography at all.
 *
 * Starts `false` (matches SSR output) and flips after mount once we can
 * read the media queries — a one-time progressive-enhancement swap
 * rather than a hydration mismatch.
 */
export function useScrollJackingEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    // Reading media queries requires the DOM, so this can only run after
    // mount — the resulting state flip is a one-time progressive
    // enhancement, not a reactive sync loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(!reducedMotion && !coarsePointer && !narrow);
  }, []);

  return enabled;
}
