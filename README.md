# MI Építettük — landing page + belső sales CRM

A repo két részből áll:

- **Landing page** (`app/(site)/`) — egyoldalas B2B értékesítési oldal a
  MI Építettük számára, visszahívás-kérés formmal.
- **CRM** (`app/crm/`) — belső, bejelentkezés-védett sales CRM: lead/deal
  pipeline, kérdőív-automatizáció, discovery call foglalás, Google Calendar
  integráció, riportok. Lásd lent a "CRM" szekciót.

## Stack (landing page)

- **Next.js (App Router)** — frontend és backend egy keretrendszerben.
  API route: `app/api/callback-request/route.ts`.
- **Prisma + Postgres (CRM adatbázis)** — a visszahívás-kérés beküldése egy
  Lead-et hoz létre a CRM pipeline-jában, "Visszahívásra vár" stádiumban
  (ugyanaz az adatbázis és modell, amit a CRM admin felülete is használ) —
  így a form ténylegesen megjelenik a CRM-ben, nem egy elkülönített táblába
  íródik.
- **Google Workspace SMTP** — azonnali email-értesítés minden új
  visszahívás-kérésnél, `lib/notifications.ts`.
- **Tailwind CSS v4** — design tokenek a `app/globals.css`-ben (`@theme`).
- **Python automatizálás (jövőbeli)** — `automation/` mappa, lásd az ottani
  README-t.

## Fejlesztés

```bash
npm install
npm run dev
```

Nyisd meg a [http://localhost:3000](http://localhost:3000) címet.

## Adatbázis beüzemelése

A landing page visszahívás-form és a CRM ugyanazt a Postgres adatbázist és
Prisma sémát használja (lásd lent, "CRM" szekció) — külön Supabase-tábla
beüzemelése a formhoz **nem** szükséges. Töltsd ki a `.env.example` alapján
a `.env.local` fájlt (`DATABASE_URL`, `SUPABASE_URL`,
`SUPABASE_PUBLISHABLE_KEY` — utóbbi kettő a CRM bejelentkezéshez kell).

> A `supabase/schema.sql` és `supabase/migrations/` egy korábbi, önálló
> `callback_requests` Supabase-táblát dokumentál — ezt az API route már nem
> használja, a fájlok csak történeti referenciaként maradtak meg.

## Email-értesítés beüzemelése (Google Workspace SMTP)

1. A küldő Google Workspace fiókodon (pl. `balint@miepitettuk.hu`)
   kapcsold be a "2 lépéses ellenőrzést" (Google Fiók → Biztonság), ha
   még nincs bekapcsolva — ez feltétele az Alkalmazásjelszó
   létrehozásának.
2. Ugyanott, **Alkalmazásjelszavak** menüpont alatt hozz létre egy új app
   jelszót (pl. "MI Építettük CRM" néven) — ez egy 16 karakteres,
   kizárólag SMTP-hez használható jelszó, nem a normál fiókjelszó.
3. Töltsd ki a `.env.example` alapján: `SMTP_HOST` (`smtp.gmail.com`),
   `SMTP_PORT` (`587`), `SMTP_USER` (a küldő postafiók címe),
   `SMTP_PASSWORD` (az imént létrehozott app jelszó), `NOTIFICATION_EMAIL_TO`
   (ide fusson be az értesítés).
4. Amíg ezek nincsenek beállítva, a lead továbbra is elmentődik a CRM
   pipeline-jába, csak az email-értesítés marad el (a hiba a szerver
   logban jelenik meg, a form beküldőjének nem).

   **Fontos**: a Google Workspace "IP-alapú SMTP relay" szolgáltatása
   (Admin Console → Gmail → Routing) fix, engedélyezett forrás-IP-khez van
   kötve, ami Vercel serverless függvényekről (dinamikus IP-k) **nem
   működik** — ezért hitelesített SMTP-t (app jelszóval) használ a
   rendszer, ami bármilyen IP-ről működik.

## GDPR és adatkezelés

- `app/adatvedelem`, `app/cookie-tajekoztato`, `app/impresszum` — a jogi
  oldalak; több helyen `[TODO]` jelöléssel várnak a cégadatokra
  (székhely, cégjegyzékszám, adószám, elérhetőség) és a pontos adatmegőrzési
  időtartam meghatározására. **Ajánlott ügyvéddel átnézetni éles indítás
  előtt.**
- A visszahívás-formok (`components/CallbackForm.tsx`) kötelező
  hozzájárulási checkboxot tartalmaznak, ami az `adatvedelem` oldalra
  linkel; a szerver (`app/api/callback-request/route.ts`) elutasítja a
  mentést hozzájárulás nélkül, és a hozzájárulás tényét az audit logba is
  rögzíti.
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
- **Auth: Supabase Auth, magic link (jelszó nélkül)** a NextAuth.js helyett
  — a projekt már Supabase-re épül, a Supabase Auth managed munkamenet-JWT-t
  és rate limitinget ad készen (a login endpoint a Supabase saját,
  hosztolt Auth API-ja, amit a böngésző hív közvetlenül — ezért nincs saját
  login API route-unk rate limitelni). Nincs jelszó: a `/crm/login` oldal
  (`LoginForm.tsx`) `supabase.auth.signInWithOtp({ shouldCreateUser: false
  })`-t hív, ami egyszer-használatos, rövid élettartamú bejelentkező linket
  küld emailben — és **kizárólag** olyan email címre, ami már létezik a
  Supabase Auth-ban (a `shouldCreateUser: false` miatt ismeretlen címre nem
  küld linket, és nem is hoz létre új usert). A linkre kattintás az
  `app/auth/callback/route.ts` route handlerre irányít, ami a PKCE
  `code`-ot valódi munkamenetre váltja, majd a `/crm`-re (vagy a `next`
  paraméterben kért oldalra) irányít. Új user tehát csak manuálisan, a
  Supabase Auth Dashboardból hozható létre (lásd lent a "Beüzemelés"
  résznél) — jelenleg csak egy: `balint@miepitettuk.hu`.
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
   Users → Add user), a `FIRST_ADMIN_EMAIL`-ben megadott email címmel
   (jelenleg: `balint@miepitettuk.hu`) — jelszó nem kell hozzá (magic link
   auth), de az "Auto Confirm User" opciót jelöld be, hogy a cím azonnal
   megerősítettnek számítson. Első bejelentkezéskor a rendszer
   automatikusan admin `Profile` sort hoz létre neki. Mivel a login
   `shouldCreateUser: false`-szal hív `signInWithOtp`-t, más email címre
   nem is küldhető bejelentkező link, amíg ott nincs Dashboardból
   létrehozott user — ez tartja egyelőre egyetlen userre zárva a rendszert.
5. Supabase Dashboard → Authentication → URL Configuration: a `Site URL`
   legyen a `NEXT_PUBLIC_APP_URL` (pl. `http://localhost:3000` fejlesztésben,
   `https://miepitettuk.hu` élesben), és vedd fel a `Redirect URLs` közé az
   `<NEXT_PUBLIC_APP_URL>/auth/callback` címet — enélkül a Supabase a magic
   link kattintás után nem a `/auth/callback` route handlerre, hanem a Site
   URL-re irányít, és a bejelentkezés nem fejeződik be.
6. `npm run dev`, majd `/crm/login` — add meg az email címet, a Supabase
   elküldi a bejelentkező linket (helyi fejlesztésben a Supabase projekt
   Dashboard → Authentication → Logs alatt, vagy a beállított SMTP-n
   keresztül nézhető meg/érkezik meg).

7. Email küldéshez (kérdőív-meghívó) állítsd be az `SMTP_HOST` / `SMTP_PORT`
   / `SMTP_USER` / `SMTP_PASSWORD` env változókat is (lásd fent,
   "Email-értesítés beüzemelése"), enélkül a stádiumváltás lefut, de
   figyelmeztetést kapsz,
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
  alatt" státuszba → a stádium frissül, és ha be van állítva az SMTP, a
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
DATABASE_URL="postgresql://user:pass@localhost:5432/mi_epitettuk_crm_dev" npm run prisma:migrate
DATABASE_URL="postgresql://user:pass@localhost:5432/mi_epitettuk_crm_dev" npx prisma db seed
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
  eltűnik a szabad sávok közül (ütközésvizsgálat), és — ha az SMTP be van
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

### Google Calendar integráció (Phase 5)

- **OAuth2** (`lib/google/oauth.ts`, `app/api/google/oauth/connect`,
  `app/api/google/oauth/callback`): minden sales rep a saját
  `/crm/settings/calendar` oldaláról csatlakoztathatja a Google
  Calendarját (`access_type: offline` + `prompt: consent`, hogy mindig
  kapjunk refresh tokent). A `state` paraméter a kezdeményező rep saját
  profil id-ja — a callback újra ellenőrzi, hogy a bejelentkezett user
  egyezik-e vele (CSRF védelem).
- **Titkosítás** (`lib/crypto/secretBox.ts`): AES-256-GCM, `ENCRYPTION_KEY`
  env változóval — az access/refresh tokenek soha nem kerülnek
  plaintext-ben az adatbázisba.
- **FreeBusy** (`lib/google/freebusy.ts`): a szabad sávok generálása
  (`lib/booking/slots.ts`) mostantól a rep Google Calendarjában lévő
  foglalt időket is kizárja, nem csak a CRM-es foglalásokat. Ha a rep
  nincs csatlakoztatva, vagy a Google API hibázik, a rendszer csendben
  visszaesik a Phase 4-es (csak CRM-es) viselkedésre — egy külső
  integrációs hiba nem blokkolhatja a foglalást.
- **Esemény létrehozás/törlés** (`lib/google/events.ts`): foglaláskor a
  rendszer létrehoz egy eseményt a rep naptárában, lemondáskor/
  átütemezéskor törli/újra létrehozza — ha a rep nincs csatlakoztatva,
  ez csendben kimarad (a CRM-es `Booking` rekord ettől függetlenül
  működik).
- **Szinkron** (`lib/google/sync.ts`, `scripts/run-scheduled-tasks.ts`):
  polling alapú (nem push webhook — ahhoz publikusan elérhető HTTPS
  végpont kellene, amit ebben a fejlesztési fázisban nem lehet éles
  Google-lel tesztelni). Periodikusan (docker-compose `scheduler`
  service, alapból 5 percenként) ellenőrzi a repek naptárában lévő,
  CRM-ből származó eseményeket; ha egy eseményt a rep törölt vagy
  áthelyezett közvetlenül a Google Calendarban, a CRM-es `Booking` sort
  ennek megfelelően frissíti (`booking.cancelled_externally` /
  `booking.updated_externally` audit log bejegyzésekkel).
- Ugyanez a `scripts/run-scheduled-tasks.ts` küldi ki a **24 órás és 1
  órás emlékeztető emaileket** is (`lib/reminders/`) — ez technikailag a
  spec 4. pontjához (foglalási logika) tartozik, de mivel mindkettő
  ugyanazt az időzített háttérjob-infrastruktúrát igényli, egyben
  készült el a Google-szinkronnal.

**Fontos korlátozás**: a Google OAuth/FreeBusy/esemény-kezelés kódja
valódi Google Cloud OAuth kliens hitelesítő adatok nélkül nem
tesztelhető végponttól végpontig — ebben a sandboxban nincs ilyen. A
kód type-check-elt, lint-elt és a *hiányzó kapcsolat* ági viselkedés
(graceful fallback) élesben tesztelve lett (foglalás/átütemezés/lemondás
Google nélkül változatlanul működik), de a tényleges OAuth-csere,
FreeBusy-lekérdezés és esemény-CRUD helyességét egy valós Google Cloud
projekttel (`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`) kell manuálisan
leellenőrizni éles/staging környezetben.

### Amit érdemes manuálisan tesztelni (Phase 5)

Ehhez valódi Google Cloud OAuth 2.0 Client ID kell (Google Calendar API
engedélyezve, `GOOGLE_OAUTH_REDIRECT_URI` hozzáadva az Authorized
redirect URIs listához):

- `/crm/settings/calendar` → "Csatlakozás Google Calendarhoz" →
  Google consent képernyő → visszairányítás után "Csatlakoztatva"
  állapot látszik.
- Heti elérhetőség mentése → csak a bejelölt napokon/sávokban jelennek
  meg szabad időpontok a `/foglalas/[token]` oldalon.
- Foglalás után az esemény megjelenik a rep valódi Google Calendarjában;
  a Google Calendarban meglévő (nem CRM-es) elfoglaltság idejére a
  `/foglalas/[token]` nem ajánl fel időpontot.
- A Google Calendarban közvetlenül törölt/áthelyezett esemény
  `npm run tasks:run` lefuttatása (vagy a `scheduler` service várakozása)
  után frissül a CRM-ben (audit log: `booking.cancelled_externally` /
  `booking.updated_externally`).
- "Lecsatlakoztatás" → a kapcsolat törlődik, a szabad sávok generálása
  visszaáll a csak-CRM-es viselkedésre.
- `npm run tasks:run` — helyi Postgres ellen lefuttatva (Google
  kapcsolat nélkül) hibamentesen fut le, nem küld emlékeztetőt, ha nincs
  esedékes foglalás.
- `npm test` — `lib/crypto/secretBox.test.ts` (titkosítás round-trip +
  tamper-elutasítás) és `lib/reminders/rules.test.ts` (24h/1h emlékeztető
  esedékesség-ablak) fedi le a tesztelhető logikát.

### Docker Compose (self-hosted) deploy

`docker-compose.yml` három service-t indít: `app` (Next.js, `runner`
build target, `output: "standalone"`), `scheduler` (Google-szinkron +
emlékeztetők, `scheduler` build target, `SCHEDULER_INTERVAL_SECONDS`
env-vel állítható gyakorisággal), és opcionálisan `postgres` (ha nem a
Supabase-hosztolt Postgrest használod — ez esetben hagyd ki és a
`DATABASE_URL`-t állítsd a Supabase kapcsolati sztringre). Mindkét app
service a `.env` fájlt olvassa be.

```bash
docker compose up --build
```

**Nem tesztelt ebben a sandboxban** (nincs elérhető Docker daemon): a
`Dockerfile`/`docker-compose.yml` type-check-elt, a Next.js
`output: "standalone"` a dokumentált hivatalos mintát követi, de a
tényleges image-buildet és a `scheduler` service valós lefutását érdemes
leellenőrizni az első éles/staging deploy előtt.

### Admin felület (Phase 6)

Az `/crm/admin` alatt (csak `ADMIN` szerepkörnek):

- **Kérdőív-szerkesztő** (`/crm/admin/questionnaires`) — sablonok
  létrehozása, aktiválása (egyszerre csak egy sablon lehet aktív — az
  aktiválás egy tranzakcióban deaktiválja a többit), kérdések
  hozzáadása/törlése/átrendezése (fel/le), minden kérdéstípushoz (rövid/
  hosszú szöveg, szám, dátum, igen/nem, legördülő, jelölőnégyzetek) az
  utóbbi kettőhöz vesszővel elválasztott opciólistával.
- **Email sablonok** (`/crm/admin/email-templates`) — mind a 6
  automatizált email (kérdőív-meghívó, kérdőív-visszaigazolás,
  foglalás-visszaigazolás ügyfélnek/repnek, emlékeztető, lemondás)
  szerkeszthető tárgy/HTML/sima szöveg mezőkkel; a sablon a beépített
  alapértelmezést használja, amíg admin nem szabja testre.
- **Pipeline-szerkesztő** (`/crm/admin/pipeline`) — stádiumok
  címkéje/színe/sorrendje szerkeszthető; új (nem rendszer-) stádium
  hozzáadható; törlés csak nem-rendszer stádiumra és csak akkor
  engedélyezett, ha jelenleg nincs lead abban a stádiumban.
- **Audit log** (`/crm/admin/audit-log`) — szűrés entitástípus és
  művelet-string szerint, lapozással.

### Amit érdemes manuálisan tesztelni (Phase 6)

- Új kérdőív-sablon létrehozása, kérdések hozzáadása vegyes típusokkal
  (legalább egy SELECT/MULTISELECT opciólistával) → aktiválás után az új
  sablon jelenik meg a `/kerdoiv/[token]` publikus oldalon.
- Kérdés átrendezése fel/le nyilakkal → a publikus kérdőívoldalon az új
  sorrendben jelennek meg.
- Email sablon szerkesztése (pl. `booking_confirmation_client` tárgyának
  módosítása) → egy új foglalás visszaigazoló emailje már a módosított
  szöveget használja.
- Új, egyedi pipeline-stádium hozzáadása → megjelenik a lead adatlap
  stádium-választójában; törlés csak akkor engedélyezett, ha nincs benne
  lead.
- Rendszer-stádium (pl. "Visszahívásra vár") törlés gombja nem jelenik
  meg.
- Audit log szűrése entitástípus szerint (chip) és szabad szöveges
  keresés a művelet mezőre — az eddigi fázisok minden művelete
  (`lead.created`, `lead.stage_changed`, `questionnaire.submitted`,
  `booking.created`, `booking.rescheduled`, `booking.cancelled`,
  `google_calendar.connected` stb.) megjelenik.
- Az admin action-ök adatbázis-szintű logikáját (sablon aktiválás
  kizárólagossága, kérdés-átrendezés, stádium törlési védelem) helyi
  Postgres ellen script-tel végigfuttatva, közvetlenül ellenőrizve
  (a bejelentkezett admin UI-t ebben a sandboxban nem lehetett
  végigkattintani, mert ahhoz valódi Supabase Auth session kell).

### Dashboard + riportolás (Phase 7)

A `/crm` (Áttekintés) mostantól:

- **Kanban nézet** (`KanbanBoard.tsx`) — minden pipeline-stádium egy
  oszlop, benne a leadek kártyaszerűen (név, cég, felelős), rákattintva a
  lead adatlapjára visz. Az oszlopok a Phase 6 pipeline-szerkesztőben
  beállított sorrendet/címkét/színt követik.
- **Szűrők** (`DashboardFilters.tsx`) — sales rep és forrás szerint
  (mindkettő a kanban-ra és a bevételi mutatókra is hat), valamint egy
  időszak-választó (nap/hét/hónap/év/all-time), ami csak a bevételi
  mutatókat szűkíti (a kanban mindig a jelenlegi, élő pipeline-állapotot
  mutatja, nem historikus).
- **Bevételi mutatók** (`RevenueCards.tsx`, `lib/dashboard/queries.ts`):
  - *Kiadott ajánlat*: azon leadek `dealValueCents` összege és száma,
    amik a kiválasztott időszakban léptek "Ajánlat készítés alatt"
    stádiumba (a `StatusHistory` alapján, nem a lead létrehozási
    dátuma alapján — a "mikor adtuk ki az ajánlatot" a releváns
    pénzügyi esemény).
  - *TCV*: a kiválasztott időszakban "Nyert" stádiumba lépett leadek
    `dealValueCents` összege.
  - *Cash Collected*: ugyanezen leadek `cashCollectedCents` összege.
  - *Elveszett*: a kiválasztott időszakban "Elveszett"-be lépett leadek
    száma.
  - Ha egy lead több alkalommal is belépett ugyanabba a stádiumba
    (pl. újranyitás után újra megnyerve), csak a legutóbbi belépés
    számít — nincs duplikált összesítés.
- A lead adatlapon új "Pénzügyi adatok" szekció (`FinancialsForm.tsx`)
  teszi lehetővé az ajánlat összegének és a cash collected értéknek a
  rögzítését forintban (az adatbázisban fillér-pontosságú egészként
  tárolva, a spec adatmodell-vázlata szerint).

### Amit érdemes manuálisan tesztelni (Phase 7)

- Adj meg egy leadhez ajánlat-összeget a "Pénzügyi adatok" szekcióban,
  majd léptesd "Ajánlat készítés alatt" stádiumba → a `/crm` "Kiadott
  ajánlat" kártyája megnő az összeggel, "Hónap" nézetben.
- Léptesd a leadet "Nyert"-re, add meg a cash collected összeget is → a
  TCV és Cash Collected kártyák frissülnek; "Nap"/"Hét" nézetben csak
  akkor jelenik meg, ha a "Nyert" átmenet ma/ezen a héten történt.
- Válts "All-time" nézetre → egy régebbi (múltbeli időpontra
  visszadátumozott `StatusHistory`-val rendelkező) nyert lead is
  megjelenik, amit a szűkebb időszak-nézetek kihagynak.
- Szűrj sales rep vagy forrás szerint → mind a kanban oszlopok, mind a
  bevételi kártyák csak a szűrésnek megfelelő leadeket veszik figyelembe.
- Ellenőrizve helyi Postgres ellen, közvetlen script-tel (a
  `getRevenueSummary` és `getKanbanBoard` alapjául szolgáló lekérdezés-
  logikával): egy "ma nyert" és egy "400 napja nyert" teszt-lead közül a
  "hónap" nézet csak az elsőt számolja, az "all-time" mindkettőt; a
  rep/forrás szűrés helyesen szűkíti a találatokat.
- `npm test` — `lib/dashboard/period.test.ts` fedi le az
  időszak-számítást (hét eleje hétfőre esik akkor is, ha a mai nap
  vasárnap, stb.).

### Még hátra van

Mind a 7 fázis elkészült a spec fejlesztési sorrendje szerint. Amit egy
éles bevezetés előtt még érdemes átnézni: a Google OAuth/FreeBusy/esemény-
kezelés valós Google Cloud projekttel való végigtesztelése (lásd Phase 5
szekció), a Docker Compose deploy tényleges kipróbálása, és a jogi oldalak
(`app/(site)/adatvedelem` stb.) `[TODO]` jelöléseinek kitöltése ügyvéddel.

## Diagnosztika és javítások

A 7 fázis elkészülte után egy teljes diagnosztikai átvizsgálás (típus-
ellenőrzés, lint, build, a kritikus üzleti logika manuális végigkövetése,
valós Postgres ellen reprodukált hibák) az alábbi problémákat találta és
javította — mindegyiket helyi Postgres ellen reprodukálva a javítás előtt,
majd a javítás után újra lefuttatva a repró-scriptet a tényleges javulás
igazolására:

- **Elavult kérdőív-link visszaregressziózhatta a lead státuszát**
  (`app/(public)/kerdoiv/[token]/actions.ts`): ha egy leadhez több
  kérdőív-link is kiment (pl. újraküldés miatt), egy korábbi, még nem
  lejárt/fel nem használt link beküldése felülírhatta egy azóta
  továbbhaladt (akár már megnyert/elveszett) lead stádiumát. Most a
  beküldés egy tranzakción belül frissen ellenőrzi, hogy a lead
  ténylegesen még "Kérdőív kitöltés alatt" státuszban van-e, és a
  linkfelhasználást is atomi, feltételes update-tel zárja ki (konkurrens
  beküldés ellen).
- **Kérdőív-link újraküldése** (`resendQuestionnaireInvite`, lead
  adatlap): admin/rep most manuálisan újraküldheti a linket, ha az első
  email nem érkezett meg — nem kell a stádiumot ki-be mozgatni ehhez (ami
  korábban éppen a fenti hibát okozta). Újraküldéskor a korábbi, fel nem
  használt link automatikusan lejárttá válik.
- **Konkurrens foglalási kérések ütköző (átfedő) foglalást hozhattak
  létre** ugyanahhoz a saleshez: az alkalmazás-szintű ütközésvizsgálat
  (`isBookableSlot`) nem atomi. Ezt egy adatbázis-szintű Postgres EXCLUDE
  constraint zárja ki most véglegesen (`prisma/migrations/
  20260730125823_booking_no_overlap_constraint` — igényli a
  `btree_gist` extension-t; standard Postgres contrib modul, Supabase-en
  is elérhető, de ellenőrizd más hosztolt Postgres szolgáltatónál).
- **Email küldési hibák (foglalás-visszaigazolás, lemondás,
  emlékeztető) korábban csak szerver logba kerültek**, sehol nem voltak
  auditálva vagy a felhasználó felé jelezve — most minden ilyen email
  kimenetele (siker/hiba) audit log bejegyzést kap
  (`booking.confirmation_email_sent`, `booking.cancellation_email_sent`,
  `booking.reminder_24h_sent`/`_1h_sent`). Az emlékeztető emailek emellett
  mostantól csak sikeres küldés esetén jelölődnek "kiküldve"-nek, így egy
  átmeneti SMTP-hiba esetén a következő háttérjob-futás újra
  megpróbálja.
- **Email sablonok HTML-injekció kockázata**: a `{{leadName}}`/
  `{{repName}}` típusú változók korábban escape-elés nélkül kerültek a
  HTML email törzsbe — egy lead neve (amit egy publikus formon bárki
  megadhat) tetszőleges markup-ot injektálhatott volna a (főleg rep felé
  menő) kimenő emailekbe. Most a HTML változat minden változóját
  escape-eljük (`lib/email/render.ts` `escapeHtml`), a sima szöveg
  változat változatlan marad.
- **`assignLeadOwner` és `updateLeadFinancials` hardening**: az előbbi
  most ellenőrzi, hogy a megadott `ownerId` valóban létező, jogosult
  profilra mutat-e (korábban egy érvénytelen ID kezeletlen adatbázis-
  hibát dobott), az utóbbi elutasítja a negatív összegeket.
- **`saveRepAvailability` szerveroldali validáció**: időformátum,
  9:00-18:00 globális kereten belüliség, és kezdő < záró idő ellenőrzése
  — korábban egy hibás bemenet (elgépelés, felcserélt idők) csendben nulla
  szabad időpontot eredményezett, visszajelzés nélkül.
- **Google Calendar kapcsolat állapota reaktívan is frissül** most: ha
  egy tényleges API hívás (nem csak a proaktív, lejárat előtti token-
  frissítés) auth-hibával (401/403) bukik el, a `syncStatus` azonnal
  "Hiba" állapotba vált, ahelyett hogy akár egy órán át hamisan
  "Csatlakoztatva"-t mutatna.
- **Apróbb takarítás**: eltávolítva egy soha nem használt
  `InvalidTransitionError` osztály; új `instrumentation.ts` szerver-
  indításkor figyelmeztet, ha a `NEXT_PUBLIC_APP_URL` nincs beállítva
  (enélkül minden kiküldött email linkje csendben domain nélküli,
  nem-kattintható relatív útvonal lenne).

**Amit a fenti javítások NEM fednek le** (a diagnosztika során azonosított,
de nem javított — ilyen nem maradt a listán, minden azonosított,
önállóan javítható tétel javításra került). Ami továbbra is emberi
döntést/kézi munkát igényel: a Google OAuth/Calendar API-hívások valós
Google Cloud projekttel való tesztelése, és a `npm test` jelenleg
kizárólag unit tesztekből áll — a fenti javításokat egy-egy, helyi
Postgres ellen futtatott, egyszer-használatos script-tel verifikáltam,
ezek nincsenek a repóba commitolva mint ismételhető regressziós teszt.

## Build

```bash
npm run lint
npm run build
npm test
```
