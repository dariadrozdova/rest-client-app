import { describe, expect, it } from "vitest";

import type {
  HistoryEntry,
  HistoryState,
  ResolvedHeader,
  ResolvedRequest,
  ResponseData,
} from "@shared/types";
import { store } from "@store/store";

import reducer, {
  addEntry,
  clearHistory,
  selectHistory,
  selectSelectedEntryId,
  setHistory,
  setSelectedEntryId,
} from "@/store/slices/history-slice";

const ZERO = 0;
const ONE = 1;
const TWO = 2;
const HTTP_OK = 200;
const HTTP_CREATED = 201;

const EMPTY_RESOLVED_HEADERS: ResolvedHeader[] = [];
const DEFAULT_RESPONSE_HEADERS: Record<string, string> = {
  "content-type": "text/plain",
};

function initialState(): HistoryState {
  return reducer(undefined, { type: "@@INIT" });
}

function makeAResolvedRequest(
  overrides?: Partial<ResolvedRequest>,
): ResolvedRequest {
  const base: ResolvedRequest = {
    method: "GET",
    url: "https://example.com",
    headers: EMPTY_RESOLVED_HEADERS,
    body: undefined,
    meta: {
      contentType: undefined,
      jsonMode: false,
    },
  };
  return { ...base, ...overrides };
}

function makeAResponseData(overrides?: Partial<ResponseData>): ResponseData {
  const base: ResponseData = {
    status: HTTP_OK,
    statusText: "OK",
    headers: DEFAULT_RESPONSE_HEADERS,
    body: "",
    meta: {
      requestDurationMs: 0,
      requestSizeBytes: 0,
      requestTimestamp: new Date().toISOString(),
      responseSizeBytes: 0,
    },
  };
  return { ...base, ...overrides };
}

function makeHistoryEntry(
  overrides?: Partial<HistoryEntry> & {
    request?: Partial<ResolvedRequest>;
    response?: Partial<ResponseData>;
  },
): HistoryEntry {
  const base: HistoryEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    request: makeAResolvedRequest(overrides?.request),
    response: makeAResponseData(overrides?.response),
  };
  return { ...base, ...overrides };
}

describe("history slice", () => {
  it("returns initial state", () => {
    const state = initialState();
    expect(state.entries).toHaveLength(ZERO);
    expect(state.selectedEntryId).toBeNull();
  });

  it("addEntry unshifts newest first", () => {
    const entryFirst = makeHistoryEntry({ id: "first" });
    const entrySecond = makeHistoryEntry({ id: "second" });

    const afterFirst = reducer(initialState(), addEntry(entryFirst));
    expect(afterFirst.entries).toHaveLength(ONE);
    expect(afterFirst.entries[ZERO].id).toBe("first");

    const afterSecond = reducer(afterFirst, addEntry(entrySecond));
    expect(afterSecond.entries).toHaveLength(TWO);
    expect(afterSecond.entries[ZERO].id).toBe("second");
    expect(afterSecond.entries[ONE].id).toBe("first");
  });

  it("setHistory replaces the entire entries array", () => {
    const withOld = reducer(
      initialState(),
      addEntry(makeHistoryEntry({ id: "old" })),
    );
    const freshA = makeHistoryEntry({ id: "A" });
    const freshB = makeHistoryEntry({ id: "B" });

    const next = reducer(withOld, setHistory([freshA, freshB]));
    expect(next.entries).toHaveLength(TWO);
    expect(next.entries.map((entry) => entry.id)).toEqual(["A", "B"]);
  });

  it("clearHistory empties entries and resets selection", () => {
    const withDataSelected = reducer(
      reducer(initialState(), addEntry(makeHistoryEntry({ id: "x" }))),
      setSelectedEntryId("x"),
    );

    const cleared = reducer(withDataSelected, clearHistory());
    expect(cleared.entries).toHaveLength(ZERO);
    expect(cleared.selectedEntryId).toBeNull();
  });

  it("setSelectedEntryId sets and clears", () => {
    const selected = reducer(initialState(), setSelectedEntryId("abc"));
    expect(selected.selectedEntryId).toBe("abc");

    const cleared = reducer(selected, setSelectedEntryId(null));
    expect(cleared.selectedEntryId).toBeNull();
  });

  it("selectors work with the real RootState via store.getState()", () => {
    store.dispatch(clearHistory());

    const entryA = makeHistoryEntry({ id: "eA" });

    const entryB = makeHistoryEntry({
      id: "eB",
      request: {
        method: "POST",
        url: "https://api.example.com/create",
        body: '{"ping":"pong"}',
        headers: [{ name: "x-test", value: "1" }],
        meta: { contentType: "application/json", jsonMode: true },
      },
      response: {
        status: HTTP_CREATED,
        statusText: "Created",
        headers: { "x-out": "y" },
        body: '{"ok":true}',
        meta: {
          requestDurationMs: 10,
          requestSizeBytes: 25,
          requestTimestamp: new Date().toISOString(),
          responseSizeBytes: 34,
        },
      },
    });

    store.dispatch(setHistory([entryA, entryB]));
    store.dispatch(setSelectedEntryId("eB"));

    const root = store.getState();
    expect(selectHistory(root)).toEqual([entryA, entryB]);
    expect(selectSelectedEntryId(root)).toBe("eB");
  });
});
