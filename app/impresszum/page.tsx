import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Impresszum — Forrás Stúdió",
  description: "A Forrás Stúdió weboldal üzemeltetőjének adatai.",
};

export default function ImpresszumPage() {
  return (
    <LegalPageShell eyebrow="Jogi dokumentum" title="Impresszum" updated="2026. július 1.">
      <LegalSection title="Szolgáltató adatai">
        <ul>
          <li>Név: Forrás Stúdió [TODO: teljes cégnév / egyéni vállalkozó neve]</li>
          <li>Székhely: [TODO: székhely címe]</li>
          <li>Cégjegyzékszám / nyilvántartási szám: [TODO]</li>
          <li>Adószám: [TODO]</li>
          <li>
            Email: <a href="mailto:[TODO: email]">[TODO: email]</a>
          </li>
          <li>
            Telefon: <a href="tel:[TODO: telefonszám]">[TODO: telefonszám]</a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Tárhelyszolgáltató">
        <p>
          Vercel Inc. (Egyesült Államok) —{" "}
          <a href="https://vercel.com/legal" target="_blank" rel="noopener noreferrer">
            vercel.com/legal
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Domain">
        <p>
          A weboldal végleges domainje: forras.studio. Egyelőre az
          akardosbalint.hu domainen érhető el.
        </p>
      </LegalSection>

      <LegalSection title="Jogi nyilatkozat">
        <p>
          A weboldalon található tartalmak tájékoztató jellegűek, nem
          minősülnek szerződéses ajánlattételnek. A referenciaként bemutatott
          projektek adatait lásd a{" "}
          <Link href="/#referenciak">Referenciák</Link> szekcióban.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
