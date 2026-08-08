"use server";

import { prisma } from "@/lib/prisma";
import {
  BookingError,
  cancelBookingCore,
  createBookingCore,
  rescheduleBookingCore,
} from "@/lib/booking/actions-core";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/dictionaries";

export type BookingActionState = { error?: string; success?: boolean } | undefined;

function manageLinkBase(token: string, lang: Locale): string {
  return `${(process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "")}/${lang}/foglalas/${token}`;
}

async function resolveLeadIdFromToken(token: string): Promise<string> {
  const link = await prisma.questionnaireLink.findUnique({ where: { token } });
  if (!link) throw new BookingError("INVALID_LINK", "Érvénytelen link.");
  return link.leadId;
}

async function localizedError(lang: Locale, code: string): Promise<string> {
  const dict = await getDictionary(lang);
  const errors: Record<string, string> = dict.flows.booking.errors;
  return errors[code] ?? errors.UNKNOWN;
}

export async function createBookingPublic(
  token: string,
  startsAtIso: string,
  lang: Locale,
): Promise<BookingActionState> {
  try {
    const leadId = await resolveLeadIdFromToken(token);
    await createBookingCore({
      leadId,
      startsAt: new Date(startsAtIso),
      actingUserId: null,
      manageLinkBase: manageLinkBase(token, lang),
      locale: lang,
    });
    return { success: true };
  } catch (error) {
    return {
      error: await localizedError(
        lang,
        error instanceof BookingError ? error.code : "UNKNOWN",
      ),
    };
  }
}

export async function cancelBookingPublic(
  token: string,
  bookingId: string,
  lang: Locale,
): Promise<BookingActionState> {
  try {
    const leadId = await resolveLeadIdFromToken(token);
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.leadId !== leadId) {
      throw new BookingError(
        "LINK_MISMATCH",
        "Ez a foglalás nem ehhez a linkhez tartozik.",
      );
    }
    await cancelBookingCore({
      bookingId,
      actingUserId: null,
      manageLinkBase: manageLinkBase(token, lang),
      locale: lang,
    });
    return { success: true };
  } catch (error) {
    return {
      error: await localizedError(
        lang,
        error instanceof BookingError ? error.code : "UNKNOWN",
      ),
    };
  }
}

export async function rescheduleBookingPublic(
  token: string,
  bookingId: string,
  newStartsAtIso: string,
  lang: Locale,
): Promise<BookingActionState> {
  try {
    const leadId = await resolveLeadIdFromToken(token);
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.leadId !== leadId) {
      throw new BookingError(
        "LINK_MISMATCH",
        "Ez a foglalás nem ehhez a linkhez tartozik.",
      );
    }
    await rescheduleBookingCore({
      bookingId,
      newStartsAt: new Date(newStartsAtIso),
      actingUserId: null,
      manageLinkBase: manageLinkBase(token, lang),
      locale: lang,
    });
    return { success: true };
  } catch (error) {
    return {
      error: await localizedError(
        lang,
        error instanceof BookingError ? error.code : "UNKNOWN",
      ),
    };
  }
}
