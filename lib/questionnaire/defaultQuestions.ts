// Alapértelmezett kérdéslista friss telepítéshez (prisma/seed.ts) — és
// referencia a meglévő adatbázis-sorok angol fordításának
// visszatöltéséhez (scripts/backfill-i18n.ts), `label` szerinti
// egyezés alapján.
export const DEFAULT_QUESTIONNAIRE_QUESTIONS = [
  {
    label: "Röviden foglald össze, mit szeretnétek megvalósítani.",
    labelEn: "Briefly summarize what you'd like to build.",
    type: "TEXTAREA" as const,
    required: true,
  },
  {
    label: "Milyen folyamatokat végeztek ma ezen a területen (ha van)?",
    helpText: "Pl. Excel, papír, meglévő szoftver, manuális egyeztetés stb.",
    labelEn: "What processes do you currently use in this area (if any)?",
    helpTextEn: "E.g. Excel, paper, existing software, manual coordination, etc.",
    type: "TEXTAREA" as const,
    required: true,
  },
  {
    label: "Hány fős a csapat, akik majd használják a rendszert?",
    labelEn: "How many people on the team will use the system?",
    type: "NUMBER" as const,
    required: true,
  },
  {
    label: "Milyen technikai környezetben dolgoztok jelenleg?",
    helpText: "Meglévő rendszerek, integrációk, amikhez kapcsolódnia kell.",
    labelEn: "What technical environment are you currently working in?",
    helpTextEn: "Existing systems and integrations it needs to connect to.",
    type: "TEXTAREA" as const,
    required: false,
  },
  {
    label: "Mi a legfontosabb üzleti cél, amit ezzel el szeretnétek érni?",
    labelEn: "What's the most important business goal you want to achieve with this?",
    type: "TEXTAREA" as const,
    required: true,
  },
  {
    label: "Milyen büdzsé-keretben gondolkodtok?",
    labelEn: "What budget range are you thinking of?",
    type: "SELECT" as const,
    options: [
      "1-3 millió Ft",
      "3-8 millió Ft",
      "8-15 millió Ft",
      "15+ millió Ft",
      "Még nincs meghatározva",
    ],
    optionsEn: [
      "1–3 million HUF",
      "3–8 million HUF",
      "8–15 million HUF",
      "15+ million HUF",
      "Not yet determined",
    ],
    required: true,
  },
  {
    label: "Mikorra szeretnétek élesbe állni?",
    labelEn: "When would you like to go live?",
    type: "SELECT" as const,
    options: [
      "Minél hamarabb",
      "1-3 hónapon belül",
      "3-6 hónapon belül",
      "Nincs konkrét határidő",
    ],
    optionsEn: [
      "As soon as possible",
      "Within 1-3 months",
      "Within 3-6 months",
      "No specific deadline",
    ],
    required: true,
  },
];
