// English counterpart of dictionaries/flows/hu.ts — structurally identical
// keys, natural/professional English copy for the public token-based
// booking/questionnaire flow.
export const flows = {
  booking: {
    invalidLink: {
      heading: "Invalid link",
    },
    questionnaireRequired: {
      heading: "Please fill out the questionnaire first",
      body: "Booking a time slot is only available after the questionnaire has been submitted.",
      linkText: "Fill out the questionnaire",
    },
    noOwner: {
      heading: "Booking is not currently available",
      body: "No one on our team has been assigned to you yet — we'll be in touch soon.",
    },
    activeBooking: {
      heading: "Discovery call booked",
    },
    noActiveTask: {
      heading: "No active booking task",
      body: "If you have any questions, please reach out to your contact.",
    },
    booking: {
      heading: "Book a discovery call",
      // {{leadName}} and {{repName}} are substituted at runtime.
      greeting:
        "Hi {{leadName}}! Choose a 90-minute time slot with our colleague {{repName}}.",
    },
    slotPicker: {
      empty: "No time slots are currently available — please reach out to your contact.",
      confirmBooking: "Book time slot",
      confirmReschedule: "Confirm reschedule",
      confirmPending: "Booking...",
    },
    controls: {
      reschedule: "Reschedule",
      cancel: "Cancel",
      cancelling: "Cancelling...",
      dismiss: "Never mind",
    },
    // Translations of the `BookingError`/unknown-error `code` shown to the
    // visitor (not the Hungarian, CRM-only `message` from
    // `lib/booking/actions-core.ts`).
    errors: {
      INVALID_LINK: "Invalid link.",
      LINK_MISMATCH: "This booking does not belong to this link.",
      LEAD_NOT_FOUND: "Lead not found.",
      NO_OWNER: "Booking is not currently available — we'll be in touch with you soon.",
      WRONG_STAGE: "There is no active booking task for this link right now.",
      MISSING_QUESTIONNAIRE: "Please fill out the questionnaire first.",
      SLOT_UNAVAILABLE: "This time slot is no longer available. Please choose another one.",
      MISSING_STAGE: "The system is currently unavailable. Please try again later.",
      SLOT_TAKEN_RACE:
        "This time slot was just booked by someone else. Please choose another one.",
      BOOKING_NOT_FOUND: "Booking not found.",
      BOOKING_NOT_ACTIVE: "This booking is no longer active.",
      UNKNOWN: "An unknown error occurred. Please try again.",
    },
  },
  questionnaire: {
    invalidLink: {
      heading: "Invalid link",
      body: "This questionnaire link does not exist. If you believe this is a mistake, please reach out to your contact.",
    },
    alreadySubmitted: {
      heading: "You've already submitted this questionnaire",
      body: "The booking link was emailed to you after submission.",
    },
    expiredLink: {
      heading: "This link has expired",
      body: "Please reach out to your contact for a new link.",
    },
    form: {
      heading: "System design questionnaire",
      // {{leadName}} is substituted at runtime.
      greeting:
        "Hi {{leadName}}! To help us prepare for the discovery call, please fill out the questions below.",
      booleanYes: "Yes",
      selectPlaceholder: "Choose...",
      submit: "Submit questionnaire",
      submitting: "Submitting...",
    },
    success: {
      heading: "Thank you for submitting!",
      body: "You'll receive an email shortly with a link to book your 90-minute discovery call.",
    },
    // Translations of the `QuestionnaireSubmitError`/unknown-error `code`.
    errors: {
      MISSING_TOKEN: "Missing token.",
      INVALID_LINK: "Invalid link.",
      LINK_EXPIRED: "This link has expired.",
      ALREADY_SUBMITTED: "You've already submitted this questionnaire.",
      MISSING_STAGE: "The system is not fully set up yet. Please try again later.",
      LEAD_NOT_FOUND: "Lead not found.",
      STAGE_CHANGED:
        "This questionnaire link is no longer current — the lead's status has changed in the meantime. If you have any questions, please reach out to your contact.",
      UNKNOWN: "An unknown error occurred while submitting. Please try again.",
    },
    // `lib/questionnaire/answers.ts` validation message templates.
    // {{label}} is substituted with the question's (already locale-appropriate) label.
    validation: {
      required: '"{{label}}" is required.',
      invalidAnswer: 'Invalid answer: "{{label}}".',
      mustBeNumber: '"{{label}}" must be a number.',
    },
  },
} as const;
