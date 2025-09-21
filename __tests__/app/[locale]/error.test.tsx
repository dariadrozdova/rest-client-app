import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GlobalError from "@/app/[locale]/error";

const T_TRY_AGAIN = "Try again";
const T_TITLE = "Global error title";
const T_DESC = "Something went wrong globally";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const dict: Record<string, string> = {
      "error-page.try-again": T_TRY_AGAIN,
      "error-page.global-error-title": T_TITLE,
      "error-page.global-error-description": T_DESC,
    };
    return dict[`error-page.${key}`] ?? key;
  },
}));

interface MockErrorTemplateProps {
  code: string;
  description?: string;
  extra?: React.ReactNode;
  title?: string;
}
vi.mock("@/shared/ui", () => ({
  ErrorTemplate: (props: MockErrorTemplateProps) => (
    <section aria-label="error-template">
      <div data-testid="code">{props.code}</div>
      {props.title ? <h1>{props.title}</h1> : null}
      {props.description ? <p>{props.description}</p> : null}
      <div data-testid="extra">{props.extra}</div>
    </section>
  ),
}));

describe("GlobalError", () => {
  it("renders 500 error with localized title/description and extra retry button that calls reset", () => {
    const reset = vi.fn();
    const error = new Error("boom");

    render(<GlobalError error={error} reset={reset} />);

    expect(screen.getByTestId("code").textContent).toBe("500");
    expect(
      screen.getByRole("heading", { level: 1, name: T_TITLE }),
    ).toBeVisible();
    expect(screen.getByText(T_DESC)).toBeVisible();

    const button = screen.getByRole("button", { name: T_TRY_AGAIN });
    fireEvent.click(button);
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
