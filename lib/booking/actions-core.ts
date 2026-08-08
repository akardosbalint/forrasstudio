import "server-only";

import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit/log";
import { renderEmailTemplate } from "@/lib/email/templates";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { buildIcsEvent } from "@/lib/calendar/ics";
import { isBookableSlot, DEFAULT_TIMEZONE } from "@/lib/booking/rules";
import { SYSTEM_STAGE_KEYS } from "@/lib/pipeline/stages";
import { getGoogleBusyIntervals } from "@/lib/google/freebusy";
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent } from "@/lib/google/events";
import { isBookingOverlapConstraintError } from "@/lib/prisma/errors";
import type { Locale } from "@/lib/i18n/config";

// A hibaüzenetek (`message`) mindig magyarul vannak — ezeket a CRM (app/crm)
// változatlanul, közvetlenül megjeleníti. A publikus, tokenes flow
// (app/[lang]/(public)/**) NEM ezt a szöveget mutatja a látogatónak, hanem
// a stabil `code`-ot fordítja le a saját (hu/en) szótárával — lásd az ottani
// actions.ts fájlokat.
export class BookingError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function formatSlot(date: Date, locale: Locale): string {
  return date.toLocaleString(locale === "en" ? "en-US" : "hu-HU", {
    timeZone: DEFAULT_TIMEZONE,
    dateStyle: "full",
    timeStyle: "short",
  });
}

function callDescription(locale: Locale): string {
  return locale === "en"
    ? "FlowCore discovery call (90 minutes)."
    : "FlowCore discovery call (90 perc).";
}

function toBase64(text: string): string {
  return Buffer.from(text, "utf-8").toString("base64");
}

// Ha a hívó (publikus flow) explicit locale-t ad át, és az eltér a lead
// jelenleg tárolt nyelvétől, frissítjük — ez teszi lehetővé, hogy a
// látogató a saját token-linkjén váltott nyelve legyen a mérvadó a
// következő (pl. emlékeztető) emailekhez is. A CRM-ből induló hívások nem
// adnak át explicit locale-t, így nem írják felül a lead nyelvét.
async function resolveLocale(
  leadId: string,
  currentLocale: string,
  explicitLocale: Locale | undefined,
): Promise<Locale> {
  if (!explicitLocale || explicitLocale === currentLocale) {
    return (currentLocale === "en" ? "en" : "hu") as Locale;
  }
  await prisma.lead.update({
    where: { id: leadId },
    data: { locale: explicitLocale },
  });
  return explicitLocale;
}

type EmailOutcome = { sent: boolean; error?: string | null };

async function sendBookingConfirmationEmails(params: {
  leadName: string;
  leadEmail: string | null;
  repName: string;
  repEmail: string;
  startsAt: Date;
  endsAt: Date;
  bookingId: string;
  manageLink: string;
  locale: Locale;
}): Promise<{ client: EmailOutcome | null; rep: EmailOutcome }> {
  const startsAtFormatted = formatSlot(params.startsAt, params.locale);
  const ics = buildIcsEvent({
    uid: `booking-${params.bookingId}@flowcore-crm`,
    startsAt: params.startsAt,
    endsAt: params.endsAt,
    summary: `Discovery Call — ${params.leadName}`,
    description: callDescription(params.locale),
    organizerEmail: params.repEmail,
    attendeeEmails: params.leadEmail
      ? [params.repEmail, params.leadEmail]
      : [params.repEmail],
  });
  const attachments = [
    { filename: "discovery-call.ics", content: toBase64(ics) },
  ];

  let client: EmailOutcome | null = null;
  if (params.leadEmail) {
    const clientEmail = await renderEmailTemplate(
      "booking_confirmation_client",
      params.locale,
      {
        leadName: params.leadName,
        repName: params.repName,
        startsAtFormatted,
        manageLink: params.manageLink,
      },
    );
    const clientResult = await sendTransactionalEmail({
      to: params.leadEmail,
      subject: clientEmail.subject,
      html: clientEmail.html,
      text: clientEmail.text,
      attachments,
    });
    client = { sent: clientResult.ok, error: clientResult.error };
  }

  // A sales rep mindig a belső (magyar) sablont kapja, függetlenül a lead
  // nyelvétől — a CRM csapat magyarul dolgozik.
  const repEmail = await renderEmailTemplate("booking_confirmation_rep", "hu", {
    leadName: params.leadName,
    repName: params.repName,
    startsAtFormatted: formatSlot(params.startsAt, "hu"),
  });
  const repResult = await sendTransactionalEmail({
    to: params.repEmail,
    subject: repEmail.subject,
    html: repEmail.html,
    text: repEmail.text,
    attachments,
  });

  return { client, rep: { sent: repResult.ok, error: repResult.error } };
}

// Új foglalás létrehozása — a hívó felelős azért, hogy a `startsAt`
// szerveroldalon frissen validált legyen (soha ne a kliens által küldött
// időpontban bízzunk vakon), de itt is újra lefuttatjuk a teljes
// szabálykészletet biztonsági hálóként.
export async function createBookingCore(params: {
  leadId: string;
  startsAt: Date;
  actingUserId: string | null;
  manageLinkBase: string;
  locale?: Locale;
}) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.leadId },
    include: {
      owner: true,
      currentStage: true,
      questionnaireResponses: { orderBy: { submittedAt: "desc" }, take: 1 },
    },
  });
  if (!lead) throw new BookingError("LEAD_NOT_FOUND", "A lead nem található.");
  if (!lead.owner) {
    throw new BookingError(
      "NO_OWNER",
      "A leadhez nincs hozzárendelt sales rep — nem foglalható discovery call.",
    );
  }
  if (lead.currentStage.key !== SYSTEM_STAGE_KEYS.BOOKING_PENDING) {
    throw new BookingError(
      "WRONG_STAGE",
      "Ehhez a leadhez jelenleg nem lehet discovery call-t foglalni.",
    );
  }
  const submission = lead.questionnaireResponses[0];
  if (!submission) {
    throw new BookingError(
      "MISSING_QUESTIONNAIRE",
      "A kérdőív beküldése hiányzik.",
    );
  }

  const locale = await resolveLocale(lead.id, lead.locale, params.locale);

  const endsAt = new Date(params.startsAt.getTime() + 90 * 60_000);

  const [existingBookings, googleBusyIntervals] = await Promise.all([
    prisma.booking.findMany({
      where: { repId: lead.owner.id, status: "CONFIRMED" },
      select: { startsAt: true, endsAt: true },
    }),
    getGoogleBusyIntervals(lead.owner.id, params.startsAt, endsAt),
  ]);

  if (
    !isBookableSlot({
      candidateStart: params.startsAt,
      submittedAt: submission.submittedAt,
      existingBookings: [...existingBookings, ...googleBusyIntervals],
    })
  ) {
    throw new BookingError(
      "SLOT_UNAVAILABLE",
      "Ez az időpont már nem választható (foglalt, lejárt, vagy nem teljesíti a szabályokat). Kérjük válassz másikat.",
    );
  }

  const callScheduledStage = await prisma.pipelineStage.findUnique({
    where: { key: SYSTEM_STAGE_KEYS.CALL_SCHEDULED },
  });
  if (!callScheduledStage) {
    throw new BookingError("MISSING_STAGE", "Hiányzó pipeline stádium.");
  }

  // Az `isBookableSlot` fenti ellenőrzése nem atomi (read-then-write) —
  // ha két kérés versenyez ugyanarra az időpontra, mindkettő átmehet ezen
  // a checken. A tényleges kizárást a DB-szintű
  // `bookings_no_overlap_confirmed` EXCLUDE constraint garantálja (lásd
  // prisma/schema.prisma), ezt itt csak elkapjuk és barátságos hibává
  // alakítjuk.
  let booking;
  try {
    [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          leadId: lead.id,
          repId: lead.owner.id,
          startsAt: params.startsAt,
          endsAt,
          status: "CONFIRMED",
          createdById: params.actingUserId,
        },
      }),
      prisma.lead.update({
        where: { id: lead.id },
        data: { currentStageId: callScheduledStage.id },
      }),
      prisma.statusHistory.create({
        data: {
          leadId: lead.id,
          fromStageId: lead.currentStageId,
          toStageId: callScheduledStage.id,
          changedById: params.actingUserId,
          note: "Discovery call lefoglalva.",
        },
      }),
    ]);
  } catch (error) {
    if (isBookingOverlapConstraintError(error)) {
      throw new BookingError(
        "SLOT_TAKEN_RACE",
        "Ezt az időpontot közben valaki más lefoglalta. Kérjük válassz másikat.",
      );
    }
    throw error;
  }

  await writeAuditLog({
    userId: params.actingUserId,
    entityType: "Booking",
    entityId: booking.id,
    action: "booking.created",
    metadata: { leadId: lead.id, startsAt: params.startsAt.toISOString() },
  });

  const googleEventId = await createGoogleCalendarEvent({
    repId: lead.owner.id,
    summary: `Discovery Call — ${lead.name}`,
    description: callDescription(locale),
    startsAt: params.startsAt,
    endsAt,
    attendeeEmails: lead.email ? [lead.email] : [],
  });
  if (googleEventId) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { googleEventId },
    });
  }

  const emailOutcome = await sendBookingConfirmationEmails({
    leadName: lead.name,
    leadEmail: lead.email,
    repName: lead.owner.name,
    repEmail: lead.owner.email,
    startsAt: params.startsAt,
    endsAt,
    bookingId: booking.id,
    manageLink: params.manageLinkBase,
    locale,
  });
  await writeAuditLog({
    userId: params.actingUserId,
    entityType: "Booking",
    entityId: booking.id,
    action: "booking.confirmation_email_sent",
    metadata: {
      clientEmailSent: emailOutcome.client?.sent ?? null,
      clientEmailError: emailOutcome.client?.error ?? null,
      repEmailSent: emailOutcome.rep.sent,
      repEmailError: emailOutcome.rep.error ?? null,
    },
  });

  return booking;
}

export async function cancelBookingCore(params: {
  bookingId: string;
  actingUserId: string | null;
  manageLinkBase: string;
  locale?: Locale;
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.bookingId },
    include: { lead: true, rep: true },
  });
  if (!booking) throw new BookingError("BOOKING_NOT_FOUND", "A foglalás nem található.");
  if (booking.status !== "CONFIRMED") {
    throw new BookingError("BOOKING_NOT_ACTIVE", "Ez a foglalás már nem aktív.");
  }

  const bookingPendingStage = await prisma.pipelineStage.findUnique({
    where: { key: SYSTEM_STAGE_KEYS.BOOKING_PENDING },
  });
  if (!bookingPendingStage) {
    throw new BookingError("MISSING_STAGE", "Hiányzó pipeline stádium.");
  }

  const locale = await resolveLocale(
    booking.leadId,
    booking.lead.locale,
    params.locale,
  );

  await prisma.$transaction([
    prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    }),
    prisma.lead.update({
      where: { id: booking.leadId },
      data: { currentStageId: bookingPendingStage.id },
    }),
    prisma.statusHistory.create({
      data: {
        leadId: booking.leadId,
        fromStageId: booking.lead.currentStageId,
        toStageId: bookingPendingStage.id,
        changedById: params.actingUserId,
        note: "Discovery call lemondva.",
      },
    }),
  ]);

  await writeAuditLog({
    userId: params.actingUserId,
    entityType: "Booking",
    entityId: booking.id,
    action: "booking.cancelled",
    metadata: { leadId: booking.leadId },
  });

  if (booking.googleEventId) {
    await deleteGoogleCalendarEvent(booking.repId, booking.googleEventId);
  }

  const startsAtFormatted = formatSlot(booking.startsAt, locale);
  if (booking.lead.email) {
    const email = await renderEmailTemplate("booking_cancelled", locale, {
      startsAtFormatted,
      manageLink: params.manageLinkBase,
    });
    const sendResult = await sendTransactionalEmail({
      to: booking.lead.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
    await writeAuditLog({
      userId: params.actingUserId,
      entityType: "Booking",
      entityId: booking.id,
      action: "booking.cancellation_email_sent",
      metadata: { emailSent: sendResult.ok, emailError: sendResult.error ?? null },
    });
  }
}

export async function rescheduleBookingCore(params: {
  bookingId: string;
  newStartsAt: Date;
  actingUserId: string | null;
  manageLinkBase: string;
  locale?: Locale;
}) {
  const oldBooking = await prisma.booking.findUnique({
    where: { id: params.bookingId },
    include: { lead: { include: { owner: true } } },
  });
  if (!oldBooking) throw new BookingError("BOOKING_NOT_FOUND", "A foglalás nem található.");
  if (oldBooking.status !== "CONFIRMED") {
    throw new BookingError("BOOKING_NOT_ACTIVE", "Ez a foglalás már nem aktív.");
  }
  if (!oldBooking.lead.owner) {
    throw new BookingError("NO_OWNER", "A leadhez nincs hozzárendelt sales rep.");
  }

  const submission = await prisma.questionnaireResponse.findFirst({
    where: { leadId: oldBooking.leadId },
    orderBy: { submittedAt: "desc" },
  });
  if (!submission) {
    throw new BookingError("MISSING_QUESTIONNAIRE", "A kérdőív beküldése hiányzik.");
  }

  const locale = await resolveLocale(
    oldBooking.leadId,
    oldBooking.lead.locale,
    params.locale,
  );

  const newEndsAt = new Date(params.newStartsAt.getTime() + 90 * 60_000);

  const [existingBookings, googleBusyIntervals] = await Promise.all([
    prisma.booking.findMany({
      where: {
        repId: oldBooking.lead.owner.id,
        status: "CONFIRMED",
        id: { not: oldBooking.id },
      },
      select: { startsAt: true, endsAt: true },
    }),
    getGoogleBusyIntervals(
      oldBooking.lead.owner.id,
      params.newStartsAt,
      newEndsAt,
    ),
  ]);

  if (
    !isBookableSlot({
      candidateStart: params.newStartsAt,
      submittedAt: submission.submittedAt,
      existingBookings: [...existingBookings, ...googleBusyIntervals],
    })
  ) {
    throw new BookingError(
      "SLOT_UNAVAILABLE",
      "Ez az időpont már nem választható. Kérjük válassz másikat.",
    );
  }

  let newBooking;
  try {
    [, newBooking] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: oldBooking.id },
        data: { status: "RESCHEDULED" },
      }),
      prisma.booking.create({
        data: {
          leadId: oldBooking.leadId,
          repId: oldBooking.repId,
          startsAt: params.newStartsAt,
          endsAt: newEndsAt,
          status: "CONFIRMED",
          rescheduleOfId: oldBooking.id,
          createdById: params.actingUserId,
        },
      }),
    ]);
  } catch (error) {
    if (isBookingOverlapConstraintError(error)) {
      throw new BookingError(
        "SLOT_TAKEN_RACE",
        "Ezt az időpontot közben valaki más lefoglalta. Kérjük válassz másikat.",
      );
    }
    throw error;
  }

  await writeAuditLog({
    userId: params.actingUserId,
    entityType: "Booking",
    entityId: newBooking.id,
    action: "booking.rescheduled",
    metadata: {
      leadId: oldBooking.leadId,
      previousBookingId: oldBooking.id,
      newStartsAt: params.newStartsAt.toISOString(),
    },
  });

  if (oldBooking.googleEventId) {
    await deleteGoogleCalendarEvent(oldBooking.repId, oldBooking.googleEventId);
  }
  const googleEventId = await createGoogleCalendarEvent({
    repId: oldBooking.lead.owner.id,
    summary: `Discovery Call — ${oldBooking.lead.name}`,
    description: callDescription(locale),
    startsAt: params.newStartsAt,
    endsAt: newEndsAt,
    attendeeEmails: oldBooking.lead.email ? [oldBooking.lead.email] : [],
  });
  if (googleEventId) {
    await prisma.booking.update({
      where: { id: newBooking.id },
      data: { googleEventId },
    });
  }

  const emailOutcome = await sendBookingConfirmationEmails({
    leadName: oldBooking.lead.name,
    leadEmail: oldBooking.lead.email,
    repName: oldBooking.lead.owner.name,
    repEmail: oldBooking.lead.owner.email,
    startsAt: params.newStartsAt,
    endsAt: newEndsAt,
    bookingId: newBooking.id,
    manageLink: params.manageLinkBase,
    locale,
  });
  await writeAuditLog({
    userId: params.actingUserId,
    entityType: "Booking",
    entityId: newBooking.id,
    action: "booking.confirmation_email_sent",
    metadata: {
      clientEmailSent: emailOutcome.client?.sent ?? null,
      clientEmailError: emailOutcome.client?.error ?? null,
      repEmailSent: emailOutcome.rep.sent,
      repEmailError: emailOutcome.rep.error ?? null,
    },
  });

  return newBooking;
}
