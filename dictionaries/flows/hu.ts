// A publikus, tokenes booking/kérdőív flow (app/[lang]/(public)/foglalas és
// app/[lang]/(public)/kerdoiv) szövegei. Az itt szereplő magyar szövegek a
// korábban közvetlenül a komponensekbe/action fájlokba írt, hardcode-olt
// magyar szöveg veszteségmentes kiemelései — tartalmuk szándékosan nem
// változott a kiemelés során.
export const flows = {
  booking: {
    invalidLink: {
      heading: "Érvénytelen link",
    },
    questionnaireRequired: {
      heading: "Előbb töltsd ki a kérdőívet",
      body: "Az időpontfoglalás csak a kérdőív beküldése után érhető el.",
      linkText: "Kérdőív kitöltése",
    },
    noOwner: {
      heading: "Foglalás jelenleg nem elérhető",
      body: "A leadhez még nincs hozzárendelt kollégánk — hamarosan felvesszük veled a kapcsolatot.",
    },
    activeBooking: {
      heading: "Discovery call lefoglalva",
    },
    noActiveTask: {
      heading: "Nincs aktív foglalási teendő",
      body: "Ha kérdésed van, keresd a kapcsolattartódat.",
    },
    booking: {
      heading: "Discovery call foglalása",
      // {{leadName}} és {{repName}} helyettesítendő futásidőben.
      greeting:
        "Kedves {{leadName}}! Válassz egy 90 perces időpontot {{repName}} kollégánkkal.",
    },
    slotPicker: {
      empty: "Jelenleg nincs elérhető időpont — keresd a kapcsolattartódat.",
      confirmBooking: "Időpont lefoglalása",
      confirmReschedule: "Átütemezés megerősítése",
      confirmPending: "Foglalás...",
    },
    controls: {
      reschedule: "Átütemezés",
      cancel: "Lemondás",
      cancelling: "Lemondás...",
      dismiss: "Mégsem",
    },
    // A `BookingError`/ismeretlen hiba `code`-ját fordítjuk le ezen a
    // szótáron keresztül — ezek a látogatónak megjelenő, publikus szövegek
    // (nem a `lib/booking/actions-core.ts`-beli, CRM-nek szánt `message`).
    errors: {
      INVALID_LINK: "Érvénytelen link.",
      LINK_MISMATCH: "Ez a foglalás nem ehhez a linkhez tartozik.",
      LEAD_NOT_FOUND: "A lead nem található.",
      NO_OWNER:
        "A foglalás jelenleg nem elérhető — hamarosan felvesszük veled a kapcsolatot.",
      WRONG_STAGE: "Ehhez a linkhez jelenleg nem tartozik aktív foglalási teendő.",
      MISSING_QUESTIONNAIRE: "Előbb töltsd ki a kérdőívet.",
      SLOT_UNAVAILABLE: "Ez az időpont már nem választható. Kérjük válassz másikat.",
      MISSING_STAGE: "A rendszer jelenleg nem elérhető. Kérjük próbáld újra később.",
      SLOT_TAKEN_RACE:
        "Ezt az időpontot közben valaki más lefoglalta. Kérjük válassz másikat.",
      BOOKING_NOT_FOUND: "A foglalás nem található.",
      BOOKING_NOT_ACTIVE: "Ez a foglalás már nem aktív.",
      UNKNOWN: "Ismeretlen hiba történt. Kérjük próbáld újra.",
    },
  },
  questionnaire: {
    invalidLink: {
      heading: "Érvénytelen link",
      body: "Ez a kérdőív-link nem létezik. Ha hibát találtál, keresd a kapcsolattartódat.",
    },
    alreadySubmitted: {
      heading: "Ezt a kérdőívet már kitöltötted",
      body: "A foglalási linket emailben küldtük ki a kitöltés után.",
    },
    expiredLink: {
      heading: "Ez a link már lejárt",
      body: "Keresd a kapcsolattartódat egy új link kiküldéséhez.",
    },
    form: {
      heading: "Rendszertervezési kérdőív",
      // {{leadName}} helyettesítendő futásidőben.
      greeting:
        "Kedves {{leadName}}! A discovery call előkészítéséhez kérjük, töltsd ki az alábbi kérdéseket.",
      booleanYes: "Igen",
      selectPlaceholder: "Válassz...",
      submit: "Kérdőív beküldése",
      submitting: "Küldés...",
    },
    success: {
      heading: "Köszönjük a kitöltést!",
      body: "Hamarosan emailben kapsz egy linket, amin lefoglalhatod a 90 perces discovery call időpontját.",
    },
    // A `QuestionnaireSubmitError`/ismeretlen hiba `code`-ját fordítjuk le
    // ezen a szótáron keresztül.
    errors: {
      MISSING_TOKEN: "Hiányzó token.",
      INVALID_LINK: "Érvénytelen link.",
      LINK_EXPIRED: "Ez a link már lejárt.",
      ALREADY_SUBMITTED: "Ezt a kérdőívet már kitöltötted.",
      MISSING_STAGE: "A rendszer nincs teljesen beüzemelve. Kérjük próbáld újra később.",
      LEAD_NOT_FOUND: "A lead nem található.",
      STAGE_CHANGED:
        "Ez a kérdőív-link már nem aktuális — a lead státusza időközben megváltozott. Ha kérdésed van, keresd a kapcsolattartódat.",
      UNKNOWN: "Ismeretlen hiba történt a beküldés során. Kérjük, próbáld újra.",
    },
    // A `lib/questionnaire/answers.ts` validációs hibaüzenet-sablonjai.
    // {{label}} helyettesítendő a kérdés (már a megfelelő nyelvű) címkéjével.
    validation: {
      required: '"{{label}}" megválaszolása kötelező.',
      invalidAnswer: 'Érvénytelen válasz: "{{label}}".',
      mustBeNumber: '"{{label}}" egy szám kell legyen.',
    },
  },
} as const;
