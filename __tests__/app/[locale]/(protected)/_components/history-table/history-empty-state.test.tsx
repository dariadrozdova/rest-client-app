import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

vi.mock("@shared/lib/i18n/navigation", () => ({
  Link: (
    props: React.PropsWithChildren<{ className?: string; href: string }>,
  ) => (
    <a className={props.className} href={props.href}>
      {props.children}
    </a>
  ),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    if (key === "empty.message") {
      return "History is empty.";
    }
    if (key === "empty.goToHeaders") {
      return "Create new request";
    }
    return key;
  },
}));

import { HistoryEmptyState } from "@/app/[locale]/(protected)/_components/history-table/history-empty-state";

describe("HistoryEmptyState", () => {
  it("shows empty state message and link to /rest", () => {
    render(<HistoryEmptyState />);

    expect(screen.getByText("History is empty.")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Create new request" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
  });
});
