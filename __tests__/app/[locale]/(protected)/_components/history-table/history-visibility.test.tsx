import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("HistoryVisibility", () => {
  it("shows children when activeTab is requestHistory", async () => {
    vi.resetModules();

    vi.doMock("react-redux", () => ({
      useSelector: (
        selector: (s: { tabs: { activeTab: string } }) => unknown,
      ) => selector({ tabs: { activeTab: "requestHistory" } }),
    }));

    const { HistoryVisibility } = await import(
      "@/app/[locale]/(protected)/_components/history-table/history-visibility"
    );

    render(
      <HistoryVisibility>
        <div>Inside</div>
      </HistoryVisibility>,
    );

    const element = screen.getByText("Inside").parentElement!;
    await waitFor(() => {
      expect(element).not.toHaveClass("hidden");
    });
  });

  it("hides children when activeTab is different", async () => {
    vi.resetModules();

    vi.doMock("react-redux", () => ({
      useSelector: (
        selector: (s: { tabs: { activeTab: string } }) => unknown,
      ) => selector({ tabs: { activeTab: "anotherTab" } }),
    }));

    const { HistoryVisibility } = await import(
      "@/app/[locale]/(protected)/_components/history-table/history-visibility"
    );

    render(
      <HistoryVisibility>
        <div>Inside</div>
      </HistoryVisibility>,
    );

    const element = screen.getByText("Inside").parentElement!;
    await waitFor(() => {
      expect(element).toHaveClass("hidden");
    });
  });
});
