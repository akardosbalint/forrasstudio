// Szerverindításkor egyszer lefutó ellenőrzés (lásd Next.js
// "instrumentation" konvenció) — ha a NEXT_PUBLIC_APP_URL nincs
// beállítva, minden kiküldött email (kérdőív-meghívó, foglalás-
// visszaigazolás, emlékeztető, lemondás) linkje csendben egy domain
// nélküli relatív útvonallá silányul (pl. "/kerdoiv/abc123"), ami egy
// email kliensben nem kattintható. Ezt korábban semmi nem jelezte.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.warn(
      "[startup] FIGYELEM: NEXT_PUBLIC_APP_URL nincs beállítva. Minden " +
        "kiküldött email linkje (kérdőív-meghívó, foglalás-visszaigazolás, " +
        "emlékeztető, lemondás) domain nélküli, nem kattintható relatív " +
        "útvonalként fog kimenni. Állítsd be a .env.example alapján.",
    );
  }
}
