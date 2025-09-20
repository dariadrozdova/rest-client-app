import React from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import NotFound from "@/app/[locale]/not-found";

const T_TITLE = "Page not found";
const T_DESC = "The page you are looking for does not exist.";

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => {
    const dict: Record<string, string> = {
      "error-page.not-found-title": T_TITLE,
      "error-page.not-found-description": T_DESC,
    };
    return dict[`error-page.${key}`] ?? key;
  },
}));

interface MockErrorTemplateProps {
  code: string;
  description?: string;
  title?: string;
}
vi.mock("@/shared/ui", () => ({
  ErrorTemplate: (props: MockErrorTemplateProps) => (
    <section aria-label="error-template">
      <div data-testid="code">{props.code}</div>
      {props.title ? <h1>{props.title}</h1> : null}
      {props.description ? <p>{props.description}</p> : null}
    </section>
  ),
}));

describe("NotFound", () => {
  it("renders 404 not-found page with localized title/description", async () => {
    render(await NotFound());

    expect(screen.getByTestId("code").textContent).toBe("404");
    expect(
      screen.getByRole("heading", { level: 1, name: T_TITLE }),
    ).toBeVisible();
    expect(screen.getByText(T_DESC)).toBeVisible();
  });
});
