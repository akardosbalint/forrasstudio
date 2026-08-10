import type { ReactNode } from "react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";

type MetaItem = { label: string; value: string };

export function CaseStudyHero({
  eyebrow,
  title,
  subtitle,
  meta,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: MetaItem[];
}) {
  return (
    <section className="grid-pattern relative overflow-hidden bg-ink text-paper">
      <div className="relative mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.16em] text-spring">
            <span aria-hidden="true" className="h-px w-6 bg-spring/60" />
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/75">{subtitle}</p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-white/15 pt-5 font-sans text-sm text-paper/60">
            {meta.map((item, index) => (
              <span key={item.label} className="flex items-center gap-3">
                {index > 0 && <span aria-hidden="true" className="opacity-40">·</span>}
                <span>
                  <b className="font-semibold text-paper/90">{item.label}:</b> {item.value}
                </span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function StatStrip({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="border-y border-white/10 bg-ink-2">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-ink-2 px-5 py-5">
            <div className="font-mono text-2xl font-bold tracking-tight text-paper">
              {stat.value}
            </div>
            <div className="mt-1 text-xs leading-snug text-paper/50">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableOfContents({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string }[];
}) {
  return (
    <nav className="mt-10 rounded-xl border border-paper-3 bg-paper-2 p-6 sm:p-7">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/40">{label}</p>
      <ol className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.href} className="border-b border-dotted border-paper-3 py-1.5">
            <a
              href={item.href}
              className="flex items-baseline gap-2.5 text-sm text-ink/80 transition-colors duration-200 hover:text-spring"
            >
              <span className="font-mono text-xs text-amber-dark">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CaseStudySection({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-paper-3 pt-12 first:mt-0 first:border-t-0 first:pt-0">
      <Reveal>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-dark">
          {kicker}
        </p>
        <h2 className="mt-2 text-balance font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {title}
        </h2>
      </Reveal>
      <div className="mt-6 space-y-4 leading-relaxed text-ink/80 [&_code]:rounded [&_code]:bg-paper-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-ink [&_strong]:font-semibold [&_strong]:text-ink">
        {children}
      </div>
    </section>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className="max-w-2xl text-lg leading-relaxed text-ink">{children}</p>;
}

export function Callout({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="rounded-r-lg border-l-4 border-amber bg-amber/10 px-5 py-4 text-[15px] leading-relaxed text-ink">
      {label && <b className="mr-1.5 text-ink">{label}</b>}
      {children}
    </div>
  );
}

export function DiagramBlock({ children, caption }: { children: ReactNode; caption?: ReactNode }) {
  return (
    <div>
      <div className="overflow-x-auto rounded-lg bg-ink-3 shadow-sm">
        <pre className="whitespace-pre px-5 py-5 font-mono text-[12px] leading-relaxed text-spring/90">
          {children}
        </pre>
      </div>
      {caption && <p className="mt-2 text-xs leading-relaxed text-ink/50">{caption}</p>}
    </div>
  );
}

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-paper-3">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="bg-paper-2">
            {headers.map((header) => (
              <th
                key={header}
                className="whitespace-nowrap px-4 py-2.5 text-left font-mono text-[11px] font-semibold uppercase tracking-wide text-ink/50"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-paper-3 transition-colors hover:bg-paper-2/60">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top text-ink/80">
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

export function Timeline({ items }: { items: { date: string; text: string }[] }) {
  return (
    <ol className="relative ml-1 border-l border-paper-3 pl-6">
      {items.map((item) => (
        <li key={item.date} className="relative pb-6 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full border-2 border-paper bg-spring shadow-[0_0_0_1px_var(--color-spring)]"
          />
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-amber-dark">
            {item.date}
          </p>
          <p className="mt-0.5 text-[15px] text-ink/85">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}

const roleLadderTone: Record<string, string> = {
  base: "border-l-ink/25",
  mod: "border-l-spring",
  org: "border-l-brook",
  master: "border-l-amber-dark",
  admin: "border-l-amber bg-amber/10",
};

export function RoleLadder({
  rungs,
}: {
  rungs: { tone: "base" | "mod" | "org" | "master" | "admin"; role: string; desc: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {rungs.map((rung) => (
        <div
          key={rung.role}
          className={`grid gap-3 rounded-lg border-y border-r border-l-4 border-paper-3 bg-paper-2/60 px-4 py-3 sm:grid-cols-[160px_1fr] sm:items-center ${roleLadderTone[rung.tone]}`}
        >
          <div className="font-sans text-sm font-bold text-ink">{rung.role}</div>
          <div className="text-sm text-ink/70">{rung.desc}</div>
        </div>
      ))}
    </div>
  );
}

export function TileRow({ tiles }: { tiles: { value: string; label: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-xl border border-paper-3 bg-paper-2 p-5">
          <div className="font-mono text-2xl font-bold text-ink">{tile.value}</div>
          <div className="mt-1 text-xs leading-snug text-ink/55">{tile.label}</div>
        </div>
      ))}
    </div>
  );
}

export function CommitBar({
  rows,
}: {
  rows: { label: string; value: string; pct: number; tone?: "spring" | "muted" }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <div className="w-36 flex-shrink-0 text-sm text-ink/60">{row.label}</div>
          <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-paper-2">
            <div
              className={`h-full rounded-full ${row.tone === "muted" ? "bg-ink/25" : "bg-spring"}`}
              style={{ width: `${row.pct}%` }}
            />
          </div>
          <div className="w-24 flex-shrink-0 text-right font-mono text-sm text-ink">
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export function FeatureList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-none space-y-2.5">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-spring" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Gallery({
  children,
  columns = "sm:grid-cols-[1.15fr_0.85fr]",
}: {
  children: ReactNode;
  columns?: string;
}) {
  return <div className={`grid gap-4 ${columns}`}>{children}</div>;
}

export function Figure({
  src,
  alt,
  caption,
  width,
  height,
  mobile = false,
}: {
  src: string;
  alt: string;
  caption: ReactNode;
  width: number;
  height: number;
  mobile?: boolean;
}) {
  return (
    <figure className={mobile ? "mx-auto max-w-[260px]" : undefined}>
      <div className="overflow-hidden rounded-lg border border-paper-3 bg-paper-2 shadow-sm">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="block h-auto w-full"
          sizes={mobile ? "260px" : "(min-width: 640px) 500px, 100vw"}
        />
      </div>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink/55 [&_b]:text-ink">
        {caption}
      </figcaption>
    </figure>
  );
}

export function Colophon({ children }: { children: ReactNode }) {
  return (
    <div className="mt-16 border-t border-paper-3 pt-6 text-xs leading-relaxed text-ink/45">
      {children}
    </div>
  );
}
