import type { Metadata } from "next";
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
    title: dict.site.legal.cookies.metaTitle,
    description: dict.site.legal.cookies.metaDescription,
  };
}

function ContentHu({ lang }: { lang: Locale }) {
  return (
    <>
      <LegalSection title="1. Mi az a süti (cookie)">
        <p>
          A sütik olyan kis szövegfájlok, amelyeket a böngésződ ment el a
          meglátogatott weboldalak beállításai alapján. Ez a tájékoztató a
          FlowCore weboldalán használt sütikről és hasonló technológiákról
          (pl. a böngésző helyi tárolójáról, localStorage) szól.
        </p>
      </LegalSection>

      <LegalSection title="2. Milyen sütiket használunk jelenleg">
        <p>
          A FlowCore weboldala jelenleg <strong>nem használ analitikai,
          marketing vagy hirdetési célú sütiket</strong>.
        </p>
        <p>
          A böngésződ helyi tárolójában (localStorage) egyetlen technikai
          bejegyzést mentünk el: azt, hogy elfogadtad vagy elutasítottad-e a
          süti-tájékoztatót. Ez a bejegyzés nem követ nyomon, nem azonosít
          személyesen, és nem osztunk meg belőle adatot harmadik féllel.
        </p>
      </LegalSection>

      <LegalSection title="3. Jövőbeli változások">
        <p>
          Ha a jövőben analitikai vagy marketing célú sütiket vezetnénk be
          (például a látogatottság mérésére), ezt csak az előzetes
          hozzájárulásod után tesszük, és ez a tájékoztató frissül az adott
          süti nevével, céljával és időtartamával.
        </p>
      </LegalSection>

      <LegalSection title="4. A hozzájárulásod módosítása">
        <p>
          A korábban megadott süti-preferenciádat bármikor módosíthatod az
          oldal alján, a lábléc &bdquo;Süti beállítások&rdquo; linkjére kattintva,
          vagy a böngésződ saját süti-/tárolóbeállításain keresztül.
        </p>
      </LegalSection>

      <LegalSection title="Kapcsolódó dokumentum">
        <p>
          A weboldalon leadott visszahívás-kérésekkel kapcsolatos
          adatkezelésről az{" "}
          <a href={`/${lang}/adatvedelem`}>Adatkezelési tájékoztatóban</a> olvashatsz.
        </p>
      </LegalSection>
    </>
  );
}

function ContentEn({ lang }: { lang: Locale }) {
  return (
    <>
      <LegalSection title="1. What is a cookie">
        <p>
          Cookies are small text files that your browser saves based on the
          settings of the websites you visit. This policy covers the cookies
          and similar technologies (e.g. your browser&apos;s local storage,
          localStorage) used on the FlowCore website.
        </p>
      </LegalSection>

      <LegalSection title="2. Which cookies we currently use">
        <p>
          The FlowCore website currently <strong>does not use analytics,
          marketing, or advertising cookies</strong>.
        </p>
        <p>
          We save a single technical entry in your browser&apos;s local storage
          (localStorage): whether you accepted or declined the cookie
          notice. This entry does not track you, does not personally
          identify you, and we do not share any data from it with third
          parties.
        </p>
      </LegalSection>

      <LegalSection title="3. Future changes">
        <p>
          If we introduce analytics or marketing cookies in the future (for
          example, to measure traffic), we will only do so after obtaining
          your prior consent, and this policy will be updated with the
          specific cookie&apos;s name, purpose, and duration.
        </p>
      </LegalSection>

      <LegalSection title="4. Changing your consent">
        <p>
          You can change your previously given cookie preference at any time
          by clicking the &ldquo;Cookie settings&rdquo; link in the footer at the
          bottom of the page, or through your browser&apos;s own cookie/storage
          settings.
        </p>
      </LegalSection>

      <LegalSection title="Related document">
        <p>
          You can read about the processing of data related to callback
          requests submitted on the website in the{" "}
          <a href={`/${lang}/adatvedelem`}>Privacy Policy</a>.
        </p>
      </LegalSection>
    </>
  );
}

export default async function CookieTajekoztatoPage({
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
      title={dict.site.legal.cookies.pageTitle}
      updatedDate={dict.site.legal.updatedDate}
    >
      {lang === "hu" ? <ContentHu lang={lang} /> : <ContentEn lang={lang} />}
    </LegalPageShell>
  );
}
