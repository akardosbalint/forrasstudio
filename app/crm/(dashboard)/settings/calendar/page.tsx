import { verifySession } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { disconnectGoogleCalendar } from "./actions";
import { AvailabilityForm } from "./AvailabilityForm";
import { FormMessage } from "../../FormMessage";

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

  return (
    <div className="flex max-w-lg flex-col gap-8">
      <h1 className="font-display text-2xl font-semibold">
        Naptár beállítások
      </h1>

      {connected && (
        <FormMessage type="success">
          Sikeresen csatlakoztattad a Google Calendart.
        </FormMessage>
      )}
      {error && (
        <FormMessage type="error">
          Hiba történt a csatlakozás során ({error}). Próbáld újra.
        </FormMessage>
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
            className="bg-gradient-brand rounded-lg px-4 py-2 text-sm font-medium text-white"
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
        <AvailabilityForm availability={availability} />
      </section>
    </div>
  );
}
