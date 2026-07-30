// Pipeline státuszgép — az átmenetek engedélyezettségét a stádiumok
// admin-szerkeszthető `order` mezője és `isTerminal` jelzője alapján dönti
// el, nem hardcode-olt kulcs-listával. Így az admin bővítheti/átrendezheti
// a pipeline-t (Phase 6 vizuális szerkesztő) anélkül, hogy ezt a modult
// módosítani kellene.
//
// Szabályok:
// - Ugyanabba a stádiumba "átmenet" nem értelmezett (no-op).
// - Terminális stádiumból (pl. "Nyert"/"Elveszett") csak admin mozdíthat ki
//   (újranyitás) — sales rep nem.
// - Terminális stádiumba bárki (aki egyáltalán módosíthat leadet) beléphet,
//   akár visszafelé is (pl. bármikor lezárható elveszettként).
// - Admin egyébként szabadon mozgathat bármely irányba (korrekció).
// - Sales rep / egyéb szerkesztő csak előrefelé (magasabb `order`) haladhat.
export type StageLite = {
  id: string;
  order: number;
  isTerminal: boolean;
};

export type TransitionRole = "ADMIN" | "SALES_REP" | "VIEWER";

export function canTransition(
  from: StageLite,
  to: StageLite,
  role: TransitionRole,
): boolean {
  if (from.id === to.id) return false;
  if (role === "VIEWER") return false;

  if (from.isTerminal) {
    return role === "ADMIN";
  }

  if (to.isTerminal) {
    return true;
  }

  if (role === "ADMIN") {
    return true;
  }

  return to.order > from.order;
}

export class InvalidTransitionError extends Error {
  constructor(fromLabel: string, toLabel: string) {
    super(`Nem engedélyezett átmenet: "${fromLabel}" → "${toLabel}".`);
    this.name = "InvalidTransitionError";
  }
}
