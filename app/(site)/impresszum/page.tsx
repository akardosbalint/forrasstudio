import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Impresszum — MI Építettük",
  description: "A MI Építettük weboldal üzemeltetőjének adatai.",
};

export default function ImpresszumPage() {
  return (
    <LegalPageShell eyebrow="Jogi dokumentum" title="Impresszum" updated="2026. július 1.">
      <LegalSection title="Szolgáltató adatai">
        <ul>
          <li>Márkanév: MI Építettük</li>
          <li>Szolgáltató neve: MI Építettük Kft.</li>
          <li>Székhely: 1027 Budapest, Bem József utca 6. fsz. 3.</li>
          <li>Cégjegyzékszám: <span className="font-mono text-sm">[TODO: cégjegyzékszám]</span></li>
          <li>Adószám: <span className="font-mono text-sm">[TODO: adószám]</span></li>
          <li>
            Email: <a href="mailto:akardosbalint@gmail.com">akardosbalint@gmail.com</a>
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
          A weboldal végleges domainje: miepitettuk.hu.
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
