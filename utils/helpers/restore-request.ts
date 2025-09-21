import type { HistoryEntry } from "@/shared/types/types";
import { setBody } from "@/store/slices/body-editor-slice";
import { setSelectedMethod } from "@/store/slices/method-slice";
import { clearResponse } from "@/store/slices/request-slice";
import { setUrl } from "@/store/slices/url-slice";
import { store } from "@/store/store";
import {
  replaceHeadersFromObject,
  toHttpMethod,
} from "@/utils/helpers/request-restore-helpers";

export function restoreRequest(entry: HistoryEntry) {
  const method = toHttpMethod(entry.request?.method);
  const url = entry.request?.url || "";
  const body = entry.request?.body ?? "";
  const headersObject: Record<string, string> = entry.request?.headers ?? {};

  store.dispatch(setSelectedMethod(method));
  store.dispatch(setUrl(url));
  store.dispatch(setBody(body));

  replaceHeadersFromObject(headersObject);

  store.dispatch(clearResponse());
}
