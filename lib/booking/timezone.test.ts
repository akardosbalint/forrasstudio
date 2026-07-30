import { describe, expect, it } from "vitest";
import {
  weekdayOfCalendarDate,
  zonedTimeToUtc,
} from "./timezone";

describe("zonedTimeToUtc (Europe/Budapest DST safety)", () => {
  it("uses UTC+1 (CET) in January", () => {
    const result = zonedTimeToUtc(2026, 1, 15, 9, 0, "Europe/Budapest");
    expect(result.toISOString()).toBe("2026-01-15T08:00:00.000Z");
  });

  it("uses UTC+2 (CEST) in July", () => {
    const result = zonedTimeToUtc(2026, 7, 15, 9, 0, "Europe/Budapest");
    expect(result.toISOString()).toBe("2026-07-15T07:00:00.000Z");
  });

  it("is a no-op offset for UTC itself", () => {
    const result = zonedTimeToUtc(2026, 3, 10, 14, 30, "UTC");
    expect(result.toISOString()).toBe("2026-03-10T14:30:00.000Z");
  });
});

describe("weekdayOfCalendarDate", () => {
  it("identifies known weekdays regardless of time-of-day concerns", () => {
    expect(weekdayOfCalendarDate(2026, 8, 3)).toBe(1); // Monday
    expect(weekdayOfCalendarDate(2026, 8, 7)).toBe(5); // Friday
    expect(weekdayOfCalendarDate(2026, 8, 8)).toBe(6); // Saturday
  });
});
