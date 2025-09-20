"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";

import { CodeLangSwitch } from "@app/[locale]/(protected)/_components/codegen/code-lang-switch";
import { CopyButton } from "@app/[locale]/(protected)/_components/codegen/copy-button";
import { JsonViewer } from "@shared/ui/json-viewer";
import { requestToGenerateCode } from "@utils/helpers";

import { ISSUE_I18N_KEY } from "@/shared/globals";
import type { RootState } from "@/store/store";
import { selectResolvedRequest } from "@/utils/helpers/resolve-request"; // reselect selector

export function CodegenPanel() {
  const t = useTranslations("code-gen");
  const activeTab = useSelector((s: RootState) => s.tabs.activeTab);
  const isOpen = activeTab === "codegen";
  const selected = useSelector((s: RootState) => s.codeLang.selectedCodeLang);
  const resolvedOutput = useSelector(selectResolvedRequest);
  const [snippet, setSnippet] = useState("");
  const canGenerate = resolvedOutput.canGenerate && !!resolvedOutput.resolved;
  const issues = resolvedOutput.issues;
  const request = resolvedOutput.resolved;

  useEffect(() => {
    if (!isOpen || !canGenerate || !request) {
      return;
    }

    try {
      const code = requestToGenerateCode(request, selected);
      setSnippet(code);
    } catch (error) {
      setSnippet(error instanceof Error ? error.message : String(error));
    }
  }, [isOpen, canGenerate, request, selected]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="col-span-full row-start-3 flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <CodeLangSwitch />
        {!canGenerate && (
          <div className="text-accent-red text-sm">
            {t("codeGenErrors.unable")}{" "}
            {issues
              .map((issue) => t(`codeGenErrors.${ISSUE_I18N_KEY[issue.type]}`))
              .join(", ")}
          </div>
        )}
        <CopyButton text={snippet} />
      </div>

      <JsonViewer
        className="text-text-secondary h-[420px]"
        content={snippet || t("hints")}
        mode="json"
        readOnly
        showLineNumbers
      />
    </div>
  );
}
