import { google } from "googleapis";

// A Google Calendar API teljes hozzáférést (nem csak olvasást) igényel,
// mert a rendszer eseményt is létrehoz/módosít/töröl a rep naptárában.
export const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar",
];

export function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "[google-oauth] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_OAUTH_REDIRECT_URI nincs beállítva — lásd .env.example.",
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

// A `state` paraméterben a bejelentkezett rep profil id-ját visszük át a
// Google consent képernyőn keresztül, hogy a callback tudja, kihez tartozik
// a kapcsolat — aláírt/titkosított state helyett itt elég, mert a callback
// úgyis újra ellenőrzi, hogy a bejelentkezett user jogosult-e (lásd
// app/api/google/oauth/callback/route.ts).
export function buildAuthUrl(repId: string): string {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // mindig adjon refresh tokent, ne csak első alkalommal
    scope: GOOGLE_CALENDAR_SCOPES,
    state: repId,
  });
}
