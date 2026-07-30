import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/booking/slots";
import { SYSTEM_STAGE_KEYS } from "@/lib/pipeline/stages";
import { SlotPicker } from "./SlotPicker";
import { BookingControls } from "./BookingControls";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const link = await prisma.questionnaireLink.findUnique({
    where: { token },
    include: {
      lead: {
        include: {
          owner: true,
          currentStage: true,
          questionnaireResponses: {
            orderBy: { submittedAt: "desc" },
            take: 1,
          },
          bookings: { orderBy: { startsAt: "desc" } },
        },
      },
    },
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

  const { lead } = link;

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

  if (!lead.owner) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h1 className="mb-2 font-display text-lg font-semibold">
          Foglalás jelenleg nem elérhető
        </h1>
        <p className="text-sm text-ink/60">
          A leadhez még nincs hozzárendelt kollégánk — hamarosan felvesszük
          veled a kapcsolatot.
        </p>
      </div>
    );
  }

  if (lead.currentStage.key === SYSTEM_STAGE_KEYS.CALL_SCHEDULED) {
    const activeBooking = lead.bookings.find((b) => b.status === "CONFIRMED");
    if (activeBooking) {
      const submittedAt =
        lead.questionnaireResponses[0]?.submittedAt ?? new Date();
      const rescheduleSlots = await getAvailableSlots({
        repId: lead.owner.id,
        submittedAt,
      });
      return (
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-paper-3 bg-white p-6">
            <h1 className="mb-2 font-display text-lg font-semibold">
              Discovery call lefoglalva
            </h1>
            <p className="text-sm text-ink/70">
              {activeBooking.startsAt.toLocaleString("hu-HU", {
                timeZone: "Europe/Budapest",
                dateStyle: "full",
                timeStyle: "short",
              })}{" "}
              — {lead.owner.name}
            </p>
          </div>
          <BookingControls
            token={token}
            bookingId={activeBooking.id}
            rescheduleSlots={rescheduleSlots.map((d) => d.toISOString())}
          />
        </div>
      );
    }
  }

  if (lead.currentStage.key !== SYSTEM_STAGE_KEYS.BOOKING_PENDING) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h1 className="mb-2 font-display text-lg font-semibold">
          Nincs aktív foglalási teendő
        </h1>
        <p className="text-sm text-ink/60">
          Ha kérdésed van, keresd a kapcsolattartódat.
        </p>
      </div>
    );
  }

  const submittedAt = lead.questionnaireResponses[0]?.submittedAt ?? new Date();
  const slots = await getAvailableSlots({
    repId: lead.owner.id,
    submittedAt,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-xl font-semibold">
          Discovery call foglalása
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Kedves {lead.name}! Válassz egy 90 perces időpontot {lead.owner.name}{" "}
          kollégánkkal.
        </p>
      </div>
      <SlotPicker
        token={token}
        slots={slots.map((d) => d.toISOString())}
        mode="book"
      />
    </div>
  );
}
