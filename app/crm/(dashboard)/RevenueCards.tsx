import { formatHuf } from "@/lib/dashboard/format";
import type { RevenueSummary } from "@/lib/dashboard/queries";

type Accent = "spring" | "amber" | "pink" | "brook";

const ACCENT_BAR: Record<Accent, string> = {
  spring: "bg-spring",
  amber: "bg-amber",
  pink: "bg-pink",
  brook: "bg-brook",
};

export function RevenueCards({ summary }: { summary: RevenueSummary }) {
  const cards: { label: string; value: string; sub: string; accent: Accent }[] = [
    {
      label: "Kiadott ajánlat",
      value: formatHuf(summary.proposalsIssued.totalCents),
      sub: `${summary.proposalsIssued.count} db`,
      accent: "brook",
    },
    {
      label: "TCV (megnyert)",
      value: formatHuf(summary.won.tcvCents),
      sub: `${summary.won.count} nyert lead`,
      accent: "amber",
    },
    {
      label: "Cash Collected",
      value: formatHuf(summary.won.cashCollectedCents),
      sub: "megnyert leadekből",
      accent: "spring",
    },
    {
      label: "Elveszett",
      value: String(summary.lost.count),
      sub: "lead a kiválasztott időszakban",
      accent: "pink",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="overflow-hidden rounded-xl border border-paper-3 bg-white p-4"
        >
          <span
            aria-hidden="true"
            className={`-mx-4 -mt-4 mb-3 block h-1 ${ACCENT_BAR[card.accent]}`}
          />
          <p className="text-xs uppercase tracking-wide text-ink/50">
            {card.label}
          </p>
          <p className="font-display text-xl font-semibold">{card.value}</p>
          <p className="text-xs text-ink/40">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
