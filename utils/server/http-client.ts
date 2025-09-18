import { addHistoryEntry } from "@utils/server/history-store";

import {
  byteLength,
  isBodyAllowed,
  parseMaybeJson,
  toHeadersObject,
} from "@/utils/server/http-utils";
import { getUidFromRequest } from "@/utils/server/uid-from-request";

export interface ExecutedResponse {
  body: string;
  contentType?: string;
  headers: Record<string, string>;
  status: number;
  statusText: string;
}

export interface RequestPayload {
  body?: null | string;
  headers?: Record<string, string>;
  method: string;
  url: string;
}

export interface ResponseDTO {
  body: unknown;
  headers: Record<string, string>;
  meta: {
    requestDurationMs: number;
    requestSizeBytes: number;
    requestTimestamp: string;
    responseSizeBytes: number;
  };
  status: number;
  statusText: string;
}

export function buildResponseDTO(
  payload: RequestPayload,
  executed: ExecutedResponse,
  startedAt: number,
): ResponseDTO {
  const requestTimestamp = new Date(startedAt).toISOString();

  const readableBody = parseMaybeJson(executed.body, executed.contentType);

  return {
    status: executed.status,
    statusText: executed.statusText,
    headers: executed.headers,
    body: readableBody,
    meta: {
      requestDurationMs: Date.now() - startedAt,
      requestSizeBytes: byteLength(payload.body),
      responseSizeBytes: byteLength(executed.body),
      requestTimestamp,
    },
  };
}

export async function executeHttp(
  payload: RequestPayload,
): Promise<ExecutedResponse> {
  const response = await fetch(payload.url, {
    method: payload.method,
    headers: payload.headers,
    body: isBodyAllowed(payload.method)
      ? (payload.body ?? undefined)
      : undefined,
  });

  const bodyText = await response.text();
  const headersObject = toHeadersObject(response.headers);
  const contentType = headersObject["content-type"];

  return {
    status: response.status,
    statusText: response.statusText,
    headers: headersObject,
    body: bodyText,
    contentType,
  };
}

export async function persistHistorySafe(
  request: Request,
  startedAt: number,
  payload: RequestPayload,
  executed: ExecutedResponse,
) {
  try {
    const uid = await getUidFromRequest(request);
    if (!uid) {
      return;
    }

    await addHistoryEntry(uid, {
      timestamp: new Date(startedAt).toISOString(),
      url: payload.url,
      method: payload.method,
      status: executed.status,
      statusText: executed.statusText,
      duration: Date.now() - startedAt,
      requestSize: byteLength(payload.body),
      responseSize: byteLength(executed.body),
      headers: payload.headers ?? {},
      body: payload.body ?? "",
    });
  } catch (error) {
    console.warn("Failed to append history:", error);
  }
}
