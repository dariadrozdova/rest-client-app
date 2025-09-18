import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const H = vi.hoisted(() => {
  const LABELS = { copy: "Copy" } as const;
  const SAMPLE_TEXT = "hello world";
  const ZERO = 0;
  const ONE = 1;
  return { LABELS, SAMPLE_TEXT, ZERO, ONE };
});

let writeTextSpy: ReturnType<typeof vi.fn>;

function ensureClipboard() {
  writeTextSpy = vi.fn();
  const clipboard = { writeText: writeTextSpy };

  Object.defineProperty(navigator, "clipboard", {
    value: clipboard,
    configurable: true,
    writable: true,
  });
}

vi.mock("next-intl", () => {
  function useTranslations(ns: string) {
    if (ns !== "code-gen") {
      throw new Error(`Unexpected ns: ${ns}`);
    }
    return (key: string) => (key === "copy" ? H.LABELS.copy : key);
  }
  return { useTranslations };
});

vi.mock("@/shared/styles", () => ({
  classNames: (...p: string[]) => p.filter(Boolean).join(" "),
}));

import { CopyButton } from "@/app/[locale]/(protected)/_components/codegen/copy-button";

describe("CopyButton", () => {
  beforeEach(() => {
    ensureClipboard();
  });

  it("is disabled when text is empty and has the correct accessible name", () => {
    render(<CopyButton text="" />);
    const button = screen.getByRole("button", { name: H.LABELS.copy });
    expect(button).toBeDisabled();
    expect(writeTextSpy).toHaveBeenCalledTimes(H.ZERO);
  });
});
