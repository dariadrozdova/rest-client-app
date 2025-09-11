import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LANG_GEN } from "@shared/globals";
import { CodeLangGen, CodeLangState } from "@shared/types";

const initialState: CodeLangState = {
  selectedCodeLang: LANG_GEN[0],
};

const codeLangSlice = createSlice({
  name: "codeLang",
  initialState,
  reducers: {
    setSelectedCodeLang(state, action: PayloadAction<CodeLangGen>) {
      state.selectedCodeLang = action.payload;
    },
  },
});

export const { setSelectedCodeLang } = codeLangSlice.actions;
export default codeLangSlice.reducer;
