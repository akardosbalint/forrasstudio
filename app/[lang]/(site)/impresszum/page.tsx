import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/dictionaries";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  hu: {
    title: "Impresszum — MI Építettük",
    description: "A MI Építettük weboldal üzemeltetőjének adatai.",
  },
  en: {
    title: "Imprint — MI Építettük",
    description: "Details of the operator of the MI Építettük website.",
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
  hu: { title: "Impresszum", updated: "2026. július 1." },
  en: { title: "Imprint", updated: "July 1, 2026" },
};

export default async function ImpresszumPage({
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
      {lang === "hu" ? <ImpresszumHu lang={lang} /> : <ImpresszumEn lang={lang} />}
    </LegalPageShell>
  );
}

function ImpresszumHu({ lang }: { lang: Locale }) {
  return (
    <>
      <LegalSection title="Szolgáltató adatai">
        <ul>
          <li>Márkanév: MI Építettük</li>
          <li>Szolgáltató neve: MI Építettük Kft.</li>
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
      </LegalSection>

      <LegalSection title="Tárhelyszolgáltató">
        <p>
          Vercel Inc. (Egyesült Államok) —{" "}
          <a href="https://vercel.com/legal" target="_blank" rel="noopener noreferrer">
            vercel.com/legal
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Domain">
        <p>
          A weboldal végleges domainje: miepitettuk.hu.
        </p>
      </LegalSection>

      <LegalSection title="Jogi nyilatkozat">
        <p>
          A weboldalon található tartalmak tájékoztató jellegűek, nem
          minősülnek szerződéses ajánlattételnek. A referenciaként bemutatott
          projektek adatait lásd a{" "}
          <Link href="/hu/#referenciak">Referenciák</Link> szekcióban.
        </p>
      </LegalSection>
    </>
  );
}

function ImpresszumEn({ lang }: { lang: Locale }) {
  return (
    <>
      <LegalSection title="Provider details">
        <ul>
          <li>Brand name: MI Építettük</li>
          <li>Provider's legal name: MI Építettük Kft.</li>
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
      </LegalSection>

      <LegalSection title="Hosting provider">
        <p>
          Vercel Inc. (United States) —{" "}
          <a href="https://vercel.com/legal" target="_blank" rel="noopener noreferrer">
            vercel.com/legal
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Domain">
        <p>The website's permanent domain is: miepitettuk.hu.</p>
      </LegalSection>

      <LegalSection title="Legal notice">
        <p>
          The content on this website is provided for informational purposes
          only and does not constitute a contractual offer. Details of the
          projects shown as case studies can be found in the{" "}
          <Link href={`/${lang}/#referenciak`}>Case Studies</Link> section.
        </p>
      </LegalSection>
    </>
  );
}
