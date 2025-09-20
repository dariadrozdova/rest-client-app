import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const GLOBALS = vi.hoisted(() => ({
  CHAR_WIDTH_REM: 0.6,
  LINE_HEIGHT_REM: 1.25,
  PADDING_REM: 1,
}));

vi.mock("@/shared/globals", () => GLOBALS);

import { JsonViewer } from "@/shared/ui";

describe("JsonViewer", () => {
  it("works in text mode without line numbers", () => {
    const initial = '{\n  "a": 1\n}';
    const placeholder = "Enter JSON";
    const next = "changed";
    const onChange = vi.fn();

    render(
      <JsonViewer
        content={initial}
        mode="text"
        onChange={onChange}
        placeholder={placeholder}
        showLineNumbers={false}
      />,
    );

    const textarea = screen.getByPlaceholderText(placeholder);
    expect(textarea).toHaveValue(initial);
    fireEvent.change(textarea, { target: { value: next } });
    expect(onChange).toHaveBeenCalledWith(next);
  });

  it("renders line numbers and syncs scroll", () => {
    const lines = ["line-1", "line-2", "line-3"];
    const content = lines.join("\n");

    render(<JsonViewer content={content} mode="json" showLineNumbers />);

    const monoRows = screen.getAllByText(/^\d+$/);
    const expectedCount = lines.length;
    expect(monoRows).toHaveLength(expectedCount);

    const FIRST_INDEX = 0;
    const lastIndex = expectedCount - 1;
    expect(monoRows[FIRST_INDEX]).toHaveTextContent("1");
    expect(monoRows[lastIndex]).toHaveTextContent(String(expectedCount));

    const PARENT_LEVELS_TO_GUTTER = 2;

    function ascend(element: Element, levels: number): Element | null {
      let current: Element | null = element;
      for (let index = 0; index < levels; index += 1) {
        current = current?.parentElement ?? null;
        if (!current) {
          return null;
        }
      }
      return current;
    }

    function isHTMLDivElement(
      element: Element | null,
    ): element is HTMLDivElement {
      return Boolean(element) && element instanceof HTMLDivElement;
    }

    const maybeGutter = ascend(monoRows[FIRST_INDEX], PARENT_LEVELS_TO_GUTTER);
    if (!isHTMLDivElement(maybeGutter)) {
      throw new Error("gutter container not found");
    }
    const gutter = maybeGutter;

    const setter = vi.fn();
    const getter = () => 0;
    Object.defineProperty(gutter, "scrollTop", {
      configurable: true,
      get: getter,
      set: setter,
    });

    const textarea = screen.getByRole("textbox");
    const SCROLL_AMOUNT = 37;
    Object.defineProperty(textarea, "scrollTop", {
      value: SCROLL_AMOUNT,
      writable: true,
    });
    fireEvent.scroll(textarea);

    expect(setter).toHaveBeenCalledWith(SCROLL_AMOUNT);
  });
});
