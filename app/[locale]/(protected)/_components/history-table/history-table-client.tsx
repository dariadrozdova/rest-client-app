"use client";

import { useEffect } from "react";

import type { HistoryEntry } from "@shared/types";

import { HistoryHeader } from "@/app/[locale]/(protected)/_components/history-table/history-header";
import { HistoryTableContent } from "@/app/[locale]/(protected)/_components/history-table/history-table-content";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectHistory,
  selectSelectedEntryId,
  setHistory,
  setSelectedEntryId,
} from "@/store/slices/history-slice";
import { executeRequest } from "@/store/slices/request-slice";
import { store } from "@/store/store";
import { selectResolvedRequest } from "@/utils/helpers/resolve-request";
import { restoreRequest } from "@/utils/helpers/restore-request";

export function HistoryTableClient({
  initialEntries,
  labels,
  title,
}: {
  initialEntries: HistoryEntry[];
  labels: { endpoint: string; method: string; status: string; time: string };
  title: string;
}) {
  const dispatch = useAppDispatch();
  const entries = useAppSelector(selectHistory);
  const selectedEntryId = useAppSelector(selectSelectedEntryId);

  useEffect(() => {
    dispatch(setHistory(initialEntries));
  }, [initialEntries, dispatch]);

  const handleSelect = (entry: HistoryEntry) => {
    dispatch(setSelectedEntryId(entry.id));
    restoreRequest(entry);
  };

  const handleReRun = () => {
    const selectedEntry = entries.find((item) => item.id === selectedEntryId);
    if (!selectedEntry) {
      return;
    }
    restoreRequest(selectedEntry);
    const resolvedOutput = selectResolvedRequest(store.getState());
    dispatch(executeRequest(resolvedOutput));
  };

  if (entries.length === 0) {
    return null;
  }

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
