export const DIAGRAM_MODULES = [
  { label: "Időpontfoglalás", y: 50, color: "var(--color-spring)" },
  { label: "Fizetés", y: 145, color: "var(--color-brook)" },
  { label: "Ügyfél-CRM", y: 240, color: "var(--color-spring)" },
  { label: "Biztonságos beléptetés", y: 335, color: "var(--color-brook)" },
  { label: "AI-alapú automatizáció", y: 430, color: "var(--color-spring)" },
];

export const DIAGRAM_CENTER_X = 600;
export const DIAGRAM_CENTER_Y = 240;

const DIAGRAM_ARIA_LABEL =
  "Rendszerdiagram: időpontfoglalás, fizetés, ügyfél-CRM, biztonságos beléptetés és AI-alapú automatizáció egy közös rendszerbe, 'A te forrásod'-ba folynak össze.";

/** Simple, self-contained CSS-driven version — used whenever the GSAP
 * pinned scroll-sequence is disabled (touch devices, reduced motion). */
export function BlueprintDiagram() {
  return (
    <svg
      viewBox="0 0 680 520"
      role="img"
      aria-label={DIAGRAM_ARIA_LABEL}
      className="h-auto w-full max-w-xl"
    >
      {DIAGRAM_MODULES.map((module, index) => (
        <g key={module.label} className="diagram-node">
          <path
            d={`M246,${module.y} C400,${module.y} 460,${DIAGRAM_CENTER_Y} ${DIAGRAM_CENTER_X - 56},${DIAGRAM_CENTER_Y}`}
            fill="none"
            stroke={module.color}
            strokeWidth={2}
            strokeLinecap="round"
            pathLength={1}
            className="stream-path"
            style={{ animationDelay: `${index * 0.18}s` }}
          />
          <circle cx={238} cy={module.y} r={5} fill={module.color} />
          <text
            x={8}
            y={module.y}
            textAnchor="start"
            dominantBaseline="middle"
            className="font-mono text-[12px] fill-paper/80"
          >
            {module.label}
          </text>
        </g>
      ))}

      <g className="source-node">
        <circle
          cx={DIAGRAM_CENTER_X}
          cy={DIAGRAM_CENTER_Y}
          r={56}
          fill="var(--color-amber)"
          stroke="var(--color-amber-dark)"
          strokeWidth={1.5}
        />
        <text
          x={DIAGRAM_CENTER_X}
          y={DIAGRAM_CENTER_Y - 8}
          textAnchor="middle"
          className="font-mono text-[11px] font-medium uppercase tracking-wide fill-ink"
        >
          A te
        </text>
        <text
          x={DIAGRAM_CENTER_X}
          y={DIAGRAM_CENTER_Y + 12}
          textAnchor="middle"
          className="font-mono text-[13px] font-semibold uppercase tracking-wide fill-ink"
        >
          forrásod
        </text>
      </g>
    </svg>
  );
}

type ControlledBlueprintDiagramProps = {
  registerPath: (el: SVGPathElement | null, index: number) => void;
  registerNode: (el: SVGGElement | null) => void;
};

/** Same geometry, but with no CSS-driven animation — every path and the
 * central node start in their "hidden" state via inline styles, and are
 * exposed via refs so a GSAP timeline (see Hero.tsx) can scrub them
 * against scroll progress instead. */
export function ControlledBlueprintDiagram({
  registerPath,
  registerNode,
}: ControlledBlueprintDiagramProps) {
  return (
    <svg
      viewBox="0 0 680 520"
      role="img"
      aria-label={DIAGRAM_ARIA_LABEL}
      className="h-auto w-full max-w-xl"
    >
      {DIAGRAM_MODULES.map((module, index) => (
        <g key={module.label} className="diagram-node">
          <path
            ref={(el) => registerPath(el, index)}
            d={`M246,${module.y} C400,${module.y} 460,${DIAGRAM_CENTER_Y} ${DIAGRAM_CENTER_X - 56},${DIAGRAM_CENTER_Y}`}
            fill="none"
            stroke={module.color}
            strokeWidth={2}
            strokeLinecap="round"
            pathLength={1}
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />
          <circle cx={238} cy={module.y} r={5} fill={module.color} />
          <text
            x={8}
            y={module.y}
            textAnchor="start"
            dominantBaseline="middle"
            className="font-mono text-[12px] fill-paper/80"
          >
            {module.label}
          </text>
        </g>
      ))}

      <g ref={registerNode} style={{ opacity: 0, transformOrigin: `${DIAGRAM_CENTER_X}px ${DIAGRAM_CENTER_Y}px` }}>
        <circle
          cx={DIAGRAM_CENTER_X}
          cy={DIAGRAM_CENTER_Y}
          r={56}
          fill="var(--color-amber)"
          stroke="var(--color-amber-dark)"
          strokeWidth={1.5}
        />
        <text
          x={DIAGRAM_CENTER_X}
          y={DIAGRAM_CENTER_Y - 8}
          textAnchor="middle"
          className="font-mono text-[11px] font-medium uppercase tracking-wide fill-ink"
        >
          A te
        </text>
        <text
          x={DIAGRAM_CENTER_X}
          y={DIAGRAM_CENTER_Y + 12}
          textAnchor="middle"
          className="font-mono text-[13px] font-semibold uppercase tracking-wide fill-ink"
        >
          forrásod
        </text>
      </g>
    </svg>
  );
}
