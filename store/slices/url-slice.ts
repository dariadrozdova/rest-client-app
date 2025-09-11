import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UrlState } from "@shared/types";

const initialUrl: UrlState = {
  httpUrl: "",
};

const httpUrl = createSlice({
  name: "httpUrl",
  initialState: initialUrl,
  reducers: {
    setUrl: (state, action: PayloadAction<string>) => {
      state.httpUrl = action.payload;
    },
  },
});

export const { setUrl } = httpUrl.actions;
export default httpUrl.reducer;
