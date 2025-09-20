"use client";

import type { HistoryEntry } from "@shared/types";

import { mapHistoryEntryToRowView } from "@/features/history/history-row";
import { classNames } from "@/shared/styles";
import { getMethodColor } from "@/utils/helpers/get-method-color";
import { getStatusColor } from "@/utils/helpers/get-status-color";
import { getTimeAgo } from "@/utils/helpers/get-time-ago";

interface HistoryTableRowProps {
  entry: HistoryEntry;
  isSelected: boolean;
  onSelect: (entry: HistoryEntry) => void;
  onShowDetails: () => void;
  tableStyles: {
    cellPadding: string;
    headerBase: string;
    headerText: string;
    textMedium: string;
  };
}

export function HistoryTableRow({
  entry,
  isSelected,
  onSelect,
  tableStyles,
  onShowDetails,
}: HistoryTableRowProps) {
  const rowView = mapHistoryEntryToRowView(entry);

  return (
    <tr
      className={classNames(
        "cursor-pointer transition-colors hover:bg-gray-50",
        isSelected && "bg-blue-50",
      )}
      onClick={() => onSelect(entry)}
    >
      <td className={tableStyles.cellPadding}>
        <input
          checked={isSelected}
          className="h-4 w-4 cursor-pointer rounded accent-blue-600"
          readOnly
          type="checkbox"
        />
      </td>

      <td
        className={classNames(
          tableStyles.cellPadding,
          tableStyles.textMedium,
          getMethodColor(entry.request.method),
        )}
      >
        {entry.request.method}
      </td>

      <td
        className={classNames(
          tableStyles.cellPadding,
          tableStyles.textMedium,
          getStatusColor(rowView.httpStatus ?? 0),
        )}
      >
        {rowView.httpStatus ?? "—"}
      </td>

      <td
        className={classNames(tableStyles.cellPadding, "text-sm text-gray-500")}
      >
        {getTimeAgo(rowView.requestTimestamp)}
      </td>

      <td
        className={classNames(
          tableStyles.cellPadding,
          "max-w-xs truncate text-sm text-gray-900",
        )}
        title={entry.request.url}
      >
        {entry.request.url}

        {rowView.infoBadges.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            {rowView.infoBadges.map((badge, index) => (
              <span
                className={classNames(
                  "rounded bg-gray-100 px-1.5 py-0.5",
                  badge === "error" && "bg-red-100 text-red-700",
                )}
                key={index}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </td>

      <td className={classNames(tableStyles.cellPadding)}>
        <button
          className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
          onClick={(event) => {
            event.stopPropagation();
            onShowDetails();
          }}
          type="button"
        >
          Show
        </button>
      </td>
    </tr>
  );
}
