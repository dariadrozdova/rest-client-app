import { JSX } from "react";
import { Provider } from "react-redux";

import {
  configureStore,
  type Store,
  type UnknownAction,
} from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { BodyEditor } from "@/app/[locale]/(protected)/_components/body-editor/body-editor";

const N = { ONE: 1 };

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, variables?: Record<string, unknown>) => {
    const last = key.split(".").pop() ?? key;
    if (!variables) {
      return last;
    }
    let out = last;
    for (const k of Object.keys(variables)) {
      out = out.replace(`{${k}}`, String(variables[k]));
    }
    return out;
  },
}));

vi.mock("@/shared/ui/json-viewer", () => ({
  JsonViewer: (props: {
    content: string;
    onChange: (value: string) => void;
    placeholder?: string;
    readOnly?: boolean;
    showLineNumbers?: boolean;
  }) => (
    <textarea
      aria-label="json-viewer"
      onChange={(event) => props.onChange(event.currentTarget.value)}
      placeholder={props.placeholder}
      value={props.content}
    />
  ),
}));

const isJsonLikeMock = vi.fn<(x: string) => boolean>();
vi.mock(
  "@/app/[locale]/(protected)/_components/body-editor/utils",
  async () => {
    const actual = await vi.importActual<
      typeof import("@/app/[locale]/(protected)/_components/body-editor/utils")
    >("@/app/[locale]/(protected)/_components/body-editor/utils");

    return { ...actual, isJsonLike: (v: string) => isJsonLikeMock(v) };
  },
);

const hookState = {
  body: "{}",
  jsonError: "",
  contentType: "application/json",
  setContentType: vi.fn<(ct: string) => void>(),
  prettifyJson: vi.fn<() => void>(),
  clearBody: vi.fn<() => void>(),
  handleBodyChange: vi.fn<(value: string) => void>(),
};

vi.mock("@utils/hooks", () => ({ useBodyEditor: () => hookState }));

type RootState = Record<string, unknown>;
const createTestStore = (): Store<RootState, UnknownAction> =>
  configureStore<RootState, UnknownAction>({ reducer: (s) => s ?? {} });

const renderWithStore = (ui: JSX.Element) =>
  render(<Provider store={createTestStore()}>{ui}</Provider>);

beforeEach(() => {
  hookState.body = "{}";
  hookState.jsonError = "";
  hookState.contentType = "application/json";
  hookState.setContentType.mockClear();
  hookState.prettifyJson.mockClear();
  hookState.clearBody.mockClear();
  hookState.handleBodyChange.mockClear();
  isJsonLikeMock.mockReset();
});

describe("BodyEditor", () => {
  it("renders toolbar, viewer, and counter", () => {
    isJsonLikeMock.mockReturnValue(true);
    renderWithStore(<BodyEditor />);

    expect(screen.getByText("contentType")).toBeInTheDocument();
    expect(screen.getByDisplayValue("application/json")).toBeInTheDocument();
    expect(screen.getByLabelText("json-viewer")).toBeInTheDocument();
    expect(screen.getByText(/charactersCount/)).toBeInTheDocument();
  });

  it("appends 'jsonDetected' marker when body is valid JSON", () => {
    isJsonLikeMock.mockReturnValue(true);
    hookState.contentType = "application/json";
    hookState.body = '{"a":1}';
    renderWithStore(<BodyEditor />);

    const counter = screen.getByText(/charactersCount/);
    expect(counter).toBeInTheDocument();
    expect(screen.getByText(/jsonDetected/)).toBeInTheDocument();
  });

  it("does not append 'jsonDetected' when body is not JSON-like", () => {
    isJsonLikeMock.mockReturnValue(false);
    hookState.contentType = "application/json";
    hookState.body = "{ invalid json }";
    renderWithStore(<BodyEditor />);

    expect(screen.getByText(/charactersCount/)).toBeInTheDocument();
    expect(screen.queryByText(/jsonDetected/)).not.toBeInTheDocument();
  });

  it("allows changing content type via select", async () => {
    isJsonLikeMock.mockReturnValue(true);
    hookState.contentType = "application/json";
    renderWithStore(<BodyEditor />);

    const select = screen.getByDisplayValue("application/json");
    await userEvent.selectOptions(select, "text/plain");
    expect(hookState.setContentType).toHaveBeenCalledTimes(N.ONE);
    expect(hookState.setContentType).toHaveBeenCalledWith("text/plain");
  });

  it("routes actions: prettify, clear, and body change", async () => {
    isJsonLikeMock.mockReturnValue(true);
    hookState.contentType = "application/json";
    hookState.body = '{"a":1}';
    renderWithStore(<BodyEditor />);

    await userEvent.click(screen.getByTitle("prettifyButton"));
    await userEvent.click(screen.getByTitle("clearContent"));
    expect(hookState.prettifyJson).toHaveBeenCalledTimes(N.ONE);
    expect(hookState.clearBody).toHaveBeenCalledTimes(N.ONE);

    const viewer = screen.getByLabelText("json-viewer");
    await userEvent.clear(viewer);
    await userEvent.type(viewer, "new content");
    expect(hookState.handleBodyChange).toHaveBeenCalled();
  });

  it("disables prettify when body is not JSON-like (even in JSON mode)", () => {
    isJsonLikeMock.mockReturnValue(false);
    hookState.contentType = "application/json";
    hookState.body = "{ invalid json }";
    renderWithStore(<BodyEditor />);

    const prettify = screen.getByTitle("prettifyButton");
    expect(prettify).toBeDisabled();
  });
});
