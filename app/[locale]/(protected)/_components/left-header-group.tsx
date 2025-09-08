"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { MethodSwitch } from "@app/[locale]/(protected)/_components/method-switch";

import { classNames } from "@/shared/styles";

export function LeftHeaderGroup() {
  const t = useTranslations("protected-header");
  const tr = useTranslations("tabs");

  const tabs = [
    { key: "headers", label: tr("headers") },
    { key: "body", label: tr("body") },
    { key: "variables", label: tr("variables") },
    { key: "codegen", label: tr("codegen") },
    { key: "requestHistory", label: tr("requestHistory") },
  ];

  const [activeTab, setActiveTab] = useState<string>(tabs[0].key);

  return (
    <>
      <div className="col-start-1 row-start-1 px-6 pt-8 text-base">
        <div className="flex h-9 w-full items-center">
          <MethodSwitch />
          <input
            className="bg-bg-secondary border-border-default h-full w-full border border-x-0 px-3 text-sm"
            placeholder="https://api.example.com/path..."
          />
          <button
            className={classNames(
              "bg-accent-blue border-accent-blue h-full w-28 rounded-r-md border",
              "cursor-pointer px-3 py-2 text-sm font-medium text-white hover:brightness-110",
            )}
          >
            {t("protected-header.sendButton")}
          </button>
        </div>
      </div>

      <div className="col-start-1 row-start-2 flex items-end px-6 pb-0 text-sm">
        <div
          aria-orientation="horizontal"
          className="flex flex-wrap gap-8"
          role="tablist"
        >
          {tabs.map(({ key }) => {
            const isActive = activeTab === key;
            return (
              <button
                aria-selected={isActive}
                className={classNames(
                  "text-text-secondary mb-1 font-bold transition-colors focus-visible:outline",
                  "hover:text-text-primary cursor-pointer",
                  isActive &&
                    "decoration-accent-blue cursor-default font-bold underline decoration-2 underline-offset-8",
                )}
                key={key}
                onClick={() => setActiveTab(key)}
                role="tab"
              >
                {t(`tabs.${key}`)}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
