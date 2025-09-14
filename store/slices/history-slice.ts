import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { ResolvedRequest, ResponseData } from "@shared/types";
import type { RootState } from "@store/store";

export interface HistoryEntry {
  createdAt: string;
  id: string;
  request: ResolvedRequest;
  response: ResponseData;
}

interface HistoryState {
  entries: HistoryEntry[];
}

const initialState: HistoryState = {
  entries: [],
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
    },
  },
});

export const { addEntry, clearHistory } = historySlice.actions;
export const selectHistory = (state: RootState) => state.history.entries;
export default historySlice.reducer;
