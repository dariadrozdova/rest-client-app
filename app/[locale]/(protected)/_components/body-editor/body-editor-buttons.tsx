"use client";

import { useTranslations } from "next-intl";

import { Trash2, Wand2 } from "lucide-react";

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
        className="cursor-pointer rounded p-1 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!showJsonControls}
        onClick={onPrettifyJson}
        title={t("prettifyButton")}
        type="button"
      >
        <Wand2 className="h-4 w-4" />
      </button>

      <button
        className="cursor-pointer rounded p-1 transition-colors hover:bg-gray-100"
        onClick={onClearBody}
        title={t("clearContent")}
        type="button"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
