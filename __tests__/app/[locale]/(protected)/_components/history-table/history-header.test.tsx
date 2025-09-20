import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HistoryHeader } from "@/app/[locale]/(protected)/_components/history-table/history-header";

describe("HistoryHeader", () => {
  const TITLE = "Request history";

  it("disables Rerun when canRerun=false", async () => {
    const onRerun = vi.fn();
    render(<HistoryHeader canRerun={false} onRerun={onRerun} title={TITLE} />);
    expect(
      screen.getByRole("heading", { level: 2, name: TITLE }),
    ).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "Rerun" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onRerun).not.toHaveBeenCalled();
  });

  it("enables Rerun and calls handler", async () => {
    const onRerun = vi.fn();
    render(<HistoryHeader canRerun onRerun={onRerun} title={TITLE} />);
    const button = screen.getByRole("button", { name: "Rerun" });
    expect(button).toBeEnabled();
    await userEvent.click(button);
    expect(onRerun).toHaveBeenCalledTimes(1);
  });
});
