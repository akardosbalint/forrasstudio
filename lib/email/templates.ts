import { prisma } from "@/lib/prisma";
import { renderEmailString, escapeHtml } from "@/lib/email/render";
import { FALLBACK_EMAIL_TEMPLATES } from "@/lib/email/fallbackTemplates";

export async function renderEmailTemplate(
  key: string,
  variables: Record<string, string>,
): Promise<{ subject: string; html: string; text: string }> {
  const dbTemplate = await prisma.emailTemplate.findUnique({ where: { key } });
  const fallback = FALLBACK_EMAIL_TEMPLATES[key];
  const source = dbTemplate ?? fallback;

  if (!source) {
    throw new Error(`[email] Nincs sablon ehhez a kulcshoz: "${key}".`);
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
