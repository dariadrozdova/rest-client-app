import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const H = vi.hoisted(() => {
  const NAMESPACE = "protected-header";
  const LABELS = {
    loading: "Loading…",
    sendButton: "Send",
    httpsPrefix: "https://",
    urlPlaceholder: "api.example.com/path...",
    tabs: {
      headers: "Headers",
      body: "Body",
      variables: "Variables",
      codegen: "Codegen",
      requestHistory: "Request history",
    },
  } as const;

  const ACTIONS = {
    EXECUTE_REQUEST: "request/execute",
    SET_ACTIVE_TAB: "tabs/setActiveTab",
    SET_URL: "url/setUrl",
  } as const;

  const TAB_KEYS = [
    "headers",
    "body",
    "variables",
    "codegen",
    "requestHistory",
  ] as const;

  type TabKey = (typeof TAB_KEYS)[number];
  interface TestState {
    httpUrl: { httpUrl: string };
    request: { isLoading: boolean };
    resolved: {
      canGenerate: boolean;
    };
    tabs: { activeTab: TabKey };
  }

  const STATE: { value: TestState } = {
    value: {
      tabs: { activeTab: "headers" },
      httpUrl: { httpUrl: "https://api.initial.example/v1" },
      request: { isLoading: false },
      resolved: { canGenerate: true },
    },
  };

  const stripProtocol = (url: string) => url.replace(/^https?:\/\//i, "");

  return {
    NAMESPACE,
    LABELS,
    ACTIONS,
    TAB_KEYS,
    STATE,
    stripProtocol,
  };
});

function getButtonByName(name: string): HTMLButtonElement {
  const element = screen.getByRole("button", { name });
  if (!(element instanceof HTMLButtonElement)) {
    throw new TypeError(`Element named "${name}" is not a button`);
  }
  return element;
}

const DISPATCH_ARG_INDEX = 0;

const mockDispatch = vi.fn();

vi.mock("react-redux", () => {
  function useDispatch() {
    return mockDispatch;
  }
  function useSelector<T>(selector: (state: unknown) => T): T {
    return selector(H.STATE.value);
  }
  return { useDispatch, useSelector };
});

vi.mock("next-intl", () => {
  const { NAMESPACE, LABELS } = H;
  function useTranslations(expectedNs: string) {
    if (expectedNs !== NAMESPACE) {
      throw new Error(`Unexpected namespace: ${expectedNs}`);
    }
    function isTabKey(k: string): k is keyof typeof LABELS.tabs {
      return Object.prototype.hasOwnProperty.call(LABELS.tabs, k);
    }
    return (key: string) => {
      if (key === "loading") {
        return LABELS.loading;
      }
      if (key === "sendButton") {
        return LABELS.sendButton;
      }
      if (key.startsWith("tabs.")) {
        const rawKey = key.split(".")[1] ?? "";
        if (isTabKey(rawKey)) {
          return LABELS.tabs[rawKey];
        }
      }
      return key;
    };
  }
  return { useTranslations };
});

vi.mock("@app/[locale]/(protected)/_components/method-switch", () => ({
  MethodSwitch: () => <div data-testid="method-switch" />,
}));

vi.mock("@/store/selectors/request-selector", () => ({
  selectIsLoading: (state: { request: { isLoading: boolean } }) =>
    state.request.isLoading,
}));

vi.mock("@/utils/helpers/resolve-request", () => ({
  selectResolvedRequest: (state: { resolved: { canGenerate: boolean } }) =>
    state.resolved,
}));

vi.mock("@/shared/styles", () => ({
  classNames: (...parts: string[]) => parts.filter(Boolean).join(" "),
}));

vi.mock("@store/slices/request-slice", () => {
  const { ACTIONS } = H;
  return {
    executeRequest: (payload: unknown) => ({
      type: ACTIONS.EXECUTE_REQUEST,
      payload,
    }),
  };
});

vi.mock("@store/slices/tab-open-slice", () => {
  const { ACTIONS } = H;
  return {
    setActiveTab: (payload: (typeof H.TAB_KEYS)[number]) => ({
      type: ACTIONS.SET_ACTIVE_TAB,
      payload,
    }),
  };
});

vi.mock("@store/slices/url-slice", () => {
  const { ACTIONS } = H;
  return {
    setUrl: (payload: string) => ({
      type: ACTIONS.SET_URL,
      payload,
    }),
  };
});

import { LeftHeaderGroup } from "@/app/[locale]/(protected)/_components/left-header-group";

describe("LeftHeaderGroup", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    H.STATE.value = {
      tabs: { activeTab: "headers" },
      httpUrl: { httpUrl: "https://api.initial.example/v1" },
      request: { isLoading: false },
      resolved: { canGenerate: true },
    };
  });

  it("renders MethodSwitch, URL prefix label, input with stripped protocol, and Send button", () => {
    const { LABELS } = H;

    render(<LeftHeaderGroup />);

    expect(screen.getByTestId("method-switch")).toBeInTheDocument();

    expect(screen.getByText(LABELS.httpsPrefix)).toBeInTheDocument();

    const input = screen.getByRole("textbox", { name: H.LABELS.httpsPrefix });

    expect(input).toHaveAttribute("placeholder", LABELS.urlPlaceholder);

    const sendButton = getButtonByName(LABELS.sendButton);
    expect(sendButton).toBeInTheDocument();
  });

  it("enables the Send button only when canSendRequest=true and not loading", async () => {
    const { LABELS } = H;

    H.STATE.value = {
      ...H.STATE.value,
      httpUrl: { httpUrl: "https://enabled.example" },
      request: { isLoading: false },
      resolved: { canGenerate: true },
    };
    const { unmount: ua } = render(<LeftHeaderGroup />);
    let sendButton = getButtonByName(LABELS.sendButton);
    expect(sendButton.disabled).toBe(false);
    ua();

    H.STATE.value = {
      ...H.STATE.value,
      request: { isLoading: true },
      resolved: { canGenerate: true },
      httpUrl: { httpUrl: "https://still.valid" },
    };
    const { unmount: ub } = render(<LeftHeaderGroup />);
    sendButton = getButtonByName(LABELS.loading);
    expect(sendButton.disabled).toBe(true);
    ub();

    H.STATE.value = {
      ...H.STATE.value,
      request: { isLoading: false },
      resolved: { canGenerate: false },
      httpUrl: { httpUrl: "https://valid.but.cannot" },
    };
    render(<LeftHeaderGroup />);
    sendButton = getButtonByName(LABELS.sendButton);
    expect(sendButton.disabled).toBe(true);
  });

  it("dispatches executeRequest with resolvedOutput when clicking Send (enabled case)", async () => {
    const { LABELS, ACTIONS } = H;
    const user = userEvent.setup();

    H.STATE.value = {
      ...H.STATE.value,
      httpUrl: { httpUrl: "https://ok.to.send" },
      request: { isLoading: false },
      resolved: { canGenerate: true },
    };

    render(<LeftHeaderGroup />);
    const sendButton = getButtonByName(LABELS.sendButton);
    await user.click(sendButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: ACTIONS.EXECUTE_REQUEST,
      payload: H.STATE.value.resolved,
    });
  });

  it("does not dispatch executeRequest when Send is disabled", async () => {
    const { LABELS } = H;
    const user = userEvent.setup();

    H.STATE.value = {
      ...H.STATE.value,
      request: { isLoading: true },
      resolved: { canGenerate: true },
      httpUrl: { httpUrl: "https://valid.url" },
    };

    render(<LeftHeaderGroup />);
    const sendButton = getButtonByName(LABELS.loading);
    await user.click(sendButton);

    expect(
      mockDispatch.mock.calls.some(
        (call) => call[DISPATCH_ARG_INDEX]?.type === H.ACTIONS.EXECUTE_REQUEST,
      ),
    ).toBe(false);
  });

  it("renders all tabs with correct labels, reflects aria-selected on active tab, and dispatches setActiveTab on click", async () => {
    const { TAB_KEYS, LABELS, ACTIONS } = H;
    const user = userEvent.setup();

    H.STATE.value = {
      ...H.STATE.value,
      tabs: { activeTab: "headers" },
    };

    render(<LeftHeaderGroup />);

    const expectedCount = TAB_KEYS.length;
    const allButtons = screen.getAllByRole("tab");
    expect(allButtons).toHaveLength(expectedCount);

    const labelByKey: Record<(typeof TAB_KEYS)[number], string> = {
      headers: LABELS.tabs.headers,
      body: LABELS.tabs.body,
      variables: LABELS.tabs.variables,
      codegen: LABELS.tabs.codegen,
      requestHistory: LABELS.tabs.requestHistory,
    };

    const activeButton = screen.getByRole("tab", { name: labelByKey.headers });
    expect(activeButton).toHaveAttribute("aria-selected", "true");

    const targetKey: (typeof TAB_KEYS)[number] = "variables";
    const targetButton = screen.getByRole("tab", {
      name: labelByKey[targetKey],
    });
    await user.click(targetButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: ACTIONS.SET_ACTIVE_TAB,
      payload: targetKey,
    });
  });
});
