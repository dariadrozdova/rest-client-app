"use client";

import { useTranslations } from "next-intl";

import { BodyEditorToolbar } from "@/app/[locale]/(protected)/_components/body-editor/body-editor-toolbar";
import { useBodyEditor } from "@/app/[locale]/(protected)/_components/body-editor/use-body-editor";
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

  const showJsonControls = isJsonLike(body);
  const isJsonMode = contentType === "application/json";

  return (
    <div className="space-y-4 p-6">
      <BodyEditorToolbar
        contentType={contentType}
        onClearBody={clearBody}
        onContentTypeChange={setContentType}
        onPrettifyJson={prettifyJson}
        showJsonControls={showJsonControls}
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
          content={body}
          mode={isJsonMode ? "json" : "text"}
          onChange={handleBodyChange}
          placeholder={t("placeholder")}
          readOnly={false}
          showLineNumbers={isJsonMode}
        />

        <div className="text-xs text-gray-500">
          {t("charactersCount", { count: body.length })}
          {isJsonMode && showJsonControls && ` • ${t("jsonDetected")}`}
        </div>
      </div>
    </div>
  );
}
