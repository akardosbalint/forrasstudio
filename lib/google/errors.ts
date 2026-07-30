import { prisma } from "@/lib/prisma";

// A googleapis/gaxios hibák HTTP státuszkódját nézzük — 401 azt jelenti,
// hogy a Google elutasította az access tokent (pl. a user időközben
// visszavonta a hozzáférést a Google fiókjából, vagy a scope megváltozott)
// FÜGGETLENÜL attól, hogy a nálunk tárolt `tokenExpiresAt` szerint még
// érvényesnek tűnt. Csak az auth-jellegű hibákra reagálunk (nem minden
// hibára), hogy egy átmeneti hálózati/500-as hiba ne állítsa hamisan
// "hiba" állapotba a amúgy működő kapcsolatot.
function isGoogleAuthError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const status =
    (error as { response?: { status?: number }; code?: number }).response
      ?.status ?? (error as { code?: number }).code;
  return status === 401 || status === 403;
}

// Reaktív állapotfrissítés: ha egy tényleges Google API hívás (nem a
// lib/google/connection.ts-beli proaktív, lejárat előtti token-frissítés)
// auth-hibával bukik el, ezt is jelezzük a `GoogleCalendarConnection`
// táblában, hogy a `/crm/settings/calendar` UI ne mutasson hamisan
// "Csatlakoztatva" állapotot egy valójában megszakadt kapcsolatra.
export async function reportGoogleApiError(
  repId: string,
  error: unknown,
): Promise<void> {
  if (!isGoogleAuthError(error)) return;

  await prisma.googleCalendarConnection
    .update({
      where: { repId },
      data: {
        syncStatus: "ERROR",
        lastError:
          error instanceof Error
            ? error.message
            : "Google API hiba (401/403) — a kapcsolat valószínűleg megszakadt.",
      },
    })
    .catch(() => {
      // A connection row időközben törölve lehetett (pl. lecsatlakoztatás
      // közben) — ez esetben nincs mit frissíteni.
    });
}
