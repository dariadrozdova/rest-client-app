import { configureStore } from "@reduxjs/toolkit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type {
  Issue,
  ResolvedRequest,
  ResolvedRequestMeta,
  ResolvedSelectorOutput,
  ResponseData,
} from "@shared/types";

import reducer, { executeRequest } from "@/store/slices/request-slice";

vi.mock("uuid", () => ({
  v4: () => "uuid-1",
}));

const addEntryMock = vi.fn(
  (payload: {
    createdAt: string;
    id: string;
    request: ResolvedRequest;
    response: ResponseData;
  }) => ({ type: "history/addEntry" as const, payload }),
);
vi.mock("@store/slices/history-slice", () => ({
  addEntry: (payload: {
    createdAt: string;
    id: string;
    request: ResolvedRequest;
    response: ResponseData;
  }) => addEntryMock(payload),
}));

const H = {
  ZERO: 0,
  ONE: 1,
  TWO_HUNDRED: 200,
  STATUS_TEXT_OK: "OK",
  ISO_TS: "2025-01-02T03:04:05.000Z",

  URL: "https://api.example.com/resource",
  METHOD_POST: "POST",

  HDR_CT: "Content-Type",
  HDR_CT_JSON: "application/json",
  HDR_CT_LC: "content-type",
  HDR_X: "x-custom",
  HDR_X_VAL: "abc",
  HDR_X_LC: "x-custom",

  JSON_TEXT: '{"hello":"world"}',
  PLAIN_TEXT: "plain body",

  START_MS: 1000,
  END_MS: 1123,

  JOINED_ISSUES: "MISSING_METHOD, EMPTY_URL",
} as const;

function canGenerateArgument(
  resolved: ResolvedRequest,
): ResolvedSelectorOutput {
  const issues: Issue[] = [];
  return {
    canGenerate: true,
    resolved,
    issues,
  };
}

function cannotGenerateArgument(): ResolvedSelectorOutput {
  const issueA: Issue = { type: "MISSING_METHOD" };
  const issueB: Issue = { type: "EMPTY_URL" };
  return {
    canGenerate: false,
    resolved: undefined,
    issues: [issueA, issueB],
  };
}

function makeMeta(
  overrides?: Partial<ResolvedRequestMeta>,
): ResolvedRequestMeta {
  return {
    contentType: H.HDR_CT_JSON,
    jsonMode: true,
    ...overrides,
  };
}

function makeResolved(overrides?: Partial<ResolvedRequest>): ResolvedRequest {
  return {
    method: H.METHOD_POST,
    url: H.URL,
    headers: [
      { name: H.HDR_CT, value: H.HDR_CT_JSON },
      { name: H.HDR_X, value: H.HDR_X_VAL },
    ],
    body: H.JSON_TEXT,
    meta: makeMeta(),
    ...overrides,
  };
}

function makeStore() {
  return configureStore({
    reducer: { request: reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  });
}

describe("request slice thunk (integration)", () => {
  beforeEach(() => {
    addEntryMock.mockClear();

    vi.setSystemTime(new Date(H.ISO_TS));

    let calls = H.ZERO;
    vi.spyOn(Date, "now").mockImplementation(() => {
      calls += 1;
      return calls === H.ONE ? H.START_MS : H.END_MS;
    });

    const fetchMock = vi.fn(async () => {
      const headers = new Headers();
      headers.set(H.HDR_CT, H.HDR_CT_JSON);
      headers.set(H.HDR_X, H.HDR_X_VAL);
      return new Response(H.JSON_TEXT, {
        status: H.TWO_HUNDRED,
        statusText: H.STATUS_TEXT_OK,
        headers,
      });
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("success (JSON): stores parsed backend JSON in response (no meta/status shaping, no history entry)", async () => {
    const store = makeStore();

    const resolved = makeResolved();
    const pending = store.dispatch(
      executeRequest(canGenerateArgument(resolved)),
    );

    const s0 = store.getState().request;
    expect(s0.isLoading).toBe(true);
    expect(s0.error).toBeNull();

    await pending;

    const s = store.getState().request;
    expect(s.isLoading).toBe(false);
    expect(s.error).toBeNull();
    expect(s.response).toEqual({ hello: "world" });

    expect(addEntryMock).not.toHaveBeenCalled();
  });

  it("success (text): keeps status 200 and clears error when backend returns non-JSON", async () => {
    const fetchMock = vi.fn(async () => {
      const headers = new Headers();
      headers.set(H.HDR_CT, "text/plain");
      return new Response(H.PLAIN_TEXT, {
        status: H.TWO_HUNDRED,
        statusText: H.STATUS_TEXT_OK,
        headers,
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const store = makeStore();
    const resolved = makeResolved({
      body: H.PLAIN_TEXT,
      meta: makeMeta({ contentType: "text/plain", jsonMode: false }),
    });

    await store.dispatch(executeRequest(canGenerateArgument(resolved)));

    const s = store.getState().request;
    expect(s.isLoading).toBe(false);
    expect(s.response).toEqual({ status: 200, statusText: "OK" });
    expect(s.error).toBeNull();
  });

  it("cannot generate: joins issue types and rejects with joined string; does not dispatch addEntry", async () => {
    const store = makeStore();

    await store.dispatch(executeRequest(cannotGenerateArgument()));

    const s = store.getState().request;
    expect(s.isLoading).toBe(false);
    expect(s.response).toBeNull();
    expect(s.error).toBe(H.JOINED_ISSUES);
    expect(addEntryMock).not.toHaveBeenCalled();
  });

  it("fetch throws: sets readable error and does not dispatch addEntry", async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error("Network down");
    });
    vi.stubGlobal("fetch", fetchMock);

    const store = makeStore();
    const resolved = makeResolved();

    await store.dispatch(executeRequest(canGenerateArgument(resolved)));

    const s = store.getState().request;
    expect(s.isLoading).toBe(false);
    expect(s.response).toBeNull();
    expect(s.error).toBe("Network down");
    expect(addEntryMock).not.toHaveBeenCalled();
  });
});
