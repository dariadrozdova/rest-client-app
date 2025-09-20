"use client";

import { useState } from "react";

import RequestDetailsModal from "@app/[locale]/(protected)/_components/history-table/request-details-modal";
import type { HistoryEntry } from "@shared/types";

import { HistoryHeader } from "@/app/[locale]/(protected)/_components/history-table/history-header";
import { HistoryTableContent } from "@/app/[locale]/(protected)/_components/history-table/history-table-content";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectSelectedEntryId,
  setSelectedEntryId,
} from "@/store/slices/history-slice";
import { executeRequest } from "@/store/slices/request-slice";
import { store } from "@/store/store";
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

  const [open, setOpen] = useState(false);
  const [modalEntry, setModalEntry] = useState<HistoryEntry | null>(null);

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

  const handleShowDetails = (entry: HistoryEntry) => {
    setModalEntry(entry);
    setOpen(true);
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
        onShowDetails={handleShowDetails}
        selectedEntryId={selectedEntryId}
      />
      <RequestDetailsModal
        entry={modalEntry}
        onCloseAction={() => setOpen(false)}
        open={open}
      />
    </div>
  );
}
