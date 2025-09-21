import type React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const LABELS = {
  close: "Close modal",
  formMarker: "SignUpFormMarker",
};
const COUNTS = { once: 1 };

vi.mock("@app/[locale]/(auth)/_components/modal", () => ({
  default: (props: React.PropsWithChildren<{ onClose: () => void }>) => (
    <div data-testid="modal">
      <button onClick={props.onClose} type="button">
        {LABELS.close}
      </button>
      {props.children}
    </div>
  ),
}));

vi.mock("@app/[locale]/(auth)/sign-up/_components/sign-up-form", () => ({
  default: () => <div>{LABELS.formMarker}</div>,
}));

import SignUpModal from "@/app/[locale]/(auth)/sign-up/_components/sign-up-modal";

describe("SignUpModal", () => {
  it("renders the sign-up form inside the modal", () => {
    const onClose = vi.fn();
    render(<SignUpModal onClose={onClose} />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText(LABELS.formMarker)).toBeInTheDocument();
  });

  it("calls onClose when the modal's close control is used", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<SignUpModal onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: LABELS.close }));
    expect(onClose).toHaveBeenCalledTimes(COUNTS.once);
  });
});
