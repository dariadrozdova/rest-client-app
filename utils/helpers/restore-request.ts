import { HistoryEntry } from "@/shared/types";
import { setBody } from "@/store/slices/body-editor-slice";
import { setSelectedMethod } from "@/store/slices/method-slice";
import { clearResponse } from "@/store/slices/request-slice";
import { setUrl } from "@/store/slices/url-slice";
import { AppDispatch } from "@/store/store";

export function restoreRequestFromEntry(
  dispatch: AppDispatch,
  entry: HistoryEntry,
) {
  dispatch(setSelectedMethod(entry.request.method));
  dispatch(setUrl(entry.request.url));
  dispatch(setBody(entry.request.body ?? ""));
  dispatch(clearResponse());
}
