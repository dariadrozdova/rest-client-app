import React, { ComponentProps } from "react";

import { render, screen } from "@testing-library/react";

function MockLink({ href, children, ...rest }: ComponentProps<"a">) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

vi.mock("@shared/lib/i18n/navigation", () => ({
  Link: MockLink,
}));

const getServerSessionMock = vi.fn();
vi.mock("@/shared/lib/auth/get-session", () => ({
  getServerSession: (...argument: unknown[]) =>
    getServerSessionMock(...argument),
}));

vi.mock("@/app/[locale]/_components/language-switch", () => ({
  LanguageSwitch: () => <div data-testid="lang-switch" />,
}));

vi.mock("@/shared/ui/sign-out-button", () => ({
  default: ({ label }: { label: string }) => <button>{label}</button>,
}));

async function mockGetTranslations() {
  return (key: string) => {
    const dict: Record<string, string> = {
      login: "Войти",
      signup: "Регистрация",
      logoff: "Выйти",
    };
    return dict[key] ?? key;
  };
}

vi.mock("next-intl/server", () => ({
  getTranslations: mockGetTranslations,
}));

import Header from "@app/[locale]/_components/header";

describe("Header", () => {
  test("без сессии показывает Войти/Регистрация", async () => {
    getServerSessionMock.mockResolvedValueOnce(null);
    const ui = await Header();
    render(ui);

    expect(screen.getByTestId("lang-switch")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Войти" })).toHaveAttribute(
      "href",
      "/sign-in",
    );
    expect(screen.getByRole("link", { name: "Регистрация" })).toHaveAttribute(
      "href",
      "/sign-up",
    );
    expect(screen.queryByText("Выйти")).not.toBeInTheDocument();
  });

  test("с сессией показывает Выйти", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: { name: "A" } });
    const ui = await Header();
    render(ui);

    expect(screen.getByText("Выйти")).toBeInTheDocument();
    expect(screen.queryByText("Войти")).not.toBeInTheDocument();
    expect(screen.queryByText("Регистрация")).not.toBeInTheDocument();
  });
});
