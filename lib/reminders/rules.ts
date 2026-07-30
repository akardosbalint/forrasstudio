// Tiszta logika annak eldöntésére, hogy egy adott pillanatban "esedékes"-e
// egy N órával a call előtti emlékeztető — a háttérjob (lib/reminders/send.ts)
// periodikusan fut (nem folyamatosan), ezért egy toleranciaablakot
// (`windowMinutes`) engedünk a pontos időpont körül, hogy egyetlen futás se
// maradjon ki, de duplán se küldjön (a hívó felelős a "már elküldve" jelzés
// tárolásáért, lásd Booking.reminder24hSentAt/reminder1hSentAt).
export function isReminderDue(params: {
  now: Date;
  startsAt: Date;
  hoursBefore: number;
  windowMinutes: number;
}): boolean {
  const targetTime =
    params.startsAt.getTime() - params.hoursBefore * 60 * 60_000;
  const diff = params.now.getTime() - targetTime;
  return diff >= 0 && diff <= params.windowMinutes * 60_000;
}
