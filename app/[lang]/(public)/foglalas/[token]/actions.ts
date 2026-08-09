"use server";

import { prisma } from "@/lib/prisma";
import {
  BookingError,
  cancelBookingCore,
  createBookingCore,
  rescheduleBookingCore,
} from "@/lib/booking/actions-core";
import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export type BookingActionState = { error?: string; success?: boolean } | undefined;

function manageLinkBase(lang: Locale, token: string): string {
  return `${(process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "")}/${lang}/foglalas/${token}`;
}

async function resolveLeadIdFromToken(token: string): Promise<string> {
  const link = await prisma.questionnaireLink.findUnique({ where: { token } });
  if (!link) throw new BookingError("INVALID_LINK", "Érvénytelen link.");
  return link.leadId;
}

async function resolveErrorMessage(
  lang: Locale,
  error: unknown,
): Promise<string> {
  const dict = await getDictionary(lang);
  const errors = dict.flows.booking.errors;
  if (error instanceof BookingError) {
    return errors[error.code as keyof typeof errors] ?? errors.UNKNOWN;
  }
  return errors.UNKNOWN;
}

export async function createBookingPublic(
  lang: Locale,
  token: string,
  startsAtIso: string,
): Promise<BookingActionState> {
  try {
    const leadId = await resolveLeadIdFromToken(token);
    await createBookingCore({
      leadId,
      startsAt: new Date(startsAtIso),
      actingUserId: null,
      manageLinkBase: manageLinkBase(lang, token),
      locale: lang,
    });
    return { success: true };
  } catch (error) {
    return { error: await resolveErrorMessage(lang, error) };
  }
}

export async function cancelBookingPublic(
  lang: Locale,
  token: string,
  bookingId: string,
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
      manageLinkBase: manageLinkBase(lang, token),
      locale: lang,
    });
    return { success: true };
  } catch (error) {
    return { error: await resolveErrorMessage(lang, error) };
  }
}

export async function rescheduleBookingPublic(
  lang: Locale,
  token: string,
  bookingId: string,
  newStartsAtIso: string,
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
      manageLinkBase: manageLinkBase(lang, token),
      locale: lang,
    });
    return { success: true };
  } catch (error) {
    return { error: await resolveErrorMessage(lang, error) };
  }
}
