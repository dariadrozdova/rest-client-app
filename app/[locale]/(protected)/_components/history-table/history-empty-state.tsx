"use client";

import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";

import classNames from "classnames";

import { setActiveTab } from "@/store/slices/tab-open-slice";
import type { AppDispatch } from "@/store/store";

export function HistoryEmptyState() {
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("history-table");

  return (
    <div className="rounded-xl p-6 text-sm">
      <p className="mb-3">{t("empty.message")}</p>
      <button
        className={classNames(
          "rounded-md border px-3 py-2 text-sm font-medium text-white",
          "bg-accent-blue border-accent-blue cursor-pointer hover:brightness-110",
        )}
        onClick={() => dispatch(setActiveTab("headers"))}
        type="button"
      >
        {t("empty.goToHeaders")}
      </button>
    </div>
  );
}
