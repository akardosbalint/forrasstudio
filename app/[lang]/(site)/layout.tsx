import { MotionConfig } from "framer-motion";
import { CookieConsent } from "@/components/CookieConsent";
import { SmoothScroll } from "@/components/SmoothScroll";

// A marketing oldal (landing + jogi oldalak) saját layoutja: ide tartozik a
// süti-sáv, a smooth scroll és a mozgás-konfiguráció. A CRM (app/crm) ezt
// szándékosan nem örökli — ott adattáblák és formok vannak, nem kell
// scroll-jacking vagy süti-tájékoztató.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <CookieConsent />
      <SmoothScroll />
    </MotionConfig>
  );
}
