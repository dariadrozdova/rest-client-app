import React from "react";
import { Provider } from "react-redux";

import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LeftPaneClient } from "@/app/[locale]/(protected)/_components/left-pane.client";

const LABEL_HEADERS = "Headers Editor";
const LABEL_BODY = "Body Editor";
const LABEL_CODEGEN = "Codegen Panel";
const LABEL_VARIABLES = "Variables Editor";

vi.mock("@app/[locale]/(protected)/_components/headers-editor", () => ({
  HeadersEditor: () => <div aria-label={LABEL_HEADERS} role="region" />,
}));

vi.mock("@app/[locale]/(protected)/_components/body-editor", () => ({
  BodyEditor: () => <div aria-label={LABEL_BODY} role="region" />,
}));

vi.mock("@app/[locale]/(protected)/_components/codegen/codegen-panel", () => ({
  CodegenPanel: () => <div aria-label={LABEL_CODEGEN} role="region" />,
}));

vi.mock("@app/[locale]/(protected)/_components/variables-editor", () => ({
  VariablesEditor: () => <div aria-label={LABEL_VARIABLES} role="region" />,
}));

type TabKey = "body" | "codegen" | "headers" | "variables";
const TAB_HEADERS: TabKey = "headers";
const TAB_BODY: TabKey = "body";
const TAB_CODEGEN: TabKey = "codegen";
const TAB_VARIABLES: TabKey = "variables";

const makeTabsSlice = (initial: TabKey) =>
  createSlice({
    name: "tabs",
    initialState: { activeTab: initial },
    reducers: {
      setActiveTab(state, action: PayloadAction<TabKey>) {
        state.activeTab = action.payload;
      },
    },
  });

async function expectOnlyRegionAsync(expectedLabel: string) {
  await screen.findByRole("region", { name: expectedLabel });

  const labels = [LABEL_HEADERS, LABEL_BODY, LABEL_CODEGEN, LABEL_VARIABLES];
  await waitFor(() => {
    for (const label of labels) {
      const element = screen.queryByRole("region", { name: label });
      if (label === expectedLabel) {
        expect(element).not.toBeNull();
      } else {
        expect(element).toBeNull();
      }
    }
  });
}

function makeStore(initial: TabKey) {
  const slice = makeTabsSlice(initial);
  const store = configureStore({
    reducer: { tabs: slice.reducer },
  });
  return { store, actions: slice.actions };
}

function renderWithStore(initial: TabKey) {
  const { store, actions } = makeStore(initial);
  const utils = render(
    <Provider store={store}>
      <LeftPaneClient />
    </Provider>,
  );
  return { ...utils, store, actions };
}

describe("LeftPaneClient", () => {
  it("renders Headers editor when activeTab is headers", async () => {
    renderWithStore(TAB_HEADERS);
    await expectOnlyRegionAsync(LABEL_HEADERS);
  });

  it("renders Body editor when activeTab is body", async () => {
    renderWithStore(TAB_BODY);
    await expectOnlyRegionAsync(LABEL_BODY);
  });

  it("renders Codegen panel when activeTab is codegen", async () => {
    renderWithStore(TAB_CODEGEN);
    await expectOnlyRegionAsync(LABEL_CODEGEN);
  });

  it("renders Variables editor when activeTab is variables", async () => {
    renderWithStore(TAB_VARIABLES);
    await expectOnlyRegionAsync(LABEL_VARIABLES);
  });

  it("reacts to store updates (switching tabs updates the rendered editor)", async () => {
    const { store, actions } = renderWithStore(TAB_HEADERS);

    await expectOnlyRegionAsync(LABEL_HEADERS);

    await act(async () => {
      store.dispatch(actions.setActiveTab(TAB_BODY));
    });
    await expectOnlyRegionAsync(LABEL_BODY);

    await act(async () => {
      store.dispatch(actions.setActiveTab(TAB_CODEGEN));
    });
    await expectOnlyRegionAsync(LABEL_CODEGEN);

    await act(async () => {
      store.dispatch(actions.setActiveTab(TAB_VARIABLES));
    });
    await expectOnlyRegionAsync(LABEL_VARIABLES);
  });
});
