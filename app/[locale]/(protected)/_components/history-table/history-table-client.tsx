"use client";

import type { HistoryEntry } from "@shared/types";

import { HistoryHeader } from "@/app/[locale]/(protected)/_components/history-table/history-header";
import { HistoryTableContent } from "@/app/[locale]/(protected)/_components/history-table/history-table-content";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectSelectedEntryId,
  setSelectedEntryId,
} from "@/store/slices/history-slice";
import { executeRequest } from "@/store/slices/request-slice";
import { selectResolvedRequest } from "@/utils/helpers/resolve-request";
import { restoreRequest } from "@/utils/helpers/restore-request";

export function HistoryTableClient({
  entries,
  labels,
  title,
}: {
  entries: HistoryEntry[];
  labels: { endpoint: string; method: string; status: string; time: string };
  title: string;
}) {
  const dispatch = useAppDispatch();
  const selectedEntryId = useAppSelector(selectSelectedEntryId);
  const resolvedOutput = useAppSelector(selectResolvedRequest);

  const handleSelect = (entry: HistoryEntry) => {
    dispatch(setSelectedEntryId(entry.id));
    restoreRequest(entry);
  };

  const handleReRun = () => {
    const selectedEntry = entries.find((error) => error.id === selectedEntryId);
    if (!selectedEntry) {
      return;
    }
    restoreRequest(selectedEntry);
    dispatch(executeRequest(resolvedOutput));
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <HistoryHeader
        canRerun={!!selectedEntryId}
        onRerun={handleReRun}
        title={title}
      />
      <HistoryTableContent
        entries={entries}
        labels={labels}
        onSelect={handleSelect}
        selectedEntryId={selectedEntryId}
      />
    </div>
  );
}
