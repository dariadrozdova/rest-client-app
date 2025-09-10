import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TabOpenState } from "@shared/types";

const initialState: TabOpenState = {
  activeTab: "headers",
};

const tabSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<TabOpenState["activeTab"]>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = tabSlice.actions;
export default tabSlice.reducer;
