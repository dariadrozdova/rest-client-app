"use client";

import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { RootState } from "@store/store";

import { JsonViewer } from "@/shared/ui/json-viewer";
import { getStatusColor } from "@/utils/helpers/get-status-color";

export function ResponsePane() {
  const t = useTranslations("response-panel");
  const requestState = useSelector((state: RootState) => state.request);
  const { isLoading, error, response } = requestState;

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
      {response && (
        <div className="border-border-default bg-bg-secondary border-b p-3 text-sm">
          <div className="flex items-center gap-4">
            <span className={`font-bold ${getStatusColor(response.status)}`}>
              {response.status} {response.statusText}
            </span>
            <span className="text-text-secondary">
              {t("duration", { ms: response.meta.requestDurationMs })}
            </span>
            <span className="text-text-secondary">
              {t("size", { bytes: response.meta.responseSizeBytes })}
            </span>
          </div>
        </div>
      )}

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
