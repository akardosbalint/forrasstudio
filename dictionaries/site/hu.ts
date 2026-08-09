export const site = {
  nav: {
    ariaLabel: "Fő navigáció",
    links: [
      { href: "#szolgaltatasok", label: "Szolgáltatások" },
      { href: "#referenciak", label: "Referenciák" },
      { href: "#csapat", label: "Csapat" },
    ],
    cta: "Visszahívást kérek",
  },

  hero: {
    eyebrow:
      "Webalkalmazás-fejlesztés, közösségi platformok és AI-alapú automatizáció",
    headline: "A vállalkozásod teljes digitális rendszere — ",
    headlineHighlight: "megtervezve, megépítve, üzemeltetve.",
    body:
      "A FlowCore egyedi digitális rendszereket tervez, épít és üzemeltet vállalkozásoknak és közösségeknek — az időpontfoglalástól a fizetésen és az ügyfél-CRM-en át a zárt, tagi közösségi felületekig és a hírlevél-automatizációval támogatott tartalmi oldalakig, kiegészítve AI-alapú funkciókkal (pl. intelligens indexelés, automatizált emlékeztetők). Egy kézből, egymással összehangolva.",
    formIntro:
      "Kérj visszahívást — 2 mező, egy munkanapon belül jelentkezünk.",
  },

  trustBar: {
    label: "Ezeket a rendszereket mi építettük és üzemeltetjük",
    references: [
      { name: "ECO Portal", domain: "portal.ecokozosseg.hu", href: "https://portal.ecokozosseg.hu" },
      { name: "ECO Weboldal", domain: "ecokozosseg.hu", href: "https://ecokozosseg.hu" },
      { name: "Ösvény App by eptestben.hu", domain: "eptestben.hu", href: "https://eptestben.hu" },
      { name: "Kardos Bálint Okoskonyhája", domain: "akardosbalint.hu", href: "https://akardosbalint.hu" },
    ],
  },

  services: {
    eyebrow: "Szolgáltatások",
    title: "Három pillér, egy rendszer",
    pillars: [
      {
        icon: "sales" as const,
        eyebrow: "1. pillér",
        title: "Webalkalmazás-fejlesztés",
        description:
          "Modern, típusbiztos webalkalmazások React/Next.js és TypeScript alapokon — időpontfoglalás, fizetési integráció és ügyfél-CRM, a vállalkozásod folyamataira szabva.",
      },
      {
        icon: "community" as const,
        eyebrow: "2. pillér",
        title: "Közösségi & tagsági platformok",
        description:
          "Zárt, jogosultságkezelt tagi felületek azoknak, akik saját közösséget vagy tagságot építenek — biztonságos beléptetéssel, szerepkör-alapú hozzáféréssel és tagsági szintekkel.",
      },
      {
        icon: "ai" as const,
        eyebrow: "3. pillér",
        title: "Automatizáció & AI",
        description:
          "Hírlevél- és e-mail-automatizáció, admin dashboardok, intelligens riportok és AI-alapú funkciók veszik le rólad az ismétlődő adminisztrációt — és jelzik, mikor van szükség rád személyesen.",
      },
    ],
    capabilities: [
      {
        icon: "system" as const,
        title: "Teljes rendszer egy kézből",
        description:
          "A weboldal, a foglalás, a fizetés, a CRM, a beléptetés és az automatizáció nem külön projektek, hanem egymással összehangolt modulok — egy csapat tervezi és köti össze mindet, nem több különálló szállító.",
      },
      {
        icon: "ops" as const,
        title: "Hosszú távú üzemeltetés & továbbfejlesztés",
        description:
          "Az élesítés nem a munka vége. A megépített rendszereket folyamatosan üzemeltetjük, karbantartjuk és fejlesztjük tovább — ez nálunk folyamatos felelősségvállalás, nem egyszeri leszállított munka.",
      },
    ],
  },

  process: {
    eyebrow: "Hogyan dolgozunk",
    title: "Négy lépés az egyeztetéstől az üzemeltetésig",
    steps: [
      {
        number: "01",
        title: "Egyeztetés",
        description:
          "Megismerjük a vállalkozásod vagy szervezeted működését: hogyan érnek el az ügyfeleid, hogyan fizetnek, és hol van most súrlódás.",
        icon: "talk" as const,
      },
      {
        number: "02",
        title: "Terv & ajánlat",
        description:
          "Összeállítjuk, mely modulok kellenek (foglalás, fizetés, CRM, beléptetés), és pontos, átlátható ajánlatot adunk.",
        icon: "plan" as const,
      },
      {
        number: "03",
        title: "Fejlesztés",
        description:
          "Megépítjük a rendszert — a modulok egymással összehangolva, a saját folyamataidra szabva.",
        icon: "build" as const,
      },
      {
        number: "04",
        title: "Élesítés & support",
        description:
          "Élesítjük a rendszert, majd folyamatosan üzemeltetjük, karbantartjuk és fejlesztjük — hosszú távon.",
        icon: "launch" as const,
      },
    ],
  },

  caseStudies: {
    eyebrow: "Referenciák",
    title: "Rendszerek, amiket megépítettünk és üzemeltetünk",
    pillarLabels: {
      sales: "Webalkalmazás-fejlesztés",
      community: "Közösségi & tagsági platform",
      content: "Tartalmi platform & automatizáció",
      both: "Webalkalmazás-fejlesztés + Közösségi platform",
      none: "Bemutatkozó weboldal",
    },
    items: [
      {
        name: "ECO Portal",
        domain: "portal.ecokozosseg.hu",
        href: "https://portal.ecokozosseg.hu",
        description:
          "Zárt közösségi platform: tagság, csoportok, receptek, képzések, szakértői értékelések és jelvényrendszer egy helyen.",
        pillar: "community" as const,
        modules: ["Jogosultságkezelés", "Tagi felület"],
      },
      {
        name: "ECO Weboldal",
        domain: "ecokozosseg.hu",
        href: "https://ecokozosseg.hu",
        description:
          "Statikus, gyors betöltésű bemutató oldal egy önismereti rendszer moduljainak és partnerközpontjainak bemutatására.",
        pillar: "none" as const,
        modules: ["Frontend / megjelenés"],
      },
      {
        name: "Ösvény App by eptestben.hu",
        domain: "eptestben.hu",
        href: "https://eptestben.hu",
        description:
          "Egészség-coaching alkalmazás időpontfoglalással, fizetési integrációval és kvíz-alapú felhasználói úttal.",
        pillar: "sales" as const,
        modules: ["Fizetési kapu integráció", "Felhasználókezelés"],
      },
      {
        name: "Kardos Bálint Okoskonyhája",
        domain: "akardosbalint.hu",
        href: "https://akardosbalint.hu",
        description:
          "Statikusan generált tartalmi oldal blog rovattal, hírlevél-automatizációval és tagsági közösséggel.",
        pillar: "content" as const,
        modules: ["Blog / MDX tartalomkezelés", "Hírlevél-automatizáció"],
      },
    ],
  },

  team: {
    eyebrow: "Csapat",
    title: "Mi vagyunk a FlowCore",
    intro:
      "Hárman vagyunk. Nincs közvetítő réteg — a projekt teljes ideje alatt közvetlenül velünk egyeztetsz.",
    portraitAltTemplate: "{name} portréja",
    members: [
      { name: "Kardos Bálint", role: "Alapító & vezető fejlesztő", photo: "/team/kardos-balint.jpg" },
      { name: "Kányási Soma", role: "Technológiai tanácsadó", photo: "/team/kanyasi-soma.jpg" },
      { name: "Csábi Eszter", role: "Minőségbiztosítási tanácsadó", photo: "/team/csabi-eszter.jpg" },
    ],
  },

  whyUs: {
    eyebrow: "Miért minket",
    title: "Ami minket megkülönböztet",
    reasons: [
      {
        title: "Modern technológiai stack, éles gyakorlatban bevizsgálva",
        description:
          "React, Next.js, Astro, Supabase, automatizáció és AI — olyan technológiák, amiket több iparágban, valós forgalmú rendszerekben teszteltünk, nem csak elméletben.",
      },
      {
        title: "Közvetlen kapcsolat a fejlesztőkkel",
        description:
          "Hárman vagyunk, nincs közvetítő réteg vagy projektmenedzser-lánc — közvetlenül azzal egyeztetsz, aki a rendszert építi.",
      },
      {
        title: "Felelősségvállalás az élesítés után is",
        description:
          "A rendszert nem felejtjük el a leszállítás után sem. Folyamatosan üzemeltetjük, karbantartjuk és fejlesztjük tovább, hosszú távon.",
      },
      {
        title: "Teljes rendszer, egy kézből",
        description:
          "A weboldal, a foglalás, a fizetés, a CRM, a beléptetés és az automatizáció egymással összehangolva készül — nem több különálló szállítótól összerakva.",
      },
    ],
  },

  finalCta: {
    eyebrow: "Kezdjük el",
    title: "Kérj visszahívást, és beszéljük át a rendszered",
    body:
      "Írd meg az elérhetőségeidet, mi visszahívunk, és átbeszéljük, milyen modulokra van szükséged — foglalás, fizetés, ügyfél-CRM vagy zárt közösségi felület.",
  },

  footer: {
    brand: "FlowCore",
    emailLabel: "Email:",
    socials: [
      {
        label: "Facebook [TODO: link]",
        href: "#",
        path: "M17.5 8.5h-2a1 1 0 0 0-1 1V12h3l-.4 3h-2.6v8h-3v-8H9.5v-3h1.9V9.2C11.4 6.9 12.9 5.5 15 5.5c.9 0 1.7.1 2 .1v2.9Z",
      },
      {
        label: "Instagram [TODO: link]",
        href: "#",
        path: "M8 4h11a4 4 0 0 1 4 4v11a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Zm5.5 4.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Zm0 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM18 7.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
      },
      {
        label: "LinkedIn [TODO: link]",
        href: "#",
        path: "M6.5 9h3.2v12H6.5V9Zm1.6-5a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8ZM13 9h3.1v1.6h.1c.4-.8 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5.1V21h-3.2v-6.4c0-1.5 0-3.5-2.1-3.5-2.2 0-2.5 1.7-2.5 3.4V21H13V9Z",
      },
    ],
    copyrightSuffix: "Minden jog fenntartva.",
    legalNavAriaLabel: "Jogi dokumentumok",
    legalLinks: [
      { label: "Adatkezelési tájékoztató", href: "/adatvedelem" },
      { label: "Sütikezelési tájékoztató", href: "/cookie-tajekoztato" },
      { label: "Impresszum", href: "/impresszum" },
    ],
  },

  callbackForm: {
    labels: {
      name: "Név",
      organization: "Cég / szervezet neve",
      phone: "Telefonszám",
      email: "Email",
      message: "Üzenet",
    },
    optionalLabel: "(opcionális)",
    placeholders: {
      name: "Teljes név",
      organization: "Cég vagy szervezet neve",
      phone: "+36 30 000 0000",
      email: "nev@cegnev.hu",
      message: "Mesélj pár szóban a vállalkozásodról, és miben segíthetünk.",
    },
    consent: {
      prefix: "Elfogadom az ",
      linkText: "adatkezelési tájékoztatót",
      suffix:
        ", és hozzájárulok, hogy a FlowCore a megadott adataimat a kapcsolatfelvétel céljából kezelje.",
    },
    submit: "Hívjatok vissza",
    submitting: "Küldés…",
    success: {
      title: "Köszönjük, hamarosan hívunk!",
      body: "Megkaptuk a kérésed, egy munkanapon belül jelentkezünk telefonon.",
    },
    errors: {
      INVALID_BODY: "Hibás kérés formátum. Kérjük, próbáld újra.",
      MISSING_FIELDS: "Kérjük, add meg a neved és telefonszámod.",
      CONSENT_REQUIRED: "Az adatkezelési tájékoztató elfogadása kötelező.",
      NOT_CONFIGURED:
        "A szolgáltatás jelenleg nem elérhető. Kérjük, próbáld újra később.",
      SAVE_FAILED: "Nem sikerült elküldeni a kérésed. Kérjük, próbáld újra.",
      NETWORK:
        "Nem sikerült elküldeni a kérésed. Ellenőrizd a kapcsolatot, és próbáld újra.",
      UNKNOWN: "Nem sikerült elküldeni a kérésed. Kérjük, próbáld újra.",
    },
  },

  cookieConsent: {
    ariaLabel: "Süti beállítások",
    text: {
      prefix:
        "Jelenleg nem használunk analitikai vagy marketing sütiket — csak a süti-preferenciádat mentjük el a böngésződben. Részletek a ",
      linkText: "Sütikezelési tájékoztatóban",
      suffix: ".",
    },
    rejectButton: "Csak a szükséges",
    acceptButton: "Mind elfogadom",
  },

  cookieSettingsButton: {
    label: "Süti beállítások",
  },

  blueprintDiagram: {
    ariaLabel:
      "Rendszerdiagram: időpontfoglalás, fizetés, ügyfél-CRM, biztonságos beléptetés és AI-alapú automatizáció egy közös rendszerbe, 'A te forrásod'-ba folynak össze.",
    modules: [
      { label: "Időpontfoglalás", y: 50, color: "var(--color-spring)" },
      { label: "Fizetés", y: 145, color: "var(--color-brook)" },
      { label: "Ügyfél-CRM", y: 240, color: "var(--color-spring)" },
      { label: "Biztonságos beléptetés", y: 335, color: "var(--color-brook)" },
      { label: "AI-alapú automatizáció", y: 430, color: "var(--color-spring)" },
    ],
    centerLine1: "A te",
    centerLine2: "forrásod",
  },

  legalPageShell: {
    updatedLabel: "Utolsó frissítés",
  },

  legal: {
    eyebrow: "Jogi dokumentum",
    updatedDate: "2026. július 1.",
    privacy: {
      metaTitle: "Adatkezelési tájékoztató — FlowCore",
      metaDescription:
        "A FlowCore adatkezelési tájékoztatója a weboldalon leadott visszahívás-kérésekkel kapcsolatban.",
      pageTitle: "Adatkezelési tájékoztató",
    },
    cookies: {
      metaTitle: "Sütikezelési tájékoztató — FlowCore",
      metaDescription: "A FlowCore weboldalán használt sütik és hasonló technológiák.",
      pageTitle: "Sütikezelési tájékoztató",
    },
    imprint: {
      metaTitle: "Impresszum — FlowCore",
      metaDescription: "A FlowCore weboldal üzemeltetőjének adatai.",
      pageTitle: "Impresszum",
    },
  },
} as const;
