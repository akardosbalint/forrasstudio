import { describe, expect, it } from "vitest";
import { canTransition, type StageLite } from "./stateMachine";

const callbackPending: StageLite = { id: "1", order: 1, isTerminal: false };
const questionnaireSending: StageLite = { id: "2", order: 2, isTerminal: false };
const bookingPending: StageLite = { id: "3", order: 3, isTerminal: false };
const won: StageLite = { id: "7", order: 7, isTerminal: true };
const lost: StageLite = { id: "8", order: 8, isTerminal: true };

describe("canTransition", () => {
  it("blocks a no-op transition into the same stage", () => {
    expect(canTransition(callbackPending, callbackPending, "ADMIN")).toBe(
      false,
    );
  });

  it("blocks viewers from any transition", () => {
    expect(canTransition(callbackPending, questionnaireSending, "VIEWER")).toBe(
      false,
    );
  });

  it("allows a sales rep to move forward", () => {
    expect(
      canTransition(callbackPending, questionnaireSending, "SALES_REP"),
    ).toBe(true);
  });

  it("blocks a sales rep from moving backward", () => {
    expect(
      canTransition(questionnaireSending, callbackPending, "SALES_REP"),
    ).toBe(false);
  });

  it("allows a sales rep to close a lead as lost from any stage", () => {
    expect(canTransition(callbackPending, lost, "SALES_REP")).toBe(true);
    expect(canTransition(bookingPending, won, "SALES_REP")).toBe(true);
  });

  it("blocks a sales rep from reopening a terminal stage", () => {
    expect(canTransition(lost, callbackPending, "SALES_REP")).toBe(false);
    expect(canTransition(won, bookingPending, "SALES_REP")).toBe(false);
  });

  it("allows an admin to reopen a terminal stage", () => {
    expect(canTransition(lost, callbackPending, "ADMIN")).toBe(true);
    expect(canTransition(won, bookingPending, "ADMIN")).toBe(true);
  });

  it("allows an admin to move backward for corrections", () => {
    expect(canTransition(bookingPending, callbackPending, "ADMIN")).toBe(
      true,
    );
  });
});
