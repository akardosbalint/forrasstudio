import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/FinalCTA";
import {
  CaseStudyHero,
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
  title: "Forge Gym — Esettanulmány (Demo projekt) — MI Építettük",
  description:
    "Teremedző stúdió tagsági és bérletkezelő platformja: publikus marketing oldal, QR-kódos beléptetés, valós Stripe bankkártyás fizetés és staff beléptető felület — demo projektként bemutatva.",
};

const tocItems = [
  { href: "#attekintes", label: "Áttekintés" },
  { href: "#tech", label: "Tech stack" },
  { href: "#felulet", label: "A felület" },
  { href: "#funkciok", label: "Kulcsfunkciók" },
  { href: "#demo", label: "Miért demo projekt" },
];

const archDiagram = `┌──────────────────────────────────────────────┐
│              Next.js (App Router)               │
│  Publikus marketing oldal · Tagsági dashboard    │
│  Staff / admin beléptető felület                 │
└───────────────────────┬────────────────────────┘
                         │
        ┌────────────────┼─────────────────┐
        ▼                                   ▼
┌───────────────────┐             ┌───────────────────────┐
│  Prisma + Postgres  │             │   Stripe Checkout +     │
│  tagok · bérletek    │             │   Billing Portal         │
│  vásárlások · belépés │◄───webhook──│   bankkártyás fizetés,   │
└───────────────────┘             │   önkiszolgáló megújítás │
                                   └───────────────────────┘`;

export default function ForgeGymCaseStudyPage() {
  return (
    <>
      <Nav legal />
      <main className="flex-1">
        <CaseStudyHero
          eyebrow="Esettanulmány · Tagsági & bérletkezelő platform"
          title="Forge Gym"
          badge="Demo projekt"
          subtitle="Egy budapesti teremedző stúdió teljes webes platformja: publikus marketing oldal, saját QR-kódos beléptetés, valós bankkártyás bérletfizetés Stripe-on keresztül és egy recepciós felület a tagok beengedéséhez."
          meta={[
            { label: "Szerepünk", value: "Full-stack fejlesztés — tervezéstől az élesítésig" },
            { label: "Típus", value: "Demo / portfólió projekt, nem élő fizető ügyfél" },
            { label: "Fizetés", value: "Valós Stripe Checkout + Billing Portal integráció" },
          ]}
        />

        <CaseStudyBody>
          <CaseStudyTOC items={tocItems} />

          <CaseStudySection id="attekintes" kicker="I. Áttekintés" title="Egy teremtől a bankkártyás fizetésig">
            <CaseStudyLede>
              A Forge Gym egy fiktív budapesti teremedző stúdió számára épített, de valódi,
              működő technológiai rétegekkel megvalósított platform: a nyilvános árlistától a
              bankkártyás fizetésig és a recepciós beléptetésig minden lépés éles integrációkkal
              (Stripe, saját adatbázis, jogosultságkezelés) működik — csak maga az „ügyfél”
              demonstrációs célú.
            </CaseStudyLede>
            <p>
              A rendszer négy felhasználói felületet fog össze egy adatmodellben: a látogatóknak
              szóló marketing oldalt, a tagoknak szóló bérlet-dashboardot, a valódi bankkártyás
              fizetési folyamatot és a recepciósoknak szóló beléptető felületet — ugyanaz a
              bérlet-, vásárlás- és belépés-adat mind a négy helyen konzisztens.
            </p>
            <CaseStudyTiles
              tiles={[
                { value: "4", label: "bérlettípus — alkalmi, havi, negyedéves, éves, automatikus megújulással" },
                { value: "Stripe", label: "valós bankkártyás checkout + önkiszolgáló Billing Portal" },
                { value: "QR", label: "saját beléptető rendszer, kamerás és kézi kódbeolvasással" },
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="tech" kicker="II. Tech stack" title="Amivel épült">
            <CaseStudyTable
              headers={["Réteg", "Technológia"]}
              rows={[
                ["Frontend / keretrendszer", "Next.js (App Router) + TypeScript"],
                ["Stílus", "Tailwind CSS 4 — reszponzív, egyedi dizájnrendszer"],
                ["Adatmodell", "Prisma + Postgres (tagok, bérletek, vásárlások, belépések)"],
                ["Hitelesítés", "NextAuth (Credentials) — jelszavas belépés, tag / staff jogosultság"],
                [
                  "Fizetés",
                  "Stripe Checkout + Billing Portal — bankkártyás fizetés, előfizetés-kezelés, webhookkal szinkronizált bérletstátusz",
                ],
                ["Beléptetés", "QR-kód alapú rendszer, kamerás és kézi kódbeolvasással"],
              ]}
            />
            <CaseStudyDiagram caption="A publikus oldal, a tagsági dashboard és a staff beléptető felület ugyanazt az adatmodellt olvassa — a bérletstátusz a Stripe webhookon keresztül automatikusan szinkronban marad a valósággal.">
              {archDiagram}
            </CaseStudyDiagram>
          </CaseStudySection>

          <CaseStudySection id="felulet" kicker="III. A felület" title="Négy nézet, egy rendszer">
            <CaseStudyH3>Publikus árlista</CaseStudyH3>
            <p>
              A marketing oldal sötét, piros márkajelzésű dizájnja rögtön az árazásnál kezdi a
              meggyőzést: egy tiszta bérlettáblázat (alkalmi, havi, negyedéves, éves) a
              gyakorisággal együtt, alatta a „Csatlakozz és válassz bérletet” CTA-val és egy
              rövid magyarázattal arról, mely bérletek újulnak meg automatikusan. Az ingyenes
              szolgáltatások (szauna, értékmegőrző, zuhanyzó, parkoló) ikonsorral jelennek meg, a
              lap alján pedig egy kiemelt, piros figyelmeztető doboz sorolja fel az apró betűs
              részeket (áfa, fizetési mód korlátozás, külön díjas szolgáltatások) — ez a fajta
              átláthatóság szándékos tervezési döntés, nem utólagos jogi kiegészítés.
            </p>

            <CaseStudyH3>Tagsági dashboard</CaseStudyH3>
            <p>
              Bejelentkezés után a tag egy személyre szabott áttekintő felületet kap: a saját,
              letölthető QR-belépőkódját, az aktív bérlet állapotát (hátralévő napok, a bérleti
              időszak vizuális előrehaladása, a felhasznált alkalmak száma), valamint három
              gyors statisztikát — a 30 napos belépésszámot, az átlagos edzésidőt és az összes,
              tagság óta regisztrált belépést. Egy heti bontású oszlopdiagram az elmúlt 8 hét
              edzésgyakoriságát is megmutatja, hogy a tag saját magának is lássa a rendszerességét.
            </p>

            <CaseStudyH3>Bérlet és fizetés</CaseStudyH3>
            <p>
              A „Bérletem” aloldalon a tag nemcsak megnézheti, de meg is újíthatja vagy
              válthatja a bérletét — mind a négy típushoz saját „Fizetés bankkártyával” gomb
              tartozik, ami valódi Stripe Checkout folyamatot indít. A korábbi bérletek
              (időszak, felhasználás, ár, állapot) egy külön táblázatban maradnak visszakereshetők,
              a folyamatban lévő és lejárt előfizetések állapota pedig a Stripe webhookon keresztül
              automatikusan frissül, nem manuális adminisztrációval.
            </p>

            <CaseStudyH3>Staff beléptető felület</CaseStudyH3>
            <p>
              A recepciósoknak szánt, különálló „STAFF” jelzésű felület a tag QR-kódjának kamerás
              beolvasására épül, kézi kódbeviteli lehetőséggel a kamera meghibásodása vagy
              olvashatatlan kód esetére. A jobb oldali élő napló minden beléptetést azonnal
              megjelenít — ki lépett be, ki olvasta be a kódját, és mikor —, így a recepció
              valós időben látja a forgalmat anélkül, hogy külön riportot kellene futtatnia.
            </p>
          </CaseStudySection>

          <CaseStudySection id="funkciok" kicker="IV. Kulcsfunkciók" title="Amit a rendszer valóban tud">
            <CaseStudyList
              items={[
                <>
                  <strong className="text-ink">Publikus marketing oldal</strong> — bemutatkozás,
                  szolgáltatások, edzők, galéria, nyitvatartás és árlista
                </>,
                <>
                  <strong className="text-ink">Bérlet- és árazási oldal</strong> — 4 bérlettípus
                  (alkalmi, havi, negyedéves, éves), automatikus megújulás kezelése
                </>,
                <>
                  <strong className="text-ink">Tagsági dashboard</strong> — saját, fotóként
                  letölthető QR-kód, aktív bérlet állapota, belépési statisztikák és heti
                  edzésgyakoriság-grafikon
                </>,
                <>
                  <strong className="text-ink">Valós Stripe fizetés</strong> — bankkártyás
                  checkout, promóciós kód beváltása, önkiszolgáló előfizetés-kezelés
                  (lemondás / módosítás) a Stripe Billing Portalon keresztül
                </>,
                <>
                  <strong className="text-ink">Staff / admin beléptető felület</strong> — tagok
                  QR-kódos beolvasása kamerával vagy kézi kódbevitellel, valós idejű
                  beléptetési napló
                </>,
              ]}
            />
          </CaseStudySection>

          <CaseStudySection id="demo" kicker="V. Miért demo projekt" title="Amit érdemes tudni róla">
            <p>
              A Forge Gym mögött nincs valódi, fizető teremedző stúdió — a projekt azt mutatja
              be, milyen mélységű, éles integrációkkal (valós Stripe-fizetés, saját
              adatmodell, jogosultságkezelt felületek) rendelkező rendszert tudunk felépíteni
              egy tipikus, előfizetéses tagsági modellre épülő vállalkozásnak, mint amilyen egy
              edzőterem, egy stúdió vagy egy klub.
            </p>
            <CaseStudyCallout label="Demo projekt">
              A funkciók és az integrációk élesek és működőképesek — a márka, az adatok és az
              „ügyfél” fiktívek. Ha hasonló bérletkezelő, beléptető vagy tagsági rendszerre van
              szükséged, ez a projekt jó kiindulópont arra, hogyan nézne ki a tiéd.
            </CaseStudyCallout>
          </CaseStudySection>

          <CaseStudyColophon>
            A Forge Gym demonstrációs célú projekt — nem egy valódi ügyfél élő rendszere. A
            leírás és a bemutatott felületek a saját fejlesztői szerveren futó, éles
            integrációkkal (Stripe, saját adatbázis) rendelkező build alapján készültek.
          </CaseStudyColophon>
        </CaseStudyBody>

        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
