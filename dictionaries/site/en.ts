export const site = {
  nav: {
    ariaLabel: "Main navigation",
    links: [
      { href: "#szolgaltatasok", label: "Services" },
      { href: "#referenciak", label: "Case studies" },
      { href: "#csapat", label: "Team" },
    ],
    cta: "Request a callback",
  },

  hero: {
    eyebrow:
      "Web application development, community platforms, and AI-powered automation",
    headline: "The complete digital system for your business — ",
    headlineHighlight: "designed, built, and operated.",
    body:
      "FlowCore designs, builds, and operates custom digital systems for businesses and communities — from booking to payments and customer CRM, through closed, membership-only community platforms, to content sites backed by newsletter automation, all enhanced with AI-powered features (e.g. smart indexing, automated reminders). All from one hand, fully coordinated.",
    formIntro: "Request a callback — 2 fields, we'll be in touch within one business day.",
  },

  trustBar: {
    label: "Systems we've built and operate",
    references: [
      { name: "ECO Portal", domain: "portal.ecokozosseg.hu", href: "https://portal.ecokozosseg.hu" },
      { name: "ECO Weboldal", domain: "ecokozosseg.hu", href: "https://ecokozosseg.hu" },
      { name: "Ösvény App by eptestben.hu", domain: "eptestben.hu", href: "https://eptestben.hu" },
      { name: "Kardos Bálint Okoskonyhája", domain: "akardosbalint.hu", href: "https://akardosbalint.hu" },
    ],
  },

  services: {
    eyebrow: "Services",
    title: "Three pillars, one system",
    pillars: [
      {
        icon: "sales" as const,
        eyebrow: "Pillar 1",
        title: "Web application development",
        description:
          "Modern, type-safe web applications built on React/Next.js and TypeScript — booking, payment integration, and customer CRM, tailored to your business processes.",
      },
      {
        icon: "community" as const,
        eyebrow: "Pillar 2",
        title: "Community & membership platforms",
        description:
          "Closed, permission-managed member areas for anyone building their own community or membership — with secure access control, role-based permissions, and membership tiers.",
      },
      {
        icon: "ai" as const,
        eyebrow: "Pillar 3",
        title: "Automation & AI",
        description:
          "Newsletter and email automation, admin dashboards, intelligent reporting, and AI-powered features take repetitive admin work off your plate — and flag when your personal attention is needed.",
      },
    ],
    capabilities: [
      {
        icon: "system" as const,
        title: "One complete system, one hand",
        description:
          "The website, booking, payments, CRM, access control, and automation aren't separate projects — they're coordinated modules. One team designs and connects all of it, not several disparate vendors.",
      },
      {
        icon: "ops" as const,
        title: "Long-term operation & continued development",
        description:
          "Launch isn't the end of the work. We keep operating, maintaining, and further developing the systems we build — for us that's ongoing responsibility, not a one-off delivery.",
      },
    ],
  },

  process: {
    eyebrow: "How we work",
    title: "Four steps from consultation to ongoing operation",
    steps: [
      {
        number: "01",
        title: "Consultation",
        description:
          "We get to know how your business or organization runs: how your customers reach you, how they pay, and where the friction is right now.",
        icon: "talk" as const,
      },
      {
        number: "02",
        title: "Plan & proposal",
        description:
          "We map out which modules you need (booking, payments, CRM, access control), and give you a precise, transparent proposal.",
        icon: "plan" as const,
      },
      {
        number: "03",
        title: "Development",
        description:
          "We build the system — the modules coordinated with each other, tailored to your own processes.",
        icon: "build" as const,
      },
      {
        number: "04",
        title: "Launch & support",
        description:
          "We launch the system, then operate, maintain, and keep developing it — for the long haul.",
        icon: "launch" as const,
      },
    ],
  },

  caseStudies: {
    eyebrow: "Case studies",
    title: "Systems we've built and operate",
    readCaseStudy: "Read the case study",
    pillarLabels: {
      sales: "Web application development",
      community: "Community & membership platform",
      content: "Content platform & automation",
      both: "Web application development + Community platform",
      none: "Showcase website",
    },
    items: [
      {
        name: "ECO Portal",
        domain: "portal.ecokozosseg.hu",
        href: "https://portal.ecokozosseg.hu",
        caseStudyHref: "/esettanulmanyok/eco-portal",
        description:
          "Closed community platform: membership, groups, recipes, training courses, expert reviews, and a badge system, all in one place.",
        pillar: "community" as const,
        modules: ["Access control", "Member area"],
      },
      {
        name: "ECO Weboldal",
        domain: "ecokozosseg.hu",
        href: "https://ecokozosseg.hu",
        caseStudyHref: undefined as string | undefined,
        description:
          "Static, fast-loading showcase site presenting the modules and partner centers of a self-awareness system.",
        pillar: "none" as const,
        modules: ["Frontend / presentation"],
      },
      {
        name: "Ösvény App by eptestben.hu",
        domain: "eptestben.hu",
        href: "https://eptestben.hu",
        caseStudyHref: undefined as string | undefined,
        description:
          "Health-coaching application with booking, payment integration, and a quiz-based user journey.",
        pillar: "sales" as const,
        modules: ["Payment gateway integration", "User management"],
      },
      {
        name: "Kardos Bálint Okoskonyhája",
        domain: "akardosbalint.hu",
        href: "https://akardosbalint.hu",
        caseStudyHref: undefined as string | undefined,
        description:
          "Statically generated content site with a blog section, newsletter automation, and a membership community.",
        pillar: "content" as const,
        modules: ["Blog / MDX content management", "Newsletter automation"],
      },
    ],
  },

  team: {
    eyebrow: "Team",
    title: "We are FlowCore",
    intro:
      "There are three of us. No layer in between — you work directly with us for the entire project.",
    portraitAltTemplate: "Portrait of {name}",
    members: [
      { name: "Kardos Bálint", role: "Founder & lead developer", photo: "/team/kardos-balint.jpg" },
      { name: "Kányási Soma", role: "Technology advisor", photo: "/team/kanyasi-soma.jpg" },
      { name: "Csábi Eszter", role: "QA advisor", photo: "/team/csabi-eszter.jpg" },
    ],
  },

  whyUs: {
    eyebrow: "Why us",
    title: "What sets us apart",
    reasons: [
      {
        title: "A modern tech stack, proven in production",
        description:
          "React, Next.js, Astro, Supabase, automation, and AI — technologies we've tested across multiple industries in real, live-traffic systems, not just in theory.",
      },
      {
        title: "Direct contact with the developers",
        description:
          "There are three of us — no layer of middlemen or project-manager chain. You work directly with the person building the system.",
      },
      {
        title: "Accountability that continues after launch",
        description:
          "We don't forget about the system once it ships. We keep operating, maintaining, and further developing it, for the long term.",
      },
      {
        title: "One complete system, one hand",
        description:
          "The website, booking, payments, CRM, access control, and automation are built in coordination with each other — not stitched together from several separate vendors.",
      },
    ],
  },

  finalCta: {
    eyebrow: "Let's get started",
    title: "Request a callback, and let's talk through your system",
    body:
      "Leave your contact details, we'll call you back, and we'll talk through which modules you need — booking, payments, customer CRM, or a closed community platform.",
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
    copyrightSuffix: "All rights reserved.",
    legalNavAriaLabel: "Legal documents",
    legalLinks: [
      { label: "Privacy Policy", href: "/adatvedelem" },
      { label: "Cookie Policy", href: "/cookie-tajekoztato" },
      { label: "Imprint", href: "/impresszum" },
    ],
  },

  callbackForm: {
    labels: {
      name: "Name",
      organization: "Company / organization name",
      phone: "Phone number",
      email: "Email",
      message: "Message",
    },
    optionalLabel: "(optional)",
    placeholders: {
      name: "Full name",
      organization: "Company or organization name",
      phone: "+36 30 000 0000",
      email: "name@company.com",
      message: "Tell us a bit about your business and how we can help.",
    },
    consent: {
      prefix: "I accept the ",
      linkText: "privacy policy",
      suffix:
        ", and I consent to FlowCore processing the data I provide for the purpose of contacting me.",
    },
    submit: "Call me back",
    submitting: "Sending…",
    success: {
      title: "Thank you, we'll call you soon!",
      body: "We've received your request and will get back to you by phone within one business day.",
    },
    errors: {
      INVALID_BODY: "Invalid request. Please try again.",
      MISSING_FIELDS: "Please provide your name and phone number.",
      CONSENT_REQUIRED: "You must accept the privacy policy to continue.",
      NOT_CONFIGURED: "This service is currently unavailable. Please try again later.",
      SAVE_FAILED: "We couldn't send your request. Please try again.",
      NETWORK: "We couldn't send your request. Check your connection and try again.",
      UNKNOWN: "We couldn't send your request. Please try again.",
    },
  },

  cookieConsent: {
    ariaLabel: "Cookie settings",
    text: {
      prefix:
        "We currently don't use analytics or marketing cookies — we only save your cookie preference in your browser. Details in the ",
      linkText: "Cookie Policy",
      suffix: ".",
    },
    rejectButton: "Essential only",
    acceptButton: "Accept all",
  },

  cookieSettingsButton: {
    label: "Cookie settings",
  },

  blueprintDiagram: {
    ariaLabel:
      "System diagram: booking, payments, customer CRM, secure access control, and AI-powered automation flowing together into one shared system, 'Your source'.",
    modules: [
      { label: "Booking", y: 50, color: "var(--color-spring)" },
      { label: "Payments", y: 145, color: "var(--color-brook)" },
      { label: "Customer CRM", y: 240, color: "var(--color-spring)" },
      { label: "Secure access control", y: 335, color: "var(--color-brook)" },
      { label: "AI-powered automation", y: 430, color: "var(--color-spring)" },
    ],
    centerLine1: "Your",
    centerLine2: "source",
  },

  legalPageShell: {
    updatedLabel: "Last updated",
  },

  legal: {
    eyebrow: "Legal document",
    updatedDate: "July 1, 2026",
    privacy: {
      metaTitle: "Privacy Policy — FlowCore",
      metaDescription:
        "FlowCore's privacy policy regarding callback requests submitted on the website.",
      pageTitle: "Privacy Policy",
    },
    cookies: {
      metaTitle: "Cookie Policy — FlowCore",
      metaDescription: "Cookies and similar technologies used on the FlowCore website.",
      pageTitle: "Cookie Policy",
    },
    imprint: {
      metaTitle: "Imprint — FlowCore",
      metaDescription: "Operator details for the FlowCore website.",
      pageTitle: "Imprint",
    },
  },
} as const;
