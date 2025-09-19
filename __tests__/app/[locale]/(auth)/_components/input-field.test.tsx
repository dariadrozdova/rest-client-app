import { useState } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { InputField } from "@/app/[locale]/(auth)/_components/input-field";

function ControlledHarness({
  initial = "",
  onChange,
}: {
  initial?: string;
  onChange: (v: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <InputField
      autoComplete="email"
      onChange={(v) => {
        onChange(v);
        setValue(v);
      }}
      placeholder="Email"
      type="email"
      value={value}
    />
  );
}

describe("InputField", () => {
  it("calls onChange with the full typed value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const TYPED = "user@example.com";
    const EXPECTED_CALLS = TYPED.length;

    render(<ControlledHarness onChange={onChange} />);

    const input = screen.getByPlaceholderText("Email");
    await user.type(input, TYPED);

    expect(onChange).toHaveBeenCalledTimes(EXPECTED_CALLS);
    expect(onChange).toHaveBeenLastCalledWith(TYPED);
    expect(input).toHaveValue(TYPED);
  });
});
