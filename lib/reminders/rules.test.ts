import { describe, expect, it } from "vitest";
import { isReminderDue } from "./rules";

describe("isReminderDue", () => {
  const startsAt = new Date("2026-08-10T10:00:00Z");

  it("is due exactly at the target time", () => {
    expect(
      isReminderDue({
        now: new Date("2026-08-09T10:00:00Z"),
        startsAt,
        hoursBefore: 24,
        windowMinutes: 20,
      }),
    ).toBe(true);
  });

  it("is due a few minutes after the target time (within the window)", () => {
    expect(
      isReminderDue({
        now: new Date("2026-08-09T10:15:00Z"),
        startsAt,
        hoursBefore: 24,
        windowMinutes: 20,
      }),
    ).toBe(true);
  });

  it("is not due before the target time", () => {
    expect(
      isReminderDue({
        now: new Date("2026-08-09T09:59:00Z"),
        startsAt,
        hoursBefore: 24,
        windowMinutes: 20,
      }),
    ).toBe(false);
  });

  it("is not due once the window has passed (job missed its run)", () => {
    expect(
      isReminderDue({
        now: new Date("2026-08-09T10:25:00Z"),
        startsAt,
        hoursBefore: 24,
        windowMinutes: 20,
      }),
    ).toBe(false);
  });

  it("supports the 1-hour-before reminder independently", () => {
    expect(
      isReminderDue({
        now: new Date("2026-08-10T09:05:00Z"),
        startsAt,
        hoursBefore: 1,
        windowMinutes: 20,
      }),
    ).toBe(true);
  });
});
