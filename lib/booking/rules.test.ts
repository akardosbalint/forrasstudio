import { describe, expect, it } from "vitest";
import {
  hasConflict,
  isBookableSlot,
  isWithinBusinessWindow,
  meetsMinLeadTime,
} from "./rules";

// 2026-08-03 = hétfő (UTC), 2026-08-07 = péntek, 2026-08-08 = szombat.
// A determinizmus kedvéért a teszteket "UTC" időzónával futtatjuk, hogy
// ne függjenek a futtató gép helyi időzónájától.
const MONDAY_09_00 = new Date("2026-08-03T09:00:00Z");
const MONDAY_08_59 = new Date("2026-08-03T08:59:00Z");
const FRIDAY_16_30 = new Date("2026-08-07T16:30:00Z");
const FRIDAY_16_31 = new Date("2026-08-07T16:31:00Z");
const SATURDAY_10_00 = new Date("2026-08-08T10:00:00Z");

describe("isWithinBusinessWindow", () => {
  it("allows Monday 09:00 (window start boundary)", () => {
    expect(isWithinBusinessWindow(MONDAY_09_00, "UTC")).toBe(true);
  });

  it("blocks Monday 08:59 (before window start)", () => {
    expect(isWithinBusinessWindow(MONDAY_08_59, "UTC")).toBe(false);
  });

  it("allows Friday 16:30 (90 min call ends exactly at 18:00)", () => {
    expect(isWithinBusinessWindow(FRIDAY_16_30, "UTC")).toBe(true);
  });

  it("blocks Friday 16:31 (call would end after 18:00)", () => {
    expect(isWithinBusinessWindow(FRIDAY_16_31, "UTC")).toBe(false);
  });

  it("blocks weekend slots", () => {
    expect(isWithinBusinessWindow(SATURDAY_10_00, "UTC")).toBe(false);
  });
});

describe("meetsMinLeadTime", () => {
  const submittedAt = new Date("2026-08-03T10:00:00Z");

  it("blocks a slot exactly 1 minute short of 24 hours", () => {
    const candidate = new Date("2026-08-04T09:59:00Z");
    expect(meetsMinLeadTime(candidate, submittedAt)).toBe(false);
  });

  it("allows a slot exactly 24 hours after submission", () => {
    const candidate = new Date("2026-08-04T10:00:00Z");
    expect(meetsMinLeadTime(candidate, submittedAt)).toBe(true);
  });

  it("allows a slot well beyond the 24 hour minimum", () => {
    const candidate = new Date("2026-08-06T10:00:00Z");
    expect(meetsMinLeadTime(candidate, submittedAt)).toBe(true);
  });
});

describe("hasConflict", () => {
  const existing = [
    {
      startsAt: new Date("2026-08-03T10:00:00Z"),
      endsAt: new Date("2026-08-03T11:30:00Z"),
    },
  ];

  it("detects a fully overlapping slot", () => {
    expect(hasConflict(new Date("2026-08-03T10:30:00Z"), existing)).toBe(
      true,
    );
  });

  it("detects a partially overlapping slot starting before the existing one ends", () => {
    expect(hasConflict(new Date("2026-08-03T11:00:00Z"), existing)).toBe(
      true,
    );
  });

  it("allows a slot starting exactly when the existing one ends", () => {
    expect(hasConflict(new Date("2026-08-03T11:30:00Z"), existing)).toBe(
      false,
    );
  });

  it("allows a slot ending exactly when the existing one starts", () => {
    expect(hasConflict(new Date("2026-08-03T08:30:00Z"), existing)).toBe(
      false,
    );
  });

  it("allows a fully disjoint slot", () => {
    expect(hasConflict(new Date("2026-08-04T10:00:00Z"), existing)).toBe(
      false,
    );
  });
});

describe("isBookableSlot", () => {
  const submittedAt = new Date("2026-08-01T09:00:00Z");
  const now = new Date("2026-08-01T09:00:00Z");

  it("accepts a valid future weekday slot with enough lead time and no conflicts", () => {
    expect(
      isBookableSlot({
        candidateStart: new Date("2026-08-03T09:00:00Z"),
        submittedAt,
        existingBookings: [],
        now,
        timeZone: "UTC",
      }),
    ).toBe(true);
  });

  it("rejects a slot in the past relative to now", () => {
    expect(
      isBookableSlot({
        candidateStart: new Date("2026-07-31T09:00:00Z"),
        submittedAt,
        existingBookings: [],
        now,
        timeZone: "UTC",
      }),
    ).toBe(false);
  });

  it("rejects a slot without enough lead time even if otherwise valid", () => {
    expect(
      isBookableSlot({
        candidateStart: new Date("2026-08-01T10:00:00Z"),
        submittedAt,
        existingBookings: [],
        now,
        timeZone: "UTC",
      }),
    ).toBe(false);
  });

  it("rejects a slot that conflicts with an existing booking", () => {
    expect(
      isBookableSlot({
        candidateStart: new Date("2026-08-03T09:00:00Z"),
        submittedAt,
        existingBookings: [
          {
            startsAt: new Date("2026-08-03T09:30:00Z"),
            endsAt: new Date("2026-08-03T11:00:00Z"),
          },
        ],
        now,
        timeZone: "UTC",
      }),
    ).toBe(false);
  });
});
