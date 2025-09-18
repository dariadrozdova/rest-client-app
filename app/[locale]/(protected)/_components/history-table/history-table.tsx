import { getTranslations } from "next-intl/server";

import { HistoryEmptyState } from "@app/[locale]/(protected)/_components/history-table/history-empty-state";
import type { HistoryEntry } from "@shared/types";
import { getUserHistory } from "@utils/server/history-store";
import { getUidFromCookies } from "@utils/server/uid-from-request";

import { HistoryTableClient } from "@/app/[locale]/(protected)/_components/history-table/history-table-client";

export async function HistoryTable() {
  const t = await getTranslations("history-table");
  const uid = await getUidFromCookies();
  if (!uid) {
    return <HistoryEmptyState />;
  }

  let entries: HistoryEntry[];
  try {
    const databaseItems = await getUserHistory(uid);
    entries = databaseItems.map((entry) => ({
      id: entry.id ?? "",
      createdAt: entry.timestamp,
      request: {
        method: entry.method,
        url: entry.url,
        headers: entry.headers ?? {},
        body: entry.body ?? null,
      },
      response: {
        status: entry.status,
        statusText: entry.statusText ?? "",
        error: entry.error ?? null,
        meta: {
          requestDurationMs: entry.duration,
          requestSizeBytes: entry.requestSize,
          responseSizeBytes: entry.responseSize,
          requestTimestamp: entry.timestamp,
        },
      },
    }));
  } catch {
    entries = [];
  }

  if (entries.length === 0) {
    return <HistoryEmptyState />;
  }

  return (
    <HistoryTableClient
      entries={entries}
      labels={{
        method: t("columns.method"),
        status: t("columns.status"),
        time: t("columns.time"),
        endpoint: t("columns.endpoint"),
      }}
      title={t("title")}
    />
  );
}
