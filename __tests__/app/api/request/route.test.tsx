import { beforeEach, describe, expect, it, vi } from "vitest";

interface BuildDtoArguments {
  executed: ExecutedResponse;
  payload: {
    body: null | string;
    headers: Record<string, string>;
    method: string;
    url: string;
  };
  startedAt: number;
}

interface ExecutedResponse {
  body: null | string;
  durationMs: number;
  headers: Record<string, string>;
  requestSize: number;
  responseSize: number;
  status: number;
  statusText: string;
}

interface HoistedState {
  jsonCalls: JsonCall[];
  lastBuildResponseDTOArgs?: BuildDtoArguments;
  lastExecutePayload?: BuildDtoArguments["payload"];
  lastPersistHistoryErrorSafe?: {
    message: string;
    payload: BuildDtoArguments["payload"];
    startedAt: number;
  };
  lastPersistHistorySafe?: {
    executed: ExecutedResponse;
    payload: BuildDtoArguments["payload"];
    startedAt: number;
  };
  shouldExecuteThrow: boolean;
}

interface JsonCall {
  body: unknown;
  init?: { status?: number };
}

const ST: HoistedState = vi.hoisted(() => ({
  jsonCalls: [],
  lastExecutePayload: undefined,
  lastPersistHistorySafe: undefined,
  lastPersistHistoryErrorSafe: undefined,
  lastBuildResponseDTOArgs: undefined,
  shouldExecuteThrow: false,
}));

const STARTED_AT = 1_725_000_000_000;
const URL_OK = "https://api.example.com/create";
const METHOD_POST = "POST";
const HEADER_NAME = "x-test";
const HEADER_VALUE = "1";
const BODY_JSON = '{"ping":"pong"}';

const EXECUTED_OK: ExecutedResponse = {
  status: 201,
  statusText: "Created",
  headers: { "x-out": "y" },
  body: '{"ok":true}',
  durationMs: 42,
  requestSize: 18,
  responseSize: 64,
};

const DTO_OK = {
  status: EXECUTED_OK.status,
  statusText: EXECUTED_OK.statusText,
  headers: EXECUTED_OK.headers,
  body: EXECUTED_OK.body,
  meta: {
    requestDurationMs: EXECUTED_OK.durationMs,
    requestSizeBytes: EXECUTED_OK.requestSize,
    responseSizeBytes: EXECUTED_OK.responseSize,
    requestTimestamp: STARTED_AT,
  },
};

vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => {
      ST.jsonCalls.push({ body, init });
      return { __json: true, body, init };
    },
  },
}));

vi.mock("@/utils/server/http-client", () => ({
  executeHttp: (payload: BuildDtoArguments["payload"]) => {
    ST.lastExecutePayload = payload;
    if (ST.shouldExecuteThrow) {
      return Promise.reject(new Error("network down"));
    }
    return Promise.resolve(EXECUTED_OK);
  },
  buildResponseDTO: (
    payload: BuildDtoArguments["payload"],
    executed: ExecutedResponse,
    startedAt: number,
  ) => {
    const dto = {
      status: executed.status,
      statusText: executed.statusText,
      headers: executed.headers,
      body: executed.body,
      meta: {
        requestDurationMs: executed.durationMs,
        requestSizeBytes: executed.requestSize,
        responseSizeBytes: executed.responseSize,
        requestTimestamp: startedAt,
      },
    };
    ST.lastBuildResponseDTOArgs = { payload, executed, startedAt };
    return dto;
  },
  persistHistorySafe: (
    startedAt: number,
    payload: BuildDtoArguments["payload"],
    executed: ExecutedResponse,
  ) => {
    ST.lastPersistHistorySafe = { startedAt, payload, executed };
    return Promise.resolve();
  },
  persistHistoryErrorSafe: (
    startedAt: number,
    payload: BuildDtoArguments["payload"],
    message: string,
  ) => {
    ST.lastPersistHistoryErrorSafe = { startedAt, payload, message };
    return Promise.resolve();
  },
}));

import { POST } from "@/app/api/request/route";

beforeEach(() => {
  ST.jsonCalls.length = 0;
  ST.lastExecutePayload = undefined;
  ST.lastPersistHistorySafe = undefined;
  ST.lastPersistHistoryErrorSafe = undefined;
  ST.lastBuildResponseDTOArgs = undefined;
  ST.shouldExecuteThrow = false;

  vi.spyOn(Date, "now").mockReturnValue(STARTED_AT);
});

describe("POST /api/execute", () => {
  it("executes request, builds DTO, persists history, and returns JSON with DTO status", async () => {
    const request = new Request("http://localhost/api/execute", {
      method: "POST",
      body: JSON.stringify({
        method: METHOD_POST,
        url: URL_OK,
        headers: { [HEADER_NAME]: HEADER_VALUE },
        body: BODY_JSON,
      }),
      headers: { "content-type": "application/json" },
    });

    await POST(request);

    expect(ST.lastExecutePayload).toEqual({
      method: METHOD_POST,
      url: URL_OK,
      headers: { [HEADER_NAME]: HEADER_VALUE },
      body: BODY_JSON,
    });

    expect(ST.lastBuildResponseDTOArgs).toEqual({
      payload: {
        method: METHOD_POST,
        url: URL_OK,
        headers: { [HEADER_NAME]: HEADER_VALUE },
        body: BODY_JSON,
      },
      executed: EXECUTED_OK,
      startedAt: STARTED_AT,
    });

    expect(ST.lastPersistHistorySafe).toEqual({
      startedAt: STARTED_AT,
      payload: {
        method: METHOD_POST,
        url: URL_OK,
        headers: { [HEADER_NAME]: HEADER_VALUE },
        body: BODY_JSON,
      },
      executed: EXECUTED_OK,
    });

    expect(ST.jsonCalls).toEqual([
      {
        body: DTO_OK,
        init: { status: DTO_OK.status },
      },
    ]);
  });

  it("on failure persists error, returns 500 with message, keeps payload built from request", async () => {
    ST.shouldExecuteThrow = true;

    const request = new Request("http://localhost/api/execute", {
      method: "POST",
      body: JSON.stringify({
        method: "post",
        url: URL_OK,
      }),
      headers: { "content-type": "application/json" },
    });

    await POST(request);

    expect(ST.lastExecutePayload).toEqual({
      method: METHOD_POST,
      url: URL_OK,
      headers: {},
      body: null,
    });

    expect(ST.lastPersistHistoryErrorSafe).toEqual({
      startedAt: STARTED_AT,
      payload: {
        method: METHOD_POST,
        url: URL_OK,
        headers: {},
        body: null,
      },
      message: "network down",
    });

    expect(ST.jsonCalls).toEqual([
      { body: { error: "network down" }, init: { status: 500 } },
    ]);
  });
});
