import React from "react";

import { createAction } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { KeyValueRow } from "@/shared/ui";

// dispatch spy
const dispatchSpy = vi.fn((action: unknown) => action);
vi.mock("react-redux", () => ({
  useDispatch: () => dispatchSpy,
}));

// --- real action creators ---
const onEnsureTrailingEmpty = createAction("kv/ensureTrailingEmpty");
const onToggleEnabled = createAction<{ enabled: boolean; id: string }>(
  "kv/toggleEnabled",
);
const onUpdateKey = createAction<{ id: string; key: string }>("kv/updateKey");
const onUpdateValue = createAction<{ id: string; value: string }>(
  "kv/updateValue",
);
const onRemoveRow = createAction<string>("kv/removeRow");

describe("KeyValueRow", () => {
  const keyPH = "Key";
  const valuePH = "Value";
  const firstId = "row-1";
  const secondId = "row-2";

  beforeEach(() => {
    dispatchSpy.mockClear();
  });

  it("enables row and ensures trailing empty on Enter; focuses next row", async () => {
    const user = userEvent.setup();
    const items = [
      { id: firstId, key: "", value: "", enabled: false },
      { id: secondId, key: "", value: "", enabled: false },
    ];

    render(
      <div>
        <KeyValueRow
          index={0}
          items={items}
          keyPlaceholder={keyPH}
          onEnsureTrailingEmpty={onEnsureTrailingEmpty}
          onRemoveRow={onRemoveRow}
          onToggleEnabled={onToggleEnabled}
          onUpdateKey={onUpdateKey}
          onUpdateValue={onUpdateValue}
          row={items[0]}
          valuePlaceholder={valuePH}
        />
        <KeyValueRow
          index={1}
          items={items}
          keyPlaceholder={keyPH}
          onEnsureTrailingEmpty={onEnsureTrailingEmpty}
          onRemoveRow={onRemoveRow}
          onToggleEnabled={onToggleEnabled}
          onUpdateKey={onUpdateKey}
          onUpdateValue={onUpdateValue}
          row={items[1]}
          valuePlaceholder={valuePH}
        />
      </div>,
    );

    const inputs = screen.getAllByRole("textbox");
    // find by data attributes if present; if not, rely on order: [key0, value0, key1, value1]
    const FIRST_INDEX = 0;
    const SECOND_INDEX = 1;
    const THIRD_INDEX = 2;

    const firstKeyInput = inputs[FIRST_INDEX];
    const firstValueInput = inputs[SECOND_INDEX];
    const nextKeyInput = inputs[THIRD_INDEX];

    const KEY_TEXT = "Authorization";
    const VALUE_TEXT = "Bearer TOKEN";
    await user.type(firstKeyInput, KEY_TEXT);
    await user.type(firstValueInput, `${VALUE_TEXT}{enter}`);

    // ensure the proper actions were dispatched
    expect(dispatchSpy).toHaveBeenCalledWith(
      onUpdateKey({ id: firstId, key: KEY_TEXT }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      onUpdateValue({ id: firstId, value: VALUE_TEXT }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      onToggleEnabled({ id: firstId, enabled: true }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(onEnsureTrailingEmpty());

    // focus moved
    expect(document.activeElement).toBe(nextKeyInput);
  });

  it("remove row dispatches correct action", async () => {
    const user = userEvent.setup();
    const row = { id: firstId, key: "K", value: "V", enabled: true };
    const items = [row];

    render(
      <KeyValueRow
        index={0}
        items={items}
        keyPlaceholder={keyPH}
        onEnsureTrailingEmpty={onEnsureTrailingEmpty}
        onRemoveRow={onRemoveRow}
        onToggleEnabled={onToggleEnabled}
        onUpdateKey={onUpdateKey}
        onUpdateValue={onUpdateValue}
        row={row}
        valuePlaceholder={valuePH}
      />,
    );

    const removeButton = screen.getByRole("button", { name: /remove row/i });
    await user.click(removeButton);
    expect(dispatchSpy).toHaveBeenCalledWith(onRemoveRow(firstId));
  });
});
