export const PERIODS = ["day", "week", "month", "year", "all"] as const;
export type Period = (typeof PERIODS)[number];

export const PERIOD_LABELS: Record<Period, string> = {
  day: "Mai nap",
  week: "Ez a hét",
  month: "Ez a hónap",
  year: "Ez az év",
  all: "Összes (all-time)",
};

export function isPeriod(value: string | undefined): value is Period {
  return !!value && (PERIODS as readonly string[]).includes(value);
}

// A kiválasztott nézethez tartozó időszak-kezdet — a mutatók ettől mostig
// összesítődnek. "all" esetén nincs alsó korlát.
export function periodStart(period: Period, now: Date = new Date()): Date | null {
  const start = new Date(now);
  switch (period) {
    case "day":
      start.setHours(0, 0, 0, 0);
      return start;
    case "week": {
      const day = start.getDay(); // 0 = vasárnap
      const diffToMonday = day === 0 ? 6 : day - 1;
      start.setDate(start.getDate() - diffToMonday);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    case "month":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      return start;
    case "year":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      return start;
    case "all":
      return null;
  }
}
