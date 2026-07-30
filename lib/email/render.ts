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
