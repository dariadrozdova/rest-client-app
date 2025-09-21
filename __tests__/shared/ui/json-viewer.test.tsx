import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { JsonViewer } from "@/shared/ui/json-viewer";

describe("JsonViewer", () => {
  it("works in text mode without line numbers", () => {
    const initial = '{\n  "a": 1\n}';
    const placeholder = "Enter JSON";
    const next = "changed";
    const onChange = vi.fn();

    render(
      <JsonViewer
        content={initial}
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

  it("renders line numbers", () => {
    const lines = ["line-1", "line-2", "line-3"];
    const content = lines.join("\n");

    render(<JsonViewer content={content} onChange={vi.fn()} showLineNumbers />);

    const monoRows = screen.getAllByText(/^\d+$/);
    const expectedCount = lines.length;
    expect(monoRows).toHaveLength(expectedCount);

    const FIRST_INDEX = 0;
    const lastIndex = expectedCount - 1;
    expect(monoRows[FIRST_INDEX]).toHaveTextContent("1");
    expect(monoRows[lastIndex]).toHaveTextContent(String(expectedCount));
  });
});
