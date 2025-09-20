import { describe, expect, it, vi } from "vitest";

vi.mock("use-intl", () => ({
  useLocale: () => "en",
  useTranslations:
    () =>
    (key: string): string =>
      key,
}));

vi.mock(
  "@app/[locale]/(protected)/_components/history-table/modal-content",
  () => ({
    ModalContent: () => <div>Modal body</div>,
  }),
);

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RequestDetailsModal from "@app/[locale]/(protected)/_components/history-table/request-details-modal";

import { makeEntry } from "@/__tests__/app/[locale]/(protected)/_components/history-table/fixtures/history";

describe("RequestDetailsModal", () => {
  it("does not render when closed or entry is null", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <RequestDetailsModal
        entry={makeEntry()}
        onCloseAction={onClose}
        open={false}
      />,
    );
    expect(screen.queryByText("Modal body")).not.toBeInTheDocument();

    rerender(<RequestDetailsModal entry={null} onCloseAction={onClose} open />);
    expect(screen.queryByText("Modal body")).not.toBeInTheDocument();
  });

  it("renders when open and closes on overlay or button click", async () => {
    const TIMES_ONCE = 1 as const;
    const onClose = vi.fn();
    render(
      <RequestDetailsModal entry={makeEntry()} onCloseAction={onClose} open />,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Modal body")).toBeInTheDocument();

    const root = dialog.parentElement ?? document.body;
    const overlay =
      root.querySelector("[data-radix-dialog-overlay]") ||
      root.querySelector("[data-dialog-overlay]") ||
      root.querySelector('[data-state="open"][class*="overlay"]') ||
      root.querySelector('[role="presentation"]');

    if (overlay instanceof HTMLElement) {
      await userEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(TIMES_ONCE);
    }

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose.mock.calls.length).toBeGreaterThanOrEqual(TIMES_ONCE);
  });
});
