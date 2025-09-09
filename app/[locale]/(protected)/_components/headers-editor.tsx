"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ensureTrailingEmpty,
  removeRow,
  selectHeaders,
  toggleEnabled,
  updateKey,
  updateValue,
} from "@/store/slices/header-slice";

export function HeadersEditor() {
  const dispatch = useDispatch();
  const rows = useSelector(selectHeaders);

  useEffect(() => {
    dispatch(ensureTrailingEmpty());
  }, [rows, dispatch]);

  return (
    <div className="space-y-3 p-6">
      <h3 className="text-text-secondary text-sm font-semibold">
        HTTP Headers
      </h3>

      <div className="divide-border-default grid grid-cols-[1.5rem_1fr_1fr_0.5rem] gap-x-6">
        {rows.map((row) => (
          <div className="contents" key={row.id}>
            <div className="py-4">
              <input
                checked={row.enabled}
                className="size-4"
                onChange={(event) =>
                  dispatch(
                    toggleEnabled({
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
                className="border-border-default hover:border-text-primary w-full border-b px-3 py-1 text-sm"
                onBlur={() => dispatch(ensureTrailingEmpty())}
                onChange={(event) =>
                  dispatch(updateKey({ id: row.id, key: event.target.value }))
                }
                placeholder="header"
                value={row.key}
              />
            </div>

            <div className="py-2">
              <input
                className="border-border-default hover:border-text-primary w-full border-b px-3 py-1 text-sm"
                onBlur={() => dispatch(ensureTrailingEmpty())}
                onChange={(event) =>
                  dispatch(
                    updateValue({ id: row.id, value: event.target.value }),
                  )
                }
                placeholder="value"
                value={row.value}
              />
            </div>

            <div className="py-2">
              <button
                aria-label="Remove header"
                className="hover:text-text-primary text-text-secondary cursor-pointer rounded-xl p-1"
                onClick={() => dispatch(removeRow(row.id))}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
