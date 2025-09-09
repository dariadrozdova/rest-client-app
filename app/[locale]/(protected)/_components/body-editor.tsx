"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { RootState } from "@store/store";

import { useRequest } from "@/app/[locale]/(protected)/main/_modules/request-context";

const isJsonLike = (text: string): boolean => {
  const trimmed = text.trim();
  return (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  );
};

export function BodyEditor() {
  const t = useTranslations("body-editor");
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab);
  const isBodyOpen = activeTab === "body";
  const { body, setBody } = useRequest();
  const [jsonError, setJsonError] = useState<string>("");

  if (!isBodyOpen) {
    return null;
  }

  const prettifyJson = () => {
    if (!body.trim()) {
      return;
    }

    try {
      const parsed = JSON.parse(body);
      const prettified = JSON.stringify(parsed, null, 2);
      setBody(prettified);
      setJsonError("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      setJsonError(message);
    }
  };

  const handleBodyChange = (value: string) => {
    setBody(value);
    if (jsonError) {
      setJsonError("");
    }
  };

  const showPrettifyButton = isJsonLike(body);

  return (
    <div className="space-y-3 p-6">
      <div className="flex items-center justify-between">
        {showPrettifyButton && (
          <button
            className="hover:bg-bg-secondary text-text-primary rounded px-3 py-1 text-sm transition-colors"
            onClick={prettifyJson}
            type="button"
          >
            {t("prettifyButton")}
          </button>
        )}
      </div>

      {jsonError && (
        <div className="rounded bg-red-50 p-2 text-sm text-red-500">
          {t("jsonError")}: {jsonError}
        </div>
      )}

      <div className="space-y-2">
        <textarea
          className="border-border-default hover:border-text-primary focus:border-text-primary min-h-32 w-full resize-y rounded border p-3 text-sm focus:outline-none"
          onChange={(event) => handleBodyChange(event.target.value)}
          placeholder={t("placeholder")}
          value={body}
        />

        <div className="text-text-secondary text-xs">
          {t("charactersCount", { count: body.length })}
          {showPrettifyButton && ` • ${t("jsonDetected")}`}
        </div>
      </div>
    </div>
  );
}
