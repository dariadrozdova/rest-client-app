"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { KeyValueEditorProps } from "@shared/types";
import { KeyValueRow } from "@shared/ui/key-value-row";

export function KeyValueEditor({
  title,
  items,
  keyPlaceholder,
  valuePlaceholder,
  onToggleEnabled,
  onUpdateKey,
  onUpdateValue,
  onRemoveRow,
  onEnsureTrailingEmpty,
}: KeyValueEditorProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onEnsureTrailingEmpty());
  }, [items, dispatch, onEnsureTrailingEmpty]);

  return (
    <div className="space-y-3 p-6">
      <h3 className="text-text-secondary text-sm font-semibold">{title}</h3>
      <div className="divide-border-default grid grid-cols-[1.5rem_1fr_1fr_0.5rem] gap-x-6">
        {items.map((row, index) => (
          <KeyValueRow
            index={index}
            items={items}
            key={row.id}
            keyPlaceholder={keyPlaceholder}
            onEnsureTrailingEmpty={onEnsureTrailingEmpty}
            onRemoveRow={onRemoveRow}
            onToggleEnabled={onToggleEnabled}
            onUpdateKey={onUpdateKey}
            onUpdateValue={onUpdateValue}
            row={row}
            valuePlaceholder={valuePlaceholder}
          />
        ))}
      </div>
    </div>
  );
}
