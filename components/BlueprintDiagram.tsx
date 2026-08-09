import type { Dictionary } from "@/dictionaries";

const DIAGRAM_POSITIONS = [
  { y: 50, color: "var(--color-spring)" },
  { y: 126, color: "var(--color-brook)" },
  { y: 202, color: "var(--color-spring)" },
  { y: 278, color: "var(--color-brook)" },
  { y: 354, color: "var(--color-spring)" },
  { y: 430, color: "var(--color-brook)" },
];

export const DIAGRAM_MODULES = DIAGRAM_POSITIONS;

export const DIAGRAM_CENTER_X = 600;
export const DIAGRAM_CENTER_Y = 240;

type ControlledBlueprintDiagramProps = {
  dict: Dictionary["site"]["blueprintDiagram"];
  registerPath: (el: SVGPathElement | null, index: number) => void;
  registerNode: (el: SVGGElement | null) => void;
};

/** Renders fully visible by default — no hidden state baked into the
 * markup — so it looks correct with JS disabled or reduced motion
 * enabled. Hero.tsx's animation effect is what hides these elements
 * (via gsap.set) before playing the intro, only when motion is
 * actually going to run; refs let that effect reach each path and the
 * central node individually. `strokeDasharray={1}` is harmless at rest
 * (with the default dashoffset of 0 it just renders as one dash
 * spanning the whole normalized path length, i.e. a solid line). */
export function ControlledBlueprintDiagram({
  dict,
  registerPath,
  registerNode,
}: ControlledBlueprintDiagramProps) {
  return (
    <svg
      viewBox="0 0 680 520"
      role="img"
      aria-label={dict.ariaLabel}
      className="h-auto w-full max-w-xl"
    >
      {DIAGRAM_POSITIONS.map((module, index) => (
        <g key={dict.moduleLabels[index]} className="diagram-node">
          <path
            ref={(el) => registerPath(el, index)}
            d={`M246,${module.y} C400,${module.y} 460,${DIAGRAM_CENTER_Y} ${DIAGRAM_CENTER_X - 56},${DIAGRAM_CENTER_Y}`}
            fill="none"
            stroke={module.color}
            strokeWidth={2}
            strokeLinecap="round"
            pathLength={1}
            style={{ strokeDasharray: 1 }}
          />
          <circle cx={238} cy={module.y} r={5} fill={module.color} />
          <text
            x={8}
            y={module.y}
            textAnchor="start"
            dominantBaseline="middle"
            className="font-mono text-[12px] fill-paper/80"
          >
            {dict.moduleLabels[index]}
          </text>
        </g>
      ))}

      <g ref={registerNode} style={{ transformOrigin: `${DIAGRAM_CENTER_X}px ${DIAGRAM_CENTER_Y}px` }}>
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
          y={DIAGRAM_CENTER_Y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-mono text-[13px] font-semibold tracking-tight fill-ink"
        >
          MI
        </text>
      </g>
    </svg>
  );
}
