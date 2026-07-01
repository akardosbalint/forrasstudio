# Forrás Stúdió — landing page

Egyoldalas B2B értékesítési landing page a Forrás Stúdió (3 fős fejlesztői
kollektíva) számára. A cél: segítő szakmában dolgozó szakemberek (coachok,
pszichológusok, terapeuták, tanácsadók, wellness-vállalkozások)
visszahívást kérjenek.

## Stack

- **Next.js (App Router)** — frontend és backend egy keretrendszerben.
  API route: `app/api/callback-request/route.ts`.
- **Supabase (Postgres)** — a visszahívás-kérések tárolása a
  `callback_requests` táblában, séma: `supabase/schema.sql`.
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
2. Töltsd ki a `.env.example` alapján a `.env.local` fájlt
   (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
3. Amíg ezek nincsenek beállítva, az API route 503-at ad vissza, a form
   erre felhasználóbarát hibaüzenetet jelenít meg.

## Build

```bash
npm run lint
npm run build
```
