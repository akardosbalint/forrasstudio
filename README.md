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
3. Futtasd le a Prisma migrációt és a seedet (alap pipeline-stádiumok,
   alap kérdőív-sablon, email sablonok):
   ```bash
   npm run prisma:migrate
   npx prisma db seed
   ```
4. Hozz létre egy usert a Supabase Auth-ban (Dashboard → Authentication →
   Users → Add user), a `FIRST_ADMIN_EMAIL`-ben megadott email címmel —
   első bejelentkezéskor a rendszer automatikusan admin `Profile` sort hoz
   létre neki.
5. `npm run dev`, majd `/crm/login`.

6. Email küldéshez (kérdőív-meghívó) állítsd be a `RESEND_API_KEY` /
   `NOTIFICATION_EMAIL_FROM` env változókat is (lásd fent, "Email-értesítés
   beüzemelése"), enélkül a stádiumváltás lefut, de figyelmeztetést kapsz,
   hogy az email küldése nem sikerült.

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

### Amit érdemes manuálisan tesztelni (Phase 2)

- Lead adatlapján email cím **nélkül** próbáld "Kérdőív kitöltés alatt"
  státuszba tenni → hibaüzenet, a stádium nem változik.
- Adj meg email címet a leadhez (jelenleg csak létrehozáskor lehet — lead
  szerkesztés a Phase 6 admin körben bővül), majd váltsd "Kérdőív kitöltés
  alatt" státuszba → a stádium frissül, és ha be van állítva a Resend, a
  megadott email címre megérkezik a kérdőív-meghívó linkkel; ha nincs
  beállítva, sárga figyelmeztetés jelenik meg, de a stádium akkor is
  frissül.
- Próbálj sales rep userrel visszafelé lépni egy stádiumban (pl.
  "Discovery call lefoglalva" → "Visszahívásra vár") → hibaüzenet
  ("Nem engedélyezett átmenet"); ugyanez admin userrel engedélyezett.
- Sales rep bármikor "Elveszett"-re állíthatja a leadet, de admin nélkül
  nem nyitható vissza onnan.
- `npm test` — a `lib/pipeline/stateMachine.test.ts` 8 egységteszttel
  fedi le az átmenet-szabályokat.

### Amit érdemes manuálisan tesztelni (Phase 3)

A publikus kérdőív felület (`app/(public)/kerdoiv/[token]`) bejelentkezés
nélkül érhető el — helyi teszteléshez elég egy lead + `QuestionnaireLink`
sor manuális létrehozása (lásd lent a "Helyi teszt Postgres-szel" részt),
nincs szükség valódi Supabase Auth-ra.

- Érvényes, még ki nem töltött link megnyitása → a szeedelt kérdőív
  kérdései megjelennek típus szerint (textarea, szám, select stb.).
- Kitöltés + beküldés → "Köszönjük a kitöltést!" visszaigazolás; a
  háttérben: `QuestionnaireResponse` mentve, `QuestionnaireLink.usedAt`
  beállítva, a lead automatikusan "Időpontfoglalásra vár" stádiumba kerül,
  `StatusHistory` bejegyzés `changedById: null`-lal (rendszer által
  triggerelt, nem user által).
- Ugyanannak a linknek az újranyitása → "Ezt a kérdőívet már kitöltötted".
- Lejárt vagy nem létező token → megfelelő hibaüzenet, nincs 500-as hiba.
- `/foglalas/[token]` (ideiglenes placeholder, a Phase 4 cseréli le valódi
  foglalási felületre) — kitöltés előtt a kérdőívre irányít, kitöltés
  után egy "hamarosan" üzenetet mutat.

### Helyi teszt Postgres-szel (DATABASE_URL nélkül is Supabase helyett)

Fejlesztés/tesztelés közben nem szükséges valódi Supabase projekt a
Prisma-oldal (adatmodell, státuszgép, kérdőív) teszteléséhez — bármilyen
elérhető Postgres megteszi:

```bash
# Postgres indítása, adatbázis létrehozása, majd:
DATABASE_URL="postgresql://user:pass@localhost:5432/kbco_crm_dev" npm run prisma:migrate
DATABASE_URL="postgresql://user:pass@localhost:5432/kbco_crm_dev" npx prisma db seed
```

Csak a `/crm/**` (bejelentkezés-védett) oldalak igényelnek valódi Supabase
Auth projektet — a publikus kérdőív/foglalás felület nem.

### Amit érdemes manuálisan tesztelni (Phase 4)

A foglalási motor (`lib/booking/rules.ts`, `lib/booking/slots.ts`,
`lib/booking/actions-core.ts`) a publikus `/foglalas/[token]` felületen és
a CRM lead adatlapon (`Lemondás` gomb) keresztül érhető el.

- Kérdőív kitöltése után `/foglalas/[token]` → csak munkanapi, 9-18 közti,
  90 percbe beleférő, a beküldéstől számított 24 óránál későbbi időpontok
  jelennek meg, napok szerint csoportosítva.
- Időpont választása + "Időpont lefoglalása" → a lead automatikusan
  "Discovery call lefoglalva" státuszba kerül, a kiválasztott időpont
  eltűnik a szabad sávok közül (ütközésvizsgálat), és — ha a Resend be van
  állítva — az ügyfél és a rep is kap egy visszaigazoló emailt `.ics`
  naptármeghívó csatolással.
- "Átütemezés" → új időpont választható, a régi foglalás
  `RESCHEDULED` státuszba kerül, új `Booking` sor jön létre
  (`rescheduleOfId` lánccal); a felület visszatér a "lefoglalva" nézetbe
  (nem ragad benn az időpontválasztóban).
- "Lemondás" → a foglalás `CANCELLED`-re vált, a lead visszakerül
  "Időpontfoglalásra vár" státuszba, újra foglalható.
- Ugyanez a lemondás a CRM-ben (`/crm/leads/[id]`) is elérhető sales
  rep/admin számára a foglalás melletti "Lemondás" gombbal.
- `npm test` — a `lib/booking/rules.test.ts` (17 teszt: 24 órás szabály,
  munkanap/9-18 ablak, 90 perces ütközésvizsgálat) és a
  `lib/booking/timezone.test.ts` (DST-biztos időzóna-konverzió) fedi le a
  foglalási szabályokat.
- Végigfuttatva egy helyi Postgres ellen, fejjel nélküli böngészőben:
  foglalás → átütemezés → lemondás teljes láncolat, audit log
  bejegyzésekkel (`booking.created` → `booking.rescheduled` →
  `booking.cancelled`) és a `StatusHistory`/pipeline-státusz helyes
  követésével.

**Ismert korlátozás (Phase 5-ig)**: a szabad sávok generálása egyelőre
csak a `RepAvailability` táblát (ha van beállítva a repnek) és a meglévő
CRM-foglalásokat veszi figyelembe — a rep Google Calendarjában lévő egyéb
(nem CRM-es) elfoglaltságát még nem, ez a Google Calendar
FreeBusy-integrációval kerül be.

### Még hátra van (a spec fázisai szerint)

Phase 5
(Google Calendar OAuth/FreeBusy/szinkron), Phase 6 (admin:
kérdőív-szerkesztő, email sablonok, pipeline-szerkesztő, audit log nézet),
Phase 7 (dashboard + riportolás). Ezek a Prisma adatmodellben már szerepelnek
(`QuestionnaireTemplate`, `Booking`, `GoogleCalendarConnection` stb.), de
UI/logika még nincs hozzájuk.

## Build

```bash
npm run lint
npm run build
npm test
```
