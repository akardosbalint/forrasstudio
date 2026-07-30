import { beforeAll, describe, expect, it } from "vitest";
import { randomBytes } from "node:crypto";

describe("secretBox", () => {
  beforeAll(() => {
    process.env.ENCRYPTION_KEY = randomBytes(32).toString("base64");
  });

  it("round-trips a secret", async () => {
    const { encryptSecret, decryptSecret } = await import("./secretBox");
    const encrypted = encryptSecret("my-refresh-token-value");
    expect(encrypted).not.toContain("my-refresh-token-value");
    expect(decryptSecret(encrypted)).toBe("my-refresh-token-value");
  });

  it("produces a different ciphertext each time (random IV)", async () => {
    const { encryptSecret } = await import("./secretBox");
    const a = encryptSecret("same-value");
    const b = encryptSecret("same-value");
    expect(a).not.toBe(b);
  });

  it("rejects a tampered ciphertext", async () => {
    const { encryptSecret, decryptSecret } = await import("./secretBox");
    const encrypted = encryptSecret("sensitive");
    const [iv, tag, ciphertext] = encrypted.split(".");
    const tampered = [iv, tag, ciphertext.slice(0, -2) + "aa"].join(".");
    expect(() => decryptSecret(tampered)).toThrow();
  });
});
