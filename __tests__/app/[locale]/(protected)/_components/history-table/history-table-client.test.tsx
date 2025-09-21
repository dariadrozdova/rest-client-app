import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations:
    () =>
    (k: string): string =>
      k,
}));

const dispatchSpy = vi.fn();
vi.mock("@/store/hooks", () => ({
  useAppDispatch: () => dispatchSpy,
  useAppSelector: (
    sel: (s: { history: { selectedEntryId: null | string } }) => null | string,
  ) => sel({ history: { selectedEntryId: "sel-1" } }),
}));

const SET_SELECTED = "history/setSelectedEntryId";
vi.mock("@/store/slices/history-slice", () => ({
  selectSelectedEntryId: () => "sel-1",
  setSelectedEntryId: (id: string) => ({ type: SET_SELECTED, payload: id }),
}));

vi.mock("@/store/slices/request-slice", () => ({
  executeRequest: (payload: unknown) => ({ type: "request/execute", payload }),
}));

const restoreRequestMock = vi.fn();
vi.mock("@/utils/helpers/restore-request", () => ({
  restoreRequest: (...arguments_: unknown[]) =>
    restoreRequestMock(...arguments_),
}));
vi.mock("@/utils/helpers/resolve-request", () => ({
  selectResolvedRequest: () => ({ resolved: true }),
}));
vi.mock("@/store/store", () => ({
  store: { getState: () => ({}) },
}));

vi.mock(
  "@/app/[locale]/(protected)/_components/history-table/history-header",
  () => ({
    HistoryHeader: (p: {
      canRerun: boolean;
      onRerun: () => void;
      title: string;
    }) => (
      <button disabled={!p.canRerun} onClick={p.onRerun}>
        Rerun
      </button>
    ),
  }),
);
vi.mock(
  "@/app/[locale]/(protected)/_components/history-table/history-table-content",
  () => ({
    HistoryTableContent: (p: {
      detailsLabel: string;
      entries: { id: string }[];
      labels: Record<string, string>;
      onSelect: (event: { id: string }) => void;
      onShowDetails: (event: { id: string }) => void;
      selectedEntryId: null | string;
    }) => (
      <div>
        <button onClick={() => p.onSelect(p.entries[0])}>Select first</button>
        <button onClick={() => p.onShowDetails(p.entries[0])}>
          Show details
        </button>
        <div data-testid="selected">{p.selectedEntryId ?? ""}</div>
      </div>
    ),
  }),
);

vi.mock(
  "@/app/[locale]/(protected)/_components/history-table/request-details-modal",
  () => ({
    __esModule: true,
    default: (p: { onCloseAction: () => void; open: boolean }) =>
      p.open ? (
        <div aria-modal="true" role="dialog">
          <div>Modal body</div>
          <button onClick={p.onCloseAction}>Close</button>
        </div>
      ) : null,
  }),
);

const ENTRIES = [
  {
    id: "sel-1",
    createdAt: "2025-01-01T00:00:00.000Z",
    request: {
      method: "GET",
      url: "https://api.example.com",
      headers: {},
      body: null,
    },
    response: {
      status: 200,
      statusText: "OK",
      error: null,
      meta: {
        requestDurationMs: 10,
        requestSizeBytes: 1,
        responseSizeBytes: 2,
        requestTimestamp: "2025-01-01T00:00:00.000Z",
      },
    },
  },
];

describe("HistoryTableClient", () => {
  beforeEach(() => {
    dispatchSpy.mockClear();
    restoreRequestMock.mockClear();
  });

  it("selects an entry, opens details modal, and reruns selected", async () => {
    const ONE = 1 as const;

    const module_ = await import(
      "@/app/[locale]/(protected)/_components/history-table/history-table-client"
    );
    const { HistoryTableClient } = module_;

    render(
      <HistoryTableClient
        detailsLabel="Details"
        entries={ENTRIES}
        labels={{
          endpoint: "Endpoint",
          method: "Method",
          status: "Status",
          time: "Time",
        }}
        title="History"
      />,
    );

    await userEvent.click(screen.getByText("Select first"));
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "history/setSelectedEntryId",
      payload: "sel-1",
    });
    expect(restoreRequestMock).toHaveBeenCalledTimes(ONE);

    await userEvent.click(screen.getByText("Show details"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const rerun = screen.getByRole("button", { name: "Rerun" });
    expect(rerun).toBeEnabled();
    await userEvent.click(rerun);

    expect(restoreRequestMock).toHaveBeenCalledTimes(2);

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "request/execute",
      payload: { resolved: true },
    });
  });
});
