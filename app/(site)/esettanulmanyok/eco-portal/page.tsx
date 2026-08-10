import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/FinalCTA";
import {
  CaseStudyHero,
  CaseStudyStats,
  CaseStudyBody,
  CaseStudyTOC,
  CaseStudySection,
  CaseStudyLede,
  CaseStudyH3,
  CaseStudyList,
  CaseStudyCallout,
  CaseStudyDiagram,
  CaseStudyTable,
  CaseStudyGallery,
  CaseStudyTimeline,
  CaseStudyLadder,
  CaseStudyBarChart,
  CaseStudyTiles,
  CaseStudyColophon,
} from "@/components/case-study/CaseStudyBlocks";

export const metadata: Metadata = {
  title: "ECO Közösségi Portál — Esettanulmány — MI Építettük",
  description:
    "Hogyan lett egy 16 szintű képzési ranglétrát követő, 1000+ fős magyar önfejlesztési egyesületből tíz hét alatt egy auditálható, GDPR-kompatibilis, AI-asszisztáltan épített digitális otthon.",
};

const tocItems = [
  { href: "#exec", label: "Vezetői összefoglaló" },
  { href: "#first-look", label: "Első benyomás" },
  { href: "#overview", label: "Projekt áttekintés" },
  { href: "#arch", label: "Technikai architektúra" },
  { href: "#features", label: "Funkció-leltár" },
  { href: "#security", label: "Biztonsági architektúra" },
  { href: "#ai", label: "AI-asszisztált fejlesztés" },
  { href: "#challenges", label: "Kihívások és megoldások" },
  { href: "#results", label: "Eredmények és tanulságok" },
];

const layersDiagram = `┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND (SPA)                          │
│  React 18 + TypeScript + Vite 5 + React Router 6                │
│  Tailwind CSS + shadcn/ui (Radix)  ·  TanStack Query            │
│  react-hook-form + Zod  ·  next-themes (light / dark)            │
└─────────────────────────────┬────────────────────────────────┘
                               │ supabase.functions.invoke()
                               │  — SOHA nincs közvetlen DB hívás
                               ▼
┌──────────────────────────────────────────────────────────────┐
│               BACKEND-FOR-FRONTEND · 29 Edge Function           │
│   api-profiles · api-groups · api-recipes · api-notifications   │
│   api-grades · api-training · api-storage · api-admin  (+21)    │
└─────────────────────────────┬────────────────────────────────┘
                               │ service_role kliens
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                 SUPABASE · Postgres + Auth + Storage             │
│   39 tábla · Row-Level Security · pg_cron ütemezett feladatok    │
│   JWT auth (getClaims)  ·  Storage (signed URL)                  │
└──────────────────────────────────────────────────────────────┘`;

const pipelineDiagram = `Request → CORS (origin allowlist) → Zod séma-validáció → JWT auth
        → Rate limiting (user + function) → Szerepkör-ellenőrzés
        → Üzleti logika (service_role kliens)`;

const schemaDiagram = `┌───────────────┐        ┌────────────────────┐      ┌──────────────┐
│   profiles    │──1:1───│    user_roles       │      │ user_grades  │
├───────────────┤        ├────────────────────┤      ├──────────────┤
│ id (PK, auth) │        │ user_id (FK)        │      │ user_id (FK) │
│ full_name     │        │ role (enum)         │      │ modul/system │
│ theme, badges │        └────────────────────┘      │ level, status│
└───────┬───────┘                                     └──────┬───────┘
        │                                                     │
        │              ┌────────────────────┐          ┌──────▼───────┐
        ├──1:N─────────│  group_memberships  │          │ grade_audit_ │
        │              └─────────┬──────────┘          │     log      │
        │                        │                       └──────────────┘
┌───────▼──────┐          ┌──────▼──────┐        ┌───────────────┐
│ group_posts  │──1:N─────│   groups     │        │ expert_reviews │
├──────────────┤          └─────────────┘        ├───────────────┤
│ post_comments│                                  │ professional_ │
│ post_reactions│                                 │  profiles     │
└──────────────┘                                  └───────────────┘

+ access_requests · audit_log · security_events · bug_reports
+ recipes / recipe_ratings / recipe_favorites · training_events
+ notifications · user_badges · gdpr_requests · file_scan_results …`;

export default function EcoPortalCaseStudyPage() {
  return (
    <>
      <Nav legal />
      <main className="flex-1">
        <CaseStudyHero
          eyebrow="Esettanulmány · Zárt közösségi platform"
          title="ECO Közösségi Portál"
          subtitle="Hogyan lett egy 16 szintű képzési ranglétrát követő, 1000+ fős magyar önfejlesztési egyesületből tíz hét alatt egy auditálható, GDPR-kompatibilis, AI-asszisztáltan épített digitális otthon."
          meta={[
            { label: "Megrendelő", value: "ECO – Tudatosság Energiája Egyesület" },
            { label: "Székhely", value: "Göd, Magyarország" },
            { label: "Fejlesztés", value: "2026.05.30 – folyamatban" },
          ]}
        />

        <CaseStudyStats
          stats={[
            { value: "39", label: "adatbázis-tábla, 154 migráció" },
            { value: "29", label: "Edge Function — Backend-for-Frontend réteg" },
            { value: "~10", label: "hét a nulláról éles rendszerig" },
            { value: "97,7%", label: "AI-asszisztált commit — 260-ból 254" },
          ]}
        />

        <CaseStudyBody>
          <CaseStudyTOC items={tocItems} />

          <CaseStudySection
            id="exec"
            kicker="I. Vezetői összefoglaló"
            title="Egy fokozatrendszer, egyetlen digitális térben"
          >
            <CaseStudyLede>
              Az ECO Közösségi Portál egy zárt, meghívásos community-platform, amely a Göd
              székhelyű ECO – Tudatosság Energiája Egyesület tagjainak fokozat-nyilvántartását,
              belső hírfolyamát, zárt csoportjait, szakértő-keresőjét és képzési naptárát
              integrálja egyetlen, auditálható rendszerbe.
            </CaseStudyLede>
            <p>
              A szervezet működésének gerince egy 16+ lépcsős, egymásra épülő modulrendszer
              (ECO 1–16, Karma, Formázás modulok és workshopok) — ez korábban nyilvánvalóan
              táblázatokban és privát csatornákon élt. A portál ezt egy szerepkör-alapú,
              naplózott, GDPR-megfelelő digitális rendszerbe konszolidálta.
            </p>
            <p>
              A projekt technikai szempontból is figyelemre méltó: a 260 commit{" "}
              <strong className="text-ink">97,7%-át</strong> AI-eszközök jegyzik — egy no-code
              AI platform építette fel a gyors prototípust, majd a{" "}
              <strong className="text-ink">Claude Code</strong> vitte végig a biztonsági
              hardening, a Backend-for-Frontend architektúra és a produkciós minőségbiztosítás
              munkáját. Az eredmény tíz hét alatt egy 39 táblás adatbázis, 29 szerveroldali
              endpoint és 40+ oldal — nem prototípus, hanem éles, karbantartott rendszer.
            </p>
          </CaseStudySection>

          <CaseStudySection id="first-look" kicker="Első benyomás" title="A felület">
            <p>
              Nyilvános regisztráció nincs — a portál kizárólag meghívásos, adminisztrátori
              jóváhagyáshoz kötött hozzáférés-igénylési folyamaton (
              <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
                AccessRequestPage
              </code>
              ) keresztül nyílik meg, amely már a belépés előtt rákérdez a jelölt meglévő
              ECO-fokozataira.
            </p>
            <CaseStudyGallery
              images={[
                {
                  src: "/case-studies/eco-portal/login-desktop.png",
                  alt: "Bejelentkezési képernyő desktop nézetben",
                  width: 1440,
                  height: 900,
                  caption: (
                    <>
                      <b className="text-ink">Bejelentkezés</b> — a felület meleg, papír-szerű
                      alapszíne és a zöld ECO-márkajelzés desktop nézetben.
                    </>
                  ),
                },
                {
                  src: "/case-studies/eco-portal/login-mobile.png",
                  alt: "Bejelentkezés mobil nézetben",
                  width: 390,
                  height: 844,
                  mobile: true,
                  caption: (
                    <>
                      <b className="text-ink">Mobil nézet</b> — teljes reszponzivitás, azonos
                      komponensrendszerrel.
                    </>
                  ),
                },
              ]}
            />
            <CaseStudyGallery
              images={[
                {
                  src: "/case-studies/eco-portal/access-request.png",
                  alt: "Hozzáférés igénylése űrlap",
                  width: 1440,
                  height: 900,
                  caption: (
                    <>
                      <b className="text-ink">Hozzáférés igénylése</b> — az űrlap már itt rögzíti
                      a jelölt ECO-fokozatait (Konzulens / Oktató / Megalkotó), amit az admin
                      külön hitelesít.
                    </>
                  ),
                },
                {
                  src: "/case-studies/eco-portal/privacy-notice.png",
                  alt: "Adatkezelési tájékoztató",
                  width: 1440,
                  height: 900,
                  caption: (
                    <>
                      <b className="text-ink">Adatkezelési tájékoztató</b> — a GDPR-megfelelőség a
                      tervezés szintjén, nem utólagos ráépítésként jelenik meg.
                    </>
                  ),
                },
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="overview" kicker="II. Projekt áttekintés" title="Háttér, célcsoport, célok">
            <CaseStudyH3>Háttér</CaseStudyH3>
            <p>
              Az egyesület minősítési rendszere tagokat ECO 1-től ECO 16-ig terjedő
              alapmodulokon vezet végig, kereszthivatkozásokkal kapcsolódó Karma- és
              Formázás-modulokkal, illetve workshopokkal (WS0–WS4), szigorú
              előfeltétel-láncolattal. A projekt első commitja 2026. május 30-án egy
              zöldmezős, AI-asszisztált projektként indult, és gyorsan egy teljes körű, védett
              belső portállá nőtte ki magát.
            </p>

            <CaseStudyH3>Célcsoport és szerepkörök</CaseStudyH3>
            <p>
              A rendszer kettős tengelyen szervezi a jogosultságokat: közösségi hierarchia (a
              tag képzési/felelősségi szintje) és technikai szerepkör (rendszeradminisztráció)
              — a kettő szándékosan elválik egymástól.
            </p>
            <CaseStudyLadder
              rungs={[
                {
                  role: "felhasználó",
                  desc: "Profil, hírfolyam, zárt csoportok, recepttár, hibabejelentés",
                  accent: "neutral",
                },
                {
                  role: "moderátor",
                  desc: "+ Hírfolyam moderálása saját csoportokban",
                  accent: "brook",
                },
                { role: "szervező", desc: "+ Naptár és esemény kezelése", accent: "amber" },
                {
                  role: "mester",
                  desc: "+ Tananyag, csoportkezelés, fokozat hozzáadása",
                  accent: "pink",
                },
                {
                  role: "admin / fejlesztő",
                  desc: "Technikai szerepkör — teljes admin panel, illetve olvasási hozzáférés hibakereséshez (párhuzamos, nem hierarchikus)",
                  accent: "spring",
                },
              ]}
            />

            <CaseStudyH3>Célok és sikerkritériumok</CaseStudyH3>
            <CaseStudyList
              items={[
                "A táblázatalapú fokozat-nyilvántartás kiváltása auditálható, workflow-alapú digitális rendszerrel",
                "Zárt, biztonságos közösségi tér — nyilvános internetes jelenlét nélkül, meghívásos hozzáféréssel",
                "GDPR-megfelelőség beépítése tervezési szinten, nem utólagos ráépítésként",
                "Moduláris backend, amely admin-eszközökkel (CSV-import, tömeges jelvényadás, vészhelyzeti jogvisszavonás) bővíthető külső fejlesztői beavatkozás nélkül",
              ]}
            />

            <CaseStudyH3>Idővonal</CaseStudyH3>
            <CaseStudyTimeline
              items={[
                { date: "2026.05.30", text: "Első commit — AI-asszisztált projektindítás" },
                {
                  date: "2026. június",
                  text: "Alapfunkciók: hírfolyam, csoportok, profil, admin panel váza",
                },
                {
                  date: "2026. július",
                  text: "Fokozat-rendszer, jelvények, szakértő-kereső, recepttár",
                },
                {
                  date: "2026.08.03–07",
                  text: "Intenzív biztonsági hardening: BFF-migráció, rate limiting, admin-recovery, jelszó-erősség riasztás",
                },
                {
                  date: "2026.08.10",
                  text: "Éles, karbantartott rendszer, folyamatos finomítás alatt",
                },
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="arch" kicker="III. Technikai architektúra" title="Rétegek: SPA → BFF → Supabase">
            <p>
              A rendszer klasszikus háromrétegű felépítést követ, azzal a tudatos
              megszorítással, hogy a kliens <strong className="text-ink">soha</strong> nem éri
              el közvetlenül az adatbázist — minden kérés egy dedikált Backend-for-Frontend
              rétegen megy keresztül.
            </p>
            <CaseStudyDiagram>{layersDiagram}</CaseStudyDiagram>

            <CaseStudyH3>A BFF-döntés</CaseStudyH3>
            <p>
              Minden kérés egységes biztonsági csővezetéken fut végig, dokumentálva a projekt
              belső architektúra-dokumentációjában:
            </p>
            <CaseStudyDiagram caption="Ez a minta tudatos elmozdulás a „kliens közvetlenül hívja a Supabase RLS-t” alapértelmezéstől egy központosított API-réteg felé — a Row-Level Security itt csak másodlagos védelmi vonal.">
              {pipelineDiagram}
            </CaseStudyDiagram>

            <CaseStudyH3>Adatbázis-séma (kivonat, 39 táblából)</CaseStudyH3>
            <CaseStudyDiagram caption="A szerepkörök szándékosan külön táblában (user_roles) élnek, nem a szerkeszthető profiles táblán belül — privilege-escalation elleni védelem.">
              {schemaDiagram}
            </CaseStudyDiagram>

            <CaseStudyH3>Fejlesztői eszközök</CaseStudyH3>
            <CaseStudyTable
              headers={["Kategória", "Eszközök"]}
              rows={[
                ["Nyelv", "TypeScript (frontend + Deno edge functions)"],
                ["Build", "Vite 5 (SWC plugin), Bun (CI), npm (lokálisan)"],
                ["Tesztelés", "Vitest + Testing Library (unit), Playwright (E2E)"],
                ["Lint / Format", "ESLint 9 (flat config) + typescript-eslint"],
                ["CI", "GitHub Actions — advisory bundle-size riport minden PR-en"],
                [
                  "Deployment",
                  "Felhőalapú menedzselt hosting (Supabase-backend), preview + production domain",
                ],
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="features" kicker="IV. Funkció-leltár" title="Amit a portál valóban tud">
            <CaseStudyH3>Frontend</CaseStudyH3>
            <CaseStudyList
              items={[
                <>
                  <strong className="text-ink">Hitelesítés:</strong> e-mail/jelszó login,
                  kötelező e-mail-megerősítés, 60 perces inaktivitás utáni automatikus
                  kijelentkezés, session-szinkronizáció böngészőfülek között, kényszerített
                  onboarding (jelszóváltás + témaválasztás)
                </>,
                <>
                  <strong className="text-ink">Hírfolyam:</strong> posztolás, reakciók,
                  kommentek, említés-rendszer, poszt-rögzítés moderátoroknak
                </>,
                <>
                  <strong className="text-ink">Zárt csoportok:</strong> csoport-specifikus
                  hírfolyam, tananyag-feltöltés, meghívásos tagság
                </>,
                <>
                  <strong className="text-ink">Fokozat- és modulrendszer:</strong> 16 ECO
                  alapmodul + Karma/Formázás kereszt-modulok + workshopok,
                  előfeltétel-validáció, valós idejű szinkronizáció
                </>,
                <>
                  <strong className="text-ink">Jelvény- / gamifikációs rendszer:</strong>{" "}
                  automatikus és manuális jelvények (pl. 5 szintű „Szakember” csoport,
                  DB-trigger vezérelt), jelvény-katalógus
                </>,
                <>
                  <strong className="text-ink">Szakértő-kereső:</strong> AI-indexelt profilok
                  (Gemini-alapú indexelés), értékelési rendszer és ranglista
                </>,
                <>
                  <strong className="text-ink">Recepttár:</strong> CRUD, kedvencek, értékelés,
                  napi megtekintés-számláló, ranglista
                </>,
                <>
                  <strong className="text-ink">Képzési naptár:</strong> jogosultság-alapú
                  részvétel
                </>,
                <>
                  <strong className="text-ink">Admin központ:</strong> 15 alpanel —
                  felhasználók, kérelmek, fokozatok, receptek, szakemberek, jelvények,
                  csoportok, események, hibajegyek, értesítések, audit, GDPR, riportok,
                  biztonság
                </>,
                <>
                  <strong className="text-ink">Teljesítmény:</strong> minden route
                  lazy-loaded, cache-elt szerver-state, bundle-size riport minden PR-en
                </>,
              ]}
            />

            <CaseStudyH3>Backend / API</CaseStudyH3>
            <CaseStudyList
              items={[
                <>
                  <strong className="text-ink">Action-alapú BFF API</strong> 29 Edge
                  Function-ön, 6 kategóriában: BFF (8), admin-only (7), speciális/IT-admin (3),
                  publikus/webhook (4), cron/belső (5), előnézeti/dev (2)
                </>,
                <>
                  <strong className="text-ink">Rate limiting:</strong> in-memory
                  fixed-window, felhasználó + function szerint, külön olvasási/írási limittel
                </>,
                <>
                  <strong className="text-ink">Fájlfeltöltés + víruskeresés:</strong> signed
                  URL, VirusTotal-integráció, aszinkron scan-eredmény
                </>,
                <>
                  <strong className="text-ink">E-mail alrendszer:</strong> tranzakciós
                  sablonok, sor-feldolgozás, heti összefoglaló, leiratkozás- és
                  suppression-kezelés
                </>,
                <>
                  <strong className="text-ink">Audit &amp; biztonsági napló:</strong> minden
                  érzékeny művelet nyomon követhető
                </>,
                <>
                  <strong className="text-ink">GDPR workflow:</strong> kérelem-tábla,
                  hozzájárulás-napló, admin GDPR-panel
                </>,
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="security" kicker="V. Biztonsági architektúra" title="„Nem díszdokumentum”">
            <p>
              A projekthez tartozó 21 KB-os biztonsági inventory explicit módon így jellemzi
              önmagát — ez a hozzáállás a kódban is tetten érhető.
            </p>
            <CaseStudyCallout label="Enforcement rétegek valós megbízhatósága">
              a saját dokumentáció önkritikus megfogalmazásában: frontend feltételes
              renderelés = <i>csak UX</i>; Row-Level Security = <i>másodlagos</i> védelem; Edge
              Function{" "}
              <code className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[0.85em]">
                requireAuth()
              </code>{" "}
              /{" "}
              <code className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[0.85em]">
                requireAdmin()
              </code>{" "}
              shared guard = <i>elsődleges, megbízható</i> enforcement (24/29 function lefedve).
            </CaseStudyCallout>

            <CaseStudyH3>Kiemelt hardening-intézkedések</CaseStudyH3>
            <CaseStudyList
              items={[
                <>
                  Session{" "}
                  <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
                    sessionStorage
                  </code>
                  -ban (nem perzisztens), 60 perces inaktivitási timeout
                </>,
                "CORS: nincs wildcard origin, dinamikus allowlist-ellenőrzés minden function-ben",
                <>
                  <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
                    emergency-revoke
                  </code>{" "}
                  — vészhelyzeti jogosultság-visszavonás admin vészgombbal
                </>,
                <>
                  <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
                    admin-recovery
                  </code>{" "}
                  — JWT nélküli, de IP-allowlistával és per-e-mail/per-IP rate limittel
                  védett admin-helyreállítási csatorna
                </>,
                <>
                  Sikeres bejelentkezések szerveroldali logolása (
                  <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
                    security_events
                  </code>
                  )
                </>,
                "90 napos biztonsági esemény-megőrzés, napi automatizált pg_cron takarítással",
                "Jelszó-erősség riasztás — az egyik legutóbbi módosítás a rendszerben",
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="ai" kicker="VI. AI-asszisztált fejlesztés" title="Ki írta a kódot?">
            <p>
              A git-előzmények önmagukban is esettanulmány-témát adnának: a 260 commitból 254
              (97,7%) Claude Code-dal készült, mindössze 6 származik közvetlenül emberi
              fejlesztőtől.
            </p>
            <CaseStudyBarChart
              rows={[
                { label: "Claude Code", valueLabel: "254 · 97,7%", pct: 97.7, tone: "brand" },
                { label: "Emberi fejlesztő", valueLabel: "6 · 2,3%", pct: 2.3, tone: "muted" },
              ]}
            />
            <p>Ez a munkamegosztás a modern AI-asszisztált fejlesztés két fázisát tükrözi:</p>
            <CaseStudyList
              items={[
                <>
                  <strong className="text-ink">Gyors, prompt-alapú prototípusépítés:</strong>{" "}
                  UI-komponensek, oldalstruktúra, Supabase-integráció és CRUD-funkciók gyors,
                  iteratív, természetes nyelvi utasításokból történő felépítése
                </>,
                <>
                  <strong className="text-ink">Mélységi hardening:</strong> a projekt belső
                  architektúra- és biztonsági dokumentációjának tanúsága szerint a
                  BFF-migráció, a rate limiting és az auth-guard központosítás már célzott,
                  dokumentált mérnöki munka — nem generatív „vibe coding”, hanem tudatos
                  refaktorálási hullám
                </>,
              ]}
            />
            <p>
              Ez a kétfázisú modell — gyors AI-generált MVP, majd emberi felügyelet alatt álló
              biztonsági hardening, mindkettő Claude Code-dal — reális mintát ad arra, hogyan
              lehet éles, érzékeny adatokat kezelő rendszert felelősségteljesen, mégis
              rendkívül rövid idő alatt piacra vinni.
            </p>
          </CaseStudySection>

          <CaseStudySection id="challenges" kicker="VII. Kihívások és megoldások" title="Amivel meg kellett küzdeni">
            <CaseStudyTable
              headers={["Kihívás", "Megoldás"]}
              rows={[
                [
                  "A „gyors AI-prototípus → éles rendszer” átmenet biztonsági kockázatai",
                  "Teljes BFF-migráció — minden adatelérés Edge Function mögé kerül",
                ],
                [
                  "16+ szintű, kereszthivatkozásokkal teli képzési modulrendszer digitalizálása",
                  "Központosított modul-konfiguráció + előfeltétel-validációs logika, külön audit-napló fokozatváltásra",
                ],
                [
                  "Privilege escalation kockázata",
                  "Szerepkörök külön táblában, nem a szerkeszthető profil-táblán",
                ],
                [
                  "Admin-fiók helyreállítás JWT-mentes forgatókönyvben",
                  "IP-allowlist + technikai szerepkör-ellenőrzés + perzisztens rate limit",
                ],
                [
                  "Fájlfeltöltések biztonsága",
                  "Signed URL + aszinkron VirusTotal-integráció",
                ],
                [
                  "Dokumentáció hiánya egy gyorsan induló, AI-generált projektben",
                  "Utólagos, de szisztematikus dokumentáció: function- és biztonsági inventory, 300+ soros manuális teszt-lista",
                ],
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="results" kicker="VIII. Eredmények és tanulságok" title="Mi jött ki belőle">
            <CaseStudyTiles
              tiles={[
                { value: "10 hét", label: "nulláról éles, auditált rendszerig" },
                { value: "40+", label: "frontend oldal, 15 admin alpanel" },
                { value: "3", label: "karbantartott technikai dokumentum" },
              ]}
            />
            <CaseStudyList
              items={[
                <>
                  <strong className="text-ink">Teljes funkcionális lefedettség</strong> egy
                  komplex, valós szervezeti igényre — tagfelvétel → fokozat-nyilvántartás →
                  közösségi interakció → adminisztráció, egyetlen zárt rendszerben
                </>,
                <>
                  <strong className="text-ink">Auditálhatóság:</strong> minden érzékeny
                  művelet naplózva és admin felületen visszakereshető
                </>,
                <>
                  <strong className="text-ink">GDPR-megfelelőség</strong> tervezési szinten,
                  nem utólagos ráépítésként
                </>,
              ]}
            />

            <CaseStudyH3>Tanulságok</CaseStudyH3>
            <CaseStudyList
              items={[
                "Az AI-asszisztált fejlesztés legnagyobb üzleti értéke nem a prototípusnál, hanem az azt követő, célzott biztonsági és architekturális refaktorálásban keletkezett",
                "A BFF-minta jól skálázódik AI-generált kódbázisokon is — egy explicit, dokumentált architekturális szabály könnyen betartatható és auditálható marad gyors iteráció mellett is",
                "A „nem díszdokumentum” hozzáállás valós, karbantartott referenciává teszi a biztonsági dokumentációt",
                "A kettős szerepkör-tengely (közösségi hierarchia vs. technikai jogosultság) jó minta olyan szervezeteknek, ahol a képzési rang és a rendszeradminisztrációs jog elvileg és gyakorlatilag is elválik",
              ]}
            />

            <CaseStudyCallout label="Összegzés">
              az ECO Közösségi Portál meggyőző példa arra, hogyan lehet AI-asszisztált
              eszközökkel — no-code prototípusépítéssel kombinált, célzott mérnöki
              hardeninggel — rövid idő alatt egy komplex, érzékeny adatokat kezelő, biztonságos
              és auditálható belső platformot létrehozni.
            </CaseStudyCallout>
          </CaseStudySection>

          <CaseStudyColophon>
            Az esettanulmány a repository statikus elemzése, a git-előzmények, a{" "}
            <code className="font-mono text-ink/50">docs/</code> alatti és a projekt belső
            architektúra-dokumentációja, valamint a helyi fejlesztői szerveren renderelt éles
            UI screenshotok alapján készült · 2026.08.10
          </CaseStudyColophon>
        </CaseStudyBody>

        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
