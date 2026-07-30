import { google, type calendar_v3 } from "googleapis";
import { prisma } from "@/lib/prisma";
import { decryptSecret, encryptSecret } from "@/lib/crypto/secretBox";
import { getOAuthClient } from "@/lib/google/oauth";

export class GoogleCalendarNotConnectedError extends Error {}

// Egy adott rep naptárához authentikált Calendar API klienst ad vissza —
// szükség esetén frissíti (és titkosítva visszaírja) az access tokent. Ha
// a frissítés meghiúsul (pl. a user visszavonta a hozzáférést), a
// kapcsolatot ERROR állapotba állítja, hogy a UI jelezni tudja.
export async function getCalendarClientForRep(
  repId: string,
): Promise<{ calendar: calendar_v3.Calendar; calendarId: string }> {
  const connection = await prisma.googleCalendarConnection.findUnique({
    where: { repId },
  });

  if (!connection || connection.syncStatus === "DISCONNECTED") {
    throw new GoogleCalendarNotConnectedError(
      "A rephez nincs csatlakoztatott Google Calendar.",
    );
  }

  const oauthClient = getOAuthClient();
  oauthClient.setCredentials({
    access_token: decryptSecret(connection.accessTokenEnc),
    refresh_token: decryptSecret(connection.refreshTokenEnc),
    expiry_date: connection.tokenExpiresAt.getTime(),
  });

  // Ha az access token lejárt (vagy közel jár), kényszerítsünk frissítést
  // és írjuk vissza titkosítva — a googleapis kliens ezt automatikusan
  // megteszi lekérdezéskor is, de itt explicit módon kezeljük a hibát.
  if (connection.tokenExpiresAt.getTime() < Date.now() + 60_000) {
    try {
      const { credentials } = await oauthClient.refreshAccessToken();
      oauthClient.setCredentials(credentials);
      await prisma.googleCalendarConnection.update({
        where: { repId },
        data: {
          accessTokenEnc: encryptSecret(credentials.access_token!),
          tokenExpiresAt: new Date(credentials.expiry_date!),
          syncStatus: "CONNECTED",
          lastError: null,
        },
      });
    } catch (error) {
      await prisma.googleCalendarConnection.update({
        where: { repId },
        data: {
          syncStatus: "ERROR",
          lastError: error instanceof Error ? error.message : String(error),
        },
      });
      throw new GoogleCalendarNotConnectedError(
        "A Google Calendar kapcsolat megszakadt — a repnek újra kell csatlakoznia.",
      );
    }
  }

  return {
    calendar: google.calendar({ version: "v3", auth: oauthClient }),
    calendarId: connection.calendarId,
  };
}
