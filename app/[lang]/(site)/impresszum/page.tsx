import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return {
    title: dict.site.legal.imprint.metaTitle,
    description: dict.site.legal.imprint.metaDescription,
  };
}

function ContentHu({ lang }: { lang: Locale }) {
  return (
    <>
      <LegalSection title="Szolgáltató adatai">
        <ul>
          <li>Márkanév: FlowCore</li>
          <li>Szolgáltató neve: FlowCore Technologies Kft.</li>
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
          A weboldal végleges domainje: flowcore.hu.
        </p>
      </LegalSection>

      <LegalSection title="Jogi nyilatkozat">
        <p>
          A weboldalon található tartalmak tájékoztató jellegűek, nem
          minősülnek szerződéses ajánlattételnek. A referenciaként bemutatott
          projektek adatait lásd a{" "}
          <Link href={`/${lang}#referenciak`}>Referenciák</Link> szekcióban.
        </p>
      </LegalSection>
    </>
  );
}

function ContentEn({ lang }: { lang: Locale }) {
  return (
    <>
      <LegalSection title="Provider details">
        <ul>
          <li>Brand name: FlowCore</li>
          <li>Provider name: FlowCore Technologies Kft.</li>
          <li>Registered address: 1027 Budapest, Bem József utca 6. fsz. 3., Hungary</li>
          <li>Company registration number: <span className="font-mono text-sm">[TODO: cégjegyzékszám]</span></li>
          <li>Tax number: <span className="font-mono text-sm">[TODO: adószám]</span></li>
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
        <p>
          The website&apos;s final domain will be flowcore.hu.
        </p>
      </LegalSection>

      <LegalSection title="Legal notice">
        <p>
          The content on this website is provided for informational purposes
          only and does not constitute a contractual offer. Details of the
          projects shown as case studies can be found in the{" "}
          <Link href={`/${lang}#referenciak`}>Case studies</Link> section.
        </p>
      </LegalSection>
    </>
  );
}

export default async function ImpresszumPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <LegalPageShell
      lang={lang}
      dict={dict}
      eyebrow={dict.site.legal.eyebrow}
      title={dict.site.legal.imprint.pageTitle}
      updatedDate={dict.site.legal.updatedDate}
    >
      {lang === "hu" ? <ContentHu lang={lang} /> : <ContentEn lang={lang} />}
    </LegalPageShell>
  );
}
