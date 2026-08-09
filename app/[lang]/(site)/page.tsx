import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { CaseStudies } from "@/components/CaseStudies";
import { Team } from "@/components/Team";
import { WhyUs } from "@/components/WhyUs";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Nav lang={lang} dict={dict.site.nav} langSwitcherLabels={dict.common.languageSwitcher} />
      <main className="flex-1">
        <Hero
          lang={lang}
          dict={dict.site.hero}
          diagramDict={dict.site.blueprintDiagram}
          formDict={dict.site.callbackForm}
        />
        <TrustBar dict={dict.site.trustBar} />
        <Services dict={dict.site.services} />
        <Process dict={dict.site.process} />
        <CaseStudies dict={dict.site.caseStudies} />
        <Team dict={dict.site.team} />
        <WhyUs dict={dict.site.whyUs} />
        <FinalCTA lang={lang} dict={dict.site.finalCta} formDict={dict.site.callbackForm} />
      </main>
      <Footer
        lang={lang}
        dict={dict.site.footer}
        cookieSettingsDict={dict.site.cookieSettingsButton}
        langSwitcherLabels={dict.common.languageSwitcher}
      />
    </>
  );
}
