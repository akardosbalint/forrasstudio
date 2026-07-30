// Beépített alapértelmezés minden email sablon kulcshoz, arra az esetre,
// ha az admin még nem szerkesztette (vagy törölte) az adatbázisban lévő
// sort — így a rendszer sablon-konfiguráció nélkül is működik, de admin
// felülről (Phase 6) bármikor felülírható. {{változó}} helyek:
// lib/email/render.ts.
export const FALLBACK_EMAIL_TEMPLATES: Record<
  string,
  { subject: string; bodyHtml: string; bodyText: string }
> = {
  questionnaire_invite: {
    subject: "KBCo Stúdió — rendszertervezési kérdőív",
    bodyHtml:
      "<p>Kedves {{leadName}}!</p>" +
      "<p>Köszönjük a megkeresést. A discovery call előkészítéséhez kérjük, töltsd ki rövid rendszertervezési kérdőívünket az alábbi linken:</p>" +
      '<p><a href="{{link}}">{{link}}</a></p>' +
      "<p>A link {{expiresInDays}} napig érvényes.</p>" +
      "<p>Üdvözlettel,<br />KBCo Stúdió</p>",
    bodyText:
      "Kedves {{leadName}}!\n\n" +
      "Köszönjük a megkeresést. A discovery call előkészítéséhez kérjük, töltsd ki rövid rendszertervezési kérdőívünket az alábbi linken:\n" +
      "{{link}}\n\n" +
      "A link {{expiresInDays}} napig érvényes.\n\n" +
      "Üdvözlettel,\nKBCo Stúdió",
  },
};
