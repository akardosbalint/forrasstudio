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

export class BookingError extends Error {}

function formatSlot(date: Date): string {
  return date.toLocaleString("hu-HU", {
    timeZone: DEFAULT_TIMEZONE,
    dateStyle: "full",
    timeStyle: "short",
  });
}

function toBase64(text: string): string {
  return Buffer.from(text, "utf-8").toString("base64");
}

async function sendBookingConfirmationEmails(params: {
  leadName: string;
  leadEmail: string | null;
  repName: string;
  repEmail: string;
  startsAt: Date;
  endsAt: Date;
  bookingId: string;
  manageLink: string;
}) {
  const startsAtFormatted = formatSlot(params.startsAt);
  const ics = buildIcsEvent({
    uid: `booking-${params.bookingId}@kbco-crm`,
    startsAt: params.startsAt,
    endsAt: params.endsAt,
    summary: `Discovery Call — ${params.leadName}`,
    description: "KBCo Stúdió discovery call (90 perc).",
    organizerEmail: params.repEmail,
    attendeeEmails: params.leadEmail
      ? [params.repEmail, params.leadEmail]
      : [params.repEmail],
  });
  const attachments = [
    { filename: "discovery-call.ics", content: toBase64(ics) },
  ];

  if (params.leadEmail) {
    const clientEmail = await renderEmailTemplate("booking_confirmation_client", {
      leadName: params.leadName,
      repName: params.repName,
      startsAtFormatted,
      manageLink: params.manageLink,
    });
    await sendTransactionalEmail({
      to: params.leadEmail,
      subject: clientEmail.subject,
      html: clientEmail.html,
      text: clientEmail.text,
      attachments,
    });
  }

  const repEmail = await renderEmailTemplate("booking_confirmation_rep", {
    leadName: params.leadName,
    repName: params.repName,
    startsAtFormatted,
  });
  await sendTransactionalEmail({
    to: params.repEmail,
    subject: repEmail.subject,
    html: repEmail.html,
    text: repEmail.text,
    attachments,
  });
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
}) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.leadId },
    include: {
      owner: true,
      currentStage: true,
      questionnaireResponses: { orderBy: { submittedAt: "desc" }, take: 1 },
    },
  });
  if (!lead) throw new BookingError("A lead nem található.");
  if (!lead.owner) {
    throw new BookingError(
      "A leadhez nincs hozzárendelt sales rep — nem foglalható discovery call.",
    );
  }
  if (lead.currentStage.key !== SYSTEM_STAGE_KEYS.BOOKING_PENDING) {
    throw new BookingError(
      "Ehhez a leadhez jelenleg nem lehet discovery call-t foglalni.",
    );
  }
  const submission = lead.questionnaireResponses[0];
  if (!submission) {
    throw new BookingError("A kérdőív beküldése hiányzik.");
  }

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
      "Ez az időpont már nem választható (foglalt, lejárt, vagy nem teljesíti a szabályokat). Kérjük válassz másikat.",
    );
  }

  const callScheduledStage = await prisma.pipelineStage.findUnique({
    where: { key: SYSTEM_STAGE_KEYS.CALL_SCHEDULED },
  });
  if (!callScheduledStage) {
    throw new BookingError("Hiányzó pipeline stádium.");
  }

  const [booking] = await prisma.$transaction([
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
    description: "KBCo Stúdió discovery call (90 perc).",
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

  await sendBookingConfirmationEmails({
    leadName: lead.name,
    leadEmail: lead.email,
    repName: lead.owner.name,
    repEmail: lead.owner.email,
    startsAt: params.startsAt,
    endsAt,
    bookingId: booking.id,
    manageLink: params.manageLinkBase,
  });

  return booking;
}

export async function cancelBookingCore(params: {
  bookingId: string;
  actingUserId: string | null;
  manageLinkBase: string;
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.bookingId },
    include: { lead: true, rep: true },
  });
  if (!booking) throw new BookingError("A foglalás nem található.");
  if (booking.status !== "CONFIRMED") {
    throw new BookingError("Ez a foglalás már nem aktív.");
  }

  const bookingPendingStage = await prisma.pipelineStage.findUnique({
    where: { key: SYSTEM_STAGE_KEYS.BOOKING_PENDING },
  });
  if (!bookingPendingStage) {
    throw new BookingError("Hiányzó pipeline stádium.");
  }

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

  const startsAtFormatted = formatSlot(booking.startsAt);
  if (booking.lead.email) {
    const email = await renderEmailTemplate("booking_cancelled", {
      startsAtFormatted,
      manageLink: params.manageLinkBase,
    });
    await sendTransactionalEmail({
      to: booking.lead.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
  }
}

export async function rescheduleBookingCore(params: {
  bookingId: string;
  newStartsAt: Date;
  actingUserId: string | null;
  manageLinkBase: string;
}) {
  const oldBooking = await prisma.booking.findUnique({
    where: { id: params.bookingId },
    include: { lead: { include: { owner: true } } },
  });
  if (!oldBooking) throw new BookingError("A foglalás nem található.");
  if (oldBooking.status !== "CONFIRMED") {
    throw new BookingError("Ez a foglalás már nem aktív.");
  }
  if (!oldBooking.lead.owner) {
    throw new BookingError("A leadhez nincs hozzárendelt sales rep.");
  }

  const submission = await prisma.questionnaireResponse.findFirst({
    where: { leadId: oldBooking.leadId },
    orderBy: { submittedAt: "desc" },
  });
  if (!submission) throw new BookingError("A kérdőív beküldése hiányzik.");

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
      "Ez az időpont már nem választható. Kérjük válassz másikat.",
    );
  }

  const [, newBooking] = await prisma.$transaction([
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
    description: "KBCo Stúdió discovery call (90 perc).",
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

  await sendBookingConfirmationEmails({
    leadName: oldBooking.lead.name,
    leadEmail: oldBooking.lead.email,
    repName: oldBooking.lead.owner.name,
    repEmail: oldBooking.lead.owner.email,
    startsAt: params.newStartsAt,
    endsAt: newEndsAt,
    bookingId: newBooking.id,
    manageLink: params.manageLinkBase,
  });

  return newBooking;
}
