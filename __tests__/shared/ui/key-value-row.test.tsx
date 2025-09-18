import { createAction } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { KeyValueRow } from "@/shared/ui";

const dispatchSpy = vi.fn((action: unknown) => action);
vi.mock("react-redux", () => ({
  useDispatch: () => dispatchSpy,
}));

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
  const KEY_PH = "Key";
  const VALUE_PH = "Value";
  const FIRST_ID = "row-1";
  beforeEach(() => {
    dispatchSpy.mockClear();
  });
  it("removes row via button", async () => {
    const user = userEvent.setup();
    const row = { id: FIRST_ID, key: "K", value: "V", enabled: true };
    const items = [row];

    render(
      <KeyValueRow
        index={0}
        items={items}
        keyPlaceholder={KEY_PH}
        onEnsureTrailingEmpty={onEnsureTrailingEmpty}
        onRemoveRow={onRemoveRow}
        onToggleEnabled={onToggleEnabled}
        onUpdateKey={onUpdateKey}
        onUpdateValue={onUpdateValue}
        row={row}
        valuePlaceholder={VALUE_PH}
      />,
    );

    const removeButton = screen.getByRole("button", { name: /remove row/i });
    await user.click(removeButton);

    expect(dispatchSpy).toHaveBeenCalledWith(onRemoveRow(FIRST_ID));
  });
});
