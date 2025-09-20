import React from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SimpleTable } from "@/shared/ui";

describe("SimpleTable", () => {
  const LABEL = "Demo table";
  const USER_CLASS = "rounded-lg";
  const BASE_CLASSES = ["w-full", "border", "border-gray-200", "text-sm"];
  const WRAPPER_CLASS = "overflow-x-auto";
  const CELL_TEXT = "Hello";

  it("renders a table inside an overflow wrapper and forwards ref", () => {
    const reference = React.createRef<HTMLTableElement>();

    render(
      <SimpleTable aria-label={LABEL} className={USER_CLASS} ref={reference}>
        <thead>
          <tr>
            <th>Col</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{CELL_TEXT}</td>
          </tr>
        </tbody>
      </SimpleTable>,
    );

    const table = screen.getByRole("table", { name: LABEL });
    expect(table).toBeInTheDocument();

    const wrapper = table.parentElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper?.className).toContain(WRAPPER_CLASS);

    for (const cls of BASE_CLASSES) {
      expect(table.className).toContain(cls);
    }
    expect(table.className).toContain(USER_CLASS);

    expect(screen.getByText(CELL_TEXT)).toBeVisible();

    expect(reference.current).toBe(table);
  });

  it("passes through arbitrary table props (e.g., data-testid)", () => {
    const TEST_ID = "my-table";
    render(
      <SimpleTable data-testid={TEST_ID}>
        <tbody>
          <tr>
            <td>1</td>
          </tr>
        </tbody>
      </SimpleTable>,
    );
    expect(screen.getByTestId(TEST_ID)).toBeInTheDocument();
  });
});
