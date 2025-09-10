import { configureStore } from "@reduxjs/toolkit";

import bodyEditorReducer from "@/store/slices/body-editor-slice";
import tabReducer from "@/store/slices/tab-open-slice";

export const store = configureStore({
  reducer: {
    tabs: tabReducer,
    bodyEditor: bodyEditorReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
