"use client";

import type { HistoryEntry } from "@shared/types";

import { classNames } from "@/shared/styles";
import { getMethodColor } from "@/utils/helpers/get-method-color";
import { getStatusColor } from "@/utils/helpers/get-status-color";
import { getTimeAgo } from "@/utils/helpers/get-time-ago";

interface HistoryTableRowProps {
  entry: HistoryEntry;
  isSelected: boolean;
  onSelect: (entry: HistoryEntry) => void;
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
}: HistoryTableRowProps) {
  const status = entry.response?.status ?? null;

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
          getStatusColor(status ?? 0),
        )}
      >
        {status ?? "—"}
      </td>
      <td
        className={classNames(tableStyles.cellPadding, "text-sm text-gray-500")}
      >
        {getTimeAgo(entry.createdAt)}
      </td>
      <td
        className={classNames(
          tableStyles.cellPadding,
          "max-w-xs truncate text-sm text-gray-900",
        )}
        title={entry.request.url}
      >
        {entry.request.url}
      </td>
    </tr>
  );
}
