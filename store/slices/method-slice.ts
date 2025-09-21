import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { selectedMethodState } from "@shared/types";

const initialState: selectedMethodState = {
  selectedMethod: "GET",
};

const methodSlice = createSlice({
  name: "method",
  initialState,
  reducers: {
    setSelectedMethod: (
      state,
      action: PayloadAction<selectedMethodState["selectedMethod"]>,
    ) => {
      state.selectedMethod = action.payload;
    },
  },
});

export const { setSelectedMethod } = methodSlice.actions;
export default methodSlice.reducer;
