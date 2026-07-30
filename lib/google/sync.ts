import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit/log";
import { SYSTEM_STAGE_KEYS } from "@/lib/pipeline/stages";
import {
  getCalendarClientForRep,
  GoogleCalendarNotConnectedError,
} from "@/lib/google/connection";

// Periodikus (polling) szinkronizáció: ha a rep törli vagy áthelyezi a
// discovery call eseményt közvetlenül a Google Calendarban (nem a
// CRM-en keresztül), ezt észleljük és visszavezetjük a CRM állapotába
// (spec 5. pont: "a CRM-nek észlelnie és szinkronizálnia kell").
//
// Valós idejű webhook (push notification channel) helyett szándékosan
// polling — a Google push notification egy publikusan elérhető HTTPS
// végpontot igényel, amit ebben a fejlesztési fázisban nem lehet éles
// Google-lel tesztelni; a polling ugyanazt az eredményt adja, csak nem
// azonnal. Bővítési pont: app/api/google/webhook lehetne a jövőben egy
// `calendar.events.watch` alapú push csatorna fogadója.
export async function syncRepCalendar(repId: string): Promise<void> {
  const bookings = await prisma.booking.findMany({
    where: {
      repId,
      status: "CONFIRMED",
      googleEventId: { not: null },
      startsAt: { gt: new Date() },
    },
  });

  if (bookings.length === 0) return;

  let calendar: Awaited<ReturnType<typeof getCalendarClientForRep>>["calendar"];
  let calendarId: string;
  try {
    ({ calendar, calendarId } = await getCalendarClientForRep(repId));
  } catch (error) {
    if (error instanceof GoogleCalendarNotConnectedError) return;
    throw error;
  }

  const bookingPendingStage = await prisma.pipelineStage.findUnique({
    where: { key: SYSTEM_STAGE_KEYS.BOOKING_PENDING },
  });

  for (const booking of bookings) {
    try {
      const { data: event } = await calendar.events.get({
        calendarId,
        eventId: booking.googleEventId!,
      });

      if (event.status === "cancelled") {
        await handleExternallyCancelled(booking, bookingPendingStage?.id);
        continue;
      }

      const externalStart = event.start?.dateTime
        ? new Date(event.start.dateTime)
        : null;
      const externalEnd = event.end?.dateTime
        ? new Date(event.end.dateTime)
        : null;

      if (
        externalStart &&
        externalEnd &&
        (externalStart.getTime() !== booking.startsAt.getTime() ||
          externalEnd.getTime() !== booking.endsAt.getTime())
      ) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { startsAt: externalStart, endsAt: externalEnd },
        });
        await writeAuditLog({
          userId: null,
          entityType: "Booking",
          entityId: booking.id,
          action: "booking.updated_externally",
          metadata: {
            previousStartsAt: booking.startsAt.toISOString(),
            newStartsAt: externalStart.toISOString(),
          },
        });
      }
    } catch (error) {
      const isNotFound =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 404;

      if (isNotFound) {
        await handleExternallyCancelled(booking, bookingPendingStage?.id);
        continue;
      }
      console.error(
        `[google-sync] Hiba a(z) ${booking.id} foglalás szinkronizálásakor:`,
        error,
      );
    }
  }
}

async function handleExternallyCancelled(
  booking: { id: string; leadId: string },
  bookingPendingStageId: string | undefined,
) {
  const updates: Promise<unknown>[] = [
    prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    }),
  ];
  if (bookingPendingStageId) {
    updates.push(
      prisma.lead.update({
        where: { id: booking.leadId },
        data: { currentStageId: bookingPendingStageId },
      }),
      prisma.statusHistory.create({
        data: {
          leadId: booking.leadId,
          toStageId: bookingPendingStageId,
          changedById: null,
          note: "Discovery call törölve a Google Calendarban (külső változás észlelve).",
        },
      }),
    );
  }
  await Promise.all(updates);

  await writeAuditLog({
    userId: null,
    entityType: "Booking",
    entityId: booking.id,
    action: "booking.cancelled_externally",
    metadata: { leadId: booking.leadId },
  });
}

export async function syncAllConnectedCalendars(): Promise<void> {
  const connections = await prisma.googleCalendarConnection.findMany({
    where: { syncStatus: "CONNECTED" },
    select: { repId: true },
  });

  for (const connection of connections) {
    try {
      await syncRepCalendar(connection.repId);
    } catch (error) {
      console.error(
        `[google-sync] Hiba a(z) ${connection.repId} rep naptárának szinkronizálásakor:`,
        error,
      );
    }
  }
}
