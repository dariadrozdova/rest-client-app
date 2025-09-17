import { formatBytes } from "@utils/helpers/format-bytes";

import type { HistoryEntry } from "@/shared/types";

export interface HistoryRowViewModel {
  durationMs: null | number;
  errorMessage: null | string;
  httpStatus?: number;
  infoBadges: string[];
  requestSizeBytes: null | number;
  requestTimestamp: string;
  responseSizeBytes: null | number;
}

export function mapHistoryEntryToRowView(
  entry: HistoryEntry,
): HistoryRowViewModel {
  const STATUS_MIN = 100;
  const STATUS_MAX = 599;
  const httpStatus =
    typeof entry.response?.status === "number" &&
    entry.response.status >= STATUS_MIN &&
    entry.response.status <= STATUS_MAX
      ? entry.response.status
      : undefined;

  const meta = entry.response?.meta ?? {};
  const requestTimestamp: string = meta.requestTimestamp ?? entry.createdAt;

  const durationMs =
    typeof meta.requestDurationMs === "number" ? meta.requestDurationMs : null;
  const requestSizeBytes =
    typeof meta.requestSizeBytes === "number" ? meta.requestSizeBytes : null;
  const responseSizeBytes =
    typeof meta.responseSizeBytes === "number" ? meta.responseSizeBytes : null;
  const errorMessage = entry.response?.error ?? null;

  const infoBadges: string[] = [];
  if (durationMs !== null) {
    infoBadges.push(`${durationMs} ms`);
  }
  if (requestSizeBytes !== null) {
    infoBadges.push(`req ${formatBytes(requestSizeBytes)}`);
  }
  if (responseSizeBytes !== null) {
    infoBadges.push(`res ${formatBytes(responseSizeBytes)}`);
  }
  if (errorMessage) {
    infoBadges.push("error");
  }

  return {
    httpStatus,
    requestTimestamp,
    durationMs,
    requestSizeBytes,
    responseSizeBytes,
    errorMessage,
    infoBadges,
  };
}
