import React from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-intl", () => {
  return {
    useTranslations: () => (key: string) =>
      key === "go-to-homepage" ? "Go to homepage" : key,
    useLocale: () => "en",
  };
});

vi.mock("next/link", () => ({
  __esModule: true,
  default: (props: React.ComponentProps<"a">) => <a {...props} />,
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, ...rest }: React.ComponentProps<"img">) => (
    <img alt={alt ?? ""} {...rest} />
  ),
}));

import { ErrorTemplate } from "@/shared/ui";

describe("ErrorTemplate", () => {
  const CODE = "500";
  const TITLE = "Something went wrong";
  const DESCRIPTION = "Please try again later.";
  const HOMEPAGE_TEXT = "Go to homepage";
  const EXTRA_TEXT = "Learn more";

  it("renders code, title, optional description, localized home link, image, and extra content", () => {
    render(
      <ErrorTemplate
        code={CODE}
        description={DESCRIPTION}
        extra={<button type="button">{EXTRA_TEXT}</button>}
        title={TITLE}
      />,
    );

    expect(screen.getByText(String(CODE))).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: TITLE }),
    ).toBeVisible();
    expect(screen.getByText(DESCRIPTION)).toBeVisible();

    const homeLink = screen.getByRole("link", { name: HOMEPAGE_TEXT });
    expect(homeLink).toHaveAttribute("href", "/en");

    expect(
      screen.getByRole("img", { name: "Error illustration" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: EXTRA_TEXT }),
    ).toBeInTheDocument();
  });

  it("omits description block when description is not provided", () => {
    render(
      <ErrorTemplate
        code={CODE}
        description={undefined}
        extra={null}
        title={TITLE}
      />,
    );

    expect(screen.queryByText(DESCRIPTION)).toBeNull();
  });
});
