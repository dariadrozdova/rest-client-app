import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const H = vi.hoisted(() => {
  const TESTIDS = {
    headers: "headers-editor",
    body: "body-editor",
    codegen: "codegen-panel",
    variables: "variables-editor",
    history: "history-table",
  } as const;

  type TabKey = "body" | "codegen" | "headers" | "requestHistory" | "variables";

  const STATE: { value: { tabs: { activeTab: TabKey } } } = {
    value: { tabs: { activeTab: "headers" } },
  };

  const CONTAINER_CLASS = "col-start-1" as const;

  const TABS: readonly { key: TabKey; testId: string }[] = [
    { key: "headers", testId: TESTIDS.headers },
    { key: "body", testId: TESTIDS.body },
    { key: "codegen", testId: TESTIDS.codegen },
    { key: "variables", testId: TESTIDS.variables },
    { key: "requestHistory", testId: TESTIDS.history },
  ] as const;

  return { TESTIDS, STATE, CONTAINER_CLASS, TABS };
});

vi.mock("react-redux", () => {
  function useSelector<T>(selector: (s: unknown) => T): T {
    return selector({ tabs: { activeTab: H.STATE.value.tabs.activeTab } });
  }
  return { useSelector };
});

vi.mock("@app/[locale]/(protected)/_components/body-editor", () => ({
  BodyEditor: () => <div data-testid={H.TESTIDS.body} />,
}));
vi.mock("@app/[locale]/(protected)/_components/codegen/codegen-panel", () => ({
  CodegenPanel: () => <div data-testid={H.TESTIDS.codegen} />,
}));
vi.mock("@app/[locale]/(protected)/_components/headers-editor", () => ({
  HeadersEditor: () => <div data-testid={H.TESTIDS.headers} />,
}));
vi.mock("@app/[locale]/(protected)/_components/variables-editor", () => ({
  VariablesEditor: () => <div data-testid={H.TESTIDS.variables} />,
}));
vi.mock(
  "@/app/[locale]/(protected)/_components/history-table/history-table",
  () => ({ HistoryTable: () => <div data-testid={H.TESTIDS.history} /> }),
);

import { LeftPane } from "@/app/[locale]/(protected)/_components/left-pane";

function getRoot(container: HTMLElement): HTMLDivElement {
  const element = container.firstElementChild;
  if (!(element instanceof HTMLDivElement)) {
    throw new TypeError("Root element is not a div.");
  }
  return element;
}

describe("LeftPane", () => {
  beforeEach(() => {
    H.STATE.value = { tabs: { activeTab: "headers" } };
  });

  it("applies the expected container class", () => {
    const { container } = render(<LeftPane />);
    const root = getRoot(container);
    expect(root.className.split(" ")).toContain(H.CONTAINER_CLASS);
  });

  it("renders the correct editor/panel based on activeTab", () => {
    for (const { key, testId } of H.TABS) {
      H.STATE.value = { tabs: { activeTab: key } };
      const { unmount } = render(<LeftPane />);
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      unmount();
    }
  });

  it("renders only the selected tab's component at a time", () => {
    H.STATE.value = { tabs: { activeTab: "variables" } };
    render(<LeftPane />);

    expect(screen.getByTestId(H.TESTIDS.variables)).toBeInTheDocument();

    expect(screen.queryByTestId(H.TESTIDS.headers)).toBeNull();
    expect(screen.queryByTestId(H.TESTIDS.body)).toBeNull();
    expect(screen.queryByTestId(H.TESTIDS.codegen)).toBeNull();
    expect(screen.queryByTestId(H.TESTIDS.history)).toBeNull();
  });
});
