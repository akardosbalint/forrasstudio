import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/booking/slots";
import { SYSTEM_STAGE_KEYS } from "@/lib/pipeline/stages";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/dictionaries";
import { SlotPicker } from "./SlotPicker";
import { BookingControls } from "./BookingControls";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ lang: string; token: string }>;
}) {
  const { lang: rawLang, token } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.flows.booking;

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
          {t.invalidLink.heading}
        </h1>
      </div>
    );
  }

  const { lead } = link;

  if (!link.usedAt) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h1 className="mb-2 font-display text-lg font-semibold">
          {t.questionnaireRequired.heading}
        </h1>
        <p className="mb-4 text-sm text-ink/60">
          {t.questionnaireRequired.body}
        </p>
        <Link
          href={`/${lang}/kerdoiv/${token}`}
          className="text-sm font-medium text-brook underline"
        >
          {t.questionnaireRequired.linkText}
        </Link>
      </div>
    );
  }

  if (!lead.owner) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h1 className="mb-2 font-display text-lg font-semibold">
          {t.noOwner.heading}
        </h1>
        <p className="text-sm text-ink/60">{t.noOwner.body}</p>
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
              {t.activeBooking.heading}
            </h1>
            <p className="text-sm text-ink/70">
              {activeBooking.startsAt.toLocaleString(
                lang === "en" ? "en-US" : "hu-HU",
                {
                  timeZone: "Europe/Budapest",
                  dateStyle: "full",
                  timeStyle: "short",
                },
              )}{" "}
              — {lead.owner.name}
            </p>
          </div>
          <BookingControls
            token={token}
            lang={lang}
            bookingId={activeBooking.id}
            rescheduleSlots={rescheduleSlots.map((d) => d.toISOString())}
            dict={t}
          />
        </div>
      );
    }
  }

  if (lead.currentStage.key !== SYSTEM_STAGE_KEYS.BOOKING_PENDING) {
    return (
      <div className="rounded-xl border border-paper-3 bg-white p-6 text-center">
        <h1 className="mb-2 font-display text-lg font-semibold">
          {t.noActiveTask.heading}
        </h1>
        <p className="text-sm text-ink/60">{t.noActiveTask.body}</p>
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
          {t.booking.heading}
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          {t.booking.greeting
            .replace("{{leadName}}", lead.name)
            .replace("{{repName}}", lead.owner.name)}
        </p>
      </div>
      <SlotPicker
        token={token}
        lang={lang}
        slots={slots.map((d) => d.toISOString())}
        mode="book"
        dict={t.slotPicker}
      />
    </div>
  );
}
