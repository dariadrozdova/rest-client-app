import { configureStore } from "@reduxjs/toolkit";

import tabReducer from "@/store/slices/tab-open-slice";

export const store = configureStore({
  reducer: {
    tabs: tabReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
