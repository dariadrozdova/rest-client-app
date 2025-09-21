"use client";

import { useTranslations } from "next-intl";

import { ErrorTemplate } from "@/shared/ui";

export default function GlobalError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations("error-page");

  return (
    <ErrorTemplate
      code="500"
      description={t("global-error-description")}
      extra={
        <button
          className="cursor-pointer rounded-md bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none"
          onClick={() => reset()}
        >
          {t("try-again")}
        </button>
      }
      title={t("global-error-title")}
    />
  );
}
