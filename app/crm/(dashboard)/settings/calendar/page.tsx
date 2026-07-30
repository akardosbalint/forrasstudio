import { verifySession } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { disconnectGoogleCalendar, saveRepAvailability } from "./actions";

const WEEKDAY_LABELS: Record<number, string> = {
  1: "Hétfő",
  2: "Kedd",
  3: "Szerda",
  4: "Csütörtök",
  5: "Péntek",
};

const STATUS_LABELS: Record<string, string> = {
  CONNECTED: "Csatlakoztatva",
  ERROR: "Hiba — csatlakozz újra",
  DISCONNECTED: "Nincs csatlakoztatva",
};

export default async function CalendarSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>;
}) {
  const { profile } = await verifySession();
  const { connected, error } = await searchParams;

  const [connection, availability] = await Promise.all([
    prisma.googleCalendarConnection.findUnique({
      where: { repId: profile.id },
    }),
    prisma.repAvailability.findMany({
      where: { repId: profile.id },
      orderBy: { weekday: "asc" },
    }),
  ]);

  const availabilityByWeekday = new Map(
    availability.map((row) => [row.weekday, row]),
  );

  return (
    <div className="flex max-w-lg flex-col gap-8">
      <h1 className="font-display text-2xl font-semibold">
        Naptár beállítások
      </h1>

      {connected && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Sikeresen csatlakoztattad a Google Calendart.
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          Hiba történt a csatlakozás során ({error}). Próbáld újra.
        </p>
      )}

      <section className="rounded-xl border border-paper-3 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">
          Google Calendar
        </h2>
        <p className="mb-4 text-sm text-ink/70">
          Állapot:{" "}
          <strong>
            {connection ? STATUS_LABELS[connection.syncStatus] : "Nincs csatlakoztatva"}
          </strong>
          {connection?.lastError && (
            <span className="block text-xs text-red-600">
              {connection.lastError}
            </span>
          )}
        </p>
        <div className="flex gap-3">
          <a
            href="/api/google/oauth/connect"
            className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper"
          >
            {connection ? "Újracsatlakozás" : "Csatlakozás Google Calendarhoz"}
          </a>
          {connection && (
            <form action={disconnectGoogleCalendar}>
              <button
                type="submit"
                className="rounded-lg border border-paper-3 px-4 py-2 text-sm font-medium text-ink"
              >
                Lecsatlakoztatás
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-paper-3 bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-ink/50">
          Heti elérhetőség
        </h2>
        <p className="mb-4 text-xs text-ink/50">
          Csak a globális munkanap / 9:00-18:00 kereten belüli sávok
          engedélyezettek. Ha egy napot nem jelölsz be, azon a napon nem
          kapsz discovery call-t.
        </p>
        <form action={saveRepAvailability} className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((weekday) => {
            const existing = availabilityByWeekday.get(weekday);
            return (
              <div key={weekday} className="flex items-center gap-3 text-sm">
                <label className="flex w-28 items-center gap-2">
                  <input
                    type="checkbox"
                    name={`enabled-${weekday}`}
                    defaultChecked={!!existing}
                  />
                  {WEEKDAY_LABELS[weekday]}
                </label>
                <input
                  type="time"
                  name={`start-${weekday}`}
                  defaultValue={existing?.startTime ?? "09:00"}
                  min="09:00"
                  max="18:00"
                  className="rounded-lg border border-paper-3 bg-white px-2 py-1"
                />
                <span className="text-ink/40">–</span>
                <input
                  type="time"
                  name={`end-${weekday}`}
                  defaultValue={existing?.endTime ?? "18:00"}
                  min="09:00"
                  max="18:00"
                  className="rounded-lg border border-paper-3 bg-white px-2 py-1"
                />
              </div>
            );
          })}
          <button
            type="submit"
            className="mt-2 self-start rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper"
          >
            Mentés
          </button>
        </form>
      </section>
    </div>
  );
}
