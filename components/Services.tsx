import type { ReactNode } from "react";

type IconName = "sales" | "community" | "system" | "ops";

function ServiceIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    sales: (
      <>
        <rect x="5" y="7" width="22" height="18" rx="2.5" />
        <path d="M5 13h22" />
        <path d="M11 19h4" />
      </>
    ),
    community: (
      <>
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="21" cy="15" r="3.5" />
        <path d="M6 25c0-4 2.7-6.5 6-6.5s6 2.5 6 6.5" />
        <path d="M17.5 25c0-3-1.6-5-4-5.8" />
      </>
    ),
    system: (
      <>
        <circle cx="16" cy="16" r="3.2" />
        <circle cx="5.5" cy="6" r="2.2" />
        <circle cx="26.5" cy="6" r="2.2" />
        <circle cx="5.5" cy="26" r="2.2" />
        <circle cx="26.5" cy="26" r="2.2" />
        <path d="M7.3 7.6 13.7 13.8" />
        <path d="M24.7 7.6 18.3 13.8" />
        <path d="M7.3 24.4 13.7 18.2" />
        <path d="M24.7 24.4 18.3 18.2" />
      </>
    ),
    ops: (
      <>
        <path d="M16 6v6" />
        <path d="M16 20v6" />
        <path d="M6 16h6" />
        <path d="M20 16h6" />
        <circle cx="16" cy="16" r="5.5" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="h-8 w-8 text-spring"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

const services = [
  {
    icon: "sales" as const,
    eyebrow: "1. pillér",
    title: "Sales System Engineering",
    description:
      "Időpontfoglalás, fizetési integráció és ügyfél-CRM — a rétegek, amik meghatározzák, hogyan jut el hozzád a kliens, és hogyan fizet. Automatizált emlékeztetőkkel, hogy ne vesszen el egyetlen foglalás sem.",
  },
  {
    icon: "community" as const,
    eyebrow: "2. pillér",
    title: "Community Platform Building",
    description:
      "Zárt, jogosultságkezelt tagi felületek azoknak, akik nem csak egyéni ügyfeleket szolgálnak ki, hanem saját közösséget építenek — biztonságos beléptetéssel és tagsági szintekkel.",
  },
  {
    icon: "system" as const,
    title: "Teljes rendszer egy kézből",
    description:
      "A foglalás, a fizetés, a CRM és a beléptetés nem külön projektek, hanem egymással összehangolt modulok — egy csapat tervezi és köti össze mindet, nem több különálló szállító.",
  },
  {
    icon: "ops" as const,
    title: "Hosszú távú üzemeltetés & továbbfejlesztés",
    description:
      "Az élesítés nem a munka vége. A megépített rendszereket folyamatosan üzemeltetjük, karbantartjuk és fejlesztjük tovább — ez nálunk folyamatos felelősségvállalás, nem egyszeri leszállított munka.",
  },
];

export function Services() {
  return (
    <section id="szolgaltatasok" className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-spring">
          Szolgáltatások
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Két pillér, egy rendszer
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-xl border border-paper-3 bg-white/50 p-6 sm:p-7"
            >
              <ServiceIcon name={service.icon} />
              {service.eyebrow && (
                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-ink/40">
                  {service.eyebrow}
                </p>
              )}
              <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                {service.title}
              </h3>
              <p className="mt-3 leading-relaxed text-ink/70">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
