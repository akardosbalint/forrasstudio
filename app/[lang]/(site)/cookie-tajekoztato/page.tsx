import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/dictionaries";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  hu: {
    title: "Sütikezelési tájékoztató — MI Építettük",
    description: "A MI Építettük weboldalán használt sütik és hasonló technológiák.",
  },
  en: {
    title: "Cookie Policy — MI Építettük",
    description: "The cookies and similar technologies used on the MI Építettük website.",
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
  hu: { title: "Sütikezelési tájékoztató", updated: "2026. július 1." },
  en: { title: "Cookie Policy", updated: "July 1, 2026" },
};

export default async function CookieTajekoztatoPage({
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
      {lang === "hu" ? <CookieHu /> : <CookieEn />}
    </LegalPageShell>
  );
}

function CookieHu() {
  return (
    <>
      <LegalSection title="1. Mi az a süti (cookie)">
        <p>
          A sütik olyan kis szövegfájlok, amelyeket a böngésződ ment el a
          meglátogatott weboldalak beállításai alapján. Ez a tájékoztató a
          MI Építettük weboldalán használt sütikről és hasonló technológiákról
          (pl. a böngésző helyi tárolójáról, localStorage) szól.
        </p>
      </LegalSection>

      <LegalSection title="2. Milyen sütiket használunk jelenleg">
        <p>
          A MI Építettük weboldala jelenleg <strong>nem használ analitikai,
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
          <a href="/hu/adatvedelem">Adatkezelési tájékoztatóban</a> olvashatsz.
        </p>
      </LegalSection>
    </>
  );
}

function CookieEn() {
  return (
    <>
      <LegalSection title="1. What is a cookie">
        <p>
          Cookies are small text files that your browser saves based on the
          settings of the websites you visit. This policy covers the cookies
          and similar technologies (e.g. your browser's local storage,
          localStorage) used on the MI Építettük website.
        </p>
      </LegalSection>

      <LegalSection title="2. Which cookies we currently use">
        <p>
          The MI Építettük website currently <strong>does not use analytics,
          marketing, or advertising cookies</strong>.
        </p>
        <p>
          We save a single technical entry in your browser's local storage
          (localStorage): whether you accepted or rejected the cookie
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
          name, purpose, and duration of each cookie.
        </p>
      </LegalSection>

      <LegalSection title="4. Changing your consent">
        <p>
          You can change your previously given cookie preference at any time
          by clicking the “Cookie settings” link in the footer at the bottom
          of the page, or through your browser's own cookie/storage
          settings.
        </p>
      </LegalSection>

      <LegalSection title="Related document">
        <p>
          For information about the processing of data submitted through
          callback requests on the website, see the{" "}
          <a href="/en/adatvedelem">Privacy Policy</a>.
        </p>
      </LegalSection>
    </>
  );
}
