"use client";

import { motion, type Variants } from "framer-motion";
import { EXPO_OUT } from "@/lib/motion";

const references = [
  { name: "ECO Portal", domain: "portal.ecokozosseg.hu", href: "https://portal.ecokozosseg.hu" },
  { name: "ECO Weboldal", domain: "ecokozosseg.hu", href: "https://ecokozosseg.hu" },
  { name: "Ösvény App by eptestben.hu", domain: "eptestben.hu", href: "https://eptestben.hu" },
  { name: "Purnima Vision", domain: "purnima.vision", href: "https://purnima.vision" },
];

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EXPO_OUT } },
};

export function TrustBar() {
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
          Ezeket a rendszereket mi építettük és üzemeltetjük
        </motion.p>
        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {references.map((ref) => (
            <motion.li key={ref.domain} variants={itemVariants}>
              <a
                href={ref.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm font-medium text-ink/70 underline decoration-ink/20 decoration-1 underline-offset-4 transition-all duration-200 hover:text-ink hover:decoration-spring"
              >
                {ref.domain}
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
