/** Slow, low-amplitude looping "flowing water" lines — a quiet ambient
 * background for the final CTA, echoing the hero's blueprint streams
 * without competing for attention. Pure CSS animation (see .ambient-flow-path
 * in globals.css), so the existing prefers-reduced-motion override
 * neutralizes it automatically like the rest of the page's CSS-driven
 * motion. */
export function AmbientFlow() {
  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox="0 0 800 400"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
    >
      <path
        d="M-20,90 C180,50 300,130 480,90 S680,50 820,100"
        fill="none"
        stroke="var(--color-spring)"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="ambient-flow-path"
        style={{ animationDelay: "0s" }}
      />
      <path
        d="M-20,210 C200,250 320,170 500,210 S700,250 820,200"
        fill="none"
        stroke="var(--color-brook)"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="ambient-flow-path"
        style={{ animationDelay: "-5s" }}
      />
      <path
        d="M-20,330 C190,290 330,350 500,310 S720,270 820,320"
        fill="none"
        stroke="var(--color-spring)"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="ambient-flow-path"
        style={{ animationDelay: "-10s" }}
      />
    </svg>
  );
}
