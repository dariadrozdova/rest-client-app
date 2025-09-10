"use client";

import { useTranslations } from "next-intl";

import { BodyEditorButtons } from "@/app/[locale]/(protected)/_components/body-editor/body-editor-buttons";
import { BodyEditorToolbarProps } from "@/app/[locale]/(protected)/_components/body-editor/types";

export function BodyEditorToolbar({
  contentType,
  onContentTypeChange,
  showJsonControls,
  onPrettifyJson,
  onClearBody,
}: BodyEditorToolbarProps) {
  const t = useTranslations("body-editor");

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          {t("contentType")}
        </span>
        <select
          className="rounded border border-gray-300 bg-white px-2 py-1 text-sm"
          onChange={(event) => onContentTypeChange(event.target.value)}
          value={contentType}
        >
          <option value="application/json">application/json</option>
          <option value="text/plain">text/plain</option>
        </select>
      </div>

      <BodyEditorButtons
        onClearBody={onClearBody}
        onPrettifyJson={onPrettifyJson}
        showJsonControls={showJsonControls}
      />
    </div>
  );
}
