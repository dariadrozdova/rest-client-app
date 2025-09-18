import React from "react";

import { createAction } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { KeyValueEditor } from "@shared/ui";

// capture dispatched actions
const dispatchSpy = vi.fn((action: unknown) => action);
vi.mock("react-redux", () => ({
  useDispatch: () => dispatchSpy,
}));

// --- real action creators (match the prop types) ---
const onEnsureTrailingEmpty = createAction("kv/ensureTrailingEmpty");
const onToggleEnabled = createAction<{ enabled: boolean; id: string }>(
  "kv/toggleEnabled",
);
const onUpdateKey = createAction<{ id: string; key: string }>("kv/updateKey");
const onUpdateValue = createAction<{ id: string; value: string }>(
  "kv/updateValue",
);
const onRemoveRow = createAction<string>("kv/removeRow");

describe("KeyValueEditor", () => {
  const title = "Headers";
  const keyPH = "Key";
  const valuePH = "Value";
  const baseItem = { id: "row-1", key: "", value: "", enabled: false };

  it("dispatches ensure-trailing-empty on mount and on items change", () => {
    const firstItems = [baseItem];

    const { rerender } = render(
      <KeyValueEditor
        items={firstItems}
        keyPlaceholder={keyPH}
        onEnsureTrailingEmpty={onEnsureTrailingEmpty}
        onRemoveRow={onRemoveRow}
        onToggleEnabled={onToggleEnabled}
        onUpdateKey={onUpdateKey}
        onUpdateValue={onUpdateValue}
        title={title}
        valuePlaceholder={valuePH}
      />,
    );

    // once on mount
    expect(dispatchSpy).toHaveBeenCalledWith(onEnsureTrailingEmpty());

    // and again after items change
    const secondItems = [
      ...firstItems,
      { id: "row-2", key: "", value: "", enabled: false },
    ];
    rerender(
      <KeyValueEditor
        items={secondItems}
        keyPlaceholder={keyPH}
        onEnsureTrailingEmpty={onEnsureTrailingEmpty}
        onRemoveRow={onRemoveRow}
        onToggleEnabled={onToggleEnabled}
        onUpdateKey={onUpdateKey}
        onUpdateValue={onUpdateValue}
        title={title}
        valuePlaceholder={valuePH}
      />,
    );

    // count calls using the action equality
    const ensureCalls = dispatchSpy.mock.calls.filter(
      ([a]) => typeof a === "object" && a,
    ).length;
    const EXPECTED_ENSURE_CALLS = 2;
    expect(ensureCalls).toBe(EXPECTED_ENSURE_CALLS);
  });
});
