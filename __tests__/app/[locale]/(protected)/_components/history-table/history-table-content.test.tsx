import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HistoryTableContent } from "@app/[locale]/(protected)/_components/history-table/history-table-content";

import { makeEntry } from "@/__tests__/app/[locale]/(protected)/_components/history-table/fixtures/history";

vi.mock(
  "@app/[locale]/(protected)/_components/history-table/history-table-row",
  () => {
    return {
      HistoryTableRow: (props: {
        entry: { id: string };
        isSelected: boolean;
        onSelect: () => void;
        onShowDetails: () => void;
        tableStyles: Record<string, string>;
      }) => (
        <tr data-testid={`row-${props.entry.id}`} onClick={props.onSelect}>
          <td>
            <button
              onClick={(event) => {
                event.stopPropagation();
                props.onShowDetails();
              }}
            >
              Show
            </button>
          </td>
        </tr>
      ),
    };
  },
);

describe("HistoryTableContent", () => {
  it("renders columns and forwards handlers to rows", async () => {
    const ONE = 1;
    const entries = [makeEntry({ id: "a1" }), makeEntry({ id: "b2" })];
    const labels = {
      method: "Method",
      status: "Status",
      time: "Time",
      endpoint: "Endpoint",
    };

    const onSelect = vi.fn();
    const onShowDetails = vi.fn();

    render(
      <HistoryTableContent
        detailsLabel="Details"
        entries={entries}
        labels={labels}
        onSelect={onSelect}
        onShowDetails={onShowDetails}
        selectedEntryId={null}
      />,
    );

    expect(screen.getByText("Method")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("Endpoint")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();

    expect(screen.getAllByTestId(/row-/)).toHaveLength(entries.length);

    await userEvent.click(screen.getByTestId("row-a1"));
    expect(onSelect).toHaveBeenCalledTimes(ONE);

    await userEvent.click(screen.getAllByRole("button", { name: "Show" })[0]);
    expect(onShowDetails).toHaveBeenCalledTimes(ONE);
  });
});
