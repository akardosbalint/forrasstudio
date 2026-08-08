// Publikus, tokenes flow (foglalás + kérdőív) magyar szótára.
// Lásd: dictionaries/flows/en.ts — a két fájl kulcsstruktúrája azonos.
export const flows = {
  booking: {
    invalidLink: {
      heading: "Érvénytelen link",
    },
    questionnaireRequired: {
      heading: "Előbb töltsd ki a kérdőívet",
      body: "Az időpontfoglalás csak a kérdőív beküldése után érhető el.",
      cta: "Kérdőív kitöltése",
    },
    unavailable: {
      heading: "Foglalás jelenleg nem elérhető",
      body: "A leadhez még nincs hozzárendelt kollégánk — hamarosan felvesszük veled a kapcsolatot.",
    },
    scheduled: {
      heading: "Discovery call lefoglalva",
    },
    noActiveTask: {
      heading: "Nincs aktív foglalási teendő",
      body: "Ha kérdésed van, keresd a kapcsolattartódat.",
    },
    heading: "Discovery call foglalása",
    greeting: (leadName: string, repName: string) =>
      `Kedves ${leadName}! Válassz egy 90 perces időpontot ${repName} kollégánkkal.`,
    slotPicker: {
      empty: "Jelenleg nincs elérhető időpont — keresd a kapcsolattartódat.",
      confirmBooking: "Időpont lefoglalása",
      confirmReschedule: "Átütemezés megerősítése",
      submitting: "Foglalás...",
    },
    controls: {
      reschedule: "Átütemezés",
      cancel: "Lemondás",
      cancelling: "Lemondás...",
      dismiss: "Mégsem",
    },
    // A kódokat lásd: lib/booking/actions-core.ts `new BookingError(` hívásai,
    // plusz a foglalás-specifikus INVALID_LINK / LINK_MISMATCH / UNKNOWN,
    // amiket a helyi app/[lang]/(public)/foglalas/[token]/actions.ts dob.
    errors: {
      LEAD_NOT_FOUND: "A lead nem található.",
      NO_OWNER:
        "A leadhez még nincs hozzárendelt kollégánk — hamarosan felvesszük veled a kapcsolatot.",
      WRONG_STAGE: "Ehhez a linkhez jelenleg nem lehet discovery call-t foglalni.",
      MISSING_QUESTIONNAIRE: "Előbb töltsd ki a kérdőívet, utána foglalhatsz időpontot.",
      SLOT_UNAVAILABLE:
        "Ez az időpont már nem választható (foglalt, lejárt, vagy nem teljesíti a szabályokat). Kérjük válassz másikat.",
      MISSING_STAGE: "A rendszer jelenleg nem elérhető. Kérjük, próbáld újra később.",
      SLOT_TAKEN_RACE: "Ezt az időpontot közben valaki más lefoglalta. Kérjük válassz másikat.",
      BOOKING_NOT_FOUND: "A foglalás nem található.",
      BOOKING_NOT_ACTIVE: "Ez a foglalás már nem aktív.",
      INVALID_LINK: "Érvénytelen link.",
      LINK_MISMATCH: "Ez a foglalás nem ehhez a linkhez tartozik.",
      UNKNOWN: "Ismeretlen hiba történt. Kérjük, próbáld újra.",
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
    expired: {
      heading: "Ez a link már lejárt",
      body: "Keresd a kapcsolattartódat egy új link kiküldéséhez.",
    },
    heading: "Rendszertervezési kérdőív",
    greeting: (leadName: string) =>
      `Kedves ${leadName}! A discovery call előkészítéséhez kérjük, töltsd ki az alábbi kérdéseket.`,
    booleanYes: "Igen",
    selectPlaceholder: "Válassz...",
    success: {
      heading: "Köszönjük a kitöltést!",
      body: "Hamarosan emailben kapsz egy linket, amin lefoglalhatod a 90 perces discovery call időpontját.",
    },
    submit: "Kérdőív beküldése",
    submitting: "Küldés...",
    // Ez a flow nem BookingError-t dob — a saját kerdoiv/[token]/actions.ts
    // ezeket a kódokat használja belsőleg, hogy a lang alapján válasszon
    // szöveget (lásd a fájl elején lévő megjegyzést).
    errors: {
      MISSING_TOKEN: "Hiányzó token.",
      INVALID_LINK: "Érvénytelen link.",
      EXPIRED: "Ez a link már lejárt.",
      ALREADY_SUBMITTED: "Ezt a kérdőívet már kitöltötted.",
      MISSING_STAGE: "A rendszer nincs teljesen beüzemelve (hiányzó pipeline stádium).",
      LEAD_NOT_FOUND: "A lead nem található.",
      STAGE_MISMATCH:
        "Ez a kérdőív-link már nem aktuális — a lead státusza időközben megváltozott. Ha kérdésed van, keresd a kapcsolattartódat.",
      UNKNOWN: "Ismeretlen hiba történt a beküldés során. Kérjük, próbáld újra.",
    },
    validation: {
      required: (label: string) => `"${label}" megválaszolása kötelező.`,
      invalidOption: (label: string) => `Érvénytelen válasz: "${label}".`,
      mustBeNumber: (label: string) => `"${label}" egy szám kell legyen.`,
    },
  },
} as const;
