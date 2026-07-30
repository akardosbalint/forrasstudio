// Egyszerű {{változó}} helyettesítés az admin által szerkeszthető email
// sablonokban (Phase 6 admin UI szerkeszti a subject/bodyHtml/bodyText
// mezőket, ez a modul csak a végleges szöveget állítja elő küldés előtt).
export function renderEmailString(
  template: string,
  variables: Record<string, string>,
): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) =>
    key in variables ? variables[key] : match,
  );
}

// A behelyettesített értékek (pl. leadName, repName) felhasználó által
// megadott adatból származhatnak (a publikus visszahívás-form vagy a
// kérdőív nem korlátozza a megengedett karaktereket) — HTML kontextusba
// (bodyHtml) illesztés előtt escape-elni kell őket, különben tetszőleges
// markup/kép-alapú payload kerülhetne a kimenő emailekbe (pl. a rep
// "új foglalás" értesítésébe). A sima szöveg (bodyText) verzióhoz ez nem
// kell, ott nincs értelmezhető markup.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
