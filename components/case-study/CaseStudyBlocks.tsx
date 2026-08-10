import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

/** Shared presentational building blocks for /esettanulmanyok/* detail
 * pages. Each case study page composes these instead of hand-rolling
 * markup, so future case studies (uploaded one at a time) stay visually
 * consistent with the studio's brand without re-deriving layout rules. */

type MetaItem = { label: string; value: string };

type CaseStudyHeroProps = {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle: string;
  meta: MetaItem[];
};

export function CaseStudyHero({ eyebrow, title, highlight, subtitle, meta }: CaseStudyHeroProps) {
  return (
    <section className="mesh-dark grid-pattern relative overflow-hidden text-paper">
      <div className="relative mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-24">
        <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-spring">
          <span aria-hidden="true" className="h-px w-6 bg-spring/60" />
          {eyebrow}
        </p>
        <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
          {title}
          {highlight ? <span className="text-gradient-brand"> {highlight}</span> : null}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/75">{subtitle}</p>

        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-6 font-sans text-sm text-paper/60">
          {meta.map((item) => (
            <span key={item.label}>
              <b className="font-semibold text-paper/90">{item.label}:</b> {item.value}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

type Stat = { value: string; label: string };

export function CaseStudyStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="border-y border-white/10 bg-ink-3 text-paper">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-px bg-white/10 px-5 sm:grid-cols-4 sm:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-ink-3 px-4 py-6">
            <div className="font-mono text-2xl font-bold text-paper sm:text-[1.7rem]">{stat.value}</div>
            <div className="mt-1 text-xs leading-snug text-paper/55">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CaseStudyBody({ children }: { children: ReactNode }) {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">{children}</div>
    </div>
  );
}

type TocItem = { href: string; label: string };

export function CaseStudyTOC({ items }: { items: TocItem[] }) {
  return (
    <Reveal>
      <nav
        aria-label="Tartalomjegyzék"
        className="rounded-2xl border border-paper-3 bg-white/60 p-6 shadow-sm sm:p-7"
      >
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/40">Tartalom</p>
        <ol className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {items.map((item, index) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="flex items-baseline gap-3 border-b border-dotted border-paper-3 py-1.5 text-sm text-ink/75 transition-colors hover:text-amber-dark"
              >
                <span className="font-mono text-xs text-amber-dark/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </Reveal>
  );
}

type CaseStudySectionProps = {
  id: string;
  kicker: string;
  title: string;
  children: ReactNode;
};

export function CaseStudySection({ id, kicker, title, children }: CaseStudySectionProps) {
  return (
    <section id={id} className="mt-16 scroll-mt-24 first:mt-14">
      <Reveal>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-amber-dark">
          {kicker}
        </p>
        <h2 className="mt-2 border-b border-paper-3 pb-4 text-balance font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h2>
      </Reveal>
      <div className="mt-6 space-y-4 leading-relaxed text-ink/75">{children}</div>
    </section>
  );
}

export function CaseStudyLede({ children }: { children: ReactNode }) {
  return <p className="max-w-3xl text-lg leading-relaxed text-ink/85">{children}</p>;
}

export function CaseStudyH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="!mt-9 font-display text-lg font-semibold text-amber-dark">{children}</h3>
  );
}

export function CaseStudyList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2.5 pl-5 marker:text-spring">
      {items.map((item, index) => (
        <li key={index} className="max-w-3xl">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function CaseStudyCallout({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="rounded-r-md border-l-[3px] border-pink bg-pink/10 px-5 py-4 font-sans text-[0.95rem] leading-relaxed text-ink">
      {label ? <b className="text-ink">{label}</b> : null}
      {label ? " — " : null}
      {children}
    </div>
  );
}

export function CaseStudyDiagram({ children, caption }: { children: string; caption?: string }) {
  return (
    <div>
      <div className="overflow-x-auto rounded-xl bg-ink shadow-[0_8px_30px_-12px_rgba(13,10,26,0.5)]">
        <pre className="p-5 font-mono text-[11px] leading-relaxed text-spring/90 sm:text-xs">
          {children}
        </pre>
      </div>
      {caption ? <p className="mt-2.5 max-w-3xl text-sm text-ink/55">{caption}</p> : null}
    </div>
  );
}

export function CaseStudyTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-paper-3">
      <table className="w-full min-w-[480px] border-collapse font-sans text-sm">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border-b border-paper-3 bg-paper-2 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-ink/50"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-paper-3">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top text-ink/75">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: ReactNode;
  mobile?: boolean;
};

export function CaseStudyGallery({ images }: { images: GalleryImage[] }) {
  return (
    <div className={`grid gap-5 ${images.length > 1 ? "sm:grid-cols-2" : ""}`}>
      {images.map((image) => (
        <figure key={image.src} className={image.mobile ? "mx-auto w-full max-w-[220px]" : ""}>
          <div className="overflow-hidden rounded-xl border border-paper-3 shadow-[0_8px_24px_-12px_rgba(13,10,26,0.25)]">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="block w-full"
              sizes={image.mobile ? "220px" : "(min-width: 640px) 480px, 100vw"}
            />
          </div>
          <figcaption className="mt-2.5 text-sm leading-snug text-ink/55">{image.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

type TimelineItem = { date: string; text: string };

export function CaseStudyTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative space-y-6 border-l border-paper-3 pl-6">
      {items.map((item) => (
        <li key={item.date} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-paper bg-spring shadow-[0_0_0_1px_var(--color-spring)]"
          />
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-amber-dark">
            {item.date}
          </p>
          <p className="mt-0.5 text-[0.95rem] text-ink/80">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}

type Rung = { role: string; desc: string; accent: "neutral" | "brook" | "pink" | "amber" | "spring" };

const accentBorder: Record<Rung["accent"], string> = {
  neutral: "border-l-ink/25",
  brook: "border-l-brook",
  pink: "border-l-pink",
  amber: "border-l-amber",
  spring: "border-l-spring bg-spring/5",
};

export function CaseStudyLadder({ rungs }: { rungs: Rung[] }) {
  return (
    <div className="space-y-2">
      {rungs.map((rung) => (
        <div
          key={rung.role}
          className={`grid grid-cols-1 gap-1.5 rounded-md border border-paper-3 border-l-4 bg-white/60 px-4 py-3 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-4 ${accentBorder[rung.accent]}`}
        >
          <div className="font-sans text-sm font-bold text-ink">{rung.role}</div>
          <div className="text-sm text-ink/65">{rung.desc}</div>
        </div>
      ))}
    </div>
  );
}

type BarRow = { label: string; valueLabel: string; pct: number; tone: "brand" | "muted" };

export function CaseStudyBarChart({ rows }: { rows: BarRow[] }) {
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-4">
          <div className="w-32 flex-shrink-0 font-sans text-sm text-ink/65 sm:w-40">{row.label}</div>
          <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-paper-2">
            <div
              className={`h-full rounded-full ${row.tone === "brand" ? "bg-gradient-brand" : "bg-ink/20"}`}
              style={{ width: `${row.pct}%` }}
            />
          </div>
          <div className="w-24 flex-shrink-0 text-right font-mono text-sm text-ink">
            {row.valueLabel}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CaseStudyTiles({ tiles }: { tiles: Stat[] }) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-xl border border-paper-3 bg-white/60 px-5 py-4">
          <div className="font-mono text-xl font-bold text-amber-dark">{tile.value}</div>
          <div className="mt-1 text-xs leading-snug text-ink/55">{tile.label}</div>
        </div>
      ))}
    </div>
  );
}

export function CaseStudyColophon({ children }: { children: ReactNode }) {
  return (
    <p className="mt-16 border-t border-paper-3 pt-6 font-sans text-xs leading-relaxed text-ink/45">
      {children}
    </p>
  );
}
