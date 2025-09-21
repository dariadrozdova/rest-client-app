import { describe, expect, it } from "vitest";

import { isJsonLike } from "@/app/[locale]/(protected)/_components/body-editor/utils";

describe("isJsonLike", () => {
  it("returns true for valid JSON strings wrapped by {} or [] after trimming", () => {
    const truthySamples = [
      "{}",
      "[]",
      " { } ",
      "\n[1,2]\n",
      '\t{\n  "a": 1\n}\t',
      '{"nested": {"key": "value"}}',
      '[{"id": 1}, {"id": 2}]',
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
      "{ trailing ]",
      "[ leading }",
      "{not: 'valid'}",
      "[not, valid]",
      "[][]]]]",
    ];

    for (const sample of falsySamples) {
      expect(isJsonLike(sample)).toBe(false);
    }
  });
});
