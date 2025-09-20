import type { RootState } from "@/store/store";

export const selectResponse = (state: RootState) => state.request.response;
export const selectIsLoading = (state: RootState) => state.request.isLoading;
export const selectError = (state: RootState) => state.request.error;
