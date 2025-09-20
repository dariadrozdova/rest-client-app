"use client";

import type { HistoryEntry } from "@shared/types";

export default function RequestDetailsModal({
  open,
  onCloseAction,
  entry,
}: {
  entry: HistoryEntry | null;
  onCloseAction: () => void;
  open: boolean;
}) {
  if (!open || !entry) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-lg rounded-lg bg-white p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Request Details</h2>
          <button
            className="text-gray-500 hover:text-black"
            onClick={onCloseAction}
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <b>Time:</b> {entry.createdAt}
          </p>
          <p className="break-all">
            <b>URL:</b> {entry.request.url}
          </p>
          <p>
            <b>Method:</b> {entry.request.method}
          </p>
          <p>
            <b>Status:</b> {entry.response.status}{" "}
            {entry.response.statusText ?? ""}
          </p>
          {entry.response.meta?.requestDurationMs !== null &&
            entry.response.meta?.requestDurationMs !== undefined && (
              <p>
                <b>Duration:</b> {entry.response.meta.requestDurationMs} ms
              </p>
            )}
          {entry.response.meta?.requestSizeBytes !== null &&
            entry.response.meta?.requestSizeBytes !== undefined && (
              <p>
                <b>Request Size:</b> {entry.response.meta.requestSizeBytes} B
              </p>
            )}
          {entry.response.meta?.responseSizeBytes !== null &&
            entry.response.meta?.responseSizeBytes !== undefined && (
              <p>
                <b>Response Size:</b> {entry.response.meta.responseSizeBytes} B
              </p>
            )}
          {entry.response.error && (
            <div>
              <b>Error:</b>
              <pre className="mt-1 max-h-56 overflow-auto rounded bg-gray-100 p-2 text-xs whitespace-pre-wrap">
                {entry.response.error}
              </pre>
            </div>
          )}
        </div>

        <button
          className="mt-4 rounded bg-blue-600 px-4 py-1 text-white"
          onClick={onCloseAction}
        >
          Close
        </button>
      </div>
    </div>
  );
}
