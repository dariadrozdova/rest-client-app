import React from "react";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const HOISTED = vi.hoisted(() => ({
  LOCALE_EN: "en",
  LOCALE_RU: "ru",
  LOCALE_BE: "be",
  CHILD_TEXT: "Hello child",
}));

vi.mock("next-intl", async () => {
  const actual = await vi.importActual<typeof import("next-intl")>("next-intl");
  return {
    ...actual,
    hasLocale: (locales: string[], locale: string) => locales.includes(locale),
    NextIntlClientProvider: ({
      children,
    }: {
      children: React.ReactNode;
      locale: string;
      messages: unknown;
    }) => <>{children}</>,
  };
});

vi.mock("next-intl/server", () => ({
  getMessages: async () => ({}),
  setRequestLocale: () => {
    return null;
  },
}));

vi.mock("@/shared/lib/i18n/routing", () => ({
  routing: {
    locales: [HOISTED.LOCALE_EN, HOISTED.LOCALE_RU, HOISTED.LOCALE_BE],
  },
}));

vi.mock("@/store/provider", () => ({
  ReduxProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("@app/[locale]/_components", () => ({
  Header: () => (
    <header aria-label="Header" role="banner">
      Header
    </header>
  ),
  Footer: () => (
    <footer aria-label="Footer" role="contentinfo">
      Footer
    </footer>
  ),
}));

vi.mock("next/navigation", () => {
  const notFound = vi.fn();
  return { notFound };
});

import LocaleLayout, { generateStaticParams } from "@/app/[locale]/layout";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LocaleLayout", () => {
  it("exposes static params for all locales from routing", () => {
    const params = generateStaticParams();
    expect(params).toEqual(
      expect.arrayContaining([
        { locale: HOISTED.LOCALE_EN },
        { locale: HOISTED.LOCALE_RU },
        { locale: HOISTED.LOCALE_BE },
      ]),
    );
  });

  it("renders providers, header, children, and footer when locale is valid", async () => {
    const ui = await LocaleLayout({
      params: { locale: HOISTED.LOCALE_EN },
      children: <div>{HOISTED.CHILD_TEXT}</div>,
    });

    render(ui);

    expect(screen.getByRole("banner", { name: "Header" })).toBeInTheDocument();
    expect(screen.getByText(HOISTED.CHILD_TEXT)).toBeInTheDocument();
    expect(
      screen.getByRole("contentinfo", { name: "Footer" }),
    ).toBeInTheDocument();
  });

  it("calls notFound when locale is invalid", async () => {
    const { notFound } = await import("next/navigation");

    const ui = await LocaleLayout({
      params: { locale: "xx" },
      children: <div>ignored</div>,
    });

    render(ui);
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
