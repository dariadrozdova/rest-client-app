import { configureStore } from "@reduxjs/toolkit";

import bodyEditorReducer from "@/store/slices/body-editor-slice";
import headersReducer from "@/store/slices/header-slice";
import tabReducer from "@/store/slices/tab-open-slice";

export const store = configureStore({
  reducer: {
    tabs: tabReducer,
    headers: headersReducer,
    bodyEditor: bodyEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
