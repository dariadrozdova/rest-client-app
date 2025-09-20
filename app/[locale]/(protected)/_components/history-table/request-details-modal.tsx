"use client";

import { X } from "lucide-react";

import { ModalContent } from "@app/[locale]/(protected)/_components/history-table/modal-content";
import type { HistoryEntry } from "@shared/types";

export default function RequestDetailsModal({
  open,
  onCloseAction,
  entry,
}: {
  entry: HistoryEntry | null;
  onCloseAction: () => void;
  open: boolean;
}) {
  if (!open || !entry) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/30" onClick={onCloseAction} />

      <div className="relative z-10 w-[560px] max-w-[92vw] rounded-xl bg-white p-6 shadow-2xl">
        <button
          aria-label="Close"
          className="absolute top-3 right-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 focus:ring-2 focus:ring-blue-500/80 focus:outline-none"
          onClick={onCloseAction}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
        <ModalContent entry={entry} />
      </div>
    </div>
  );
}
