"use client";

import { useDispatch, useSelector } from "react-redux";

import type { HistoryEntry } from "@shared/types";

import { HistoryTableRow } from "@/app/[locale]/(protected)/_components/history-table/history-table-row";
import { classNames } from "@/shared/styles";
import {
  selectHistory,
  selectSelectedEntryId,
  setSelectedEntryId,
} from "@/store/slices/history-slice";
import { executeRequest } from "@/store/slices/request-slice";
import type { AppDispatch, RootState } from "@/store/store";
import { selectResolvedRequest } from "@/utils/helpers/resolve-request";
import { restoreRequestFromEntry } from "@/utils/helpers/restore-request";

const TABLE_STYLES = {
  cellPadding: "px-4 py-3",
  headerBase: "px-4 py-3 text-left",
  headerText: "text-xs font-medium text-gray-500 uppercase tracking-wider",
  textMedium: "font-medium text-sm",
} as const;

export function HistoryTable() {
  const dispatch = useDispatch<AppDispatch>();
  const entries = useSelector(selectHistory);
  const selectedEntryId = useSelector(selectSelectedEntryId);
  const activeTab = useSelector((s: RootState) => s.tabs.activeTab);
  const resolvedOutput = useSelector(selectResolvedRequest);

  if (activeTab !== "requestHistory") {
    return null;
  }

  const handleSelect = (entry: HistoryEntry) => {
    dispatch(setSelectedEntryId(entry.id));
    restoreRequestFromEntry(dispatch, entry);
  };

  const handleReRun = () => {
    const selectedEntry = entries.find((event) => event.id === selectedEntryId);
    if (!selectedEntry) {
      return;
    }
    restoreRequestFromEntry(dispatch, selectedEntry);
    dispatch(executeRequest(resolvedOutput));
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-gray-700">Find Activity</h2>
        <button
          className={classNames(
            "bg-accent-blue border-accent-blue rounded-md border",
            "px-4 py-2 text-sm font-medium text-white",
            selectedEntryId
              ? "cursor-pointer hover:brightness-110"
              : "cursor-not-allowed opacity-50",
          )}
          disabled={!selectedEntryId}
          onClick={handleReRun}
        >
          Re-run
        </button>
      </div>

      <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className={classNames(TABLE_STYLES.headerBase)} />
              <th
                className={classNames(
                  TABLE_STYLES.headerBase,
                  TABLE_STYLES.headerText,
                )}
              >
                Method
              </th>
              <th
                className={classNames(
                  TABLE_STYLES.headerBase,
                  TABLE_STYLES.headerText,
                )}
              >
                Status
              </th>
              <th
                className={classNames(
                  TABLE_STYLES.headerBase,
                  TABLE_STYLES.headerText,
                )}
              >
                Time
              </th>
              <th
                className={classNames(
                  TABLE_STYLES.headerBase,
                  TABLE_STYLES.headerText,
                )}
              >
                Endpoint
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {entries.map((entry) => (
              <HistoryTableRow
                entry={entry}
                isSelected={selectedEntryId === entry.id}
                key={entry.id}
                onSelect={handleSelect}
                tableStyles={TABLE_STYLES}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
