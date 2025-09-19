import { Provider } from "react-redux";

import {
  configureStore,
  type Store,
  type UnknownAction,
} from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ResponsePanel } from "@/app/[locale]/(protected)/_components/response-panel";

const N = { TWO: 2 };

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, variables?: Record<string, unknown>) => {
    const last = key.split(".").pop() ?? key;
    if (variables && "message" in variables) {
      return `${last}:${String(variables.message)}`;
    }
    return last;
  },
}));

vi.mock("@/shared/ui/json-viewer", () => ({
  JsonViewer: (props: { content: string }) => (
    <pre aria-label="json-viewer">{props.content}</pre>
  ),
}));

const normalizeResponseBodyMock = vi.fn<(input: unknown) => unknown>();
vi.mock("@/utils/helpers/normalize-response-body", () => ({
  normalizeResponseBody: (input: unknown) => normalizeResponseBodyMock(input),
}));

interface RequestState {
  error: null | string;
  isLoading: boolean;
  response: null | unknown;
}
interface RootState {
  request: RequestState;
}

const makeStore = (request: RequestState): Store<RootState, UnknownAction> =>
  configureStore<RootState, UnknownAction>({
    reducer: (): RootState => ({ request }),
    preloadedState: { request },
  });

const renderWithStore = (request: RequestState) =>
  render(
    <Provider store={makeStore(request)}>
      <ResponsePanel />
    </Provider>,
  );

describe("ResponsePanel", () => {
  it("shows loading text in the viewer when isLoading=true", () => {
    const state: RequestState = {
      isLoading: true,
      error: null,
      response: null,
    };

    renderWithStore(state);

    expect(screen.queryByText(/requestFailed/)).not.toBeInTheDocument();
    expect(screen.getByLabelText("json-viewer").textContent).toBe("loading");
  });

  it("shows error banner and error content when error exists and not loading", () => {
    const message = "Network failure";
    const state: RequestState = {
      isLoading: false,
      error: message,
      response: null,
    };

    renderWithStore(state);

    expect(screen.getByText(`requestFailed: ${message}`)).toBeInTheDocument();
    expect(screen.getByLabelText("json-viewer").textContent).toBe(
      `error:${message}`,
    );
  });

  it("renders normalized JSON when response exists (no error, not loading)", () => {
    const normalized = { ok: true, data: { id: 1 } };
    normalizeResponseBodyMock.mockReturnValueOnce(normalized);

    const state: RequestState = {
      isLoading: false,
      error: null,
      response: { raw: "whatever" },
    };

    renderWithStore(state);

    const expected = JSON.stringify(normalized, null, N.TWO);
    expect(screen.getByLabelText("json-viewer").textContent).toBe(expected);
    expect(screen.queryByText(/requestFailed/)).not.toBeInTheDocument();
  });

  it("shows 'noRequest' text when nothing has been requested yet", () => {
    const state: RequestState = {
      isLoading: false,
      error: null,
      response: null,
    };

    renderWithStore(state);

    expect(screen.getByLabelText("json-viewer").textContent).toBe("noRequest");
    expect(screen.queryByText(/requestFailed/)).not.toBeInTheDocument();
  });

  it("prioritizes loading over error in content rendering", () => {
    const message = "Timeout";
    const state: RequestState = {
      isLoading: true,
      error: message,
      response: null,
    };

    renderWithStore(state);

    expect(screen.getByLabelText("json-viewer").textContent).toBe("loading");
    expect(screen.getByText(`requestFailed: ${message}`)).toBeInTheDocument();
  });
});
