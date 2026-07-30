import { describe, expect, it } from "vitest";
import { escapeHtml, renderEmailString } from "./render";

describe("escapeHtml", () => {
  it("escapes the five HTML-significant characters", () => {
    expect(escapeHtml(`<img src=x onerror="alert('hi')">&`)).toBe(
      "&lt;img src=x onerror=&quot;alert(&#39;hi&#39;)&quot;&gt;&amp;",
    );
  });

  it("leaves plain text untouched", () => {
    expect(escapeHtml("Teszt Elek")).toBe("Teszt Elek");
  });
});

describe("renderEmailString", () => {
  it("substitutes known variables", () => {
    expect(renderEmailString("Hello {{name}}!", { name: "World" })).toBe(
      "Hello World!",
    );
  });

  it("leaves an unknown placeholder untouched", () => {
    expect(renderEmailString("Hello {{missing}}!", {})).toBe(
      "Hello {{missing}}!",
    );
  });

  it("does not itself escape anything (caller's responsibility per context)", () => {
    expect(
      renderEmailString("{{value}}", { value: "<script>alert(1)</script>" }),
    ).toBe("<script>alert(1)</script>");
  });
});
