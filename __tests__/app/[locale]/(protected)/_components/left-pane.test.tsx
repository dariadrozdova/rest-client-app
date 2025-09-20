import React from "react";

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

vi.mock("@/app/[locale]/(protected)/_components/left-pane.client", () => ({
  LeftPaneClient: () => {
    const active = (
      { tabs: { activeTab: H.STATE.value.tabs.activeTab } } as const
    ).tabs.activeTab;

    if (active === "headers") {
      return <div data-testid={H.TESTIDS.headers} />;
    }
    if (active === "body") {
      return <div data-testid={H.TESTIDS.body} />;
    }
    if (active === "codegen") {
      return <div data-testid={H.TESTIDS.codegen} />;
    }
    if (active === "variables") {
      return <div data-testid={H.TESTIDS.variables} />;
    }

    return null;
  },
}));

vi.mock(
  "@/app/[locale]/(protected)/_components/history-table/history-visibility",
  () => ({
    HistoryVisibility: ({ children }: { children: React.ReactNode }) => {
      const isHistory = H.STATE.value.tabs.activeTab === "requestHistory";
      return isHistory ? <>{children}</> : null;
    },
  }),
);

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

async function renderLeftPane() {
  const ui = await LeftPane();
  if (!React.isValidElement(ui)) {
    throw new TypeError("LeftPane did not return a valid React element.");
  }
  return render(ui);
}

describe("LeftPane", () => {
  beforeEach(() => {
    H.STATE.value = { tabs: { activeTab: "headers" } };
  });

  it("applies the expected container class", async () => {
    const { container } = await renderLeftPane();
    const root = getRoot(container);
    expect(root.className.split(" ")).toContain(H.CONTAINER_CLASS);
  });

  it("renders the correct editor/panel based on activeTab", async () => {
    for (const { key, testId } of H.TABS) {
      H.STATE.value = { tabs: { activeTab: key } };
      const { unmount } = await renderLeftPane();
      expect(screen.getByTestId(testId)).toBeInTheDocument();
      unmount();
    }
  });

  it("renders only the selected tab's component at a time", async () => {
    H.STATE.value = { tabs: { activeTab: "variables" } };
    await renderLeftPane();

    expect(screen.getByTestId(H.TESTIDS.variables)).toBeInTheDocument();
    expect(screen.queryByTestId(H.TESTIDS.headers)).toBeNull();
    expect(screen.queryByTestId(H.TESTIDS.body)).toBeNull();
    expect(screen.queryByTestId(H.TESTIDS.codegen)).toBeNull();
    expect(screen.queryByTestId(H.TESTIDS.history)).toBeNull();
  });
});
