import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Row } from "@/app/[locale]/(protected)/_components/history-table/history-modal-row";

describe("Row", () => {
  it("renders label and content", () => {
    render(
      <dl>
        <Row label="Method">
          <span>POST</span>
        </Row>
      </dl>,
    );

    const row = screen.getByText("Method").closest<HTMLElement>("div");
    expect(row).not.toBeNull();
    expect(within(row!).getByText("POST")).toBeInTheDocument();
  });
});
