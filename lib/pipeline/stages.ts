// Rendszer-stádiumok stabil kulcsai — ezekre a kódban (státuszgép,
// kérdőív-trigger, foglalási trigger) hivatkozunk, függetlenül attól, hogy
// az admin átnevezi-e a megjelenített címkét vagy bővíti a pipeline-t
// további (nem rendszer-) stádiumokkal.
export const SYSTEM_STAGE_KEYS = {
  CALLBACK_PENDING: "callback_pending",
  QUESTIONNAIRE_SENDING: "questionnaire_sending",
  BOOKING_PENDING: "booking_pending",
  CALL_SCHEDULED: "call_scheduled",
  WON: "won",
  LOST: "lost",
} as const;

export type SystemStageKey =
  (typeof SYSTEM_STAGE_KEYS)[keyof typeof SYSTEM_STAGE_KEYS];

// Alap pipeline — a spec 3. és a "javasolt további státuszok" pontja
// alapján. Admin ezt bővítheti/módosíthatja (lásd Phase 6 pipeline-
// szerkesztő), a rendszer-stádiumok (isSystem) törlése nem engedélyezett,
// mert kódból triggerelt logika kötődik hozzájuk.
export const DEFAULT_PIPELINE_STAGES = [
  {
    key: SYSTEM_STAGE_KEYS.CALLBACK_PENDING,
    label: "Visszahívásra vár",
    order: 1,
    color: "#f59e0b",
    isSystem: true,
    isTerminal: false,
  },
  {
    key: SYSTEM_STAGE_KEYS.QUESTIONNAIRE_SENDING,
    label: "Kérdőív kitöltés alatt",
    order: 2,
    color: "#3b82f6",
    isSystem: true,
    isTerminal: false,
  },
  {
    key: SYSTEM_STAGE_KEYS.BOOKING_PENDING,
    label: "Időpontfoglalásra vár",
    order: 3,
    color: "#8b5cf6",
    isSystem: true,
    isTerminal: false,
  },
  {
    key: SYSTEM_STAGE_KEYS.CALL_SCHEDULED,
    label: "Discovery call lefoglalva",
    order: 4,
    color: "#06b6d4",
    isSystem: true,
    isTerminal: false,
  },
  {
    key: "proposal_drafting",
    label: "Ajánlat készítés alatt",
    order: 5,
    color: "#14b8a6",
    isSystem: false,
    isTerminal: false,
  },
  {
    key: "proposal_meeting_pending",
    label: "Ajánlatbemutató meetingre vár",
    order: 6,
    color: "#0ea5e9",
    isSystem: false,
    isTerminal: false,
  },
  {
    key: SYSTEM_STAGE_KEYS.WON,
    label: "Nyert",
    order: 7,
    color: "#22c55e",
    isSystem: true,
    isTerminal: true,
  },
  {
    key: SYSTEM_STAGE_KEYS.LOST,
    label: "Elveszett",
    order: 8,
    color: "#ef4444",
    isSystem: true,
    isTerminal: true,
  },
] as const;
