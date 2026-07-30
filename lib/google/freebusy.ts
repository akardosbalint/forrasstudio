import {
  getCalendarClientForRep,
  GoogleCalendarNotConnectedError,
} from "@/lib/google/connection";
import { reportGoogleApiError } from "@/lib/google/errors";

// A rep Google Calendarjában lévő (nem a CRM-ből eredő) foglalt sávok
// lekérdezése, hogy a szabad-sáv generálás ne ajánljon fel ütköző
// időpontot (spec 5. pont). Ha a rep nincs csatlakoztatva, vagy a Google
// API hibázik, üres listát adunk vissza (nem blokkoljuk a foglalást egy
// külső integrációs hiba miatt) — a hívó oldal (lib/booking/slots.ts)
// ilyenkor a CRM-es foglalásokra és a rep alap elérhetőségére támaszkodik.
export async function getGoogleBusyIntervals(
  repId: string,
  timeMin: Date,
  timeMax: Date,
): Promise<{ startsAt: Date; endsAt: Date }[]> {
  try {
    const { calendar, calendarId } = await getCalendarClientForRep(repId);
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        items: [{ id: calendarId }],
      },
    });
    const busy = response.data.calendars?.[calendarId]?.busy ?? [];
    return busy
      .filter((slot) => slot.start && slot.end)
      .map((slot) => ({
        startsAt: new Date(slot.start!),
        endsAt: new Date(slot.end!),
      }));
  } catch (error) {
    if (!(error instanceof GoogleCalendarNotConnectedError)) {
      console.error("[freebusy] Google FreeBusy lekérdezési hiba:", error);
      await reportGoogleApiError(repId, error);
    }
    return [];
  }
}
