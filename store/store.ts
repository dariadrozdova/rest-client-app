import { configureStore } from "@reduxjs/toolkit";

import bodyEditorReducer from "@/store/slices/body-editor-slice";
import headersReducer from "@/store/slices/header-slice";
import methodReducer from "@/store/slices/method-slice";
import tabReducer from "@/store/slices/tab-open-slice";
import httpUrlReducer from "@/store/slices/url-slice";
import variablesReducer from "@/store/slices/variables-slice";

export const store = configureStore({
  reducer: {
    tabs: tabReducer,
    headers: headersReducer,
    bodyEditor: bodyEditorReducer,
    variables: variablesReducer,
    method: methodReducer,
    httpUrl: httpUrlReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
