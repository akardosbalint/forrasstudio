import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Ideiglenes placeholder — a tényleges foglalási motor (szabad sávok,
// 24 órás/munkanap/9-18/90 perces szabályok) a Phase 4-ben készül el. A
// token ugyanaz, mint a kérdőív-linké: a publikus "lead session"
// azonosítója a kérdőív kitöltésétől a foglalásig.
export default async function BookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const link = await prisma.questionnaireLink.findUnique({
    where: { token },
    include: { lead: true },
  });

  if (!link) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h1 className="mb-2 font-display text-lg font-semibold">
          Érvénytelen link
        </h1>
      </div>
    );
  }

  if (!link.usedAt) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h1 className="mb-2 font-display text-lg font-semibold">
          Előbb töltsd ki a kérdőívet
        </h1>
        <p className="mb-4 text-sm text-ink/60">
          Az időpontfoglalás csak a kérdőív beküldése után érhető el.
        </p>
        <Link
          href={`/kerdoiv/${token}`}
          className="text-sm font-medium text-brook underline"
        >
          Kérdőív kitöltése
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
      <h1 className="mb-2 font-display text-lg font-semibold">
        Discovery call foglalás — hamarosan
      </h1>
      <p className="text-sm text-ink/60">
        Kedves {link.lead.name}! Köszönjük a kérdőív kitöltését. Az
        időpontfoglaló felület fejlesztés alatt áll — kollégánk hamarosan
        felveszi veled a kapcsolatot egy időpont egyeztetéséhez.
      </p>
    </div>
  );
}
