import "server-only";
import type { Locale } from "@/lib/i18n/config";
import { common as commonHu } from "./common/hu";
import { common as commonEn } from "./common/en";
import { site as siteHu } from "./site/hu";
import { site as siteEn } from "./site/en";
import { flows as flowsHu } from "./flows/hu";
import { flows as flowsEn } from "./flows/en";

const dictionaries = {
  hu: { common: commonHu, site: siteHu, flows: flowsHu },
  en: { common: commonEn, site: siteEn, flows: flowsEn },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale];
}
