import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Dropdown } from "@/shared/ui/dropdown";

// Mock utilities used by the component
vi.mock("@/shared/styles", () => ({
  classNames: (...xs: unknown[]) => xs.filter(Boolean).join(" "),
}));
vi.mock("@/utils/hooks/use-outside-click", () => ({
  useOutsideClick: () => void 0,
}));

interface Opt {
  isActive?: boolean;
  key?: string;
  label: string;
  value: string;
}

describe("Dropdown", () => {
  const widthClass = "w-40";
  const first = { label: "One", value: "1" };
  const second = { label: "Two", value: "2" };
  const options: Opt[] = [first, second];

  let onSelect: (v: string) => void;

  beforeEach(() => {
    onSelect = vi.fn();
  });

  it("renders selected label and toggles list", async () => {
    render(
      <Dropdown
        onSelect={onSelect}
        options={options}
        selectedValue={first.value}
        width={widthClass}
      />,
    );

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: first.label });
    const collapsed = false;
    expect(button).toHaveAttribute("aria-expanded", String(collapsed));

    await user.click(button);
    const expanded = true;
    expect(button).toHaveAttribute("aria-expanded", String(expanded));

    // Listbox appears with options
    const list = screen.getByRole("listbox");
    expect(list.className).toContain(widthClass);
    expect(
      screen.getByRole("option", { name: first.label }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: second.label }),
    ).toBeInTheDocument();

    // Arrow rotates when open
    const arrow = button.querySelector("svg");
    const rotationClass = "rotate-180";
    expect(arrow?.className.baseVal ?? "").toContain(rotationClass);

    // Selecting an option calls onSelect and closes the list
    await user.click(screen.getByRole("option", { name: second.label }));
    expect(onSelect).toHaveBeenCalledWith(second.value);

    // menu closed
    expect(button).toHaveAttribute("aria-expanded", String(collapsed));
  });

  it("falls back to empty label if no selection found", () => {
    render(
      <Dropdown
        onSelect={onSelect}
        options={options}
        selectedValue="unknown"
      />,
    );
    // Button still present with empty label span
    const button = screen.getByRole("button");
    const span = button.querySelector("span");
    const empty = "";
    expect(span?.textContent).toBe(empty);
  });
});
