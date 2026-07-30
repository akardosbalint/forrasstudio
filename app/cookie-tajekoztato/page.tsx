import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Sütikezelési tájékoztató — KBCo Stúdió",
  description: "A KBCo Stúdió weboldalán használt sütik és hasonló technológiák.",
};

export default function CookieTajekoztatoPage() {
  return (
    <LegalPageShell
      eyebrow="Jogi dokumentum"
      title="Sütikezelési tájékoztató"
      updated="2026. július 1."
    >
      <LegalSection title="1. Mi az a süti (cookie)">
        <p>
          A sütik olyan kis szövegfájlok, amelyeket a böngésződ ment el a
          meglátogatott weboldalak beállításai alapján. Ez a tájékoztató a
          KBCo Stúdió weboldalán használt sütikről és hasonló technológiákról
          (pl. a böngésző helyi tárolójáról, localStorage) szól.
        </p>
      </LegalSection>

      <LegalSection title="2. Milyen sütiket használunk jelenleg">
        <p>
          A KBCo Stúdió weboldala jelenleg <strong>nem használ analitikai,
          marketing vagy hirdetési célú sütiket</strong>.
        </p>
        <p>
          A böngésződ helyi tárolójában (localStorage) egyetlen technikai
          bejegyzést mentünk el: azt, hogy elfogadtad vagy elutasítottad-e a
          süti-tájékoztatót. Ez a bejegyzés nem követ nyomon, nem azonosít
          személyesen, és nem osztunk meg belőle adatot harmadik féllel.
        </p>
      </LegalSection>

      <LegalSection title="3. Jövőbeli változások">
        <p>
          Ha a jövőben analitikai vagy marketing célú sütiket vezetnénk be
          (például a látogatottság mérésére), ezt csak az előzetes
          hozzájárulásod után tesszük, és ez a tájékoztató frissül az adott
          süti nevével, céljával és időtartamával.
        </p>
      </LegalSection>

      <LegalSection title="4. A hozzájárulásod módosítása">
        <p>
          A korábban megadott süti-preferenciádat bármikor módosíthatod az
          oldal alján, a lábléc &bdquo;Süti beállítások&rdquo; linkjére kattintva,
          vagy a böngésződ saját süti-/tárolóbeállításain keresztül.
        </p>
      </LegalSection>

      <LegalSection title="Kapcsolódó dokumentum">
        <p>
          A weboldalon leadott visszahívás-kérésekkel kapcsolatos
          adatkezelésről az{" "}
          <a href="/adatvedelem">Adatkezelési tájékoztatóban</a> olvashatsz.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
