import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

import { VariableItem, VariablesState } from "@shared/types";

const initialState: VariablesState = {
  items: [],
};

const variablesSlice = createSlice({
  name: "variables",
  initialState,
  reducers: {
    addRow: {
      reducer(state, action: PayloadAction<VariableItem>) {
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
      state.items = state.items.filter(
        (variable) => variable.id !== action.payload,
      );
    },
    toggleEnabled(
      state,
      action: PayloadAction<{ enabled: boolean; id: string }>,
    ) {
      const row = state.items.find(
        (variable) => variable.id === action.payload.id,
      );
      if (row) {
        row.enabled = action.payload.enabled;
      }
    },
    updateKey(state, action: PayloadAction<{ id: string; key: string }>) {
      const row = state.items.find(
        (variable) => variable.id === action.payload.id,
      );
      if (row) {
        row.key = action.payload.key;
      }
    },
    updateValue(state, action: PayloadAction<{ id: string; value: string }>) {
      const row = state.items.find(
        (variable) => variable.id === action.payload.id,
      );
      if (row) {
        row.value = action.payload.value;
      }
    },
    ensureTrailingEmpty(state) {
      const hasEmpty = state.items.some(
        (variable) => !variable.key && !variable.value,
      );
      if (!hasEmpty) {
        state.items.push({ id: nanoid(), key: "", value: "", enabled: false });
      }
    },
    setVariables(state, action: PayloadAction<VariableItem[]>) {
      state.items = action.payload;
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
  setVariables,
} = variablesSlice.actions;

export default variablesSlice.reducer;

export const selectVariables = (state: { variables: VariablesState }) =>
  state.variables.items;

export const selectActiveVariablesObject = (state: {
  variables: VariablesState;
}) =>
  Object.fromEntries(
    state.variables.items
      .filter((variable) => variable.enabled && variable.key)
      .map((variable) => [variable.key, variable.value]),
  );
