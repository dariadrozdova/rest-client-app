import { describe, expect, it } from "vitest";

import type { HeadersState } from "@shared/types";

import reducer, {
  addRow,
  ensureTrailingEmpty,
  removeRow,
  selectActiveHeadersObject,
  selectHeaders,
  toggleEnabled,
  updateKey,
  updateValue,
} from "@/store/slices/header-slice";

const ZERO = 0;
const ONE = 1;
const TWO = 2;

function initial(): HeadersState {
  return reducer(undefined, { type: "@@INIT" });
}

describe("headers slice", () => {
  it("returns initial state", () => {
    const state = initial();
    expect(state.items).toHaveLength(ZERO);
  });

  it("addRow appends a new disabled empty row with generated id", () => {
    const after = reducer(initial(), addRow());
    expect(after.items).toHaveLength(ONE);

    const row = after.items[0];
    expect(typeof row.id).toBe("string");
    expect(row.id.length).toBeGreaterThan(ZERO);
    expect(row.enabled).toBe(false);
    expect(row.key).toBe("");
    expect(row.value).toBe("");
  });

  it("removeRow removes by id and ignores unknown ids", () => {
    const s1 = reducer(initial(), addRow());
    const id = s1.items[0].id;

    const s2 = reducer(s1, removeRow(id));
    expect(s2.items).toHaveLength(ZERO);

    const s3 = reducer(s2, removeRow("non-existing-id"));
    expect(s3.items).toHaveLength(ZERO);
  });

  it("toggleEnabled flips the enabled flag for the targeted row", () => {
    const s1 = reducer(initial(), addRow());
    const id = s1.items[0].id;

    const s2 = reducer(s1, toggleEnabled({ id, enabled: true }));
    expect(s2.items[0].enabled).toBe(true);

    const s3 = reducer(s2, toggleEnabled({ id, enabled: false }));
    expect(s3.items[0].enabled).toBe(false);
  });

  it("updateKey and updateValue modify only the targeted row", () => {
    const s1 = reducer(initial(), addRow());
    const s2 = reducer(s1, addRow());
    const id1 = s2.items[0].id;
    const id2 = s2.items[1].id;

    const s3 = reducer(s2, updateKey({ id: id1, key: "Authorization" }));
    const s4 = reducer(s3, updateValue({ id: id1, value: "Bearer token" }));

    expect(s4.items[0].key).toBe("Authorization");
    expect(s4.items[0].value).toBe("Bearer token");

    expect(s4.items[1].key).toBe("");
    expect(s4.items[1].value).toBe("");

    const s5 = reducer(s4, updateKey({ id: id2, key: "X-Request-Id" }));
    const s6 = reducer(s5, updateValue({ id: id2, value: "123" }));

    expect(s6.items[1].key).toBe("X-Request-Id");
    expect(s6.items[1].value).toBe("123");
  });

  it("ensureTrailingEmpty adds one empty row if none exists", () => {
    const s1 = reducer(initial(), addRow());
    const id = s1.items[0].id;
    const s2 = reducer(s1, updateKey({ id, key: "Accept" }));
    const s3 = reducer(s2, updateValue({ id, value: "application/json" }));

    const s4 = reducer(s3, ensureTrailingEmpty());
    expect(s4.items).toHaveLength(TWO);
    const last = s4.items[1];
    expect(last.key).toBe("");
    expect(last.value).toBe("");
    expect(last.enabled).toBe(false);

    const s5 = reducer(s4, ensureTrailingEmpty());
    expect(s5.items).toHaveLength(TWO);
  });

  it("selectors: selectHeaders returns items; selectActiveHeadersObject maps enabled entries", () => {
    const s1 = reducer(initial(), addRow());
    const firstId = s1.items[0].id;

    const s2 = reducer(s1, updateKey({ id: firstId, key: "Accept" }));
    const s3 = reducer(
      s2,
      updateValue({ id: firstId, value: "application/json" }),
    );
    const s4 = reducer(s3, toggleEnabled({ id: firstId, enabled: true }));

    const s5 = reducer(s4, addRow());

    const root = { headers: s5 };

    const items = selectHeaders(root);
    expect(items).toHaveLength(TWO);

    const active = selectActiveHeadersObject(root);
    expect(active).toEqual({ Accept: "application/json" });
  });
});
