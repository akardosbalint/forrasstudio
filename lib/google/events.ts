import {
  getCalendarClientForRep,
  GoogleCalendarNotConnectedError,
} from "@/lib/google/connection";

// Esemény létrehozása a rep Google Calendarjában foglaláskor (spec 5.
// pont: "a rendszer... automatikusan létrehoz egy eseményt a rep Google
// Calendarjában"). Ha a rep nincs csatlakoztatva, csendben kihagyjuk — a
// CRM-es Booking rekord ettől függetlenül létrejön, ez csak a rep saját
// naptárába való tükrözés, nem a foglalás forrása.
export async function createGoogleCalendarEvent(params: {
  repId: string;
  summary: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  attendeeEmails: string[];
}): Promise<string | null> {
  try {
    const { calendar, calendarId } = await getCalendarClientForRep(
      params.repId,
    );
    const response = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: params.summary,
        description: params.description,
        start: { dateTime: params.startsAt.toISOString() },
        end: { dateTime: params.endsAt.toISOString() },
        attendees: params.attendeeEmails.map((email) => ({ email })),
      },
    });
    return response.data.id ?? null;
  } catch (error) {
    if (!(error instanceof GoogleCalendarNotConnectedError)) {
      console.error("[google-events] Esemény létrehozási hiba:", error);
    }
    return null;
  }
}

export async function deleteGoogleCalendarEvent(
  repId: string,
  googleEventId: string,
): Promise<void> {
  try {
    const { calendar, calendarId } = await getCalendarClientForRep(repId);
    await calendar.events.delete({ calendarId, eventId: googleEventId });
  } catch (error) {
    if (!(error instanceof GoogleCalendarNotConnectedError)) {
      console.error("[google-events] Esemény törlési hiba:", error);
    }
  }
}
