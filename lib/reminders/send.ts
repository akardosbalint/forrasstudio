import { prisma } from "@/lib/prisma";
import { renderEmailTemplate } from "@/lib/email/templates";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { isReminderDue } from "@/lib/reminders/rules";
import { DEFAULT_TIMEZONE } from "@/lib/booking/rules";

const DEFAULT_WINDOW_MINUTES = 20;

function formatSlot(date: Date): string {
  return date.toLocaleString("hu-HU", {
    timeZone: DEFAULT_TIMEZONE,
    dateStyle: "full",
    timeStyle: "short",
  });
}

async function sendReminder(
  booking: {
    id: string;
    startsAt: Date;
    lead: { name: string; email: string | null };
    rep: { name: string };
  },
  hoursBefore: 24 | 1,
  manageLink: string,
) {
  if (!booking.lead.email) return;

  const email = await renderEmailTemplate("booking_reminder", {
    leadName: booking.lead.name,
    repName: booking.rep.name,
    startsAtFormatted: formatSlot(booking.startsAt),
    hoursLabel: hoursBefore === 24 ? "24 óra" : "1 óra",
    manageLink,
  });

  await sendTransactionalEmail({
    to: booking.lead.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
}

// A háttérjob (scripts/run-scheduled-tasks.ts) periodikusan hívja. Minden
// futás csak azokra a foglalásokra küld emlékeztetőt, amik még nem
// kaptak (reminder24hSentAt/reminder1hSentAt mezők), és éppen esedékesek
// a toleranciaablakon belül — így a futási gyakoriságtól függetlenül sem
// marad ki, sem duplázódik emlékeztető.
export async function sendDueReminders(now: Date = new Date()): Promise<void> {
  const windowMinutes =
    Number(process.env.REMINDER_CHECK_WINDOW_MINUTES) || DEFAULT_WINDOW_MINUTES;
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");

  const upcomingBookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      startsAt: { gt: now },
      OR: [{ reminder24hSentAt: null }, { reminder1hSentAt: null }],
    },
    include: { lead: true, rep: true },
  });

  for (const booking of upcomingBookings) {
    const manageLink = `${appUrl}/foglalas/`; // a tényleges token a lead kérdőív-linkjéből származik, lásd lent
    const link = await prisma.questionnaireLink.findFirst({
      where: { leadId: booking.leadId },
      orderBy: { createdAt: "desc" },
    });
    const fullManageLink = link ? `${manageLink}${link.token}` : appUrl;

    if (
      !booking.reminder24hSentAt &&
      isReminderDue({ now, startsAt: booking.startsAt, hoursBefore: 24, windowMinutes })
    ) {
      await sendReminder(booking, 24, fullManageLink);
      await prisma.booking.update({
        where: { id: booking.id },
        data: { reminder24hSentAt: now },
      });
    }

    if (
      !booking.reminder1hSentAt &&
      isReminderDue({ now, startsAt: booking.startsAt, hoursBefore: 1, windowMinutes })
    ) {
      await sendReminder(booking, 1, fullManageLink);
      await prisma.booking.update({
        where: { id: booking.id },
        data: { reminder1hSentAt: now },
      });
    }
  }
}
