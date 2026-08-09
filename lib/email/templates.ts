import { prisma } from "@/lib/prisma";
import { renderEmailString, escapeHtml } from "@/lib/email/render";
import { FALLBACK_EMAIL_TEMPLATES } from "@/lib/email/fallbackTemplates";
import type { Locale } from "@/lib/i18n/config";

export async function renderEmailTemplate(
  key: string,
  locale: Locale,
  variables: Record<string, string>,
): Promise<{ subject: string; html: string; text: string }> {
  const dbTemplate = await prisma.emailTemplate.findUnique({
    where: { key_locale: { key, locale } },
  });
  // Belső, csak-hu sablonok (pl. "booking_confirmation_rep") esetén a hu
  // fallback-re esünk vissza akkor is, ha `locale` "en" — ezeknek a
  // kulcsoknak szándékosan nincs angol változata.
  const fallback =
    FALLBACK_EMAIL_TEMPLATES[locale]?.[key] ?? FALLBACK_EMAIL_TEMPLATES.hu[key];
  const source = dbTemplate ?? fallback;

  if (!source) {
    throw new Error(`[email] Nincs sablon ehhez a kulcshoz: "${key}" (${locale}).`);
  }

  const htmlVariables = Object.fromEntries(
    Object.entries(variables).map(([k, v]) => [k, escapeHtml(v)]),
  );

  return {
    subject: renderEmailString(source.subject, variables),
    html: renderEmailString(
      "bodyHtml" in source ? source.bodyHtml : "",
      htmlVariables,
    ),
    text: renderEmailString(
      "bodyText" in source ? source.bodyText : "",
      variables,
    ),
  };
}
