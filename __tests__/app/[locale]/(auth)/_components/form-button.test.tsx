import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "@/app/[locale]/(auth)/_components/form-button";

describe("Button", () => {
  it("renders children", () => {
    const LABEL = "Sign in";
    render(<Button disabled={false}>{LABEL}</Button>);
    expect(screen.getByRole("button", { name: LABEL })).toBeInTheDocument();
  });

  it("has type='submit'", () => {
    const LABEL = "Submit";
    render(<Button disabled={false}>{LABEL}</Button>);
    expect(screen.getByRole("button", { name: LABEL })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("submits a form when enabled", async () => {
    const user = userEvent.setup();
    const SUBMIT_COUNT_ONCE = 1;
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <Button disabled={false}>Submit</Button>
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledTimes(SUBMIT_COUNT_ONCE);
  });

  it("does not submit when disabled", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <Button disabled>Submit</Button>
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });
});
