const modules = [
  { label: "Időpontfoglalás", y: 50, color: "var(--color-spring)" },
  { label: "Fizetés", y: 145, color: "var(--color-brook)" },
  { label: "Ügyfél-CRM", y: 240, color: "var(--color-spring)" },
  { label: "Biztonságos beléptetés", y: 335, color: "var(--color-brook)" },
  { label: "AI-alapú automatizáció", y: 430, color: "var(--color-spring)" },
];

const CENTER_X = 600;
const CENTER_Y = 240;

export function BlueprintDiagram() {
  return (
    <svg
      viewBox="0 0 680 520"
      role="img"
      aria-label="Rendszerdiagram: időpontfoglalás, fizetés, ügyfél-CRM, biztonságos beléptetés és AI-alapú automatizáció egy közös rendszerbe, 'A te forrásod'-ba folynak össze."
      className="h-auto w-full max-w-xl"
    >
      {modules.map((module, index) => (
        <g key={module.label}>
          <path
            d={`M246,${module.y} C400,${module.y} 460,${CENTER_Y} ${CENTER_X - 56},${CENTER_Y}`}
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

      <circle
        cx={CENTER_X}
        cy={CENTER_Y}
        r={56}
        fill="var(--color-amber)"
        stroke="var(--color-amber-dark)"
        strokeWidth={1.5}
      />
      <text
        x={CENTER_X}
        y={CENTER_Y - 8}
        textAnchor="middle"
        className="font-mono text-[11px] font-medium uppercase tracking-wide fill-ink"
      >
        A te
      </text>
      <text
        x={CENTER_X}
        y={CENTER_Y + 12}
        textAnchor="middle"
        className="font-mono text-[13px] font-semibold uppercase tracking-wide fill-ink"
      >
        forrásod
      </text>
    </svg>
  );
}
