import { NextIntlClientProvider } from "next-intl";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  makeEntry,
  NOW_ISO,
} from "@/__tests__/app/[locale]/(protected)/_components/history-table/fixtures/history";
import { HistoryTableRow } from "@/app/[locale]/(protected)/_components/history-table/history-table-row";

vi.mock("@/features/history/history-row", () => ({
  mapHistoryEntryToRowView: (_entry: unknown) => ({
    httpStatus: 201,
    infoBadges: ["cached", "error"],
    requestTimestamp: NOW_ISO,
  }),
}));
vi.mock("@/utils/helpers/get-method-color", () => ({
  getMethodColor: () => "text-green-700",
}));
vi.mock("@/utils/helpers/get-status-color", () => ({
  getStatusColor: () => "text-blue-700",
}));
vi.mock("@/utils/helpers/get-time-ago", () => ({
  getTimeAgo: () => "just now",
}));

describe("HistoryTableRow", () => {
  it("renders method, status, time and badges, and reflects selection", async () => {
    const entry = makeEntry({
      request: { method: "POST", url: "https://x", headers: {}, body: null },
    });
    const onSelect = vi.fn();
    const onShowDetails = vi.fn();

    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          "history-table": {
            buttons: { show: "Show" },
          },
        }}
      >
        <table>
          <tbody>
            <HistoryTableRow
              entry={entry}
              isSelected
              onSelect={onSelect}
              onShowDetails={onShowDetails}
              tableStyles={{
                cellPadding: "px-4 py-3",
                headerBase: "px-4 py-3",
                headerText: "text-xs",
                textMedium: "font-medium",
              }}
            />
          </tbody>
        </table>
      </NextIntlClientProvider>,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();

    expect(screen.getByText("POST")).toBeInTheDocument();
    expect(screen.getByText("201")).toBeInTheDocument();
    expect(screen.getByText("just now")).toBeInTheDocument();

    expect(screen.getByText("cached")).toBeInTheDocument();
    expect(screen.getByText("error")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("checkbox"));
    expect(onSelect).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole("button", { name: "Show" }));
    expect(onShowDetails).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
