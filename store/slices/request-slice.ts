import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RequestState, ResponseData } from "@shared/types";
import type { RootState } from "@store/store";

import { selectResolvedRequest } from "@/app/[locale]/(protected)/_components/codegen/resolve-request";
import { buildProxyUrl } from "@/utils/helpers/build-proxy-url";
import { calculateRequestSize } from "@/utils/helpers/calculate-request-size";

const initialState: RequestState = {
  isLoading: false,
  error: null,
  response: null,
};

export const executeRequest = createAsyncThunk<
  ResponseData,
  void,
  { rejectValue: string; state: RootState }
>("request/execute", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const resolvedOutput = selectResolvedRequest(state);

  if (!resolvedOutput.canGenerate || !resolvedOutput.resolved) {
    return rejectWithValue(
      resolvedOutput.issues.map((issue) => issue.type).join(", "),
    );
  }

  const resolved = resolvedOutput.resolved;
  const startTime = Date.now();

  try {
    const proxyUrl = buildProxyUrl(resolved);

    const response = await fetch(proxyUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const endTime = Date.now();
    const responseText = await response.text();

    let parsedBody: string;
    try {
      const jsonBody = JSON.parse(responseText);
      parsedBody = JSON.stringify(jsonBody, null, 2);
    } catch {
      parsedBody = responseText;
    }

    const responseHeaders: Record<string, string> = {};
    for (const [key, value] of response.headers.entries()) {
      responseHeaders[key] = value;
    }

    const responseData: ResponseData = {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: parsedBody,
      meta: {
        requestDurationMs: endTime - startTime,
        responseSizeBytes: new Blob([responseText]).size,
        requestSizeBytes: calculateRequestSize(resolved),
        requestTimestamp: new Date().toISOString(),
      },
    };

    return responseData;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return rejectWithValue(errorMessage);
  }
});

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    clearResponse: (state) => {
      state.response = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
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
          state.error = null;
        },
      )
      .addCase(executeRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Request failed";
        state.response = null;
      });
  },
});

export const { clearResponse, clearError } = requestSlice.actions;
export default requestSlice.reducer;
