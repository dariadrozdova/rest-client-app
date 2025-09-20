import { useMemo } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { Row } from "@app/[locale]/(protected)/_components/history-table/history-modal-row";
import { logoSmall } from "@app/[locale]/(public)/images";
import type { HistoryEntry } from "@shared/types";
import { formatBytes } from "@utils/helpers/format-bytes";
import { formatDateTime } from "@utils/helpers/format-datetime";
import { getMethodColor } from "@utils/helpers/get-method-color";
import { getStatusColor } from "@utils/helpers/get-status-color";

export function ModalContent({ entry }: { entry: HistoryEntry }) {
  const locale = useLocale();
  const t = useTranslations("history-table");

  const ts = entry.response.meta?.requestTimestamp ?? entry.createdAt ?? "";
  const formattedDateTime = useMemo(() => {
    return formatDateTime(ts || null, locale);
  }, [ts, locale]);

  const requestSize = entry.response.meta?.requestSizeBytes ?? 0;
  const responseSize = entry.response.meta?.responseSizeBytes ?? 0;
  const durationMs = entry.response.meta?.requestDurationMs ?? null;

  const status = entry.response.status;
  const statusText = entry.response.statusText ?? "";

  return (
    <>
      <div className="mb-5 flex flex-col items-center">
        <div className="mb-3">
          <Image
            alt="Logo"
            className="mx-auto h-10 w-auto"
            height={40}
            src={logoSmall}
            width={40}
          />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {t("modal.title")}
        </h2>
      </div>

      <dl className="divide-y divide-gray-200 rounded-lg bg-white">
        <Row label={t("modal.labels.datetime")}>
          <span className="text-gray-700">{formattedDateTime}</span>
        </Row>

        <Row label={t("modal.labels.endpoint")}>
          <span className="rounded border border-gray-200 bg-gray-50 px-2 py-1 break-all text-gray-700">
            {entry.request.url}
          </span>
        </Row>

        <Row label={t("modal.labels.method")}>
          <span
            className={`font-medium ${getMethodColor(entry.request.method)}`}
          >
            {entry.request.method}
          </span>
        </Row>

        <Row label={t("modal.labels.status")}>
          <span
            className={`font-semibold ${getStatusColor(status)}`}
            title={statusText}
          >
            {status}
          </span>
        </Row>

        <Row label={t("modal.labels.requestSize")}>
          <span className="text-gray-700">{formatBytes(requestSize)}</span>
        </Row>

        <Row label={t("modal.labels.responseSize")}>
          <span className="text-gray-700">{formatBytes(responseSize)}</span>
        </Row>

        <Row label={t("modal.labels.duration")}>
          а
          <span className="text-gray-700">
            {durationMs === null
              ? t("modal.notAvailable")
              : `${durationMs} ${t("modal.units.ms")}`}
          </span>
        </Row>

        {entry.response.error && (
          <Row label={t("modal.labels.error")}>
            <pre className="max-h-40 overflow-auto rounded border border-red-200 bg-red-50 p-2 text-xs whitespace-pre-wrap text-red-700">
              {entry.response.error}
            </pre>
          </Row>
        )}
      </dl>
    </>
  );
}
