import type { Locale } from "@/lib/i18n/config";

// Beépített alapértelmezés minden email sablon kulcshoz, arra az esetre,
// ha az admin még nem szerkesztette (vagy törölte) az adatbázisban lévő
// sort — így a rendszer sablon-konfiguráció nélkül is működik, de admin
// felülről (Phase 6) bármikor felülírható. {{változó}} helyek:
// lib/email/render.ts.
//
// Nyelvenként külön szótár: az ügyfélnek kimenő 5 sablon (mindegyik, kivéve
// a "booking_confirmation_rep" belső sales rep értesítést) hu és en
// változatban is szerepel — lásd lib/email/templates.ts
// renderEmailTemplate(key, locale, ...). A CRM admin felület (app/crm)
// szándékosan csak a hu sablonokat szerkeszti.
type EmailTemplateContent = {
  subject: string;
  bodyHtml: string;
  bodyText: string;
};

export const FALLBACK_EMAIL_TEMPLATES: Record<
  Locale,
  Record<string, EmailTemplateContent>
> = {
  hu: {
    questionnaire_invite: {
      subject: "FlowCore — rendszertervezési kérdőív",
      bodyHtml:
        "<p>Kedves {{leadName}}!</p>" +
        "<p>Köszönjük a megkeresést. A discovery call előkészítéséhez kérjük, töltsd ki rövid rendszertervezési kérdőívünket az alábbi linken:</p>" +
        '<p><a href="{{link}}">{{link}}</a></p>' +
        "<p>A link {{expiresInDays}} napig érvényes.</p>" +
        "<p>Üdvözlettel,<br />FlowCore</p>",
      bodyText:
        "Kedves {{leadName}}!\n\n" +
        "Köszönjük a megkeresést. A discovery call előkészítéséhez kérjük, töltsd ki rövid rendszertervezési kérdőívünket az alábbi linken:\n" +
        "{{link}}\n\n" +
        "A link {{expiresInDays}} napig érvényes.\n\n" +
        "Üdvözlettel,\nFlowCore",
    },
    booking_confirmation_client: {
      subject: "Foglalás visszaigazolva — {{startsAtFormatted}}",
      bodyHtml:
        "<p>Kedves {{leadName}}!</p>" +
        "<p>Visszaigazoljuk a discovery call időpontját: <strong>{{startsAtFormatted}}</strong> (90 perc), {{repName}} kollégánkkal.</p>" +
        "<p>A naptármeghívót csatoltuk ehhez az emailhez.</p>" +
        '<p>Ha át kell ütemezned vagy le kell mondanod, kattints ide: <a href="{{manageLink}}">{{manageLink}}</a></p>' +
        "<p>Üdvözlettel,<br />FlowCore</p>",
      bodyText:
        "Kedves {{leadName}}!\n\n" +
        "Visszaigazoljuk a discovery call időpontját: {{startsAtFormatted}} (90 perc), {{repName}} kollégánkkal.\n\n" +
        "A naptármeghívót csatoltuk ehhez az emailhez.\n\n" +
        "Ha át kell ütemezned vagy le kell mondanod: {{manageLink}}\n\n" +
        "Üdvözlettel,\nFlowCore",
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
        "<p>Üdvözlettel,<br />FlowCore</p>",
      bodyText:
        "Kedves {{leadName}}!\n\n" +
        "Köszönjük, hogy kitöltötted a kérdőívet. A következő lépés egy 90 perces discovery call lefoglalása, amit az alábbi linken tehetsz meg:\n" +
        "{{bookingLink}}\n\n" +
        "Üdvözlettel,\nFlowCore",
    },
  },
  en: {
    questionnaire_invite: {
      subject: "FlowCore — system design questionnaire",
      bodyHtml:
        "<p>Dear {{leadName}},</p>" +
        "<p>Thank you for reaching out. To prepare for the discovery call, please fill out our short system design questionnaire at the link below:</p>" +
        '<p><a href="{{link}}">{{link}}</a></p>' +
        "<p>This link is valid for {{expiresInDays}} days.</p>" +
        "<p>Best regards,<br />FlowCore</p>",
      bodyText:
        "Dear {{leadName}},\n\n" +
        "Thank you for reaching out. To prepare for the discovery call, please fill out our short system design questionnaire at the link below:\n" +
        "{{link}}\n\n" +
        "This link is valid for {{expiresInDays}} days.\n\n" +
        "Best regards,\nFlowCore",
    },
    booking_confirmation_client: {
      subject: "Booking confirmed — {{startsAtFormatted}}",
      bodyHtml:
        "<p>Dear {{leadName}},</p>" +
        "<p>We're confirming your discovery call: <strong>{{startsAtFormatted}}</strong> (90 minutes) with {{repName}}.</p>" +
        "<p>A calendar invite is attached to this email.</p>" +
        '<p>Need to reschedule or cancel? Click here: <a href="{{manageLink}}">{{manageLink}}</a></p>' +
        "<p>Best regards,<br />FlowCore</p>",
      bodyText:
        "Dear {{leadName}},\n\n" +
        "We're confirming your discovery call: {{startsAtFormatted}} (90 minutes) with {{repName}}.\n\n" +
        "A calendar invite is attached to this email.\n\n" +
        "Need to reschedule or cancel: {{manageLink}}\n\n" +
        "Best regards,\nFlowCore",
    },
    booking_reminder: {
      subject: "Reminder — discovery call in {{hoursLabel}}",
      bodyHtml:
        "<p>Dear {{leadName}},</p>" +
        "<p>Just a reminder that your discovery call starts in {{hoursLabel}}: <strong>{{startsAtFormatted}}</strong>, with {{repName}}.</p>" +
        '<p>Reschedule or cancel: <a href="{{manageLink}}">{{manageLink}}</a></p>',
      bodyText:
        "Dear {{leadName}},\n\n" +
        "Just a reminder that your discovery call starts in {{hoursLabel}}: {{startsAtFormatted}}, with {{repName}}.\n\n" +
        "Reschedule or cancel: {{manageLink}}",
    },
    booking_cancelled: {
      subject: "Discovery call cancelled — {{startsAtFormatted}}",
      bodyHtml:
        "<p>The discovery call booked for {{startsAtFormatted}} has been cancelled.</p>" +
        '<p>To book a new time: <a href="{{manageLink}}">{{manageLink}}</a></p>',
      bodyText:
        "The discovery call booked for {{startsAtFormatted}} has been cancelled.\n\n" +
        "To book a new time: {{manageLink}}",
    },
    questionnaire_submitted: {
      subject: "Thanks for completing it — book your discovery call",
      bodyHtml:
        "<p>Dear {{leadName}},</p>" +
        "<p>Thank you for completing the questionnaire. The next step is to book a 90-minute discovery call, which you can do at the link below:</p>" +
        '<p><a href="{{bookingLink}}">{{bookingLink}}</a></p>' +
        "<p>Best regards,<br />FlowCore</p>",
      bodyText:
        "Dear {{leadName}},\n\n" +
        "Thank you for completing the questionnaire. The next step is to book a 90-minute discovery call, which you can do at the link below:\n" +
        "{{bookingLink}}\n\n" +
        "Best regards,\nFlowCore",
    },
  },
};
