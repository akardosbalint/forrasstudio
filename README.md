# KBCo Stúdió — landing page

Egyoldalas B2B értékesítési landing page a KBCo Stúdió (3 fős fejlesztői
kollektíva) számára. A cél: vállalkozások és közösségek, akiknek egyedi
webalkalmazásra, közösségi/tagsági platformra vagy automatizációra van
szükségük, visszahívást kérjenek.

## Stack

- **Next.js (App Router)** — frontend és backend egy keretrendszerben.
  API route: `app/api/callback-request/route.ts`.
- **Supabase (Postgres)** — a visszahívás-kérések tárolása a
  `callback_requests` táblában, séma: `supabase/schema.sql`.
- **Resend** — azonnali email-értesítés minden új visszahívás-kérésnél,
  `lib/notifications.ts`.
- **Tailwind CSS v4** — design tokenek a `app/globals.css`-ben (`@theme`).
- **Python automatizálás (jövőbeli)** — `automation/` mappa, lásd az ottani
  README-t.

## Fejlesztés

```bash
npm install
npm run dev
```

Nyisd meg a [http://localhost:3000](http://localhost:3000) címet.

## Supabase beüzemelése

1. Hozz létre egy Supabase projektet, futtasd le a `supabase/schema.sql`
   fájlt az SQL editorban.
   - **Ha már korábban létrehoztad a `callback_requests` táblát** (a
     `consent` oszlop bevezetése előtt), futtasd le a
     `supabase/migrations/2026-07-01-add-consent.sql` fájlt is — ez adja
     hozzá utólag a GDPR-hozzájárulást rögzítő oszlopot és frissíti az
     insert policy-t.
2. Töltsd ki a `.env.example` alapján a `.env.local` fájlt
   (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`).
3. Amíg ezek nincsenek beállítva, az API route 503-at ad vissza, a form
   erre felhasználóbarát hibaüzenetet jelenít meg.

## Email-értesítés beüzemelése (Resend)

1. Hozz létre egy fiókot a [resend.com](https://resend.com) oldalon, és
   szerezz be egy API kulcsot az API Keys menüpont alatt.
2. Igazold a saját küldő domainedet a Resend "Domains" menüpontja alatt
   (DNS rekordok hozzáadásával) — igazolt domain nélkül csak a
   `onboarding@resend.dev` teszt-cím használható, éles forgalomra nem
   alkalmas.
3. Töltsd ki a `.env.example` alapján: `RESEND_API_KEY`,
   `NOTIFICATION_EMAIL_FROM` (saját, igazolt domainen lévő cím),
   `NOTIFICATION_EMAIL_TO` (ide fusson be az értesítés).
4. Amíg ezek nincsenek beállítva, a lead továbbra is elmentődik
   Supabase-be, csak az email-értesítés marad el (a hiba a szerver
   logban jelenik meg, a form beküldőjének nem).

## GDPR és adatkezelés

- `app/adatvedelem`, `app/cookie-tajekoztato`, `app/impresszum` — a jogi
  oldalak; több helyen `[TODO]` jelöléssel várnak a cégadatokra
  (székhely, cégjegyzékszám, adószám, elérhetőség) és a pontos adatmegőrzési
  időtartam meghatározására. **Ajánlott ügyvéddel átnézetni éles indítás
  előtt.**
- A visszahívás-formok (`components/CallbackForm.tsx`) kötelező
  hozzájárulási checkboxot tartalmaznak, ami az `adatvedelem` oldalra
  linkel; a szerver (`app/api/callback-request/route.ts`) és az adatbázis
  RLS policy-ja is elutasítja a mentést hozzájárulás nélkül.
- `components/CookieConsent.tsx` — süti-tájékoztató sáv, ami elmenti a
  választásod a böngésző helyi tárolójában; a lábléc
  &bdquo;Süti beállítások&rdquo; linkje bármikor újra megnyitja.

## Build

```bash
npm run lint
npm run build
```
