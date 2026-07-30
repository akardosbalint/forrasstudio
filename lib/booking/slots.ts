import "server-only";

import { prisma } from "@/lib/prisma";
import {
  BUSINESS_END_HOUR,
  BUSINESS_START_HOUR,
  CALL_DURATION_MINUTES,
  DEFAULT_TIMEZONE,
  isBookableSlot,
} from "@/lib/booking/rules";
import {
  zonedDateParts,
  zonedTimeToUtc,
  weekdayOfCalendarDate,
} from "@/lib/booking/timezone";
import { getGoogleBusyIntervals } from "@/lib/google/freebusy";

const SLOT_GRANULARITY_MINUTES = 30;
const DEFAULT_SEARCH_WINDOW_DAYS = 21;

function parseHHmm(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

// Napi ablakok (perc éjfél óta) egy adott naphoz: ha a repnek van explicit
// `RepAvailability` sora az adott hétköznapra, azt használjuk, egyébként a
// globális 9-18-as alapértelmezést — így a foglalási motor működik mielőtt
// bármelyik rep beállítaná a saját elérhetőségét (Phase 5).
function windowsForWeekday(
  weekday: number,
  repAvailability: { weekday: number; startTime: string; endTime: string }[],
): { startMinutes: number; endMinutes: number }[] {
  const rows = repAvailability.filter((row) => row.weekday === weekday);
  if (rows.length === 0) {
    return [
      {
        startMinutes: BUSINESS_START_HOUR * 60,
        endMinutes: BUSINESS_END_HOUR * 60,
      },
    ];
  }
  return rows.map((row) => ({
    startMinutes: Math.max(parseHHmm(row.startTime), BUSINESS_START_HOUR * 60),
    endMinutes: Math.min(parseHHmm(row.endTime), BUSINESS_END_HOUR * 60),
  }));
}

export async function getAvailableSlots(params: {
  repId: string;
  submittedAt: Date;
  searchWindowDays?: number;
  timeZone?: string;
  now?: Date;
}): Promise<Date[]> {
  const timeZone = params.timeZone ?? DEFAULT_TIMEZONE;
  const now = params.now ?? new Date();
  const searchWindowDays =
    params.searchWindowDays ?? DEFAULT_SEARCH_WINDOW_DAYS;

  const today = zonedDateParts(now, timeZone);
  const todayUtcMidnight = Date.UTC(today.year, today.month - 1, today.day);
  const searchEnd = new Date(
    todayUtcMidnight + (searchWindowDays + 1) * 24 * 60 * 60_000,
  );

  const [repAvailability, existingBookings, googleBusyIntervals] =
    await Promise.all([
      prisma.repAvailability.findMany({ where: { repId: params.repId } }),
      prisma.booking.findMany({
        where: { repId: params.repId, status: "CONFIRMED" },
        select: { startsAt: true, endsAt: true },
      }),
      getGoogleBusyIntervals(params.repId, now, searchEnd),
    ]);

  const blockedIntervals = [...existingBookings, ...googleBusyIntervals];

  const slots: Date[] = [];

  for (let dayOffset = 0; dayOffset <= searchWindowDays; dayOffset++) {
    const dayMs = todayUtcMidnight + dayOffset * 24 * 60 * 60_000;
    const dayDate = new Date(dayMs);
    const year = dayDate.getUTCFullYear();
    const month = dayDate.getUTCMonth() + 1;
    const day = dayDate.getUTCDate();
    const weekday = weekdayOfCalendarDate(year, month, day);
    const windows = windowsForWeekday(weekday, repAvailability);

    for (const window of windows) {
      for (
        let minutes = window.startMinutes;
        minutes + CALL_DURATION_MINUTES <= window.endMinutes;
        minutes += SLOT_GRANULARITY_MINUTES
      ) {
        const candidate = zonedTimeToUtc(
          year,
          month,
          day,
          Math.floor(minutes / 60),
          minutes % 60,
          timeZone,
        );
        if (
          isBookableSlot({
            candidateStart: candidate,
            submittedAt: params.submittedAt,
            existingBookings: blockedIntervals,
            now,
            timeZone,
          })
        ) {
          slots.push(candidate);
        }
      }
    }
  }

  return slots;
}
