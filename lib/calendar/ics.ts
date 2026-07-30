// Minimális .ics (RFC 5545 VEVENT) generátor a foglalás-visszaigazoló
// emailekhez — nem igényel külső csomagot. A tényleges Google Calendar
// esemény létrehozása (rep naptárában) a Phase 5-ben készül el.
function toIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function buildIcsEvent(params: {
  uid: string;
  startsAt: Date;
  endsAt: Date;
  summary: string;
  description: string;
  organizerEmail: string;
  attendeeEmails: string[];
}): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KBCo Studio//CRM//HU",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${params.uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(params.startsAt)}`,
    `DTEND:${toIcsDate(params.endsAt)}`,
    `SUMMARY:${escapeIcsText(params.summary)}`,
    `DESCRIPTION:${escapeIcsText(params.description)}`,
    `ORGANIZER:mailto:${params.organizerEmail}`,
    ...params.attendeeEmails.map(
      (email) => `ATTENDEE:mailto:${email}`,
    ),
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}
