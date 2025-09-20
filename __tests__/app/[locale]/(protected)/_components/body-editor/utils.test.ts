import { describe, expect, it } from "vitest";

import { isJsonLike } from "@/app/[locale]/(protected)/_components/body-editor/utils";

describe("isJsonLike", () => {
  it("returns true for strings wrapped by {} or [] after trimming", () => {
    const truthySamples = [
      "{}",
      "[]",
      " { } ",
      "\n[1,2]\n",
      '\t{\n  "a": 1\n}\t',
    ];

    for (const sample of truthySamples) {
      expect(isJsonLike(sample)).toBe(true);
    }
  });

  it("returns false for empty, whitespace-only, or malformed wrappers", () => {
    const falsySamples = [
      "",
      "   ",
      "{",
      "}",
      "[",
      "]",
      "{]",
      "[}",
      "not json",
      '"{"',
      '"[1]"',
      " {] ",
      " [} ",
    ];

    for (const sample of falsySamples) {
      expect(isJsonLike(sample)).toBe(false);
    }
  });

  it("does not validate JSON content; only first/last non-space characters matter", () => {
    const cases: { expected: boolean; input: string }[] = [
      { input: "{not: 'valid'}", expected: true },
      { input: "[not, valid]", expected: true },
      { input: "{ trailing ]", expected: false },
      { input: "[ leading }", expected: false },
    ];

    for (const { input, expected } of cases) {
      expect(isJsonLike(input)).toBe(expected);
    }
  });
});
