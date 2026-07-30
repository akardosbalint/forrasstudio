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
  booking_confirmation_client: {
    subject: "Foglalás visszaigazolva — {{startsAtFormatted}}",
    bodyHtml:
      "<p>Kedves {{leadName}}!</p>" +
      "<p>Visszaigazoljuk a discovery call időpontját: <strong>{{startsAtFormatted}}</strong> (90 perc), {{repName}} kollégánkkal.</p>" +
      "<p>A naptármeghívót csatoltuk ehhez az emailhez.</p>" +
      '<p>Ha át kell ütemezned vagy le kell mondanod, kattints ide: <a href="{{manageLink}}">{{manageLink}}</a></p>' +
      "<p>Üdvözlettel,<br />KBCo Stúdió</p>",
    bodyText:
      "Kedves {{leadName}}!\n\n" +
      "Visszaigazoljuk a discovery call időpontját: {{startsAtFormatted}} (90 perc), {{repName}} kollégánkkal.\n\n" +
      "A naptármeghívót csatoltuk ehhez az emailhez.\n\n" +
      "Ha át kell ütemezned vagy le kell mondanod: {{manageLink}}\n\n" +
      "Üdvözlettel,\nKBCo Stúdió",
  },
  booking_confirmation_rep: {
    subject: "Új discovery call — {{startsAtFormatted}} ({{leadName}})",
    bodyHtml:
      "<p>Új discovery call került lefoglalásra:</p>" +
      "<p><strong>{{leadName}}</strong> — {{startsAtFormatted}} (90 perc)</p>" +
      "<p>A naptármeghívót csatoltuk ehhez az emailhez.</p>",
    bodyText:
      "Új discovery call került lefoglalásra:\n\n" +
      "{{leadName}} — {{startsAtFormatted}} (90 perc)\n\n" +
      "A naptármeghívót csatoltuk ehhez az emailhez.",
  },
  booking_reminder: {
    subject: "Emlékeztető — discovery call {{hoursLabel}} múlva",
    bodyHtml:
      "<p>Kedves {{leadName}}!</p>" +
      "<p>Emlékeztetünk, hogy a discovery call időpontod {{hoursLabel}} múlva kezdődik: <strong>{{startsAtFormatted}}</strong>, {{repName}} kollégánkkal.</p>" +
      '<p>Átütemezés vagy lemondás: <a href="{{manageLink}}">{{manageLink}}</a></p>',
    bodyText:
      "Kedves {{leadName}}!\n\n" +
      "Emlékeztetünk, hogy a discovery call időpontod {{hoursLabel}} múlva kezdődik: {{startsAtFormatted}}, {{repName}} kollégánkkal.\n\n" +
      "Átütemezés vagy lemondás: {{manageLink}}",
  },
  booking_cancelled: {
    subject: "Discovery call lemondva — {{startsAtFormatted}}",
    bodyHtml:
      "<p>A(z) {{startsAtFormatted}} időpontra foglalt discovery call lemondásra került.</p>" +
      '<p>Új időpont foglalásához: <a href="{{manageLink}}">{{manageLink}}</a></p>',
    bodyText:
      "A(z) {{startsAtFormatted}} időpontra foglalt discovery call lemondásra került.\n\n" +
      "Új időpont foglalásához: {{manageLink}}",
  },
  questionnaire_submitted: {
    subject: "Köszönjük a kitöltést — foglald le a discovery call-t",
    bodyHtml:
      "<p>Kedves {{leadName}}!</p>" +
      "<p>Köszönjük, hogy kitöltötted a kérdőívet. A következő lépés egy 90 perces discovery call lefoglalása, amit az alábbi linken tehetsz meg:</p>" +
      '<p><a href="{{bookingLink}}">{{bookingLink}}</a></p>' +
      "<p>Üdvözlettel,<br />KBCo Stúdió</p>",
    bodyText:
      "Kedves {{leadName}}!\n\n" +
      "Köszönjük, hogy kitöltötted a kérdőívet. A következő lépés egy 90 perces discovery call lefoglalása, amit az alábbi linken tehetsz meg:\n" +
      "{{bookingLink}}\n\n" +
      "Üdvözlettel,\nKBCo Stúdió",
  },
};
