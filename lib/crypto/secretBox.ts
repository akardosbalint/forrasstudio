import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// AES-256-GCM titkosítás a Google OAuth refresh/access tokenek nyugalmi
// (at-rest) titkosításához az adatbázisban (spec 5. pont: "kezeld a
// token frissítést... titkosítva"). A kulcsot az ENCRYPTION_KEY env
// változó adja, 32 bájt, base64-kódolva — generáld pl.
// `openssl rand -base64 32` paranccsal.
function getKey(): Buffer {
  const base64Key = process.env.ENCRYPTION_KEY;
  if (!base64Key) {
    throw new Error(
      "[crypto] ENCRYPTION_KEY nincs beállítva — lásd .env.example.",
    );
  }
  const key = Buffer.from(base64Key, "base64");
  if (key.length !== 32) {
    throw new Error(
      "[crypto] ENCRYPTION_KEY érvénytelen — 32 bájtos (base64-kódolt) kulcs szükséges.",
    );
  }
  return key;
}

// Formátum: base64(iv) + "." + base64(authTag) + "." + base64(ciphertext)
export function encryptSecret(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf-8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    ciphertext.toString("base64"),
  ].join(".");
}

export function decryptSecret(encoded: string): string {
  const key = getKey();
  const [ivB64, authTagB64, ciphertextB64] = encoded.split(".");
  if (!ivB64 || !authTagB64 || !ciphertextB64) {
    throw new Error("[crypto] Érvénytelen titkosított érték formátum.");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(ivB64, "base64"),
  );
  decipher.setAuthTag(Buffer.from(authTagB64, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertextB64, "base64")),
    decipher.final(),
  ]);
  return plaintext.toString("utf-8");
}
