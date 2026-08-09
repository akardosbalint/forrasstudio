"use client";

import { motion, type Variants } from "framer-motion";
import { EXPO_OUT } from "@/lib/motion";
import type { Dictionary } from "@/dictionaries";

type TrustBarProps = {
  dict: Dictionary["site"]["trustBar"];
};

const references = [
  { name: "ECO Portal", domain: "portal.ecokozosseg.hu", href: "https://portal.ecokozosseg.hu" },
  { name: "ECO Weboldal", domain: "ecokozosseg.hu", href: "https://ecokozosseg.hu" },
  { name: "Ösvény App by eptestben.hu", domain: "eptestben.hu", href: "https://eptestben.hu" },
  { name: "Kardos Bálint Okoskonyhája", domain: "akardosbalint.hu", href: "https://akardosbalint.hu" },
];

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EXPO_OUT } },
};

export function TrustBar({ dict }: TrustBarProps) {
  return (
    <section className="border-y border-paper-3 bg-paper-2">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EXPO_OUT }}
          className="mb-5 text-center font-mono text-xs uppercase tracking-[0.14em] text-ink/50"
        >
          <span className="text-ink/30">{"// "}</span>
          {dict.label}
        </motion.p>
        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {references.map((ref) => (
            <motion.li key={ref.domain} variants={itemVariants}>
              <a
                href={ref.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-paper-3 bg-white/60 px-3.5 py-1.5 font-mono text-xs text-ink/70 transition-all duration-200 hover:border-spring/60 hover:bg-white/90 hover:text-ink"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-spring transition-transform duration-200 group-hover:scale-125"
                />
                {ref.domain}
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
