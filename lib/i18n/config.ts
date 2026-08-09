// A publikus front-end (marketing site, jogi oldalak, foglalás/kérdőív flow)
// támogatott nyelvei. A CRM (app/crm) szándékosan nincs ez alá a rendszer
// alá bevonva — az marad kizárólag magyar, saját root layouttal.
export const locales = ["hu", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "hu";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
