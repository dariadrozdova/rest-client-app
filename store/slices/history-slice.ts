import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { HistoryEntry, HistoryState } from "@shared/types";
import type { RootState } from "@store/store";

const initialState: HistoryState = {
  entries: [],
  selectedEntryId: null,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addEntry: (state, action: PayloadAction<HistoryEntry>) => {
      state.entries.unshift(action.payload);
    },
    clearHistory: (state) => {
      state.entries = [];
      state.selectedEntryId = null;
    },
    setHistory: (state, action: PayloadAction<HistoryEntry[]>) => {
      state.entries = action.payload;
    },
    setSelectedEntryId: (state, action: PayloadAction<null | string>) => {
      state.selectedEntryId = action.payload;
    },
  },
});

export const { addEntry, clearHistory, setHistory, setSelectedEntryId } =
  historySlice.actions;

export const selectHistory = (state: RootState) => state.history.entries;
export const selectSelectedEntryId = (state: RootState) =>
  state.history.selectedEntryId;

export default historySlice.reducer;
