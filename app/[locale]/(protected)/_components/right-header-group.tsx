"use client";

import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { RootState } from "@/store/store";
import { getStatusColor } from "@/utils/helpers/get-status-color";

export function RightHeaderGroup() {
  const t = useTranslations("protected-header");
  const { response, error, isLoading } = useSelector(
    (state: RootState) => state.request,
  );

  const bytesText =
    response &&
    response.meta &&
    typeof response.meta.responseSizeBytes === "number"
      ? t("size", { bytes: response.meta.responseSizeBytes })
      : t("size", { bytes: "-" });

  const timeText =
    response &&
    response.meta &&
    typeof response.meta.requestDurationMs === "number"
      ? t("time", { ms: response.meta.requestDurationMs })
      : t("time", { ms: "-" });

  return (
    <>
      <div className="text-text-secondary flex min-h-full items-center justify-evenly gap-4 px-6 pt-8 text-lg font-bold">
        <span className="px-2 py-1">
          {response ? (
            <span className={getStatusColor(response.status)}>
              {response.status} {response.statusText}
            </span>
          ) : error ? (
            t("status")
          ) : isLoading ? (
            t("loading")
          ) : (
            t("status")
          )}
        </span>

        <span className="px-2 py-1">{bytesText}</span>
        <span className="px-2 py-1">{timeText}</span>
      </div>

      <div className="col-start-3 row-start-2 flex items-end px-6">
        <span className="text-text-secondary decoration-accent-blue mb-1 text-sm font-bold underline decoration-2 underline-offset-8">
          {t("response")}
        </span>
      </div>
    </>
  );
}
