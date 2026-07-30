import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth/rbac";
import { getOAuthClient } from "@/lib/google/oauth";
import { encryptSecret } from "@/lib/crypto/secretBox";
import { writeAuditLog } from "@/lib/audit/log";

const SETTINGS_PATH = "/crm/settings/calendar";

export async function GET(request: NextRequest) {
  const { profile } = await verifySession();

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(
      new URL(`${SETTINGS_PATH}?error=${encodeURIComponent(oauthError)}`, request.url),
    );
  }

  // A `state` a folyamatot indító rep saját profil id-ja (lásd
  // lib/google/oauth.ts buildAuthUrl) — ha nem egyezik a jelenleg
  // bejelentkezett userrel, valaki más session-jébe próbálja beinjektálni
  // a callback-et (CSRF), ezt elutasítjuk.
  if (!code || !state || state !== profile.id) {
    return NextResponse.redirect(
      new URL(`${SETTINGS_PATH}?error=invalid_state`, request.url),
    );
  }

  try {
    const oauthClient = getOAuthClient();
    const { tokens } = await oauthClient.getToken(code);

    if (!tokens.access_token || !tokens.refresh_token || !tokens.expiry_date) {
      // A Google csak "offline" + "consent" esetén ad refresh tokent —
      // ha a user már korábban engedélyezte és a consent prompt nem jött
      // fel emiatt, előfordulhat, hogy nincs benne. Kérjük újra.
      return NextResponse.redirect(
        new URL(`${SETTINGS_PATH}?error=missing_refresh_token`, request.url),
      );
    }

    await prisma.googleCalendarConnection.upsert({
      where: { repId: profile.id },
      update: {
        accessTokenEnc: encryptSecret(tokens.access_token),
        refreshTokenEnc: encryptSecret(tokens.refresh_token),
        tokenExpiresAt: new Date(tokens.expiry_date),
        syncStatus: "CONNECTED",
        lastError: null,
      },
      create: {
        repId: profile.id,
        accessTokenEnc: encryptSecret(tokens.access_token),
        refreshTokenEnc: encryptSecret(tokens.refresh_token),
        tokenExpiresAt: new Date(tokens.expiry_date),
        syncStatus: "CONNECTED",
      },
    });

    await writeAuditLog({
      userId: profile.id,
      entityType: "GoogleCalendarConnection",
      entityId: profile.id,
      action: "google_calendar.connected",
    });

    return NextResponse.redirect(
      new URL(`${SETTINGS_PATH}?connected=1`, request.url),
    );
  } catch (error) {
    console.error("[google-oauth-callback]", error);
    return NextResponse.redirect(
      new URL(`${SETTINGS_PATH}?error=exchange_failed`, request.url),
    );
  }
}
