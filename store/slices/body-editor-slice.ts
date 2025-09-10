import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface BodyEditorState {
  body: string;
  contentType: string;
  jsonError: string;
}

const initialState: BodyEditorState = {
  body: "",
  contentType: "application/json",
  jsonError: "",
};

const bodyEditorSlice = createSlice({
  name: "bodyEditor",
  initialState,
  reducers: {
    setBody: (state, action: PayloadAction<string>) => {
      state.body = action.payload;
    },
    setContentType: (state, action: PayloadAction<string>) => {
      state.contentType = action.payload;
    },
    setJsonError: (state, action: PayloadAction<string>) => {
      state.jsonError = action.payload;
    },
    clearJsonError: (state) => {
      state.jsonError = "";
    },
    resetBodyEditor: () => initialState,
  },
});

export const {
  setBody,
  setContentType,
  setJsonError,
  clearJsonError,
  resetBodyEditor,
} = bodyEditorSlice.actions;

export default bodyEditorSlice.reducer;
