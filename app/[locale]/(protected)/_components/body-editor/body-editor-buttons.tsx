"use client";

import { useTranslations } from "next-intl";

interface BodyEditorButtonsProps {
  onClearBody: () => void;
  onPrettifyJson: () => void;
  showJsonControls: boolean;
}

export function BodyEditorButtons({
  showJsonControls,
  onPrettifyJson,
  onClearBody,
}: BodyEditorButtonsProps) {
  const t = useTranslations("body-editor");

  return (
    <div className="flex items-center gap-2">
      <button
        className={`rounded p-1 transition-colors ${
          showJsonControls
            ? "cursor-pointer hover:bg-gray-100"
            : "cursor-not-allowed text-gray-400"
        }`}
        disabled={!showJsonControls}
        onClick={showJsonControls ? onPrettifyJson : undefined}
        title={t("prettifyButton")}
        type="button"
      >
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </button>

      <button
        className="cursor-pointer rounded p-1 transition-colors hover:bg-gray-100"
        onClick={onClearBody}
        title={t("clearContent")}
        type="button"
      >
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
