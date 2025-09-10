import { configureStore } from "@reduxjs/toolkit";

import headersReducer from "@/store/slices/header-slice";
import bodyEditorReducer from "@/store/slices/body-editor-slice";
import tabReducer from "@/store/slices/tab-open-slice";

export const store = configureStore({
  reducer: {
    tabs: tabReducer,
    headers: headersReducer,
    bodyEditor: bodyEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
