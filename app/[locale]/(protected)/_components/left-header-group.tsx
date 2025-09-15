"use client";

import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { MethodSwitch } from "@app/[locale]/(protected)/_components/method-switch";
import { TabOpenState } from "@shared/types";
import { executeRequest } from "@store/slices/request-slice";
import { setActiveTab } from "@store/slices/tab-open-slice";
import { setUrl } from "@store/slices/url-slice";
import { AppDispatch, RootState } from "@store/store";

import { classNames } from "@/shared/styles";
import { selectIsLoading } from "@/store/selectors/request-selector";
import { selectResolvedRequest } from "@/utils/helpers/resolve-request";

type TabKey = TabOpenState["activeTab"];

export function LeftHeaderGroup() {
  const t = useTranslations("protected-header");
  const dispatch = useDispatch<AppDispatch>();

  const activeTab = useSelector((state: RootState) => state.tabs.activeTab);
  const httpURL = useSelector((state: RootState) => state.httpUrl.httpUrl);

  const isLoading = useSelector(selectIsLoading);
  const resolvedOutput = useSelector(selectResolvedRequest);

  const canSendRequest = resolvedOutput.canGenerate && httpURL.trim() !== "";

  const tabs = [
    { key: "headers", label: t("tabs.headers") },
    { key: "body", label: t("tabs.body") },
    { key: "variables", label: t("tabs.variables") },
    { key: "codegen", label: t("tabs.codegen") },
    { key: "requestHistory", label: t("tabs.requestHistory") },
  ] as const satisfies readonly { key: TabKey; label: string }[];

  const handleSendRequest = () => {
    if (canSendRequest && !isLoading) {
      dispatch(executeRequest(resolvedOutput));
    }
  };

  return (
    <>
      <div className="col-start-1 row-start-1 px-6 pt-8 text-base">
        <div className="flex h-9 w-full items-center">
          <MethodSwitch />
          <div className="flex h-full w-full text-sm">
            <label
              className={classNames(
                "bg-bg-secondary border-border-default text-text-secondary",
                "flex items-center border border-x-0 pl-3",
              )}
              htmlFor="url-input"
            >
              https://
            </label>
            <input
              className="bg-bg-secondary border-border-default h-full w-full border border-l-0 pl-px focus:outline-none"
              id="url-input"
              onChange={(event) =>
                dispatch(setUrl("https://" + event.target.value))
              }
              placeholder="api.example.com/path..."
              value={httpURL.replace(/^https?:\/\//i, "")}
            />
          </div>
          <button
            className={classNames(
              "bg-accent-blue border-accent-blue h-full w-28 rounded-r-md border",
              "px-3 py-2 text-sm font-medium text-white",
              canSendRequest && !isLoading
                ? "cursor-pointer hover:brightness-110"
                : "cursor-not-allowed opacity-50",
            )}
            disabled={!canSendRequest || isLoading}
            onClick={handleSendRequest}
          >
            {isLoading ? t("loading") : t("sendButton")}
          </button>
        </div>
      </div>

      <div className="col-start-1 row-start-2 flex items-end px-6 pb-0 text-sm">
        <div
          aria-orientation="horizontal"
          className="flex flex-wrap gap-8"
          role="tablist"
        >
          {tabs.map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <button
                aria-selected={isActive}
                className={classNames(
                  "text-text-secondary mb-1 font-bold transition-colors focus-visible:outline",
                  "hover:text-text-primary cursor-pointer",
                  isActive &&
                    "decoration-accent-blue font-bold underline decoration-2 underline-offset-8",
                )}
                key={key}
                onClick={() => dispatch(setActiveTab(key))}
                role="tab"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
