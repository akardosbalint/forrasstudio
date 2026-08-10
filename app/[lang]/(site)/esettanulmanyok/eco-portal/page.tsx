import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyHeader } from "@/components/case-study/CaseStudyHeader";
import {
  CaseStudyHero,
  StatStrip,
  TableOfContents,
  CaseStudySection,
  Lede,
  Callout,
  DiagramBlock,
  DataTable,
  Timeline,
  RoleLadder,
  TileRow,
  CommitBar,
  FeatureList,
  Gallery,
  Figure,
  Colophon,
} from "@/components/case-study/CaseStudyPrimitives";
import { Footer } from "@/components/Footer";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const isHu = lang === "hu";
  return {
    title: isHu
      ? "ECO Közösségi Portál — Esettanulmány | FlowCore"
      : "ECO Community Portal — Case Study | FlowCore",
    description: isHu
      ? "Hogyan lett egy 1000+ fős magyar önfejlesztési egyesületből tíz hét alatt egy auditálható, GDPR-kompatibilis, AI-asszisztáltan épített digitális otthon."
      : "How a 1,000+ member Hungarian self-development association got an auditable, GDPR-compliant, AI-assisted digital home in ten weeks.",
  };
}

const toc = [
  { id: "exec", hu: "Vezetői összefoglaló", en: "Executive summary" },
  { id: "overview", hu: "Projekt áttekintés", en: "Project overview" },
  { id: "arch", hu: "Technikai architektúra", en: "Technical architecture" },
  { id: "features", hu: "Funkció-leltár", en: "Feature inventory" },
  { id: "security", hu: "Biztonsági architektúra", en: "Security architecture" },
  { id: "ai", hu: "AI-asszisztált fejlesztés", en: "AI-assisted development" },
  { id: "challenges", hu: "Kihívások és megoldások", en: "Challenges & solutions" },
  { id: "results", hu: "Eredmények és tanulságok", en: "Results & lessons" },
];

function ContentHu() {
  return (
    <>
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

      <StatStrip
        stats={[
          { value: "39", label: "adatbázis-tábla, 154 migráció" },
          { value: "29", label: "Edge Function, Backend-for-Frontend réteg" },
          { value: "~10", label: "hét a nulláról éles rendszerig" },
          { value: "97,7%", label: "AI-asszisztált commit, 260-ból 254" },
        ]}
      />

      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <TableOfContents
          label="Tartalom"
          items={toc.map((item) => ({ href: `#${item.id}`, label: item.hu }))}
        />

        <div className="mt-14 space-y-14 pb-8">
          <CaseStudySection id="exec" kicker="I. Vezetői összefoglaló" title="Egy fokozatrendszer, egyetlen digitális térben">
            <Lede>
              Az ECO Közösségi Portál egy zárt, meghívásos community-platform, amely a Göd
              székhelyű ECO – Tudatosság Energiája Egyesület tagjainak fokozat-nyilvántartását,
              belső hírfolyamát, zárt csoportjait, szakértő-keresőjét és képzési naptárát
              integrálja egyetlen, auditálható rendszerbe.
            </Lede>
            <p>
              A szervezet működésének gerince egy 16+ lépcsős, egymásra épülő modulrendszer (ECO
              1–16, Karma, Formázás modulok és workshopok) — ez korábban nyilvánvalóan
              táblázatokban és privát csatornákon élt. A portál ezt egy szerepkör-alapú,
              naplózott, GDPR-megfelelő digitális rendszerbe konszolidálta.
            </p>
            <p>
              A projekt technikai szempontból is figyelemre méltó: a 260 commit{" "}
              <strong>97,7%-át</strong> AI-eszközök jegyzik — egy no-code AI platform építette fel
              a gyors prototípust, majd a <strong>Claude Code</strong> vitte végig a biztonsági
              hardening, a Backend-for-Frontend architektúra és a produkciós minőségbiztosítás
              munkáját. Az eredmény tíz hét alatt egy 39 táblás adatbázis, 29 szerveroldali
              endpoint és 40+ oldal — nem prototípus, hanem éles, karbantartott rendszer.
            </p>
          </CaseStudySection>

          <section id="first-look" className="border-t border-paper-3 pt-12">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-dark">
              Első benyomás
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              A felület
            </h2>
            <p className="mt-6 max-w-2xl leading-relaxed text-ink/80">
              Nyilvános regisztráció nincs — a portál kizárólag meghívásos, adminisztrátori
              jóváhagyáshoz kötött hozzáférés-igénylési folyamaton keresztül nyílik meg, amely már
              a belépés előtt rákérdez a jelölt meglévő ECO-fokozataira.
            </p>
            <div className="mt-6">
              <Gallery>
                <Figure
                  src="/case-studies/eco-portal/login-desktop.png"
                  alt="Bejelentkezési képernyő"
                  width={1440}
                  height={900}
                  caption={
                    <>
                      <b>Bejelentkezés</b> — a felület meleg, papír-szerű alapszíne és a zöld
                      ECO-márkajelzés desktop nézetben.
                    </>
                  }
                />
                <Figure
                  src="/case-studies/eco-portal/login-mobile.png"
                  alt="Bejelentkezés mobil nézetben"
                  width={390}
                  height={844}
                  mobile
                  caption={
                    <>
                      <b>Mobil nézet</b> — teljes reszponzivitás, azonos komponensrendszerrel.
                    </>
                  }
                />
              </Gallery>
              <Gallery columns="sm:grid-cols-2" >
                <div className="mt-4">
                  <Figure
                    src="/case-studies/eco-portal/access-request.png"
                    alt="Hozzáférés igénylése űrlap"
                    width={1440}
                    height={900}
                    caption={
                      <>
                        <b>Hozzáférés igénylése</b> — az űrlap már itt rögzíti a jelölt
                        ECO-fokozatait (Konzulens / Oktató / Megalkotó), amit az admin külön
                        hitelesít.
                      </>
                    }
                  />
                </div>
                <div className="mt-4">
                  <Figure
                    src="/case-studies/eco-portal/privacy-notice.png"
                    alt="Adatkezelési tájékoztató"
                    width={1440}
                    height={900}
                    caption={
                      <>
                        <b>Adatkezelési tájékoztató</b> — a GDPR-megfelelőség a tervezés szintjén,
                        nem utólagos ráépítésként jelenik meg.
                      </>
                    }
                  />
                </div>
              </Gallery>
            </div>
          </section>

          <CaseStudySection id="overview" kicker="II. Projekt áttekintés" title="Háttér, célcsoport, célok">
            <h3 className="pt-2 font-display text-lg font-semibold text-ink">Háttér</h3>
            <p>
              Az egyesület minősítési rendszere tagokat ECO 1-től ECO 16-ig terjedő alapmodulokon
              vezet végig, kereszthivatkozásokkal kapcsolódó Karma- és Formázás-modulokkal,
              illetve workshopokkal (WS0–WS4), szigorú előfeltétel-láncolattal. A projekt első
              commitja 2026. május 30-án egy zöldmezős, AI-asszisztált projektként indult, és
              gyorsan egy teljes körű, védett belső portállá nőtte ki magát.
            </p>

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Célcsoport és szerepkörök</h3>
            <p>
              A rendszer kettős tengelyen szervezi a jogosultságokat: közösségi hierarchia (a tag
              képzési/felelősségi szintje) és technikai szerepkör (rendszeradminisztráció) — a
              kettő szándékosan elválik egymástól.
            </p>
            <div className="not-prose pt-2">
              <RoleLadder
                rungs={[
                  { tone: "base", role: "felhasználó", desc: "Profil, hírfolyam, zárt csoportok, recepttár, hibabejelentés" },
                  { tone: "mod", role: "moderátor", desc: "+ Hírfolyam moderálása saját csoportokban" },
                  { tone: "org", role: "szervező", desc: "+ Naptár és esemény kezelése" },
                  { tone: "master", role: "mester", desc: "+ Tananyag, csoportkezelés, fokozat hozzáadása" },
                  { tone: "admin", role: "admin / fejlesztő", desc: "Technikai szerepkör — teljes admin panel, illetve olvasási hozzáférés hibakereséshez (párhuzamos, nem hierarchikus)" },
                ]}
              />
            </div>

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Célok és sikerkritériumok</h3>
            <FeatureList
              items={[
                "A táblázatalapú fokozat-nyilvántartás kiváltása auditálható, workflow-alapú digitális rendszerrel",
                "Zárt, biztonságos közösségi tér — nyilvános internetes jelenlét nélkül, meghívásos hozzáféréssel",
                "GDPR-megfelelőség beépítése tervezési szinten, nem utólagos ráépítésként",
                "Moduláris backend, amely admin-eszközökkel (CSV-import, tömeges jelvényadás, vészhelyzeti jogvisszavonás) bővíthető külső fejlesztői beavatkozás nélkül",
              ]}
            />

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Idővonal</h3>
            <div className="not-prose pt-2">
              <Timeline
                items={[
                  { date: "2026.05.30", text: "Első commit — AI-asszisztált projektindítás" },
                  { date: "2026. június", text: "Alapfunkciók: hírfolyam, csoportok, profil, admin panel váza" },
                  { date: "2026. július", text: "Fokozat-rendszer, jelvények, szakértő-kereső, recepttár" },
                  { date: "2026.08.03–07", text: "Intenzív biztonsági hardening: BFF-migráció, rate limiting, admin-recovery, jelszó-erősség riasztás" },
                  { date: "2026.08.10", text: "Éles, karbantartott rendszer, folyamatos finomítás alatt" },
                ]}
              />
            </div>
          </CaseStudySection>

          <CaseStudySection id="arch" kicker="III. Technikai architektúra" title="Rétegek: SPA → BFF → Supabase">
            <p>
              A rendszer klasszikus háromrétegű felépítést követ, azzal a tudatos megszorítással,
              hogy a kliens <strong>soha</strong> nem éri el közvetlenül az adatbázist — minden
              kérés egy dedikált Backend-for-Frontend rétegen megy keresztül.
            </p>

            <DiagramBlock>{`┌──────────────────────────────────────────────────────────────┐
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
└──────────────────────────────────────────────────────────────┘`}</DiagramBlock>

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">A BFF-döntés</h3>
            <p>
              Minden kérés egységes biztonsági csővezetéken fut végig, dokumentálva a projekt
              belső architektúra-dokumentációjában:
            </p>
            <DiagramBlock
              caption='Ez a minta tudatos elmozdulás a „kliens közvetlenül hívja a Supabase RLS-t” alapértelmezéstől egy központosított API-réteg felé — a Row-Level Security itt csak másodlagos védelmi vonal.'
            >{`Request → CORS (origin allowlist) → Zod séma-validáció → JWT auth
        → Rate limiting (user + function) → Szerepkör-ellenőrzés
        → Üzleti logika (service_role kliens)`}</DiagramBlock>

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Adatbázis-séma (kivonat, 39 táblából)</h3>
            <DiagramBlock
              caption={
                <>
                  A szerepkörök szándékosan <strong>külön táblában</strong> (<code>user_roles</code>)
                  élnek, nem a szerkeszthető <code>profiles</code> táblán belül —
                  privilege-escalation elleni védelem.
                </>
              }
            >{`┌───────────────┐        ┌────────────────────┐      ┌──────────────┐
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
+ notifications · user_badges · gdpr_requests · file_scan_results …`}</DiagramBlock>

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Fejlesztői eszközök</h3>
            <DataTable
              headers={["Kategória", "Eszközök"]}
              rows={[
                ["Nyelv", "TypeScript (frontend + Deno edge functions)"],
                ["Build", "Vite 5 (SWC plugin), Bun (CI), npm (lokálisan)"],
                ["Tesztelés", "Vitest + Testing Library (unit), Playwright (E2E)"],
                ["Lint / Format", "ESLint 9 (flat config) + typescript-eslint"],
                ["CI", "GitHub Actions — advisory bundle-size riport minden PR-en"],
                ["Deployment", "Felhőalapú menedzselt hosting (Supabase-backend), preview + production domain"],
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="features" kicker="IV. Funkció-leltár" title="Amit a portál valóban tud">
            <h3 className="pt-2 font-display text-lg font-semibold text-ink">Frontend</h3>
            <FeatureList
              items={[
                <>
                  <strong>Hitelesítés:</strong> e-mail/jelszó login, kötelező e-mail-megerősítés,
                  60 perces inaktivitás utáni automatikus kijelentkezés, session-szinkronizáció
                  böngészőfülek között, kényszerített onboarding (jelszóváltás + témaválasztás)
                </>,
                <>
                  <strong>Hírfolyam:</strong> posztolás, reakciók, kommentek, említés-rendszer,
                  poszt-rögzítés moderátoroknak
                </>,
                <>
                  <strong>Zárt csoportok:</strong> csoport-specifikus hírfolyam, tananyag-feltöltés,
                  meghívásos tagság
                </>,
                <>
                  <strong>Fokozat- és modulrendszer:</strong> 16 ECO alapmodul + Karma/Formázás
                  kereszt-modulok + workshopok, előfeltétel-validáció, valós idejű szinkronizáció
                </>,
                <>
                  <strong>Jelvény- / gamifikációs rendszer:</strong> automatikus és manuális
                  jelvények (pl. 5 szintű „Szakember” csoport, DB-trigger vezérelt),
                  jelvény-katalógus
                </>,
                <>
                  <strong>Szakértő-kereső:</strong> AI-indexelt profilok (Gemini-alapú indexelés),
                  értékelési rendszer és ranglista
                </>,
                <>
                  <strong>Recepttár:</strong> CRUD, kedvencek, értékelés, napi
                  megtekintés-számláló, ranglista
                </>,
                <>
                  <strong>Képzési naptár:</strong> jogosultság-alapú részvétel
                </>,
                <>
                  <strong>Admin központ:</strong> 15 alpanel — felhasználók, kérelmek, fokozatok,
                  receptek, szakemberek, jelvények, csoportok, események, hibajegyek,
                  értesítések, audit, GDPR, riportok, biztonság
                </>,
                <>
                  <strong>Teljesítmény:</strong> minden route lazy-loaded, cache-elt szerver-state,
                  bundle-size riport minden PR-en
                </>,
              ]}
            />

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Backend / API</h3>
            <FeatureList
              items={[
                <>
                  <strong>Action-alapú BFF API</strong> 29 Edge Function-ön, 6 kategóriában: BFF
                  (8), admin-only (7), speciális/IT-admin (3), publikus/webhook (4), cron/belső
                  (5), előnézeti/dev (2)
                </>,
                <>
                  <strong>Rate limiting:</strong> in-memory fixed-window, felhasználó + function
                  szerint, külön olvasási/írási limittel
                </>,
                <>
                  <strong>Fájlfeltöltés + víruskeresés:</strong> signed URL, VirusTotal-integráció,
                  aszinkron scan-eredmény
                </>,
                <>
                  <strong>E-mail alrendszer:</strong> tranzakciós sablonok, sor-feldolgozás, heti
                  összefoglaló, leiratkozás- és suppression-kezelés
                </>,
                <>
                  <strong>Audit &amp; biztonsági napló:</strong> minden érzékeny művelet
                  nyomon követhető
                </>,
                <>
                  <strong>GDPR workflow:</strong> kérelem-tábla, hozzájárulás-napló, admin
                  GDPR-panel
                </>,
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="security" kicker="V. Biztonsági architektúra" title="„Nem díszdokumentum”">
            <p>
              A projekthez tartozó 21 KB-os biztonsági inventory explicit módon így jellemzi
              önmagát — ez a hozzáállás a kódban is tetten érhető.
            </p>
            <Callout label="Enforcement rétegek valós megbízhatósága —">
              a saját dokumentáció önkritikus megfogalmazásában: frontend feltételes
              renderelés = <i>csak UX</i>; Row-Level Security = <i>másodlagos</i> védelem; Edge
              Function <code>requireAuth()</code> / <code>requireAdmin()</code> shared guard ={" "}
              <i>elsődleges, megbízható</i> enforcement (24/29 function lefedve).
            </Callout>
            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Kiemelt hardening-intézkedések</h3>
            <FeatureList
              items={[
                <>
                  Session <code>sessionStorage</code>-ban (nem perzisztens), 60 perces
                  inaktivitási timeout
                </>,
                "CORS: nincs wildcard origin, dinamikus allowlist-ellenőrzés minden function-ben",
                <>
                  <code>emergency-revoke</code> — vészhelyzeti jogosultság-visszavonás admin
                  vészgombbal
                </>,
                <>
                  <code>admin-recovery</code> — JWT nélküli, de IP-allowlistával és
                  per-e-mail/per-IP rate limittel védett admin-helyreállítási csatorna
                </>,
                <>Sikeres bejelentkezések szerveroldali logolása (<code>security_events</code>)</>,
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
            <div className="not-prose">
              <CommitBar
                rows={[
                  { label: "Claude Code", value: "254 · 97,7%", pct: 97.7 },
                  { label: "Emberi fejlesztő", value: "6 · 2,3%", pct: 2.3, tone: "muted" },
                ]}
              />
            </div>
            <p>Ez a munkamegosztás a modern AI-asszisztált fejlesztés két fázisát tükrözi:</p>
            <FeatureList
              items={[
                <>
                  <strong>Gyors, prompt-alapú prototípusépítés:</strong> UI-komponensek,
                  oldalstruktúra, Supabase-integráció és CRUD-funkciók gyors, iteratív,
                  természetes nyelvi utasításokból történő felépítése
                </>,
                <>
                  <strong>Mélységi hardening:</strong> a projekt belső architektúra- és
                  biztonsági dokumentációjának tanúsága szerint a BFF-migráció, a rate limiting
                  és az auth-guard központosítás már célzott, dokumentált mérnöki munka — nem
                  generatív „vibe coding”, hanem tudatos refaktorálási hullám
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
            <DataTable
              headers={["Kihívás", "Megoldás"]}
              rows={[
                ["A „gyors AI-prototípus → éles rendszer” átmenet biztonsági kockázatai", "Teljes BFF-migráció — minden adatelérés Edge Function mögé kerül"],
                ["16+ szintű, kereszthivatkozásokkal teli képzési modulrendszer digitalizálása", "Központosított modul-konfiguráció + előfeltétel-validációs logika, külön audit-napló fokozatváltásra"],
                ["Privilege escalation kockázata", "Szerepkörök külön táblában, nem a szerkeszthető profil-táblán"],
                ["Admin-fiók helyreállítás JWT-mentes forgatókönyvben", "IP-allowlist + technikai szerepkör-ellenőrzés + perzisztens rate limit"],
                ["Fájlfeltöltések biztonsága", "Signed URL + aszinkron VirusTotal-integráció"],
                ["Dokumentáció hiánya egy gyorsan induló, AI-generált projektben", "Utólagos, de szisztematikus dokumentáció: function- és biztonsági inventory, 300+ soros manuális teszt-lista"],
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="results" kicker="VIII. Eredmények és tanulságok" title="Mi jött ki belőle">
            <div className="not-prose">
              <TileRow
                tiles={[
                  { value: "10 hét", label: "nulláról éles, auditált rendszerig" },
                  { value: "40+", label: "frontend oldal, 15 admin alpanel" },
                  { value: "3", label: "karbantartott technikai dokumentum" },
                ]}
              />
            </div>
            <FeatureList
              items={[
                <>
                  <strong>Teljes funkcionális lefedettség</strong> egy komplex, valós szervezeti
                  igényre — tagfelvétel → fokozat-nyilvántartás → közösségi interakció →
                  adminisztráció, egyetlen zárt rendszerben
                </>,
                <>
                  <strong>Auditálhatóság:</strong> minden érzékeny művelet naplózva és admin
                  felületen visszakereshető
                </>,
                <>
                  <strong>GDPR-megfelelőség</strong> tervezési szinten, nem utólagos
                  ráépítésként
                </>,
              ]}
            />
            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Tanulságok</h3>
            <FeatureList
              items={[
                "Az AI-asszisztált fejlesztés legnagyobb üzleti értéke nem a prototípusnál, hanem az azt követő, célzott biztonsági és architekturális refaktorálásban keletkezett",
                "A BFF-minta jól skálázódik AI-generált kódbázisokon is — egy explicit, dokumentált architekturális szabály könnyen betartatható és auditálható marad gyors iteráció mellett is",
                "A „nem díszdokumentum” hozzáállás valós, karbantartott referenciává teszi a biztonsági dokumentációt",
                "A kettős szerepkör-tengely (közösségi hierarchia vs. technikai jogosultság) jó minta olyan szervezeteknek, ahol a képzési rang és a rendszeradminisztrációs jog elvileg és gyakorlatilag is elválik",
              ]}
            />
            <Callout label="Összegzés —">
              az ECO Közösségi Portál meggyőző példa arra, hogyan lehet AI-asszisztált
              eszközökkel — no-code prototípusépítéssel kombinált, célzott mérnöki hardeninggel —
              rövid idő alatt egy komplex, érzékeny adatokat kezelő, biztonságos és auditálható
              belső platformot létrehozni.
            </Callout>
          </CaseStudySection>
        </div>

        <Colophon>
          Az esettanulmány a repository statikus elemzése, a git-előzmények, a projekt belső
          architektúra-dokumentációja, valamint a helyi fejlesztői szerveren renderelt éles UI
          screenshotok alapján készült · 2026.08.10
        </Colophon>
      </div>
    </>
  );
}

function ContentEn() {
  return (
    <>
      <CaseStudyHero
        eyebrow="Case study · Closed community platform"
        title="ECO Community Portal"
        subtitle="How a 1,000+ member Hungarian self-development association, run on a 16-level training ladder, got an auditable, GDPR-compliant, AI-assisted digital home in ten weeks."
        meta={[
          { label: "Client", value: "ECO – Association for the Energy of Awareness" },
          { label: "Headquarters", value: "Göd, Hungary" },
          { label: "Development", value: "2026.05.30 – ongoing" },
        ]}
      />

      <StatStrip
        stats={[
          { value: "39", label: "database tables, 154 migrations" },
          { value: "29", label: "Edge Functions, Backend-for-Frontend layer" },
          { value: "~10", label: "weeks from zero to production" },
          { value: "97.7%", label: "AI-assisted commits, 254 of 260" },
        ]}
      />

      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <TableOfContents
          label="Contents"
          items={toc.map((item) => ({ href: `#${item.id}`, label: item.en }))}
        />

        <div className="mt-14 space-y-14 pb-8">
          <CaseStudySection id="exec" kicker="I. Executive summary" title="One grading system, one digital home">
            <Lede>
              The ECO Community Portal is a closed, invite-only community platform that
              consolidates the grade records, internal newsfeed, closed groups, expert directory,
              and training calendar of the ECO – Association for the Energy of Awareness,
              headquartered in Göd, into a single, auditable system.
            </Lede>
            <p>
              The organization runs on a 16+ step, interlocking module system (ECO 1–16, the
              Karma and Formázás cross-modules, and workshops) that had clearly been living in
              spreadsheets and private channels. The portal consolidated that into a
              role-based, logged, GDPR-compliant digital system.
            </p>
            <p>
              The project is technically notable too: <strong>97.7%</strong> of its 260 commits
              are attributed to AI tooling — a no-code AI platform built the fast prototype, then{" "}
              <strong>Claude Code</strong> carried the security hardening, the
              Backend-for-Frontend architecture, and the production quality assurance work
              through to completion. The result, after ten weeks, is a 39-table database, 29
              server-side endpoints, and 40+ pages — not a prototype, but a live, maintained
              system.
            </p>
          </CaseStudySection>

          <section id="first-look" className="border-t border-paper-3 pt-12">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-dark">
              First impression
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              The interface
            </h2>
            <p className="mt-6 max-w-2xl leading-relaxed text-ink/80">
              There is no public registration — the portal only opens up through an
              invite-only, admin-approved access request flow, which already asks candidates
              about their existing ECO grades before they can sign in.
            </p>
            <div className="mt-6">
              <Gallery>
                <Figure
                  src="/case-studies/eco-portal/login-desktop.png"
                  alt="Login screen"
                  width={1440}
                  height={900}
                  caption={
                    <>
                      <b>Login</b> — the warm, paper-like base color and the green ECO branding
                      in the desktop view.
                    </>
                  }
                />
                <Figure
                  src="/case-studies/eco-portal/login-mobile.png"
                  alt="Login on mobile"
                  width={390}
                  height={844}
                  mobile
                  caption={
                    <>
                      <b>Mobile view</b> — fully responsive, built on the same component system.
                    </>
                  }
                />
              </Gallery>
              <Gallery columns="sm:grid-cols-2">
                <div className="mt-4">
                  <Figure
                    src="/case-studies/eco-portal/access-request.png"
                    alt="Access request form"
                    width={1440}
                    height={900}
                    caption={
                      <>
                        <b>Access request</b> — the form already captures the candidate&apos;s ECO
                        grades (Consultant / Trainer / Creator), which the admin verifies
                        separately.
                      </>
                    }
                  />
                </div>
                <div className="mt-4">
                  <Figure
                    src="/case-studies/eco-portal/privacy-notice.png"
                    alt="Privacy notice"
                    width={1440}
                    height={900}
                    caption={
                      <>
                        <b>Privacy notice</b> — GDPR compliance appears at the design level, not
                        bolted on afterward.
                      </>
                    }
                  />
                </div>
              </Gallery>
            </div>
          </section>

          <CaseStudySection id="overview" kicker="II. Project overview" title="Background, audience, goals">
            <h3 className="pt-2 font-display text-lg font-semibold text-ink">Background</h3>
            <p>
              The association&apos;s certification system walks members through base modules from
              ECO 1 to ECO 16, cross-referenced with the Karma and Formázás modules and
              workshops (WS0–WS4), all under a strict prerequisite chain. The project&apos;s first
              commit landed on May 30, 2026 as a greenfield, AI-assisted project, and quickly
              grew into a full-fledged, access-controlled internal portal.
            </p>

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Audience & roles</h3>
            <p>
              The system organizes permissions along two deliberately separate axes: community
              hierarchy (a member&apos;s training/responsibility level) and technical role (system
              administration).
            </p>
            <div className="not-prose pt-2">
              <RoleLadder
                rungs={[
                  { tone: "base", role: "user", desc: "Profile, newsfeed, closed groups, recipe library, bug reports" },
                  { tone: "mod", role: "moderator", desc: "+ Moderating the newsfeed in their own groups" },
                  { tone: "org", role: "organizer", desc: "+ Managing the calendar and events" },
                  { tone: "master", role: "master", desc: "+ Course material, group management, granting grades" },
                  { tone: "admin", role: "admin / developer", desc: "Technical role — full admin panel, plus read access for debugging (parallel, not hierarchical)" },
                ]}
              />
            </div>

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Goals & success criteria</h3>
            <FeatureList
              items={[
                "Replace the spreadsheet-based grade registry with an auditable, workflow-based digital system",
                "A closed, secure community space — no public internet presence, invite-only access",
                "Build in GDPR compliance at the design level, not bolted on afterward",
                "A modular backend, extensible through admin tools (CSV import, bulk badge granting, emergency access revocation) without external developer intervention",
              ]}
            />

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Timeline</h3>
            <div className="not-prose pt-2">
              <Timeline
                items={[
                  { date: "2026.05.30", text: "First commit — AI-assisted project kickoff" },
                  { date: "June 2026", text: "Core features: newsfeed, groups, profile, admin panel skeleton" },
                  { date: "July 2026", text: "Grade system, badges, expert directory, recipe library" },
                  { date: "2026.08.03–07", text: "Intensive security hardening: BFF migration, rate limiting, admin recovery, password-strength alerts" },
                  { date: "2026.08.10", text: "Live, maintained system, under continuous refinement" },
                ]}
              />
            </div>
          </CaseStudySection>

          <CaseStudySection id="arch" kicker="III. Technical architecture" title="Layers: SPA → BFF → Supabase">
            <p>
              The system follows a classic three-layer structure, with one deliberate
              constraint: the client <strong>never</strong> touches the database directly —
              every request passes through a dedicated Backend-for-Frontend layer.
            </p>

            <DiagramBlock>{`┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND (SPA)                          │
│  React 18 + TypeScript + Vite 5 + React Router 6                │
│  Tailwind CSS + shadcn/ui (Radix)  ·  TanStack Query            │
│  react-hook-form + Zod  ·  next-themes (light / dark)            │
└─────────────────────────────┬────────────────────────────────┘
                               │ supabase.functions.invoke()
                               │  — NEVER a direct DB call
                               ▼
┌──────────────────────────────────────────────────────────────┐
│               BACKEND-FOR-FRONTEND · 29 Edge Functions          │
│   api-profiles · api-groups · api-recipes · api-notifications   │
│   api-grades · api-training · api-storage · api-admin  (+21)    │
└─────────────────────────────┬────────────────────────────────┘
                               │ service_role client
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                 SUPABASE · Postgres + Auth + Storage             │
│   39 tables · Row-Level Security · pg_cron scheduled jobs        │
│   JWT auth (getClaims)  ·  Storage (signed URL)                  │
└──────────────────────────────────────────────────────────────┘`}</DiagramBlock>

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">The BFF decision</h3>
            <p>
              Every request runs through a uniform security pipeline, documented in the
              project&apos;s internal architecture documentation:
            </p>
            <DiagramBlock
              caption="This pattern is a deliberate shift away from the default 'client calls Supabase RLS directly' approach toward a centralized API layer — Row-Level Security here is only the second line of defense."
            >{`Request → CORS (origin allowlist) → Zod schema validation → JWT auth
        → Rate limiting (user + function) → Role check
        → Business logic (service_role client)`}</DiagramBlock>

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Database schema (excerpt, of 39 tables)</h3>
            <DiagramBlock
              caption={
                <>
                  Roles deliberately live in a <strong>separate table</strong> (
                  <code>user_roles</code>), not inside the editable <code>profiles</code> table —
                  a guard against privilege escalation.
                </>
              }
            >{`┌───────────────┐        ┌────────────────────┐      ┌──────────────┐
│   profiles    │──1:1───│    user_roles       │      │ user_grades  │
├───────────────┤        ├────────────────────┤      ├──────────────┤
│ id (PK, auth) │        │ user_id (FK)        │      │ user_id (FK) │
│ full_name     │        │ role (enum)         │      │ module/system│
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
+ notifications · user_badges · gdpr_requests · file_scan_results …`}</DiagramBlock>

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Developer tooling</h3>
            <DataTable
              headers={["Category", "Tools"]}
              rows={[
                ["Language", "TypeScript (frontend + Deno edge functions)"],
                ["Build", "Vite 5 (SWC plugin), Bun (CI), npm (local)"],
                ["Testing", "Vitest + Testing Library (unit), Playwright (E2E)"],
                ["Lint / Format", "ESLint 9 (flat config) + typescript-eslint"],
                ["CI", "GitHub Actions — advisory bundle-size report on every PR"],
                ["Deployment", "Cloud-managed hosting (Supabase backend), preview + production domain"],
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="features" kicker="IV. Feature inventory" title="What the portal actually does">
            <h3 className="pt-2 font-display text-lg font-semibold text-ink">Frontend</h3>
            <FeatureList
              items={[
                <>
                  <strong>Authentication:</strong> email/password login, mandatory email
                  confirmation, automatic logout after 60 minutes of inactivity, session sync
                  across browser tabs, forced onboarding (password change + theme selection)
                </>,
                <>
                  <strong>Newsfeed:</strong> posting, reactions, comments, mentions, post pinning
                  for moderators
                </>,
                <>
                  <strong>Closed groups:</strong> group-specific newsfeed, course material
                  uploads, invite-only membership
                </>,
                <>
                  <strong>Grade & module system:</strong> 16 ECO base modules + Karma/Formázás
                  cross-modules + workshops, prerequisite validation, real-time sync
                </>,
                <>
                  <strong>Badge / gamification system:</strong> automatic and manual badges
                  (e.g. a 5-tier &ldquo;Professional&rdquo; group, DB-trigger driven), a badge
                  catalog
                </>,
                <>
                  <strong>Expert directory:</strong> AI-indexed profiles (Gemini-based
                  indexing), a rating system and leaderboard
                </>,
                <>
                  <strong>Recipe library:</strong> CRUD, favorites, ratings, a daily view
                  counter, leaderboard
                </>,
                <>
                  <strong>Training calendar:</strong> permission-based attendance
                </>,
                <>
                  <strong>Admin center:</strong> 15 sub-panels — users, requests, grades,
                  recipes, professionals, badges, groups, events, bug reports, notifications,
                  audit, GDPR, reports, security
                </>,
                <>
                  <strong>Performance:</strong> every route is lazy-loaded, server state is
                  cached, a bundle-size report runs on every PR
                </>,
              ]}
            />

            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Backend / API</h3>
            <FeatureList
              items={[
                <>
                  <strong>Action-based BFF API</strong> across 29 Edge Functions in 6
                  categories: BFF (8), admin-only (7), special/IT-admin (3), public/webhook (4),
                  cron/internal (5), preview/dev (2)
                </>,
                <>
                  <strong>Rate limiting:</strong> in-memory fixed-window, per user + per
                  function, with separate read/write limits
                </>,
                <>
                  <strong>File uploads + virus scanning:</strong> signed URLs, VirusTotal
                  integration, asynchronous scan results
                </>,
                <>
                  <strong>Email subsystem:</strong> transactional templates, queue processing,
                  a weekly digest, unsubscribe and suppression handling
                </>,
                <>
                  <strong>Audit & security log:</strong> every sensitive action is traceable
                </>,
                <>
                  <strong>GDPR workflow:</strong> a request table, a consent log, an admin GDPR
                  panel
                </>,
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="security" kicker="V. Security architecture" title="&ldquo;Not a decoration&rdquo;">
            <p>
              The project&apos;s 21 KB security inventory explicitly describes itself that way —
              and that attitude shows in the code, too.
            </p>
            <Callout label="How reliable each enforcement layer really is —">
              in the project&apos;s own self-critical documentation: conditional frontend
              rendering = <i>UX only</i>; Row-Level Security = <i>secondary</i> defense; the
              Edge Function <code>requireAuth()</code> / <code>requireAdmin()</code> shared guard
              = <i>primary, reliable</i> enforcement (covering 24 of 29 functions).
            </Callout>
            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Key hardening measures</h3>
            <FeatureList
              items={[
                <>
                  Sessions live in <code>sessionStorage</code> (not persistent), with a 60-minute
                  inactivity timeout
                </>,
                "CORS: no wildcard origin, a dynamic allowlist check in every function",
                <>
                  <code>emergency-revoke</code> — emergency permission revocation via an admin
                  panic button
                </>,
                <>
                  <code>admin-recovery</code> — a JWT-free admin recovery channel, protected by
                  an IP allowlist and per-email/per-IP rate limiting
                </>,
                <>Successful logins are logged server-side (<code>security_events</code>)</>,
                "A 90-day retention window for security events, cleaned up daily by an automated pg_cron job",
                "Password-strength alerts — one of the most recent additions to the system",
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="ai" kicker="VI. AI-assisted development" title="Who wrote the code?">
            <p>
              The git history alone could be its own case study: 254 of the 260 commits (97.7%)
              were made with Claude Code, and only 6 came directly from a human developer.
            </p>
            <div className="not-prose">
              <CommitBar
                rows={[
                  { label: "Claude Code", value: "254 · 97.7%", pct: 97.7 },
                  { label: "Human developer", value: "6 · 2.3%", pct: 2.3, tone: "muted" },
                ]}
              />
            </div>
            <p>This split reflects two distinct phases of modern AI-assisted development:</p>
            <FeatureList
              items={[
                <>
                  <strong>Fast, prompt-driven prototyping:</strong> UI components, page
                  structure, Supabase integration, and CRUD functionality built quickly and
                  iteratively from natural-language instructions
                </>,
                <>
                  <strong>In-depth hardening:</strong> per the project&apos;s internal
                  architecture and security documentation, the BFF migration, the rate limiting,
                  and the centralization of auth guards were targeted, documented engineering
                  work — not generative &ldquo;vibe coding,&rdquo; but a deliberate wave of
                  refactoring
                </>,
              ]}
            />
            <p>
              This two-phase model — a fast, AI-generated MVP followed by human-supervised
              security hardening, both done with Claude Code — offers a realistic pattern for
              shipping a live system that handles sensitive data responsibly, and in a very
              short amount of time.
            </p>
          </CaseStudySection>

          <CaseStudySection id="challenges" kicker="VII. Challenges & solutions" title="What had to be dealt with">
            <DataTable
              headers={["Challenge", "Solution"]}
              rows={[
                ["The security risks of the 'fast AI prototype → live system' transition", "A full BFF migration — every data access moved behind an Edge Function"],
                ["Digitizing a 16+ level training module system full of cross-references", "Centralized module configuration + prerequisite validation logic, with a separate audit log for grade changes"],
                ["Risk of privilege escalation", "Roles live in a separate table, not on the editable profile table"],
                ["Admin account recovery in a JWT-free scenario", "IP allowlist + technical role check + persistent rate limiting"],
                ["File upload security", "Signed URLs + asynchronous VirusTotal integration"],
                ["Lack of documentation in a fast-moving, AI-generated project", "Systematic documentation added after the fact: a function and security inventory, a 300+ line manual test checklist"],
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="results" kicker="VIII. Results & lessons" title="What came out of it">
            <div className="not-prose">
              <TileRow
                tiles={[
                  { value: "10 weeks", label: "from zero to a live, audited system" },
                  { value: "40+", label: "frontend pages, 15 admin sub-panels" },
                  { value: "3", label: "maintained technical documents" },
                ]}
              />
            </div>
            <FeatureList
              items={[
                <>
                  <strong>Full functional coverage</strong> for a complex, real organizational
                  need — from onboarding → grade tracking → community interaction →
                  administration, all in one closed system
                </>,
                <>
                  <strong>Auditability:</strong> every sensitive action is logged and
                  searchable in the admin interface
                </>,
                <>
                  <strong>GDPR compliance</strong> at the design level, not bolted on
                  afterward
                </>,
              ]}
            />
            <h3 className="pt-4 font-display text-lg font-semibold text-ink">Lessons</h3>
            <FeatureList
              items={[
                "AI-assisted development's biggest business value didn't come from the prototype, but from the targeted security and architectural refactoring that followed it",
                "The BFF pattern scales well even on AI-generated codebases — an explicit, documented architectural rule stays easy to enforce and audit even under rapid iteration",
                "The 'not a decoration' attitude turns security documentation into a real, maintained reference",
                "The dual role axis (community hierarchy vs. technical permissions) is a good pattern for organizations where training rank and system-administration rights are genuinely, and deliberately, separate",
              ]}
            />
            <Callout label="Summary —">
              the ECO Community Portal is a compelling example of how AI-assisted tooling — a
              no-code prototype combined with targeted engineering hardening — can produce a
              complex, secure, and auditable internal platform handling sensitive data, in a
              short amount of time.
            </Callout>
          </CaseStudySection>
        </div>

        <Colophon>
          This case study was built from a static analysis of the repository, its git history,
          the project&apos;s internal architecture documentation, and production UI screenshots
          rendered on the local development server · 2026.08.10
        </Colophon>
      </div>
    </>
  );
}

export default async function EcoPortalCaseStudyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const typedLang: Locale = lang;

  return (
    <>
      <CaseStudyHeader
        lang={typedLang}
        backLabel={typedLang === "hu" ? "Vissza az esettanulmányokhoz" : "Back to case studies"}
        langSwitcherLabels={dict.common.languageSwitcher}
      />
      <main className="flex-1 bg-paper">
        {typedLang === "hu" ? <ContentHu /> : <ContentEn />}
      </main>
      <Footer
        lang={typedLang}
        dict={dict.site.footer}
        cookieSettingsDict={dict.site.cookieSettingsButton}
        langSwitcherLabels={dict.common.languageSwitcher}
      />
    </>
  );
}
