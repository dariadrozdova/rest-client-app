"use client";

import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { RootState } from "@store/store";

import { JsonViewer } from "@/shared/ui/json-viewer";

export function ResponsePanel() {
  const t = useTranslations("response-panel");
  const { isLoading, error, response } = useSelector(
    (state: RootState) => state.request,
  );

  const getDisplayContent = (): string => {
    if (isLoading) {
      return t("loading");
    }
    if (error) {
      return t("error", { message: error });
    }

    if (response) {
      const fullResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: response.body ? JSON.parse(response.body) : null,
        meta: response.meta,
      };
      return JSON.stringify(fullResponse, null, 2);
    }

    return t("noRequest");
  };

  return (
    <div className="col-start-3 max-h-[calc(100vh-12rem)] overflow-auto">
      {error && (
        <div className="border-b border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {t("requestFailed")}: {error}
        </div>
      )}
      <JsonViewer
        className="h-full"
        content={getDisplayContent()}
        readOnly
        showLineNumbers
      />
    </div>
  );
}
