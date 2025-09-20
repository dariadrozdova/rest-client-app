// __tests__/app/[locale]/(public)/page.test.tsx
import React from "react";

import { render, screen } from "@testing-library/react";

// ✅ мок, понимающий namespace (и string, и object)
function buildTranslator(ns?: string) {
  return (key: string) => {
    const dict: Record<string, string> = {
      "main-page.slogan": "Test. Debug. Repeat.",
      "main-page.headline": "Meet the system",
      // на всякий случай поддержим и вызовы без namespace
      slogan: "Test. Debug. Repeat.",
      headline: "Meet the system",
    };
    const full = ns ? `${ns}.${key}` : key;
    return dict[full] ?? dict[key] ?? full;
  };
}
async function mockGetTranslations(argument?: unknown) {
  const ns =
    typeof argument === "string"
      ? argument
      : typeof argument === "object" && argument && "namespace" in argument
        ? String(argument.namespace)
        : undefined;
  return buildTranslator(ns);
}

vi.mock("next-intl/server", () => ({ getTranslations: mockGetTranslations }));

// classNames
vi.mock("@shared/styles", () => ({
  classNames: (...cn: string[]) => cn.filter(Boolean).join(" "),
}));

// дети страницы
vi.mock("@app/[locale]/(public)/components", () => ({
  LogosShowcase: () => <section data-testid="logos" />,
  ThreeDScene: ({ layers }: { layers: string[] }) => (
    <section data-count={layers.length} data-testid="scene" />
  ),
}));

// globals
vi.mock("@/shared/globals", () => ({ LAYERS: ["/l1.png", "/l2.png"] }));

// SUT
import Page from "@app/[locale]/(public)/page";

describe("Public page", () => {
  test("renders slogan/headline and includes ThreeDScene + LogosShowcase", async () => {
    const ui = await Page();
    render(ui);

    expect(
      screen.getByRole("heading", { level: 1, name: "Test. Debug. Repeat." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Meet the system")).toBeInTheDocument();
    expect(screen.getByTestId("scene")).toHaveAttribute("data-count", "2");
    expect(screen.getByTestId("logos")).toBeInTheDocument();
  });
});
