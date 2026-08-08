// English dictionary for the public, token-based flow (booking + questionnaire).
// See dictionaries/flows/hu.ts — the key structure must stay identical.
export const flows = {
  booking: {
    invalidLink: {
      heading: "Invalid link",
    },
    questionnaireRequired: {
      heading: "Please fill out the questionnaire first",
      body: "Booking a time slot is only available after the questionnaire has been submitted.",
      cta: "Fill out the questionnaire",
    },
    unavailable: {
      heading: "Booking is currently unavailable",
      body: "No team member has been assigned to this lead yet — we'll be in touch shortly.",
    },
    scheduled: {
      heading: "Discovery call scheduled",
    },
    noActiveTask: {
      heading: "No active booking to manage",
      body: "If you have any questions, please reach out to your contact.",
    },
    heading: "Book a discovery call",
    greeting: (leadName: string, repName: string) =>
      `Hi ${leadName}! Choose a 90-minute time slot with ${repName}.`,
    slotPicker: {
      empty: "No time slots are currently available — please reach out to your contact.",
      confirmBooking: "Book this time slot",
      confirmReschedule: "Confirm reschedule",
      submitting: "Booking...",
    },
    controls: {
      reschedule: "Reschedule",
      cancel: "Cancel",
      cancelling: "Cancelling...",
      dismiss: "Dismiss",
    },
    errors: {
      LEAD_NOT_FOUND: "This lead could not be found.",
      NO_OWNER:
        "No team member has been assigned to this lead yet — we'll be in touch shortly.",
      WRONG_STAGE: "A discovery call cannot currently be booked for this link.",
      MISSING_QUESTIONNAIRE: "Please fill out the questionnaire first, then book a time slot.",
      SLOT_UNAVAILABLE:
        "This time slot is no longer available (booked, expired, or no longer valid). Please choose another one.",
      MISSING_STAGE: "The system is temporarily unavailable. Please try again later.",
      SLOT_TAKEN_RACE: "Someone else just booked this time slot. Please choose another one.",
      BOOKING_NOT_FOUND: "This booking could not be found.",
      BOOKING_NOT_ACTIVE: "This booking is no longer active.",
      INVALID_LINK: "Invalid link.",
      LINK_MISMATCH: "This booking does not belong to this link.",
      UNKNOWN: "An unknown error occurred. Please try again.",
    },
  },
  questionnaire: {
    invalidLink: {
      heading: "Invalid link",
      body: "This questionnaire link does not exist. If you believe this is an error, please contact us.",
    },
    alreadySubmitted: {
      heading: "You've already submitted this questionnaire",
      body: "The booking link was emailed to you after submission.",
    },
    expired: {
      heading: "This link has expired",
      body: "Please contact us to receive a new link.",
    },
    heading: "System design questionnaire",
    greeting: (leadName: string) =>
      `Hi ${leadName}! To prepare for the discovery call, please answer the questions below.`,
    booleanYes: "Yes",
    selectPlaceholder: "Choose...",
    success: {
      heading: "Thank you for your submission!",
      body: "You'll receive an email shortly with a link to book your 90-minute discovery call.",
    },
    submit: "Submit questionnaire",
    submitting: "Submitting...",
    errors: {
      MISSING_TOKEN: "Missing token.",
      INVALID_LINK: "Invalid link.",
      EXPIRED: "This link has expired.",
      ALREADY_SUBMITTED: "You've already submitted this questionnaire.",
      MISSING_STAGE: "The system is not fully set up (missing pipeline stage).",
      LEAD_NOT_FOUND: "This lead could not be found.",
      STAGE_MISMATCH:
        "This questionnaire link is no longer valid — the lead's status has changed since. If you have any questions, please contact us.",
      UNKNOWN: "An unknown error occurred during submission. Please try again.",
    },
    validation: {
      required: (label: string) => `"${label}" is required.`,
      invalidOption: (label: string) => `Invalid answer: "${label}".`,
      mustBeNumber: (label: string) => `"${label}" must be a number.`,
    },
  },
} as const;
