import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/dictionaries";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  hu: {
    title: "Adatkezelési tájékoztató — MI Építettük",
    description:
      "A MI Építettük adatkezelési tájékoztatója a weboldalon leadott visszahívás-kérésekkel kapcsolatban.",
  },
  en: {
    title: "Privacy Policy — MI Építettük",
    description:
      "MI Építettük's privacy policy regarding callback requests submitted on the website.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const meta = metaByLocale[isLocale(lang) ? lang : "hu"];
  return meta;
}

const contentByLocale: Record<Locale, { title: string; updated: string }> = {
  hu: { title: "Adatkezelési tájékoztató", updated: "2026. július 1." },
  en: { title: "Privacy Policy", updated: "July 1, 2026" },
};

export default async function AdatvedelemPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const content = contentByLocale[lang];

  return (
    <LegalPageShell
      lang={lang}
      navDict={dict.site.nav}
      footerDict={dict.site.footer}
      languageSwitcherLabels={dict.common.languageSwitcher}
      cookieSettingsLabel={dict.site.cookieSettingsButton.label}
      eyebrow={dict.site.legalShell.eyebrow}
      title={content.title}
      updated={content.updated}
      updatedLabel={dict.site.legalShell.updatedLabel}
    >
      {lang === "hu" ? <AdatvedelemHu lang={lang} /> : <AdatvedelemEn lang={lang} />}
    </LegalPageShell>
  );
}

function AdatvedelemHu({ lang }: { lang: Locale }) {
  return (
    <>
      <LegalSection title="1. Az adatkezelő">
        <p>
          A jelen tájékoztató szerinti adatkezelő a{" "}
          <span className="font-mono text-sm">MI Építettük Kft.</span>.
        </p>
        <ul>
          <li>Székhely: 1027 Budapest, Bem József utca 6. fsz. 3.</li>
          <li>Cégjegyzékszám: <span className="font-mono text-sm">[TODO: cégjegyzékszám]</span></li>
          <li>Adószám: <span className="font-mono text-sm">[TODO: adószám]</span></li>
          <li>
            Email: <a href="mailto:akardosbalint@gmail.com">akardosbalint@gmail.com</a>
          </li>
          <li>
            Telefon: <a href="tel:[TODO: telefonszám]">[TODO: telefonszám]</a>
          </li>
        </ul>
        <p>
          A teljes cégadatokat lásd az <Link href={`/${lang}/impresszum`}>Impresszum</Link> oldalon.
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
            <strong>Google LLC (Google Workspace)</strong> — a form
            beküldéséről szóló azonnali email-értesítés kézbesítése a stúdió
            felé, a stúdió saját Google Workspace fiókján keresztül; ehhez a
            neved és telefonszámod továbbításra kerül a Google email
            rendszerébe.{" "}
            <span className="font-mono text-sm">
              [TODO: Google Workspace adatfeldolgozási feltételek (Data
              Processing Addendum) ellenőrzése]
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
    </>
  );
}

function AdatvedelemEn({ lang }: { lang: Locale }) {
  return (
    <>
      <LegalSection title="1. The data controller">
        <p>
          The data controller under this policy is{" "}
          <span className="font-mono text-sm">MI Építettük Kft.</span>.
        </p>
        <ul>
          <li>Registered address: 1027 Budapest, Bem József utca 6. fsz. 3., Hungary</li>
          <li>
            Company registration number:{" "}
            <span className="font-mono text-sm">[TODO: company registration number]</span>
          </li>
          <li>Tax number: <span className="font-mono text-sm">[TODO: tax number]</span></li>
          <li>
            Email: <a href="mailto:akardosbalint@gmail.com">akardosbalint@gmail.com</a>
          </li>
          <li>
            Phone: <a href="tel:[TODO: telefonszám]">[TODO: phone number]</a>
          </li>
        </ul>
        <p>
          For full company details, see the <Link href={`/${lang}/impresszum`}>Imprint</Link> page.
        </p>
      </LegalSection>

      <LegalSection title="2. What data we process, and why">
        <p>
          When you fill out the “Request a callback” form on our website, we
          ask for the following data:
        </p>
        <ul>
          <li>Name (required)</li>
          <li>Phone number (required)</li>
          <li>Company / organization name (optional)</li>
          <li>Email address (optional)</li>
          <li>Message (optional)</li>
        </ul>
        <p>
          The purpose of processing is to contact you, provide a quote, and
          discuss our services with you. We do not use the data you provide
          for any purpose other than the one stated above (e.g. newsletters,
          marketing), and we do not sell it or share it with third parties
          for marketing purposes.
        </p>
      </LegalSection>

      <LegalSection title="3. Legal basis for processing">
        <p>
          The legal basis for processing is your consent under Article 6(1)(a)
          GDPR, which you give by ticking the checkbox when submitting the
          form.
        </p>
        <p>
          Consent can be withdrawn at any time, without justification — this
          does not affect the lawfulness of processing carried out before the
          withdrawal.
        </p>
      </LegalSection>

      <LegalSection title="4. How long we keep your data">
        <p>
          <span className="font-mono text-sm">[TODO: to be finalized]</span> —
          suggested default: for a maximum of 1 year from the date of
          contact, or until you withdraw your consent, or for as long as our
          business relationship continues, whichever applies.
        </p>
      </LegalSection>

      <LegalSection title="5. Who has access to your data (data processors)">
        <ul>
          <li>
            <strong>Supabase, Inc.</strong> — database hosting, where the
            form data is stored.{" "}
            <span className="font-mono text-sm">
              [TODO: sign data processing agreement / DPA, verify the data
              center region]
            </span>
            .
          </li>
          <li>
            <strong>Google LLC (Google Workspace)</strong> — delivery of the
            instant email notification about form submissions to the studio,
            via the studio&rsquo;s own Google Workspace account; this transfers
            your name and phone number into Google&rsquo;s email system.{" "}
            <span className="font-mono text-sm">
              [TODO: verify Google Workspace Data Processing Addendum]
            </span>
            .
          </li>
          <li>
            <strong>Vercel Inc.</strong> — the website&rsquo;s hosting provider
            (technical operation).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Your rights">
        <ul>
          <li>Access: find out what data we hold about you.</li>
          <li>Rectification: request correction of inaccurate data.</li>
          <li>Erasure (the “right to be forgotten”).</li>
          <li>Restriction of processing.</li>
          <li>Objection to processing.</li>
          <li>Data portability.</li>
          <li>Withdrawal of consent at any time.</li>
        </ul>
        <p>
          To exercise these rights, write to us at{" "}
          <a href="mailto:akardosbalint@gmail.com">akardosbalint@gmail.com</a>.
        </p>
      </LegalSection>

      <LegalSection title="7. Filing a complaint">
        <p>
          If you believe your rights have been violated, you may file a
          complaint with the Hungarian National Authority for Data Protection
          and Freedom of Information (NAIH):
        </p>
        <ul>
          <li>Address: 1055 Budapest, Falk Miksa utca 9-11., Hungary</li>
          <li>Postal address: 1363 Budapest, Pf. 9., Hungary</li>
          <li>Phone: +36-1-391-1400</li>
          <li>
            Email: <a href="mailto:ugyfelszolgalat@naih.hu">ugyfelszolgalat@naih.hu</a>
          </li>
          <li>
            Website:{" "}
            <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">
              www.naih.hu
            </a>
          </li>
        </ul>
        <p>You may also enforce your claim before a court.</p>
      </LegalSection>

      <LegalSection title="8. Data security">
        <p>
          Data is transmitted over an encrypted (HTTPS) connection and stored
          in a database protected by access control.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to this policy">
        <p>
          We may update this policy from time to time; the current version is
          always available on this page.
        </p>
      </LegalSection>
    </>
  );
}
