// __tests__/fixtures/history.ts
import type { HistoryEntry } from "@shared/types";

export const NOW_ISO = new Date("2025-01-01T12:00:00.000Z").toISOString();

export const makeEntry = (overrides?: Partial<HistoryEntry>): HistoryEntry => ({
  id: "e1",
  createdAt: NOW_ISO,
  request: {
    method: "GET",
    url: "https://api.example.com/users",
    headers: {},
    body: null,
  },
  response: {
    status: 200,
    statusText: "OK",
    error: null,
    meta: {
      requestDurationMs: 123,
      requestSizeBytes: 10,
      responseSizeBytes: 20,
      requestTimestamp: NOW_ISO,
    },
  },
  ...overrides,
});
