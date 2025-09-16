"use client";

import { useDispatch, useSelector } from "react-redux";

import { Button } from "@app/[locale]/(auth)/_components/form-button";

import Table from "@/shared/ui/table";
import { setBody } from "@/store/slices/body-editor-slice";
import type { HistoryEntry } from "@/store/slices/history-slice";
import { setSelectedMethod } from "@/store/slices/method-slice";
import { clearResponse } from "@/store/slices/request-slice";
import { setUrl } from "@/store/slices/url-slice";
import type { RootState } from "@/store/store";
import { getStatusColor } from "@/utils/helpers/get-status-color";

export function HistoryTable() {
  const dispatch = useDispatch();

  const activeTab = useSelector((s: RootState) => s.tabs.activeTab);
  const entries = useSelector((s: RootState) => s.history.entries);
  const isOpen = activeTab === "requestHistory";

  const restore = (entry: HistoryEntry) => {
    dispatch(setSelectedMethod(entry.request.method));
    dispatch(setUrl(entry.request.url));
    dispatch(setBody(entry.request.body ?? ""));
    dispatch(clearResponse());
  };

  if (!isOpen) {
    return null;
  }

  if (entries.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        No requests yet. Run one in the REST client — history will appear here.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Request History</h2>
        <div className="flex items-center gap-2">
          <Button>Re-run</Button>
        </div>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Status</th>
            <th>Time</th>
            <th>Endpoint</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const status = entry.response?.status ?? null;
            const durationMs = entry.response?.meta?.requestDurationMs;

            return (
              <tr
                className="cursor-pointer"
                key={entry.id}
                onClick={() => restore(entry)}
              >
                <td className="font-mono">{entry.request.method}</td>
                <td className={`font-mono ${getStatusColor(status)}`}>
                  {status ?? "—"}
                </td>
                <td title={new Date(entry.createdAt).toLocaleString()}>
                  {typeof durationMs === "number"
                    ? `${durationMs} ms`
                    : new Date(entry.createdAt).toLocaleTimeString()}
                </td>
                <td
                  className="max-w-[540px] truncate"
                  title={entry.request.url}
                >
                  {entry.request.url}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
