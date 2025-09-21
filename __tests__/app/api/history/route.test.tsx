import { beforeEach, describe, expect, it, vi } from "vitest";

type FailMode = "error" | "nonerror" | null;

interface HistoryEntry {
  body?: null | string;
  duration: number;
  error?: null | string;
  headers?: Record<string, string>;
  id: string;
  method: string;
  requestSize: number;
  responseSize: number;
  status: number;
  statusText?: null | string;
  timestamp: string;
  url: string;
}

interface HoistedState {
  failMode: FailMode;
  history: HistoryEntry[];
  jsonCalls: JsonCall[];
  uid: null | string;
}

interface JsonCall {
  body: unknown;
  init?: { status?: number };
}

const ST: HoistedState = vi.hoisted(() => ({
  uid: null,
  history: [],
  failMode: null,
  jsonCalls: [],
}));

vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => {
      ST.jsonCalls.push({ body, init });
      return { __json: true, body, init };
    },
  },
}));

vi.mock("@utils/server/uid-from-request", () => ({
  getUidFromCookies: () => Promise.resolve(ST.uid),
}));

vi.mock("@/utils/server/history-store", () => ({
  getUserHistory: () => {
    if (ST.failMode === "error") {
      return Promise.reject(new Error("boom"));
    }
    if (ST.failMode === "nonerror") {
      return Promise.reject("weird failure");
    }
    return Promise.resolve(ST.history);
  },
}));

import { GET } from "@/app/api/history/route";

const HTTP_UNAUTHORIZED = 401;

beforeEach(() => {
  ST.uid = null;
  ST.history = [];
  ST.failMode = null;
  ST.jsonCalls.length = 0;
});

describe("GET /api/history", () => {
  it("returns 401 when no uid present", async () => {
    ST.uid = null;

    await GET();

    expect(ST.jsonCalls).toEqual([
      { body: { error: "Unauthorized" }, init: { status: HTTP_UNAUTHORIZED } },
    ]);
  });

  it("returns mapped entries when uid exists and history resolves", async () => {
    ST.uid = "user-123";
    ST.history = [
      {
        id: "e1",
        timestamp: "2025-09-20T12:00:00Z",
        method: "GET",
        url: "https://api.test/ok",
        headers: { "x-test": "1" },
        body: '{"ok":true}',
        status: 200,
        statusText: "OK",
        error: null,
        duration: 50,
        requestSize: 20,
        responseSize: 100,
      },
    ];

    await GET();

    expect(ST.jsonCalls).toEqual([
      {
        body: {
          items: [
            {
              id: "e1",
              createdAt: "2025-09-20T12:00:00Z",
              request: {
                method: "GET",
                url: "https://api.test/ok",
                headers: { "x-test": "1" },
                body: '{"ok":true}',
              },
              response: {
                status: 200,
                statusText: "OK",
                error: null,
                meta: {
                  requestDurationMs: 50,
                  requestSizeBytes: 20,
                  responseSizeBytes: 100,
                  requestTimestamp: "2025-09-20T12:00:00Z",
                },
              },
            },
          ],
        },
        init: undefined,
      },
    ]);
  });

  it("returns 200 with error message when history store throws an Error", async () => {
    ST.uid = "user-123";
    ST.failMode = "error";

    await GET();

    expect(ST.jsonCalls).toEqual([
      { body: { error: "boom" }, init: { status: 200 } },
    ]);
  });

  it("returns 200 with generic message when thrown value is not an Error", async () => {
    ST.uid = "user-123";
    ST.failMode = "nonerror";

    await GET();

    expect(ST.jsonCalls).toEqual([
      {
        body: { error: "Internal error" },
        init: { status: 200 },
      },
    ]);
  });
});
