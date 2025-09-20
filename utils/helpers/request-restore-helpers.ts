import { HTTP_METHODS } from "@shared/globals";
import type { HttpMethod } from "@shared/types";

import {
  addRow,
  ensureTrailingEmpty,
  removeRow,
  selectHeaders,
  toggleEnabled,
  updateKey,
  updateValue,
} from "@/store/slices/header-slice";
import { store } from "@/store/store";

const HTTP_METHODS_SET: ReadonlySet<string> = new Set(HTTP_METHODS.map(String));

export function isHttpMethod(x: string): x is HttpMethod {
  return HTTP_METHODS_SET.has(x);
}

export function replaceHeadersFromObject(
  headersObject: Record<string, string>,
) {
  const current = selectHeaders(store.getState());
  for (const row of current) {
    store.dispatch(removeRow(row.id));
  }

  for (const [key, value] of Object.entries(headersObject)) {
    store.dispatch(addRow());
    const last = selectHeaders(store.getState()).at(-1);
    if (!last) {
      continue;
    }
    store.dispatch(updateKey({ id: last.id, key }));
    store.dispatch(updateValue({ id: last.id, value: String(value ?? "") }));
    store.dispatch(toggleEnabled({ id: last.id, enabled: true }));
  }

  store.dispatch(ensureTrailingEmpty());
}

export function toHttpMethod(m?: string): HttpMethod {
  const up = (m ?? "GET").toUpperCase();
  return isHttpMethod(up) ? up : "GET";
}
