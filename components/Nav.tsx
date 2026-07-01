"use client";

import { useEffect, useState } from "react";
import { getLenisInstance } from "@/lib/lenis";

const links = [
  { href: "#szolgaltatasok", label: "Szolgáltatások" },
  { href: "#referenciak", label: "Referenciák" },
  { href: "#csapat", label: "Csapat" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveHash(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function handleAnchorClick(event: React.MouseEvent<HTMLAnchorElement>, hash: string) {
    const lenis = getLenisInstance();
    if (!lenis) return;
    event.preventDefault();
    lenis.scrollTo(hash, { offset: -88, duration: 1.2 });
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-ink/95 backdrop-blur transition-all duration-300 supports-[backdrop-filter]:bg-ink/80 ${
        scrolled ? "border-white/15 shadow-lg shadow-black/20" : "border-white/10"
      }`}
    >
      <nav
        aria-label="Fő navigáció"
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 transition-[padding] duration-300 sm:px-8 ${
          scrolled ? "py-2.5" : "py-3.5"
        }`}
      >
        <a
          href="#top"
          onClick={(event) => handleAnchorClick(event, "#top")}
          className="font-display text-lg font-semibold tracking-tight text-paper transition-transform duration-300 hover:scale-[1.02]"
        >
          Forrás Stúdió
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(event) => handleAnchorClick(event, link.href)}
                className={`relative font-sans text-sm transition-colors duration-200 ${
                  activeHash === link.href ? "text-paper" : "text-paper/70 hover:text-paper"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1 left-0 h-px bg-spring transition-all duration-300 ${
                    activeHash === link.href ? "w-full" : "w-0"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#cta"
          onClick={(event) => handleAnchorClick(event, "#cta")}
          className="btn-shine whitespace-nowrap rounded-md bg-amber px-4 py-2 font-sans text-sm font-semibold text-ink transition-all duration-200 hover:bg-amber-dark hover:shadow-lg hover:shadow-amber/20 active:scale-95"
        >
          Visszahívást kérek
        </a>
      </nav>
    </header>
  );
}
