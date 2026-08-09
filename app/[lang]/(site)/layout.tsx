import { MotionConfig } from "framer-motion";
import { notFound } from "next/navigation";
import { CookieConsent } from "@/components/CookieConsent";
import { SmoothScroll } from "@/components/SmoothScroll";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/dictionaries";

// A marketing oldal (landing + jogi oldalak) saját layoutja: ide tartozik a
// süti-sáv, a smooth scroll és a mozgás-konfiguráció. A CRM (app/crm) ezt
// szándékosan nem örökli — ott adattáblák és formok vannak, nem kell
// scroll-jacking vagy süti-tájékoztató.
export default async function SiteLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <MotionConfig reducedMotion="user">
      {children}
      <CookieConsent lang={lang} dict={dict.site.cookieConsent} />
      <SmoothScroll />
    </MotionConfig>
  );
}
