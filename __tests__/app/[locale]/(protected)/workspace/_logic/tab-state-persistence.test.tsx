import React from "react";

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { setActiveTab } from "@store/slices/tab-open-slice";

import { TabStatePersistence } from "@/app/[locale]/(protected)/workspace/_logic";

type Tab = "auth" | "body" | "headers";

let activeTabState: Tab = "headers";
let storedTabValue: null | Tab = "body";

const dispatchSpy = vi.fn();
const setStoredTabSpy = vi.fn<(v: Tab) => void>();

vi.mock("react-redux", () => ({
  useDispatch: () => dispatchSpy,
  useSelector: <T,>(selector: (s: { tabs: { activeTab: Tab } }) => T): T =>
    selector({ tabs: { activeTab: activeTabState } }),
}));

vi.mock("@/utils/hooks/use-storage", () => ({
  useLocalStorage: (
    key: string,
    defaultValue: Tab,
  ): [Tab, (v: Tab) => void] => [
    storedTabValue ?? defaultValue,
    (v: Tab) => {
      storedTabValue = v;
      setStoredTabSpy(v);
    },
  ],
}));

const H = Object.freeze({
  TAB_HEADERS: "headers",
  TAB_BODY: "body",
  TAB_AUTH: "auth",
});

describe("TabStatePersistence", () => {
  beforeEach(() => {
    dispatchSpy.mockClear();
    setStoredTabSpy.mockClear();
    activeTabState = H.TAB_HEADERS;
    storedTabValue = H.TAB_BODY;
  });

  it("initially dispatches stored tab when it differs from current", () => {
    render(<TabStatePersistence />);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: setActiveTab.type,
      payload: H.TAB_BODY,
    });
  });

  it("persists active tab changes to storage", () => {
    const { rerender } = render(<TabStatePersistence />);

    activeTabState = H.TAB_BODY;
    rerender(<TabStatePersistence />);

    expect(setStoredTabSpy).toHaveBeenCalledWith(H.TAB_BODY);
  });

  it("does not loop when stored tab equals active tab", () => {
    activeTabState = H.TAB_BODY;
    storedTabValue = H.TAB_BODY;

    render(<TabStatePersistence />);

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(setStoredTabSpy).not.toHaveBeenCalled();
  });
});
