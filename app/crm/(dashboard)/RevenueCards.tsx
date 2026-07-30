import { formatHuf } from "@/lib/dashboard/format";
import type { RevenueSummary } from "@/lib/dashboard/queries";

export function RevenueCards({ summary }: { summary: RevenueSummary }) {
  const cards = [
    {
      label: "Kiadott ajánlat",
      value: formatHuf(summary.proposalsIssued.totalCents),
      sub: `${summary.proposalsIssued.count} db`,
    },
    {
      label: "TCV (megnyert)",
      value: formatHuf(summary.won.tcvCents),
      sub: `${summary.won.count} nyert lead`,
    },
    {
      label: "Cash Collected",
      value: formatHuf(summary.won.cashCollectedCents),
      sub: "megnyert leadekből",
    },
    {
      label: "Elveszett",
      value: String(summary.lost.count),
      sub: "lead a kiválasztott időszakban",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-paper-3 bg-white p-4"
        >
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
