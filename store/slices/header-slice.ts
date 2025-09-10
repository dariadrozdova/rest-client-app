import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

import { HeaderItem, HeadersState } from "@shared/types";

const initialState: HeadersState = {
  items: [],
};

const headersSlice = createSlice({
  name: "headers",
  initialState,
  reducers: {
    addRow: {
      reducer(state, action: PayloadAction<HeaderItem>) {
        state.items.push(action.payload);
      },
      prepare() {
        return {
          payload: {
            id: nanoid(),
            key: "",
            value: "",
            enabled: false,
          },
        };
      },
    },
    removeRow(state, action: PayloadAction<string>) {
      state.items = state.items.filter((h) => h.id !== action.payload);
    },
    toggleEnabled(
      state,
      action: PayloadAction<{ enabled: boolean; id: string }>,
    ) {
      const row = state.items.find((h) => h.id === action.payload.id);
      if (row) {
        row.enabled = action.payload.enabled;
      }
    },
    updateKey(state, action: PayloadAction<{ id: string; key: string }>) {
      const row = state.items.find((h) => h.id === action.payload.id);
      if (row) {
        row.key = action.payload.key;
      }
    },
    updateValue(state, action: PayloadAction<{ id: string; value: string }>) {
      const row = state.items.find((h) => h.id === action.payload.id);
      if (row) {
        row.value = action.payload.value;
      }
    },
    ensureTrailingEmpty(state) {
      // keep exactly one empty row at the end
      const hasEmpty = state.items.some((h) => !h.key && !h.value);
      if (!hasEmpty) {
        state.items.push({ id: nanoid(), key: "", value: "", enabled: false });
      }
    },
  },
});

export const {
  addRow,
  removeRow,
  toggleEnabled,
  updateKey,
  updateValue,
  ensureTrailingEmpty,
} = headersSlice.actions;

export default headersSlice.reducer;

export const selectHeaders = (s: { headers: HeadersState }) => s.headers.items;

export const selectActiveHeadersObject = (s: { headers: HeadersState }) =>
  Object.fromEntries(
    s.headers.items
      .filter((h) => h.enabled && h.key)
      .map((h) => [h.key, h.value]),
  );
