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
  CaseStudyTiles,
  CaseStudyColophon,
} from "@/components/case-study/CaseStudyBlocks";

export const metadata: Metadata = {
  title: "Ösvény — Esettanulmány — MI Építettük",
  description:
    "Hogyan lett a lifestyle medicine hat pillérére épülő, ingyenes felméréssel induló, AI-coacholt szokásépítő platformból egy determinisztikus biztonsági réteggel védett, auditált, magyar nyelvű termék.",
};

const tocItems = [
  { href: "#exec", label: "Vezetői összefoglaló" },
  { href: "#overview", label: "Projekt áttekintés" },
  { href: "#arch", label: "Technikai architektúra" },
  { href: "#features", label: "Funkciók — mélyfúrás" },
  { href: "#ux", label: "UX és márkahang" },
  { href: "#security", label: "Biztonság és megfelelőség" },
  { href: "#challenges", label: "Kihívások és megoldások" },
  { href: "#results", label: "Eredmények és üzleti érték" },
  { href: "#future", label: "Jövőbeli irányok" },
];

const architectureDiagram = `┌─────────────────────────────────────────────────────────────┐
│                        KLIENS (böngésző)                      │
│   Next.js 16 App Router · React 19 · Tailwind CSS 4          │
│   framer-motion (animáció) · recharts (haladás-vizualizáció) │
└───────────────────────────┬────────────────────────────────┘
                             │ HTTPS (CSP, HSTS, X-Frame-Options)
┌───────────────────────────▼────────────────────────────────┐
│              NEXT.JS SZERVER (Vercel, App Router)             │
│  ┌───────────────┐ ┌────────────────┐ ┌────────────────────┐ │
│  │  Server-side   │ │  /api/* route  │ │  Vercel Cron        │ │
│  │  rendering &   │ │  handlers      │ │  (5 ütemezett job:  │ │
│  │  Server Actions│ │  (REST-szerű)  │ │  napi email, cleanup,│ │
│  │                │ │                │ │  reengagement,      │ │
│  │                │ │                │ │  nurture, renewal)   │ │
│  └───────┬────────┘ └────────┬───────┘ └──────────┬─────────┘ │
└──────────┼────────────────────┼───────────────────┼───────────┘
           │                    │                    │
   ┌───────▼──────┐   ┌─────────▼─────────┐  ┌──────▼───────┐
   │   Supabase    │   │  Külső integrációk │  │  Anthropic    │
   │  (Postgres +  │   │  Stripe (fizetés,  │  │  Claude API   │
   │  Auth + RLS)  │   │  előfizetés,       │  │  (AI Coach —  │
   │               │   │  webhook)          │  │  determ.      │
   │  21 tábla:    │   │  Resend (tranz. és │  │  biztonsági   │
   │  quiz_        │   │  nurture-email,    │  │  réteg előtte)│
   │  submissions, │   │  webhook)          │  │               │
   │  subscriptions│   │  Sentry            │  │               │
   │  chat_messages│   │  (hibakövetés)     │  │               │
   │  stb.         │   │  Svix (webhook     │  │               │
   │               │   │  verifikáció)      │  │               │
   └───────────────┘   └────────────────────┘  └───────────────┘`;

export default function OsvenyCaseStudyPage() {
  return (
    <>
      <Nav legal />
      <main className="flex-1">
        <CaseStudyHero
          eyebrow="Esettanulmány · AI-coacholt életmódváltó platform"
          title="Ösvény"
          subtitle="Egy magyar nyelvű, ingyenes önkitöltős felméréssel induló, AI-coacholt szokásépítő webalkalmazás, amely a lifestyle medicine hat pillérére épül — és a biztonságot tudatosan nem az AI-ra bízza."
          meta={[
            { label: "Terület", value: "Életmódorvoslás (lifestyle medicine)" },
            { label: "Tech stack", value: "Next.js 16 · React 19 · Supabase · Stripe · Claude API" },
            { label: "Állapot", value: "2026. augusztusi állapot — fejlesztés/audit fázis" },
          ]}
        />

        <CaseStudyStats
          stats={[
            { value: "21", label: "Supabase-tábla — kvíz, előfizetés, napló, közösség, audit" },
            { value: "6", label: "életmódpillér — étkezés, mozgás, alvás, stressz, kapcsolatok, szokások" },
            { value: "13", label: "tesztfájl — krízis-felismerés, kontraindikáció, email-retry" },
            { value: "3", label: "algoritmikusan ajánlott sprint-hossz — 21 / 66 / 100 nap" },
          ]}
        />

        <CaseStudyBody>
          <CaseStudyTOC items={tocItems} />

          <CaseStudySection
            id="exec"
            kicker="I. Vezetői összefoglaló"
            title="Bizalom, nem hype"
          >
            <CaseStudyLede>
              Az Ösvény egy magyar nyelvű, ingyenes önkitöltős életmód-felméréssel induló,
              AI-coacholt szokásépítő webalkalmazás, amely a lifestyle medicine (életmódorvoslás)
              hat pillérére — étkezés, mozgás, alvás, stresszkezelés, társas kapcsolatok, szokások
              — épül. A termék azt a problémát oldja meg, amivel a legtöbb egészség- és
              fitneszalkalmazás nem foglalkozik: a felhasználók tudják, hogy változtatniuk
              kellene, de nincs strukturált, fenntartható rendszerük hozzá, és korábban már
              elbuktak egy-fókuszú diéta- vagy edzésalkalmazásokkal.
            </CaseStudyLede>
            <p>
              A belépési pont egy kb. 30 kérdéses, tudományos hivatkozásokkal (Rippe{" "}
              <i>Lifestyle Medicine</i>, 4th ed.; ACLM; AMA; WHO; CDC) alátámasztott felmérés,
              amely pillérenkénti pontszámot ad, és — a felhasználó választása helyett —{" "}
              <strong className="text-ink">algoritmikusan ajánl</strong> egy 21, 66 vagy 100 napos
              programot („sprintet”) a feltárt kockázatok súlyossága alapján. A fizetős szakaszban
              napi feladatlista, naplózás, alvásnyomon-követés, közösségi feed, gamifikáció és egy
              biztonsági korlátokkal ellátott AI Coach várja a felhasználót.
            </p>
            <p>
              A projekt technikailag egy teljes, production-közeli Next.js 16 / React 19 /
              Supabase / Stripe / Anthropic Claude stacket valósít meg, saját CI-folyamattal,
              biztonsági fejlécekkel, RLS-alapú adatbázis-jogosultságkezeléssel, és —
              figyelemre méltó módon — <strong className="text-ink">dokumentált belső
              audit-sorozattal</strong>: statikus biztonsági átvilágítás, akadálymentességi (WCAG)
              audit, SEO/teljesítmény-audit, DPIA (adatvédelmi hatásvizsgálat) és külső pentest
              hatókör-dokumentum is része a kódbázisnak.
            </p>
            <p>
              Az üzleti érték nem egy hype-alapú „gyors fogyás” ígéretben rejlik, hanem a{" "}
              <strong className="text-ink">bizalomépítő, bizonyíték-alapú pozicionálásban</strong>:
              nyílt „nem neked való” szegmentáció, ellenőrzött testimonial-rendszer, és egy AI
              Coach, amely determinisztikus, LLM-hívás előtti biztonsági réteggel védekezik
              krízishelyzetek és kontraindikációk ellen — ritka, hiteles „felelős AI” üzenet a
              wellness-piacon.
            </p>
          </CaseStudySection>

          <CaseStudySection id="overview" kicker="II. Projekt áttekintés" title="Háttér, célcsoport, célok">
            <CaseStudyH3>Háttér</CaseStudyH3>
            <p>
              Az Ösvény abból a felismerésből indult ki, hogy a piacon elérhető
              egészség-alkalmazások túlnyomó többsége egy-fókuszú: vagy kizárólag étkezést, vagy
              kizárólag edzést, vagy kizárólag alvást követ. A lifestyle medicine szakirodalom
              (elsődlegesen Rippe <i>Lifestyle Medicine</i>, 4th edition) ezzel szemben azt
              hangsúlyozza, hogy a tartós viselkedésváltozás csak akkor működik, ha egyszerre,
              integráltan kezeljük a hat egymást erősítő pillért. Az Ösvény ezt az elméleti keretet
              ülteti át egy digitális, önértékeléssel induló, algoritmikusan személyre szabott
              termékbe.
            </p>
            <p>
              A márka strukturális motívuma a <strong className="text-ink">fa-metafora</strong>:
              minden pillér a fa egy részéhez van rendelve (levelek = étkezés, törzs = mozgás,
              gyökerek = alvás, egyensúly = stresszkezelés, ágak = kapcsolatok, évgyűrűk =
              szokások), és ez a metafora végigfut a kvíz eredményoldalán, a napi naplózó
              promptokon („mit tápláltál ma magadban”), a CTA-szövegeken („Folytatom az ösvényt”)
              és a dashboard növekedés-vizualizáción is.
            </p>

            <CaseStudyH3>Célcsoport</CaseStudyH3>
            <p>
              A termék elsődleges célközönsége stresszelt, túlterhelt, jellemzően 25–50 év közötti
              felnőttek, akik már próbálkoztak korábban (diéta, edzésterv, egy másik app) és
              elbuktak, és akik strukturált vezetést keresnek — nem puszta akaraterőre alapozott,
              hanem rendszerszintű megoldást. A landing oldal explicit módon kimondja azt is,
              kinek <strong className="text-ink">nem</strong> ajánlott a termék (nincs gyors
              fogyás-ígéret, nem orvosi kezelés, nem varázsszer) — ez tudatos, bizalomépítő
              anti-hype pozicionálás egy olyan piacon, ahol a túligérés a norma.
            </p>
            <p>
              A kvíz öt fő cél-szegmenst különböztet meg (több energia, testsúly, jobb alvás,
              kevesebb stressz, általános jó közérzet), a testsúly-célon belül pedig további
              altípusokat (fogyás, izomtömeg-építés, testösszetétel-javítás, alakformálás), amelyek
              mentén a kommunikáció és a napi feladatajánlás személyre szabható.
            </p>

            <CaseStudyH3>Célok és sikerkritériumok</CaseStudyH3>
            <CaseStudyList
              items={[
                <>
                  A termék sikerét nem hiúsági mutatók (pl. letöltésszám), hanem{" "}
                  <strong className="text-ink">retenciós és bizalmi mutatók</strong> mentén érdemes
                  mérni: a sprint-teljesítési arány (a testimonial-jogosultság feltétele ≥80%-os
                  teljesítés)
                </>,
                "A fizetős előfizetések automatikus lezárása a ciklus végén — nincs rejtett, örökös terhelés",
                "A valós, jóváhagyott — nem generált — vélemények aránya a landing oldalon",
                "A 3 napos ingyenes próbaidő bankkártyás regisztrációval, bármikor lemondható móddal egyszerre biztosít alacsony belépési súrlódást és minőségi lead-szűrést",
              ]}
            />

            <CaseStudyH3>Munkamódszertan</CaseStudyH3>
            <p>
              A kódbázis egy folyamatosan iterált, éles (production-közeli) rendszer állapotát
              tükrözi: a git history önmagában is jól mutatja a fejlesztési ciklus jellegét —
              funkcionális commitok (árazási modell átnevezése, nurture-email szekvencia
              bevezetése, kvíz retake-szabály finomítása) folyamatosan váltakoznak
              minőségbiztosítási commitokkal (túlígérő copy javítása, akadálymentességi hibák
              javítása, FAQ-ellentmondás javítása).
            </p>
            <CaseStudyCallout label="Munkamódszertani mintázat">
              funkció és tartalmi/jogi/biztonsági felülvizsgálat szoros egymásutánisága — ez a
              projekt egyik legjellemzőbb vonása: a review-kapu nem utólagos, hanem a
              fejlesztéssel párhuzamos lépés.
            </CaseStudyCallout>
          </CaseStudySection>

          <CaseStudySection id="arch" kicker="III. Technikai architektúra" title="Next.js szerver + Supabase + külső integrációk">
            <p>
              A projekt <strong className="text-ink">Next.js 16.2.9</strong>-re és{" "}
              <strong className="text-ink">React 19.2.4</strong>-re épül (App Router, szerver- és
              kliens-komponensek keverve), TypeScript strict módban. A styling Tailwind CSS
              4-gyel történik, animációkhoz <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">framer-motion</code>, adatvizualizációhoz{" "}
              <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">recharts</code>{" "}
              szolgál. A tranzakciós és nurture-emailek{" "}
              <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">react-email</code>{" "}
              komponensekkel épülnek, típusbiztosan karbantartható email-sablonokkal.
            </p>
            <CaseStudyDiagram caption="A backend nem külön szolgáltatás, hanem a Next.js App Router /api/* route handlerei — forráskód-szinten jól szegmentált végpontokkal.">
              {architectureDiagram}
            </CaseStudyDiagram>

            <CaseStudyH3>Adatréteg</CaseStudyH3>
            <p>
              Az adatréteg <strong className="text-ink">Supabase</strong> (menedzselt Postgres +
              Auth + Row-Level Security), a <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">@supabase/ssr</code>{" "}
              csomaggal integrálva a szerver-oldali renderelésbe. A séma (~710 sor) 21 táblát
              definiál, ezek közül a legfontosabbak:
            </p>
            <CaseStudyList
              items={[
                <>
                  <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">quiz_submissions</code> — a kvíz nyers válaszai, pillérenkénti pontszámok (jsonb), a levezetett kontextus (kor, fő cél, napi idő) és az ajánlott sprint
                </>,
                <>
                  <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">lifestyle_profiles</code>, <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">subscriptions</code> — a fizető felhasználók profilja és előfizetés-állapota (Stripe session, ár, start/end dátum, automatikus lezárás)
                </>,
                <>
                  <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">task_library</code>, <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">task_completions</code>, <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">daily_checkins</code> — a napi feladatrendszer és teljesítés-követés
                </>,
                <>
                  <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">chat_messages</code>, <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">journal_entries</code>, <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">sleep_diary_entries</code> — az AI Coach beszélgetéstörténete, napló és alvásnyomon-követés
                </>,
                <>
                  <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">testimonials</code>, <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">community_posts</code> — jogosultsághoz kötött vélemények és közösségi feed
                </>,
                <>
                  <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">audit_log</code>, <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">rate_limit_hits</code>, <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">funnel_events</code> — biztonsági/megfigyelhetőségi és termékanalitikai táblák
                </>,
              ]}
            />
            <CaseStudyCallout label="RLS mindenütt">
              minden felhasználói adathoz kötött táblán Row-Level Security (RLS) policy
              érvényesül — ez a Supabase-alapú architektúra egyik kulcs biztonsági rétege, amit a
              kódbázisban dokumentált statikus biztonsági audit külön is átvizsgált.
            </CaseStudyCallout>

            <CaseStudyH3>Külső integrációk</CaseStudyH3>
            <CaseStudyList
              items={[
                "Stripe — előfizetés-alapú fizetés, 3 napos ingyenes próbaidővel, webhook-alapú állapotszinkronizációval",
                "Resend + react-email — tranzakciós és nurture-emailek, saját, tesztelt retry-logikával",
                "Anthropic Claude API — az AI Coach nyelvi motorja, egy determinisztikus, kulcsszó-alapú biztonsági réteg mögött",
                "Sentry — hibakövetés kliens-, szerver- és edge-runtime-ra egyaránt konfigurálva, DSN nélkül no-op",
                "Svix — a Stripe/Resend webhook-aláírások kriptográfiai ellenőrzése",
              ]}
            />

            <CaseStudyH3>Minőségbiztosítás és CI</CaseStudyH3>
            <p>
              A vitest unit-tesztkészlet (13 tesztfájl) a legkritikusabb, nem UI-logikát fedi: a
              krízis- és vészhelyzet-felismerő regex-mintákat, a kontraindikáció-szűrést és az
              email-retry mechanizmust. A GitHub Actions CI-pipeline minden pull requesten és
              main-push-on lefuttatja a TypeScript típusellenőrzést, az ESLint-et, a teszteket és a
              teljes Next.js build-et — dummy környezeti változókkal, hogy titkok nélkül is
              validálható legyen a build integritása.
            </p>
            <p>
              A <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">next.config.ts</code> explicit biztonsági fejléc-készletet állít be minden
              route-ra: szigorú Content-Security-Policy, <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">X-Frame-Options: DENY</code>,{" "}
              <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">X-Content-Type-Options: nosniff</code>, HSTS preload-dal, és korlátozó
              Permissions-Policy. A CSP <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">unsafe-inline</code> script-/style-src direktíváit a
              csapat tudatos, dokumentált kompromisszumként tartja meg — nem felügyeleti
              hiányosságként.
            </p>
          </CaseStudySection>

          <CaseStudySection id="features" kicker="IV. Funkciók — mélyfúrás" title="A kvíz-motortól az AI Coach-ig">
            <CaseStudyH3>A kvíz-motor és a sprint-ajánló algoritmus</CaseStudyH3>
            <p>
              A kvíz két mélységi szintre bomlik. A <strong className="text-ink">core (alap)</strong>{" "}
              szakasz 30 kérdésből áll, pillérenként arányosan elosztva (6+5+5+5+5+4), és
              regisztráció vagy bankkártya nélkül azonnali, egyszerűsített eredményt ad. Az{" "}
              <strong className="text-ink">extended (részletes)</strong> szakasz opcionálisan
              folytatható, pontosabb pontszámért. Fontos tervezési döntés, hogy a{" "}
              <strong className="text-ink">klinikai biztonsági screening kérdések</strong>{" "}
              (mozgás utáni tartós fájdalom, alvási légzészavar/horkolás, szorongás-hangulat pár)
              szándékosan a kötelező core szakaszban helyezkednek el — így az egyszerűsített utat
              választók esetén sem marad ki a biztonsági szűrés, még akkor sem, ha soha nem jutnak
              el a fizetős programig.
            </p>
            <p>
              A pontozás pillérenkénti átlagot számol (1–5 skála, normalizálva 0–100-ra), a
              sprint-hosszt pedig egy <strong className="text-ink">algoritmikus, nem
              felhasználó által választott</strong> logika ajánlja: egy vagy több kritikus
              (&lt;35 pontos) vagy négy vagy több gyenge (&lt;60 pontos) pillér esetén 100 napos
              programot javasol a rendszer, két vagy több gyenge pillér esetén 66 naposat,
              egyébként 21 naposat. Ez a döntés — hogy a felhasználó nem maga választ csomagot —
              adat-vezérelt hitelességet ad az ajánlásnak, és egyben visszaszorítja a tisztán
              árazás-vezérelt választást.
            </p>

            <CaseStudyH3>Árazás</CaseStudyH3>
            <CaseStudyTable
              headers={["Csomag", "Hossz", "Havi ár", "Terhelési ciklusok", "Teljes ár"]}
              rows={[
                ["START", "21 nap", "29 990 Ft/hó", "1", "29 990 Ft"],
                ["TRANSFORM (kiemelt)", "66 nap", "24 990 Ft/hó", "2", "49 980 Ft"],
                ["MASTERY", "100 nap", "19 990 Ft/hó", "3", "59 970 Ft"],
              ]}
            />
            <p>
              Az árazási logika tudatosan csökkenő havi egységárral ösztönzi a hosszabb, magasabb
              LTV-jű programok választását, miközben éppen a leggyengébb kiinduló állapotú
              felhasználóknak ajánlja a rendszer a leghosszabb, legalacsonyabb havi egységárú
              programot. Mindhárom csomag 3 napos ingyenes próbaidővel indul, bankkártya-
              rögzítéssel, de csak a próbaidő lejárta után terhelve, bármikor lemondható módon — ez
              a 3 napos időszak az ÁSZF szerint a törvényi 14 napos elállási jogot helyettesíti,
              amire a checkout-folyamat explicit jelölőnégyzettel hívja fel a figyelmet.
            </p>

            <CaseStudyH3>Dashboard funkciók (fizető felhasználóknak)</CaseStudyH3>
            <p>
              A fizetős szakasz egy teljes napi rutint fed le:
            </p>
            <CaseStudyList
              items={[
                "Program — napi, pillérenkénti feladatlista",
                "Napló — esti reflexió",
                "AI Coach — chat",
                "Közösség — béta feed",
                "Étrend — heti javaslatok",
                "Alvásnapló, Szokások",
                "Haladás — radar-szerű, pillérenkénti vizualizáció recharts-szal",
                "Újrateszt — bejelentkezve újrakitölthető kvíz",
                "Profil — fiókkezelés, lemondás",
              ]}
            />
            <p>
              Retenciós rétegként jelvény-alapú gamifikáció és a fa-metaforás növekedés-vizualizáció
              egészíti ki a rendszert.
            </p>

            <CaseStudyH3>AI Coach — a projekt legjellemzőbb tervezési döntése</CaseStudyH3>
            <CaseStudyCallout label="Explicit elhatárolás">
              „Nem orvos. Nem terapeuta. Nem egészségügyi tanácsadó.” A rendszer célja a napi
              feladatokban való elakadás újrakeretezése, a túlambiciózus célok lefaragása és a
              kihagyott napok utáni visszatérés segítése — nem diagnózis, nem orvosi tanács.
            </CaseStudyCallout>
            <p>
              Ennél technikailag lényegesebb, hogy a biztonság{" "}
              <strong className="text-ink">nem az LLM-re van bízva</strong>. A{" "}
              <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">crisisDetection.ts</code> modul egy determinisztikus, magyar nyelvű reguláris
              kifejezés-készlettel ismeri fel az öngyilkossági/önbántalmazási kulcsszavakat (pl.
              „nem akarok tovább élni”, „véget vetnék”), és egyezés esetén{" "}
              <strong className="text-ink">kihagyja az LLM-hívást</strong>, helyette egy fix,
              segélyvonalakat (Lelki Egészségvonal — 116-123, illetve 112) tartalmazó választ ad.
              Ugyanez a minta érvényesül akut fizikai vészhelyzetekre (mellkasi fájdalom,
              stroke-tünetek, anafilaxia, elállíthatatlan vérzés) — ez a{" "}
              <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">detectEmergencySignal</code> függvény. A tervezési indoklás a forráskód
              fejléc-kommentjében is rögzítve van: egy modellhibás vagy figyelmen kívül hagyott
              rendszerprompt-utasítás esetén se maradhasson krízishelyzet segélyvonal-információ
              nélkül, mert a védelem nem a modell jó viselkedésén, hanem egy előtte futó,
              tesztelhető szabályon múlik.
            </p>
            <p>
              Emellett a <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">contraindications.ts</code> a kvíz kontextusából levezetett
              egészségügyi jelzőket (terhesség, kardiovaszkuláris/ízületi/cukorbetegség-/
              pajzsmirigy-/légzőszervi kockázat, mentális egészségi óvatosság, evészavar-óvatosság)
              használja fel a napi feladatok és az AI Coach válaszainak szűrésére — például nincs
              nagy intenzitású edzés-javaslat terhesség vagy kardiovaszkuláris kockázat esetén.
            </p>
          </CaseStudySection>

          <CaseStudySection id="ux" kicker="V. UX és márkahang" title="Anti-hype, önkritikus tartalomgondozás">
            <p>
              A termék tegező, informális magyar nyelvhasználatot és meleg, de bizonyíték-alapú,
              anti-hype tónust visel: nincs csodaszer-ígéret, nincs garantált eredmény, és a
              fejlesztési history explicit tanúsága szerint a csapat tudatosan és ismétlődően
              javította ki a túlzó vagy önellentmondó marketingszövegeket (pl. „egyetlen
              kattintással” overclaim javítása, FAQ 4-vs-6 CDC-hivatkozási ellentmondás javítása,
              önmagának ellentmondó „magas pontszám” visszajelző szövegek auditja). Ez a fajta
              tartalmi önkontroll — copy-audit commitok sűrű jelenléte a funkció-commitok között —
              szokatlanul erős minőségi fegyelmet jelez egy startup-fázisú terméknél.
            </p>
            <p>
              Az akadálymentességi (WCAG) átvilágítás dokumentált eredményei szerint a csak-emoji
              elemek <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">aria-hidden=&quot;true&quot;</code> jelölést kaptak, a fizetési
              feltétel-elfogadási modal <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">role=&quot;dialog&quot;</code>/
              <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">aria-modal</code>/fókusz-kezelést és Escape-zárhatóságot kapott, és a
              heading-hierarchia, valamint a form label-input társítások megfeleltek a
              WCAG-elvárásoknak. Nyitva maradt, dokumentált tétel a másodlagos szövegek
              kontrasztarányának eszközös (nem csak vizuális) ellenőrzése.
            </p>
          </CaseStudySection>

          <CaseStudySection id="security" kicker="VI. Biztonság, megfelelőség és minőségbiztosítás" title="„Nem utólagos tűzoltás”">
            <p>
              Az Ösvény kódbázisa szokatlanul gazdag belső audit-dokumentációt tartalmaz a{" "}
              <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">/docs</code> mappában, ami a projekt egyik legmarkánsabb, portfólió-szempontból
              is releváns vonása:
            </p>
            <CaseStudyList
              items={[
                <>
                  <strong className="text-ink">security-static-audit.md</strong> — a teljes
                  API-réteg, az RLS policy-k és a biztonsági fejlécek kód-szintű átvilágítása
                </>,
                <>
                  <strong className="text-ink">pentest-scope.md</strong> — egy külső
                  penetrációs teszt hatókör- és megbízási dokumentuma (ROE): hatókörbe tartozó
                  felületek (nyilvános API-k, IDOR-gyanús végpontok mint a kvíz-eredmény UUID,
                  admin jogosultság-kiterjesztés, AI Coach prompt injection/jailbreak), hatókörön
                  kívüliek (DoS, social engineering, harmadik fél infrastruktúrája, éles
                  bankkártyás tranzakció) és a szükséges teszt-hozzáférések
                </>,
                <>
                  <strong className="text-ink">dpia.md</strong> — adatvédelmi hatásvizsgálat
                  (206 sor), tekintve, hogy a termék egészséggel összefüggő, különleges kategóriájú
                  adatokat (GDPR 9. cikk) kezel
                </>,
                <>
                  <strong className="text-ink">dpa-checklist.md</strong> — adatfeldolgozói
                  szerződés-ellenőrzőlista a harmadik fél szolgáltatókhoz (Stripe, Resend,
                  Supabase, Anthropic, Sentry)
                </>,
                <>
                  <strong className="text-ink">accessibility-audit.md</strong>,{" "}
                  <strong className="text-ink">seo-perf-audit.md</strong>,{" "}
                  <strong className="text-ink">content-citation-audit.md</strong>,{" "}
                  <strong className="text-ink">quiz-psychometrics.md</strong>,{" "}
                  <strong className="text-ink">clinical-review-package.md</strong>,{" "}
                  <strong className="text-ink">testimonials.md</strong> — rendre az
                  akadálymentességi, SEO/teljesítmény, tudományos hivatkozás-pontosság,
                  kvíz-pszichometria, klinikai biztonsági szűrés szakmai felülvizsgálata és a
                  testimonial-jogosultsági rendszer dokumentációja
                </>,
              ]}
            />
            <p>
              Ez a fajta dokumentáltság ritka egy egyszemélyes vagy kisebb csapat által épített
              terméknél, és azt jelzi, hogy a fejlesztési folyamat tudatosan épített be
              szakmai/jogi/biztonsági review-kaput a funkciófejlesztés mellé — nem utólagos, hanem
              a fejlesztéssel párhuzamos lépésként.
            </p>
            <p>
              A tudományos hitelesség forrásoldala fejezet-szintű hivatkozással köti minden pillért
              a Rippe <i>Lifestyle Medicine</i> (4th ed.) megfelelő fejezeteihez, kiegészítve ACLM,
              AMA, WHO és CDC hivatkozásokkal, és explicit jogi elhatárolással: a termék „nem ad
              orvosi vagy dietetikusi tanácsot.” A testimonial-rendszer csak azoknak enged
              véleményt adni, akik a sprintjük legalább 80%-át teljesítették, és a sprint vége óta
              legalább 7 nap eltelt, admin-jóváhagyással — ez garantálja, hogy nincs fake social
              proof a landing oldalon.
            </p>
          </CaseStudySection>

          <CaseStudySection id="challenges" kicker="VII. Kihívások és megoldások" title="Amivel meg kellett küzdeni">
            <CaseStudyTable
              headers={["Kihívás", "Megoldás"]}
              rows={[
                [
                  "Érzékeny egészségügyi kontextusban futó AI-chat biztonsága — egy generatív nyelvi modell önmagában nem garantálja megbízhatóan a helyes krízis-reakciót",
                  "A védelmi logika kikerült az LLM-ből egy előtte futó, tesztelt, determinisztikus szabályrétegbe (crisisDetection.ts, contraindications.ts), teljes tesztlefedettséggel",
                ],
                [
                  "A marketingszöveg és a valós termékkínálat közötti overclaim-kockázat egy önértékelésre épülő terméknél",
                  "Ismétlődő, dedikált copy-audit ciklusok, amelyek szisztematikusan kigyomlálják az abszolút állításokat, és hedge-elt, bizonyíték-korlátos megfogalmazást vezetnek be — tudatos brand-szabályként rögzítve",
                ],
                [
                  "Statikus oldalgenerálás vs. szigorú CSP — a nonce-alapú CSP minden oldal dinamikus renderelését igényelné, kivéve a CDN-cache-elt oldalakat a gyors kiszolgálásból",
                  "Tudatosan unsafe-inline-nal futó CSP, dokumentáltan mérlegelve a kockázatot a többi védelmi réteggel (React auto-escaping, Zod input-validáció, RLS) szemben, konkrét XSS-találat esetére felülvizsgálatra jelölve",
                ],
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="results" kicker="VIII. Eredmények és üzleti érték" title="Mérnöki érettség, nem forgalmi mutatók">
            <p>
              Mivel az Ösvény jelenleg fejlesztési/audit-fázisban dokumentált projekt (a
              pentest-hatókör dokumentum explicit „mielőtt a felhasználói bázis számottevően
              megnő” időzítést jelöl meg), a legkonkrétabb, ellenőrizhető eredmények nem forgalmi
              mutatók, hanem mérnöki érettségi jelek.
            </p>
            <CaseStudyTiles
              tiles={[
                { value: "10", label: "belső audit-dokumentum a /docs mappában" },
                { value: "100%", label: "CI-lefedettség — típusellenőrzés, lint, teszt, build minden PR-en" },
                { value: "≥80%", label: "sprint-teljesítési küszöb a testimonial-jogosultsághoz" },
              ]}
            />
            <p>
              Ezt egészíti ki a dokumentált és javított akadálymentességi hibák, javított
              SEO-hiányosságok (hiányzó metaadatok, JSON-LD structured data bevezetése a FAQ-hoz),
              és egy előre elkészített, vendornak átadható külső pentest-hatókör — vagyis a
              biztonsági felülvizsgálat nem utólagos tűzoltás, hanem tervezett folyamat.
            </p>
            <p>
              Termékoldalon az üzleti érték a differenciált pozicionálásban rejlik egy zsúfolt
              piacon:
            </p>
            <CaseStudyList
              items={[
                "Teljes 6-pilléres, tudományosan hivatkozott keretrendszer egy-fókuszú appok helyett",
                "Adaptív, klinikai biztonsági screeninggel ellátott kvíz",
                "Algoritmikusan (nem felhasználó által) ajánlott programhossz",
                "Determinisztikus AI-biztonsági réteg az LLM-hívás előtt",
                "Jogosultsághoz kötött, ellenőrzött testimonial-rendszer",
                "Nyílt „nem neked való” szegmentáció",
              ]}
            />

            <CaseStudyCallout label="Összegzés">
              az Ösvényt nem egyetlen feature különbözteti meg a piaci mezőnytől, hanem a
              rendszerszintű fegyelem: egy determinisztikus biztonsági réteg az AI előtt, egy
              algoritmikus, nem manipulálható programajánlás, egy dokumentált audit-sorozat a
              biztonságtól az akadálymentességig, és egy márkahang, amely tudatosan kerüli a saját
              piacára jellemző túlígérést.
            </CaseStudyCallout>
          </CaseStudySection>

          <CaseStudySection id="future" kicker="IX. Jövőbeli irányok" title="A dokumentált fejlesztési útiterv">
            <CaseStudyList
              items={[
                "Külső, harmadik féltől végzett penetrációs teszt lebonyolítása a felhasználói bázis bővülése előtt",
                "Eszközös (nem csak vizuális) kontrasztmérés a WCAG AA teljes lefedettségéhez",
                "A CSP nonce-alapú szigorítási kérdésének újratárgyalása, ha a rendering-stratégia változik vagy konkrét XSS-kockázat merül fel",
                "A közösség funkció béta státuszból éles állapotba léptetése",
              ]}
            />
            <p>
              Az architektúra — Vercel Cron-alapú email-szekvenciák, moduláris{" "}
              <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">lib/</code> réteg, RLS-alapú Supabase-adatmodell — jól skálázódik
              további pillér-specifikus funkciók (pl. bővített étrend-modul, amire a{" "}
              <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.85em] text-ink">lib/recipes</code> és a seed-recipe SQL-fájlok már előkészültek)
              hozzáadására.
            </p>
          </CaseStudySection>

          <CaseStudyColophon>
            Az esettanulmány a kódbázis (frontend, backend/API-réteg, adatbázis-séma, a{" "}
            <code className="font-mono text-ink/50">/docs</code> alatti belső auditok, git
            history) közvetlen elemzésén alapul, 2026. augusztusi állapot szerint.
          </CaseStudyColophon>
        </CaseStudyBody>

        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
