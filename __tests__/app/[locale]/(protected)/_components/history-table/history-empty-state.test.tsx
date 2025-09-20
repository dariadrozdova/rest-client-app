import { render, screen } from "@testing-library/react";
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

import { HistoryEmptyState } from "@/app/[locale]/(protected)/_components/history-table/history-empty-state";

describe("HistoryEmptyState", () => {
  it("shows empty state message and link to /rest", () => {
    render(<HistoryEmptyState />);

    expect(screen.getByText("History is empty.")).toBeInTheDocument();
    expect(screen.getByText("Create new request")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "Client" });
    expect(link).toHaveAttribute("href", "/rest");
  });
});
