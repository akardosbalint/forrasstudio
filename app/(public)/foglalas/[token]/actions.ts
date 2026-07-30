"use server";

import { prisma } from "@/lib/prisma";
import {
  BookingError,
  cancelBookingCore,
  createBookingCore,
  rescheduleBookingCore,
} from "@/lib/booking/actions-core";

export type BookingActionState = { error?: string; success?: boolean } | undefined;

function manageLinkBase(token: string): string {
  return `${(process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "")}/foglalas/${token}`;
}

async function resolveLeadIdFromToken(token: string): Promise<string> {
  const link = await prisma.questionnaireLink.findUnique({ where: { token } });
  if (!link) throw new BookingError("Érvénytelen link.");
  return link.leadId;
}

export async function createBookingPublic(
  token: string,
  startsAtIso: string,
): Promise<BookingActionState> {
  try {
    const leadId = await resolveLeadIdFromToken(token);
    await createBookingCore({
      leadId,
      startsAt: new Date(startsAtIso),
      actingUserId: null,
      manageLinkBase: manageLinkBase(token),
    });
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof BookingError
          ? error.message
          : "Ismeretlen hiba történt a foglalás során.",
    };
  }
}

export async function cancelBookingPublic(
  token: string,
  bookingId: string,
): Promise<BookingActionState> {
  try {
    const leadId = await resolveLeadIdFromToken(token);
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.leadId !== leadId) {
      throw new BookingError("Ez a foglalás nem ehhez a linkhez tartozik.");
    }
    await cancelBookingCore({
      bookingId,
      actingUserId: null,
      manageLinkBase: manageLinkBase(token),
    });
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof BookingError
          ? error.message
          : "Ismeretlen hiba történt a lemondás során.",
    };
  }
}

export async function rescheduleBookingPublic(
  token: string,
  bookingId: string,
  newStartsAtIso: string,
): Promise<BookingActionState> {
  try {
    const leadId = await resolveLeadIdFromToken(token);
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.leadId !== leadId) {
      throw new BookingError("Ez a foglalás nem ehhez a linkhez tartozik.");
    }
    await rescheduleBookingCore({
      bookingId,
      newStartsAt: new Date(newStartsAtIso),
      actingUserId: null,
      manageLinkBase: manageLinkBase(token),
    });
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof BookingError
          ? error.message
          : "Ismeretlen hiba történt az átütemezés során.",
    };
  }
}
