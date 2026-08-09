import type { flows as flowsHu } from "./hu";

// A hu/en `flows` szótárak `as const`-tal literál string típusokat kapnak
// (pl. "Érvénytelen link" vs. "Invalid link"), ezért a két nyelv objektuma
// nominálisan különböző típusú. A kliens komponensek propjait ezért nem a
// nyers `typeof flowsHu`/`typeof flowsEn` típussal, hanem ennek "kiszélesített"
// (string levelű) változatával kell tipizálni, hogy mindkét nyelv objektuma
// átadható legyen.
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { readonly [K in keyof T]: Widen<T[K]> };

export type FlowsDict = Widen<typeof flowsHu>;
export type BookingDict = FlowsDict["booking"];
export type BookingSlotPickerDict = FlowsDict["booking"]["slotPicker"];
export type QuestionnaireDict = FlowsDict["questionnaire"];
