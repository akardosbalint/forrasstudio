import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató — Forrás Stúdió",
  description:
    "A Forrás Stúdió adatkezelési tájékoztatója a weboldalon leadott visszahívás-kérésekkel kapcsolatban.",
};

export default function AdatvedelemPage() {
  return (
    <LegalPageShell
      eyebrow="Jogi dokumentum"
      title="Adatkezelési tájékoztató"
      updated="2026. július 1."
    >
      <LegalSection title="1. Az adatkezelő">
        <p>
          A jelen tájékoztató szerinti adatkezelő a Forrás Stúdió{" "}
          <span className="font-mono text-sm">(Kardos Bálint e.v.)</span>.
        </p>
        <ul>
          <li>Székhely: 1027 Budapest, Bem József utca 6. fsz. 3.</li>
          <li>Nyilvántartási szám: 61623820</li>
          <li>Adószám: 91637778-1-41</li>
          <li>
            Email: <a href="mailto:akardosbalint@gmail.com">akardosbalint@gmail.com</a>
          </li>
          <li>
            Telefon: <a href="tel:[TODO: telefonszám]">[TODO: telefonszám]</a>
          </li>
        </ul>
        <p>
          A teljes cégadatokat lásd az <a href="/impresszum">Impresszum</a> oldalon.
        </p>
      </LegalSection>

      <LegalSection title="2. Milyen adatokat kezelünk, és miért">
        <p>
          A weboldalon található &bdquo;Visszahívást kérek&rdquo; form kitöltésekor a
          következő adatokat kérjük:
        </p>
        <ul>
          <li>Név (kötelező)</li>
          <li>Telefonszám (kötelező)</li>
          <li>Cég / szervezet neve (opcionális)</li>
          <li>Email cím (opcionális)</li>
          <li>Üzenet (opcionális)</li>
        </ul>
        <p>
          Az adatkezelés célja: veled való kapcsolatfelvétel, ajánlatadás és a
          szolgáltatásainkkal kapcsolatos egyeztetés. A megadott adatokat nem
          használjuk a fent megjelölt céltól eltérő (pl. hírlevél, marketing)
          célra, és nem adjuk el, nem adjuk át harmadik félnek marketing
          célból.
        </p>
      </LegalSection>

      <LegalSection title="3. Az adatkezelés jogalapja">
        <p>
          Az adatkezelés jogalapja a GDPR 6. cikk (1) bekezdés a) pontja
          szerinti hozzájárulásod, amelyet a form elküldésekor, a
          checkbox bejelölésével adsz meg.
        </p>
        <p>
          A hozzájárulás bármikor, indoklás nélkül visszavonható — ez nem
          érinti a visszavonás előtti adatkezelés jogszerűségét.
        </p>
      </LegalSection>

      <LegalSection title="4. Meddig tároljuk az adataidat">
        <p>
          <span className="font-mono text-sm">[TODO: pontosítandó]</span> —
          javasolt alapértelmezés: a kapcsolatfelvételtől számított legfeljebb
          1 évig, vagy addig, amíg a hozzájárulásodat vissza nem vonod,
          illetve amíg a köztünk létrejövő üzleti kapcsolat fennáll.
        </p>
      </LegalSection>

      <LegalSection title="5. Kik férnek hozzá az adataidhoz (adatfeldolgozók)">
        <ul>
          <li>
            <strong>Supabase, Inc.</strong> — adatbázis-tárhely, ahol a form
            adatai tárolódnak.{" "}
            <span className="font-mono text-sm">
              [TODO: adatfeldolgozói szerződés / DPA aláírása, az adatközpont
              régiójának ellenőrzése]
            </span>
            .
          </li>
          <li>
            <strong>Resend, Inc.</strong> — a form beküldéséről szóló azonnali
            email-értesítés kézbesítése a stúdió felé; ehhez a neved és
            telefonszámod továbbításra kerül a Resend rendszerébe.{" "}
            <span className="font-mono text-sm">
              [TODO: Resend DPA / megfelelő adattovábbítási garanciák
              ellenőrzése, mivel a Resend Egyesült Államok-beli szolgáltató]
            </span>
            .
          </li>
          <li>
            <strong>Vercel Inc.</strong> — az oldal tárhelyszolgáltatója
            (technikai üzemeltetés).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. A te jogaid">
        <ul>
          <li>Hozzáférés: megtudhatod, milyen adatot kezelünk rólad.</li>
          <li>Helyesbítés: kérheted a pontatlan adat javítását.</li>
          <li>Törlés (&bdquo;elfeledtetéshez való jog&rdquo;).</li>
          <li>Az adatkezelés korlátozása.</li>
          <li>Tiltakozás az adatkezelés ellen.</li>
          <li>Adathordozhatóság.</li>
          <li>A hozzájárulás bármikori visszavonása.</li>
        </ul>
        <p>
          Ezen jogok gyakorlásához írj nekünk a{" "}
          <a href="mailto:akardosbalint@gmail.com">akardosbalint@gmail.com</a> címre.
        </p>
      </LegalSection>

      <LegalSection title="7. Panasz benyújtása">
        <p>
          Ha úgy érzed, jogsérelem ért, panasszal fordulhatsz a Nemzeti
          Adatvédelmi és Információszabadság Hatósághoz (NAIH):
        </p>
        <ul>
          <li>Cím: 1055 Budapest, Falk Miksa utca 9-11.</li>
          <li>Postacím: 1363 Budapest, Pf. 9.</li>
          <li>Telefon: +36-1-391-1400</li>
          <li>
            Email: <a href="mailto:ugyfelszolgalat@naih.hu">ugyfelszolgalat@naih.hu</a>
          </li>
          <li>
            Weboldal:{" "}
            <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">
              www.naih.hu
            </a>
          </li>
        </ul>
        <p>Igényedet bíróság előtt is érvényesítheted.</p>
      </LegalSection>

      <LegalSection title="8. Adatbiztonság">
        <p>
          Az adatokat titkosított (HTTPS) kapcsolaton keresztül továbbítjuk,
          és jogosultságkezeléssel védett adatbázisban tároljuk.
        </p>
      </LegalSection>

      <LegalSection title="9. A tájékoztató módosítása">
        <p>
          Ezt a tájékoztatót időről időre frissíthetjük, az aktuális verzió
          mindig ezen az oldalon érhető el.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
