import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Modal from "@/app/[locale]/(auth)/_components/modal";

function renderModal(onClose: () => void) {
  const CHILD_TEXT = "Hello inside modal";
  render(
    <Modal onClose={onClose}>
      <div>{CHILD_TEXT}</div>
    </Modal>,
  );
  return { childText: CHILD_TEXT };
}

describe("Modal", () => {
  it("renders children", () => {
    const onClose = vi.fn();
    const { childText } = renderModal(onClose);
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it("has a close button with accessible label", () => {
    const onClose = vi.fn();
    renderModal(onClose);
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("calls onClose when clicking the backdrop", async () => {
    const user = userEvent.setup();
    const CLICK_COUNT_ONCE = 1;
    const onClose = vi.fn();
    renderModal(onClose);

    const backdrop =
      screen.getByText(/hello inside modal/i).parentElement?.parentElement;
    expect(backdrop).toBeTruthy();

    if (backdrop) {
      await user.pointer([{ target: backdrop, keys: "[MouseLeft]" }]);
    }

    expect(onClose).toHaveBeenCalledTimes(CLICK_COUNT_ONCE);
  });

  it("does not close when clicking inside content", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderModal(onClose);

    const content = screen.getByText(/hello inside modal/i).parentElement;
    expect(content).toBeTruthy();

    if (content) {
      await user.pointer([{ target: content, keys: "[MouseLeft]" }]);
    }

    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when clicking the Close button", async () => {
    const user = userEvent.setup();
    const CLICK_COUNT_ONCE = 1;
    const onClose = vi.fn();
    renderModal(onClose);

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(CLICK_COUNT_ONCE);
  });
});
