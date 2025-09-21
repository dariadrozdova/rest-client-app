import { describe, expect, it, vi } from "vitest";

vi.mock("@reduxjs/toolkit", async () => {
  const actual =
    await vi.importActual<typeof import("@reduxjs/toolkit")>(
      "@reduxjs/toolkit",
    );
  return {
    ...actual,
    nanoid: () => "mocked-id",
  };
});

import reducer, {
  addRow,
  ensureTrailingEmpty,
  removeRow,
  selectActiveVariablesObject,
  selectVariables,
  setVariables,
  toggleEnabled,
  updateKey,
  updateValue,
} from "@/store/slices/variables-slice";

interface RootState {
  variables: VariablesState;
}
interface VariableItem {
  enabled: boolean;
  id: string;
  key: string;
  value: string;
}
interface VariablesState {
  items: VariableItem[];
}

const H = {
  EMPTY_KEY: "",
  EMPTY_VALUE: "",
  TRUE: true,
  FALSE: false,
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  KEY_ALPHA: "ALPHA",
  KEY_BETA: "BETA",
  VAL_ALPHA: "aaa",
  VAL_BETA: "bbb",
} as const;

function isNonEmpty(value: string): boolean {
  return value.length > H.ZERO;
}

function makeState(items: VariableItem[] = []): VariablesState {
  return { items };
}

describe("variables-slice reducer", () => {
  it("returns initial state for unknown action", () => {
    const next = reducer(undefined, { type: "UNKNOWN" });
    expect(next.items).toEqual([]);
    expect(next.items.length).toBe(H.ZERO);
  });

  it("addRow adds a new empty row with a generated id", () => {
    const start = makeState([]);
    const next = reducer(start, addRow());

    expect(next.items.length).toBe(H.ONE);

    const created = next.items[H.ZERO];
    expect(isNonEmpty(created.id)).toBe(H.TRUE);
    expect(created.key).toBe(H.EMPTY_KEY);
    expect(created.value).toBe(H.EMPTY_VALUE);
    expect(created.enabled).toBe(H.FALSE);
  });

  it("removeRow removes only the matching item by id", () => {
    const items: VariableItem[] = [
      { id: "id-1", key: H.KEY_ALPHA, value: H.VAL_ALPHA, enabled: H.TRUE },
      { id: "id-2", key: H.KEY_BETA, value: H.VAL_BETA, enabled: H.FALSE },
    ];
    const start = makeState(items);

    const next = reducer(start, removeRow("id-1"));
    expect(next.items.length).toBe(H.ONE);
    expect(next.items[H.ZERO].id).toBe("id-2");
  });

  it("toggleEnabled sets enabled to the provided value for the targeted row", () => {
    const items: VariableItem[] = [
      { id: "id-1", key: H.KEY_ALPHA, value: H.VAL_ALPHA, enabled: H.FALSE },
    ];
    const start = makeState(items);

    const next = reducer(start, toggleEnabled({ id: "id-1", enabled: H.TRUE }));
    expect(next.items[H.ZERO].enabled).toBe(H.TRUE);

    const next2 = reducer(
      next,
      toggleEnabled({ id: "id-1", enabled: H.FALSE }),
    );
    expect(next2.items[H.ZERO].enabled).toBe(H.FALSE);
  });

  it("updateKey updates only the key of the targeted row", () => {
    const items: VariableItem[] = [
      { id: "id-1", key: H.EMPTY_KEY, value: H.VAL_ALPHA, enabled: H.TRUE },
    ];
    const start = makeState(items);

    const next = reducer(start, updateKey({ id: "id-1", key: H.KEY_ALPHA }));
    expect(next.items[H.ZERO].key).toBe(H.KEY_ALPHA);
    expect(next.items[H.ZERO].value).toBe(H.VAL_ALPHA);
  });

  it("updateValue updates only the value of the targeted row", () => {
    const items: VariableItem[] = [
      { id: "id-1", key: H.KEY_BETA, value: H.EMPTY_VALUE, enabled: H.TRUE },
    ];
    const start = makeState(items);

    const next = reducer(start, updateValue({ id: "id-1", value: H.VAL_BETA }));
    expect(next.items[H.ZERO].value).toBe(H.VAL_BETA);
    expect(next.items[H.ZERO].key).toBe(H.KEY_BETA);
  });

  it("ensureTrailingEmpty adds an empty row when none is present", () => {
    const start = makeState([
      { id: "id-1", key: H.KEY_ALPHA, value: H.VAL_ALPHA, enabled: H.TRUE },
    ]);

    const next = reducer(start, ensureTrailingEmpty());
    expect(next.items.length).toBe(H.TWO);

    const last = next.items[next.items.length - H.ONE];
    expect(last.key).toBe(H.EMPTY_KEY);
    expect(last.value).toBe(H.EMPTY_VALUE);
    expect(last.enabled).toBe(H.FALSE);
    expect(isNonEmpty(last.id)).toBe(H.TRUE);
  });

  it("ensureTrailingEmpty does nothing when an empty row already exists", () => {
    const start = makeState([
      { id: "id-1", key: H.KEY_ALPHA, value: H.VAL_ALPHA, enabled: H.TRUE },
      { id: "id-2", key: H.EMPTY_KEY, value: H.EMPTY_VALUE, enabled: H.FALSE },
    ]);

    const next = reducer(start, ensureTrailingEmpty());
    expect(next.items.length).toBe(H.TWO);
    expect(next.items[H.ONE].id).toBe("id-2");
  });

  it("setVariables replaces items wholesale", () => {
    const start = makeState([
      { id: "id-1", key: H.KEY_ALPHA, value: H.VAL_ALPHA, enabled: H.TRUE },
    ]);
    const replacement: VariableItem[] = [
      { id: "id-2", key: H.KEY_BETA, value: H.VAL_BETA, enabled: H.FALSE },
      { id: "id-3", key: "GAMMA", value: "ccc", enabled: H.TRUE },
    ];

    const next = reducer(start, setVariables(replacement));
    expect(next.items).toEqual(replacement);
  });
});

describe("variables-slice selectors", () => {
  it("selectVariables returns the items array", () => {
    const state: RootState = {
      variables: {
        items: [
          { id: "id-1", key: H.KEY_ALPHA, value: H.VAL_ALPHA, enabled: H.TRUE },
        ],
      },
    };
    const items = selectVariables(state);
    expect(items.length).toBe(H.ONE);
    expect(items[H.ZERO].id).toBe("id-1");
  });

  it("selectActiveVariablesObject maps enabled items with non-empty keys", () => {
    const state: RootState = {
      variables: {
        items: [
          { id: "id-1", key: H.KEY_ALPHA, value: H.VAL_ALPHA, enabled: H.TRUE },
          { id: "id-2", key: H.KEY_BETA, value: H.VAL_BETA, enabled: H.FALSE },
          { id: "id-3", key: H.EMPTY_KEY, value: "zzz", enabled: H.TRUE },
        ],
      },
    };

    const object = selectActiveVariablesObject(state);
    expect(Object.keys(object).length).toBe(H.ONE);
    expect(object[H.KEY_ALPHA]).toBe(H.VAL_ALPHA);
  });
});
