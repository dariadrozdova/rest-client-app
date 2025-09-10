import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface BodyEditorState {
  contentType: string;
  jsonError: string;
}

const initialState: BodyEditorState = {
  contentType: "application/json",
  jsonError: "",
};

const bodyEditorSlice = createSlice({
  name: "bodyEditor",
  initialState,
  reducers: {
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

export const { setContentType, setJsonError, clearJsonError, resetBodyEditor } =
  bodyEditorSlice.actions;

export default bodyEditorSlice.reducer;
