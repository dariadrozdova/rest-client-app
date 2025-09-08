"use client";

import { useState } from "react";

import { MethodSwitch } from "@app/[locale]/(protected)/_components/method-switch";

import { TABS } from "@/shared/globals";
import { classNames } from "@/shared/styles";

export default function LeftHeaderGroup() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);

  return (
    <>
      <div className="col-start-1 row-start-1 px-6 pt-8 text-base">
        <div className="flex h-9 w-full items-center">
          <MethodSwitch />
          <input
            className="bg-bg-secondary border-border-default h-full w-full border border-x-0 px-3 text-sm"
            placeholder="https://api.example.com/path..."
          />
          <button className="bg-accent-blue border-accent-blue h-full w-28 rounded-r-md border px-3 py-2 text-sm font-medium text-white">
            Send
          </button>
        </div>
      </div>
      <div className="col-start-1 row-start-2 flex items-end px-6 pb-0 text-sm">
        <div
          aria-orientation="horizontal"
          className="flex flex-wrap gap-8"
          role="tablist"
        >
          {TABS.map((tabOption) => {
            const isActive = activeTab === tabOption;
            return (
              <button
                aria-selected={isActive}
                className={classNames(
                  "text-text-secondary mb-1 font-bold transition-colors focus-visible:outline",
                  isActive
                    ? "decoration-accent-blue font-bold underline decoration-2 underline-offset-8"
                    : "",
                )}
                key={tabOption}
                onClick={() => setActiveTab(tabOption)}
                role="tab"
              >
                {tabOption}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
