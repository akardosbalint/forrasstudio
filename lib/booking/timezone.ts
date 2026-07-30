// DST-biztos időzóna-segédfüggvények, külön modulban a tesztelhetőség
// kedvéért (lib/booking/slots.ts ezeket használja a szabad sávok
// generálásához).
export function zonedDateParts(
  date: Date,
  timeZone: string,
): { year: number; month: number; day: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const map: Record<string, string> = {};
  for (const part of fmt.formatToParts(date)) map[part.type] = part.value;
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
  };
}

// Egy adott (év, hónap, nap, óra, perc) "fali idő" tényleges UTC
// pillanattá alakítása egy IANA időzónában — DST-biztos módon, könyvtár
// nélkül. Az ötlet: kezdő becslés (mintha a fali idő UTC lenne), majd
// iteratív korrekció aközött, amit a becsült pillanat ténylegesen mutat a
// célzónában és amit szerettünk volna — 1-2 iteráció alatt konvergál,
// mert az időzóna-eltolás percre kerekített és ritkán változik óránál
// gyakrabban.
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  let guess = new Date(targetAsUtc);

  for (let i = 0; i < 3; i++) {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const map: Record<string, string> = {};
    for (const part of fmt.formatToParts(guess)) map[part.type] = part.value;
    const guessReadsAsUtc = Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      Number(map.hour),
      Number(map.minute),
    );
    const delta = targetAsUtc - guessReadsAsUtc;
    if (delta === 0) break;
    guess = new Date(guess.getTime() + delta);
  }

  return guess;
}

export function weekdayOfCalendarDate(
  year: number,
  month: number,
  day: number,
): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}
