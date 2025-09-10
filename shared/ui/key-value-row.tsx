import { KeyboardEvent } from "react";
import { useDispatch } from "react-redux";

import { KeyValueItem, KeyValueRowProps } from "@shared/types";

const isRowEmpty = (row: KeyValueItem) => !row.key.trim() && !row.value.trim();

export function KeyValueRow({
  row,
  index,
  keyPlaceholder,
  valuePlaceholder,
  onToggleEnabled,
  onUpdateKey,
  onUpdateValue,
  onRemoveRow,
  onEnsureTrailingEmpty,
  items,
}: KeyValueRowProps) {
  const dispatch = useDispatch();

  const handleBlur = () => {
    dispatch(onEnsureTrailingEmpty());
    if (row.key.trim() && row.value.trim()) {
      dispatch(onToggleEnabled({ id: row.id, enabled: true }));
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && row.key.trim() && row.value.trim()) {
      dispatch(onToggleEnabled({ id: row.id, enabled: true }));
      dispatch(onEnsureTrailingEmpty());

      const currentIndex = items.findIndex((item) => item.id === row.id);
      const nextInput = document.querySelector(
        `input[data-row-index="${currentIndex + 1}"][data-field="key"]`,
      );

      if (nextInput instanceof HTMLInputElement) {
        nextInput.focus();
      }
    }
  };

  return (
    <div className="contents" key={row.id}>
      <div className="py-4">
        <input
          checked={row.enabled}
          className="size-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isRowEmpty(row)}
          onChange={(event) =>
            dispatch(
              onToggleEnabled({
                id: row.id,
                enabled: event.target.checked,
              }),
            )
          }
          type="checkbox"
        />
      </div>
      <div className="py-2">
        <input
          className={`border-border-default hover:border-text-primary w-full border-b px-3 py-1 text-sm ${
            row.enabled ? "text-text-primary" : "text-text-secondary font-light"
          }`}
          data-field="key"
          data-row-index={index}
          onBlur={handleBlur}
          onChange={(event) =>
            dispatch(onUpdateKey({ id: row.id, key: event.target.value }))
          }
          onKeyDown={handleKeyDown}
          placeholder={keyPlaceholder}
          value={row.key}
        />
      </div>
      <div className="py-2">
        <input
          className={`border-border-default hover:border-text-primary w-full border-b px-3 py-1 text-sm ${
            row.enabled ? "text-text-primary" : "text-text-secondary font-light"
          }`}
          data-field="value"
          data-row-index={index}
          onBlur={handleBlur}
          onChange={(event) =>
            dispatch(onUpdateValue({ id: row.id, value: event.target.value }))
          }
          onKeyDown={handleKeyDown}
          placeholder={valuePlaceholder}
          value={row.value}
        />
      </div>
      <div className="py-2">
        <button
          aria-label="Remove row"
          className={`cursor-pointer rounded-xl p-1 ${
            isRowEmpty(row)
              ? "text-text-secondary cursor-not-allowed opacity-30"
              : "hover:text-text-primary text-text-secondary"
          }`}
          disabled={isRowEmpty(row)}
          onClick={() => !isRowEmpty(row) && dispatch(onRemoveRow(row.id))}
        >
          ×
        </button>
      </div>
    </div>
  );
}
