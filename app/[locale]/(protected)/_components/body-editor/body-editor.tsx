"use client";

import { useTranslations } from "next-intl";

import { useBodyEditor } from "@utils/hooks";

import { BodyEditorToolbar } from "@/app/[locale]/(protected)/_components/body-editor/body-editor-toolbar";
import { isJsonLike } from "@/app/[locale]/(protected)/_components/body-editor/utils";
import { JsonViewer } from "@/shared/ui/json-viewer";

export function BodyEditor() {
  const t = useTranslations("body-editor");

  const {
    body,
    jsonError,
    contentType,
    setContentType,
    prettifyJson,
    clearBody,
    handleBodyChange,
  } = useBodyEditor();

  const isJsonMode = contentType === "application/json";
  const jsonValid = isJsonMode ? isJsonLike(body) : false;

  return (
    <div className="space-y-4 p-6">
      <BodyEditorToolbar
        contentType={contentType}
        onClearBody={clearBody}
        onContentTypeChange={setContentType}
        onPrettifyJson={prettifyJson}
        showJsonControls={jsonValid}
      />

      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">
          {t("jsonContent")}
        </div>

        {jsonError && isJsonMode && (
          <div className="rounded bg-red-50 p-2 text-sm text-red-500">
            {t("jsonError")}: {jsonError}
          </div>
        )}

        <JsonViewer
          compactLineNumbers
          content={body}
          onChange={handleBodyChange}
          placeholder={t("placeholder")}
          readOnly={false}
          showLineNumbers={isJsonMode}
        />

        <div className="text-xs text-gray-500">
          {t("charactersCount", { count: body.length })}
          {jsonValid && ` • ${t("jsonDetected")}`}
        </div>
      </div>
    </div>
  );
}
