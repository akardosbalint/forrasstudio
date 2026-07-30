# KBCo Stúdió — landing page + belső sales CRM

A repo két részből áll:

- **Landing page** (`app/(site)/`) — egyoldalas B2B értékesítési oldal a
  KBCo Stúdió számára, visszahívás-kérés formmal.
- **CRM** (`app/crm/`) — belső, bejelentkezés-védett sales CRM: lead/deal
  pipeline, kérdőív-automatizáció, discovery call foglalás, Google Calendar
  integráció, riportok. Lásd lent a "CRM" szekciót.

## Stack (landing page)

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

## CRM

Enterprise belsős sales CRM, a beérkező visszahívás-kérésektől a discovery
call-ig. Fejlesztése fázisokban zajlik (lásd a projekt specifikációját);
ez a szakasz a **Phase 1** állapotát dokumentálja.

### Architektúra-döntések

- **Adatbázis: Prisma + a meglévő Supabase Postgres.** A landing page már
  Supabase-t használ, ezért a CRM domain-tábláit (Lead, pipeline stb.) is
  ugyanazon a Postgres adatbázison tartjuk, Prisma-val kezelve
  (`prisma/schema.prisma`) — nem kellett külön Postgres-t + NextAuth-ot
  bevezetni, kevesebb mozgó alkatrész, ugyanaz a garancia.
  - **Prisma 7**: a `PrismaClient` mindig explicit driver adaptert vár
    (`@prisma/adapter-pg`), a kapcsolati URL nem a `schema.prisma`-ban, hanem
    a `prisma.config.ts`-ben és a `DATABASE_URL` env változóban él. A
    generált kliens az (gitignore-olt) `generated/prisma/` mappába kerül,
    `npm install` után automatikusan (`postinstall` script).
- **Auth: Supabase Auth** (email/jelszó + később Google SSO) a NextAuth.js
  helyett — a projekt már Supabase-re épül, a Supabase Auth managed
  jelszó-hash-elést, munkamenet-JWT-t, rate limitinget (a login endpoint a
  Supabase saját, hoszingolt Auth API-ja, amit a böngésző hív közvetlenül —
  ezért nincs saját login API route-unk rate limitelni) és email-alapú
  jelszó-visszaállítást ad készen.
- **Jogosultságkezelés**: `Profile` tábla (Prisma) 1:1-ben a Supabase Auth
  felhasználóval, `role` mezővel (`ADMIN` / `SALES_REP` / `VIEWER`).
  `lib/auth/rbac.ts` a Data Access Layer: minden CRM oldal/server action
  `verifySession()` / `requireRole(...)` hívással ellenőrzi újra a
  jogosultságot (nem csak a `proxy.ts` optimista redirect-jére támaszkodva).
- **Route védelem**: `proxy.ts` (Next.js 16-ban ez a `middleware.ts` új
  neve) a `/crm/**` útvonalakat védi, nem bejelentkezett usert
  `/crm/login`-ra irányít.

### Beüzemelés

1. Hozz létre (vagy használd a meglévő) Supabase projektet.
2. Töltsd ki a `.env.example` alapján: `DATABASE_URL` (Supabase projekt
   Settings → Database → Connection string → URI), `SUPABASE_URL` /
   `SUPABASE_PUBLISHABLE_KEY` (szerver), `NEXT_PUBLIC_SUPABASE_URL` /
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (böngésző), `FIRST_ADMIN_EMAIL`.
3. Futtasd le a Prisma migrációt és a seedet (alap pipeline-stádiumok):
   ```bash
   npm run prisma:migrate
   npx prisma db seed
   ```
4. Hozz létre egy usert a Supabase Auth-ban (Dashboard → Authentication →
   Users → Add user), a `FIRST_ADMIN_EMAIL`-ben megadott email címmel —
   első bejelentkezéskor a rendszer automatikusan admin `Profile` sort hoz
   létre neki.
5. `npm run dev`, majd `/crm/login`.

### Amit érdemes manuálisan tesztelni (Phase 1)

- Bejelentkezés a `FIRST_ADMIN_EMAIL`-lel → `/crm`-en admin menüpont
  látszik, a pipeline-stádiumok kártyái helyes lead-számokat mutatnak.
- `/crm/leads/new` — lead létrehozása → átirányít a lead adatlapjára,
  "Visszahívásra vár" kezdő stádiummal, az előzmények szekcióban egy
  "Létrehozva →" bejegyzéssel.
- Lead adatlapján stádium váltása → az előzmények lista frissül, új sor
  jelenik meg a régi/új stádiummal, időbélyeggel és a bejelentkezett user
  nevével (audit trail).
- Bejelentkezés nélkül `/crm/leads`-re navigálva → redirect `/crm/login`-ra.
- Kijelentkezés → `/crm/leads` ismét `/crm/login`-ra redirectel.

### Még hátra van (a spec fázisai szerint)

Phase 2 (státuszgép + kérdőív-link + email), Phase 3 (publikus kérdőív
kitöltő), Phase 4 (foglalási motor), Phase 5 (Google Calendar
OAuth/FreeBusy/szinkron), Phase 6 (admin: kérdőív-szerkesztő, email
sablonok, pipeline-szerkesztő, audit log nézet), Phase 7 (dashboard +
riportolás). Ezek a Prisma adatmodellben már szerepelnek
(`QuestionnaireTemplate`, `Booking`, `GoogleCalendarConnection` stb.), de
UI/logika még nincs hozzájuk.

## Build

```bash
npm run lint
npm run build
npm test
```
