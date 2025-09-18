import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { ResolvedSelectorOutput, ResponseData } from "@shared/types";

interface RequestState {
  error: null | string;
  isLoading: boolean;
  response: null | ResponseData;
}

const initialState: RequestState = {
  response: null,
  isLoading: false,
  error: null,
};
//
// function calculateRequestSize(request: ResolvedRequest): number {
//   const bodySize = request.body ? new Blob([request.body]).size : 0;
//   const headersSize = new Blob(
//     request.headers.map((header) => `${header.name}: ${header.value}\r\n`),
//   ).size;
//   const urlSize = new Blob([request.url]).size;
//   return bodySize + headersSize + urlSize;
// }

export const executeRequest = createAsyncThunk<
  ResponseData,
  ResolvedSelectorOutput,
  { rejectValue: string }
>(
  "request/execute",
  async (resolvedOutput, { rejectWithValue, dispatch: _dispatch }) => {
    if (!resolvedOutput.canGenerate || !resolvedOutput.resolved) {
      return rejectWithValue(
        resolvedOutput.issues.map((issue) => issue.type).join(", "),
      );
    }

    const resolved = resolvedOutput.resolved;

    try {
      const resp = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: resolved.method,
          url: resolved.url,
          headers: Object.fromEntries(
            resolved.headers.map((header) => [header.name, header.value]),
          ),
          body: resolved.body,
        }),
      });

      return await resp.json();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(errorMessage);
    }
  },
);

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    clearResponse: (state) => {
      state.response = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        executeRequest.fulfilled,
        (state, action: PayloadAction<ResponseData>) => {
          state.isLoading = false;
          state.response = action.payload;
        },
      )
      .addCase(executeRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Request failed";
      });
  },
});

export const { clearResponse } = requestSlice.actions;
export default requestSlice.reducer;
