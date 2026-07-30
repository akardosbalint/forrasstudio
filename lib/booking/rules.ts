// Foglalási szabályok (spec 4. pont): 90 perces Discovery Call, csak
// munkanapokon 9:00-18:00 között, a kérdőív beküldésétől számított
// minimum 24 óra elteltével, ütközésmentesen. Tiszta, oldalhatás-mentes
// függvények — lásd rules.test.ts az egységtesztekhez.
export const CALL_DURATION_MINUTES = 90;
export const BUSINESS_START_HOUR = 9;
export const BUSINESS_END_HOUR = 18;
export const MIN_LEAD_HOURS = 24;

export const DEFAULT_TIMEZONE = process.env.CRM_TIMEZONE || "Europe/Budapest";

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function zonedInfo(
  date: Date,
  timeZone: string,
): { weekday: number; minutesSinceMidnight: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = fmt.formatToParts(date);
  const map: Record<string, string> = {};
  for (const part of parts) map[part.type] = part.value;
  return {
    weekday: WEEKDAY_INDEX[map.weekday],
    minutesSinceMidnight: Number(map.hour) * 60 + Number(map.minute),
  };
}

// Munkanap (hétfő-péntek), 9:00-18:00 — a 90 perces hívásnak egészben
// bele kell férnie (nem indulhat pl. 17:31-kor).
export function isWithinBusinessWindow(
  start: Date,
  timeZone: string = DEFAULT_TIMEZONE,
): boolean {
  const end = new Date(start.getTime() + CALL_DURATION_MINUTES * 60_000);
  const startInfo = zonedInfo(start, timeZone);
  const endInfo = zonedInfo(end, timeZone);

  const isWeekday = startInfo.weekday >= 1 && startInfo.weekday <= 5;
  const startsInWindow =
    startInfo.minutesSinceMidnight >= BUSINESS_START_HOUR * 60;
  const endsInWindow =
    endInfo.weekday === startInfo.weekday &&
    endInfo.minutesSinceMidnight <= BUSINESS_END_HOUR * 60;

  return isWeekday && startsInWindow && endsInWindow;
}

// A kérdőív beküldésének timestamp-jétől számított min. 24 óra —
// dinamikusan, percre pontosan, nem napra kerekítve.
export function meetsMinLeadTime(
  candidateStart: Date,
  submittedAt: Date,
): boolean {
  const earliestAllowed = new Date(
    submittedAt.getTime() + MIN_LEAD_HOURS * 60 * 60_000,
  );
  return candidateStart.getTime() >= earliestAllowed.getTime();
}

export type BookingWindow = { startsAt: Date; endsAt: Date };

// 90 perces ütközésvizsgálat egy jelölt időponthoz képest a rep meglévő
// (aktív, azaz nem lemondott) foglalásaival szemben.
export function hasConflict(
  candidateStart: Date,
  existingBookings: BookingWindow[],
): boolean {
  const candidateEnd = new Date(
    candidateStart.getTime() + CALL_DURATION_MINUTES * 60_000,
  );
  return existingBookings.some(
    (booking) =>
      candidateStart < booking.endsAt && booking.startsAt < candidateEnd,
  );
}

// Egy jelölt időpont teljes validálása minden szabály szerint egyben —
// ezt hívja a foglalási server action, mielőtt ténylegesen létrehozná a
// Booking sort (soha nem bízunk a kliens által küldött időpontban).
export function isBookableSlot(params: {
  candidateStart: Date;
  submittedAt: Date;
  existingBookings: BookingWindow[];
  now?: Date;
  timeZone?: string;
}): boolean {
  const now = params.now ?? new Date();
  if (params.candidateStart.getTime() <= now.getTime()) return false;
  if (!meetsMinLeadTime(params.candidateStart, params.submittedAt)) {
    return false;
  }
  if (!isWithinBusinessWindow(params.candidateStart, params.timeZone)) {
    return false;
  }
  if (hasConflict(params.candidateStart, params.existingBookings)) {
    return false;
  }
  return true;
}
