import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      // A valódi "server-only" csomag szándékosan dob egy hibát, ha nem
      // Next.js webpack/turbopack alias-án keresztül töltődik be (az így
      // védi a build-et kliens-oldali bundle-be szivárgástól) — vitest
      // alatt ezt egy no-op stubra cseréljük, hogy a szerver-only
      // modulokat importáló lib kód tesztelhető maradjon.
      "server-only": path.resolve(__dirname, "test/stubs/server-only.ts"),
      "@": path.resolve(__dirname, "."),
    },
  },
});
