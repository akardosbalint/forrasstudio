import { describe, expect, it } from "vitest";
import { periodStart } from "./period";

describe("periodStart", () => {
  // 2026-08-05 = szerda
  const wednesday = new Date(2026, 7, 5, 15, 30, 0);

  it("returns midnight today for 'day'", () => {
    const start = periodStart("day", wednesday);
    expect(start).not.toBeNull();
    expect(start!.getDate()).toBe(5);
    expect(start!.getHours()).toBe(0);
  });

  it("returns the preceding Monday for 'week'", () => {
    const start = periodStart("week", wednesday);
    expect(start!.getDay()).toBe(1); // Monday
    expect(start!.getDate()).toBe(3); // 2026-08-03 is the Monday of that week
  });

  it("returns the 1st of the month for 'month'", () => {
    const start = periodStart("month", wednesday);
    expect(start!.getDate()).toBe(1);
    expect(start!.getMonth()).toBe(7); // August (0-indexed)
  });

  it("returns Jan 1st for 'year'", () => {
    const start = periodStart("year", wednesday);
    expect(start!.getMonth()).toBe(0);
    expect(start!.getDate()).toBe(1);
  });

  it("returns null for 'all' (no lower bound)", () => {
    expect(periodStart("all", wednesday)).toBeNull();
  });

  it("handles a Sunday correctly for 'week' (should go back to the Monday before)", () => {
    const sunday = new Date(2026, 7, 9, 10, 0, 0); // 2026-08-09 = vasárnap
    const start = periodStart("week", sunday);
    expect(start!.getDay()).toBe(1);
    expect(start!.getDate()).toBe(3);
  });
});
