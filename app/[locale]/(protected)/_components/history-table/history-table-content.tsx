import { HistoryTableRow } from "@app/[locale]/(protected)/_components/history-table/history-table-row";
import { classNames } from "@shared/styles";
import type { HistoryEntry } from "@shared/types";

const TABLE_STYLES = {
  cellPadding: "px-4 py-3",
  headerBase: "px-4 py-3 text-left",
  headerText: "text-xs font-medium text-gray-500 uppercase tracking-wider",
  textMedium: "font-medium text-sm",
} as const;

export function HistoryTableContent({
  entries,
  labels,
  onSelect,
  selectedEntryId,
  onShowDetails,
}: {
  entries: HistoryEntry[];
  labels: { endpoint: string; method: string; status: string; time: string };
  onSelect: (event_: HistoryEntry) => void;
  onShowDetails: (event_: HistoryEntry) => void;
  selectedEntryId?: null | string;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
      <div className="max-h-[calc(100vh-16rem)] overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className={classNames(TABLE_STYLES.headerBase)} />
              <th
                className={classNames(
                  TABLE_STYLES.headerBase,
                  TABLE_STYLES.headerText,
                )}
              >
                {labels.method}
              </th>
              <th
                className={classNames(
                  TABLE_STYLES.headerBase,
                  TABLE_STYLES.headerText,
                )}
              >
                {labels.status}
              </th>
              <th
                className={classNames(
                  TABLE_STYLES.headerBase,
                  TABLE_STYLES.headerText,
                )}
              >
                {labels.time}
              </th>
              <th
                className={classNames(
                  TABLE_STYLES.headerBase,
                  TABLE_STYLES.headerText,
                )}
              >
                {labels.endpoint}
              </th>

              <th
                className={classNames(
                  TABLE_STYLES.headerBase,
                  TABLE_STYLES.headerText,
                )}
              >
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <HistoryTableRow
                entry={entry}
                isSelected={entry.id === selectedEntryId}
                key={entry.id}
                onSelect={() => onSelect(entry)}
                onShowDetails={() => onShowDetails(entry)}
                tableStyles={TABLE_STYLES}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
