"use client";

import { useTranslations } from "next-intl";

import { HistoryEmptyState } from "@app/[locale]/(protected)/_components/history-table/history-empty-state";
import { HistoryHeader } from "@app/[locale]/(protected)/_components/history-table/history-header";
import { HistoryTableContent } from "@app/[locale]/(protected)/_components/history-table/history-table-content";
import type { HistoryEntry } from "@shared/types";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectHistory,
  selectSelectedEntryId,
  setSelectedEntryId,
} from "@/store/slices/history-slice";
import { executeRequest } from "@/store/slices/request-slice";
import { selectResolvedRequest } from "@/utils/helpers/resolve-request";
import { restoreRequest } from "@/utils/helpers/restore-request";

export function HistoryTable() {
  const t = useTranslations("history-table");
  const dispatch = useAppDispatch();

  const entries = useAppSelector(selectHistory);
  const selectedEntryId = useAppSelector(selectSelectedEntryId);
  const activeTab = useAppSelector((s) => s.tabs.activeTab);
  const resolvedOutput = useAppSelector(selectResolvedRequest);

  if (activeTab !== "requestHistory") {
    return null;
  }

  const handleSelect = (entry: HistoryEntry) => {
    dispatch(setSelectedEntryId(entry.id));
    restoreRequest(entry);
  };

  const handleReRun = () => {
    const selectedEntry = entries.find(
      (element) => element.id === selectedEntryId,
    );
    if (!selectedEntry) {
      return;
    }
    restoreRequest(selectedEntry);
    dispatch(executeRequest(resolvedOutput));
  };

  if (!entries || entries.length === 0) {
    return <HistoryEmptyState />;
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <HistoryHeader
        canRerun={!!selectedEntryId}
        onRerun={handleReRun}
        title={t("title")}
      />
      <HistoryTableContent
        entries={entries}
        labels={{
          method: t("columns.method"),
          status: t("columns.status"),
          time: t("columns.time"),
          endpoint: t("columns.endpoint"),
        }}
        onSelect={handleSelect}
        selectedEntryId={selectedEntryId}
      />
    </div>
  );
}
